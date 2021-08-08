export const defaultHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export const logRequest = ({ httpMethod, resource, queryStringParameters, pathParameters, body }) =>
  console.log(
    httpMethod,
    resource,
    JSON.stringify({
      queryStringParameters,
      pathParameters,
      body,
    }),
  );

export const errorResponse = (body, code = 500, headers) => ({
  statusCode: code,
  headers: {
    ...defaultHeaders,
    ...headers,
  },
  body: JSON.stringify(body),
});

export const successResponse = (body, code = 200, headers) => ({
  statusCode: code,
  headers: {
    ...defaultHeaders,
    ...headers,
  },
  body: JSON.stringify(body),
});
