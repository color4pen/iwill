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
    const { name, email, expiresAt, notes } = body

    const invitation = await prisma.invitation.create({
      data: {
        name,
        email,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        notes,
      },
    })

    return NextResponse.json(invitation)
  } catch (error) {
    console.error("Failed to create invitation:", error)
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    )
  }
}