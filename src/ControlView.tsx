import { useState } from "react";
import { DECKS } from "./decks";
import { favorSlides } from "./slides/favorSlides";
import { contraSlides } from "./slides/contraSlides";
import type { Choice, RoundState } from "./useRound";

const DECK_SLIDES: Record<Choice, string[]> = { favor: favorSlides, contra: contraSlides };

export function ControlView({
  round,
  connected,
  launchRound,
  startPresentation,
  goToSlide,
  stopPresentation,
}: {
  round: RoundState;
  connected: boolean;
  launchRound: (durationMs?: number) => void;
  startPresentation: (deck: Choice) => void;
  goToSlide: (index: number) => void;
  stopPresentation: () => void;
}) {
  const [seconds, setSeconds] = useState(10);

  const total = round.favor + round.contra;
  const winner: Choice | "empate" | null =
    round.status === "ended"
      ? round.favor === round.contra
        ? "empate"
        : round.favor > round.contra
          ? "favor"
          : "contra"
      : null;

  if (round.presentDeck) {
    const slides = DECK_SLIDES[round.presentDeck];
    const index = Math.min(round.presentIndex, slides.length - 1);
    return (
      <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-6 py-12">
        <header className="flex flex-col items-center gap-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
            Apresentando
          </span>
          <h1 className="font-serif text-2xl font-semibold text-ink">
            {DECKS[round.presentDeck].label}
          </h1>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center gap-8 rounded-2xl border border-line bg-white/60 p-8">
          <p className="font-serif text-5xl font-bold tabular-nums text-ink">
            {index + 1}
            <span className="text-2xl text-ink-soft"> / {slides.length}</span>
          </p>
          <div className="grid w-full grid-cols-2 gap-4">
            <button
              onClick={() => goToSlide(index - 1)}
              disabled={index === 0}
              className="rounded-full border border-line bg-white py-6 text-lg font-semibold text-ink transition-transform active:scale-95 disabled:opacity-30"
            >
              ← Anterior
            </button>
            <button
              onClick={() => goToSlide(index + 1)}
              disabled={index === slides.length - 1}
              className="rounded-full bg-ink py-6 text-lg font-semibold text-paper transition-transform active:scale-95 disabled:opacity-30"
            >
              Próximo →
            </button>
          </div>
          <button
            onClick={stopPresentation}
            className="text-sm font-semibold text-ink-soft underline underline-offset-4"
          >
            Encerrar apresentação
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col gap-8 px-6 py-12">
      <header className="flex flex-col items-center gap-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
          Seu controle
        </span>
        <h1 className="font-serif text-3xl font-semibold text-ink">
          Liberar a votação
        </h1>
        <p className="text-sm text-ink-soft">
          {connected ? "Conectado à rodada ao vivo" : "Conectando…"}
        </p>
      </header>

      <section className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white/60 p-8">
        {round.status === "running" ? (
          <>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-soft">
              Rodada em andamento
            </p>
            <div className="grid w-full grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-1 rounded-xl border border-favor/30 bg-favor-soft p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-favor">
                  {DECKS.favor.label}
                </span>
                <span className="font-serif text-4xl font-bold tabular-nums text-favor">
                  {round.favor}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl border border-contra/30 bg-contra-soft p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-contra">
                  {DECKS.contra.label}
                </span>
                <span className="font-serif text-4xl font-bold tabular-nums text-contra">
                  {round.contra}
                </span>
              </div>
            </div>
            <p className="text-sm text-ink-soft">{total} toques até agora</p>
          </>
        ) : round.status === "ended" && winner ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
              Resultado da rodada
            </p>
            <p className="font-serif text-2xl text-ink">
              {winner === "empate"
                ? `Empate, ${round.favor} a ${round.contra}`
                : `${DECKS[winner].label} venceu, ${round.favor} a ${round.contra}`}
            </p>
            {winner !== "empate" && (
              <button
                onClick={() => startPresentation(winner)}
                className="w-full rounded-full bg-ink px-8 py-5 text-lg font-semibold text-paper transition-transform active:scale-95"
              >
                Iniciar apresentação
              </button>
            )}
            <button
              onClick={() => launchRound(seconds * 1000)}
              className="text-sm font-semibold text-ink-soft underline underline-offset-4"
            >
              Nova votação
            </button>
          </>
        ) : (
          <>
            <label className="flex items-center gap-3 text-sm font-medium text-ink-soft">
              Duração da rodada
              <input
                type="number"
                min={5}
                max={30}
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value) || 10)}
                className="w-16 rounded-lg border border-line bg-paper px-2 py-1 text-center text-ink"
              />
              segundos
            </label>
            <button
              onClick={() => launchRound(seconds * 1000)}
              className="w-full rounded-full bg-ink px-8 py-5 text-lg font-semibold text-paper transition-transform active:scale-95"
            >
              Liberar votação agora
            </button>
          </>
        )}
      </section>

      <footer className="mt-auto text-center text-xs text-ink-soft">
        Página pessoal — não compartilhe este link, só o do quadro.
      </footer>
    </div>
  );
}
