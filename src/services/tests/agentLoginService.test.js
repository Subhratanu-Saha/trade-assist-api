import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Create Prisma mock
const mockFindUnique = jest.fn();

// Mock Prisma BEFORE importing the service
jest.unstable_mockModule('../../utils/prisma.js', () => ({
  default: {
    agent: {
      findUnique: mockFindUnique,
    },
  },
}));

// Import the service AFTER registering the mock
const { loginAgentService } = await import('../agentLoginService.js');

describe('agentLoginService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Missing email and password
  it('should throw error when email and password are missing', async () => {
    await expect(
      loginAgentService('', '')
    ).rejects.toThrow('Email and password are required.');
  });

  // Test 2: Missing email
  it('should throw error when email is missing', async () => {
    await expect(
      loginAgentService('', 'password123')
    ).rejects.toThrow('Email and password are required.');
  });

  // Test 3: Missing password
  it('should throw error when password is missing', async () => {
    await expect(
      loginAgentService('agent@example.com', '')
    ).rejects.toThrow('Email and password are required.');
  });

  // Test 4: Agent not found
  it('should throw error when agent is not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(
      loginAgentService('agent@example.com', 'password123')
    ).rejects.toThrow('User not found.');

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        email_id: 'agent@example.com',
      },
    });
  });

  // Test 5: Successful login
  it('should return agent details when credentials are valid', async () => {
    mockFindUnique.mockResolvedValue({
      email_id: 'agent@example.com',
      password: 'password123',
      name: 'Test Agent',
    });

    const result = await loginAgentService(
      'agent@example.com',
      'password123'
    );

    expect(result).toEqual({
      email: 'agent@example.com',
      name: 'Test Agent',
      role: 'agent',
    });
  });

  // Test 6: Invalid password
  it('should throw error when password is invalid', async () => {
    mockFindUnique.mockResolvedValue({
      email_id: 'agent@example.com',
      password: 'password123',
      name: 'Test Agent',
    });

    await expect(
      loginAgentService('agent@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid email or password.');
  });

  // Test 7: Email normalization
  it('should normalize email to lowercase', async () => {
    mockFindUnique.mockResolvedValue({
      email_id: 'agent@example.com',
      password: 'password123',
      name: 'Test Agent',
    });

    await loginAgentService(
      'AGENT@EXAMPLE.COM',
      'password123'
    );

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        email_id: 'agent@example.com',
      },
    });
  });

  // Test 8: Email with spaces
  it('should trim spaces from email', async () => {
    mockFindUnique.mockResolvedValue({
      email_id: 'agent@example.com',
      password: 'password123',
      name: 'Test Agent',
    });

    await loginAgentService(
      '  agent@example.com  ',
      'password123'
    );

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        email_id: 'agent@example.com',
      },
    });
  });

  // Test 9: Agent password is missing
  it('should throw error when agent password is missing', async () => {
    mockFindUnique.mockResolvedValue({
      email_id: 'agent@example.com',
      password: null,
      name: 'Test Agent',
    });

    await expect(
      loginAgentService('agent@example.com', 'password123')
    ).rejects.toThrow('Invalid email or password.');
  });
});