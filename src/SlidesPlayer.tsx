import { useEffect, useRef, useState } from "react";
import { renderIcons } from "./slides/icons";

const STAGE_W = 1920;
const STAGE_H = 1080;

export function SlidesPlayer({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(Math.min(width / STAGE_W, height / STAGE_H));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-black">
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
        dangerouslySetInnerHTML={{ __html: renderIcons(html) }}
      />
    </div>
  );
}
