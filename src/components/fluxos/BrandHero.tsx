import Image from "next/image";

/**
 * Ilustração decorativa da marca — fica dentro do fluxo normal da página
 * (não é fixed/absolute sobre o conteúdo), então nunca sobrepõe ou corta
 * outras seções, mesmo quando a página cresce.
 *
 * A imagem original tem bastante margem transparente ao redor do desenho,
 * então usamos object-cover com um recorte para o desenho aparecer grande.
 */
export default function BrandHero() {
  return (
    <div className="relative mx-auto flex h-56 w-full max-w-md items-center justify-center overflow-hidden sm:h-64" aria-hidden>
      <div className="absolute h-48 w-48 rounded-full bg-mova-500/25 blur-[70px]" />
      <div className="absolute right-8 top-2 h-28 w-28 rounded-full bg-mova-pink/20 blur-[55px]" />
      <div className="absolute bottom-2 left-8 h-28 w-28 rounded-full bg-mova-teal/20 blur-[55px]" />
      <Image
        src="/mova-ilustracao-3d.png"
        alt=""
        fill
        sizes="400px"
        className="relative object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
        style={{ transform: "scale(2.3)" }}
      />
    </div>
  );
}
