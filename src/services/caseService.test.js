import { beforeEach, describe, expect, jest, test } from '@jest/globals';

const prisma = {
  customer_case: {
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

jest.unstable_mockModule('../utils/prisma.js', () => ({ default: prisma }));

const { updateCase } = await import('./caseService.js');

describe('updateCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.customer_case.findUnique.mockResolvedValue({ caseId: '123' });
    prisma.customer_case.update.mockResolvedValue({ caseId: '123', isCompleted: false });
    prisma.customer.findUnique.mockResolvedValue({ customerid: 'CUST-001' });
    prisma.agent.findUnique.mockResolvedValue({ userid: 'AGN-001' });
  });

  test('updates only supplied fields for an auto-save', async () => {
    await updateCase({ caseId: 123, notes: 'Draft note' });

    expect(prisma.customer_case.update).toHaveBeenCalledWith({
      where: { caseId: '123' },
      data: { notes: 'Draft note' },
      select: { caseId: true, isCompleted: true },
    });
  });

  test('supports completing a case', async () => {
    prisma.customer_case.update.mockResolvedValue({ caseId: '123', isCompleted: true });

    await expect(updateCase({ caseId: 123, isCompleted: true })).resolves.toEqual({
      caseId: '123',
      isCompleted: true,
    });
  });

  test('rejects a missing case', async () => {
    prisma.customer_case.findUnique.mockResolvedValue(null);

    await expect(updateCase({ caseId: 123, notes: 'Draft note' })).rejects.toMatchObject({
      statusCode: 404,
      message: 'Case not found',
    });
    expect(prisma.customer_case.update).not.toHaveBeenCalled();
  });

  test('rejects an invalid customer relationship', async () => {
    prisma.customer.findUnique.mockResolvedValue(null);

    await expect(updateCase({ caseId: 123, customerId: 'UNKNOWN' })).rejects.toMatchObject({
      statusCode: 400,
      message: 'Invalid customerId',
    });
  });

  test('rejects an invalid agent relationship', async () => {
    prisma.agent.findUnique.mockResolvedValue(null);

    await expect(updateCase({ caseId: 123, agentId: 'UNKNOWN' })).rejects.toMatchObject({
      statusCode: 400,
      message: 'Invalid agentId',
    });
  });

  test('propagates database failures', async () => {
    const databaseError = new Error('database unavailable');
    prisma.customer_case.findUnique.mockRejectedValue(databaseError);

    await expect(updateCase({ caseId: 123, notes: 'Draft note' })).rejects.toBe(databaseError);
  });
});