import { Clock, Users, Church, Utensils, Music } from "lucide-react";

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color: {
    bg: string;
    text: string;
  };
}

export const scheduleData: ScheduleItem[] = [
  {
    id: "reception",
    time: "13:15",
    title: "受付開始",
    description: "ウェルカムドリンクをご用意しております",
    icon: Users,
    color: {
      bg: "bg-blue-100",
      text: "text-blue-600"
    }
  },
  {
    id: "ceremony",
    time: "14:15",
    title: "挙式",
    description: "チャペルでの挙式となります",
    icon: Church,
    color: {
      bg: "bg-pink-100",
      text: "text-pink-600"
    }
  },
  {
    id: "reception-start",
    time: "15:30",
    title: "披露宴開宴",
    description: "お食事・歓談、余興・スピーチ",
    icon: Utensils,
    color: {
      bg: "bg-amber-100",
      text: "text-amber-600"
    }
  },
  {
    id: "closing",
    time: "18:30",
    title: "お開き（予定）",
    description: undefined,
    icon: Clock,
    color: {
      bg: "bg-green-100",
      text: "text-green-600"
    }
  }
];

export const getScheduleItems = () => {
  return scheduleData;
};

export const getScheduleItemById = (id: string) => {
  return scheduleData.find(item => item.id === id);
};