import prisma from '../utils/prisma.js';

export const getCasesByCustomerId = async (customerId) => {
  const cases = await prisma.caseRecord.findMany({
    where: {
      customerId: customerId,
    },
  });

  return cases;
};