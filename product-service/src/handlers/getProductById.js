import 'source-map-support/register';
import createError from 'http-errors';
import commonMiddleware from '../utils/middleware';
import { getProductById } from '../services/products';
import { successResponse, errorResponse } from '../utils/api';

async function getProduct(event) {
  try {
    const { productId = '' } = event.pathParameters;
    const product = getProductById(productId);

    if (product) {
      return successResponse(product);
    }

    return errorResponse(`Product with ID "${productId}" not found`, 404);
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export default commonMiddleware(getProduct);
