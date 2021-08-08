import * as AWS from 'aws-sdk-mock';
import importProductsFile from './importProductsFile';

beforeAll(() => {
  AWS.mock('S3', 'getSignedUrlPromise', (_, __, callback) => {
    callback(null, null);
  });
});

afterAll(() => {
  AWS.restore('S3');
});

describe('Import products file', () => {
  test('should return 200', async () => {
    const event = {
      queryStringParameters: { name: 'mock_data' },
    };

    const response = await importProductsFile(event);

    expect(response.statusCode).toBe(200);
  });

  test('should return 500 when the file name is not provided', async () => {
    const response = await importProductsFile({});

    expect(response.statusCode).toBe(500);
  });
});
