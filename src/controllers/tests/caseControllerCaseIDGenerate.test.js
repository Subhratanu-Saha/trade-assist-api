import {
    jest,
    describe,
    it,
    expect,
    beforeEach,
} from '@jest/globals';

// Mock service function
const generateCaseIdMock = jest.fn();

jest.unstable_mockModule(
    '../../services/caseServiceCaseIDGenerate.js',
    () => ({
        default: {
            generateCaseId: generateCaseIdMock,
        },
    })
);

// Import controller after mocking
const { default: caseController } = await import(
    '../caseControllerCaseIDGenerate.js'
);

describe('caseControllerCaseIDGenerate', () => {
    let req;
    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        req = {};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    describe('generateCaseId', () => {
        it('should generate a case ID successfully', async () => {
            generateCaseIdMock.mockResolvedValue('CASE000001');

            await caseController.generateCaseId(req, res);

            expect(generateCaseIdMock).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(201);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                caseId: 'CASE000001',
            });
        });

        it('should return 500 when service throws an error', async () => {
            const error = new Error('Service error');

            generateCaseIdMock.mockRejectedValue(error);

            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            await caseController.generateCaseId(req, res);

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Error generating case ID:',
                error
            );

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Failed to generate case ID',
            });

            consoleErrorSpy.mockRestore();
        });
    });
});