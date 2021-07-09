const { getAllProducts } = require("../services/products");
const { defaultHeaders } = require("../utils/api");

module.exports.handler = async () => {
  return {
    statusCode: 200,
    headers: {
      ...defaultHeaders,
    },
    body: JSON.stringify(getAllProducts()),
  };
};
