# Security and Privacy

## Überblick

Simple Share ist eine lokale Chrome-Erweiterung ohne Backend, ohne Server und ohne Telemetrie. Sie arbeitet ausschließlich im Browser auf dem lokalen Windows-PC.

## Verwendete Berechtigungen

### `activeTab`

Zweck: Zugriff auf die aktuell aktive Webseite nur dann, wenn die Erweiterung vom Benutzer aktiv genutzt wird.

Warum nötig: Das Popup und die Kontextmenü-Aktionen benötigen Informationen zur aktuellen Seite, zum Link oder zum markierten Text.

### `contextMenus`

Zweck: Anzeige des Rechtsklick-Menüs auf normalen Webseiten.

Warum nötig: Die Erweiterung soll bei Rechtsklick eine einfache, vertraute Auswahl ermöglichen.

## Nicht verwendete Berechtigungen

Die Erweiterung verwendet bewusst keine folgenden Berechtigungen:

- `storage` – nicht nötig, weil keine Daten dauerhaft gespeichert werden
- `tabs` – nicht nötig, weil `activeTab` für die aktive Seite ausreicht
- `history` – nicht nötig
- `cookies` – nicht nötig
- `webRequest` – nicht nötig
- `debugger` – nicht nötig
- `management` – nicht nötig
- `downloads` – nicht nötig
- `declarativeNetRequest` – nicht nötig
- `"<all_urls>"` – nicht nötig

## Host-Berechtigungen

Es werden keine zusätzlichen Host-Berechtigungen für alle Domains oder alle Webseiten benötigt. Die Kontextmenüs sind auf normale HTTP- und HTTPS-Webseiten begrenzt.

## Datenschutz

- Keine E-Mails werden automatisch versendet.
- Keine Konten, Passwörter, Tokens oder Cookies werden gelesen.
- Keine E-Mail-Inhalte, Seiteninhalte oder markierten Text werden gespeichert.
- Es gibt keine Browser-Verlaufs-, Telemetrie- oder Analyseaktivitäten.
- Es gibt keine externen Bibliotheken, Skripte, Fonts oder APIs.
- Es gibt keine Serverkommunikation durch die Erweiterung.

## Ausgabe und Validierung

Alle URLs und Texte werden mit Standard-URL-Kodierung und String-Validierung behandelt. Bei sehr langen Inhalten wird der Nutzer nicht mit einer fehlerhaften E-Mail-URL konfrontiert; stattdessen erscheint eine verständliche Meldung.

## Einschränkungen

- Gmail und Thunderbird werden nur als normale Browser- oder System-Handler geöffnet.
- Der Nutzer muss die fertige E-Mail prüfen und selbst senden.
- Die Erweiterung kann keine E-Mails ohne Zustimmung des Benutzers erstellen.

## Sicherheitshinweis

Die Erweiterung arbeitet lokal und verwendet keine fremden Server, keine Tracking-Tools und keine Analyse-Dienste. Sie darf nur in Chrome lokal als entpackte Erweiterung geladen werden und ist nicht für den Chrome Web Store gedacht.
