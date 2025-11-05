import { PlanStatus, PrismaClient } from "@/generated/prisma";
import { PaymentDetails } from "@/utils/interfaces/interfaces";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.PRISMA_DATABASE_URL
        }
    }
})

const acceptBlueUsername = process.env.ACCEPT_BLUE_USERNAME
const acceptBluePassword = process.env.ACCEPT_BLUE_PASSWORD
const acceptBlueToken = btoa(`${acceptBlueUsername}:${acceptBluePassword}`)
const monthlyPayment = process.env.MONTHLY_SUBSCRIPTION_AMOUNT || "9.99"
const annualPayment = process.env.ANNUAL_SUBSCRIPTION_AMOUNT || "99.99"

const customerRoute = "https://api.sandbox.accept.blue/api/v2/customers"
const paymentMethodRoute = (id: string | number) => `${customerRoute}/${id}/payment-methods`
const recurringPaymentRoute = (id: string | number) => `${customerRoute}/${id}/recurring-schedules`

export async function GET(){
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, {status: 400})
    
        const user = await prisma.user.findFirst({
        where: {
            email: session.user.email
        }
    })

    if (!user) return NextResponse.json({message: "User not found"}, {status: 400})

    const response = await prisma.subscription.findFirst({
        where: {
            user
        }
    })

    if (!response){
        return NextResponse.json({message: "Subscription not found"}, {status: 400})
    }

    return NextResponse.json({ data: response }, { status: 200 })
}

export async function POST(request: NextRequest){
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, {status: 400})
    
    const user = await prisma.user.findFirst({
        where: {
            email: session.user.email
        }
    })

    if (!user) return NextResponse.json({message: "User not found"}, {status: 400})

    const { paymentDetails, plan } = await request.json()
    
    try {
        // Payment logic
        const customerResponse = await handleCreateCustomer(paymentDetails)
        const paymentMethodResponse = await handleCreatePaymentMethod(paymentDetails, customerResponse.id)
        const recurringMethodResponse = await handleCreateRecurringPayment(paymentDetails, customerResponse.id, paymentMethodResponse.id, plan)

        if (recurringMethodResponse) {
            await prisma.subscription.create({
                data: {
                    userId: user.id,
                    plan,
                    status: "ACTIVE",
                    startDate: new Date(),
                }
            })
            return NextResponse.json({ message: "Succesfully created subscription"}, { status: 200 })
        }
    } catch (error) {
        return NextResponse.json({ message: "There was an error" }, { status: 500 })
    }
}

const handleCreateCustomer = async (paymentDetails: PaymentDetails) => {
    const { firstName, lastName, email, mobileNumber, streetName, city, state, zip, country } = paymentDetails
    try {
        const response = await fetch(customerRoute, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${acceptBlueToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "identifier": `${firstName} ${lastName}`,
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "phone": mobileNumber,
                "billing_info": {
                    "street": streetName,
                    "city": city,
                    "state": state,
                    "zip": zip,
                    "country": country
                },
                "active": true
            })
        })

        if (response.ok){
            const data = await response.json()
            return data
        }
    } catch (error) {
        console.log(error)
    }
}

const handleCreatePaymentMethod = async (paymentDetails: PaymentDetails, customerID: string | number) => {
    const { firstName, lastName, streetName, city, state, zip, country, expiryMonth, expiryYear, cardNumber } = paymentDetails
    const route = paymentMethodRoute(customerID)

    const response = await fetch(route, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${acceptBlueToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "avs_address": `${streetName}, ${city}, ${state}, ${country}`,
            "avs_zip": zip,
            "name": `${firstName} ${lastName}`,
            "expiry_month": parseInt(expiryMonth),
            "expiry_year": parseInt(expiryYear),
            "card": cardNumber
        })
    })

    if (!response.ok){
        const data = await response.json()
        if (response.status == 409){
            return data.error_details?.payment_method
        }
        throw new Error(data.error_message)
    }

    if (response.ok){
        const data = await response.json()
        return data
    }
}

const handleCreateRecurringPayment = async (paymentDetails: PaymentDetails, customerID: string | number, paymentMethodID: string | number, plan: PlanStatus) => {
    const { email } = paymentDetails
    const route = recurringPaymentRoute(customerID)

    try {
        const response = await fetch(route, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${acceptBlueToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "title": `${plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase()} Premium Plan`,
                "frequency": `${plan.toLowerCase()}`,
                "amount": plan === "MONTHLY" ? parseFloat(monthlyPayment) : plan === "ANNUAL" && parseFloat(annualPayment),
                "payment_method_id": paymentMethodID,
                "receipt_email": email,
            })
        })
    
        if (response.ok){
            const data = await response.json()
            return data
        }
        return null
    } catch (error) {
        console.log(error)
        return null
    }
}