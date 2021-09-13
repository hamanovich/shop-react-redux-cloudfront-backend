import createError from 'http-errors';
import { successResponse, errorResponse } from '../utils/api';
import { createProduct } from '../db/products';
import commonMiddleware from '../utils/middleware';
import { validateBody } from '../utils/validation';

async function addProduct({ body }) {
  if (body) {
    try {
      if (typeof body === 'string') {
        body = JSON.parse(body);
      }
      validateBody(body);
    } catch (error) {
      throw new createError.InternalServerError(error);
    }

    const newProduct = await createProduct(body);
    return successResponse(newProduct);
  } else {
    return errorResponse(`Validation error response`, 400);
  }
}

export default commonMiddleware(addProduct);
