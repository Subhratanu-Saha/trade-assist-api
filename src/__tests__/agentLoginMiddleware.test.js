import { agentLoginMiddleware } from '../middleware/auth.js';

describe('agentLoginMiddleware', () => {
  const originalAgentKey = process.env.AGENT_LOGIN_KEY;

  afterEach(() => {
    if (originalAgentKey === undefined) {
      delete process.env.AGENT_LOGIN_KEY;
    } else {
      process.env.AGENT_LOGIN_KEY = originalAgentKey;
    }
  });

  it('allows an agent login when the credentials and key are valid', () => {
    process.env.AGENT_LOGIN_KEY = 'agent-secret';

    const req = {
      body: {
        email: 'agent@example.com',
        password: 'strong-password',
        agentKey: 'agent-secret',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    agentLoginMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.agent).toEqual(
      expect.objectContaining({
        email: 'agent@example.com',
        role: 'agent',
      })
    );
  });

  it('blocks an agent login when the key is missing or invalid', () => {
    process.env.AGENT_LOGIN_KEY = 'agent-secret';

    const req = {
      body: {
        email: 'agent@example.com',
        password: 'strong-password',
        agentKey: 'wrong-key',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    agentLoginMiddleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Invalid agent credentials' })
    );
  });
});
