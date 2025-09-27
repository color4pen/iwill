import { config } from "./config"
import { prisma } from "./lib/prisma"

async function checkThumbnails() {
  try {
    // thumbnailUrlがnullのメディアを確認
    const missingThumbnails = await prisma.media.findMany({
      where: {
        thumbnailUrl: null,
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        createdAt: true,
      },
    })

    console.log(`メディア総数を確認中...`)
    const totalMedia = await prisma.media.count()
    
    console.log(`thumbnailUrlが設定されているメディア数を確認中...`)
    const withThumbnails = await prisma.media.count({
      where: {
        thumbnailUrl: {
          not: null,
        },
      },
    })

    console.log("\n=== サムネイル状況レポート ===")
    console.log(`総メディア数: ${totalMedia}`)
    console.log(`サムネイルあり: ${withThumbnails}`)
    console.log(`サムネイルなし: ${missingThumbnails.length}`)
    
    if (missingThumbnails.length > 0) {
      console.log("\n--- サムネイルがないメディア ---")
      missingThumbnails.forEach((media) => {
        console.log(`ID: ${media.id}`)
        console.log(`  ファイル名: ${media.fileName}`)
        console.log(`  ファイルURL: ${media.fileUrl}`)
        console.log(`  作成日時: ${media.createdAt}`)
        console.log("")
      })
    } else {
      console.log("\n✅ 全てのメディアにサムネイルが設定されています！")
    }
    
  } catch (error) {
    console.error("エラーが発生しました:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkThumbnails()