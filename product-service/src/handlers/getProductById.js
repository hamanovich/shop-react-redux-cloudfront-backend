import createError from 'http-errors';
import commonMiddleware from '../utils/middleware';
import { getProductById } from '../services/products';
import { successResponse } from '../utils/api';

async function getProduct(event) {
  try {
    const { productId = '' } = event.pathParameters;
    const product = getProductById(productId);

    if (product) {
      return successResponse(product);
    }

    throw new createError.NotFound(`Product with ID "${productId}" not found`);
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export default commonMiddleware(getProduct);
