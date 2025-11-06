"use server"
import { GoodbyePremiumEmailTemplate, InvoiceEmailTemplate, WelcomePremiumEmailTemplate } from "@/components/email-template"
import { Resend } from "resend"
import { InvoiceData } from "./interfaces/interfaces"
import { formatDateDayMonth } from "./helpers"
import { PlanStatus } from "@/generated/prisma"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendInvoiceEmail = async (email: string, invoiceData: InvoiceData, selectedCurrency: any, filename: string, buffer: any) => {
    try {
        const { data, error } = await resend.emails.send({
            to: email,
            from: "InvoiceGen <customerservice@merchlyach.com>",
            subject: "Notice of Invoice",
            react: await InvoiceEmailTemplate({ 
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

type TypeOfSubscriptionMail = "confirmation" | "termination"

export const sendSubscriptionEmail = async (email: string, customerName: string, planName: PlanStatus, typeOfMail: TypeOfSubscriptionMail) => {
    try {
        const subject = typeOfMail === "confirmation" ? 
            "Welcome to InvoiceGen Premium!"
            : "Sorry to See You Go — InvoiceGen Premium"

        const reactTemplate = 
                typeOfMail === "confirmation" ? 
                    await WelcomePremiumEmailTemplate({ 
                        name: customerName,
                        planName
                    }) 
                    : 
                    await GoodbyePremiumEmailTemplate({ 
                        name: customerName,
                        planName
                    })

        const { data, error } = await resend.emails.send({
            to: email,
            from: "InvoiceGen <customerservice@merchlyach.com>",
            subject,
            react: reactTemplate
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