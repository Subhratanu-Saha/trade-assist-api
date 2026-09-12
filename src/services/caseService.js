import prisma from '../utils/prisma.js';
import { AppError } from '../utils/errors.js';

const updateableFields = [
  'name',
  'emailaddr',
  'contactnum',
  'dob',
  'gender',
  'address',
  'isactive',
];

export async function updateCase(caseId, fields) {
  const existingCase = await prisma.customer.findUnique({
    where: { customerid: caseId },
  });

  if (!existingCase) {
    throw new AppError(404, 'Case not found');
  }

  const data = Object.fromEntries(
    updateableFields
      .filter((field) => fields[field] !== undefined)
      .map((field) => [
        field,
        field === 'dob' && fields[field] !== null
          ? new Date(fields[field])
          : fields[field],
      ])
  );

  if (Object.keys(data).length === 0) {
    throw new AppError(400, 'At least one case field is required');
  }

  data.syslastmodifieddt = new Date();

  return prisma.customer.update({
    where: { customerid: caseId },
    data,
  });
}