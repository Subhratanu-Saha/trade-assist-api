import {
    jest,
    describe,
    it,
    expect,
    beforeEach,
} from '@jest/globals';

// Mock service functions
const fetchCasesByCustomerIdMock = jest.fn();
const fetchCaseByCaseIdMock = jest.fn();
const updateCaseDetailsMock = jest.fn();

jest.unstable_mockModule('../../services/caseService.js', () => ({
    getCaseByCaseId: fetchCaseByCaseIdMock,
    getCasesByCustomerId: fetchCasesByCustomerIdMock,
    updateCase: updateCaseDetailsMock,
}));

// Mock AppError and asyncHandler
class MockAppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

const mockAsyncHandler = (fn) => fn;

jest.unstable_mockModule('../../utils/errors.js', () => ({
    AppError: MockAppError,
    asyncHandler: mockAsyncHandler,
}));

// Mock SuccessResponse
class MockSuccessResponse {
    constructor(message, data) {
        this.success = true;
        this.message = message;
        this.data = data;
    }
}

jest.unstable_mockModule('../../utils/responses.js', () => ({
    SuccessResponse: MockSuccessResponse,
}));

// Import controller after mocks
const {
    getCasesByCustomerId,
    getCaseById,
    updateCase,
} = await import('../caseController.js');

describe('caseController', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            query: {},
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    // ---------------- getCasesByCustomerId ----------------
    describe('getCasesByCustomerId', () => {
        it('should return cases for a customer', async () => {
            req.query.customerId = 'C000001';

            const cases = {
                open: [{ caseId: 'CASE000001' }],
                closed: [{ caseId: 'CASE000002' }],
            };

            fetchCasesByCustomerIdMock.mockResolvedValue(cases);

            await getCasesByCustomerId(req, res);

            expect(fetchCasesByCustomerIdMock).toHaveBeenCalledWith(
                'C000001'
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Cases retrieved successfully',
                    cases
                )
            );
        });

        it('should throw 404 when cases are null', async () => {
            fetchCasesByCustomerIdMock.mockResolvedValue(null);

            await expect(
                getCasesByCustomerId(req, res)
            ).rejects.toThrow('Case records not found');
        });

        it('should throw 404 when open and closed cases are empty', async () => {
            fetchCasesByCustomerIdMock.mockResolvedValue({
                open: [],
                closed: [],
            });

            await expect(
                getCasesByCustomerId(req, res)
            ).rejects.toThrow('Case records not found');
        });

        it('should throw 500 when service throws a non-AppError', async () => {
            fetchCasesByCustomerIdMock.mockRejectedValue(
                new Error('Database error')
            );

            await expect(
                getCasesByCustomerId(req, res)
            ).rejects.toThrow('Internal server error');
        });
    });

    // ---------------- getCaseById ----------------
    describe('getCaseById', () => {
        it('should return a case by caseId', async () => {
            req.query.caseId = 'CASE000001';

            const singleCase = {
                caseId: 'CASE000001',
                customerId: 'C000001',
            };

            fetchCaseByCaseIdMock.mockResolvedValue(singleCase);

            await getCaseById(req, res);

            expect(fetchCaseByCaseIdMock).toHaveBeenCalledWith(
                'CASE000001'
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Case retrieved successfully',
                    singleCase
                )
            );
        });

        it('should throw 404 when case does not exist', async () => {
            fetchCaseByCaseIdMock.mockResolvedValue(null);

            await expect(
                getCaseById(req, res)
            ).rejects.toThrow('Case record not found');
        });

        it('should throw 500 when service throws a non-AppError', async () => {
            fetchCaseByCaseIdMock.mockRejectedValue(
                new Error('Database error')
            );

            await expect(
                getCaseById(req, res)
            ).rejects.toThrow('Internal server error');
        });
    });

    // ---------------- updateCase ----------------
    describe('updateCase', () => {
        it('should return completed successfully when case is completed', async () => {
            req.body = {
                caseId: 'CASE000001',
                isCompleted: true,
            };

            const updatedCase = {
                caseId: 'CASE000001',
                isCompleted: true,
            };

            updateCaseDetailsMock.mockResolvedValue(updatedCase);

            await updateCase(req, res);

            expect(updateCaseDetailsMock).toHaveBeenCalledWith(
                req.body
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Case completed successfully',
                    updatedCase
                )
            );
        });

        it('should return updated successfully when case is not completed', async () => {
            req.body = {
                caseId: 'CASE000001',
                isCompleted: false,
            };

            const updatedCase = {
                caseId: 'CASE000001',
                isCompleted: false,
            };

            updateCaseDetailsMock.mockResolvedValue(updatedCase);

            await updateCase(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Case updated successfully',
                    updatedCase
                )
            );
        });

        it('should propagate service error', async () => {
            updateCaseDetailsMock.mockRejectedValue(
                new Error('Update failed')
            );

            await expect(
                updateCase(req, res)
            ).rejects.toThrow('Update failed');
        });
    });
});