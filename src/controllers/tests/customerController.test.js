import {
    jest,
    describe,
    it,
    expect,
    beforeEach,
} from '@jest/globals';

// Mock service
const searchCustomerMock = jest.fn();

jest.unstable_mockModule(
    '../../services/customerSearchService.js',
    () => ({
        searchCustomer: searchCustomerMock,
    })
);

// Import controller after mock
const { getCustomerByEmail } = await import(
    '../customerController.js'
);

describe('customerController', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            query: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    describe('getCustomerByEmail', () => {
        it('should return 400 when email is missing', async () => {
            await getCustomerByEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                responseCode: 400,
                err: 'Email is required',
            });

            expect(searchCustomerMock).not.toHaveBeenCalled();
        });

        it('should return customer when exact email match is found', async () => {
            req.query.email = 'customer@example.com';

            const customers = [
                {
                    emailaddr: 'customer@example.com',
                    customerId: 'C000001',
                },
            ];

            searchCustomerMock.mockResolvedValue(customers);

            await getCustomerByEmail(req, res);

            expect(searchCustomerMock).toHaveBeenCalledWith(
                'customer@example.com'
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                responseCode: 200,
                customerRecord: customers[0],
            });
        });

        it('should match email case-insensitively', async () => {
            req.query.email = 'CUSTOMER@example.com';

            const customers = [
                {
                    emailaddr: 'customer@example.com',
                    customerId: 'C000001',
                },
            ];

            searchCustomerMock.mockResolvedValue(customers);

            await getCustomerByEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                responseCode: 200,
                customerRecord: customers[0],
            });
        });

        it('should return 404 when customer is not found', async () => {
            req.query.email = 'missing@example.com';

            searchCustomerMock.mockResolvedValue([
                {
                    emailaddr: 'other@example.com',
                    customerId: 'C000002',
                },
            ]);

            await getCustomerByEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(404);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                responseCode: 404,
                customerRecord: null,
            });
        });

        it('should return 404 when service returns an empty array', async () => {
            req.query.email = 'missing@example.com';

            searchCustomerMock.mockResolvedValue([]);

            await getCustomerByEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(404);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                responseCode: 404,
                customerRecord: null,
            });
        });

        it('should return 500 when service throws an error', async () => {
            req.query.email = 'customer@example.com';

            searchCustomerMock.mockRejectedValue(
                new Error('Database error')
            );

            await getCustomerByEmail(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                responseCode: 500,
                err: 'Database error',
            });
        });
    });
});