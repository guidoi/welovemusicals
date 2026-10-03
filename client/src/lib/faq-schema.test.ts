import { describe, expect, it } from "vitest";
import { getMusicalBySlug } from "./data";
import { getMusicalFaqSchema } from "./faq-schema";

describe("maschinenlesbare FAQ-Daten", () => {
  it("spiegelt die sichtbaren Fragen und Antworten einer Musicalseite exakt", () => {
    const mj = getMusicalBySlug("mj-das-michael-jackson-musical");
    expect(mj).toBeDefined();

    const schema = getMusicalFaqSchema(mj!);
    expect(schema).toMatchObject({
      "@type": "FAQPage",
      "@id": "https://welovemusicals.com/musical/mj-das-michael-jackson-musical#faq",
      mainEntity: mj!.faqItems!.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  });

  it("erzeugt ohne sichtbare Fragen kein FAQ-Schema", () => {
    const schema = getMusicalFaqSchema({
      id: "ohne-faq",
      slug: "ohne-faq",
      title: "OHNE FAQ",
      provider: "Testveranstalter",
      category: "tournee",
      description: "Testbeschreibung",
      image: "/test.jpg",
      eventimUrl: "https://example.com/tickets",
      tags: [],
    });

    expect(schema).toBeUndefined();
  });
});
