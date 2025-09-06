"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import MediaUploadForm from "@/app/components/media-upload-form"

export default function UploadClient() {
  const router = useRouter()
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleUploadComplete = () => {
    setUploadSuccess(true)
    // 2秒後にギャラリーページにリダイレクト
    setTimeout(() => {
      router.push("/gallery")
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/gallery"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          ギャラリーに戻る
        </Link>
        
        <h1 className="text-2xl font-bold mb-2">写真・動画のアップロード</h1>
        <p className="text-gray-600">
          結婚式の思い出の写真や動画をアップロードして、他の参列者と共有しましょう。
        </p>
      </div>

      {uploadSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">アップロードが完了しました！</p>
          <p className="text-sm mt-1">ギャラリーページに移動します...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <MediaUploadForm onUploadComplete={handleUploadComplete} />
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p className="font-medium mb-2">アップロード時の注意事項：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>対応形式：JPEG, PNG, GIF, WebP（画像）、MP4, QuickTime（動画）</li>
          <li>最大ファイルサイズ：100MB</li>
          <li>アップロードされた写真・動画は他の参列者も閲覧できます</li>
          <li>不適切なコンテンツはアップロードしないでください</li>
        </ul>
      </div>
    </div>
  )
}