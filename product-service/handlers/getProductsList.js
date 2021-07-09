const createError = require("http-errors");
const commonMiddleware = require("../utils/middleware").default;
const { getAllProducts } = require("../services/products");
const { defaultHeaders } = require("../utils/api");

async function getProducts() {
  try {
    return {
      statusCode: 200,
      headers: {
        ...defaultHeaders,
      },
      body: JSON.stringify(getAllProducts()),
    };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

module.exports.handler = commonMiddleware(getProducts);
