import { Prisma } from '@prisma/client';
import prisma, { getPrismaClient } from '../utils/prisma.js';

const FUND_ID_PATTERN = /^F(\d+)$/;
const MAX_CREATE_RETRIES = 3;

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
      Object.entries(optionalFields).filter(([, value]) => value !== undefined)
    ),
  };

  return prisma.customerFund.update({
    where: {
      fundId,
    },
    data,
  });
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

const getNextFundId = async (prismaClient) => {
  const funds = await prismaClient.customerFund.findMany({
    select: { fundId: true },
  });

  const maxFundNumber = funds.reduce((max, fund) => {
    const match = FUND_ID_PATTERN.exec(fund.fundId);
    const fundNumber = match ? Number(match[1]) : 0;

    return Number.isSafeInteger(fundNumber) && fundNumber > max
      ? fundNumber
      : max;
  }, 0);

  return `F${String(maxFundNumber + 1).padStart(6, '0')}`;
};

export const createFund = async () => {
  for (let attempt = 0; attempt < MAX_CREATE_RETRIES; attempt += 1) {
    try {
      return await getPrismaClient().$transaction(
        async (prismaClient) => {
          const fundId = await getNextFundId(prismaClient);

          const fund = await prismaClient.customerFund.create({
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
            select: { fundId: true },
          });

          return fund.fundId;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );
    } catch (error) {
      if (
        (error?.code === 'P2002' || error?.code === 'P2034') &&
        attempt < MAX_CREATE_RETRIES - 1
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error('Unable to create fund');
};
