import { Client } from 'pg';
import { successResponse, errorResponse } from '../utils/api';
import DB_CONFIG from '../db/config';
import commonMiddleware from '../utils/middleware';

async function getProduct(event) {
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log('getProduct handler input:', event);
    const { productId = '' } = event.pathParameters;
    const { rows: products } = await client.query(
      `select products.id, products.title, products.price, products.description, products.src, stocks.count from products left join stocks on products.id = stocks.product_id where products.id='${productId}';`,
    );
    if (!products[0]) {
      return errorResponse(`Product with ID "${productId}" not found`, 404);
    }
    return successResponse(products[0]);
  } catch (error) {
    if (e.code && e.code === '22P02') {
      console.error('id should be uuid format');
    }

    throw new createError.InternalServerError(error);
  } finally {
    client.end();
  }
}

export default commonMiddleware(getProduct);
