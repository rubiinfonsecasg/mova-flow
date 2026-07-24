import Image from "next/image";

export default function BrandHero() {
  return (
    <div className="relative flex h-64 w-64 shrink-0 items-center justify-center xl:h-80 xl:w-80" aria-hidden>
      <div className="absolute h-48 w-48 rounded-full bg-mova-500/25 blur-[70px]" />
      <div className="absolute right-4 top-2 h-28 w-28 rounded-full bg-mova-pink/20 blur-[55px]" />
      <div className="absolute bottom-2 left-4 h-28 w-28 rounded-full bg-mova-teal/20 blur-[55px]" />
      <Image
        src="/mova-ilustracao-3d.png"
        alt=""
        fill
        sizes="320px"
        className="relative object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
      />
    </div>
  );
}
