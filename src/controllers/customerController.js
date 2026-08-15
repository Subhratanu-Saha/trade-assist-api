import { searchCustomer } from '../services/customerSearchService.js';

export const getCustomerByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                responseCode: 400,
                err: 'Email is required',
            });
        }

        const customers = await searchCustomer(email);

        // Find exact email match
        const customer = customers.find(
            (customer) =>
                customer.emailaddr?.toLowerCase() === email.toLowerCase()
        );

        // Customer not found
        if (!customer) {
            return res.status(404).json({
                success: false,
                responseCode: 404,
                customerRecord: null,
            });
        }

        // Customer found
        return res.status(200).json({
            success: true,
            responseCode: 200,
            customerRecord: customer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            responseCode: 500,
            err: error.message,
        });
    }
};