# Private Google-Sheets-Synchronisation

## Festgehaltene Grundlagen

Die Google Sheets API kann Tabellenwerte lesen und schreiben; Tabellen- und Tab-IDs sind stabile technische Referenzen. Die Website kann daher gezielt nur den vorgesehenen Exportbereich einer Tabelle verwenden. Quelle: [Google Sheets API Overview](https://developers.google.com/workspace/sheets/api/guides/concepts).

Für einen privaten Serverzugriff kann ein dediziertes Google-Servicekonto angelegt werden. Dessen E-Mail-Adresse erhält ausschließlich Leserechte für die betreffende Tabelle. Google weist darauf hin, dass Schlüsseldateien sicher verwahrt werden müssen und für Zugriffe außerhalb von Google Cloud alternative Verfahren wie Workload Identity Federation geprüft werden sollen. Quellen: [Create service accounts](https://cloud.google.com/iam/docs/service-accounts-create) und [Create and delete service account keys](https://cloud.google.com/iam/docs/keys-create-delete).

Google Apps Script kann Abläufe über Google-Produkte automatisieren. Diese Variante benötigt jedoch eine eigene Script- und Bereitstellungskonfiguration. Quelle: [Apps Script](https://developers.google.com/apps-script).

## Konsequenz für We Love Musicals

Die bevorzugte Lösung ist ein nur lesendes Servicekonto mit ausschließlichem Zugriff auf die bestehende Preistabelle. Das Servicekonto und seine Zugangsdaten werden ausschließlich serverseitig genutzt. Die öffentliche Website erhält weder Tabellenlink noch Schlüssel und kann bei einem temporären Google-Fehler auf die zuletzt gültigen Werte zurückfallen.
