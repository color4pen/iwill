import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const scheduleData = [
  {
    time: "13:15",
    title: "受付開始",
    description: "ウェルカムドリンクをご用意しております",
    icon: "Users",
    colorBg: "bg-blue-100",
    colorText: "text-blue-600",
    order: 1,
    isActive: true,
  },
  {
    time: "14:15",
    title: "挙式",
    description: "チャペルでの挙式となります",
    icon: "Church",
    colorBg: "bg-pink-100",
    colorText: "text-pink-600",
    order: 2,
    isActive: true,
  },
  {
    time: "15:30",
    title: "披露宴開宴",
    description: "お食事・歓談、余興・スピーチ",
    icon: "Utensils",
    colorBg: "bg-amber-100",
    colorText: "text-amber-600",
    order: 3,
    isActive: true,
  },
  {
    time: "18:30",
    title: "お開き（予定）",
    description: null,
    icon: "Clock",
    colorBg: "bg-green-100",
    colorText: "text-green-600",
    order: 4,
    isActive: true,
  },
]

async function seedSchedules() {
  console.log('スケジュールデータの投入を開始します...')
  
  try {
    // 既存のスケジュールを削除（必要に応じて）
    // await prisma.schedule.deleteMany()
    
    // スケジュールデータを作成
    for (const schedule of scheduleData) {
      const created = await prisma.schedule.create({
        data: schedule,
      })
      console.log(`スケジュールを作成しました: ${created.time} - ${created.title}`)
    }
    
    console.log('スケジュールデータの投入が完了しました！')
  } catch (error) {
    console.error('エラーが発生しました:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// スクリプトを実行
seedSchedules()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })