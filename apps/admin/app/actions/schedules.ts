"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createSchedule(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const icon = formData.get("icon") as string
  const colorBg = formData.get("colorBg") as string
  const colorText = formData.get("colorText") as string
  const order = parseInt(formData.get("order") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await prisma.schedule.create({
    data: {
      date: date ? new Date(date) : null,
      time,
      title,
      description: description || null,
      icon: icon || null,
      colorBg,
      colorText,
      order,
      isActive,
    },
  })

  revalidatePath("/schedules")
  redirect("/schedules")
}

export async function updateSchedule(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  const date = formData.get("date") as string
  const time = formData.get("time") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const icon = formData.get("icon") as string
  const colorBg = formData.get("colorBg") as string
  const colorText = formData.get("colorText") as string
  const order = parseInt(formData.get("order") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await prisma.schedule.update({
    where: { id },
    data: {
      date: date ? new Date(date) : null,
      time,
      title,
      description: description || null,
      icon: icon || null,
      colorBg,
      colorText,
      order,
      isActive,
    },
  })

  revalidatePath("/schedules")
  redirect("/schedules")
}

export async function deleteSchedule(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  await prisma.schedule.delete({
    where: { id },
  })

  revalidatePath("/schedules")
}