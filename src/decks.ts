import type { Choice } from "./useRound";

export const DECKS: Record<Choice, { label: string; url: string; blurb: string }> = {
  favor: {
    label: "A Favor",
    url: "https://claude.ai/artifact/NzcK9XJf1SR85S5CnHygP8",
    blurb: "Reparação histórica, dados do INEP e a defesa da política afirmativa.",
  },
  contra: {
    label: "Contra",
    url: "https://claude.ai/artifact/3Ffj7wFFkGrS26fgU8RZUt",
    blurb: "Mérito individual, igualdade formal e a alternativa socioeconômica.",
  },
};
