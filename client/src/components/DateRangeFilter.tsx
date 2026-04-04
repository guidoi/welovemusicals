/*
 * Design: Theatrical Noir – Art Deco trifft Film Noir
 * DateRangeFilter: Datums-Filter mit Kalender-Picker für Musical-Verfügbarkeit
 */
import { useState } from "react";
import { Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateRangeFilterProps {
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  endDate: string | null;
  setEndDate: (date: string | null) => void;
}

export default function DateRangeFilter({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: DateRangeFilterProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState<"start" | "end">("start");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 3)); // April 2026

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = selected.toISOString().split("T")[0];

    if (calendarMode === "start") {
      setStartDate(dateStr);
      setCalendarMode("end");
    } else {
      setEndDate(dateStr);
      setShowCalendar(false);
    }
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setShowCalendar(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const monthName = currentMonth.toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });

  const days = [];
  const totalDays = daysInMonth(currentMonth);
  const firstDay = firstDayOfMonth(currentMonth);

  // Leere Tage am Anfang
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Tage des Monats
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  return (
    <div className="relative">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        {/* Start Date Input */}
        <div className="flex-1">
          <label className="text-xs text-gold uppercase tracking-[0.1em] font-medium block mb-2">
            Verfügbar ab
          </label>
          <button
            onClick={() => {
              setShowCalendar(!showCalendar);
              setCalendarMode("start");
            }}
            className="w-full px-3 py-2 bg-card border border-gold/10 rounded-sm text-foreground text-sm hover:border-gold/40 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-gold/50" />
            <span>{startDate ? formatDate(startDate) : "Startdatum"}</span>
          </button>
        </div>

        {/* End Date Input */}
        <div className="flex-1">
          <label className="text-xs text-gold uppercase tracking-[0.1em] font-medium block mb-2">
            Verfügbar bis
          </label>
          <button
            onClick={() => {
              setShowCalendar(!showCalendar);
              setCalendarMode("end");
            }}
            className="w-full px-3 py-2 bg-card border border-gold/10 rounded-sm text-foreground text-sm hover:border-gold/40 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-gold/50" />
            <span>{endDate ? formatDate(endDate) : "Enddatum"}</span>
          </button>
        </div>

        {/* Reset Button */}
        {(startDate || endDate) && (
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-card border border-gold/20 rounded-sm text-muted-foreground hover:text-gold hover:border-gold/40 transition-colors flex items-center gap-1"
            title="Filter zurücksetzen"
          >
            <X className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Zurücksetzen</span>
          </button>
        )}
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 bg-card border border-gold/20 rounded-sm p-4 z-50 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
              }
              className="text-gold/50 hover:text-gold transition-colors"
            >
              ←
            </button>
            <span className="text-sm font-semibold text-foreground capitalize">{monthName}</span>
            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
              }
              className="text-gold/50 hover:text-gold transition-colors"
            >
              →
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
              <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="w-8 h-8" />;
              }

              const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                .toISOString()
                .split("T")[0];
              const isSelected = dateStr === startDate || dateStr === endDate;
              const isInRange =
                startDate && endDate && dateStr > startDate && dateStr < endDate;

              return (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className={`w-8 h-8 flex items-center justify-center text-xs rounded-sm transition-colors ${
                    isSelected
                      ? "bg-gold text-background font-semibold"
                      : isInRange
                      ? "bg-gold/20 text-foreground"
                      : "text-foreground hover:bg-gold/10"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gold/10 text-xs text-muted-foreground">
            {calendarMode === "start" ? "Startdatum auswählen" : "Enddatum auswählen"}
          </div>
        </div>
      )}
    </div>
  );
}
