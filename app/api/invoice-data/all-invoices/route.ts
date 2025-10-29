import { PrismaClient } from "@/generated/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.PRISMA_DATABASE_URL
        }
    }
})

export async function GET(){
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, {status: 400})
    
    try {
        const data = await prisma.invoice.findMany({
            where: {
                userEmail: session?.user?.email
            },
            orderBy: {
                date: 'desc'
            }
        })
        return NextResponse.json({ data }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: "There was an error "}, { status: 500 })
    }
}