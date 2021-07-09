import createError from "http-errors";
import commonMiddleware from "../utils/middleware";
import { getProducts } from "../services/products";
import { defaultHeaders } from "../utils/api";

async function getAllProducts() {
  try {
    return {
      statusCode: 200,
      headers: {
        ...defaultHeaders,
      },
      body: JSON.stringify(getProducts()),
    };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export default commonMiddleware(getAllProducts);
