"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"

export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  // 自分自身は削除できない
  if (session.user.id === id) {
    throw new Error("Cannot delete yourself")
  }

  await prisma.user.delete({
    where: { id },
  })

  revalidatePath("/users")
}

export async function updateUserRole(id: string, role: Role) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  await prisma.user.update({
    where: { id },
    data: { role },
  })

  revalidatePath("/users")
}