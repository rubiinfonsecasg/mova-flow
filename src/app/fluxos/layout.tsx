import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import Avatar from "@/components/ui/Avatar";

export default async function FluxosLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileName = user?.email ?? "";
  let profileColor = "#7c3aed";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name, color")
      .eq("id", user.id)
      .single();
    if (profile?.name) profileName = profile.name;
    if (profile?.color) profileColor = profile.color;
  }

  return (
    <div className="flex min-h-screen flex-col bg-mova-950">
      <header className="flex items-center justify-between border-b border-white/10 bg-mova-900 px-6 py-3">
        <Link href="/fluxos" className="flex items-center gap-2.5">
          <Image src="/mova-icon.png" alt="Mova" width={28} height={28} className="h-7 w-7" />
          <span className="text-lg font-semibold text-white">Mova Flow</span>
        </Link>
        <div className="flex items-center gap-3">
          <Avatar profile={{ id: "", name: profileName, color: profileColor, created_at: "" }} size={26} />
          <span className="text-sm text-mova-100">{profileName}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-mova-100 transition hover:bg-white/10"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
