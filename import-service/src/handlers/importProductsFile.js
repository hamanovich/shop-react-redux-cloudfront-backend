import * as AWS from 'aws-sdk';
import dotenv from 'dotenv';
import commonMiddleware from '../utils/middleware';
import { successResponse, errorResponse } from '../utils/api';

dotenv.config();

const { IMPORT_BUCKET_NAME, IMPORT_CATALOG_NAME } = process.env;

const importProductsFile = async (event) => {
  try {
    const s3 = new AWS.S3({ signatureVersion: 'v4' });
    const params = {
      Bucket: IMPORT_BUCKET_NAME,
      Key: `${IMPORT_CATALOG_NAME}/${event.queryStringParameters.name}`,
      ContentType: 'text/csv',
    };
    const s3PutObjectUrl = await s3.getSignedUrlPromise('putObject', params);
    return successResponse(s3PutObjectUrl);
  } catch (error) {
    return errorResponse(error.message);
  }
};

export default commonMiddleware(importProductsFile);
