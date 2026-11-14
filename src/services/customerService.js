
import prisma from "../utils/prisma.js";

export async function createCustomer(customerData) {
  const customer = await prisma.customer.create({
    data: customerData,
  });

  return customer;
}
