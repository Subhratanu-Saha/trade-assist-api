import prisma from '../utils/prisma.js';

export const customerService = {
    async findCustomerByEmail(email) {
        return prisma.customer.findUnique({
            where: {
                emailaddr: email,
            },
            include: {
                purchase: true,
            },
        });
    },
};