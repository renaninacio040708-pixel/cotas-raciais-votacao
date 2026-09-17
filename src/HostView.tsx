import { QrCode } from "./QrCode";
import { SlidesPlayer } from "./SlidesPlayer";
import { DECKS } from "./decks";
import { favorSlides } from "./slides/favorSlides";
import { contraSlides } from "./slides/contraSlides";
import type { RoundState } from "./useRound";

const DECK_SLIDES = { favor: favorSlides, contra: contraSlides };

export function HostView({
  round,
  connected,
}: {
  round: RoundState;
  connected: boolean;
}) {
  const participantUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/`
      : "https://cotas-raciais-votacao.vercel.app/";

  if (round.presentDeck) {
    const slides = DECK_SLIDES[round.presentDeck];
    const index = Math.min(round.presentIndex, slides.length - 1);
    return (
      <div className="h-svh w-full bg-black">
        <SlidesPlayer html={slides[index]} />
      </div>
    );
  }

  const total = round.favor + round.contra;
  const winner =
    round.status === "ended"
      ? round.favor === round.contra
        ? "empate"
        : round.favor > round.contra
          ? "favor"
          : "contra"
      : null;

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col items-center justify-center gap-12 px-6 py-12 text-center sm:py-16">
      <header className="flex flex-col items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
          Debate público · educação e política pública
        </span>
        <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Cotas raciais: qual tema vence?
        </h1>
        <p className="text-sm text-ink-soft">
          {connected ? "Conectado à rodada ao vivo" : "Conectando…"}
        </p>
      </header>

      {round.status === "idle" && (
        <section className="flex flex-col items-center gap-8 rounded-2xl border border-line bg-white/60 p-12">
          <QrCode value={participantUrl} size={280} />
          <div className="flex flex-col items-center gap-2">
            <p className="text-lg font-semibold text-ink">
              Escaneie para entrar na disputa
            </p>
            <p className="max-w-sm text-ink-soft">
              A votação abre quando o organizador liberar pelo celular.
            </p>
          </div>
        </section>
      )}

      {round.status === "running" && (
        <section className="flex w-full flex-col items-center gap-8 rounded-2xl border border-line bg-white/60 p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-soft">
            Votação em andamento — toquem no celular!
          </p>
          <div className="grid w-full gap-8 sm:grid-cols-2">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-favor/30 bg-favor-soft p-10">
              <span className="text-base font-semibold uppercase tracking-wide text-favor">
                {DECKS.favor.label}
              </span>
              <span className="font-serif text-8xl font-bold tabular-nums text-favor">
                {round.favor}
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 rounded-xl border border-contra/30 bg-contra-soft p-10">
              <span className="text-base font-semibold uppercase tracking-wide text-contra">
                {DECKS.contra.label}
              </span>
              <span className="font-serif text-8xl font-bold tabular-nums text-contra">
                {round.contra}
              </span>
            </div>
          </div>
          <p className="text-base text-ink-soft">{total} toques até agora</p>
        </section>
      )}

      {round.status === "ended" && winner && (
        <section className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white/60 p-12">
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-soft">
            Resultado
          </span>
          {winner === "empate" ? (
            <h2 className="font-serif text-5xl font-semibold text-ink">
              Empate! {round.favor} a {round.contra}
            </h2>
          ) : (
            <>
              <h2 className="font-serif text-6xl font-semibold text-ink">
                "{DECKS[winner].label}" venceu
              </h2>
              <p
                className={`text-2xl font-semibold ${winner === "favor" ? "text-favor" : "text-contra"}`}
              >
                {round.favor} a {round.contra}
              </p>
            </>
          )}
        </section>
      )}

      <footer className="text-xs text-ink-soft">
        Tela para projetar — o controle da votação fica no celular do
        organizador.
      </footer>
    </div>
  );
}
