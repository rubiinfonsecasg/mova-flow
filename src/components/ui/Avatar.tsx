import type { Profile } from "@/types/database";

export default function Avatar({ profile, size = 24 }: { profile: Profile; size?: number }) {
  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <span
      title={profile.name}
      style={{ backgroundColor: profile.color, width: size, height: size, fontSize: size * 0.42 }}
      className="flex shrink-0 items-center justify-center rounded-full font-medium text-white"
    >
      {initials}
    </span>
  );
}
