import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminLayout from "@/components/admin-layout";
import { getUnreadInquiryCountForAdmin } from "@/lib/get-unread-count";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function createSituation(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const order = parseInt(formData.get("order") as string);
  
  await prisma.mediaSituation.create({
    data: {
      name,
      description: description || null,
      order,
    },
  });

  redirect("/situations");
}

export default async function NewSituationPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const unreadCount = await getUnreadInquiryCountForAdmin();
  
  // 次の表示順を取得
  const maxOrder = await prisma.mediaSituation.findFirst({
    select: { order: true },
    orderBy: { order: "desc" },
  });
  const nextOrder = (maxOrder?.order || 0) + 1;

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">メディアシチュエーション新規追加</h1>
      </div>

      <form action={createSituation} className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="例: 挙式、披露宴、二次会"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            説明
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="このシチュエーションの説明"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
            表示順
          </label>
          <input
            type="number"
            id="order"
            name="order"
            required
            defaultValue={nextOrder}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Link
            href="/situations"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            作成
          </button>
        </div>
      </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}