import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateCaseId = async (customerId, agentId) => {
  const cases = await prisma.caseRecord.findMany({
    select: {
      caseId: true,
    },
  });

  let maxNumber = 0;

  for (const record of cases) {
    const match = /^cust_(\d+)$/.exec(record.caseId);

    if (match) {
      const number = Number(match[1]);

      if (number > maxNumber) {
        maxNumber = number;
      }
    }
  }

  const nextCaseId = `cust_${String(maxNumber + 1).padStart(3, "0")}`;

  const newCase = await prisma.caseRecord.create({
    data: {
      caseId: nextCaseId,
      customerId,
      agentId,
    },
  });

  return newCase.caseId;
};

export default {
  generateCaseId,
};