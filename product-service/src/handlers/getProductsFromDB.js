import { Client } from 'pg';
import createError from 'http-errors';
import { successResponse, errorResponse } from '../utils/api';
import DB_CONFIG from '../db/config';
import commonMiddleware from '../utils/middleware';

async function getProducts(event) {
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log('getProducts handler input:', event);

    const { rows: products } = await client.query(
      `select products.id, products.title, products.price, products.description, products.src, stocks.count from products left join stocks on products.id = stocks.product_id;`,
    );

    if (!products[0]) {
      return errorResponse(`No products found`, 404);
    }

    return successResponse(products);
  } catch (error) {
    throw new createError.InternalServerError(error);
  } finally {
    client.end();
  }
}

export default commonMiddleware(getProducts);
