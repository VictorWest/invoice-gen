"use server"
import { EmailTemplate } from "@/components/email-template"
import { Resend } from "resend"
import { InvoiceData } from "./interfaces/interfaces"
import { formatDateDayMonth } from "./helpers"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendInvoiceEmail = async (email: string, invoiceData: InvoiceData, selectedCurrency: any, filename: string, buffer: any) => {
    try {
        const { data, error } = await resend.emails.send({
            to: email,
            from: "InvoiceGen <customerservice@merchlyach.com>",
            subject: "Notice of Invoice",
            react: await EmailTemplate({ 
                billToName: invoiceData?.billToName,
                companyName: invoiceData?.fromBusiness || invoiceData?.fromName,
                companyEmail: invoiceData?.fromEmail,
                companyPhone: invoiceData?.fromPhone,
                invoiceNumber: invoiceData?.invoiceNumber,
                invoiceDate: formatDateDayMonth(invoiceData?.date),
                currencySymbol: selectedCurrency?.symbol,
                totalAmount: invoiceData?.balance
            }),
            attachments: [{
                filename,
                content: buffer,
                contentType: "application/pdf"
            }]
        })

        if (error) {
            console.log("Email error:", error)
        } else {
            console.log("Email sent")
        }
        
        return {data, error}        
    } catch (error) {
        console.log(error)
    }
}