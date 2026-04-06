/**
 * MusicalQuotes-Komponente
 * Zeigt Pressequotes in einer eleganten Drei-Spalten-Anordnung
 */

import { MusicalQuote } from "@/lib/data";
import { Quote } from "lucide-react";

interface MusicalQuotesProps {
  quotes: MusicalQuote[];
}

export default function MusicalQuotes({ quotes }: MusicalQuotesProps) {
  if (!quotes || quotes.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container max-w-6xl">
        <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
          Pressestimmen
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {quotes.slice(0, 3).map((quote, idx) => (
            <div
              key={idx}
              className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <Quote className="w-8 h-8 flex-shrink-0 mt-1 text-gold" />
                <div className="flex-1">
                  <p className="text-card-foreground italic mb-4 leading-relaxed">
                    "{quote.text}"
                  </p>
                  <p className="text-sm font-semibold text-gold">
                    — {quote.source}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
