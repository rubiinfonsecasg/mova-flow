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
          <Link href="/fluxos" className="group relative h-11 w-44 overflow-hidden transition group-hover:scale-105 sm:h-12 sm:w-48">
            <Image
              src="/mova-logo-transparente.png"
              alt="Mova Marketing Digital"
              fill
              sizes="200px"
              className="object-cover object-center"
              priority
            />
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
