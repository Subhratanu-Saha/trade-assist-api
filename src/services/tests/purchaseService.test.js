
import { jest } from '@jest/globals';

const prisma = {
  purchase: {
    findMany: jest.fn(),
  },
};

jest.unstable_mockModule('../../utils/prisma.js', () => ({
  default: prisma,
}));

const { getPurchasesByCustomerId } = await import(
  '../purchaseService.js'
);

describe('purchaseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPurchasesByCustomerId', () => {
    it('should return purchases for a customer', async () => {
      const purchases = [
        {
          purchaseid: 'P001',
          customerid: 'C001',
        },
        {
          purchaseid: 'P002',
          customerid: 'C001',
        },
      ];

      prisma.purchase.findMany.mockResolvedValue(purchases);

      const result = await getPurchasesByCustomerId('C001');

      expect(result).toEqual(purchases);

      expect(prisma.purchase.findMany).toHaveBeenCalledWith({
        where: {
          customerid: 'C001',
        },
      });
    });

    it('should return an empty array when customer has no purchases', async () => {
      prisma.purchase.findMany.mockResolvedValue([]);

      const result = await getPurchasesByCustomerId('C001');

      expect(result).toEqual([]);
    });

    it('should return only purchases belonging to the requested customer', async () => {
      const purchases = [
        {
          purchaseid: 'P003',
          customerid: 'C002',
        },
      ];

      prisma.purchase.findMany.mockResolvedValue(purchases);

      const result = await getPurchasesByCustomerId('C002');

      expect(result).toHaveLength(1);
      expect(result[0].customerid).toBe('C002');
    });

    it('should return multiple purchases for the same customer', async () => {
      const purchases = [
        { purchaseid: 'P001', customerid: 'C001' },
        { purchaseid: 'P002', customerid: 'C001' },
        { purchaseid: 'P003', customerid: 'C001' },
      ];

      prisma.purchase.findMany.mockResolvedValue(purchases);

      const result = await getPurchasesByCustomerId('C001');

      expect(result).toHaveLength(3);
    });

    it('should propagate Prisma errors', async () => {
      prisma.purchase.findMany.mockRejectedValue(
        new Error('Database error')
      );

      await expect(
        getPurchasesByCustomerId('C001')
      ).rejects.toThrow('Database error');
    });
  });
});
