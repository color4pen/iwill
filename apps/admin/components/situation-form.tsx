"use client";

import { useState } from "react";
import { IconPickerModal } from "@repo/ui/icon-picker-modal";
import * as Icons from "lucide-react";

interface SituationFormProps {
  situation?: {
    id?: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    order: number;
  };
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export default function SituationForm({ situation, action, submitLabel }: SituationFormProps) {
  const [selectedIcon, setSelectedIcon] = useState(situation?.icon || "");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    // アイコンを追加
    formData.set("icon", selectedIcon);
    await action(formData);
  };

  const Icon = selectedIcon ? (Icons as any)[selectedIcon] : null;

  return (
    <>
      <form action={handleSubmit} id="situation-form">
        {situation?.id && (
          <input type="hidden" name="id" value={situation.id} />
        )}
        
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={situation?.name || ""}
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
            defaultValue={situation?.description || ""}
            placeholder="このシチュエーションの説明"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            アイコン
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowIconPicker(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              {Icon ? (
                <>
                  <Icon className="w-5 h-5" />
                  <span>{selectedIcon}</span>
                </>
              ) : (
                <span>アイコンを選択</span>
              )}
            </button>
            {selectedIcon && (
              <button
                type="button"
                onClick={() => setSelectedIcon("")}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                削除
              </button>
            )}
          </div>
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
            defaultValue={situation?.order || 1}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </form>

      <IconPickerModal
        isOpen={showIconPicker}
        onClose={() => setShowIconPicker(false)}
        onSelect={(iconName) => {
          setSelectedIcon(iconName);
          setShowIconPicker(false);
        }}
        currentIcon={selectedIcon}
      />
    </>
  );
}