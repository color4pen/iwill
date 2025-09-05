"use server"

import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { revalidatePath } from "next/cache"
import { getWebEnv } from "@repo/env"

// 環境変数の取得
const env = getWebEnv()
const BUCKET_NAME = env.AWS_S3_BUCKET_NAME
const CLOUDFRONT_URL = env.AWS_CLOUDFRONT_URL
const AWS_REGION = env.AWS_REGION
const AWS_ROLE_ARN = env.AWS_ROLE_ARN


if (!BUCKET_NAME || !CLOUDFRONT_URL) {
  throw new Error(`AWS環境変数が設定されていません: BUCKET_NAME=${BUCKET_NAME}, CLOUDFRONT_URL=${CLOUDFRONT_URL}`)
}

// S3クライアントの初期化
const s3Client = new S3Client({
  region: AWS_REGION,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
})

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

/**
 * S3へのアップロード用の署名付きURLを生成
 */
export async function createUploadUrl(
  fileName: string,
  fileType: string,
  fileSize: number
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("認証が必要です")
  }

  // ファイルタイプの検証
  if (!ALLOWED_FILE_TYPES.includes(fileType)) {
    throw new Error("許可されていないファイル形式です")
  }

  // ファイルサイズの検証
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error("ファイルサイズが100MBを超えています")
  }

  // 拡張子を取得（小文字に統一）
  const fileExtension = fileName.split('.').pop()?.toLowerCase() || ''
  
  // 先にメディアレコードを作成してIDを取得
  const media = await prisma.media.create({
    data: {
      userId: session.user.id,
      fileUrl: '', // 後で更新
      thumbnailUrl: null,
      fileName,
      fileSize,
      mimeType: fileType,
      isApproved: false,
    },
  })

  // メディアIDを使ったS3キーを生成
  const s3Key = `${session.user.id}/${media.id}.${fileExtension}`

  try {
    // S3アップロード用のパラメータ
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      ContentType: fileType,
      // ContentLengthは署名に含めない（実際のアップロード時にブラウザが設定）
      ServerSideEncryption: "AES256", // S3管理の暗号化を明示的に指定
      ChecksumAlgorithm: undefined, // チェックサムを無効化
      Metadata: {
        userId: session.user.id,
        originalName: fileName,
      },
    })

    // 署名付きURLを生成（5分間有効）
    let uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
      unhoistableHeaders: new Set(["x-amz-checksum-crc32"]),
    })
    
    // URLからチェックサム関連のパラメータを削除
    const url = new URL(uploadUrl)
    url.searchParams.delete("x-amz-checksum-crc32")
    url.searchParams.delete("x-amz-sdk-checksum-algorithm")
    uploadUrl = url.toString()
    

    // メディアレコードを更新してURLを保存
    const fileUrl = `${CLOUDFRONT_URL}/${s3Key}`
    await prisma.media.update({
      where: { id: media.id },
      data: { fileUrl },
    })

    return {
      uploadUrl,
      fileKey: s3Key,
      fileUrl,
      mediaId: media.id,
    }
  } catch (error) {
    // エラー時はメディアレコードを削除
    await prisma.media.delete({
      where: { id: media.id },
    })
    throw error
  }
}

/**
 * アップロード完了後のメタデータを更新
 */
export async function saveMediaMetadata(
  mediaId: string,
  caption?: string
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("認証が必要です")
  }

  // メディアレコードが存在し、ユーザーが所有者であることを確認
  const media = await prisma.media.findFirst({
    where: {
      id: mediaId,
      userId: session.user.id,
    },
  })

  if (!media) {
    throw new Error("メディアが見つかりません")
  }

  // サムネイルURLの生成
  let thumbnailUrl = null
  
  // Lambda関数でサムネイルが生成される想定のパスを設定
  if (media.mimeType.startsWith("image/") || media.mimeType.startsWith("video/")) {
    // fileUrlからS3キーを取得
    const fileKey = media.fileUrl.replace(`${CLOUDFRONT_URL}/`, '')
    const keyParts = fileKey.split('/')
    const fileName = keyParts[keyParts.length - 1]
    const fileDir = keyParts.slice(0, -1).join('/')
    
    // 動画の場合は拡張子を.jpgに変更
    let thumbnailFileName = fileName || ''
    if (media.mimeType.startsWith("video/") && fileName) {
      // 拡張子を.jpgに変更（.mp4 → .jpg, .mov → .jpg）
      thumbnailFileName = fileName.replace(/\.[^/.]+$/, '') + '.jpg'
    }
    
    const thumbnailKey = fileDir ? `${fileDir}/thumbnails/${thumbnailFileName}` : `thumbnails/${thumbnailFileName}`
    thumbnailUrl = `${CLOUDFRONT_URL}/${thumbnailKey}`
  }

  // メディアレコードを更新
  const updatedMedia = await prisma.media.update({
    where: { id: mediaId },
    data: {
      thumbnailUrl,
      caption,
    },
  })

  // マイページとギャラリーのキャッシュを無効化
  revalidatePath("/mypage")
  revalidatePath("/gallery")

  return updatedMedia
}

/**
 * ユーザーのメディア一覧を取得
 */
export async function getUserMedia(limit = 50) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return []
  }

  const media = await prisma.media.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  })

  return media
}

/**
 * 承認済みメディア一覧を取得（ギャラリー用）
 */
export async function getApprovedMedia(limit = 100) {
  const media = await prisma.media.findMany({
    // 承認状態に関係なくすべて取得
    where: {},
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  })

  return media
}

/**
 * メディアシチュエーション一覧を取得
 */
export async function getMediaSituations() {
  const situations = await prisma.mediaSituation.findMany({
    orderBy: {
      order: "asc",
    },
    include: {
      _count: {
        select: { media: true },
      },
    },
  })

  return situations
}

/**
 * シチュエーション別のメディアを取得
 */
export async function getMediaBySituation(situationId: string, limit = 50) {
  const media = await prisma.media.findMany({
    where: {
      mediaSituationId: situationId,
      // 承認状態に関係なくすべて取得
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      mediaSituation: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  })

  return media
}

/**
 * 最新メディアを取得（限定数）
 */
export async function getRecentMedia(limit = 12) {
  const media = await prisma.media.findMany({
    // 承認状態に関係なくすべて取得
    where: {},
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      mediaSituation: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  })

  return media
}

/**
 * メディアを削除
 */
export async function deleteMedia(mediaId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error("認証が必要です")
  }

  // 所有者確認
  const media = await prisma.media.findFirst({
    where: {
      id: mediaId,
      userId: session.user.id,
    },
  })

  if (!media) {
    throw new Error("メディアが見つからないか、削除権限がありません")
  }

  // データベースから削除
  await prisma.media.delete({
    where: {
      id: mediaId,
    },
  })

  // S3からの削除は管理者のみが実行できるようにする（データ保護のため）

  revalidatePath("/mypage")
  revalidatePath("/gallery")

  return { success: true }
}