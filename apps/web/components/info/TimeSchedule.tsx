import { Clock } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  colorBg: string;
  colorText: string;
}

interface TimeScheduleProps {
  scheduleItems: ScheduleItem[];
}

// Tailwind CSSの動的クラスを事前定義
const colorClasses = {
  "bg-blue-100": "bg-blue-100",
  "bg-pink-100": "bg-pink-100",
  "bg-amber-100": "bg-amber-100",
  "bg-green-100": "bg-green-100",
  "bg-purple-100": "bg-purple-100",
  "bg-red-100": "bg-red-100",
  "bg-gray-100": "bg-gray-100",
  "text-blue-600": "text-blue-600",
  "text-pink-600": "text-pink-600",
  "text-amber-600": "text-amber-600",
  "text-green-600": "text-green-600",
  "text-purple-600": "text-purple-600",
  "text-red-600": "text-red-600",
  "text-gray-600": "text-gray-600",
} as const;

export default function TimeSchedule({ scheduleItems }: TimeScheduleProps) {
  // スケジュールがない場合は表示しない
  if (!scheduleItems || scheduleItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Clock className="w-6 h-6 text-blue-600 mr-2" />
          タイムスケジュール
        </h2>
        <p className="text-gray-500 text-center py-8">
          スケジュールは後日公開予定です
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <Clock className="w-6 h-6 text-blue-600 mr-2" />
        タイムスケジュール
      </h2>
      
      <div className="relative">
        {/* タイムライン */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        <div className="space-y-6">
          {scheduleItems.map((item, index) => {
            const Icon = item.icon ? (Icons as any)[item.icon] : null;
            
            return (
              <div key={item.id} className="flex items-start">
                <div className="relative">
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center",
                    colorClasses[item.colorBg as keyof typeof colorClasses] || "bg-gray-100"
                  )}>
                    <span className={cn(
                      "font-bold",
                      colorClasses[item.colorText as keyof typeof colorClasses] || "text-gray-600"
                    )}>{item.time}</span>
                  </div>
                </div>
                
                <div className="ml-6 pt-3">
                  <h3 className="font-semibold text-lg flex items-center">
                    {Icon && <Icon className={cn(
                      "w-5 h-5 mr-2",
                      colorClasses[item.colorText as keyof typeof colorClasses] || "text-gray-600"
                    )} />}
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}