import prisma from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';

export const getCasesByCustomerId = async (customerId) => {
  const cases = await prisma.customer_case.findMany({
    where: {
      customerId: customerId,
    },
  });

  return cases;
};

const updateFields = [
  'contactChannel',
  'customerNeed',
  'employeeResponse',
  'orderNumber',
  'notes',
  'isEscalated',
  'isCompleted',
  'customerId',
  'agentId',
];

export const updateCase = async (payload) => {
  const caseId = String(payload.caseId);
  const existingCase = await prisma.customer_case.findUnique({
    where: { caseId },
  });

  if (!existingCase) {
    throw new AppError(404, 'Case not found');
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'customerId')) {
    const customer = await prisma.customer.findUnique({
      where: { customerid: payload.customerId },
      select: { customerid: true },
    });

    if (!customer) {
      throw new AppError(400, 'Invalid customerId');
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'agentId')) {
    const agent = await prisma.agent.findUnique({
      where: { userid: payload.agentId },
      select: { userid: true },
    });

    if (!agent) {
      throw new AppError(400, 'Invalid agentId');
    }
  }
  
  const data = Object.fromEntries(
    updateFields
      .filter((field) => Object.prototype.hasOwnProperty.call(payload, field))
      .map((field) => [field, payload[field]])
  );

  if (Object.keys(data).length === 0) {
    throw new AppError(400, 'At least one case field is required');
  }

  return prisma.customer_case.update({
    where: { caseId },
    data,
    select: {
      caseId: true,
      isCompleted: true,
    },
  });
};