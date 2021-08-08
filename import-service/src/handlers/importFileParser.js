import csv from 'csv-parser';
import * as AWS from 'aws-sdk';
import commonMiddleware from '../utils/middleware';
import { errorResponse } from '../utils/api';

const { IMPORT_BUCKET_NAME, IMPORT_CATALOG_NAME, PARSED_CATALOG_NAME } = process.env;

const importFileParser = async (event) => {
  const s3 = new AWS.S3({ signatureVersion: 'v4' });

  const params = {
    Bucket: IMPORT_BUCKET_NAME,
    Key: event.Records[0].s3.object.key,
  };

  const moveAndDeleteFile = async () => {
    await s3
      .copyObject({
        Bucket: IMPORT_BUCKET_NAME,
        CopySource: encodeURI(`${IMPORT_BUCKET_NAME}/${event.Records[0].s3.object.key}`),
        Key: event.Records[0].s3.object.key.replace(IMPORT_CATALOG_NAME, PARSED_CATALOG_NAME),
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: IMPORT_BUCKET_NAME,
        Key: event.Records[0].s3.object.key,
      })
      .promise();
  };

  try {
    return new Promise((_, reject) => {
      s3.getObject(params)
        .createReadStream()
        .pipe(csv())
        .on('data', (data) => console.log('Data parsed: ', data))
        .on('end', moveAndDeleteFile);
    });
  } catch (error) {
    return errorResponse(error.message);
  }
};

export default commonMiddleware(importFileParser);
