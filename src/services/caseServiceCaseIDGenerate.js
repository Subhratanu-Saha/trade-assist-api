import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateCaseId = async () => {
  const result = await prisma.$queryRaw`
    SELECT MAX(CAST("caseId" AS INTEGER)) AS "maxCaseId"
    FROM "customer_case"
  `;

  const nextCaseId = String((result[0].maxCaseId ?? 0) + 1);

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