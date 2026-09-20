import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateCaseId = async () => {
const cases = await prisma.caseRecord.findMany({
select: {
caseId: true,
},
});

const maxCaseId = cases.reduce((max, current) => {
const caseId = Number(current.caseId);

return caseId > max ? caseId : max;

}, 0);

const nextCaseId = String(maxCaseId + 1);

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