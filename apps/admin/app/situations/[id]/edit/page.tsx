import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminLayout from "@/components/admin-layout";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteSituationButton from "@/components/delete-situation-button";
import SituationForm from "@/components/situation-form";

async function updateSituation(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const order = parseInt(formData.get("order") as string);
  
  await prisma.mediaSituation.update({
    where: { id },
    data: {
      name,
      description: description || null,
      icon: icon || null,
      order,
    },
  });

  redirect("/situations");
}


export default async function EditSituationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const situation = await prisma.mediaSituation.findUnique({
    where: { id },
    include: {
      _count: {
        select: { media: true }
      }
    }
  });

  if (!situation) {
    notFound();
  }

  return (
    <AdminLayout user={session.user}>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">メディアシチュエーション編集</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <SituationForm
          situation={situation}
          action={updateSituation}
          submitLabel="更新"
        />

        <div className="flex justify-between">
          <div>
            <DeleteSituationButton 
              id={situation.id} 
              mediaCount={situation._count.media}
            />
          </div>
          
          <div className="flex space-x-3">
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
              更新
            </button>
          </div>
        </div>
      </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}