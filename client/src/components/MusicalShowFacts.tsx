/**
 * MusicalShowFacts-Komponente
 * Zeigt drei Wissenswertes-Elemente: Showdauer, Sprache, Auf Tour
 */

import { MusicalShowFact } from "@/lib/data";
import { Clock, Globe, Calendar } from "lucide-react";

interface MusicalShowFactsProps {
  facts: MusicalShowFact[];
}

const iconMap: Record<string, React.ReactNode> = {
  "Showdauer": <Clock className="w-8 h-8" />,
  "Sprache": <Globe className="w-8 h-8" />,
  "Auf Tour": <Calendar className="w-8 h-8" />,
};

export default function MusicalShowFacts({ facts }: MusicalShowFactsProps) {
  if (!facts || facts.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container max-w-6xl">
        <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
          Wissenswertes zur Show
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {facts.slice(0, 3).map((fact, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4 text-primary">
                {iconMap[fact.label] || <Calendar className="w-8 h-8" />}
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {fact.label}
              </h3>
              <p className="text-card-foreground/80 text-sm leading-relaxed">
                {fact.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
