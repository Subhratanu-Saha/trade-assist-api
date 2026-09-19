import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateCaseId = async () => {
  const cases = await prisma.caseRecord.findMany({
    select: {
      caseId: true,
    },
  });

  let maxNumber = 10000000;

  for (const record of cases) {
    const number = Number(record.caseId);

    if (Number.isInteger(number) && number > maxNumber) {
      maxNumber = number;
    }
  }

  const nextCaseId = String(maxNumber + 1);

  const newCase = await prisma.caseRecord.create({
    data: {
      caseId: nextCaseId,
      customerId: null,
      agentId: null,
    },
  });

  return newCase.caseId;
};

export default {
  generateCaseId,
};