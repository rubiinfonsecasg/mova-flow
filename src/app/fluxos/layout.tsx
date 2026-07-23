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
      <header className="relative border-b border-white/10 bg-mova-900">
        <div className="flex items-center justify-between px-6 py-3.5">
          <Link href="/fluxos" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/0 shadow-inner transition group-hover:scale-105">
              <Image src="/mova-icon.png" alt="Mova" width={30} height={30} className="h-[30px] w-[30px]" priority />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-white">Mova Flow</span>
              <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-mova-300">
                Marketing Digital
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Avatar profile={{ id: "", name: profileName, color: profileColor, created_at: "" }} size={28} />
            <span className="text-sm text-mova-100">{profileName}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-mova-100 transition hover:border-white/30 hover:bg-white/10"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-mova-pink via-mova-500 to-mova-teal" />
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
