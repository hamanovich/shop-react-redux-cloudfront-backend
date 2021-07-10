import getProductById from './getProductByID';

describe('Get one Dog', () => {
  let mockEvent = {
    pathParameters: {
      productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    },
  };
  test('Get "Affenpinscher" breed', async () => {
    const response = await getProductById(mockEvent);
    expect(JSON.parse(response.body).title).toBe('Affenpinscher');
  });

  test('No breed found error', async () => {
    mockEvent = {
      ...mockEvent,
      pathParameters: {
        productId: 'X',
      },
    };
    try {
      await getProductById(mockEvent);
    } catch (e) {
      expect(e.status).toBe(500);
    }
  });
});
