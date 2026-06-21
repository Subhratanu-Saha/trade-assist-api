export const prismaErrorHandler = (error) => {
  if (error.code === 'P2002') {
    const target = error.meta?.target?.[0];
    return `A record with this ${target} already exists`;
  }

  if (error.code === 'P2025') {
    return 'The requested record was not found';
  }

  if (error.code === 'P2003') {
    return 'Foreign key constraint failed';
  }

  return 'A database error occurred';
};

export const isValidId = (id) => {
  return Number.isInteger(id) && id > 0;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
