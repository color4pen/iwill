"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function deleteSituation(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Unauthorized")
  }

  await prisma.mediaSituation.delete({
    where: { id },
  })

  revalidatePath("/situations")
  redirect("/situations")
}