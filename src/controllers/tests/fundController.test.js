import {
    jest,
    describe,
    it,
    expect,
    beforeEach,
} from '@jest/globals';

// Mock service functions
const createFundRecordMock = jest.fn();
const updateFundDetailsMock = jest.fn();
const fetchFundsByCustomerIdMock = jest.fn();
const fetchFundByFundIdMock = jest.fn();

// Mock fundService
jest.unstable_mockModule('../../services/fundService.js', () => ({
    createFund: createFundRecordMock,
    updateFund: updateFundDetailsMock,
    getFundsByCustomerId: fetchFundsByCustomerIdMock,
    getFundByFundId: fetchFundByFundIdMock,
}));

// Mock errors and response utilities
class MockAppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

class MockSuccessResponse {
    constructor(message, data) {
        this.success = true;
        this.message = message;
        this.data = data;
    }
}

jest.unstable_mockModule('../../utils/errors.js', () => ({
    AppError: MockAppError,
    asyncHandler: (fn) => fn,
}));

jest.unstable_mockModule('../../utils/responses.js', () => ({
    SuccessResponse: MockSuccessResponse,
}));

// Import controller after mocks
const {
    createFund,
    updateFund,
    getFundsByCustomerId,
    getFundById,
} = await import('../fundController.js');

describe('fundController', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {},
            query: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    // ---------------- createFund ----------------
    describe('createFund', () => {
        it('should create a fund successfully', async () => {
            createFundRecordMock.mockResolvedValue({
                fundId: 'F000001',
            });

            await createFund(req, res);

            expect(createFundRecordMock).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: 'true',
                message: 'Fund id created successfully',
                fundId: 'F000001',
            });
        });

        it('should propagate service error', async () => {
            const error = new Error('Service error');

            createFundRecordMock.mockRejectedValue(error);

            await expect(createFund(req, res)).rejects.toThrow(error);
        });
    });

    // ---------------- updateFund ----------------
    describe('updateFund', () => {
        it('should update a fund successfully', async () => {
            req.body = {
                fundId: 'F000001',
                customerId: 'C000001',
                agentId: 'A000001',
                tenderType: 'Cash',
                fundAmount: 500,
                reasonForFund: 'Test',
                status: 'Approved',
                Approver: 'Manager',
            };

            const updatedFund = {
                fundId: 'F000001',
                customerId: 'C000001',
            };

            updateFundDetailsMock.mockResolvedValue(updatedFund);

            await updateFund(req, res);

            expect(updateFundDetailsMock).toHaveBeenCalledWith({
                fundId: 'F000001',
                customerId: 'C000001',
                agentId: 'A000001',
                tenderType: 'Cash',
                fundAmount: 500,
                reasonForFund: 'Test',
                status: 'Approved',
                Approver: 'Manager',
            });

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Fund details updated successfully',
                    updatedFund
                )
            );
        });

        it('should throw 404 when fund record is not found', async () => {
            req.body = {
                fundId: 'F999999',
                customerId: 'C000001',
            };

            updateFundDetailsMock.mockResolvedValue(null);

            await expect(updateFund(req, res)).rejects.toMatchObject({
                statusCode: 404,
                message: 'Fund record not found',
            });
        });

        it('should rethrow AppError from service', async () => {
            const error = new MockAppError(400, 'Invalid fund');

            updateFundDetailsMock.mockRejectedValue(error);

            await expect(updateFund(req, res)).rejects.toThrow(error);
        });

        it('should throw 500 when service throws a non-AppError', async () => {
            updateFundDetailsMock.mockRejectedValue(
                new Error('Unexpected error')
            );

            await expect(updateFund(req, res)).rejects.toMatchObject({
                statusCode: 500,
                message: 'Internal server error',
            });
        });
    });

    // ---------------- getFundsByCustomerId ----------------
    describe('getFundsByCustomerId', () => {
        it('should return funds for a customer', async () => {
            req.query.customerId = 'C000001';

            const funds = [
                { fundId: 'F000001', customerId: 'C000001' },
                { fundId: 'F000002', customerId: 'C000001' },
            ];

            fetchFundsByCustomerIdMock.mockResolvedValue(funds);

            await getFundsByCustomerId(req, res);

            expect(fetchFundsByCustomerIdMock).toHaveBeenCalledWith(
                'C000001'
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Funds retrieved successfully',
                    funds
                )
            );
        });

        it('should throw 400 when customerId is missing', async () => {
            req.query = {};

            await expect(
                getFundsByCustomerId(req, res)
            ).rejects.toMatchObject({
                statusCode: 400,
                message: 'customerId is required',
            });

            expect(fetchFundsByCustomerIdMock).not.toHaveBeenCalled();
        });

        it('should throw 404 when customer has no funds', async () => {
            req.query.customerId = 'C000001';

            fetchFundsByCustomerIdMock.mockResolvedValue([]);

            await expect(
                getFundsByCustomerId(req, res)
            ).rejects.toMatchObject({
                statusCode: 404,
                message: 'Fund records not found',
            });
        });

        it('should propagate service error', async () => {
            req.query.customerId = 'C000001';

            fetchFundsByCustomerIdMock.mockRejectedValue(
                new Error('Service error')
            );

            await expect(
                getFundsByCustomerId(req, res)
            ).rejects.toThrow('Service error');
        });
    });

    // ---------------- getFundById ----------------
    describe('getFundById', () => {
        it('should return a fund by fundId', async () => {
            req.query.fundId = 'F000001';

            const fund = {
                fundId: 'F000001',
                customerId: 'C000001',
            };

            fetchFundByFundIdMock.mockResolvedValue(fund);

            await getFundById(req, res);

            expect(fetchFundByFundIdMock).toHaveBeenCalledWith(
                'F000001'
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Fund retrieved successfully',
                    fund
                )
            );
        });

        it('should throw 404 when fund is not found', async () => {
            req.query.fundId = 'F999999';

            fetchFundByFundIdMock.mockResolvedValue(null);

            await expect(
                getFundById(req, res)
            ).rejects.toMatchObject({
                statusCode: 404,
                message: 'Fund record not found',
            });
        });

        it('should propagate service error', async () => {
            req.query.fundId = 'F000001';

            fetchFundByFundIdMock.mockRejectedValue(
                new Error('Service error')
            );

            await expect(
                getFundById(req, res)
            ).rejects.toThrow('Service error');
        });
    });
});