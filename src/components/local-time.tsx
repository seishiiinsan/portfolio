"use client";

import { useEffect, useState } from "react";

export function LocalTime({ tz = "Europe/Paris" }: { tz?: string }) {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("fr-FR", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const tick = () => setNow(f.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);
  return <span className="tabular-nums">{now}</span>;
}
