import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.PRISMA_DATABASE_URL
        }
    }
})

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, { status: 400})

    const { id } = await params

    try {
        const response = await prisma.invoice.findFirst({
            where: {
                userEmail: session?.user?.email,
                invoiceId: id
            }
        })

        if (response){
            return NextResponse.json(response, { status: 200 })
        }
        return NextResponse.json({message: "Invoice not found"}, { status: 400 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There was an error"}, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }){
    const session = await getServerSession()
    if (!session?.user?.email) return NextResponse.json({message: "User not found"}, { status: 400})

    const { id } = await params

    try {
        const response = await prisma.invoice.delete({
            where: {
                userEmail: session?.user?.email,
                invoiceId: id
            }
        })

        if (response){
            try {
                const imageResponse = await prisma.imageUpload.findFirst({
                    where: {
                        userEmail: session?.user?.email,
                        invoiceId: id
                    }
                })
                if (imageResponse){
                    const response = await fetch(`${baseUrl}/api/image-upload/delete`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({fileId: imageResponse.fileId})
                    })
                    if (response.ok){
                        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 })
                    }
                }
            } catch (error) {
                console.log(error)
                return NextResponse.json({message: "There was an error"}, { status: 500 })
            }
        }
        
        return NextResponse.json({message: "Invoice not found"}, { status: 400 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "There was an error"}, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}