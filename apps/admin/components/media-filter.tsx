"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface MediaFilterProps {
  situations: Array<{
    id: string;
    name: string;
  }>;
  users: Array<{
    id: string;
    name: string | null;
    email: string | null;
    _count: { media: number };
  }>;
  currentSituationId: string;
  currentApprovalStatus: string;
  currentUserId: string;
}

export default function MediaFilter({ 
  situations, 
  users,
  currentSituationId, 
  currentApprovalStatus,
  currentUserId
}: MediaFilterProps) {
  const router = useRouter();

  const handleFilterChange = (type: 'situation' | 'approval' | 'user', value: string) => {
    const params = new URLSearchParams();
    
    if (type === 'situation') {
      if (value !== 'all') params.set('situation', value);
      if (currentApprovalStatus !== 'all') params.set('approval', currentApprovalStatus);
      if (currentUserId !== 'all') params.set('user', currentUserId);
    } else if (type === 'approval') {
      if (currentSituationId !== 'all') params.set('situation', currentSituationId);
      if (value !== 'all') params.set('approval', value);
      if (currentUserId !== 'all') params.set('user', currentUserId);
    } else {
      if (currentSituationId !== 'all') params.set('situation', currentSituationId);
      if (currentApprovalStatus !== 'all') params.set('approval', currentApprovalStatus);
      if (value !== 'all') params.set('user', value);
    }

    const queryString = params.toString();
    router.push(`/media${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="flex gap-4 items-end">
        <div className="relative">
          <label htmlFor="situation" className="block text-sm font-medium text-gray-700 mb-1">
            シチュエーション
          </label>
          <div className="relative">
            <select
              id="situation"
              value={currentSituationId}
              onChange={(e) => handleFilterChange('situation', e.target.value)}
              className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
            >
              <option value="all">すべて</option>
              {situations.map((situation) => (
                <option key={situation.id} value={situation.id}>
                  {situation.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <label htmlFor="approval" className="block text-sm font-medium text-gray-700 mb-1">
            承認状態
          </label>
          <div className="relative">
            <select
              id="approval"
              value={currentApprovalStatus}
              onChange={(e) => handleFilterChange('approval', e.target.value)}
              className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
            >
              <option value="all">すべて</option>
              <option value="approved">承認済み</option>
              <option value="unapproved">未承認</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
            ユーザー
          </label>
          <div className="relative">
            <select
              id="user"
              value={currentUserId}
              onChange={(e) => handleFilterChange('user', e.target.value)}
              className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
            >
              <option value="all">すべて</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email || 'ゲスト'} ({user._count.media}件)
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {(currentSituationId !== 'all' || currentApprovalStatus !== 'all' || currentUserId !== 'all') && (
          <Link
            href="/media"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            リセット
          </Link>
        )}
      </div>
    </div>
  );
}