import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";

type Slot = { id: string; starts_at: string; duration_minutes: number; spots_left: number };

const TZ = "Europe/Paris";
const dayKey = (d: Date) => d.toLocaleDateString("fr-CA", { timeZone: TZ }); // YYYY-MM-DD
const DAYS = ["LU", "MA", "ME", "JE", "VE", "SA", "DI"];

export function BookingCalendar({
  slots,
  selectedId,
  onSelect,
}: {
  slots: Slot[];
  selectedId: string | null | undefined;
  onSelect: (s: Slot | null) => void;
}) {
  const byDay = useMemo(() => {
    const m = new Map<string, Slot[]>();
    for (const s of slots) {
      if (s.spots_left <= 0) continue;
      const k = dayKey(new Date(s.starts_at));
      m.set(k, [...(m.get(k) ?? []), s]);
    }
    return m;
  }, [slots]);

  const selectedSlot = slots.find((s) => s.id === selectedId);
  const firstDay = selectedSlot ? dayKey(new Date(selectedSlot.starts_at)) : [...byDay.keys()].sort()[0];
  const [day, setDay] = useState<string | undefined>(firstDay);
  const init = firstDay ? new Date(firstDay + "T12:00:00") : new Date();
  const [month, setMonth] = useState(new Date(init.getFullYear(), init.getMonth(), 1));
  const [h24, setH24] = useState(true);

  const cells = useMemo(() => {
    const start = new Date(month);
    const offset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [month]);

  const today = new Date();
  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1);
  const daySlots = (day && byDay.get(day)) || [];
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString(h24 ? "fr-FR" : "en-US", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: !h24 });
  const monthLabel = month.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <div className="grid overflow-hidden rounded-2xl border border-sage-100 bg-background md:grid-cols-2">
      <div className="bg-sage-50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <button type="button" disabled={!canPrev} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-600 text-primary-foreground disabled:opacity-30" aria-label="Mois précédent">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-medium capitalize">{monthLabel}</span>
          <button type="button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-600 text-primary-foreground" aria-label="Mois suivant">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {DAYS.map((d) => <div key={d} className="py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {cells.map((d) => {
            const k = dayKey(d);
            const avail = byDay.has(k);
            const sel = k === day;
            const other = d.getMonth() !== month.getMonth();
            return (
              <button key={k} type="button" disabled={!avail} onClick={() => setDay(k)}
                className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  sel ? "bg-sage-600 text-primary-foreground" : avail ? "font-semibold hover:bg-sage-100" : "text-muted-foreground/60 line-through"
                } ${other && !sel ? "opacity-50" : ""}`}>
                {d.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5">
        <p className="mb-3 font-medium">Quel moment vous convient le mieux ?</p>
        <div className="mb-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-sage-700"><Globe className="h-4 w-4" /> Paris</span>
          <div className="flex rounded-full bg-sage-50 p-1 text-xs">
            {[false, true].map((v) => (
              <button key={String(v)} type="button" onClick={() => setH24(v)}
                className={`rounded-full px-3 py-1 ${h24 === v ? "bg-sage-600 text-primary-foreground" : ""}`}>
                {v ? "24h" : "AM/PM"}
              </button>
            ))}
          </div>
        </div>
        {daySlots.length === 0 ? (
          <p className="text-sm text-muted-foreground">Choisissez un jour disponible.</p>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {daySlots.map((s) => {
              const sel = s.id === selectedId;
              return (
                <button key={s.id} type="button" onClick={() => onSelect(sel ? null : s)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${
                    sel ? "border-sage-600 bg-sage-600 text-primary-foreground" : "border-sage-100 hover:border-sage-600"
                  }`}>
                  <span className="font-medium">{fmt(s.starts_at)}</span>
                  <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${sel ? "border-primary-foreground/40" : "border-sage-100"}`}>
                    {s.spots_left} place restante
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
