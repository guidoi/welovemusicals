# Cloudflare Pages Deployment Fix

## Problem
Cloudflare Pages konnte die Vite-Konfiguration nicht modifizieren, weil der `vitePluginManusRuntime` Plugin nicht mit Cloudflare kompatibel ist.

## Lösung
Ich habe die Konfiguration angepasst:

1. **vite.config.ts**: Der `vitePluginManusRuntime` wird jetzt nur in der Entwicklung geladen, nicht in Production
2. **wrangler.toml**: Neue Konfiguration für Cloudflare Pages hinzugefügt

## Nächste Schritte bei Cloudflare Pages

### Option 1: Über Cloudflare Pages UI (Empfohlen)
1. Gehe zu https://pages.cloudflare.com
2. Klicke auf "Create a project"
3. Verbinde dein GitHub-Repository
4. Konfiguriere die Build-Einstellungen:
   - **Framework**: Vite
   - **Build command**: `pnpm run build`
   - **Build output directory**: `dist/public`
   - **Node.js version**: 22 oder höher
5. Klicke auf "Save and Deploy"

### Option 2: Über Wrangler CLI
```bash
# Im Projekt-Verzeichnis
pnpm install -D wrangler

# Authentifizierung
npx wrangler login

# Deployment
npx wrangler pages deploy dist/public
```

## Wichtig: Umgebungsvariablen
Cloudflare Pages benötigt diese Umgebungsvariablen (in Cloudflare Pages Settings):
- `VITE_ANALYTICS_ENDPOINT` (optional)
- `VITE_ANALYTICS_WEBSITE_ID` (optional)
- `VITE_APP_ID` (optional)
- `VITE_APP_LOGO` (optional)
- `VITE_APP_TITLE` (optional)

## Troubleshooting
Falls der Build immer noch fehlschlägt:
1. Stelle sicher, dass Node.js 22+ verwendet wird
2. Lösche `node_modules` und `pnpm-lock.yaml`, führe `pnpm install` aus
3. Teste lokal: `pnpm run build`
4. Überprüfe, dass alle Abhängigkeiten korrekt installiert sind

## Weitere Optimierungen
- Die Website ist jetzt für Cloudflare Pages optimiert
- Statische Assets werden von Cloudflare CDN serviert
- Automatische Deployments bei GitHub Pushes (wenn über Pages UI verbunden)
