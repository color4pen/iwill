"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NotificationCategory, Priority } from "@prisma/client"

export async function createNotification(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const category = formData.get("category") as NotificationCategory
  const priority = formData.get("priority") as Priority

  await prisma.notification.create({
    data: {
      title,
      content,
      category,
      priority,
    },
  })

  revalidatePath("/notifications")
  redirect("/notifications")
}

export async function updateNotification(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const category = formData.get("category") as NotificationCategory
  const priority = formData.get("priority") as Priority

  await prisma.notification.update({
    where: { id },
    data: {
      title,
      content,
      category,
      priority,
    },
  })

  revalidatePath("/notifications")
  redirect("/notifications")
}

export async function deleteNotification(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  await prisma.notification.delete({
    where: { id },
  })

  revalidatePath("/notifications")
}