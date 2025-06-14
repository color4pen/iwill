import Link from "next/link"

interface DashboardCardProps {
  title: string
  description: string
  href: string
  icon: React.ReactNode
}

export default function DashboardCard({ title, description, href, icon }: DashboardCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{description}</dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href={href} className="font-medium text-blue-600 hover:text-blue-500">
            管理画面へ →
          </Link>
        </div>
      </div>
    </div>
  )
}