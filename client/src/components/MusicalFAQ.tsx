/**
 * MusicalFAQ-Komponente
 * Zeigt FAQ-Fragen in einem aufklappbaren Akkordeon
 */

import { MusicalFAQ } from "@/lib/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MusicalFAQProps {
  items: MusicalFAQ[];
}

export default function MusicalFAQSection({ items }: MusicalFAQProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container max-w-4xl">
        <h2 className="text-3xl font-bold mb-12 text-foreground">
          Häufig gestellte Fragen
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {items.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
