import 'source-map-support/register';
import createError from 'http-errors';
import logger from '../libs/logger';
import { successResponse, errorResponse } from '../utils/api';
import commonMiddleware from '../utils/middleware';
import { getProductFromDB } from '../db/products';

async function getProduct(event) {
  try {
    const products = await getProductFromDB(event);

    if (!products[0]) {
      return errorResponse(`Product with ID "${productId}" not found`, 404);
    }
    return successResponse(products[0]);
  } catch (error) {
    if (error.code && error.code === '22P02') {
      logger.error('id should be uuid format');
    }

    throw new createError.InternalServerError(error);
  }
}

export default commonMiddleware(getProduct);
