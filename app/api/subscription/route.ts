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
const paymentMethodRoute = (id: number) => `${customerRoute}/${id}/payment-methods`
const recurringPaymentRoute = (id: number) => `${customerRoute}/${id}/recurring-schedules`
const cancelRecurringPaymentRoute = (id: number) => `https://api.sandbox.accept.blue/api/v2/recurring-schedules/${id}`

// Get user subscription details
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

// Add a new subscription
export async function POST(request: NextRequest){
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, {status: 400})
    
    const user = await prisma.user.findFirst({
        where: {
            email: session.user.email
        }
    })

    if (!user) return NextResponse.json({message: "User not found"}, {status: 400})

    const { paymentDetails, plan } : { paymentDetails: PaymentDetails, plan: PlanStatus } = await request.json()
    
    try {
        // Payment logic
        const customerResponse = await handleCreateCustomer(paymentDetails)
        const paymentMethodResponse = await handleCreatePaymentMethod(paymentDetails, customerResponse.id)
        const recurringMethodResponse = await handleCreateRecurringPayment(paymentDetails, customerResponse.id, paymentMethodResponse.id, plan)

        if (recurringMethodResponse) {
            try {
                await prisma.user.update({
                    where: {
                        email: session.user.email
                    }, 
                    data: {
                        acceptBluecustomerID: customerResponse.id,
                        acceptBluepaymentMethodID: paymentMethodResponse.id,
                        acceptBlueRecurringPaymentID: recurringMethodResponse.id
                    }
                })

                const today = new Date()
                const tomorrow = new Date(today)
                tomorrow.setDate(today.getDate() + 1)
                const renewedAtDate = new Date(today)

                plan == "MONTHLY" ? renewedAtDate.setDate(tomorrow.getDate() + 30) : plan === "ANNUALLY" && renewedAtDate.setDate(tomorrow.getDate() + 365)

                const existingSubscription = await prisma.subscription.findFirst({
                    where: {
                        userId: user.id
                    }
                })

                if (existingSubscription){
                    await prisma.subscription.update({
                        where: { 
                            userId: user.id
                        },
                        data: {
                            customerName: `${paymentDetails?.firstName} ${paymentDetails?.lastName}`,
                            plan,
                            status: "ACTIVE",
                            startDate: tomorrow,
                            renewedAt: renewedAtDate,
                            endDate: renewedAtDate
                        }
                    })
                } else { 
                    await prisma.subscription.create({
                        data: {
                            userId: user.id,
                            customerName: `${paymentDetails?.firstName} ${paymentDetails?.lastName}`,
                            plan,
                            status: "ACTIVE",
                            startDate: tomorrow,
                            renewedAt: renewedAtDate,
                            endDate: renewedAtDate
                        }
                    })
                }
            } catch (error) {
                console.error(error)
                return NextResponse.json({ message: "There was an error creating your subscription."}, { status: 400 })
            }            
            return NextResponse.json({ message: "Succesfully created subscription"}, { status: 200 })
        }
        console.log(recurringMethodResponse)
        return NextResponse.json({ message: "There was an error creating your subscription."}, { status: 400 })
    } catch (error: any) {
        console.error(`Server error: ${error}`)
        return NextResponse.json(
            { message: error.message || "There was an error" },
            { status: error.status || 500 }
        )
    }
}

export async function DELETE(request: NextRequest){ // Cancel Subscription
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, {status: 400})
    
    const user = await prisma.user.findFirst({
        where: {
            email: session.user.email
        }
    })

    if (!user) return NextResponse.json({message: "User not found"}, {status: 400})

    if (user.acceptBlueRecurringPaymentID){
        const route = cancelRecurringPaymentRoute(user.acceptBlueRecurringPaymentID)
        try {
            const response = await fetch(route, {
                method: "DELETE",
                headers: {
                    "Authorization": `Basic ${acceptBlueToken}`,
                    "Content-Type": "application/json"
                },
            })

            if (!response.ok){
                console.log(response)
                return NextResponse.json({ message: "There was an unexpected error." }, { status: response.status })
            }

            const subscription = await prisma.subscription.update({
                where: {
                    userId: user.id
                },
                data: {
                    status: "CANCELED",
                    renewedAt: null
                }
            })
            return NextResponse.json({ email: user.email, customerName: subscription.customerName, planName: subscription.plan }, { status: 200 })
        } catch (error) {
            console.log(error)
            return NextResponse.json({ message: "There was an unexpected error." }, { status: 500 })
        }
    }
    return NextResponse.json({ message: "Could not find ID. Please log in again." }, { status: 400 })
}

const handleCreateCustomer = async (paymentDetails: PaymentDetails) => {
    const { firstName, lastName, email, mobileNumber, streetName, city, state, zip, country } = paymentDetails
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

    const data = await response.json()

    if (!response.ok){
        throw { status: response.status, message: data.error_message || "Failed to create customer" }
    }
    return data
}

const handleCreatePaymentMethod = async (paymentDetails: PaymentDetails, customerID: number) => {
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

    const data = await response.json()

    if (!response.ok){
        if (response.status === 409){
            throw { status: 409, message: "Invalid card details. Please check your card number or expiry date."}
        }
        throw { status: response.status, message: data.error_message || "Failed to create payment method" }
    }
    return data
}

const handleCreateRecurringPayment = async (paymentDetails: PaymentDetails, customerID: number, paymentMethodID: number, plan: PlanStatus) => {
    const { email } = paymentDetails
    const route = recurringPaymentRoute(customerID)

    const response = await fetch(route, {
        method: "POST",
        headers: {
            "Authorization": `Basic ${acceptBlueToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "title": `InvoiceGen Premium Plan`,
            "frequency": `${plan.toLowerCase()}`,
            "amount": plan === "MONTHLY" ? parseFloat(monthlyPayment) : plan === "ANNUALLY" && parseFloat(annualPayment),
            "payment_method_id": paymentMethodID,
            "receipt_email": email,
        })
    })

    const data = await response.json()

    if (!response.ok){
        throw { status: response.status, message: data.error_message || "Failed to create recurring payment" }
    }
    return data   
}