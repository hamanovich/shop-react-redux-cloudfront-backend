const { getProductById } = require("../services/products");
const { defaultHeaders } = require("../utils/api");

module.exports.handler = async (event, _context) => {
  try {
    console.log("Get Product By Id", event.pathParameters, event);
    const { productId = "" } = event.pathParameters;
    const product = getProductById(productId);

    console.log("Product", product);

    if (product) {
      return {
        statusCode: 200,
        headers: {
          ...defaultHeaders,
        },
        body: JSON.stringify(product),
      };
    }
    return {
      statusCode: 404,
      headers: {
        ...defaultHeaders,
      },
      body: JSON.stringify("No product found!"),
    };
  } catch (err) {
    console.error("Error", err);
    return {
      statueCode: 500,
      headers: {
        ...defaultHeaders,
      },
      body: JSON.stringify("Something went wrong!"),
    };
  }
};
