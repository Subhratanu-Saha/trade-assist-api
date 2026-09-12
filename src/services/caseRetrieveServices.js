import prisma from '../utils/prisma.js';

export async function getCaseByCaseId(caseId) {

  if (!caseId) {
    return null;
  }

  return prisma.caseRecord.findUnique({
    where: {
      caseId: caseId,
    },
  });
}