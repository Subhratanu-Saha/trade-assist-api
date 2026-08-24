import prisma from "../utils/prisma.js";
export async function getPurchasesByCustomerId(customerId) {
    const purchases = await prisma.purchase.findMany({
        where: {
            customerid: customerId,
        },
    });

    return purchases;
}