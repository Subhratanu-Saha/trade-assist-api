
import { jest } from '@jest/globals';

const prisma = {
  customer: {
    findMany: jest.fn(),
  },
};

jest.unstable_mockModule('../../utils/prisma.js', () => ({
  default: prisma,
}));

const { searchCustomer } = await import('../customerSearchService.js');

describe('customerSearchService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchCustomer', () => {
    it('should return an empty array when search is empty', async () => {
      const result = await searchCustomer('');

      expect(result).toEqual([]);
      expect(prisma.customer.findMany).not.toHaveBeenCalled();
    });

    it('should return an empty array when search is null', async () => {
      const result = await searchCustomer(null);

      expect(result).toEqual([]);
      expect(prisma.customer.findMany).not.toHaveBeenCalled();
    });

    it('should return an empty array when search is undefined', async () => {
      const result = await searchCustomer(undefined);

      expect(result).toEqual([]);
      expect(prisma.customer.findMany).not.toHaveBeenCalled();
    });

    it('should search customers by customer ID, name, email, and contact number', async () => {
      const customers = [
        {
          customerid: 'C001',
          name: 'John Doe',
          emailaddr: 'john@example.com',
          contactnum: '9876543210',
        },
      ];

      prisma.customer.findMany.mockResolvedValue(customers);

      const result = await searchCustomer('john');

      expect(result).toEqual(customers);

      expect(prisma.customer.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              customerid: {
                contains: 'john',
                mode: 'insensitive',
              },
            },
            {
              name: {
                contains: 'john',
                mode: 'insensitive',
              },
            },
            {
              emailaddr: {
                contains: 'john',
                mode: 'insensitive',
              },
            },
            {
              contactnum: {
                contains: 'john',
                mode: 'insensitive',
              },
            },
          ],
        },
      });
    });

    it('should return an empty array when no customers match', async () => {
      prisma.customer.findMany.mockResolvedValue([]);

      const result = await searchCustomer('unknown');

      expect(result).toEqual([]);
    });

    it('should return multiple matching customers', async () => {
      const customers = [
        {
          customerid: 'C001',
          name: 'John Doe',
        },
        {
          customerid: 'C002',
          name: 'John Smith',
        },
      ];

      prisma.customer.findMany.mockResolvedValue(customers);

      const result = await searchCustomer('John');

      expect(result).toHaveLength(2);
      expect(result).toEqual(customers);
    });

    it('should propagate Prisma errors', async () => {
      prisma.customer.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        searchCustomer('John')
      ).rejects.toThrow('Database error');
    });
  });
});
