import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import UploadClient from "./upload-client"

export default async function UploadPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  return <UploadClient />
}