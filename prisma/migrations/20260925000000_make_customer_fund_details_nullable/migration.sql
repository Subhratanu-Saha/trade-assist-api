-- Allow a fund to be created before the Update Fund API supplies its details.
ALTER TABLE "customer_fund"
  ALTER COLUMN "tenderType" DROP NOT NULL,
  ALTER COLUMN "fundAmount" DROP NOT NULL,
  ALTER COLUMN "status" DROP NOT NULL,
  ALTER COLUMN "customerId" DROP NOT NULL;