import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { question, answer, category, order, isActive } = body

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category,
        order,
        isActive,
      },
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error("Failed to create FAQ:", error)
    return NextResponse.json(
      { error: "Failed to create FAQ" },
      { status: 500 }
    )
  }
}