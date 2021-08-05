import { Client } from 'pg';
import createError from 'http-errors';
import { successResponse, errorResponse } from '../utils/api';
import DB_CONFIG from '../db/config';
import commonMiddleware from '../utils/middleware';
import { validateBody } from '../utils/validation';

async function addProduct(event) {
  if (event.body) {
    const client = new Client(DB_CONFIG);
    let body;

    try {
      body = JSON.parse(event.body);
      validateBody(body);
    } catch (error) {
      throw new createError.InternalServerError(error);
    }

    try {
      await client.connect();

      const { title, price, description, count, src } = body;

      await client.query('BEGIN');

      const productInsertionResponse = await client.query(
        `insert into products(title, price, description, src) VALUES($1, $2, $3, $4) RETURNING *`,
        [title, price, description, src],
      );
      const product = productInsertionResponse.rows[0];

      const stockInsertionResponse = await client.query(
        `insert into stocks(product_id, count) VALUES($1, $2) RETURNING *`,
        [product.id, count],
      );
      await client.query('COMMIT');
      product.count = stockInsertionResponse.rows[0].count;

      return successResponse(product);
    } catch (error) {
      await client.query('ROLLBACK');

      if (e.code && Number(e.code) === 23505 && e.constraint && e.constraint == 'products_title_key') {
        return errorResponse('product with given title already exists', 422);
      }

      throw new createError.InternalServerError(error);
    } finally {
      client.end();
    }
  } else {
    return errorResponse(`Validation error response`, 400);
  }
}

export default commonMiddleware(addProduct);
