import { describe, expect, jest, test } from '@jest/globals';
import { authenticate } from './auth.js';

describe('authenticate', () => {
  test('rejects requests without a bearer token', () => {
    const next = jest.fn();

    expect(() => authenticate({ headers: {} }, {}, next)).toThrow('Invalid or expired token');
    expect(next).not.toHaveBeenCalled();
  });

  test('passes requests with a bearer token', () => {
    const next = jest.fn();

    authenticate({ headers: { authorization: 'Bearer test-token' } }, {}, next);

    expect(next).toHaveBeenCalledWith();
  });
});