import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const schedules = await prisma.schedule.findMany({
      orderBy: { order: "asc" },
    })

    return NextResponse.json(schedules)
  } catch (error) {
    console.error("Failed to fetch schedules:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await request.json()
    const { time, title, description, icon, colorBg, colorText, order, isActive } = json

    const schedule = await prisma.schedule.create({
      data: {
        time,
        title,
        description,
        icon,
        colorBg,
        colorText,
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(schedule)
  } catch (error) {
    console.error("Failed to create schedule:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}