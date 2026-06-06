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

<!-- Diese Vorlage ist für eine README.md im Repository gedacht. Abschnitte mit [Optional] können weggelassen werden, wenn in den Übungen nichts anderes verlangt wird. -->

## 1. Ausgangslage

CarHub ist ein webbasierter Prototyp für ein Autoverwaltungstool. Die Anwendung orientiert sich funktional an Fahrzeugplattformen wie AutoScout24, ist jedoch bewusst auf einen kleineren und überschaubaren Anwendungsfall reduziert. Ein Administrator kann Fahrzeuge erfassen, verwalten, bearbeiten, mit Bildern versehen und öffentlich präsentieren. Besucher:innen können Fahrzeuge durchsuchen, filtern, sortieren und Detailinformationen inklusive Bildergalerie ansehen.

- **Problem:** Fahrzeugdaten bestehen aus vielen einzelnen Angaben wie Marke, Modell, Preis, Kilometerstand, Zustand, Treibstoff, Getriebe, Aufbau, Antrieb, Bilder und technischen Daten. Ohne strukturierte Verwaltung wird es schnell unübersichtlich, Fahrzeuge korrekt zu erfassen und öffentlich darzustellen. Zusätzlich ist die Speicherung von hochgeladenen Bildern im lokalen `static`-Ordner für ein Netlify-Deployment nicht geeignet, weil dieser Ordner zur Laufzeit nicht als persistenter Speicher genutzt werden kann.
- **Ziele:**
  - Fahrzeuge zentral erfassen, bearbeiten und verwalten.
  - Fahrzeugbilder stabil über Cloudinary hochladen und anzeigen.
  - Fahrzeugdaten in MongoDB speichern.
  - Öffentliche Fahrzeuglisten mit dynamischen Filtern und Sortierung anbieten.
  - Top-Listing-Fahrzeuge separat darstellen.
  - Detailseiten mit Bildergalerie und View Counter umsetzen.
  - Beim endgültigen Löschen eines Fahrzeugs auch die zugehörigen Cloudinary-Bilder löschen.
  - Den Prototyp online über Netlify bereitstellen.
- **Primäre Zielgruppe:** Administrator:innen eines kleinen Fahrzeugbestands, die Fahrzeuge digital verwalten und öffentlich präsentieren möchten.
- **Weitere Stakeholder [Optional]:**
  - Besucher:innen der öffentlichen Fahrzeugseite.
  - Projektbetreuung und Dozierende im Rahmen des Prototyping-Moduls.
  - Potenzielle Fahrzeuginteressierte, die Fahrzeuge nach Merkmalen filtern und vergleichen möchten.

## 2. Lösungsidee

CarHub trennt klar zwischen einer internen Admin-Oberfläche und einer öffentlichen Fahrzeugansicht. Der Admin-Bereich dient der Verwaltung des Fahrzeugbestands. Die öffentliche Ansicht dient der Suche, Filterung und Präsentation der Fahrzeuge.

- **Kernfunktionalität:**
  - **Admin-Login:** Nur der Administrator-Login ist vorhanden und berechtigt, sich anzumelden.
  - **Fahrzeuge erstellen:** Fahrzeugdaten, technische Daten, Preis, Zustand, Garantie, Beschreibung und Bilder erfassen.
  - **Fahrzeuge bearbeiten:** Bestehende Fahrzeuge aktualisieren, Bilder hinzufügen, entfernen und sortieren.
  - **Fahrzeugstatus verwalten:** Fahrzeuge können als aktiv, inaktiv, Entwurf, verkauft oder entfernt geführt werden.
  - **Top-Listing:** Fahrzeuge können hervorgehoben und auf einer separaten Top-Listing-Seite angezeigt werden.
  - **Öffentliche Fahrzeugliste:** Aktive Fahrzeuge werden als Fahrzeugkarten dargestellt.
  - **Dynamische Filter:** Filter funktionieren einzeln und kombiniert. Die Filteroptionen passen sich an die aktuell passende Ergebnismenge an.
  - **Modell-Filter:** Das Modell ist erst auswählbar, wenn eine Marke gewählt wurde.
  - **Sortierung:** Neueste/älteste Inserate, Marke A-Z/Z-A, Preis niedrig/hoch und Jahrgang alt/neu.
  - **Detailansicht:** Fahrzeugdaten, Preis, technische Daten, Bildergalerie, Vollbildansicht und View Counter.
  - **Bildspeicherung:** Upload direkt zu Cloudinary, Speicherung der Bilddaten in MongoDB.
  - **Cloudinary-Löschung:** Neue Bilder werden mit `url` und `publicId` gespeichert. Dadurch können Bilder beim endgültigen Löschen eines Fahrzeugs auch aus Cloudinary entfernt werden.

