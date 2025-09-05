import { prisma } from "../apps/web/lib/prisma"
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"
import { Readable } from "stream"

// 環境変数
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!
const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL!
const AWS_REGION = process.env.AWS_REGION || "ap-northeast-1"

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
    .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
      fit: "cover",
      position: "center"
    })
    .jpeg({ quality: THUMBNAIL_QUALITY })
    .toBuffer()
}

async function processSingleMedia(media: any) {
  try {
    console.log(`Processing: ${media.id} - ${media.fileName}`)
    
    // 画像のみ処理（動画はLambdaで処理するため）
    if (!media.mimeType.startsWith("image/")) {
      console.log(`Skipping non-image file: ${media.mimeType}`)
      return
    }
    
    // S3からファイルキーを抽出
    const fileKey = media.fileUrl.replace(CLOUDFRONT_URL + "/", "")
    
    // サムネイルキーを生成
    const keyParts = fileKey.split("/")
    const fileName = keyParts[keyParts.length - 1]
    const fileDir = keyParts.slice(0, -1).join("/")
    const thumbnailKey = fileDir ? `${fileDir}/thumbnails/${fileName}` : `thumbnails/${fileName}`
    
    console.log(`Fetching from S3: ${fileKey}`)
    
    // S3から画像を取得
    const getCommand = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    })
    
    const response = await s3Client.send(getCommand)
    const imageBuffer = await streamToBuffer(response.Body as Readable)
    
    // サムネイルを生成
    console.log("Generating thumbnail...")
    const thumbnailBuffer = await generateImageThumbnail(imageBuffer)
    
    // S3にアップロード
    console.log(`Uploading thumbnail: ${thumbnailKey}`)
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
    
    // データベースを更新
    const thumbnailUrl = `${CLOUDFRONT_URL}/${thumbnailKey}`
    await prisma.media.update({
      where: { id: media.id },
      data: { thumbnailUrl },
    })
    
    console.log(`✅ Completed: ${media.fileName}`)
    
  } catch (error) {
    console.error(`❌ Error processing ${media.id}:`, error)
  }
}

async function generateThumbnails() {
  console.log("Starting thumbnail generation for existing media...")
  
  try {
    // サムネイルがない、または元のURLと同じメディアを取得
    const mediaList = await prisma.media.findMany({
      where: {
        OR: [
          { thumbnailUrl: null },
          { thumbnailUrl: { equals: prisma.media.fields.fileUrl } },
        ],
      },
      orderBy: { createdAt: "desc" },
    })
    
    console.log(`Found ${mediaList.length} media items to process`)
    
    // バッチ処理（同時実行数を制限）
    const batchSize = 5
    for (let i = 0; i < mediaList.length; i += batchSize) {
      const batch = mediaList.slice(i, i + batchSize)
      await Promise.all(batch.map(processSingleMedia))
      
      console.log(`Progress: ${Math.min(i + batchSize, mediaList.length)}/${mediaList.length}`)
      
      // レート制限のための遅延
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    console.log("✅ Thumbnail generation completed!")
    
  } catch (error) {
    console.error("Fatal error:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// 実行
generateThumbnails()