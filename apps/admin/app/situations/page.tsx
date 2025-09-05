import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminLayout from "@/components/admin-layout";
import { getUnreadInquiryCountForAdmin } from "@/lib/get-unread-count";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

async function getMediaSituations() {
  return await prisma.mediaSituation.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { media: true }
      }
    }
  });
}


export default async function SituationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const situations = await getMediaSituations();

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">メディアシチュエーション管理</h1>
        <Link
          href="/situations/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          新規追加
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                表示順
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                説明
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                メディア数
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {situations.map((situation) => (
              <tr key={situation.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {situation.order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {situation.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {situation.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {situation._count.media}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/situations/${situation.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {situations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">メディアシチュエーションが登録されていません</p>
          </div>
        )}
      </div>
        </div>
      </div>
    </AdminLayout>
  );
}