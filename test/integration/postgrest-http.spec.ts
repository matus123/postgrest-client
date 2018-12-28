import { FilterOperator, GetAcceptType, PostgrestClient } from '../../src';

describe('#PostgrestClient integration', () => {
  describe('#GET data', () => {
    test('GET single item', async () => {
      const client = new PostgrestClient({ url: 'http://localhost:3005' });

      const data = await client.model('city').filter({ city_id: 4 }).get(undefined, GetAcceptType.Single);

      expect(data).toBeDefined();
    });

    test('GET item with complex filter', async () => {
      const client = new PostgrestClient({ url: 'http://localhost:3005' });

      const data = await client.model('city').filter({
        city_id: { operator: FilterOperator.Lte, value: 10 },
        city: { operator: FilterOperator.Like, value: 'Ab%' },
      }).get();

      expect(data).toBeDefined();
    });
  });

  describe('#POST data', () => {
    test('POST single item', async () => {
      const client = new PostgrestClient({ url: 'http://localhost:3005' });

      const data = await client.model('actor').post({
        first_name: 'asd1',
        last_name: 'asd1',
      });

      expect(data).toBeDefined();
    });

    test('POST multiple items', async () => {
      const client = new PostgrestClient({ url: 'http://localhost:3005' });

      const data = await client.model('actor').post([
        {
          first_name: 'asdasd',
          last_name: 'asdasd',
        },
        {
          first_name: 'asdbcd',
          last_name: 'asdbcd',
        },
      ]);
      expect(data).toBeDefined();
    });
  });

  describe('#PUT data', () => {
    test('PUT single item', async () => {
      const client = new PostgrestClient({ url: 'http://localhost:3005' });

      const data = await client.model('actor').post({
        first_name: 'asd1',
        last_name: 'asd1',
      });

      expect(data).toBeDefined();
    });

    test('POST multiple items', async () => {
      const client = new PostgrestClient({ url: 'http://localhost:3005' });

      const data = await client.model('actor').post([
        {
          first_name: 'asdasd',
          last_name: 'asdasd',
        },
        {
          first_name: 'asdbcd',
          last_name: 'asdbcd',
        },
      ]);
      expect(data).toBeDefined();
    });
  });
});
