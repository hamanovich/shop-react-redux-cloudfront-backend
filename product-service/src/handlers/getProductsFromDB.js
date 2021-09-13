import createError from 'http-errors';
import { successResponse, errorResponse } from '../utils/api';
import commonMiddleware from '../utils/middleware';
import { getProductsFromDB } from '../db/products';

async function getProducts() {
  try {
    const products = await getProductsFromDB();

    if (!products[0]) {
      return errorResponse(`No products found`, 404);
    }

    return successResponse(products);
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export default commonMiddleware(getProducts);
