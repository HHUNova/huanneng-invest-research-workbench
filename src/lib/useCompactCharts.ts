import { useEffect, useState } from "react";

const compactChartQuery = "(max-width: 640px)";

export function useCompactCharts() {
  const [compact, setCompact] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(compactChartQuery).matches,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia(compactChartQuery);
    const update = () => setCompact(media.matches);

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return compact;
}
