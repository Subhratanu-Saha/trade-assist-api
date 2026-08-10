import { AppError } from '../utils/errors.js';

export const customerSearchMiddleware = (req, res, next) => {
    try {
        const { email } = req.query;

        if (!email || !email.trim()) {
            return next(
                new AppError(400, 'Email query parameter is required')
            );
        }

        const trimmedEmail = email.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            return next(
                new AppError(400, 'Invalid email format')
            );
        }

        req.query.email = trimmedEmail;

        next();
    } catch (error) {
        return next(
            new AppError(500, 'Customer search middleware failed')
        );
    }
};