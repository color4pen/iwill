import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"
import * as path from "path"

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") })

const prisma = new PrismaClient()

async function main() {
  console.log("スケジュール一覧を取得します...")

  try {
    const schedules = await prisma.schedule.findMany({
      orderBy: { order: "asc" },
    })

    console.log(`\n合計: ${schedules.length}件のスケジュール\n`)

    schedules.forEach((schedule) => {
      console.log(`[${schedule.order}] ${schedule.time} - ${schedule.title}`)
      console.log(`  ID: ${schedule.id}`)
      console.log(`  説明: ${schedule.description || "なし"}`)
      console.log(`  アイコン: ${schedule.icon || "なし"}`)
      console.log(`  色: ${schedule.colorBg} / ${schedule.colorText}`)
      console.log(`  公開状態: ${schedule.isActive ? "公開" : "非公開"}`)
      console.log("")
    })

    // 公開中のスケジュールのみ
    const activeSchedules = schedules.filter(s => s.isActive)
    console.log(`公開中のスケジュール: ${activeSchedules.length}件`)

  } catch (error) {
    console.error("エラーが発生しました:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()