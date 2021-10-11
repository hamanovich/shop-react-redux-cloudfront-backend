import 'source-map-support/register';
import createError from 'http-errors';
import dotenv from 'dotenv';
import { SNS } from 'aws-sdk';
import logger from '../libs/logger';
import commonMiddleware from '../utils/middleware';
import { successResponse, errorResponse } from '../utils/api';
import { createProducts } from '../db/products';

dotenv.config();

export async function catalogBatchProcess(event) {
  const sns = new SNS();

  try {
    const products = event.Records.map((r) => JSON.parse(r.body));
    const newProducts = await createProducts(products);
    logger.info(`created products`, newProducts);

    await Promise.all(
      newProducts.map((p) =>
        sns
          .publish({
            Subject: `New product ${p.title}`,
            Message: `Product ${p.title} with price ${p.price} added to database`,
            TopicArn: process.env.SNS_ARN,
            MessageAttributes: {
              isExpensive: {
                DataType: 'String',
                StringValue: `${p.price > 100}`,
              },
            },
          })
          .promise(),
      ),
    );
    logger.info('Email has been sent');

    return successResponse({ message: 'Ok' });
  } catch (error) {
    errorResponse(error.message);
    throw new createError.InternalServerError(error);
  }
}

export default commonMiddleware(catalogBatchProcess);
