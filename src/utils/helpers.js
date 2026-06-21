export const formatError = (error) => {
  if (typeof error === 'string') {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return 'An unknown error occurred';
};

export const sanitizeObject = (obj, fieldsToRemove = ['password', 'secret', 'token']) => {
  const sanitized = { ...obj };

  fieldsToRemove.forEach((field) => {
    delete sanitized[field];
  });

  return sanitized;
};

export const calculatePagination = (page = 1, limit = 10, total) => {
  const currentPage = Math.max(1, page);
  const pageSize = Math.min(limit, 100);
  const skip = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(total / pageSize);

  return {
    page: currentPage,
    limit: pageSize,
    skip,
    total,
    pages: totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};
