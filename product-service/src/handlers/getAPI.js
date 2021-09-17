import 'source-map-support/register';
import createError from 'http-errors';
import commonMiddleware from '../utils/middleware';
import { successResponse } from '../utils/api';
import openApi from '../openapi.yml';

async function getAPI() {
  try {
    return successResponse(openApi);
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export default commonMiddleware(getAPI);