- **Annahmen [Optional]:**
  - Admins möchten Fahrzeuge möglichst schnell erfassen und aktualisieren.
  - Besucher:innen möchten Fahrzeuge vor allem über Marke, Modell, Getriebe, Treibstoff, Aufbau, Antrieb und Preis vergleichen.
  - Fahrzeugbilder sind zentral für die Qualität der Fahrzeugpräsentation.
  - Ein externer Bildspeicher ist für Netlify stabiler und wartbarer als lokale Dateiablage.
  - Eine klare Trennung zwischen Admin- und öffentlichem Bereich verbessert Bedienbarkeit und Sicherheit.

- **Abgrenzung [Optional]:**
  - Keine Zahlungsabwicklung.
  - Kein Käufer-/Verkäufer-Accountsystem.
  - Kein Chat zwischen Käufer und Verkäufer.
  - Keine automatische Fahrzeugbewertung.
  - Keine rechtliche Kaufvertragsabwicklung.
  - Keine vollständige Produktionsplattform, sondern ein funktionsfähiger Prototyp.

## 3. Vorgehen & Artefakte

Die Umsetzung erfolgte iterativ. Einzelne Funktionen wurden nacheinander entwickelt, lokal getestet, korrigiert und anschliessend auf Netlify überprüft. Die Entwicklung orientierte sich an den Phasen Understand/Define, Sketch, Decide, Prototype und Validate.

### 3.1 Understand & Define

- **Zielgruppenverständnis:** Die Anwendung richtet sich an eine Person oder Organisation, die Fahrzeuge verwalten und online präsentieren möchte. Im Vordergrund stehen eine einfache Administration, stabile Bildverwaltung und eine verständliche öffentliche Fahrzeuganzeige.
- **Wesentliche Erkenntnisse:**
  - Ein Fahrzeugformular benötigt klare Abschnitte, damit die vielen Datenfelder nicht unübersichtlich werden.
  - Bilder müssen vor dem Speichern sichtbar sein, damit der Admin Reihenfolge und Auswahl kontrollieren kann.
  - Normale HTML-Selects mit sehr vielen Automarken sind unhandlich. Deshalb wurde für Marke und Modell ein suchbares Dropdown umgesetzt.
  - Filter müssen unabhängig funktionieren, z. B. soll “Getriebe = Schaltung” alle geschalteten Fahrzeuge anzeigen, unabhängig von der Marke.
  - Andere Filteroptionen sollen sich dynamisch an die aktuelle Auswahl anpassen.
  - Netlify eignet sich gut für Hosting und SvelteKit Server Actions, aber nicht als dauerhafter Speicherort für User-Uploads im `static`-Ordner.
  - Für eine saubere Bildlöschung muss neben der Bild-URL auch die Cloudinary `publicId` gespeichert werden.

### 3.2 Sketch

- **Variantenüberblick:** Es wurden verschiedene Ansätze für die Fahrzeugverwaltung und öffentliche Fahrzeugdarstellung betrachtet:
  - Admin-Tabelle mit Aktionen pro Fahrzeug.
  - Öffentliche Kartenansicht mit grossem Bild und Details-Button.
  - Detailseite mit grosser Bildfläche und rechter Datenkarte.
  - Filterleiste mit Dropdowns oberhalb der Fahrzeugliste.
  - Separate Top-Listing-Seite.
  - Vollbild-Galerie für Fahrzeugbilder.

