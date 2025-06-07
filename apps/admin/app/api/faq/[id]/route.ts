import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()

    const faq = await prisma.fAQ.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error("Failed to update FAQ:", error)
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    await prisma.fAQ.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete FAQ:", error)
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 }
    )
  }
}