"use client";

import {
  Search,
  Camera,
  Video,
  Clapperboard,
  Palette,
  PenTool,
  ThumbsUp,
  CheckCircle2,
  Send,
  Rocket,
  Megaphone,
  Image as ImageIcon,
  FileText,
  Users,
  Calendar,
  Sparkles,
  LayoutList,
  type LucideIcon,
} from "lucide-react";

export const COLUMN_ICONS: Record<string, LucideIcon> = {
  "layout-list": LayoutList,
  search: Search,
  camera: Camera,
  video: Video,
  clapperboard: Clapperboard,
  palette: Palette,
  "pen-tool": PenTool,
  "thumbs-up": ThumbsUp,
  "check-circle": CheckCircle2,
  send: Send,
  rocket: Rocket,
  megaphone: Megaphone,
  image: ImageIcon,
  "file-text": FileText,
  users: Users,
  calendar: Calendar,
  sparkles: Sparkles,
};

export function ColumnIcon({
  name,
  size = 14,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Icon = COLUMN_ICONS[name] ?? LayoutList;
  return <Icon size={size} className={className} />;
}

export default function ColumnIconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(COLUMN_ICONS).map(([key, Icon]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-label={`Ícone ${key}`}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
            value === key
              ? "border-mova-500 bg-mova-100 text-mova-700"
              : "border-slate-200 text-slate-500 hover:bg-slate-50"
          }`}
        >
          <Icon size={15} />
        </button>
      ))}
    </div>
  );
}