- **Skizzen / UI-Ideen:**
  - Fahrzeugliste als Tabelle für Admins.
  - Fahrzeugliste als Kartenansicht für Besucher:innen.
  - Detailseite mit Hauptbild, Thumbnails und Fahrzeugdaten.
  - Filterbereich im Stil einer Fahrzeugplattform.
  - Galerie mit Pfeilnavigation und Schliessen-Funktion.
  - Leere Zustände, z. B. wenn keine Top-Listings vorhanden sind.

### 3.3 Decide

- **Gewählte Variante & Begründung:** Gewählt wurde eine Kombination aus Admin-Tabelle und öffentlicher Fahrzeugkartenansicht. Diese Trennung ist sinnvoll, weil Admins andere Bedürfnisse haben als Besucher:innen. Admins brauchen Status, Aktionen und schnelle Bearbeitung. Besucher:innen brauchen grosse Bilder, klare Fahrzeugdaten, Filter und Details.
- **End-to-End-Ablauf:**
  1. Admin meldet sich an.
  2. Admin erstellt ein Fahrzeug über die Create Page.
  3. Bilder werden vor dem Speichern direkt zu Cloudinary hochgeladen.
  4. SvelteKit speichert Fahrzeugdaten und Bildinformationen in MongoDB.
  5. Fahrzeug erscheint in der Admin-Verwaltung.
  6. Admin kann Fahrzeug bearbeiten, Status ändern oder als Top-Listing markieren.
  7. Besucher:innen sehen aktive Fahrzeuge auf der öffentlichen Liste.
  8. Besucher:innen filtern und sortieren Fahrzeuge.
  9. Besucher:innen öffnen die Detailseite.
  10. Beim Öffnen der Detailseite wird der View Counter erhöht.
- **Mockup:**  
  https://www.figma.com/proto/2dkk7nNC30fER2kc8S9nlS/Untitled?node-id=11-374&t=c9AElUSwk42gCCkE-1&starting-point-node-id=11%3A374

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
  - Filterbereich mit Dropdowns, Ergebnisanzahl und Reset-Funktion.
  - Suchbare Eingabefelder für Marke und Modell bei der Fahrzeugerstellung.
  - Detailseite mit grossem Hauptbild, klickbaren Thumbnails und Vollbild-Galerie.
  - Leere Zustände mit klaren Hinweisen.

- **Screenshots der fertigen App:**

