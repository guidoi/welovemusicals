# React Hook – Fehlerbehebung

Am 28.08.2026 trat in der lokalen Vite-Vorschau beim Rendern von `TRPCProvider` ein nicht reproduzierbarer „Invalid hook call“ auf. Die Versionsprüfung ergab jeweils React 19.2.1 und React DOM 19.2.1 sowie eine einzelne installierte React-Paketinstanz. Die Provider-Reihenfolge in `client/src/main.tsx` war bereits korrekt: `QueryClientProvider` umschließt `trpc.Provider`.

Die Vite-Konfiguration dedupliziert nun zusätzlich `@tanstack/react-query` und optimiert React, `react-dom/client`, React Query sowie tRPC React Query gemeinsam vor. Diese Konfiguration verhindert, dass unterschiedliche optimierte Abhängigkeitsinstanzen die React-Dispatcher-Verbindung zwischen tRPC und React DOM beeinträchtigen.

Die gemeinsame Provider-Hülle wurde aus `main.tsx` in `AppProviders.tsx` extrahiert. Dadurch ist die erforderliche Verschachtelung dauerhaft an einer Stelle definiert und per Rendering-Test abgesichert: React Query bildet die äußere Kontextgrenze, tRPC wird innerhalb dieses Kontextes gerendert. Der Test schlägt fehl, falls diese Provider-Kombination erneut einen Invalid-Hook-Call auslöst.

Für einen reproduzierbaren Gegencheck wurde der Vite-Optimierungscache vollständig gelöscht und die Entwicklungsumgebung neu gestartet. Die Startseite unter `/?from_webdev=1&coldstart=1` renderte anschließend vollständig. Danach wurde eine HMR-Aktualisierung von `App.tsx` ausgelöst; auch danach blieb die Anwendung vollständig gerendert. Die Browser-Konsole enthielt in beiden Fällen keinen React- oder tRPC-Fehler.

Die Korrektur wurde mit 16 erfolgreichen Vitest-Tests, einem fehlerfreien TypeScript-Check und einem erfolgreichen Produktionsbuild geprüft. Die ursprüngliche Laufzeitinkonsistenz ließ sich nach der Bereinigung nicht erneut erzeugen. Da der ursprüngliche Zustand nach dem Neustart nicht mehr vorlag, ist die genaue Entstehungsursache retrospektiv nicht isolierbar; die nun getestete Provider-Hülle und die explizite Vite-Deduplizierung schließen jedoch die relevanten Integrationsrisiken ab.
