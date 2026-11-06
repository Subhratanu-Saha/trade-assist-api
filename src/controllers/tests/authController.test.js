import {
    jest,
    describe,
    it,
    expect,
    beforeEach,
} from '@jest/globals';

// Mock service
const loginAgentServiceMock = jest.fn();

jest.unstable_mockModule('../../services/agentLoginService.js', () => ({
    loginAgentService: loginAgentServiceMock,
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
    getAgentAuth,
    loginAgent,
} = await import('../authController.js');

describe('authController', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {
            body: {},
            user: undefined,
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    // ---------------- getAgentAuth ----------------
    describe('getAgentAuth', () => {
        it('should return auth endpoint information', async () => {
            await getAgentAuth(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Agent auth endpoint',
                    {
                        methods: ['GET', 'POST'],
                        user: null,
                    }
                )
            );
        });

        it('should return the user when req.user exists', async () => {
            req.user = {
                id: 'A000001',
                email: 'agent@example.com',
            };

            await getAgentAuth(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Agent auth endpoint',
                    {
                        methods: ['GET', 'POST'],
                        user: req.user,
                    }
                )
            );
        });

        it('should return the error statusCode when getAgentAuth throws', async () => {
            const error = new Error('Authorization error');
            error.statusCode = 403;

            res.status.mockImplementationOnce(() => {
                throw error;
            });

            await getAgentAuth(req, res);

            expect(res.status).toHaveBeenCalledWith(403);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Authorization error',
            });
        });

        it('should return 500 when getAgentAuth error has no statusCode', async () => {
            const error = new Error('Unexpected error');

            res.status.mockImplementationOnce(() => {
                throw error;
            });

            await getAgentAuth(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Unexpected error',
            });
        });
    });

    // ---------------- loginAgent ----------------
    describe('loginAgent', () => {
        it('should login an agent successfully', async () => {
            req.body = {
                email: 'agent@example.com',
                password: 'password123',
            };

            const agent = {
                id: 'A000001',
                email: 'agent@example.com',
            };

            loginAgentServiceMock.mockResolvedValue(agent);

            await loginAgent(req, res);

            expect(loginAgentServiceMock).toHaveBeenCalledWith(
                'agent@example.com',
                'password123'
            );

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith(
                new MockSuccessResponse(
                    'Login successful',
                    {
                        user: agent,
                    }
                )
            );
        });

        it('should return the service error status and message', async () => {
            req.body = {
                email: 'agent@example.com',
                password: 'wrongpassword',
            };

            const error = new Error('Invalid credentials');
            error.statusCode = 401;

            loginAgentServiceMock.mockRejectedValue(error);

            await loginAgent(req, res);

            expect(res.status).toHaveBeenCalledWith(401);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid credentials',
            });
        });

        it('should return 500 when service error has no statusCode', async () => {
            req.body = {
                email: 'agent@example.com',
                password: 'password123',
            };

            loginAgentServiceMock.mockRejectedValue(
                new Error('Unexpected error')
            );

            await loginAgent(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Unexpected error',
            });
        });
    });
});