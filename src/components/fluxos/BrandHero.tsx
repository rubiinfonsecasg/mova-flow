import Image from "next/image";

/**
 * Ilustração decorativa da marca — fica dentro do fluxo normal da página
 * (não é fixed/absolute sobre o conteúdo), então nunca sobrepõe ou corta
 * outras seções, mesmo quando a página cresce.
 */
export default function BrandHero() {
  return (
    <div className="relative mx-auto flex h-72 w-72 items-center justify-center" aria-hidden>
      <div className="absolute h-56 w-56 rounded-full bg-mova-500/25 blur-[70px]" />
      <div className="absolute right-4 top-4 h-32 w-32 rounded-full bg-mova-pink/20 blur-[60px]" />
      <div className="absolute bottom-4 left-4 h-32 w-32 rounded-full bg-mova-teal/20 blur-[60px]" />
      <Image
        src="/mova-ilustracao-3d.png"
        alt=""
        fill
        sizes="288px"
        className="relative object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
      />
    </div>
  );
}
