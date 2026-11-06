
import { jest } from '@jest/globals';

const prisma = {
  caseRecord: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => prisma),
}));

const { default: caseServiceCaseIDGenerate } =
  await import('../caseServiceCaseIDGenerate.js');

describe('caseServiceCaseIDGenerate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateCaseId', () => {
    it('should generate case ID 1 when no cases exist', async () => {
      prisma.caseRecord.findMany.mockResolvedValue([]);

      prisma.caseRecord.create.mockResolvedValue({
        caseId: '1',
        customerId: null,
        agentId: null,
      });

      const result =
        await caseServiceCaseIDGenerate.generateCaseId();

      expect(result).toBe('1');

      expect(prisma.caseRecord.create).toHaveBeenCalledWith({
        data: {
          caseId: '1',
          customerId: null,
          agentId: null,
        },
      });
    });

    it('should generate the next case ID based on existing cases', async () => {
      prisma.caseRecord.findMany.mockResolvedValue([
        { caseId: '1' },
        { caseId: '2' },
        { caseId: '3' },
      ]);

      prisma.caseRecord.create.mockResolvedValue({
        caseId: '4',
        customerId: null,
        agentId: null,
      });

      const result =
        await caseServiceCaseIDGenerate.generateCaseId();

      expect(result).toBe('4');

      expect(prisma.caseRecord.create).toHaveBeenCalledWith({
        data: {
          caseId: '4',
          customerId: null,
          agentId: null,
        },
      });
    });

    it('should generate the next ID based on the maximum existing ID', async () => {
      prisma.caseRecord.findMany.mockResolvedValue([
        { caseId: '1' },
        { caseId: '5' },
        { caseId: '3' },
      ]);

      prisma.caseRecord.create.mockResolvedValue({
        caseId: '6',
        customerId: null,
        agentId: null,
      });

      const result =
        await caseServiceCaseIDGenerate.generateCaseId();

      expect(result).toBe('6');
    });

    it('should handle case IDs returned as strings', async () => {
      prisma.caseRecord.findMany.mockResolvedValue([
        { caseId: '10' },
        { caseId: '20' },
        { caseId: '15' },
      ]);

      prisma.caseRecord.create.mockResolvedValue({
        caseId: '21',
        customerId: null,
        agentId: null,
      });

      const result =
        await caseServiceCaseIDGenerate.generateCaseId();

      expect(result).toBe('21');
    });

    it('should call findMany with caseId selection', async () => {
      prisma.caseRecord.findMany.mockResolvedValue([]);

      prisma.caseRecord.create.mockResolvedValue({
        caseId: '1',
      });

      await caseServiceCaseIDGenerate.generateCaseId();

      expect(prisma.caseRecord.findMany).toHaveBeenCalledWith({
        select: {
          caseId: true,
        },
      });
    });

    it('should return the case ID created by Prisma', async () => {
      prisma.caseRecord.findMany.mockResolvedValue([
        { caseId: '100' },
      ]);

      prisma.caseRecord.create.mockResolvedValue({
        caseId: '101',
      });

      const result =
        await caseServiceCaseIDGenerate.generateCaseId();

      expect(result).toBe('101');
    });
  });
});
