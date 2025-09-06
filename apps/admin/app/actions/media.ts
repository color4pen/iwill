"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function deleteMedia(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  await prisma.media.delete({
    where: { id },
  })

  revalidatePath("/media")
}