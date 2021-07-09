const createError = require("http-errors");
const commonMiddleware = require("../utils/middleware").default;
const { getProductById } = require("../services/products");
const { defaultHeaders } = require("../utils/api");

async function getProduct(event) {
  try {
    const { productId = "" } = event.pathParameters;
    const product = getProductById(productId);

    if (product) {
      return {
        statusCode: 200,
        headers: {
          ...defaultHeaders,
        },
        body: JSON.stringify(product),
      };
    }

    throw new createError.NotFound(`Product with ID "${productId}" not found`);
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

module.exports.handler = commonMiddleware(getProduct);
