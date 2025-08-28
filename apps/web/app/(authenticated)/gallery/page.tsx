import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getApprovedMedia } from "@/app/actions/media"
import GalleryClient from "./gallery-client"

export default async function GalleryPage() {
  const session = await getServerSession(authOptions)
  const approvedMedia = await getApprovedMedia()

  return (
    <GalleryClient 
      initialMedia={approvedMedia}
      currentUserId={session?.user?.id}
    />
  )
}