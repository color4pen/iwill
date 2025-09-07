"use client"

import { useState, useEffect } from "react"
import { createUploadUrl, saveMediaMetadata } from "@/app/actions/media"
import { Upload, Loader2 } from "lucide-react"
import { FileDropzone } from "./media-upload/file-dropzone"
import { SelectedFilesList } from "./media-upload/selected-files-list"
import { UploadProgressDisplay, type UploadProgress } from "./media-upload/upload-progress"

// ファイルタイプとサイズの制限
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/quicktime",
]
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

interface MediaSituation {
  id: string
  name: string
  icon?: string | null
}

interface MediaUploadFormProps {
  onUploadComplete?: () => void
  situations?: MediaSituation[]
}

export default function MediaUploadForm({ onUploadComplete, situations }: MediaUploadFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map())
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFilesPreviews, setSelectedFilesPreviews] = useState<Map<string, string>>(new Map())
  const [selectedSituation, setSelectedSituation] = useState<string>("")

  // アップロード中のページ離脱防止
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading) {
        e.preventDefault()
        e.returnValue = 'アップロード中です。ページを離れるとアップロードがキャンセルされます。'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isUploading])

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} は100MBを超えています`
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `${file.name} は許可されていない形式です`
    }
    return null
  }

  const generatePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedFilesPreviews(prev => {
          const newMap = new Map(prev)
          newMap.set(file.name, e.target?.result as string)
          return newMap
        })
      }
      reader.readAsDataURL(file)
    } else if (file.type.startsWith("video/")) {
      // 動画のサムネイルを生成
      const video = document.createElement("video")
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      
      video.onloadeddata = () => {
        video.currentTime = 0 // 最初のフレーム
      }
      
      video.onseeked = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            setSelectedFilesPreviews(prev => {
              const newMap = new Map(prev)
              newMap.set(file.name, url)
              return newMap
            })
          }
        }, "image/jpeg", 0.8)
      }
      
      video.src = URL.createObjectURL(file)
    }
  }

  const handleFilesSelected = (fileList: FileList) => {
    const files = Array.from(fileList)
    const validFiles: File[] = []
    const errors: string[] = []

    files.forEach((file) => {
      const error = validateFile(file)
      if (error) {
        errors.push(error)
      } else {
        validFiles.push(file)
        generatePreview(file)
      }
    })

    if (errors.length > 0) {
      alert(errors.join('\n'))
    }

    setSelectedFiles([...selectedFiles, ...validFiles])
  }

  const removeFile = (index: number) => {
    const fileToRemove = selectedFiles[index]
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
    
    // プレビューも削除
    if (fileToRemove && selectedFilesPreviews.has(fileToRemove.name)) {
      setSelectedFilesPreviews(prev => {
        const newMap = new Map(prev)
        newMap.delete(fileToRemove.name)
        return newMap
      })
    }
  }

  const uploadFile = async (file: File, fileIndex?: number): Promise<boolean> => {
    const progressKey = `${file.name}-${fileIndex ?? Date.now()}`
    
    try {
      // プログレス更新（既に初期化済み）
      setUploadProgress((prev) => {
        const newMap = new Map(prev)
        const current = newMap.get(progressKey) || { fileName: file.name, progress: 0, status: "uploading" as const }
        newMap.set(progressKey, { ...current, status: "uploading" })
        return newMap
      })

      // 1. アップロードURLを取得
      const { uploadUrl, fileKey, mediaId } = await createUploadUrl(
        file.name,
        file.type,
        file.size
      )

      // 2. S3に直接アップロード
      const xhr = new XMLHttpRequest()
      
      // プログレス監視
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setUploadProgress((prev) => {
            const newMap = new Map(prev)
            const current = newMap.get(progressKey)!
            newMap.set(progressKey, { ...current, progress })
            return newMap
          })
        }
      })

      // アップロード完了処理
      await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            resolve(xhr.response)
          } else {
            let errorMsg = `アップロードに失敗しました: ${xhr.status}`
            if (xhr.status === 403) {
              errorMsg += " (アクセスが拒否されました。管理者にお問い合わせください)"
            } else if (xhr.status === 413) {
              errorMsg += " (ファイルサイズが大きすぎます)"
            } else if (xhr.status >= 500) {
              errorMsg += " (サーバーエラーが発生しました。しばらく待ってから再試行してください)"
            }
            reject(new Error(errorMsg))
          }
        }
        xhr.onerror = () => {
          reject(new Error("ネットワークエラーが発生しました"))
        }
        
        xhr.open("PUT", uploadUrl)
        xhr.setRequestHeader("Content-Type", file.type)
        // S3暗号化のヘッダーを追加
        xhr.setRequestHeader("x-amz-server-side-encryption", "AES256")
        
        
        xhr.send(file)
      })

      // 3. メタデータをDBに保存
      setUploadProgress((prev) => {
        const newMap = new Map(prev)
        const current = newMap.get(progressKey)!
        newMap.set(progressKey, { ...current, status: "processing" })
        return newMap
      })

      await saveMediaMetadata(mediaId, selectedSituation || undefined)

      // 完了
      setUploadProgress((prev) => {
        const newMap = new Map(prev)
        const current = newMap.get(progressKey)!
        newMap.set(progressKey, { ...current, status: "completed", progress: 100 })
        return newMap
      })

      return true
    } catch (error) {
      // エラー処理
      setUploadProgress((prev) => {
        const newMap = new Map(prev)
        const current = newMap.get(progressKey)!
        newMap.set(progressKey, { 
          ...current, 
          status: "error",
          error: error instanceof Error ? error.message : "アップロードエラー"
        })
        return newMap
      })
      return false
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    
    // 最初に全ファイルの進捗エントリーを作成（0%で初期化）
    const initialProgress = new Map<string, UploadProgress>()
    selectedFiles.forEach((file, index) => {
      const progressKey = `${file.name}-${index}`
      initialProgress.set(progressKey, {
        fileName: file.name,
        progress: 0,
        status: "uploading"
      })
    })
    setUploadProgress(initialProgress)
    
    // デバイスとファイルサイズに基づいて最適なチャンクサイズを決定
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0)
    const avgFileSize = totalSize / selectedFiles.length
    
    let CHUNK_SIZE = 2 // デフォルト: 2ファイル同時
    
    if (!isMobile && avgFileSize < 10 * 1024 * 1024) {
      CHUNK_SIZE = 3 // PC + 小さいファイル: 3ファイル同時
    } else if (isMobile && avgFileSize < 5 * 1024 * 1024) {
      CHUNK_SIZE = 2 // モバイル + 小さいファイル: 2ファイル同時
    } else {
      CHUNK_SIZE = 1 // 大きいファイル: 1ファイルずつ
    }
    
    const results: boolean[] = []
    
    // ファイルをチャンクに分割してアップロード
    for (let i = 0; i < selectedFiles.length; i += CHUNK_SIZE) {
      const chunk = selectedFiles.slice(i, i + CHUNK_SIZE)
      const chunkResults = await Promise.all(chunk.map((file, chunkIndex) => uploadFile(file, i + chunkIndex)))
      results.push(...chunkResults)
    }
    
    // 成功したファイルを削除
    const successCount = results.filter(Boolean).length
    if (successCount > 0) {
      setSelectedFiles([])
      setSelectedFilesPreviews(new Map())
      onUploadComplete?.()
    }

    setIsUploading(false)

    // 3秒後にプログレス表示をクリア
    setTimeout(() => {
      setUploadProgress(new Map())
    }, 3000)
  }

  return (
    <div className="w-full">
      {/* ファイル選択エリア */}
      <FileDropzone 
        onFilesSelected={handleFilesSelected}
        disabled={isUploading}
      />

      {/* 選択されたファイル一覧（アップロード中は非表示） */}
      {selectedFiles.length > 0 && !isUploading && (
        <>
          <SelectedFilesList
            files={selectedFiles}
            previews={selectedFilesPreviews}
            onRemoveFile={removeFile}
            disabled={isUploading}
          />
          
          {/* シチュエーション選択 */}
          {situations && situations.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                シチュエーション（任意）
              </label>
              <select
                value={selectedSituation}
                onChange={(e) => setSelectedSituation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">選択しない</option>
                {situations.map((situation) => (
                  <option key={situation.id} value={situation.id}>
                    {situation.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                写真・動画のシーンを選択すると、後で見つけやすくなります
              </p>
            </div>
          )}
        </>
      )}

      {/* アップロードプログレス */}
      {uploadProgress.size > 0 && (
        <UploadProgressDisplay uploadProgress={uploadProgress} />
      )}

      {/* アップロードボタン */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="mt-4 w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              アップロード中...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {selectedFiles.length}個のファイルをアップロード
            </>
          )}
        </button>
      )}
    </div>
  )
}