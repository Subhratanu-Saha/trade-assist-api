import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const retrieveFund = async (fundId) => {
    const fund = await prisma.fund.findUnique({
        where: {
            fundId: Number(fundId)
        }
    });

    return fund;
};

export default {
    retrieveFund
};