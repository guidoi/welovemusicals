import { cities, getActiveMusicals } from "../client/src/lib/data";

const modernImage = (url: string) => /\.(?:webp|avif)(?:\?|$)/i.test(url) || /images\.unsplash\.com/.test(url) && /(?:[?&]fm=webp|[?&]auto=format)/i.test(url);
const violations: string[] = [];

for (const musical of getActiveMusicals()) {
  for (const [field, url] of Object.entries({ image: musical.image, heroImage: musical.heroImage, keyvisual: musical.keyvisual })) {
    if (url && !modernImage(url)) violations.push(`${musical.id}.${field}: ${url}`);
  }
  for (const [index, galleryImage] of (musical.gallery ?? []).entries()) {
    if (!modernImage(galleryImage.url)) violations.push(`${musical.id}.gallery.${index}: ${galleryImage.url}`);
  }
}

for (const city of cities) {
  if (!modernImage(city.image)) violations.push(`city.${city.slug}.image: ${city.image}`);
}

if (violations.length > 0) {
  console.error("Editoriale Bilddaten müssen WebP/AVIF sein (Unsplash: fm=webp oder auto=format):\n" + violations.join("\n"));
  process.exit(1);
}

console.log(`Bildstandard bestanden: ${getActiveMusicals().length} aktive Musicals und ${cities.length} Städte referenzieren moderne Formate.`);
