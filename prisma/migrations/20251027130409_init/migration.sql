-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoiceId" TEXT NOT NULL,
    "invoiceTitle" TEXT NOT NULL,
    "fromName" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "fromPhone" TEXT NOT NULL,
    "fromBusiness" TEXT,
    "billToName" TEXT NOT NULL,
    "billToEmail" TEXT NOT NULL,
    "billToAddress" TEXT NOT NULL,
    "billToPhone" TEXT NOT NULL,
    "billToMobile" TEXT,
    "billToFax" TEXT,
    "invoiceNumber" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "lineItems" JSONB[],
    "taxData" JSONB NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "tax" DECIMAL(65,30) NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "signatureUrl" TEXT NOT NULL,
    "discountData" JSONB NOT NULL,
    "templateColour" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "selectedCurrency" JSONB NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageUpload" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEmail" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "ImageUpload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceId_key" ON "Invoice"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageUpload_invoiceId_key" ON "ImageUpload"("invoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageUpload_url_key" ON "ImageUpload"("url");

-- CreateIndex
CREATE UNIQUE INDEX "ImageUpload_fileId_key" ON "ImageUpload"("fileId");