| Bereich | Datei/Ordner | Beschreibung |
|---|---|---|
| Startseite | [docs/screenshots/desktop/homepage_for_viewers.png](docs/screenshots/) | Einstieg in CarHub mit Logo und Link zu den Fahrzeugen. |
| Login | [docs/screenshots/desktop/login_page.png](docs/screenshots/desktop/login_page.png) | Admin-Login mit Hinweis, dass nur Admins berechtigt sind. |
| Fahrzeugverwaltung | [docs/screenshots/desktop/fahrzeugverwaltungs_page_mit_aktive_Fahrzeuge.png](docs/screenshots/desktop/fahrzeugverwaltungs_page_mit_aktive_Fahrzeuge.png) | Admin-Tabelle mit Fahrzeugstatus, Views, Aktionen und Top-Listing. |
| Create Page | [docs/screenshots/desktop/create_page.png](docs/screenshots/desktop/create_page.png) | Formular zum Erfassen von Fahrzeugdaten und Bildern. |
| Öffentliche Fahrzeugliste | [docs/screenshots/desktop/fahrzeuge_page.png](docs/screenshots/desktop/fahrzeuge_page.png) | Kartenansicht mit Filter, Sortierung und Ergebnisanzahl. |
| Top Listing | [docs/screenshots/desktop/top_listing_mit_Fahrzeugen.png](docs/screenshots/desktop/top_listing_mit_Fahrzeugen.png) | Separate Ansicht für hervorgehobene Fahrzeuge. |
| Detailseite | [docs/screenshots/desktop/Fahrzeug_details_page.png](docs/screenshots/desktop/Fahrzeug_details_page.png) | Fahrzeugdaten, Hauptbild, Thumbnails und Galerie. |

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
  - Eigenes CSS in [src/routes/styles/style.css](src/routes/styles/style.css)
  - NHTSA Vehicle API für Marken und Modelle

  - **Tooling:**
  - **Visual Studio Code** als Entwicklungsumgebung.
  - **Svelte for VS Code** für Syntax-Highlighting, Svelte-Unterstützung und Fehlermeldungen.
  - **Git & GitHub** für Versionsverwaltung, Repository-Ablage und Abgabe des Sourcecodes.
  - **Netlify Dashboard** für Deployment, Build-Konfiguration und Environment Variables.
  - **MongoDB Atlas** als Cloud-Datenbank für Fahrzeugdaten.
  - **MongoDB Compass** zur lokalen Kontrolle und Bearbeitung der gespeicherten Fahrzeugdaten.
  - **Cloudinary Dashboard / Media Library** zur Verwaltung der hochgeladenen Fahrzeugbilder.
  - **Browser DevTools** für Debugging, Responsive-Checks, Netzwerkprüfung und Konsolenmeldungen.
  - **Terminal / npm** zum Installieren von Dependencies, Starten des lokalen Entwicklungsservers und Ausführen von Builds.

