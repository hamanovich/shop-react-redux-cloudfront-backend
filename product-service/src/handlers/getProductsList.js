import createError from 'http-errors';
import commonMiddleware from '../utils/middleware';
import { getProducts } from '../services/products';
import { successResponse } from '../utils/api';

async function getProductsList() {
  try {
    return successResponse(getProducts());
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export default commonMiddleware(getProductsList);
