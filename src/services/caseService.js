import prisma from "../utils/prisma.js";

export const getCasesByCustomerId = async (customerId) => {
  const cases = await prisma.caseRecord.findMany({
    where: {
      customerId: customerId,
    },
  });

  const open = cases.filter((caseItem) => caseItem.status === "open");

  const closed = cases.filter((caseItem) => caseItem.status === "closed");

  return {
    open,
    closed,
  };
};