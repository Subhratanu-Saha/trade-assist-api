
import { AppError } from "../utils/errors.js";

export const customerCreationMiddleware = (req, res, next) => {
  try {
    const body = req.body;

    // Validate request body
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return next(new AppError(400, "Invalid request body"));
    }

    const {
      customerid,
      name,
      emailaddr,
      contactnum,
      dob,
      gender,
      address,
    } = body;

    // Validate required fields
    if (
      typeof customerid !== "string" ||
      !customerid.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof emailaddr !== "string" ||
      !emailaddr.trim()
    ) {
      return next(
        new AppError(
          400,
          "Customer ID, name and email are required"
        )
      );
    }

    // Normalize required fields
    const trimmedCustomerId = customerid.trim();
    const trimmedName = name.trim();
    const trimmedEmail = emailaddr.trim();

    // Validate email length before format validation
    // Database column is VARCHAR(150)
    if (trimmedEmail.length > 150) {
      return next(new AppError(400, "Email is too long"));
    }

    // Validate email structure
    const emailParts = trimmedEmail.split("@");

    if (emailParts.length !== 2) {
      return next(new AppError(400, "Invalid email format"));
    }

    const [localPart, domain] = emailParts;

    // Validate local part
    const localPartRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;

    if (
      !localPart ||
      localPart.length > 64 ||
      !localPartRegex.test(localPart) ||
      localPart.startsWith(".") ||
      localPart.endsWith(".") ||
      localPart.includes("..")
    ) {
      return next(new AppError(400, "Invalid email format"));
    }

    // Validate domain
    const domainParts = domain.split(".");

    if (domainParts.length < 2) {
      return next(new AppError(400, "Invalid email format"));
    }

    for (const part of domainParts) {
      if (
        !part ||
        part.length > 63 ||
        !/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(part)
      ) {
        return next(new AppError(400, "Invalid email format"));
      }
    }

    // Validate top-level domain
    if (domainParts[domainParts.length - 1].length < 2) {
      return next(new AppError(400, "Invalid email format"));
    }

    // Validate customer ID length
    if (trimmedCustomerId.length > 40) {
      return next(new AppError(400, "Customer ID is too long"));
    }

    // Validate customer name length
    if (trimmedName.length > 100) {
      return next(new AppError(400, "Customer name is too long"));
    }

    // Validate optional fields
    if (
      contactnum !== undefined &&
      contactnum !== null &&
      (typeof contactnum !== "string" || contactnum.length > 15)
    ) {
      return next(new AppError(400, "Invalid contact number"));
    }

    if (
      gender !== undefined &&
      gender !== null &&
      (typeof gender !== "string" || gender.length !== 1)
    ) {
      return next(new AppError(400, "Invalid gender"));
    }

    if (
      address !== undefined &&
      address !== null &&
      typeof address !== "string"
    ) {
      return next(new AppError(400, "Invalid address"));
    }

    // Validate date of birth
    if (dob !== undefined && dob !== null) {
      if (
        typeof dob !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(dob)
      ) {
        return next(new AppError(400, "Invalid date of birth"));
      }

      const parsedDate = new Date(`${dob}T00:00:00.000Z`);

      if (
        Number.isNaN(parsedDate.getTime()) ||
        parsedDate.toISOString().slice(0, 10) !== dob
      ) {
        return next(new AppError(400, "Invalid date of birth"));
      }
    }

    // Whitelist permitted fields
    req.customerData = {
      customerid: trimmedCustomerId,
      name: trimmedName,
      emailaddr: trimmedEmail,
      ...(contactnum != null && {
        contactnum: contactnum.trim(),
      }),
      ...(dob != null && {
        dob: new Date(`${dob}T00:00:00.000Z`),
      }),
      ...(gender != null && {
        gender: gender.trim(),
      }),
      ...(address != null && {
        address: address.trim(),
      }),
    };

    next();

  } catch (error) {
    // Forward unexpected errors to centralized error handler
    next(error);
  }
};
