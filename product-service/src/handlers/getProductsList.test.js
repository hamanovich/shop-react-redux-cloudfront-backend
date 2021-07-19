import getProductsList from './getProductsList';

describe('Get all Dogs', () => {
  test('First Dog name is "Affenpinscher"', async () => {
    const response = await getProductsList();
    expect(JSON.parse(response.body)[0]?.title).toEqual('Affenpinscher');
  });

  test('"African" breed costs 10', async () => {
    const response = await getProductsList();
    const africanBreed = JSON.parse(response.body).find((p) => p.title === 'African');
    expect(africanBreed.price).toEqual(10);
  });
});
