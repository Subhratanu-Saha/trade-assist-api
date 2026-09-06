import { AppError } from '../utils/errors.js';
import { config } from '../config/index.js';
import prisma from '../utils/prisma.js';

export async function loginAgentService(email, password) {
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required.');
  }

  if (!config.database.url) {
    throw new AppError(503, 'Agent login is unavailable because DATABASE_URL is not configured.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const agent = await prisma.agent.findUnique({
    where: { email_id: normalizedEmail },
  });

  if (!agent) {
    throw new AppError(404, 'User not found.');
  }

  const emailMatches = normalizedEmail === agent.email_id;
  const passwordMatches = Boolean(agent.password && password === agent.password);

  if (!emailMatches || !passwordMatches) {
    throw new AppError(401, 'Invalid email or password.');
  }

  return {
    email: agent.email_id,
    name: agent.name,
    role: 'agent',
  };
}
