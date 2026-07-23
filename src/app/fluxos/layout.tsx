import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import Link from "next/link";

export default async function FluxosLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileName = user?.email ?? "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();
    if (profile?.name) profileName = profile.name;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <Link href="/fluxos" className="text-lg font-semibold text-slate-900">
          Mova Flow
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{profileName}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
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
