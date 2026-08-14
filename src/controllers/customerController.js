import { customerService } from '../services/customerService.js';

export const getCustomerByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        const customer = await customerService.findCustomerByEmail(email);

        // Customer not found
        if (!customer) {
            return res.status(404).json({
                success: true,
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
        // Expected client-side error
        if (error.statusCode === 400) {
            return res.status(400).json({
                success: false,
                responseCode: 400,
                err: error.message,
            });
        }

        // Unexpected server error
        return res.status(500).json({
            success: false,
            responseCode: 500,
            err: error.message,
        });
    }
};