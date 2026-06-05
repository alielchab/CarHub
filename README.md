# Projektdokumentation - CarHub Autoverwaltungstool Prototyp

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2. [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen [Optional]](#4-erweiterungen-optional)
5. [Projektorganisation [Optional]](#5-projektorganisation-optional)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang [Optional]](#7-anhang-optional)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

<!-- WICHTIG: DIE KAPITELSTRUKTUR DARF NICHT VERÄNDERT WERDEN! -->

<!-- Diese README.md dokumentiert den Prototyp CarHub im Rahmen des Prototyping-Projekts. -->

## 1. Ausgangslage

CarHub ist ein Prototyp für ein webbasiertes Autoverwaltungstool. Die Anwendung orientiert sich funktional an Fahrzeugplattformen wie AutoScout24, ist jedoch bewusst auf einen kleineren, überschaubaren Anwendungsfall reduziert: Ein Administrator kann Fahrzeuge erfassen, verwalten, bearbeiten und öffentlich präsentieren. Besucher:innen können Fahrzeuge durchsuchen, filtern, sortieren und Detailinformationen inklusive Bildergalerie ansehen.

- **Problem:** Fahrzeugdaten bestehen aus vielen einzelnen Angaben wie Marke, Modell, Preis, Kilometerstand, Zustand, Treibstoff, Getriebe, Bilder und technischen Daten. Ohne strukturierte Verwaltung wird es schnell unübersichtlich, Fahrzeuge sauber zu erfassen und öffentlich darzustellen. Zusätzlich funktionieren lokale Datei-Uploads im Deployment auf Netlify nicht dauerhaft zuverlässig, da der `static`-Ordner zur Laufzeit nicht als persistenter Speicher genutzt werden kann.
- **Ziele:**                                                  
  - Fahrzeuge zentral erfassen, bearbeiten und verwalten.
  - Fahrzeugbilder stabil über Cloudinary hochladen und anzeigen.
  - Fahrzeugdaten in MongoDB speichern.
  - Öffentliche Fahrzeuglisten mit dynamischen Filtern und Sortierung anbieten.
  - Top-Listing-Fahrzeuge separat darstellen.
  - Detailseiten mit Bildergalerie und View Counter umsetzen.
  - Den Prototyp auf Netlify deployen.
- **Primäre Zielgruppe:** Administrator:innen eines kleinen Fahrzeugbestands, die Fahrzeuge digital verwalten und öffentlich präsentieren möchten.
- **Weitere Stakeholder [Optional]:**
  - Besucher:innen der öffentlichen Fahrzeugseite.
  - Projektbetreuung und Dozierende im Rahmen des Prototyping-Moduls.
  - Potenzielle Fahrzeuginteressierte, die Fahrzeuge nach Merkmalen filtern möchten.

## 2. Lösungsidee

CarHub bietet eine Admin-Oberfläche zur Fahrzeugverwaltung und eine öffentliche Ansicht für Fahrzeuginteressierte. Die Anwendung trennt klar zwischen interner Verwaltung und öffentlicher Präsentation.

- **Kernfunktionalität:**
  - Admin-Login: Nur der Administrator-Login ist vorhanden und berechtigt, sich anzumelden.
  - Fahrzeuge erstellen: Fahrzeugdaten, technische Daten, Preis, Zustand, Garantie, Beschreibung und Bilder erfassen.
  - Fahrzeuge bearbeiten: Bestehende Fahrzeuge aktualisieren, Bilder hinzufügen, entfernen und sortieren.
  - Fahrzeugstatus verwalten: aktiv, inaktiv, Entwurf, verkauft oder entfernt.
  - Top-Listing: Fahrzeuge können hervorgehoben und auf einer separaten Top-Listing-Seite angezeigt werden.
  - Öffentliche Fahrzeugliste: Aktive Fahrzeuge werden als Karten dargestellt.
  - Dynamische Filter: Filter funktionieren einzeln und kombiniert. Die Filteroptionen passen sich an die aktuell passende Ergebnismenge an.
  - Modell-Filter: Das Modell ist erst auswählbar, wenn eine Marke gewählt wurde.
  - Sortierung: Neueste/älteste Inserate, Marke A-Z/Z-A, Preis niedrig/hoch, Jahrgang alt/neu.
  - Detailansicht: Fahrzeugdaten, Preis, Bildergalerie, Vollbildansicht und View Counter.
  - Bildspeicherung: Upload direkt zu Cloudinary, Speicherung der Bild-URLs in MongoDB.
- **Annahmen [Optional]:**
  - Admins möchten möglichst schnell Fahrzeuge erfassen und aktualisieren.
  - Besucher:innen möchten Fahrzeuge vor allem über Marke, Modell, Getriebe, Treibstoff, Aufbau und Preis vergleichen.
  - Fahrzeugbilder sind zentral für die Qualität der Fahrzeugpräsentation.
  - Ein externer Bildspeicher ist für Netlify-Deployment stabiler als lokale Dateiablage.
- **Abgrenzung [Optional]:**
  - Keine Zahlungsabwicklung.
  - Kein Käufer-/Verkäufer-Accountsystem.
  - Kein Chat zwischen Käufer und Verkäufer.
  - Keine automatische Fahrzeugbewertung.
  - Keine rechtliche Kaufvertragsabwicklung.
  - Keine vollständige Produktionsplattform, sondern ein funktionsfähiger Prototyp.

## 3. Vorgehen & Artefakte

Die Umsetzung erfolgte iterativ. Einzelne Funktionen wurden nacheinander entwickelt, lokal getestet, korrigiert und anschliessend auf Netlify überprüft.

### 3.1 Understand & Define

- **Zielgruppenverständnis:** Die Anwendung richtet sich an eine Person oder Organisation, die Fahrzeuge verwalten und online präsentieren möchte. Im Vordergrund stehen einfache Administration und eine verständliche Fahrzeuganzeige.
- **Wesentliche Erkenntnisse:**
  - Ein Fahrzeugformular benötigt klare Abschnitte, damit die vielen Datenfelder nicht unübersichtlich werden.
  - Bilder müssen vor dem Speichern sichtbar sein, damit der Admin die Reihenfolge kontrollieren kann.
  - Normale HTML-Selects mit sehr vielen Automarken sind unhandlich. Deshalb wurde für Marke und Modell ein suchbares Dropdown umgesetzt.
  - Filter müssen unabhängig funktionieren: Zum Beispiel soll “Getriebe = Schaltung” alle geschalteten Fahrzeuge anzeigen, unabhängig von der Marke.
  - Gleichzeitig sollen sich die anderen Filteroptionen dynamisch an die aktuelle Auswahl anpassen.
  - Netlify eignet sich gut für Hosting und SvelteKit Server Actions, aber nicht als dauerhafter Speicherort für User-Uploads im `static`-Ordner.

### 3.2 Sketch

- **Variantenüberblick:** Es wurden verschiedene Ansätze für die Fahrzeugverwaltung und öffentliche Fahrzeugdarstellung betrachtet:
  - Admin-Tabelle mit Aktionen pro Fahrzeug.
  - Öffentliche Kartenansicht mit grossem Bild und Details-Button.
  - Detailseite mit grosser Bildfläche und rechter Datenkarte.
  - Filterleiste mit Dropdowns oberhalb der Fahrzeugliste.
  - Separate Top-Listing-Seite.
- **Skizzen:** Die wichtigsten UI-Varianten betrafen:
  - Fahrzeugliste als Tabelle für Admins.
  - Fahrzeugliste als Kartenansicht für Besucher:innen.
  - Detailseite mit Hauptbild, Thumbnails und Fahrzeugdaten.
  - Filterbereich im Stil einer Fahrzeugplattform.
  - Vollbild-Galerie mit Pfeilnavigation.

### 3.3 Decide

- **Gewählte Variante & Begründung:** Gewählt wurde eine Kombination aus Admin-Tabelle und öffentlicher Fahrzeugkartenansicht. Diese Trennung ist sinnvoll, weil Admins andere Bedürfnisse haben als Besucher:innen. Admins brauchen Status, Aktionen und schnelle Bearbeitung. Besucher:innen brauchen grosse Bilder, klare Fahrzeugdaten, Filter und Details.
- **End-to-End-Ablauf:**
  1. Admin meldet sich an.
  2. Admin erstellt ein Fahrzeug über die Create Page.
  3. Bilder werden vor dem Speichern direkt zu Cloudinary hochgeladen.
  4. SvelteKit speichert Fahrzeugdaten und Bild-URLs in MongoDB.
  5. Fahrzeug erscheint in der Admin-Verwaltung.
  6. Admin kann Fahrzeug bearbeiten, Status ändern oder als Top-Listing markieren.
  7. Besucher:innen sehen aktive Fahrzeuge auf der öffentlichen Liste.
  8. Besucher:innen filtern und sortieren Fahrzeuge.
  9. Besucher:innen öffnen die Detailseite.
  10. Beim Öffnen der Detailseite wird der View Counter erhöht.
- **Mockup:** https://www.figma.com/proto/2dkk7nNC30fER2kc8S9nlS/Untitled?node-id=11-374&t=c9AElUSwk42gCCkE-1&starting-point-node-id=11%3A374 
Das finale UI wurde direkt im Prototyp umgesetzt. Referenzpunkte waren moderne Fahrzeugplattformen mit Kartenlayout, Filterleiste und Detailseite mit Bildergalerie. 

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)

- **Informationsarchitektur:**
  - **Startseite:** Logo, Einstieg und Link zu allen Fahrzeugen.
  - **Login:** Zugang für den Administrator.
  - **Fahrzeuge verwalten:** Admin-Übersicht mit Status, Views, Preis, Kilometerstand und Aktionen.
  - **Create Page:** Formular für neue Fahrzeuge.
  - **Edit Page:** Formular zur Bearbeitung bestehender Fahrzeuge.
  - **Alle Fahrzeuge:** Öffentliche Fahrzeugliste mit Filter- und Sortierfunktion.
  - **Top Listing:** Öffentliche Liste nur für aktive Top-Listing-Fahrzeuge.
  - **Detailseite:** Fahrzeugdaten, Bildergalerie und Preisübersicht.
- **User Interface Design:**
  - Admin-Bereich mit tabellarischer Übersicht.
  - Öffentliche Fahrzeugkarten mit Bild, Eckdaten und Details-Button.
  - Filterbereich mit Dropdowns und Ergebnisanzahl.
  - Suchbare Eingabefelder für Marke und Modell bei der Fahrzeugerstellung.
  - Detailseite mit grossem Hauptbild, klickbaren Thumbnails und Vollbild-Galerie.
- **Designentscheidungen:**
  - Formular in mehrere Abschnitte unterteilt: Merkmale, Zustand, Garantie, Preis, technische Daten, Beschreibung, Bilder.
  - Bilder werden als Vorschau angezeigt und können verschoben oder entfernt werden.
  - Die öffentliche Liste verwendet grössere Karten, weil Bilder bei Fahrzeugen besonders wichtig sind.
  - Top-Listing-Fahrzeuge werden separat dargestellt, damit hervorgehobene Fahrzeuge klar sichtbar sind.
  - Leere States geben verständliche Hinweise, z. B. wenn keine Top-Listings vorhanden sind.

#### 3.4.2. Umsetzung (Technik)

- **Technologie-Stack:**
  - SvelteKit
  - Svelte 5
  - JavaScript
  - MongoDB Atlas
  - Cloudinary
  - Netlify
  - Bootstrap CDN in `app.html`
  - Eigenes CSS in `src/routes/styles/style.css`
  - NHTSA Vehicle API für Marken und Modelle
- **Tooling:**
  - Visual Studio Code
  - Git/GitHub
  - Netlify Dashboard
  - MongoDB Atlas
  - Cloudinary Media Library
  - Browser DevTools
- **Struktur & Komponenten:**
  - `src/routes/` enthält Seiten und Server Actions.
  - `src/routes/cars/create/+page.svelte` enthält die Create Page.
  - `src/routes/cars/[cars_id]/edit/+page.svelte` enthält die Edit Page.
  - `src/routes/cars/[cars_id]/+page.svelte` enthält die Detailansicht.
  - `src/routes/fahrzeuge/+page.svelte` enthält die öffentliche Fahrzeugliste.
  - `src/routes/toplisting/+page.svelte` enthält die Top-Listing-Liste.
  - `src/lib/components/Car.svelte` und `CarInventor.svelte` stellen Fahrzeugzeilen bzw. Fahrzeugkarten dar.
  - `src/lib/db.js` enthält MongoDB-Funktionen wie `getCars`, `getCar`, `createCar`, `updateCar`, `deleteCar`, `updateCarStatus`, `updateTopListing` und `incrementCarViews`.
- **Daten & Schnittstellen:**
  - MongoDB speichert Fahrzeugdaten in der Collection `cars`.
  - Cloudinary speichert Fahrzeugbilder.
  - In MongoDB werden nur die Cloudinary-URLs gespeichert: `images` und `mainImage`.
  - Die NHTSA API liefert Automarken und Modelle:
    - `https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json`
    - `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/{marke}?format=json`
  - Netlify Environment Variables:
    - `DB_URI`
    - `PUBLIC_CLOUDINARY_CLOUD_NAME`
    - `PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- **Deployment:** Netlify. Die finalen Environment Variables müssen im Netlify Dashboard gesetzt werden.
- **Besondere Entscheidungen:**
  - Uploads werden nicht im `static`-Ordner gespeichert, da dies auf Netlify nicht dauerhaft funktioniert.
  - Netlify Blobs wurden nicht als finale Lösung verwendet. Stattdessen wurde Cloudinary gewählt.
  - Bilder werden zuerst direkt zu Cloudinary hochgeladen. Danach werden nur die URLs an die SvelteKit Action gesendet.
  - Das verhindert grosse Multipart-Requests an Netlify Functions.
  - Dynamische Filter werden clientseitig auf den geladenen Fahrzeugdaten berechnet.
  - Die Sortierung wird nach dem Filtern angewendet.
  - Top-Listing filtert nur innerhalb aktiver Top-Listing-Fahrzeuge.

### 3.5 Validate

- **URL der getesteten Version**: https://carhubtool.netlify.app/.
- **Ziele der Prüfung:**
  - Funktioniert der Admin-Login?
  - Können Fahrzeuge erstellt und bearbeitet werden?
  - Werden Bilder korrekt zu Cloudinary hochgeladen?
  - Werden Cloudinary-URLs korrekt in MongoDB gespeichert?
  - Funktionieren Filter unabhängig und kombiniert?
  - Funktioniert die Sortierung auf gefilterten Ergebnissen?
  - Funktioniert die Top-Listing-Seite nur mit Top-Listing-Fahrzeugen?
  - Funktioniert die Detailseite inklusive Galerie und View Counter?
- **Vorgehen:** Manuelle Tests lokal und auf Netlify. Zusätzlich Kontrolle der gespeicherten Daten in MongoDB und der Bilder in Cloudinary.
- **Stichprobe:** Eigene Testdurchläufe und funktionale Tests mit mehreren Fahrzeugen.
- **Aufgaben/Szenarien:**
  1. Als Admin einloggen.
  2. Neues Fahrzeug mit Bildern erstellen.
  3. Fahrzeugdaten in MongoDB prüfen.
  4. Fahrzeug bearbeiten und Bilder ändern.
  5. Fahrzeug als Top-Listing markieren.
  6. Öffentliche Liste nach Getriebe, Marke und Modell filtern.
  7. Sortierung nach Preis und Neuheit testen.
  8. Detailseite öffnen und prüfen, ob Views hochgezählt werden.
  9. Bildergalerie öffnen und durch Bilder navigieren.
- **Kennzahlen & Beobachtungen:**
  - Bilder werden stabil über Cloudinary geladen.
  - Die Filter reagieren direkt und zeigen passende Optionen.
  - Das Modell-Dropdown bleibt deaktiviert, bis eine Marke gewählt wurde.
  - Top-Listing zeigt nur markierte aktive Fahrzeuge.
  - View Counter erhöht sich beim Besuch der Detailseite.
- **Zusammenfassung der Resultate:** Die Kernfunktionen des Prototyps funktionieren: Fahrzeugerstellung, Bild-Upload, Bearbeitung, Verwaltung, öffentliche Anzeige, Filterung, Sortierung und Detailansicht. Die wichtigste technische Verbesserung war der Wechsel von lokalen/static Uploads zu Cloudinary.
- **Abgeleitete Verbesserungen:**
  - Datenqualität bei Select-Feldern verbessern, z. B. `antrieb` darf keine Aufbau-Werte wie `Cabriolet` speichern.
  - Mobile Navigation weiter verbessern.
  - Cloudinary Upload Preset stärker einschränken, z. B. erlaubte Dateitypen und maximale Dateigrösse.
  - Formularvalidierung weiter vereinheitlichen.
  - CSS weiter modularisieren und pro Komponente aufteilen.

## 4. Erweiterungen [Optional]

### 4.1 Cloudinary-Bild-Upload
- **Beschreibung & Nutzen:** Fahrzeugbilder werden nicht mehr lokal oder im Netlify-Dateisystem gespeichert, sondern direkt zu Cloudinary hochgeladen. Dadurch bleiben Bilder nach Deployments verfügbar.
- **Wo umgesetzt:**
  - **Frontend:** Create/Edit Page lädt Bilder zu Cloudinary hoch.
  - **Backend:** Server Actions speichern nur `imageUrls`.
  - **Datenbank:** MongoDB speichert `images` und `mainImage`.
- **Referenz:** Create/Edit Page und Cloudinary Media Library.
- **Aus Evaluation abgeleitet?:** Ja, aus den Problemen mit Netlify Uploads und nicht persistentem `static`-Ordner.

### 4.2 Dynamische Filter
- **Beschreibung & Nutzen:** Filter können einzeln oder kombiniert verwendet werden. Die Optionen passen sich dynamisch an die aktuelle Ergebnismenge an.
- **Wo umgesetzt:**
  - **Frontend:** Öffentliche Fahrzeuglisten und Admin-Übersicht.
  - **Backend:** Fahrzeuge werden aus MongoDB geladen.
  - **Datenbank:** Keine spezielle Query nötig, Filterung erfolgt im Prototyp clientseitig.
- **Referenz:** `fahrzeuge/+page.svelte`, `toplisting/+page.svelte`, `cars/+page.svelte`.
- **Aus Evaluation abgeleitet?:** Ja, aus dem Bedürfnis, Fahrzeuge flexibel nach Merkmalen zu durchsuchen.

### 4.3 Sortierfunktion
- **Beschreibung & Nutzen:** Nutzer:innen können Fahrzeuge nach Neuheit, Marke, Preis und Jahrgang sortieren.
- **Wo umgesetzt:**
  - **Frontend:** Sortierung wird nach der Filterung angewendet.
- **Referenz:** Sortier-Dropdown in den Fahrzeuglisten.
- **Aus Evaluation abgeleitet?:** Nein, als zusätzliche Komfortfunktion umgesetzt.

### 4.4 Top-Listing
- **Beschreibung & Nutzen:** Bestimmte Fahrzeuge können hervorgehoben werden und erscheinen auf einer separaten Top-Listing-Seite.
- **Wo umgesetzt:**
  - **Frontend:** Top-Listing-Seite filtert nur aktive Top-Listing-Fahrzeuge.
  - **Backend:** `updateTopListing` in `db.js`.
  - **Datenbank:** Boolean-Feld `topListing`.
- **Referenz:** `toplisting/+page.svelte`, Admin-Aktionen.
- **Aus Evaluation abgeleitet?:** Nein, als Feature für bessere Fahrzeugpräsentation umgesetzt.

### 4.5 Bildergalerie und View Counter
- **Beschreibung & Nutzen:** Die Detailseite zeigt Bilder als Galerie. Jeder Besuch der Detailseite erhöht den View Counter.
- **Wo umgesetzt:**
  - **Frontend:** Detailseite mit Lightbox-Galerie.
  - **Backend:** Detailseite ruft `incrementCarViews(id)` auf.
  - **Datenbank:** Feld `views`.
- **Referenz:** Detailseite eines Fahrzeugs.
- **Aus Evaluation abgeleitet?:** Teilweise, da eine hochwertige Fahrzeugpräsentation wichtig für die Nutzung ist.

## 5. Projektorganisation [Optional]

- **Repository & Struktur:** https://github.com/alielchab/CarHub GitHub-Repository des CarHub-Projekts.
- **Strukturübersicht:**
  - `src/routes/` – Seiten, Layouts und Server Actions.
  - `src/lib/components/` – wiederverwendbare Komponenten.
  - `src/lib/db.js` – Datenbankzugriff.
  - `src/routes/styles/style.css` – zentrale CSS-Datei.
  - `static/` – statische Assets wie Logos.
- **Issue-Management:** Features und Bugs wurden iterativ bearbeitet, z. B. Upload-Probleme, Netlify-Deployment, Edit Page, Filterlogik, Top-Listing und Galerie.
- **Commit-Praxis:** Sinnvoll sind kurze, sprechende Commits, z. B.:
  - `fixed uploading images to DB by not using a local folder but a folder on cloudinary`
  - `edit page fixed aswell. now the data can be fetched from cloudinary`
  - `success error message`
  - `new detail page added. new design with filters and sort function`

## 6. KI-Deklaration

Die folgende Deklaration beschreibt den Einsatz von KI im Projekt.

### 6.1 KI-Tools

- **Eingesetzte Tools**:
  - ChatGPT für Debugging, Code-Vorschläge, technische Entscheidungen, CSS-Bereinigung, Textentwürfe, Bilder Generierung.
  - Optional: GitHub Copilot für Code-Vervollständigung im Editor.
- **Zweck & Umfang**:
  - Analyse von SvelteKit- und Netlify-Fehlern.
  - Vergleich von Upload-Varianten: `static`-Ordner, Netlify Blobs und Cloudinary.
  - Erstellung von Code-Snippets für Cloudinary Upload, Filterlogik, Sortierung, Galerie und View Counter.
  - Unterstützung bei README-Dokumentation und Formulierungen.
  - CSS-Bereinigung anhand des bestehenden Source-Ordners.
- **Eigene Leistung (Abgrenzung):**
  - Projektthema, Scope und Umsetzung wurden eigenständig verantwortet.
  - KI-Vorschläge wurden geprüft, angepasst und in die bestehende Projektstruktur integriert.
  - Fehler wurden lokal und auf Netlify getestet.
  - Entscheidungen zu finaler Architektur und UI wurden selbst getroffen.

### 6.2 Prompt-Vorgehen

Beim Prompting wurde schrittweise vorgegangen. Statt grosse Änderungen auf einmal umzusetzen, wurden konkrete Probleme einzeln bearbeitet, z. B.:

- “Warum funktioniert Upload in `static` lokal, aber nicht auf Netlify?”
- “Baue Cloudinary in meine Create Page ein.”
- “Passe die Edit Page an Cloudinary an.”
- “Erstelle dynamische Filter, die einzeln und kombiniert funktionieren.”
- “Erstelle eine Galerie für die Detailseite.”
- “Bereinige meine CSS-Datei anhand des src-Ordners.”

Die Vorschläge wurden nicht ungeprüft übernommen, sondern mit Terminal-Logs, Browser-Tests und MongoDB-Kontrolle überprüft.

### 6.3 Reflexion

Der Einsatz von KI war besonders hilfreich beim Debugging komplexer Fehler, z. B. Netlify-Upload-Problemen, SvelteKit-Server-Actions und dynamischer Filterlogik. Die KI half auch, technische Alternativen zu vergleichen und die Dokumentation zu strukturieren.

Grenzen zeigten sich dort, wo Vorschläge nicht exakt zur bestehenden Projektstruktur passten. Einige Lösungen mussten verworfen oder angepasst werden, z. B. bei Bootstrap-Navigation oder beim Umgang mit Netlify-Dateispeicher. Wichtig war deshalb, Änderungen klein zu halten und nach jedem Schritt zu testen.

Qualitätssicherung erfolgte durch:
- lokales Testen mit `npm run dev`;
- Testen auf Netlify;
- Kontrolle der MongoDB-Daten;
- Kontrolle der Cloudinary Media Library;
- Überprüfung von Browser-Konsole und Terminal-Logs.

## 7. Anhang [Optional]

- **Quellen:**
  - NHTSA Vehicle API für Fahrzeugmarken und Modelle.
  - Cloudinary für Bildspeicherung.
  - Netlify für Deployment.
  - MongoDB Atlas für Datenpersistenz.
  - Bootstrap CDN in `app.html`.
- **Testskript & Materialien:** [docs/validate/](docs/validate/)
- **Screenshots:** [docs/screenshots/](docs/screenshots/)
