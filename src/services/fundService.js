import prisma from '../utils/prisma.js';

export const getFundsByCustomerId = async (customerId) => {
  return prisma.customerFund.findMany({
    where: {
      customerId: customerId,
    },
    orderBy: {
      sysCreatedDt: 'desc',
    },
  });
};