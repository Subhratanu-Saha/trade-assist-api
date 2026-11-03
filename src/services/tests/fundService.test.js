import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const prismaMock = {
    customerFund: {
        findMany: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
    },
};

jest.unstable_mockModule('../../utils/prisma.js', () => ({
    default: prismaMock,
}));

const {
    createFund,
    updateFund,
    getFundsByCustomerId,
    getFundByFundId,
} = await import('../fundService.js');

describe('fundService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ---------------- createFund ----------------
    describe('createFund', () => {
        it('should create a fund with F000001 when no funds exist', async () => {
            prismaMock.customerFund.findMany.mockResolvedValue([]);

            prismaMock.customerFund.create.mockResolvedValue({
                fundId: 'F000001',
            });

            const result = await createFund();

            expect(result).toEqual({ fundId: 'F000001' });

            expect(prismaMock.customerFund.create).toHaveBeenCalledWith({
                data: {
                    fundId: 'F000001',
                    tenderType: null,
                    fundAmount: null,
                    reasonForFund: null,
                    status: null,
                    customerId: null,
                    AgentId: null,
                    Approver: null,
                },
            });
        });

        it('should generate the next fund ID based on existing funds', async () => {
            prismaMock.customerFund.findMany.mockResolvedValue([
                { fundId: 'F000001' },
                { fundId: 'F000002' },
            ]);

            prismaMock.customerFund.create.mockResolvedValue({
                fundId: 'F000003',
            });

            const result = await createFund();

            expect(result).toEqual({ fundId: 'F000003' });

            expect(prismaMock.customerFund.create).toHaveBeenCalledWith({
                data: {
                    fundId: 'F000003',
                    tenderType: null,
                    fundAmount: null,
                    reasonForFund: null,
                    status: null,
                    customerId: null,
                    AgentId: null,
                    Approver: null,
                },
            });
        });

        it('should ignore invalid fund IDs when generating the next ID', async () => {
            prismaMock.customerFund.findMany.mockResolvedValue([
                { fundId: 'F000001' },
                { fundId: 'FABC123' },
                { fundId: 'F000002' },
            ]);

            prismaMock.customerFund.create.mockResolvedValue({
                fundId: 'F000003',
            });

            const result = await createFund();

            expect(result).toEqual({ fundId: 'F000003' });

            expect(prismaMock.customerFund.create).toHaveBeenCalledWith({
                data: {
                    fundId: 'F000003',
                    tenderType: null,
                    fundAmount: null,
                    reasonForFund: null,
                    status: null,
                    customerId: null,
                    AgentId: null,
                    Approver: null,
                },
            });
        });

        it('should generate F000001 when all existing fund IDs are invalid', async () => {
            prismaMock.customerFund.findMany.mockResolvedValue([
                { fundId: 'INVALID' },
                { fundId: 'FABC123' },
            ]);

            prismaMock.customerFund.create.mockResolvedValue({
                fundId: 'F000001',
            });

            const result = await createFund();

            expect(result).toEqual({ fundId: 'F000001' });

            expect(prismaMock.customerFund.create).toHaveBeenCalledWith({
                data: {
                    fundId: 'F000001',
                    tenderType: null,
                    fundAmount: null,
                    reasonForFund: null,
                    status: null,
                    customerId: null,
                    AgentId: null,
                    Approver: null,
                },
            });
        });

        it('should keep the highest sequence when an existing fund ID is lower', async () => {
            prismaMock.customerFund.findMany.mockResolvedValue([
                { fundId: 'F000005' },
                { fundId: 'F000003' },
                { fundId: 'F000001' },
            ]);

            prismaMock.customerFund.create.mockResolvedValue({
                fundId: 'F000006',
            });

            const result = await createFund();

            expect(result).toEqual({ fundId: 'F000006' });

            expect(prismaMock.customerFund.create).toHaveBeenCalledWith({
                data: {
                    fundId: 'F000006',
                    tenderType: null,
                    fundAmount: null,
                    reasonForFund: null,
                    status: null,
                    customerId: null,
                    AgentId: null,
                    Approver: null,
                },
            });
        });
    });

    // ---------------- updateFund ----------------
    describe('updateFund', () => {
        it('should update an existing fund', async () => {
            prismaMock.customerFund.findUnique.mockResolvedValue({
                fundId: 'F000001',
            });

            prismaMock.customerFund.update.mockResolvedValue({
                fundId: 'F000001',
                customerId: 'C000001',
            });

            await updateFund({
                fundId: 'F000001',
                customerId: 'C000001',
                agentId: 'A000001',
                tenderType: 'Cash',
                fundAmount: 500,
                reasonForFund: 'Test',
                status: 'Approved',
                Approver: 'Manager',
            });

            expect(prismaMock.customerFund.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { fundId: 'F000001' },
                    data: expect.objectContaining({
                        customerId: 'C000001',
                        AgentId: 'A000001',
                        tenderType: 'Cash',
                        fundAmount: 500,
                        reasonForFund: 'Test',
                        status: 'Approved',
                        Approver: 'Manager',
                    }),
                })
            );
        });

        it('should return null when fund does not exist', async () => {
            prismaMock.customerFund.findUnique.mockResolvedValue(null);

            const result = await updateFund({
                fundId: 'F999999',
                customerId: 'C000001',
            });

            expect(result).toBeNull();
            expect(prismaMock.customerFund.update).not.toHaveBeenCalled();
        });

        it('should not include undefined optional fields in update', async () => {
            prismaMock.customerFund.findUnique.mockResolvedValue({
                fundId: 'F000001',
            });

            prismaMock.customerFund.update.mockResolvedValue({
                fundId: 'F000001',
            });

            await updateFund({
                fundId: 'F000001',
                customerId: 'C000001',
            });

            const updateCall = prismaMock.customerFund.update.mock.calls[0][0];

            expect(updateCall.data).not.toHaveProperty('tenderType');
            expect(updateCall.data).not.toHaveProperty('fundAmount');
            expect(updateCall.data).not.toHaveProperty('reasonForFund');
            expect(updateCall.data).not.toHaveProperty('status');
            expect(updateCall.data).not.toHaveProperty('Approver');
        });
    });

    // ---------------- getFundsByCustomerId ----------------
    describe('getFundsByCustomerId', () => {
        it('should return funds for a customer', async () => {
            const funds = [
                { fundId: 'F000001', customerId: 'C000001' },
                { fundId: 'F000002', customerId: 'C000001' },
            ];

            prismaMock.customerFund.findMany.mockResolvedValue(funds);

            const result = await getFundsByCustomerId('C000001');

            expect(result).toEqual(funds);

            expect(prismaMock.customerFund.findMany).toHaveBeenCalledWith({
                where: { customerId: 'C000001' },
                orderBy: { sysCreatedDt: 'desc' },
            });
        });

        it('should return an empty array when customer has no funds', async () => {
            prismaMock.customerFund.findMany.mockResolvedValue([]);

            const result = await getFundsByCustomerId('C000002');

            expect(result).toEqual([]);
        });
    });

    // ---------------- getFundByFundId ----------------
    describe('getFundByFundId', () => {
        it('should return a fund by fund ID', async () => {
            const fund = {
                fundId: 'F000001',
                customerId: 'C000001',
            };

            prismaMock.customerFund.findUnique.mockResolvedValue(fund);

            const result = await getFundByFundId('F000001');

            expect(result).toEqual(fund);

            expect(prismaMock.customerFund.findUnique).toHaveBeenCalledWith({
                where: { fundId: 'F000001' },
            });
        });

        it('should return null when fund ID does not exist', async () => {
            prismaMock.customerFund.findUnique.mockResolvedValue(null);

            const result = await getFundByFundId('F999999');

            expect(result).toBeNull();
        });
    });
});