# MIA – Architektur

## Überblick

MIA ist eine Progressive Web App. Sie läuft im mobilen Browser, kann auf dem Homescreen installiert werden, und funktioniert offline. Kein App Store, kein Backend, kein User-Account erforderlich.

## Technische Basis

Die Architektur folgt dem bestehenden PIA-Produktsystem:

| Komponente | Quelle | Begründung |
|---|---|---|
| React 18 | NIA (pia-membership) | Komplexes State Management, wiederverwendbare Komponenten |
| Babel-Kompilierung | NIA (pia-membership) | Kein Vite/Bundler nötig, direktes Browser-Deploy |
| Service Worker | TIA (tia-zeiterfassung) | Bewährtes Offline-Pattern, Cache-Strategie |
| manifest.json | TIA (tia-zeiterfassung) | PWA-Installation auf Homescreen |
| LocalStorage | NIA + TIA | Alle Nutzerdaten lokal, kein Backend |
| Docker-Container | TIA-Konvention | Eigener Container auf IONOS VPS |

## Dateistruktur

```
MIA/
├── app/
│   ├── mia-app.jsx              # Haupt-React-Komponente (Quellcode)
│   ├── mia-app.compiled.js      # Babel-Output (deployed)
│   ├── babel.config.json        # Wie NIA: preset-env + preset-react classic
│   └── package.json
├── assets/
│   ├── style.css                # PIA-Designsystem, MIA-spezifische Ergänzungen
│   └── audio/                   # Mikrointerventions-Audio (MP3)
│       ├── zunge-ruhelage.mp3
│       ├── schlucken.mp3
│       └── atmung.mp3
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── docs/
│   ├── MIA_README.md
│   ├── MIA_WISSENSCHAFT.md
│   ├── MIA_ARCHITECTURE.md
│   ├── MIA_DESIGN.md
│   ├── MIA_CONTENT.md
│   └── MIA_CHANGELOG.md
├── index.html                   # Entry Point, lädt React + compiled JS
├── manifest.json                # PWA-Manifest
├── sw.js                        # Service Worker (Offline-Support)
└── .gitignore
```

## Komponentenstruktur (React)

```
App
├── OnboardingFlow
│   ├── Step1_FokusWahl          # Zungenruhelage / Schlucken / Atmung
│   ├── Step2_AnkerWahl          # 8-10 Alltagsanker zur Auswahl
│   ├── Step3_ErsteMikro         # Direkte erste Intervention
│   └── Step4_HomeInstall        # PWA-Installationsanleitung
├── CueScreen                    # M: Merken – eine Frage, zwei Antworten
├── MikroScreen                  # I: Integrieren – 10-30 Sek Intervention + Audio
├── FeedbackScreen               # A: Automatisieren – Körperwahrnehmung
├── HomeScreen                   # Tagesübersicht, Ankerliste
├── ProgressScreen               # Verlaufsansicht
├── AuswertungScreen             # Therapeuten-Bereich (PIN-geschützt)
│   ├── AuswertungLogin
│   ├── AuswertungDashboard
│   └── AuswertungExport
└── SettingsScreen               # Anker ändern, Fokus ändern, PIN ändern
```

## State und Datenspeicherung

Alle Daten werden im LocalStorage gespeichert. Schlüssel-Konvention:

```
mia_user          – Onboarding-Profil { fokus, anker[], pin, erstelltAm }
mia_eintraege     – Array aller Einträge [{ datum, anker, cueAntwort, mikro, wahrnehmung }]
mia_settings      – App-Einstellungen
```

Kein Account. Kein Backend. Kein Sync.

## Audio-Konzept

Drei Audio-Dateien (MP3), lokal gecacht via Service Worker:
- `zunge-ruhelage.mp3` (ca. 20 Sekunden, gesprochene Anleitung)
- `schlucken.mp3` (ca. 25 Sekunden, gesprochene Anleitung)
- `atmung.mp3` (ca. 20 Sekunden, Atemführung)

Web Audio API für Wiedergabe. Kein externes CDN. Offline-fähig.

## Service Worker (Strategie)

Cache-first für statische Assets (JS, CSS, Audio, Icons).
Network-first mit Cache-Fallback für index.html.
Basiert auf TIA sw.js, angepasst für MIA-Asset-Pfade.

## PWA-Spezifikation

```json
{
  "name": "MIA",
  "short_name": "MIA",
  "description": "Merken. Integrieren. Automatisieren.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f7f9fb",
  "theme_color": "#1a4d5c"
}
```

## Deployment

```
Docker-Container: mia-app
Nginx-Reverse-Proxy: mia.logo-pia.de → mia-app:80
Server: root@82.165.231.67 (IONOS VPS)
Deploy-Befehl:
  scp index.html mia-app.compiled.js style.css sw.js manifest.json root@82.165.231.67:/tmp/
  ssh root@82.165.231.67 "docker cp /tmp/. mia-app:/usr/share/nginx/html/"
```

## Abgrenzung zu NIA und TIA

| | NIA | TIA | MIA |
|---|---|---|---|
| Laufzeitumgebung | WordPress (eingebettet) | PHP + Apache | Standalone (nginx) |
| Daten | LocalStorage | MySQL | LocalStorage |
| Offline | Nein | Teilweise | Ja (vollständig) |
| Audio | Nein | Nein | Ja |
| Backend | WordPress | PHP/MySQL | Keins |
| PWA-Install | Nein | Ja | Ja |
