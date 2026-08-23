import prisma from "../utils/prisma.js";

export async function searchCustomer(search) {
  if (!search) {
    return [];
  }

  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        {
          customerid: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          emailaddr: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          contactnum: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  return customers;
}