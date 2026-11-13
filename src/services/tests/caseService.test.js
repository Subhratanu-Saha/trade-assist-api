
import { jest } from '@jest/globals';

const prisma = {
  caseRecord: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  customer: {
    findUnique: jest.fn(),
  },
  agent: {
    findUnique: jest.fn(),
  },
};

jest.unstable_mockModule('../../utils/prisma.js', () => ({
  default: prisma,
}));

const {
  getCasesByCustomerId,
  getCaseByCaseId,
  updateCase,
} = await import('../caseService.js');

describe('caseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // getCasesByCustomerId
  describe('getCasesByCustomerId', () => {
    it('should return open and closed cases for a customer', async () => {
      const cases = [
        {
          caseId: 'CASE001',
          customerId: 'C001',
          isCompleted: false,
        },
        {
          caseId: 'CASE002',
          customerId: 'C001',
          isCompleted: true,
        },
      ];

      prisma.caseRecord.findMany.mockResolvedValue(cases);

      const result = await getCasesByCustomerId('C001');

      expect(result.open).toHaveLength(1);
      expect(result.closed).toHaveLength(1);

      expect(result.open[0].status).toBe('open');
      expect(result.closed[0].status).toBe('closed');

      expect(prisma.caseRecord.findMany).toHaveBeenCalledWith({
        where: {
          customerId: 'C001',
        },
      });
    });

    it('should return empty arrays when customer has no cases', async () => {
      prisma.caseRecord.findMany.mockResolvedValue([]);

      const result = await getCasesByCustomerId('C001');

      expect(result).toEqual({
        open: [],
        closed: [],
      });
    });

    it('should return all cases as open when none are completed', async () => {
      prisma.caseRecord.findMany.mockResolvedValue([
        {
          caseId: 'CASE001',
          isCompleted: false,
        },
        {
          caseId: 'CASE002',
          isCompleted: false,
        },
      ]);

      const result = await getCasesByCustomerId('C001');

      expect(result.open).toHaveLength(2);
      expect(result.closed).toHaveLength(0);
    });

    it('should return all cases as closed when all are completed', async () => {
      prisma.caseRecord.findMany.mockResolvedValue([
        {
          caseId: 'CASE001',
          isCompleted: true,
        },
        {
          caseId: 'CASE002',
          isCompleted: true,
        },
      ]);

      const result = await getCasesByCustomerId('C001');

      expect(result.open).toHaveLength(0);
      expect(result.closed).toHaveLength(2);
    });
  });

  // getCaseByCaseId
  describe('getCaseByCaseId', () => {
    it('should return a case when case ID exists', async () => {
      const caseData = {
        caseId: 'CASE001',
        customerId: 'C001',
        isCompleted: false,
      };

      prisma.caseRecord.findUnique.mockResolvedValue(caseData);

      const result = await getCaseByCaseId('CASE001');

      expect(result).toEqual(caseData);

      expect(prisma.caseRecord.findUnique).toHaveBeenCalledWith({
        where: {
          caseId: 'CASE001',
        },
      });
    });

    it('should return null when case ID does not exist', async () => {
      prisma.caseRecord.findUnique.mockResolvedValue(null);

      const result = await getCaseByCaseId('INVALID');

      expect(result).toBeNull();
    });
  });

  // updateCase
  describe('updateCase', () => {
    it('should update an existing case successfully', async () => {
      const existingCase = {
        caseId: 'CASE001',
      };

      const updatedCase = {
        caseId: 'CASE001',
        isCompleted: true,
      };

      prisma.caseRecord.findUnique.mockResolvedValue(existingCase);
      prisma.caseRecord.update.mockResolvedValue(updatedCase);

      const result = await updateCase({
        caseId: 'CASE001',
        isCompleted: true,
        notes: 'Case resolved',
      });

      expect(result).toEqual(updatedCase);

      expect(prisma.caseRecord.update).toHaveBeenCalledWith({
        where: {
          caseId: 'CASE001',
        },
        data: {
          isCompleted: true,
          notes: 'Case resolved',
        },
        select: {
          caseId: true,
          isCompleted: true,
        },
      });
    });

    it('should throw error when case does not exist', async () => {
      prisma.caseRecord.findUnique.mockResolvedValue(null);

      await expect(
        updateCase({
          caseId: 'INVALID',
          notes: 'Test',
        })
      ).rejects.toThrow('Case not found');
    });

    it('should throw error when customer ID is invalid', async () => {
      prisma.caseRecord.findUnique.mockResolvedValue({
        caseId: 'CASE001',
      });

      prisma.customer.findUnique.mockResolvedValue(null);

      await expect(
        updateCase({
          caseId: 'CASE001',
          customerId: 'INVALID',
        })
      ).rejects.toThrow('Invalid customerId');
    });

    it('should throw error when agent ID is invalid', async () => {
      prisma.caseRecord.findUnique.mockResolvedValue({
        caseId: 'CASE001',
      });

      prisma.agent.findUnique.mockResolvedValue(null);

      await expect(
        updateCase({
          caseId: 'CASE001',
          agentId: 'INVALID',
        })
      ).rejects.toThrow('Invalid agentId');
    });

    it('should throw error when no fields are provided for update', async () => {
      prisma.caseRecord.findUnique.mockResolvedValue({
        caseId: 'CASE001',
      });

      await expect(
        updateCase({
          caseId: 'CASE001',
        })
      ).rejects.toThrow(
        'At least one case field is required'
      );
    });

    it('should update case when customer ID is valid', async () => {
      prisma.caseRecord.findUnique.mockResolvedValue({
        caseId: 'CASE001',
      });

      prisma.customer.findUnique.mockResolvedValue({
        customerid: 'C001',
      });

      prisma.caseRecord.update.mockResolvedValue({
        caseId: 'CASE001',
        isCompleted: true,
      });

      const result = await updateCase({
        caseId: 'CASE001',
        customerId: 'C001',
        isCompleted: true,
      });

      expect(result.isCompleted).toBe(true);

      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: {
          customerid: 'C001',
        },
        select: {
          customerid: true,
        },
      });
    });

    it('should update case when agent ID is valid', async () => {
      prisma.caseRecord.findUnique.mockResolvedValue({
        caseId: 'CASE001',
      });

      prisma.agent.findUnique.mockResolvedValue({
        userid: 'A001',
      });

      prisma.caseRecord.update.mockResolvedValue({
        caseId: 'CASE001',
        isCompleted: true,
      });

      const result = await updateCase({
        caseId: 'CASE001',
        agentId: 'A001',
        isCompleted: true,
      });

      expect(result.isCompleted).toBe(true);

      expect(prisma.agent.findUnique).toHaveBeenCalledWith({
        where: {
          userid: 'A001',
        },
        select: {
          userid: true,
        },
      });
    });

    it('should convert case ID to string before querying', async () => {
      prisma.caseRecord.findUnique.mockResolvedValue({
        caseId: '123',
      });

      prisma.caseRecord.update.mockResolvedValue({
        caseId: '123',
        isCompleted: true,
      });

      await updateCase({
        caseId: 123,
        isCompleted: true,
      });

      expect(prisma.caseRecord.findUnique).toHaveBeenCalledWith({
        where: {
          caseId: '123',
        },
      });
    });
  });
});
