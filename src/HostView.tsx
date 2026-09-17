import { useState } from "react";
import { QrCode } from "./QrCode";
import { DECKS } from "./decks";
import type { RoundState } from "./useRound";

export function HostView({
  round,
  connected,
  launchRound,
}: {
  round: RoundState;
  connected: boolean;
  launchRound: (durationMs?: number) => void;
}) {
  const [seconds, setSeconds] = useState(10);
  const participantUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/`
      : "https://cotas-raciais-votacao.vercel.app/";

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
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col gap-12 px-6 py-12 sm:py-16">
      <header className="flex flex-col gap-2 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
          Painel do organizador
        </span>
        <h1 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Cotas raciais: qual tema vence?
        </h1>
        <p className="text-sm text-ink-soft">
          {connected ? "Conectado à rodada ao vivo" : "Conectando…"}
        </p>
      </header>

      <section className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white/60 p-10 sm:flex-row sm:justify-between">
        <QrCode value={participantUrl} size={220} />
        <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Projete esta tela
          </p>
          <p className="max-w-sm text-ink-soft">
            O público escaneia o QR code para entrar na disputa pelo celular.
          </p>
          <p className="mt-1 break-all text-sm font-medium text-ink">{participantUrl}</p>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 rounded-2xl border border-line bg-white/60 p-10">
        {round.status !== "running" ? (
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
              className="rounded-full bg-ink px-10 py-5 text-lg font-semibold text-paper transition-transform active:scale-95"
            >
              Disparar: clique rápido para escolher
            </button>
            {round.status === "ended" && winner && (
              <div className="mt-2 flex flex-col items-center gap-2 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-soft">
                  Última rodada
                </p>
                <p className="font-serif text-2xl text-ink">
                  {winner === "empate"
                    ? `Empate, ${round.favor} a ${round.contra}`
                    : `${DECKS[winner].label} venceu, ${round.favor} a ${round.contra}`}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex w-full flex-col items-center gap-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-soft">
              Rodada em andamento
            </p>
            <div className="grid w-full gap-6 sm:grid-cols-2">
              <div className="flex flex-col items-center gap-2 rounded-xl border border-favor/30 bg-favor-soft p-6">
                <span className="text-sm font-semibold uppercase tracking-wide text-favor">
                  {DECKS.favor.label}
                </span>
                <span className="font-serif text-6xl font-bold tabular-nums text-favor">
                  {round.favor}
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-xl border border-contra/30 bg-contra-soft p-6">
                <span className="text-sm font-semibold uppercase tracking-wide text-contra">
                  {DECKS.contra.label}
                </span>
                <span className="font-serif text-6xl font-bold tabular-nums text-contra">
                  {round.contra}
                </span>
              </div>
            </div>
            <p className="text-sm text-ink-soft">{total} toques até agora</p>
          </div>
        )}
      </section>

      <footer className="mt-auto text-center text-xs text-ink-soft">
        Esta página é só para quem organiza a votação — compartilhe o link raiz
        com o público, não este.
      </footer>
    </div>
  );
}
