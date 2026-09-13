const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const generateCaseId = async () => {
  const cases = await prisma.caseRecord.findMany({
    select: {
      caseId: true,
    },
  });

  let maxNumber = 0;

  for (const record of cases) {
    const match = /^CUST_(\d+)$/.exec(record.caseId);

    if (match) {
      const number = Number(match[1]);

      if (number > maxNumber) {
        maxNumber = number;
      }
    }
  }

  const nextCaseId = `CUST_${String(maxNumber + 1).padStart(3, "0")}`;

  const newCase = await prisma.caseRecord.create({
    data: {
      caseId: nextCaseId,
    },
  });

  return newCase.caseId;
};

module.exports = {
  generateCaseId,
};