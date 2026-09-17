import { ControlView } from "./ControlView";
import { HostView } from "./HostView";
import { ParticipantView } from "./ParticipantView";
import { useRound } from "./useRound";

export default function App() {
  const { round, connected, tap, launchRound, startPresentation, goToSlide, stopPresentation } =
    useRound();
  const path =
    typeof window !== "undefined" ? window.location.pathname.replace(/\/+$/, "") : "";

  return (
    <div className="min-h-svh bg-paper">
      {path === "/apresentador" ? (
        <HostView round={round} connected={connected} />
      ) : path === "/controle" ? (
        <ControlView
          round={round}
          connected={connected}
          launchRound={launchRound}
          startPresentation={startPresentation}
          goToSlide={goToSlide}
          stopPresentation={stopPresentation}
        />
      ) : (
        <ParticipantView round={round} connected={connected} tap={tap} />
      )}
    </div>
  );
}
