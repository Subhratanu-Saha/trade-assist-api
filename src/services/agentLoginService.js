import { AppError } from '../utils/errors.js';
import prisma from '../utils/prisma.js';

export async function loginAgent(email, password) {
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const agent = await prisma.agent.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      role: true,
    },
  });

  if (!agent) {
    throw new AppError(404, 'User not found.');
  }

  const emailMatches = agent.email === normalizedEmail;
  const passwordMatches = agent.password && password === agent.password;

  if (!emailMatches || !passwordMatches) {
    throw new AppError(401, 'Invalid email or password.');
  }
  return {
    id: agent.id,
    email: agent.email,
    name: agent.name,
    role: agent.role || 'agent',
  };
}
