export const defaultHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
};

export const successResponse = (body, code = 200, headers) => ({
  statusCode: code,
  headers: {
    ...defaultHeaders,
    ...headers,
  },
  body: JSON.stringify(body),
});
