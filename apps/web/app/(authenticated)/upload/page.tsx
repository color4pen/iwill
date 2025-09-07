import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import UploadClient from "./upload-client"
import { getMediaSituations } from "@/app/actions/media"

export default async function UploadPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  const situations = await getMediaSituations()

  return <UploadClient situations={situations} />
}