import fundService from "../services/fundService.js";

export const retrieveFund = async (req, res) => {
    try {
        const { fundId } = req.query;

        if (!fundId) {
            return res.status(400).json({
                message: "fundId is required"
            });
        }

        const fund = await fundService.retrieveFund(fundId);

        if (!fund) {
            return res.status(404).json({
                message: "Fund not found"
            });
        }

        return res.status(200).json(fund);

    } catch (error) {
        console.error("Error retrieving fund:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};