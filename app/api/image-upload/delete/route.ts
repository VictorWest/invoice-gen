import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.PRISMA_DATABASE_URL
    }
  }
})

export async function POST(req: NextRequest) {
  const { fileId } = await req.json();

  try {
    const deleteResponse = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.PRIVATE_KEY + ":").toString("base64")}`,
      },
    });

    if (!deleteResponse.ok) {
      const text = await deleteResponse.text();
      console.log(text)
      return NextResponse.json({text}, { status: deleteResponse.status })
    }

    await prisma.imageUpload.delete({
      where: { fileId }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
