import { config } from "./config"
import { prisma } from "./lib/prisma"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"
import { Readable } from "stream"

// 環境変数
const BUCKET_NAME = config.AWS_S3_BUCKET_NAME
const CLOUDFRONT_URL = config.AWS_CLOUDFRONT_URL
const AWS_REGION = config.AWS_REGION

// S3クライアント
const s3Client = new S3Client({ region: AWS_REGION })

// サムネイル設定
const THUMBNAIL_WIDTH = 400
const THUMBNAIL_HEIGHT = 400
const THUMBNAIL_QUALITY = 80

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = []
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk))
    stream.on("error", reject)
    stream.on("end", () => resolve(Buffer.concat(chunks)))
  })
}

async function generateImageThumbnail(imageBuffer: Buffer): Promise<Buffer> {
  return await sharp(imageBuffer)
    .rotate() // EXIFの向き情報に基づいて自動回転
    .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
      fit: "cover",
      position: "center"
    })
    .jpeg({ quality: THUMBNAIL_QUALITY })
    .toBuffer()
}

async function processSingleMedia(mediaId: string) {
  try {
    console.log(`Looking for media with ID: ${mediaId}`)
    
    // 特定のメディアを取得
    const media = await prisma.media.findUnique({
      where: { id: mediaId }
    })
    
    if (!media) {
      console.error(`Media not found: ${mediaId}`)
      return
    }
    
    console.log(`Found media: ${media.fileName}`)
    console.log(`File URL: ${media.fileUrl}`)
    console.log(`Current thumbnail URL: ${media.thumbnailUrl}`)
    
    // 画像のみ処理（動画はLambdaで処理するため）
    if (!media.mimeType.startsWith("image/")) {
      console.log(`Skipping non-image file: ${media.mimeType}`)
      return
    }
    
    // S3からファイルキーを抽出
    const fileKey = media.fileUrl.replace(CLOUDFRONT_URL + "/", "")
    console.log(`S3 Key: ${fileKey}`)
    
    // サムネイルキーを生成
    const keyParts = fileKey.split("/")
    const fileName = keyParts[keyParts.length - 1]
    const fileDir = keyParts.slice(0, -1).join("/")
    const thumbnailKey = fileDir ? `${fileDir}/thumbnails/${fileName}` : `thumbnails/${fileName}`
    console.log(`Thumbnail Key: ${thumbnailKey}`)
    
    console.log(`Fetching from S3...`)
    
    // S3から画像を取得
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    })
    
    const response = await s3Client.send(getCommand)
    const imageBuffer = await streamToBuffer(response.Body as Readable)
    console.log(`Downloaded image: ${imageBuffer.length} bytes`)
    
    // サムネイルを生成
    console.log("Generating thumbnail...")
    const thumbnailBuffer = await generateImageThumbnail(imageBuffer)
    console.log(`Generated thumbnail: ${thumbnailBuffer.length} bytes`)
    
    // S3にアップロード
    console.log(`Uploading thumbnail to S3...`)
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: thumbnailKey,
      Body: thumbnailBuffer,
      ContentType: "image/jpeg",
      CacheControl: "public, max-age=31536000",
      ServerSideEncryption: "AES256",
      Metadata: {
        "original-key": fileKey,
        "generated-at": new Date().toISOString(),
      },
    })
    
    await s3Client.send(putCommand)
    console.log(`✅ Uploaded to S3: ${thumbnailKey}`)
    
    // データベースを更新
    const thumbnailUrl = `${CLOUDFRONT_URL}/${thumbnailKey}`
    await prisma.media.update({
      where: { id: media.id },
      data: { thumbnailUrl },
    })
    
    console.log(`✅ Updated database with thumbnail URL: ${thumbnailUrl}`)
    console.log(`✅ Completed successfully!`)
    
  } catch (error) {
    console.error(`❌ Error processing:`, error)
  } finally {
    await prisma.$disconnect()
  }
}

// メディアIDを抽出
const mediaId = "cmfwc3gpw0001l504079x94si"

// 実行
console.log("=== Test Single Thumbnail Generation ===")
console.log(`Target media ID: ${mediaId}`)
console.log("")

processSingleMedia(mediaId)