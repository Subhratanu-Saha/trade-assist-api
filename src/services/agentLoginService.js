import { AppError } from '../utils/errors.js';
import prisma from '../utils/prisma.js';

export async function loginAgent(email, password) {
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const agent = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
      role: true,
      active: true,
    },
  });

  if (!agent) {
    throw new AppError(401, 'Invalid email or password.');
  }

  const passwordMatches = agent.password && password === agent.password;

  if (!passwordMatches) {
    throw new AppError(401, 'Invalid email or password.');
  }

  if (agent.active === false) {
    throw new AppError(403, 'Agent account is disabled.');
  }

  // Return only the essential authenticated agent details.
  return {
    id: agent.id,
    email: agent.email,
    name: agent.name,
    role: agent.role || 'agent',
  };
}
