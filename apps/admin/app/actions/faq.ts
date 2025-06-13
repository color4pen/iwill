"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FAQCategory } from "@prisma/client"

export async function createFAQ(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  const question = formData.get("question") as string
  const answer = formData.get("answer") as string
  const category = formData.get("category") as FAQCategory
  const order = parseInt(formData.get("order") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await prisma.fAQ.create({
    data: {
      question,
      answer,
      category,
      order,
      isActive,
    },
  })

  revalidatePath("/faq")
  redirect("/faq")
}

export async function updateFAQ(id: string, formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  const question = formData.get("question") as string
  const answer = formData.get("answer") as string
  const category = formData.get("category") as FAQCategory
  const order = parseInt(formData.get("order") as string) || 0
  const isActive = formData.get("isActive") === "on"

  await prisma.fAQ.update({
    where: { id },
    data: {
      question,
      answer,
      category,
      order,
      isActive,
    },
  })

  revalidatePath("/faq")
  redirect("/faq")
}

export async function deleteFAQ(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  await prisma.fAQ.delete({
    where: { id },
  })

  revalidatePath("/faq")
}

export async function toggleFAQStatus(id: string, isActive: boolean) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  await prisma.fAQ.update({
    where: { id },
    data: { isActive },
  })

  revalidatePath("/faq")
}