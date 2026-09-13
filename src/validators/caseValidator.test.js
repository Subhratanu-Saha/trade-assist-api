import { describe, expect, jest, test } from '@jest/globals';
import { validateCaseUpdate, handleValidationErrors } from './index.js';

const runValidation = async (body) => {
  const req = { body };
  const next = jest.fn();

  for (const validator of validateCaseUpdate) {
    await validator.run(req);
  }

  try {
    handleValidationErrors(req, {}, next);
    return { req, next, error: null };
  } catch (error) {
    return { req, next, error };
  }
};

describe('validateCaseUpdate', () => {
  test('requires a valid caseId', async () => {
    const { error } = await runValidation({ notes: 'Draft note' });

    expect(error).toMatchObject({ statusCode: 400, message: 'caseId is required' });
  });

  test('rejects non-boolean completion flags', async () => {
    const { error } = await runValidation({ caseId: 123, isCompleted: 'yes' });

    expect(error).toMatchObject({
      message: 'isCompleted must be a boolean',
    });
  });

  test('accepts a partial update and preserves false booleans', async () => {
    const { req, next } = await runValidation({ caseId: 123, notes: 'Draft', isCompleted: false });

    expect(next).toHaveBeenCalledWith();
    expect(req.body).toMatchObject({ caseId: '123', notes: 'Draft', isCompleted: false });
  });
});