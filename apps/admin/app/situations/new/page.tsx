import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminLayout from "@/components/admin-layout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SituationForm from "@/components/situation-form";

async function createSituation(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt(formData.get("order") as string);
  
  await prisma.mediaSituation.create({
    data: {
      name,
      description: description || null,
      icon: icon || null,
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

      <div className="bg-white rounded-lg shadow p-6">
        <SituationForm
          situation={{
            name: "",
            description: null,
            icon: null,
            order: nextOrder
          }}
          action={createSituation}
          submitLabel="作成"
        />

        <div className="flex justify-end space-x-3">
          <Link
            href="/situations"
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            form="situation-form"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            作成
          </button>
        </div>
      </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}