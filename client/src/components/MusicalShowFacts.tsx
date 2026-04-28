/**
 * MusicalShowFacts-Komponente
 * Zeigt Fakten-Karten und FAQ unter einer gemeinsamen Headline
 */

import { MusicalShowFact, MusicalFAQ } from "@/lib/data";
import { Clock, Globe, Calendar, Mic2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MusicalShowFactsProps {
  facts: MusicalShowFact[];
  provider?: string;
  faqItems?: MusicalFAQ[];
}

const iconMap: Record<string, React.ReactNode> = {
  "Showdauer": <Clock className="w-8 h-8" />,
  "Sprache": <Globe className="w-8 h-8" />,
  "Auf Tour": <Calendar className="w-8 h-8" />,
  "Veranstalter": <Mic2 className="w-8 h-8" />,
};

export default function MusicalShowFacts({ facts, provider, faqItems }: MusicalShowFactsProps) {
  const hasFacts = facts && facts.length > 0;
  const hasFaq = faqItems && faqItems.length > 0;

  if (!hasFacts && !hasFaq) return null;

  // Füge Veranstalter hinzu wenn provider vorhanden
  const allFacts = provider ? [...facts, { label: "Veranstalter", value: provider }] : facts;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container max-w-6xl">
        <h2 className="text-3xl font-bold mb-12 text-center text-foreground">
          Alles, was du wissen musst
        </h2>

        {/* Fakten-Karten */}
        {hasFacts && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {allFacts.map((fact, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center mb-4" style={{color: '#b8944a'}}>
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
        )}

        {/* FAQ */}
        {hasFaq && (
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-lg font-semibold text-foreground transition-colors" onMouseEnter={(e) => (e.currentTarget.style.color='#b8944a')} onMouseLeave={(e) => (e.currentTarget.style.color='')}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/80 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </section>
  );
}
