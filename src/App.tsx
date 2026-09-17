import { HostView } from "./HostView";
import { ParticipantView } from "./ParticipantView";
import { useRound } from "./useRound";

export default function App() {
  const { round, connected, tap, launchRound } = useRound();
  const isHost =
    typeof window !== "undefined" &&
    window.location.pathname.replace(/\/+$/, "") === "/apresentador";

  return (
    <div className="min-h-svh bg-paper">
      {isHost ? (
        <HostView round={round} connected={connected} launchRound={launchRound} />
      ) : (
        <ParticipantView round={round} connected={connected} tap={tap} />
      )}
    </div>
  );
}
