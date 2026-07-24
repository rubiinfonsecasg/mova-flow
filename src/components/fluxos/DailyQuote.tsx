import { Quote, BookOpen } from "lucide-react";
import { getDailyMessage } from "@/lib/dailyMessage";

export default function DailyQuote() {
  const { text, verseText, verseRef } = getDailyMessage();

  return (
    <div className="rounded-2xl border border-white/10 bg-mova-900/60 p-5 shadow-xl shadow-black/30 backdrop-blur-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-mova-200">
        Frase do dia
      </h2>

      <div className="mt-3 flex gap-2.5">
        <Quote size={16} className="mt-0.5 shrink-0 text-mova-pink" />
        <p className="text-sm leading-relaxed text-white/90">{text}</p>
      </div>

      <div className="mt-4 flex gap-2.5 border-t border-white/10 pt-4">
        <BookOpen size={16} className="mt-0.5 shrink-0 text-mova-teal" />
        <p className="text-sm italic leading-relaxed text-mova-100">
          {verseText} <span className="not-italic text-mova-300">— {verseRef}</span>
        </p>
      </div>
    </div>
  );
}
