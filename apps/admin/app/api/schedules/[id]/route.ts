import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const schedule = await prisma.schedule.findUnique({
      where: { id: params.id },
    })

    if (!schedule) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(schedule)
  } catch (error) {
    console.error("Failed to fetch schedule:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await request.json()
    const { time, title, description, icon, colorBg, colorText, order, isActive } = json

    const schedule = await prisma.schedule.update({
      where: { id: params.id },
      data: {
        time,
        title,
        description,
        icon,
        colorBg,
        colorText,
        order,
        isActive,
      },
    })

    return NextResponse.json(schedule)
  } catch (error) {
    console.error("Failed to update schedule:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.schedule.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Failed to delete schedule:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}