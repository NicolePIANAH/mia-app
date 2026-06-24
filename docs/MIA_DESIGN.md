# MIA – Design

## Grundsatz

MIA verwendet zu 100% das bestehende PIA-Designsystem. Es gibt keine eigene Designsprache.
Diese Datei dokumentiert ausschließlich MIA-spezifische Ergänzungen und Besonderheiten.

## Farbpalette (PIA Mood Board Brief Juni 2026)

| Anteil | Rolle | Hex | Verwendung |
|---|---|---|---|
| 40% | Hintergrund | #f7f9fb (Perlenweiß) | Flächen, Cards, App-BG |
| 40% | Hintergrund | #deeaf0 (Crème) | Sekundäre Flächen |
| 30% | Hauptakzent | #1a4d5c (Petrol) | Headlines, primäre Buttons |
| 30% | Hauptakzent | #1e3a6e (Royal Blue/Navy) | Gradienten, dunkle Flächen |
| 20% | Wärme | #c4a46b (Champagnergold) | Highlights, Bestätigungen, CTA |
| 20% | Wärme | #e8d5b0 (Sand) | Subtile Wärmeakzente |
| 10% | Frische | #a8cdd9 (Eisblau) | Borders, Tags, Subtexte |

Sekundärtext: #6b8fa3 (Graublau)

Kein Grün. Kein Rot außerhalb von Systemfehlern.

## Typografie

Headlines (Onboarding, Cue, Mikro): Cormorant Garamond 600 oder Playfair Display
Interface-Schrift (Buttons, Subtext, Labels): Inter oder System-Font (San Francisco / Roboto)
Schriftzüge in Gold auf dunklem Grund: Modulname "MIA", Trias "Merken. Integrieren. Automatisieren."

Google Fonts: `Cormorant:wght@400;600;700` und `Inter:wght@400;500;600`

## Komponentenstil

Cards: border-radius 16px, background #f7f9fb, box-shadow 0 2px 12px rgba(26,77,92,0.08)
Buttons primär: background #1a4d5c, color white, border-radius 12px, padding 14px 24px
Buttons sekundär: background transparent, border 1.5px solid #a8cdd9, color #1a4d5c
Input-Felder: border 1.5px solid #a8cdd9, border-radius 10px, focus-border #1a4d5c

## Cue-Screen: spezielle Gestaltung

Der Cue-Screen ist minimalistisch und schnell. Er folgt einer eigenen Logik:
- Vollbild, ein einziger Fokuspunkt
- Hintergrund: Gradient von #f7f9fb zu #deeaf0
- Headline in Cormorant Garamond, groß (28–32px), zentriert, Petrol
- Zwei Buttons nebeneinander, gleich groß, eindeutig unterschiedlich
- Keine Navigation, kein Header

## Mikro-Screen: spezielle Gestaltung

- Hintergrund: dunkles Gradient (#0d1f35 → #1a4d5c) für fokussierte Atmosphäre
- Text weiß, Cormorant für Headline, Inter für Schritte
- Fortschrittsindikator: einfacher Kreis-Timer in Gold (#c4a46b)
- Audio-Icon: spielt automatisch ab, manuell stummschaltbar

## Feedback-Screen: spezielle Gestaltung

- Maximale Schlichtheit: eine Zeile Headline, eine Skala
- Emoji-Skala: 5 Stufen, groß und tippbar
- Bestätigungsanimation: kurzes Aufleuchten in Gold

## Therapeuten-Auswertung

- Hintergrundfarbe Petrol (#1a4d5c) für Header-Bereich → signalisiert "anderer Modus"
- Diagramme: einfache Balken (CSS, kein Chart.js) in PIA-Farben
- Linienverlauf: SVG, Petrol-Linie auf weißem Grund
- PIN-Eingabe: 4 große Felder, numerisch

## Was MIA nicht zeigt

Keine Streaks, keine Punkte, keine Abzeichen, kein Level-Up, kein Konfetti.
Kein roter oder grüner Status in der Markenpalette.
Keine Diagramme mit mehr als zwei Variablen gleichzeitig.
