# Bildstandard für We Love Musicals

## Geltungsbereich

Dieser Standard gilt für neue **redaktionelle** Bilder: Musicalkarten, Header-/Hero-Bilder, Keyvisuals, Galerien, Stadtbilder und Trailer-Standbilder. Originaldateien bleiben stets außerhalb des Repositories unter `/home/ubuntu/webdev-static-assets/` erhalten.

> Native Affiliate-Creatives sind ausgenommen. Sie bleiben in dem exakt vom Partner gelieferten Format und mit ihren vorgegebenen Abmessungen, damit Kampagnenmotiv, Markenfreigabe und Bannerplatzierung unverändert bleiben.

## Standardprozess für neue Bilder

1. Original außerhalb des Projekts speichern, z. B. unter `/home/ubuntu/webdev-static-assets/<show>-YYYY-MM/`.
2. Ohne Beschnitt in WebP umwandeln:

   ```bash
   cd /home/ubuntu/musical-tickets
   python3 scripts/prepare-web-image.py /absoluter/pfad/original.jpg \
     --role gallery \
     --output /home/ubuntu/webdev-static-assets/<show>-YYYY-MM/<dateiname>.webp
   ```

   Rollen: `card` (bis 1200 px), `city` (1200 × 1500 px), `hero` (1920 × 1280 px), `keyvisual` (1400 px quadratisch) und `gallery` (1920 × 1440 px). Die Pipeline erhält das Seitenverhältnis, dreht EXIF-konform und überschreibt niemals das Original.
3. WebP-Datei über `manus-upload-file` ins CDN laden und nur die daraus resultierende öffentliche URL in `client/src/lib/data.ts` hinterlegen.
4. Den verpflichtenden Standardtest ausführen:

   ```bash
   pnpm run test:image-standard
   ```

5. Vor Auslieferung: `pnpm test && pnpm exec tsc --noEmit && pnpm build && git diff --check`.

## Technische Leitlinie

- Neue redaktionelle Bilder nur als **WebP** (AVIF ist zulässig, falls bereits vom Rechteinhaber geliefert).
- Keine großen Bilder in `client/public/` oder `client/src/assets/` ablegen.
- Für Unsplash-Quellen ist `fm=webp` oder `auto=format` erforderlich.
- Der Produktionsbuild führt den Bildstandardtest automatisch aus und blockiert veraltete JPG-/PNG-Referenzen in den aktiven Musical- und Stadtbilddaten.
