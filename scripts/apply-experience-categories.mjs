import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../client/src/lib/data.ts", import.meta.url);
let source = readFileSync(path, "utf8");

const mapping = {
  "koenig-der-loewen": "blockbuster-spektakel",
  eiskoenigin: "blockbuster-spektakel",
  moulinrouge: "blockbuster-spektakel",
  "phantom-der-oper": "blockbuster-spektakel",
  "gloeckner-von-notre-dame": "blockbuster-spektakel",
  "starlight-express": "kult-klassiker",
  "tanz-der-vampire": "kult-klassiker",
  dracula: "kult-klassiker",
  "mj-musical": "pop-rock-filmhits",
  ziz: "pop-rock-filmhits",
  "und-julia": "pop-rock-filmhits",
  "we-will-rock-you": "pop-rock-filmhits",
  fackjugoehte: "pop-rock-filmhits",
  tarzan: "familie-maerchen-magie",
  "schoene-und-das-biest": "familie-maerchen-magie",
  dreihaselnuesse: "familie-maerchen-magie",
  rapunzel: "familie-maerchen-magie",
  "teufel-traegt-prada": "besondere-geschichten",
  "wir-sind-am-leben": "besondere-geschichten",
  "salon-rosie": "besondere-geschichten",
};

for (const [id, category] of Object.entries(mapping)) {
  const marker = `    id: "${id}",\n`;
  if (!source.includes(marker)) throw new Error(`Missing musical id: ${id}`);
  if (source.includes(`${marker}    experienceCategory:`)) continue;
  source = source.replace(marker, `${marker}    experienceCategory: "${category}",\n`);
}

writeFileSync(path, source);
console.log(`Assigned ${Object.keys(mapping).length} experience categories.`);
