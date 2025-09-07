"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  Search, X, Church, Heart, Users, Flower, Gift, Camera, Music, Sparkles, Cake,
  MapPin, Home, Building, Hotel, Tent, Trees, Mountain, Waves,
  Utensils, Coffee, Wine, Beer, Pizza, Soup, ChefHat,
  Clock, Calendar, CalendarDays, Timer, Sunrise, Sunset, Moon, Sun,
  Car, Bus, Train, Plane, Ship, Bike, Navigation, ParkingCircle,
  Video, Image, Mic, Volume2, Film, Tv,
  MessageSquare, Mail, Phone, Send, AtSign, MessagesSquare, UserPlus,
  Star, Flag, Bell, Bookmark, Tag, Hash, Info, HelpCircle,
  Smile, Frown, Meh, ThumbsUp, ThumbsDown, Award, Trophy, Medal,
  Download, Upload, Save, Edit, Trash, Plus, Minus, Check,
  AlertCircle, AlertTriangle, Ban, Shield, Lock, Unlock, Key,
  Settings, Wrench, Tool, Hammer, Briefcase, Package, Box
} from "lucide-react";

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
  currentIcon?: string;
}

// アイコンマップを作成
const iconMap = {
  // 結婚式
  Church, Heart, Users, Flower, Gift, Camera, Music, Sparkles, Cake,
  // 場所
  MapPin, Home, Building, Hotel, Tent, Trees, Mountain, Waves,
  // 飲食
  Utensils, Coffee, Wine, Beer, Pizza, Soup, ChefHat,
  // 時間
  Clock, Calendar, CalendarDays, Timer, Sunrise, Sunset, Moon, Sun,
  // 交通
  Car, Bus, Train, Plane, Ship, Bike, Navigation, ParkingCircle,
  // メディア
  Video, Image, Mic, Volume2, Film, Tv,
  // コミュニケーション
  MessageSquare, Mail, Phone, Send, AtSign, MessagesSquare, UserPlus,
  // その他
  Star, Flag, Bell, Bookmark, Tag, Hash, Info, HelpCircle,
  // 感情
  Smile, Frown, Meh, ThumbsUp, ThumbsDown,
  // 賞・トロフィー
  Award, Trophy, Medal,
  // 操作
  Download, Upload, Save, Edit, Trash, Plus, Minus, Check,
  // 警告・セキュリティ
  AlertCircle, AlertTriangle, Ban, Shield, Lock, Unlock, Key,
  // ツール
  Settings, Wrench, Tool, Hammer, Briefcase, Package, Box
};

// カテゴリー別のアイコン
const iconCategories = {
  "結婚式": ["Church", "Heart", "Users", "Flower", "Gift", "Camera", "Music", "Sparkles", "Cake"],
  "場所": ["MapPin", "Home", "Building", "Hotel", "Tent", "Trees", "Mountain", "Waves"],
  "飲食": ["Utensils", "Coffee", "Wine", "Beer", "Cake", "Pizza", "Soup", "ChefHat"],
  "時間": ["Clock", "Calendar", "CalendarDays", "Timer", "Sunrise", "Sunset", "Moon", "Sun"],
  "交通": ["Car", "Bus", "Train", "Plane", "Ship", "Bike", "Navigation", "ParkingCircle"],
  "メディア": ["Camera", "Video", "Image", "Mic", "Volume2", "Music", "Film", "Tv"],
  "コミュニケーション": ["MessageSquare", "Mail", "Phone", "Send", "AtSign", "MessagesSquare", "UserPlus"],
  "その他": ["Star", "Flag", "Bell", "Bookmark", "Tag", "Hash", "Info", "HelpCircle"]
};

export function IconPickerModal({ isOpen, onClose, onSelect, currentIcon }: IconPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("結婚式");
  const [currentPage, setCurrentPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // すべてのアイコン名を取得
  const allIconNames = Object.keys(iconMap);

  // 検索またはカテゴリーでフィルタリング
  const filteredIcons = useMemo(() => {
    if (searchTerm) {
      return allIconNames.filter((icon) =>
        icon.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory === "すべて") {
      return allIconNames;
    }
    
    return iconCategories[selectedCategory as keyof typeof iconCategories] || [];
  }, [searchTerm, selectedCategory]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedIcons = filteredIcons.slice(startIndex, endIndex);

  // カテゴリーや検索が変わったらページをリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-2xl h-[600px] rounded-lg shadow-xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="p-4 border-b shrink-0">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="text-lg font-semibold">アイコンを選択</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* 検索 */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedCategory("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* カテゴリータブ */}
        {!searchTerm && (
          <div className="px-4 pt-3 pb-2 border-b overflow-x-auto shrink-0">
            <div className="flex gap-1">
              {Object.keys(iconCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
              <button
                onClick={() => setSelectedCategory("すべて")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === "すべて"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                すべて
              </button>
            </div>
          </div>
        )}

        {/* 現在の選択 */}
        {currentIcon && (
          <div className="px-4 py-2 bg-blue-50 border-b shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">現在の選択:</span>
                {(() => {
                  const Icon = iconMap[currentIcon as keyof typeof iconMap];
                  return Icon ? (
                    <>
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{currentIcon}</span>
                    </>
                  ) : (
                    <span className="font-medium">{currentIcon}</span>
                  );
                })()}
              </div>
              <button
                onClick={() => onSelect("")}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                削除
              </button>
            </div>
          </div>
        )}

        {/* アイコングリッド */}
        <div style={{ height: '188px' }} className="overflow-hidden">
          <div className="h-full overflow-y-auto p-4">
            {filteredIcons.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                アイコンが見つかりませんでした
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '4px'
              }}>
                {paginatedIcons.map((iconName) => {
                const Icon = iconMap[iconName as keyof typeof iconMap];
                const isSelected = iconName === currentIcon;
                
                return Icon ? (
                  <button
                    key={iconName}
                    onClick={() => onSelect(iconName)}
                    className={`
                      aspect-square p-2 rounded hover:bg-gray-100 transition-colors relative group flex items-center justify-center
                      ${isSelected ? "bg-blue-100 hover:bg-blue-200" : ""}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? "text-blue-600" : "text-gray-700"}`} />
                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none" />
                    )}
                    {/* ツールチップ */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {iconName}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </button>
                ) : null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ページネーション */}
        <div className="px-4 py-3 border-t flex items-center justify-between shrink-0" style={{ minHeight: '60px' }}>
          <div className="text-sm text-gray-600">
            {filteredIcons.length}件中 {startIndex + 1}-{Math.min(endIndex, filteredIcons.length)}件を表示
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (totalPages <= 7 || page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 3 || page === currentPage + 3) {
                  return <span key={page} className="px-1 text-gray-400">...</span>;
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}