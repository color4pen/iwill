"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createInvitation(formData: FormData) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const expiresIn = formData.get("expiresIn") as string
  const notes = formData.get("notes") as string

  const expiresAt = expiresIn 
    ? new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000)
    : null

  await prisma.invitation.create({
    data: {
      name: name || null,
      email: email || null,
      expiresAt,
      notes: notes || null,
    },
  })

  revalidatePath("/invitations")
  redirect("/invitations")
}

export async function deleteInvitation(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  await prisma.invitation.delete({
    where: { id },
  })

  revalidatePath("/invitations")
}