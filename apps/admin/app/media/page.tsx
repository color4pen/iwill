import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminLayout from "@/components/admin-layout";
import { getUnreadInquiryCountForAdmin } from "@/lib/get-unread-count";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import MediaDeleteButton from "@/components/media-delete-button";
import Pagination from "@/components/pagination";
import Link from "next/link";
import MediaFilter from "@/components/media-filter";

const ITEMS_PER_PAGE = 20;

async function getMedia(
  page: number = 1, 
  situationId?: string,
  approvalStatus?: string,
  userId?: string
) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  const where: any = {};
  if (situationId && situationId !== 'all') {
    where.mediaSituationId = situationId;
  }
  if (approvalStatus === 'approved') {
    where.isApproved = true;
  } else if (approvalStatus === 'unapproved') {
    where.isApproved = false;
  }
  if (userId && userId !== 'all') {
    where.userId = userId;
  }
  
  const [media, totalCount] = await Promise.all([
    prisma.media.findMany({
      where,
      include: {
        user: true,
        mediaSituation: true,
      },
      orderBy: { createdAt: "desc" },
      take: ITEMS_PER_PAGE,
      skip,
    }),
    prisma.media.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return { media, totalPages, totalCount };
}

async function getMediaSituations() {
  return await prisma.mediaSituation.findMany({
    orderBy: { order: "asc" },
  });
}

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: { media: true }
      }
    },
    where: {
      media: {
        some: {}
      }
    },
    orderBy: { name: "asc" },
  });
}

async function toggleApproval(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  const isApproved = formData.get("isApproved") === "true";
  
  await prisma.media.update({
    where: { id },
    data: { 
      isApproved: !isApproved,
      approvedAt: !isApproved ? new Date() : null,
    },
  });
  
  revalidatePath("/media");
}

async function deleteMedia(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  
  await prisma.media.delete({
    where: { id },
  });
  
  revalidatePath("/media");
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: { 
    page?: string;
    situation?: string;
    approval?: string;
    user?: string;
  };
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const currentPage = Number(searchParams.page) || 1;
  const situationId = searchParams.situation || 'all';
  const approvalStatus = searchParams.approval || 'all';
  const userId = searchParams.user || 'all';
  
  const unreadCount = await getUnreadInquiryCountForAdmin();
  const [{ media, totalPages, totalCount }, situations, users] = await Promise.all([
    getMedia(currentPage, situationId, approvalStatus, userId),
    getMediaSituations(),
    getUsers(),
  ]);

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">メディア管理</h1>
            <p className="mt-1 text-sm text-gray-500">
              アップロードされた写真・動画の一覧（全{totalCount}件）
            </p>
          </div>

          {/* フィルター */}
          <MediaFilter 
            situations={situations}
            users={users}
            currentSituationId={situationId}
            currentApprovalStatus={approvalStatus}
            currentUserId={userId}
          />

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    プレビュー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ユーザー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    キャプション
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    シチュエーション
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ファイル情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    承認状態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アップロード日
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {media.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden">
                        {item.mimeType.startsWith('image/') ? (
                          <Image
                            src={item.thumbnailUrl || item.fileUrl}
                            alt={item.caption || "画像"}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.user.name || "ゲスト"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs truncate">
                        {item.caption || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.mediaSituation?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="text-xs">
                        <p>{item.fileName}</p>
                        <p className="text-gray-400">{Math.round(item.fileSize / 1024)}KB</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <form action={toggleApproval} className="inline">
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="isApproved" value={item.isApproved.toString()} />
                        <button
                          type="submit"
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            item.isApproved
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.isApproved ? "承認済み" : "未承認"}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <MediaDeleteButton id={item.id} deleteAction={deleteMedia} />
                    </td>
                  </tr>
                ))}
                {media.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <p className="text-gray-500">アップロードされたメディアはありません</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/media"
                searchParams={{
                  ...(situationId !== 'all' && { situation: situationId }),
                  ...(approvalStatus !== 'all' && { approval: approvalStatus }),
                  ...(userId !== 'all' && { user: userId }),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}