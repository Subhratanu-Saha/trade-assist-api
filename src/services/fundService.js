
import prisma from "../utils/prisma.js";

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
