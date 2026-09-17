import { useEffect, useRef, useState } from "react";
import { doc, increment, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export type Choice = "favor" | "contra";
export type RoundStatus = "idle" | "running" | "ended";

export interface RoundState {
  status: RoundStatus;
  startedAt: number;
  durationMs: number;
  favor: number;
  contra: number;
  presentDeck: Choice | null;
  presentIndex: number;
}

const ROUND_DOC = doc(db, "game", "round");
const FLUSH_MS = 180;

const DEFAULT_ROUND: RoundState = {
  status: "idle",
  startedAt: 0,
  durationMs: 10000,
  favor: 0,
  contra: 0,
  presentDeck: null,
  presentIndex: 0,
};

export function useRound() {
  const [round, setRound] = useState<RoundState>(DEFAULT_ROUND);
  const [connected, setConnected] = useState(false);
  const pending = useRef<{ favor: number; contra: number }>({ favor: 0, contra: 0 });
  const endedFlagged = useRef(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      ROUND_DOC,
      (snap) => {
        setConnected(true);
        if (!snap.exists()) {
          setRound(DEFAULT_ROUND);
          return;
        }
        const data = snap.data() as RoundState;
        setRound({
          status: data.status ?? "idle",
          startedAt: data.startedAt ?? 0,
          durationMs: data.durationMs ?? 10000,
          favor: data.favor ?? 0,
          contra: data.contra ?? 0,
          presentDeck: data.presentDeck ?? null,
          presentIndex: data.presentIndex ?? 0,
        });
        if (data.status !== "running") endedFlagged.current = false;
      },
      () => setConnected(false)
    );
    return unsubscribe;
  }, []);

  // Periodic flush of locally buffered clicks to Firestore.
  useEffect(() => {
    const id = setInterval(() => {
      const { favor, contra } = pending.current;
      if (favor === 0 && contra === 0) return;
      pending.current = { favor: 0, contra: 0 };
      const patch: Record<string, unknown> = {};
      if (favor) patch.favor = increment(favor);
      if (contra) patch.contra = increment(contra);
      updateDoc(ROUND_DOC, patch).catch(() => {});
    }, FLUSH_MS);
    return () => clearInterval(id);
  }, []);

  // Detect round end locally and flag it once in Firestore.
  useEffect(() => {
    if (round.status !== "running") return;
    const msLeft = round.startedAt + round.durationMs - Date.now();
    if (msLeft <= 0) {
      flagEnded();
      return;
    }
    const t = setTimeout(flagEnded, msLeft + 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.status, round.startedAt, round.durationMs]);

  function flagEnded() {
    if (endedFlagged.current) return;
    endedFlagged.current = true;
    updateDoc(ROUND_DOC, { status: "ended" }).catch(() => {});
  }

  function tap(choice: Choice) {
    if (round.status !== "running") return;
    pending.current[choice] += 1;
  }

  function launchRound(durationMs = 10000) {
    endedFlagged.current = false;
    pending.current = { favor: 0, contra: 0 };
    setDoc(ROUND_DOC, {
      status: "running",
      startedAt: Date.now(),
      durationMs,
      favor: 0,
      contra: 0,
    });
  }

  function startPresentation(deck: Choice) {
    updateDoc(ROUND_DOC, { presentDeck: deck, presentIndex: 0 }).catch(() => {});
  }

  function goToSlide(index: number) {
    updateDoc(ROUND_DOC, { presentIndex: Math.max(0, index) }).catch(() => {});
  }

  function stopPresentation() {
    updateDoc(ROUND_DOC, { presentDeck: null, presentIndex: 0 }).catch(() => {});
  }

  return {
    round,
    connected,
    tap,
    launchRound,
    startPresentation,
    goToSlide,
    stopPresentation,
    pendingRef: pending,
  };
}
