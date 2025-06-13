"use client"

import { useState } from "react"
import { Shield, ShieldOff, Eye, Trash2 } from "lucide-react"
import UserDetailModal from "./user-detail-modal"
import UserModalPortal from "./user-modal-portal"
import { deleteUser, updateUserRole } from "@/app/actions/users"
import { Role } from "@prisma/client"

interface User {
  id: string
  lineId: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  createdAt: Date
  attendance?: {
    status: string
    numberOfGuests: number
    dietaryRestrictions: string | null
    messageToCouple: string | null
  } | null
}

interface UserActionsProps {
  user: User
}

export default function UserActions({ user }: UserActionsProps) {
  const [showDetail, setShowDetail] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleRoleToggle = async () => {
    if (!confirm(`${user.name || user.lineId}の管理者権限を${user.role === 'ADMIN' ? '削除' : '付与'}しますか？`)) {
      return
    }

    setIsUpdating(true)
    try {
      const newRole: Role = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
      await updateUserRole(user.id, newRole)
    } catch (error) {
      console.error("Failed to update user role:", error)
      alert("更新に失敗しました")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`${user.name || user.lineId}を削除しますか？この操作は取り消せません。`)) {
      return
    }

    try {
      await deleteUser(user.id)
    } catch (error) {
      console.error("Failed to delete user:", error)
      alert("削除に失敗しました")
    }
  }

  return (
    <>
      <div className="ml-4 flex items-center space-x-2">
        <button
          onClick={() => setShowDetail(true)}
          className="p-2 text-gray-500 hover:text-gray-700"
          title="詳細表示"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button
          onClick={handleRoleToggle}
          disabled={isUpdating}
          className={`p-2 ${user.role === 'ADMIN' ? 'text-orange-500 hover:text-orange-700' : 'text-blue-500 hover:text-blue-700'} disabled:opacity-50`}
          title={user.role === 'ADMIN' ? '管理者権限を削除' : '管理者権限を付与'}
        >
          {user.role === 'ADMIN' ? <ShieldOff className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-gray-500 hover:text-red-600"
          title="削除"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      
      {showDetail && (
        <UserModalPortal>
          <UserDetailModal
            user={user}
            onClose={() => setShowDetail(false)}
          />
        </UserModalPortal>
      )}
    </>
  )
}