import { useEffect, useState } from "react";
import { DECKS } from "./decks";
import type { Choice, RoundState } from "./useRound";

function useCountdown(round: RoundState) {
  const [msLeft, setMsLeft] = useState(0);
  useEffect(() => {
    if (round.status !== "running") {
      setMsLeft(0);
      return;
    }
    const tick = () => {
      setMsLeft(Math.max(0, round.startedAt + round.durationMs - Date.now()));
    };
    tick();
    const id = setInterval(tick, 60);
    return () => clearInterval(id);
  }, [round.status, round.startedAt, round.durationMs]);
  return msLeft;
}

function MashButton({
  choice,
  count,
  onTap,
  disabled,
}: {
  choice: Choice;
  count: number;
  onTap: (c: Choice) => void;
  disabled: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const isFavor = choice === "favor";
  const deck = DECKS[choice];

  return (
    <button
      disabled={disabled}
      onPointerDown={(e) => {
        e.preventDefault();
        setPressed(true);
        onTap(choice);
      }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`group relative flex flex-1 select-none flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border-2 px-6 py-10 text-center transition-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 ${
        isFavor
          ? "border-favor bg-favor-soft"
          : "border-contra bg-contra-soft"
      } ${pressed ? "scale-[0.97]" : ""}`}
      style={{ touchAction: "manipulation" }}
    >
      <span
        className={`text-xs font-semibold uppercase tracking-[0.25em] ${
          isFavor ? "text-favor" : "text-contra"
        }`}
      >
        {deck.label}
      </span>
      <span
        className={`font-serif text-6xl font-bold tabular-nums sm:text-7xl ${
          isFavor ? "text-favor" : "text-contra"
        }`}
      >
        {count}
      </span>
      <span className="text-sm text-ink-soft">toque o mais rápido possível</span>
    </button>
  );
}

export function ParticipantView({
  round,
  connected,
  tap,
}: {
  round: RoundState;
  connected: boolean;
  tap: (c: Choice) => void;
}) {
  const msLeft = useCountdown(round);
  const total = round.favor + round.contra;
  const winner: Choice | "empate" | null =
    round.status === "ended"
      ? round.favor === round.contra
        ? "empate"
        : round.favor > round.contra
          ? "favor"
          : "contra"
      : null;

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-10 px-6 py-12 sm:py-16">
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
          Clique rápido para escolher
        </span>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Cotas raciais: qual tema vence?
        </h1>
        <p className="max-w-md text-base text-ink-soft">
          Quando o organizador disparar a rodada, toque o mais rápido possível
          no lado que você quer ver apresentado.
        </p>
        {!connected && (
          <p className="text-sm text-contra-accent">Conectando à rodada ao vivo…</p>
        )}
      </header>

      {round.status === "idle" && (
        <section className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white/60 p-10 text-center">
          <p className="text-lg font-semibold text-ink">
            Aguardando o organizador iniciar a rodada
          </p>
          <p className="max-w-sm text-sm text-ink-soft">
            Fique com o celular na mão — os botões de disputa aparecem aqui
            assim que a contagem começar.
          </p>
          <div className="grid w-full gap-4 sm:grid-cols-2">
            {(["favor", "contra"] as Choice[]).map((c) => (
              <div
                key={c}
                className={`rounded-xl border p-5 text-left ${
                  c === "favor"
                    ? "border-favor/30 bg-favor-soft"
                    : "border-contra/30 bg-contra-soft"
                }`}
              >
                <p
                  className={`text-sm font-semibold uppercase tracking-wide ${
                    c === "favor" ? "text-favor" : "text-contra"
                  }`}
                >
                  {DECKS[c].label}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{DECKS[c].blurb}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {round.status === "running" && (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="font-serif text-5xl font-bold tabular-nums text-ink">
              {(msLeft / 1000).toFixed(1)}s
            </span>
            <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-paper-dim">
              <div
                className="h-full rounded-full bg-ink transition-[width] duration-100 ease-linear"
                style={{ width: `${(msLeft / round.durationMs) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <MashButton choice="favor" count={round.favor} onTap={tap} disabled={false} />
            <MashButton choice="contra" count={round.contra} onTap={tap} disabled={false} />
          </div>
        </section>
      )}

      {round.status === "ended" && winner && (
        <section className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white/60 p-8 text-center sm:p-12">
          {winner === "empate" ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
                Resultado
              </span>
              <h2 className="font-serif text-3xl font-semibold text-ink">
                Empate! {round.favor} a {round.contra}
              </h2>
              <p className="text-sm text-ink-soft">
                As duas apresentações valem a pena — escolha por onde começar.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={DECKS.favor.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-favor px-6 py-3 text-sm font-semibold text-paper"
                >
                  Abrir "A Favor" →
                </a>
                <a
                  href={DECKS.contra.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-contra px-6 py-3 text-sm font-semibold text-paper"
                >
                  Abrir "Contra" →
                </a>
              </div>
            </>
          ) : (
            <>
              <span
                className={`text-xs font-semibold uppercase tracking-[0.3em] ${
                  winner === "favor" ? "text-favor" : "text-contra"
                }`}
              >
                Venceu por {Math.abs(round.favor - round.contra)} cliques
              </span>
              <h2 className="font-serif text-4xl font-semibold text-ink">
                "{DECKS[winner].label}" é a apresentação de hoje
              </h2>
              <p className="text-sm text-ink-soft">
                {round.favor} a {round.contra} · {total} toques no total
              </p>
              <a
                href={DECKS[winner].url}
                target="_blank"
                rel="noreferrer"
                className={`rounded-full px-8 py-4 text-base font-semibold text-paper ${
                  winner === "favor" ? "bg-favor" : "bg-contra"
                }`}
              >
                Abrir a apresentação →
              </a>
              <a
                href={DECKS[winner === "favor" ? "contra" : "favor"].url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-ink-soft underline underline-offset-4"
              >
                Ver o outro lado também
              </a>
            </>
          )}
        </section>
      )}

      <footer className="mt-auto pt-6 text-center text-xs text-ink-soft">
        Conteúdo produzido para fins de debate e estudo.
      </footer>
    </div>
  );
}