**KI-Deklaration:** Siehe Kapitel 6 [KI-Deklaration](#6-ki-deklaration)

- **Struktur & Komponenten:**
  - [src/routes/](src/routes/) enthält Seiten und Server Actions.
  - [src/routes/cars/create/+page.svelte](src/routes/cars/create/+page.svelte) enthält die Create Page.
  - [src/routes/cars/[cars_id]/edit/+page.svelte](src/routes/cars/[cars_id]/edit/+page.svelte) enthält die Edit Page.
  - [src/routes/cars/[cars_id]/+page.svelte](src/routes/cars/[cars_id]/+page.svelte) enthält die Detailansicht.
  - [src/routes/fahrzeuge/+page.svelte](src/routes/fahrzeuge/+page.svelte) enthält die öffentliche Fahrzeugliste.
  - [src/routes/toplisting/+page.svelte](src/routes/toplisting/+page.svelte) enthält die Top-Listing-Liste.
  - [src/lib/components/Car.svelte](src/lib/components/Car.svelte) und [src/lib/components/CarInventory.svelte](src/lib/components/CarInventory.svelte) stellen Fahrzeugzeilen bzw. Fahrzeugkarten dar.
  - [src/lib/db.js](src/lib/db.js) enthält MongoDB-Funktionen wie `getCars`, `getCar`, `createCar`, `updateCar`, `deleteCar`, `updateCarStatus`, `updateTopListing` und `incrementCarViews`.
  - [src/lib/server/cloudinary.js](src/lib/server/cloudinary.js) enthält serverseitige Cloudinary-Funktionen für das Löschen von Bildern.

- **Daten & Schnittstellen:**
  - MongoDB speichert Fahrzeugdaten in der Collection `cars`.
  - Cloudinary speichert Fahrzeugbilder.
  - In MongoDB werden neue Bilder als Objekte gespeichert:

```js
images: [
  {
    url: "https://res.cloudinary.com/...",
    publicId: "cloudinary_public_id"
  }
],
mainImage: "https://res.cloudinary.com/..."
```

  - Dadurch kann ein Bild angezeigt und später mit der `publicId` aus Cloudinary gelöscht werden.
  - Die NHTSA API liefert Automarken und Modelle:
    - `https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json`
    - `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/{marke}?format=json`
  - Netlify Environment Variables:
    - `DB_URI`
    - `PUBLIC_CLOUDINARY_CLOUD_NAME`
    - `PUBLIC_CLOUDINARY_UPLOAD_PRESET`
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`

- **Deployment:** https://carhubtool.netlify.app/
- **Besondere technische Entscheidungen:**
  - Uploads werden nicht im `static`-Ordner gespeichert, da dies auf Netlify nicht dauerhaft funktioniert.
  - Netlify Blobs wurden nicht als finale Lösung verwendet. Stattdessen wurde Cloudinary gewählt.
  - Bilder werden zuerst direkt zu Cloudinary hochgeladen. Danach werden `url` und `publicId` an die SvelteKit Action gesendet.
  - Beim endgültigen Löschen eines Fahrzeugs werden zuerst die Cloudinary-Bilder gelöscht und danach der MongoDB-Datensatz entfernt.
  - Dynamische Filter werden clientseitig auf den geladenen Fahrzeugdaten berechnet.
  - Die Sortierung wird nach dem Filtern angewendet.
  - Top-Listing filtert nur innerhalb aktiver Top-Listing-Fahrzeuge.

### 3.5 Validate

- **URL der getesteten Version:** https://carhubtool.netlify.app/
- **Ziele der Prüfung:**
  - Funktioniert der Admin-Login?
  - Können Fahrzeuge erstellt und bearbeitet werden?
  - Werden Bilder korrekt zu Cloudinary hochgeladen?
  - Werden `url` und `publicId` korrekt in MongoDB gespeichert?
  - Funktioniert das Löschen von Bildern aus Cloudinary?
  - Funktionieren Filter unabhängig und kombiniert?
  - Funktioniert die Sortierung auf gefilterten Ergebnissen?
  - Funktioniert die Top-Listing-Seite nur mit Top-Listing-Fahrzeugen?
  - Funktioniert die Detailseite inklusive Galerie und View Counter?

- **Vorgehen:** Manuelle Tests lokal und auf Netlify. Zusätzlich Kontrolle der gespeicherten Daten in MongoDB und der Bilder in Cloudinary.
- **Stichprobe / Testpersonen:**
  - **TP1:** Testperson mit Fokus auf Admin-Workflow und Fahrzeugerfassung.
  - **TP2:** Testperson mit Fokus auf öffentliche Fahrzeugsuche, Filter und Detailseite.
  - Zusätzlich wurden eigene technische Kontrolltests durchgeführt.

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
  10. Fahrzeug endgültig löschen und prüfen, ob die Cloudinary-Bilder entfernt werden.

- **Kennzahlen & Beobachtungen:**

| Testperson | Aufgabe | Beobachtung | Ergebnis |
|---|---|---|---|
| TP1 | Admin-Login | Login war verständlich, Einstieg in Verwaltung klar. | Erfolgreich |
| TP1 | Fahrzeug erstellen | Formular ist lang, aber durch Abschnitte verständlich. | Erfolgreich |
| TP1 | Bilder hochladen | Bildvorschau vor dem Speichern war hilfreich. | Erfolgreich |
| TP1 | Marke/Modell wählen | Sehr lange Markenliste wäre ohne Suchfunktion unübersichtlich. | Verbesserung erkannt |
| TP1 | Fahrzeug bearbeiten | Vorhandene Bilder und Daten wurden angezeigt. | Erfolgreich |
| TP2 | Öffentliche Filter | Filter funktionierten einzeln und kombiniert. | Erfolgreich |
| TP2 | Modell-Filter | Modell wurde erst nach Marke aktiv. | Erfolgreich |
| TP2 | Sortierung | Sortierung nach Preis und Neuheit war nachvollziehbar. | Erfolgreich |
| TP2 | Detailseite | Galerie und Fahrzeugdaten waren verständlich. | Erfolgreich |
| TP2 | Top-Listing | Separate Top-Listing-Seite war verständlich. | Erfolgreich |

- **Zusammenfassung der Resultate:**
  - Die wichtigsten Kernworkflows funktionieren: Fahrzeugerstellung, Bild-Upload, Bearbeitung, Verwaltung, öffentliche Anzeige, Filterung, Sortierung und Detailansicht.
  - Die dynamischen Filter wurden positiv bewertet, weil sie einzeln und kombiniert funktionieren.
  - Das suchbare Marken-/Modellfeld verbessert die Bedienbarkeit deutlich.
  - Die Bildvorschau und Cloudinary-Speicherung lösen ein zentrales technisches Problem des Deployments.
  - Die Detailseite mit Galerie entspricht der Erwartung an eine moderne Fahrzeugplattform.
  - Verbesserungsbedarf besteht bei mobiler Navigation, Formularvalidierung, konsistenten Select-Werten und weiterer UI-Feinarbeit.

- **Abgeleitete Verbesserungen:**
  - Datenqualität bei Select-Feldern verbessern, z. B. `antrieb` darf keine Aufbau-Werte wie `Cabriolet` speichern.
  - Mobile Navigation weiter verbessern.
  - Cloudinary Upload Preset stärker einschränken, z. B. erlaubte Dateitypen und maximale Dateigrösse.
  - Formularvalidierung weiter vereinheitlichen.
  - CSS weiter modularisieren und pro Komponente aufteilen.
  - Admin-Zugriff robuster absichern und Fehlermeldungen benutzerfreundlicher gestalten.

## 4. Erweiterungen [Optional]

### 4.1 Cloudinary-Bild-Upload und Bildlöschung

- **Beschreibung & Nutzen:** Fahrzeugbilder werden nicht lokal oder im Netlify-Dateisystem gespeichert, sondern direkt zu Cloudinary hochgeladen. Dadurch bleiben Bilder nach Deployments verfügbar. Neue Bilder werden mit `url` und `publicId` gespeichert. Dadurch können sie später serverseitig wieder aus Cloudinary gelöscht werden.
- **Wo umgesetzt:**
  - **Frontend:** Create/Edit Page lädt Bilder zu Cloudinary hoch.
  - **Backend:** Server Actions speichern `images` als Objekte mit `url` und `publicId`.
  - **Datenbank:** MongoDB speichert `images` und `mainImage`.
  - **Server:** Cloudinary SDK löscht Bilder anhand der `publicId`.
- **Referenz:** Create/Edit Page, [src/lib/server/cloudinary.js](src/lib/server/cloudinary.js), [Cloudinary Media Library](https://cloudinary.com/media_library).
- **Aus Evaluation abgeleitet?:** Ja, aus den Problemen mit Netlify Uploads und nicht persistentem `static`-Ordner.

### 4.2 Dynamische Filter

- **Beschreibung & Nutzen:** Filter können einzeln oder kombiniert verwendet werden. Die Optionen passen sich dynamisch an die aktuelle Ergebnismenge an.
- **Wo umgesetzt:**
  - **Frontend:** Öffentliche Fahrzeuglisten und Admin-Übersicht.
  - **Backend:** Fahrzeuge werden aus MongoDB geladen.
  - **Datenbank:** Keine spezielle Query nötig, Filterung erfolgt im Prototyp clientseitig.
- **Referenz:** [fahrzeuge/+page.svelte](src/routes/fahrzeuge/+page.svelte), [toplisting/+page.svelte](src/routes/toplisting/+page.svelte), [cars/+page.svelte](src/routes/cars/+page.svelte).
- **Aus Evaluation abgeleitet?:** Ja, aus dem Bedürfnis, Fahrzeuge flexibel nach Merkmalen zu durchsuchen.

### 4.3 Sortierfunktion

- **Beschreibung & Nutzen:** Nutzer:innen können Fahrzeuge nach Neuheit, Marke, Preis und Jahrgang sortieren.
- **Wo umgesetzt:** Frontend, nach der Filterung.
- **Referenz:** Sortier-Dropdown in den Fahrzeuglisten.
- **Aus Evaluation abgeleitet?:** Nein, als zusätzliche Komfortfunktion umgesetzt.

### 4.4 Top-Listing

- **Beschreibung & Nutzen:** Bestimmte Fahrzeuge können hervorgehoben werden und erscheinen auf einer separaten Top-Listing-Seite.
- **Wo umgesetzt:**
  - **Frontend:** Top-Listing-Seite filtert nur aktive Top-Listing-Fahrzeuge.
  - **Backend:** `updateTopListing` in [src/lib/db.js](src/lib/db.js).
  - **Datenbank:** Boolean-Feld `topListing`.
- **Referenz:** [toplisting/+page.svelte](src/routes/toplisting/+page.svelte), Admin-Aktionen.
- **Aus Evaluation abgeleitet?:** Nein, als Feature für bessere Fahrzeugpräsentation umgesetzt.

### 4.5 Bildergalerie und View Counter

- **Beschreibung & Nutzen:** Die Detailseite zeigt Bilder als Galerie. Jeder Besuch der Detailseite erhöht den View Counter.
- **Wo umgesetzt:**
  - **Frontend:** Detailseite mit Lightbox-Galerie.
  - **Backend:** Detailseite ruft `incrementCarViews(id)` auf.
  - **Datenbank:** Feld `views`.
- **Referenz:** Detailseite eines Fahrzeugs.
- **Aus Evaluation abgeleitet?:** Teilweise, da eine hochwertige Fahrzeugpräsentation wichtig für die Nutzung ist.

### 4.6 Suchbares Marken- und Modellfeld

- **Beschreibung & Nutzen:** Die NHTSA API liefert sehr viele Automarken. Ein normales Dropdown ist deshalb unübersichtlich. Durch ein suchbares Dropdown können Admins schneller Marke und Modell finden.
- **Wo umgesetzt:**
  - **Frontend:** Create Page und Edit Page.
  - **API:** NHTSA Vehicle API.
- **Aus Evaluation abgeleitet?:** Ja, weil die lange Markenliste als unübersichtlich erkannt wurde.

## 5. Projektorganisation [Optional]

- **Repository:** https://github.com/alielchab/CarHub
- **Deployment:** https://carhubtool.netlify.app/
- **Strukturübersicht:**
  - [src/routes/](src/routes/) – Seiten, Layouts und Server Actions.
  - [src/lib/components/](src/lib/components/) – wiederverwendbare Komponenten.
  - [src/lib/db.js](src/lib/db.js) – Datenbankzugriff.
  - [src/lib/server/cloudinary.js](src/lib/server/cloudinary.js) – serverseitige Cloudinary-Löschung.
  - [src/routes/styles/style.css](src/routes/styles/style.css) – zentrale CSS-Datei.
  - [static/](static/) – statische Assets wie Logos.
  - `docs/screenshots/` – Screenshots der fertigen App.
  - `docs/validate/` – Testskript, Testergebnisse und Rohdaten/Auswertung.
- **Issue-Management:** Features und Bugs wurden iterativ bearbeitet. Beispiele:
  - Upload-Probleme auf Netlify.
  - Wechsel von lokalem Upload zu Cloudinary.
  - Edit Page an neue Bildstruktur angepasst.
  - Dynamische Filterlogik umgesetzt.
  - Top-Listing ergänzt.
  - Detail-Galerie und View Counter ergänzt.
  - Cloudinary-Löschung über `publicId` ergänzt.
- **Commit-Praxis:** Es wurden mehrere Commits mit sprechenden Beschreibungen erstellt, z. B.:
  - `fixed uploading images to DB by not using a local folder but a folder on cloudinary`
  - `edit page fixed aswell. now the data can be fetched from cloudinary`
  - `success error message`
  - `new detail page added. new design with filters and sort function`

## 6. KI-Deklaration

Die folgende Deklaration beschreibt den Einsatz von KI im Projekt.

### 6.1 KI-Tools

- **Eingesetzte Tools:**
  - ChatGPT für Debugging, Code-Vorschläge, technische Entscheidungen, CSS-Bereinigung, Textentwürfe, Bildgenerierung.
  - Optional: GitHub Copilot für Code-Vervollständigung im Editor.

- **Zweck & Umfang:**
  - Analyse von SvelteKit- und Netlify-Fehlern.
  - Vergleich von Upload-Varianten: `static`-Ordner, Netlify Blobs und Cloudinary.
  - Erstellung von Code-Snippets für Cloudinary Upload, Filterlogik, Sortierung, Galerie, View Counter und Cloudinary-Löschung.
  - CSS-Bereinigung anhand des bestehenden Source-Ordners.
  - Erstellung von Testskript, Resultate-Dokument, Rohdaten/Auswertung und Video-Skript.
  - Generierung von Beispiel-Fahrzeugdaten und Fahrzeugbildern für den Prototyp.

- **Eigene Leistung (Abgrenzung):**
  - Projektthema, Scope und Umsetzung wurden eigenständig verantwortet.
  - KI-Vorschläge wurden geprüft, angepasst und in die bestehende Projektstruktur integriert.
  - Fehler wurden lokal und auf Netlify getestet.
  - Entscheidungen zu finaler Architektur und UI wurden selbst getroffen.
  - Die Verantwortung für Korrektheit, Quellen, Urheberrecht und Integration liegt beim Entwickler.

### 6.2 Prompt-Vorgehen

Beim Prompting wurde schrittweise vorgegangen. Statt grosse Änderungen auf einmal umzusetzen, wurden konkrete Probleme einzeln bearbeitet, z. B.:

- “Warum funktioniert Upload in `static` lokal, aber nicht auf Netlify?”
- “Baue Cloudinary in meine Create Page ein.”
- “Passe die Edit Page an Cloudinary an.”
- “Erstelle dynamische Filter, die einzeln und kombiniert funktionieren.”
- “Erstelle eine Galerie für die Detailseite.”
- “Bereinige meine CSS-Datei anhand des src-Ordners.”
- “Passe das Löschen so an, dass Bilder auch aus Cloudinary gelöscht werden.”

Die Vorschläge wurden nicht ungeprüft übernommen, sondern mit Terminal-Logs, Browser-Tests, MongoDB-Kontrolle und Cloudinary-Kontrolle überprüft.

### 6.3 Reflexion

Der Einsatz von KI war besonders hilfreich beim Debugging komplexer Fehler, z. B. Netlify-Upload-Problemen, SvelteKit-Server-Actions, Cloudinary-Bildspeicherung und dynamischer Filterlogik. Die KI half auch, technische Alternativen zu vergleichen und die Dokumentation zu strukturieren.

Grenzen zeigten sich dort, wo Vorschläge nicht exakt zur bestehenden Projektstruktur passten. Einige Lösungen mussten verworfen oder angepasst werden, z. B. bei Bootstrap-Navigation oder beim Umgang mit Netlify-Dateispeicher. Wichtig war deshalb, Änderungen klein zu halten und nach jedem Schritt zu testen.

Qualitätssicherung erfolgte durch:
- lokales Testen mit `npm run dev`;
- Testen auf Netlify;
- Kontrolle der MongoDB-Daten;
- Kontrolle der Cloudinary Media Library;
- Überprüfung von Browser-Konsole und Terminal-Logs;
- manuelle End-to-End-Tests der wichtigsten Workflows.

## 7. Anhang [Optional]

- **Quellen:**
  - NHTSA Vehicle API für Fahrzeugmarken und Modelle.
  - Cloudinary für Bildspeicherung.
  - Netlify für Deployment.
  - MongoDB Atlas für Datenpersistenz.
  - Bootstrap CDN in `app.html`.
  - SvelteKit Dokumentation.
- **Testskript & Materialien:** [docs/validate/](docs/validate/)
- **Screenshots:** [docs/screenshots/](docs/screenshots/)
