import { PrismaClient } from "@prisma/client"
import * as dotenv from "dotenv"
import * as path from "path"

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, "../.env.local") })

const prisma = new PrismaClient()

const schedules = [
  {
    time: "13:30",
    title: "受付開始",
    description: "ウェルカムドリンクをご用意しております",
    icon: "Users",
    colorBg: "bg-blue-100",
    colorText: "text-blue-600",
    order: 1,
    isActive: true,
  },
  {
    time: "14:00",
    title: "挙式",
    description: "チャペルにて執り行います",
    icon: "Church",
    colorBg: "bg-pink-100",
    colorText: "text-pink-600",
    order: 2,
    isActive: true,
  },
  {
    time: "14:30",
    title: "披露宴開宴",
    description: "新郎新婦入場",
    icon: "Heart",
    colorBg: "bg-amber-100",
    colorText: "text-amber-600",
    order: 3,
    isActive: true,
  },
  {
    time: "15:00",
    title: "お食事・歓談",
    description: "ゆっくりとお楽しみください",
    icon: "Utensils",
    colorBg: "bg-green-100",
    colorText: "text-green-600",
    order: 4,
    isActive: true,
  },
  {
    time: "16:30",
    title: "お開き",
    description: "新郎新婦退場・お見送り",
    icon: "Users",
    colorBg: "bg-purple-100",
    colorText: "text-purple-600",
    order: 5,
    isActive: true,
  },
]

async function main() {
  console.log("初期スケジュールを投入します...")

  try {
    // 既存のスケジュールを削除
    await prisma.schedule.deleteMany()
    console.log("既存のスケジュールを削除しました")

    // 新しいスケジュールを作成
    for (const schedule of schedules) {
      await prisma.schedule.create({
        data: schedule,
      })
      console.log(`スケジュールを作成しました: ${schedule.time} - ${schedule.title}`)
    }

    console.log("初期スケジュールの投入が完了しました")
  } catch (error) {
    console.error("エラーが発生しました:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()