import createError from 'http-errors';
import { createClient } from './config';
import { errorResponse } from '../utils/api';

export const getProductFromDB = async () => {
  const dbClient = createClient();
  await dbClient.connect();

  try {
    const { productId = '' } = event.pathParameters;
    const { rows: products } = await dbClient.query(
      `select products.id, products.title, products.price, products.description, products.src, stocks.count from products left join stocks on products.id = stocks.product_id where products.id='${productId}';`,
    );

    return products;
  } catch (error) {
    throw new createError.InternalServerError(error);
  } finally {
    dbClient.end();
  }
};

export const getProductsFromDB = async () => {
  const dbClient = createClient();
  await dbClient.connect();

  try {
    const { rows: products } = await dbClient.query(
      `select products.id, products.title, products.price, products.description, products.src, stocks.count from products left join stocks on products.id = stocks.product_id;`,
    );

    return products;
  } catch (error) {
    throw new createError.InternalServerError(error);
  } finally {
    dbClient.end();
  }
};

export const createProduct = async ({ title, price, description, count, src }) => {
  const dbClient = createClient();
  await dbClient.connect();

  try {
    await dbClient.query('BEGIN');
    const productInsertionResponse = await dbClient.query(
      `insert into products(title, price, description, src) VALUES($1, $2, $3, $4) RETURNING *`,
      [title, price, description, src],
    );
    const product = productInsertionResponse.rows[0];

    const stockInsertionResponse = await dbClient.query(
      `insert into stocks(product_id, count) VALUES($1, $2) RETURNING *`,
      [product.id, count],
    );
    await dbClient.query('COMMIT');

    product.count = stockInsertionResponse.rows[0].count;

    return product;
  } catch (error) {
    await dbClient.query('ROLLBACK');
    if (error.code && Number(error.code) === 23505 && error.constraint && error.constraint == 'products_title_key') {
      return errorResponse('product with given title already exists', 422);
    }

    throw new createError.InternalServerError(error);
  } finally {
    await dbClient.end();
  }
};

export const createProducts = async (products) => {
  const dbClient = createClient();
  await dbClient.connect();

  console.log('CREATE PRODUCTS', products);

  try {
    const productValues = products
      .map((p) => `('${p.id}', '${p.title}', '${p.price}', '${p.description}', '${p.src}')`)
      .join(', ');
    const stocksValues = products.map((p) => `('${p.id}', '${p.count}')`).join(', ');
    await dbClient.query('BEGIN');
    await dbClient.query(`
        insert into products(id, title, price, description, src) values ${productValues}`);
    await dbClient.query(`
        insert into stocks(product_id, count) values ${stocksValues}`);
    await dbClient.query('COMMIT');
    const selectProducts = await dbClient.query(
      `select p.id as id, p.title as title, p.price as price, p.description as description, p.src as src, s.count as count
            from products p left join stocks s on p.id = s.product_id
            where p.id in (${products.map(({ id }) => `'${id}'`).join(', ')});`,
    );
    const { rows } = selectProducts;
    return rows;
  } catch (error) {
    await dbClient.query('ROLLBACK');
    throw new createError.InternalServerError(error);
  } finally {
    await dbClient.end();
  }
};
