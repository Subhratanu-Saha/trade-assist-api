
import prisma from "../utils/prisma.js";

const FUND_ID_PATTERN = /^F(\d+)$/;
const MAX_FUND_ID_ATTEMPTS = 10;

export async function createFund() {
    for (let attempt = 0; attempt < MAX_FUND_ID_ATTEMPTS; attempt += 1) {
        const existingFunds = await prisma.customerFund.findMany({
            where: {
                fundId: {
                    startsWith: "F",
                },
            },
            select: {
                fundId: true,
            },
        });

        const highestSequence = existingFunds.reduce((highest, fund) => {
            const match = FUND_ID_PATTERN.exec(fund.fundId);

            if (!match) {
                return highest;
            }

            const sequence = BigInt(match[1]);
            return sequence > highest ? sequence : highest;
        }, 0n);
        const fundId = `F${(highestSequence + 1n).toString().padStart(6, "0")}`;

        try {
            return await prisma.customerFund.create({
                data: {
                    fundId,
                    tenderType: null,
                    fundAmount: null,
                    reasonForFund: null,
                    status: null,
                    customerId: null,
                    AgentId: null,
                    Approver: null,
                },
            });
        } catch (error) {
            if (error?.code !== "P2002") {
                throw error;
            }

            if (attempt === MAX_FUND_ID_ATTEMPTS - 1) {
                throw new Error(
                    `Unable to create a fund after ${MAX_FUND_ID_ATTEMPTS} ID collision retries: ${error.message}`
                );
            }
        }
    }
}

export async function updateFund({
    fundId,
    customerId,
    agentId,
    tenderType,
    fundAmount,
    reasonForFund,
    status,
    Approver,
}) {
    const existingFund = await prisma.customerFund.findUnique({
        where: {
            fundId,
        },
    });

    if (!existingFund) {
        return null;
    }
    const optionalFields = {
        tenderType,
        fundAmount,
        reasonForFund,
        status,
        Approver,
    };

    const data = {
        customerId,
        AgentId: agentId,
        sysLastModifiedDt: new Date(),
         ...Object.fromEntries(
            Object.entries(optionalFields).filter(
                ([, value]) => value !== undefined
            )
        ),
    };

   
    

    const updatedFund = await prisma.customerFund.update({
        where: {
            fundId,
        },
        data,
    });

    return updatedFund;
}

export const getFundsByCustomerId = async (customerId) => {
  return prisma.customerFund.findMany({
    where: {
      customerId,
    },
    orderBy: {
      sysCreatedDt: 'desc',
    },
  });
};

export const getFundByFundId = async (fundId) => {
  return prisma.customerFund.findUnique({
    where: {
      fundId,
    },
  });
};
