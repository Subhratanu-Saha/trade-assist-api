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

    const data = {
        customerId,
        AgentId: agentId,
        sysLastModifiedDt: new Date(),
    };

    if (tenderType !== undefined) {
        data.tenderType = tenderType;
    }

    if (fundAmount !== undefined) {
        data.fundAmount = fundAmount;
    }

    if (reasonForFund !== undefined) {
        data.reasonForFund = reasonForFund;
    }

    if (status !== undefined) {
        data.status = status;
    }

    if (Approver !== undefined) {
        data.Approver = Approver;
    }

    const updatedFund = await prisma.customerFund.update({
        where: {
            fundId,
        },
        data,
    });

    return updatedFund;
}