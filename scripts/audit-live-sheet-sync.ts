import { parseGoogleSheetPriceCsv } from "../server/googleSheetPriceSource";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRC2Ymp15Lrw6yzWFVFvhYR0cRa3rTYfGcAJ4PnYth3TFZ3E4A6ajuecKXvr_T7Nmn7WIiQFzlXmH8s/pub?gid=1001113831&single=true&output=csv";
const LIVE_URL = "https://welovemusicals.com/api/trpc/priceSales.listPublic?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%7D%7D";

type PublicRecord = {
  musicalId: string;
  priceFrom: string;
  ticketLink: string | null;
  saleEnabled: boolean;
  saleLabel: string | null;
  saleDiscount: string | null;
  saleNote: string | null;
  saleStartsAt: string | null;
  saleEndsAt: string | null;
};

function hasSameWebsiteValues(sheet: PublicRecord, live: PublicRecord | undefined): boolean {
  if (!live) return false;

  return (
    sheet.musicalId === live.musicalId &&
    sheet.priceFrom === live.priceFrom &&
    sheet.ticketLink === (live.ticketLink ?? null) &&
    sheet.saleEnabled === live.saleEnabled &&
    sheet.saleLabel === live.saleLabel &&
    sheet.saleDiscount === live.saleDiscount &&
    sheet.saleNote === live.saleNote &&
    sheet.saleStartsAt === live.saleStartsAt &&
    sheet.saleEndsAt === live.saleEndsAt
  );
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache" },
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.text();
}

async function main() {
  const [csv, liveJson] = await Promise.all([fetchText(`${SHEET_URL}&audit=${Date.now()}`), fetchText(`${LIVE_URL}&audit=${Date.now()}`)]);
  const sheetRows = parseGoogleSheetPriceCsv(csv);
  const livePayload = JSON.parse(liveJson) as Array<{ result?: { data?: { json?: PublicRecord[] } } }>;
  const liveRows = livePayload[0]?.result?.data?.json ?? [];
  const liveById = new Map(liveRows.map((row) => [row.musicalId, row]));

  const compared = sheetRows.map((sheetRow) => {
    const live = liveById.get(sheetRow.musicalId);
    const same = hasSameWebsiteValues(sheetRow, live);
    return { musicalId: sheetRow.musicalId, same, sheet: sheetRow, live: live ?? null };
  });

  const missingFromLive = sheetRows.filter((row) => !liveById.has(row.musicalId)).map((row) => row.musicalId);
  const mismatches = compared.filter((row) => !row.same);

  console.log(JSON.stringify({
    checkedAt: new Date().toISOString(),
    sheetRowCount: sheetRows.length,
    liveRowCount: liveRows.length,
    matches: compared.filter((row) => row.same).length,
    missingFromLive,
    mismatches,
    focus: compared.filter((row) => ["mj-musical", "fackjugoehte", "wir-sind-am-leben"].includes(row.musicalId)),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
