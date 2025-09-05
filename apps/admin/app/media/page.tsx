import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminLayout from "@/components/admin-layout";
import { prisma } from "@/lib/prisma";
import MediaDeleteButton from "@/components/media-delete-button";
import Pagination from "@/components/pagination";
import MediaFilter from "@/components/media-filter";
import MediaSituationSelect from "@/components/media-situation-select";
import MediaApprovalSelect from "@/components/media-approval-select";
import MediaPreview from "@/components/media-preview";

const ITEMS_PER_PAGE = 20;

async function getMedia(
  page: number = 1, 
  situationId?: string,
  approvalStatus?: string,
  userId?: string
) {
  const skip = (page - 1) * ITEMS_PER_PAGE;
  
  const where: {
    mediaSituationId?: string;
    isApproved?: boolean;
    userId?: string;
  } = {};
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

async function updateApprovalStatus(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  const isApproved = formData.get("isApproved") === "true";
  
  await prisma.media.update({
    where: { id },
    data: { 
      isApproved,
      approvedAt: isApproved ? new Date() : null,
    },
  });
  
  revalidatePath("/media");
}

async function updateMediaSituation(formData: FormData) {
  "use server";
  
  const id = formData.get("id") as string;
  const situationId = formData.get("situationId") as string;
  
  await prisma.media.update({
    where: { id },
    data: { 
      mediaSituationId: situationId || null,
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
  searchParams: Promise<{ 
    page?: string;
    situation?: string;
    approval?: string;
    user?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const situationId = params.situation || 'all';
  const approvalStatus = params.approval || 'all';
  const userId = params.user || 'all';
  
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

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    プレビュー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    ユーザー
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    キャプション
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                    シチュエーション
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    承認状態
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    アップロード日
                  </th>
                  <th className="relative px-6 py-3 w-20">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {media.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <MediaPreview
                        fileUrl={item.fileUrl}
                        thumbnailUrl={item.thumbnailUrl}
                        mimeType={item.mimeType}
                        caption={item.caption}
                        fileName={item.fileName}
                      />
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
                      <MediaSituationSelect
                        mediaId={item.id}
                        currentSituationId={item.mediaSituationId}
                        situations={situations}
                        updateAction={updateMediaSituation}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <MediaApprovalSelect
                        mediaId={item.id}
                        isApproved={item.isApproved}
                        updateAction={updateApprovalStatus}
                      />
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
                    <td colSpan={7} className="px-6 py-12 text-center">
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