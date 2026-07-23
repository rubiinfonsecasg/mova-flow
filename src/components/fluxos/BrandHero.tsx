import Image from "next/image";

/**
 * Composição decorativa 3D no canto inferior direito do dashboard —
 * usa apenas CSS (blur + perspective), sem dependências externas.
 * Puramente visual: fica atrás do conteúdo e não recebe cliques.
 */
export default function BrandHero() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden [mask-image:linear-gradient(to_top_left,black_10%,transparent_75%)]"
    >
      <div className="absolute -bottom-40 -right-40 h-[620px] w-[620px] rounded-full bg-mova-pink/25 blur-[110px]" />
      <div className="absolute -bottom-10 right-52 h-[420px] w-[420px] rounded-full bg-mova-teal/20 blur-[100px]" />
      <div className="absolute bottom-0 -right-10 h-[520px] w-[520px] rounded-full bg-mova-500/30 blur-[90px]" />

      <div
        className="absolute bottom-24 right-16 h-40 w-56 rounded-2xl border border-white/10 bg-mova-800/70 shadow-2xl shadow-black/50 backdrop-blur-sm"
        style={{ transform: "perspective(1200px) rotateY(18deg) rotateX(6deg) rotate(-6deg)" }}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-mova-teal" />
            <div className="h-2 w-20 rounded-full bg-white/25" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-white/15" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
          </div>
          <span className="inline-flex w-fit rounded-md bg-mova-pink px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            Reels
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-16 right-56 h-32 w-48 rounded-2xl bg-white shadow-2xl shadow-black/40"
        style={{ transform: "perspective(1200px) rotateY(-14deg) rotateX(4deg) rotate(4deg)" }}
      >
        <div className="flex h-full flex-col justify-between p-3.5">
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-full bg-mova-500" />
            <span className="h-4 w-4 rounded-full bg-mova-pink" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-slate-200" />
            <div className="h-1.5 w-2/3 rounded-full bg-slate-200" />
          </div>
          <span className="inline-flex w-fit rounded-md bg-mova-teal px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            Postar
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-52 right-40 h-24 w-24 opacity-95 drop-shadow-[0_25px_35px_rgba(0,0,0,0.55)]"
        style={{ transform: "perspective(1200px) rotateY(-16deg) rotateX(10deg)" }}
      >
        <Image src="/mova-icon.png" alt="" fill sizes="96px" className="object-contain" />
      </div>
    </div>
  );
}
