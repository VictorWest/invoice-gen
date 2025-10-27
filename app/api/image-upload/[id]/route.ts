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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }){
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, { status: 400})

    const { id } = await params

    try {
        const imageToDisplay = await prisma.imageUpload.findFirst({
            where: {
                userEmail: session.user.email,
                invoiceId: id
            }
        })

        if (imageToDisplay){
            return NextResponse.json({ imageToDisplay }, { status: 200 })
        }
        return NextResponse.json({message: id}, { status: 400 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There was an error"}, { status: 500 })
    } finally{
        await prisma.$disconnect()
    }
}

export async function POST(request: NextRequest){
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, { status: 400})
    const data = await request.json()

    try {
        const response = await prisma.imageUpload.create({
            data: {
                userEmail: session?.user?.email,
                url: data.url,
                fileId: data.fileId,
                invoiceId: data.invoiceId
            }
        })
        return NextResponse.json({ message: "Successfully saved image" }, { status: 200 })
    } catch (error) {
       console.log(error)
        return NextResponse.json({message: "There was an error"}, { status: 500 })
    } finally{
        await prisma.$disconnect()
    }
}