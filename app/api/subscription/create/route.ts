import { PrismaClient } from "@/generated/prisma";
import { PlanStatus } from "@/utils/data";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.PRISMA_DATABASE_URL
        }
    }
})

export async function POST(request: NextRequest){
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, {status: 400})
    
    const user = await prisma.user.findFirst({
        where: {
            email: session.user.email
        }
    })
    if (!user) return NextResponse.json({message: "User not found"}, {status: 400})

    const { plan } = await request.json()
    
    try {
        // Payment logic
        console.log(plan)
        // await prisma.subscription.create({
        //     data: {
        //         userId: user.id,
        //         plan,
        //         status: "ACTIVE",
        //         startDate: new Date(),
        //     }
        // })
        return NextResponse.json({}, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "There was an error" }, { status: 500 })
    }
}