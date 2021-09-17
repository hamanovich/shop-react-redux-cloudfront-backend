import 'source-map-support/register';
import csv from 'csv-parser';
import * as AWS from 'aws-sdk';
import logger from '../libs/logger';
import commonMiddleware from '../utils/middleware';
import { errorResponse } from '../utils/api';

const { IMPORT_BUCKET_NAME, IMPORT_CATALOG_NAME, PARSED_CATALOG_NAME } = process.env;

const importFileParser = async (event) => {
  const s3 = new AWS.S3({ signatureVersion: 'v4' });
  const sqs = new AWS.SQS();
  const FILE_NAME = event.Records[0].s3.object.key;

  const params = {
    Bucket: IMPORT_BUCKET_NAME,
    Key: FILE_NAME,
  };

  const moveAndDeleteFile = async () => {
    await s3
      .copyObject({
        Bucket: IMPORT_BUCKET_NAME,
        CopySource: encodeURI(`${IMPORT_BUCKET_NAME}/${FILE_NAME}`),
        Key: FILE_NAME.replace(IMPORT_CATALOG_NAME, PARSED_CATALOG_NAME),
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: IMPORT_BUCKET_NAME,
        Key: FILE_NAME,
      })
      .promise();
  };

  try {
    return new Promise(() => {
      s3.getObject(params)
        .createReadStream()
        .pipe(csv())
        .on('data', (product) => {
          sqs.sendMessage(
            {
              QueueUrl: process.env.CREATE_PRODUCT_SQS_URL,
              MessageBody: JSON.stringify(product),
            },
            (err, data) => {
              if (err) {
                logger.error(`Sending error: ${JSON.stringify(err)}`);
              } else {
                logger.info(`New product is sent to the queue: ${JSON.stringify(data)}`);
              }
            },
          );
        })
        .on('end', moveAndDeleteFile);
    });
  } catch (error) {
    return errorResponse(error.message);
  }
};

export default commonMiddleware(importFileParser);
