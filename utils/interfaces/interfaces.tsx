import { DiscountCategory, InvoiceTerms, TaxCategory } from "@/utils/data"

export type InvoiceData = {
    invoiceTitle: string,
    fromName: string,
    fromEmail: string,
    fromAddress: string,
    fromPhone: string,
    fromBusiness?: string,
    billToName: string,
    billToEmail: string,
    billToAddress: string,
    billToPhone: string,
    billToMobile?: string,
    billToFax?: string,
    invoiceNumber: string,
    invoiceId: string,
    date: string,
    terms: InvoiceTerms,
    lineItems: LineItemType[],
    subtotal: number,
    tax: number,
    total: number,
    balance: number,
    signatureUrl: string,
    notes: string
}

export type LineItemType = {
    index: number,
    description: string,
    rate: number,
    quantity: number,
    amount: number,
    tax: boolean
}


export interface TaxData {
  type: TaxCategory, 
  label: string, 
  rate: number,
  inclusive: boolean
}

export interface DiscountData {
  type: DiscountCategory,
  amount: number,
  calculatedAmount: number
}

export interface UploadedImage { 
    url: string, 
    fileId: string, 
    invoiceId: string
}

export interface PaymentDetails {
  firstName: string,
  lastName: string,
  email: string,
  mobileNumber: string,
  streetName: string,
  city: string,
  state: string,
  country: string,
  zip: string,
  billingAddress: string,
  billingName: string,
  cardNumber: string,
  expiryMonth: string,
  expiryYear: string
}