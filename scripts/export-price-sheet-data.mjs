import { musicals } from "../client/src/lib/data.ts";

const headers = [
  "musical_id",
  "Musical",
  "Preis ab",
  "Sale aktiv",
  "Sale-Text",
  "Sale-Hinweis",
  "Gültig ab",
  "Gültig bis",
  "Ticketlink",
  "Zuletzt geprüft",
  "Notiz",
];

const today = new Date().toISOString().slice(0, 10);
const rows = musicals.map((musical) => [
  musical.id,
  musical.title,
  musical.priceFrom ?? "",
  musical.sale ? "Ja" : "Nein",
  musical.sale?.discount ?? "",
  musical.sale?.note ?? "",
  musical.sale?.validFrom ?? "",
  musical.sale?.validUntil ?? "",
  musical.ticketCtaUrl ?? musical.eventimUrl,
  today,
  "",
]);

process.stdout.write(JSON.stringify({ values: [headers, ...rows] }));
