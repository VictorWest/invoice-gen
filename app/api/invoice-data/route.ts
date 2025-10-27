import { PrismaClient } from "@/generated/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.PRISMA_DATABASE_URL
        }
    }
})

export async function POST(req: NextRequest){
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, { status: 400})

    const { selectedCurrency, invoiceData, lineItems, taxData, discountData, calculateTotal, templateColour } = await req.json()

    const { id, invoiceTitle, fromName, fromEmail, fromAddress, fromPhone, 
        fromBusiness, billToName, billToEmail, billToAddress, billToPhone, billToMobile, 
        billToFax, invoiceNumber, date, terms, signatureUrl,notes } = invoiceData


    const data = {
                userEmail: session?.user?.email || '',
                selectedCurrency: selectedCurrency,
                invoiceId: id,
                invoiceTitle,
                fromName,
                fromEmail,
                fromAddress,
                fromPhone,
                fromBusiness, 
                billToName, 
                billToEmail, 
                billToAddress, 
                billToPhone, 
                billToMobile, 
                billToFax, 
                invoiceNumber, 
                date, 
                terms,
                lineItems,
                taxData,
                discountData,
                subtotal: calculateTotal?.subtotal,
                tax: calculateTotal?.tax,
                total: calculateTotal?.total,
                balance: calculateTotal?.total,
                templateColour,
                signatureUrl,
                notes
            }
    try {
        await prisma.invoice.create({
            data
        })
        return NextResponse.json(
            { message: "Invoice saved successfully"},
            { status: 201 }
        )
    } catch (error: any) {
        if (error.code === "P2002"){
            await prisma.invoice.update({
                where: {
                    userEmail: session?.user?.email,
                    invoiceId: id
                }, 
                data
            })
            return NextResponse.json(
                { message: "Invoice updated successfully"},
                { status: 200 }
            )
        }
        return NextResponse.json(
            { message: "Something went wrong." },
            { status: 500 }
        );
    } finally{
        await prisma.$disconnect()
    }
}