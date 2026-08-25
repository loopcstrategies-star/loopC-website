-- AlterTable
ALTER TABLE "Company" ADD COLUMN IF NOT EXISTS "externalErpCustomerId" TEXT;

-- Drop leftover tenant ERP product tables (not used by this sales/admin portal)
DROP TABLE IF EXISTS "SalesInvoiceLine" CASCADE;
DROP TABLE IF EXISTS "SalesInvoice" CASCADE;
DROP TABLE IF EXISTS "CatalogItem" CASCADE;
DROP TABLE IF EXISTS "Party" CASCADE;

-- DropEnum
DROP TYPE IF EXISTS "SalesInvoiceStatus";
