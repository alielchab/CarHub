<script>
  let { form } = $props();

  let makes = $state([]);
  let models = $state([]);

  let selectedMake = $state("");
  let selectedModel = $state("");
  let selectedGetriebe = $state("");
  let selectedArt = $state("");
  let selectedGarantie = $state("");
  let ps = $state("");
  let kw = $state("");

  async function loadMakes() {
    const res = await fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json",
    );

    const data = await res.json();

    makes = data.Results.map((make) => make.Make_Name).sort();
  }

  async function loadModels() {
    selectedModel = "";
    models = [];

    if (!selectedMake) return;

    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${selectedMake}?format=json`,
    );

    const data = await res.json();

    models = data.Results.map((model) => model.Model_Name).sort();
  }

  loadMakes();

  //je nach dem welche Getriebeart ausgewählt wird, werden die entsprechenden Arten angezeigt
  const getriebeArten = {
    Automat: ["Automat", "Stufenlos", "Halbautomatisches Getriebe"],
    Schaltung: ["Schaltgetriebe manuell"],
  };

  let availableArten = $derived(
    selectedGetriebe ? getriebeArten[selectedGetriebe] : [],
  );

  // Umrechnung PS <-> KW
  function updateKw() {
    if (!ps) {
      kw = "";
      return;
    }

    kw = Math.round(Number(ps) * 0.735499);
  }

  // Umrechnung KW <-> PS
  function updatePs() {
    if (!kw) {
      ps = "";
      return;
    }

    ps = Math.round(Number(kw) / 0.735499);
  }
</script>

<div class="create-page">
  <div class="create-container">
    <div class="create-header">
      <h1>Fahrzeugdaten ergänzen</h1>
      <p>
        Nicht alle Infos zur Hand? Sie können die Daten auch später ergänzen.
      </p>
    </div>

    <form method="POST" action="?/create" enctype="multipart/form-data">
      <!-- Fahrzeug Merkmale -->
      <section class="form-section">
        <div class="section-title">
          <h2>Fahrzeug-Merkmale</h2>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Marke *</label>
            <select
              name="marke"
              required
              bind:value={selectedMake}
              onchange={loadModels}
            >
              <option value="">Marke auswählen</option>

              {#each makes as make}
                <option value={make}>{make}</option>
              {/each}
            </select>
          </div>

          <div class="field">
            <label>Modell *</label>
            <select
              name="modell"
              required
              bind:value={selectedModel}
              disabled={!selectedMake}
            >
              <option value="">
                {selectedMake ? "Modell auswählen" : "Zuerst Marke auswählen"}
              </option>

              {#each models as model}
                <option value={model}>{model}</option>
              {/each}
            </select>
          </div>

          <div class="field">
            <label>Getriebe *</label>
            <select name="getriebe" required bind:value={selectedGetriebe}>
              <option value="">Auswählen</option>
              <option value="Automat">Automat</option>
              <option value="Schaltung">Schaltung</option>
            </select>
          </div>

          <div class="field">
            <label>Art *</label>
            <select
              name="art"
              required
              bind:value={selectedArt}
              disabled={!selectedGetriebe}
            >
              <option value="">
                {selectedGetriebe
                  ? "Art auswählen"
                  : "Zuerst Getriebe auswählen"}
              </option>

              {#each availableArten as art}
                <option value={art}>{art}</option>
              {/each}
            </select>
          </div>

          <div class="field">
            <label>Version</label>
            <input name="version" type="text" />
          </div>

          <div class="field">
            <label>Aufbau *</label>

            <select name="aufbau" required>
              <option value="">Auswählen</option>

              <option value="Bus">Bus</option>
              <option value="Cabriolet">Cabriolet</option>
              <option value="Coupé">Coupé</option>
              <option value="Kleinwagen">Kleinwagen</option>
              <option value="Kombi">Kombi</option>
              <option value="Kompaktvan / Minivan">Kompaktvan / Minivan</option>
              <option value="Limousine">Limousine</option>
              <option value="Pick-up">Pick-up</option>
              <option value="SUV / Geländewagen">SUV / Geländewagen</option>
              <option value="Van">Van</option>
              <option value="Wohnmobil">Wohnmobil</option>
              <option value="Transporter">Transporter</option>
              <option value="Roadster">Roadster</option>
            </select>
          </div>

          <div class="field">
            <label>Antrieb</label>
            <select name="antrieb" required>
              <option>Auswählen</option>

              <option value="Bus">Allrad</option>
              <option value="Cabriolet">Hinterradantrieb</option>
              <option value="Coupé">Vorderradantrieb</option>
            </select>
          </div>

          <div class="field">
            <label>Treibstoff</label>

            <select name="treibstoff" required>
              <option value="">Treibstoff auswählen</option>

              <option value="Benzin">Benzin</option>
              <option value="Bioethanol/Benzin">Bioethanol/Benzin</option>
              <option value="Diesel">Diesel</option>
              <option value="Elektro">Elektro</option>
              <option value="Erdgas (CNG)/Benzin">Erdgas (CNG)/Benzin</option>
              <option value="Flüssiggas (LPG)/Benzin"
                >Flüssiggas (LPG)/Benzin</option
              >

              <option value="Mild-Hybrid Benzin/Elektro">
                Mild-Hybrid Benzin/Elektro
              </option>

              <option value="Mild-Hybrid Diesel/Elektro">
                Mild-Hybrid Diesel/Elektro
              </option>

              <option value="Plug-in-Hybrid Benzin/Elektro">
                Plug-in-Hybrid Benzin/Elektro
              </option>

              <option value="Plug-in-Hybrid Diesel/Elektro">
                Plug-in-Hybrid Diesel/Elektro
              </option>

              <option value="Voll-Hybrid Benzin/Elektro">
                Voll-Hybrid Benzin/Elektro
              </option>

              <option value="Voll-Hybrid Diesel/Elektro">
                Voll-Hybrid Diesel/Elektro
              </option>

              <option value="Wasserstoff">Wasserstoff</option>
            </select>
          </div>

          <div class="field">
            <label>Fahrzeug Farbe</label>
            <input name="farbe" type="text" required />
          </div>

          <div class="field">
            <label>Innenfarbe</label>

            <select name="innenfarbe" required>
              <option value="">Auswählen</option>

              <option value="anthrazit">anthrazit</option>
              <option value="beige">beige</option>
              <option value="blau">blau</option>
              <option value="bordeaux">bordeaux</option>
              <option value="braun">braun</option>
              <option value="gelb">gelb</option>
              <option value="gold">gold</option>
              <option value="grau">grau</option>
              <option value="grün">grün</option>
              <option value="mehrfarbig">mehrfarbig</option>
              <option value="orange">orange</option>
              <option value="rosa">rosa</option>
              <option value="rot">rot</option>
              <option value="schwarz">schwarz</option>
              <option value="silber">silber</option>
              <option value="türkis">türkis</option>
              <option value="violett">violett</option>
              <option value="weiss">weiss</option>
              <option value="sonstiges">sonstiges</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Zustand -->
      <section class="form-section">
        <div class="section-title">
          <h2>Zustand</h2>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Fahrzeugzustand *</label>

            <select name="zustand" required>
              <option value="">Fahrzeugzustand auswählen</option>

              <option value="Neues Fahrzeug">Neues Fahrzeug</option>

              <option value="Neues Fahrzeug mit Tageszulassung">
                Neues Fahrzeug mit Tageszulassung
              </option>

              <option value="Occasion">Occasion</option>

              <option value="Oldtimer">Oldtimer</option>

              <option value="Vorführmodell">Vorführmodell</option>
            </select>
          </div>

          <div class="field">
            <label>Letzte MFK</label>
            <input name="mfk" type="date" />

            <label class="checkbox-field">
              <input type="checkbox" name="ab_mfk" />
              Ab MFK
            </label>
          </div>

          <div class="field">
            <label>Inverkehrsetzung *</label>
            <input name="inverkehrsetzung" type="date" />
          </div>

          <div class="field">
            <label>Kilometer *</label>
            <input name="kilometer" type="number" />
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <h2>Garantie</h2>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Garantie</label>

            <select name="garantie" bind:value={selectedGarantie} required>
              <option value=""> Garantie auswählen </option>

              <option value="Keine Garantie"> Keine Garantie </option>

              <option value="Ab Übernahme"> Ab Übernahme </option>

              <option value="Ab 1. Inverkehrsetzung">
                Ab 1. Inverkehrsetzung
              </option>

              <option value="Ab Datum"> Ab Datum </option>
            </select>
          </div>

          {#if selectedGarantie && selectedGarantie !== "Keine Garantie"}
            <div class="info-box full-width">
              <strong>Info</strong>
              <span>
                Bitte geben Sie entweder die Dauer der Garantie in Monaten oder
                die maximale Kilometerzahl an. Beide Angaben sind optional, aber
                mindestens eine davon sollte ausgefüllt werden, um potenziellen
                Käufern eine klare Vorstellung von den Garantiebedingungen zu
                vermitteln.
              </span>
            </div>

            {#if selectedGarantie === "Ab Datum"}
              <div class="field full-width">
                <label>Garantiebeginn</label>

                <input type="date" name="garantie_datum" />
              </div>
            {/if}

            {#if selectedGarantie !== "Keine Garantie"}
              <div class="field">
                <label>Dauer (Monate) *</label>

                <input type="number" name="garantie_monate" />
              </div>

              <div class="field">
                <label>max. KM</label>

                <input type="number" name="garantie_km" />
              </div>

              <div class="field full-width">
                <label>Beschreibung der Garantie</label>

                <textarea
                  name="garantie_beschreibung"
                  rows="5"
                  maxlength="100"
                  placeholder="Beschreibung der Garantie, wie z.B. Herstellergarantie. (Maximal 100 Zeichen)"
                ></textarea>
              </div>
            {/if}
          {/if}
        </div>
      </section>

      <!-- Preis -->
      <section class="form-section">
        <div class="section-title">
          <h2>Preis</h2>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Verkaufspreis - CHF *</label>
            <input name="preis" type="number" />
          </div>

          <div class="field">
            <label>Neupreis - CHF</label>
            <input name="neupreis" type="number" />
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <h2>Technische Daten</h2>
        </div>

        <div class="section-info">
          Bitte wählen Sie eine Treibstoffart. Dann können wir Ihnen mehr
          Informationen anzeigen.
        </div>

        <div class="technical-grid">
          <div>
            <div class="small-grid">
              <div class="field">
                <label>Türen</label>
                <input name="tueren" type="number" />
              </div>

              <div class="field">
                <label>Sitze</label>
                <input name="sitze" type="number" />
              </div>

              <div class="field">
                <label>PS</label>
                <input
                  name="leistung"
                  type="number"
                  bind:value={ps}
                  oninput={updateKw}
                />
              </div>

              <div class="field">
                <label>KW</label>
                <input
                  name="kw"
                  type="number"
                  bind:value={kw}
                  oninput={updatePs}
                />
              </div>

              <div class="field full-width">
                <label>Hubraum</label>
                <input name="hubraum" type="number" />
              </div>

              <div class="field full-width">
                <label>Radstand (mm)</label>
                <input name="radstand" type="number" />
              </div>

              <div class="field">
                <label>Leergewicht (kg)</label>
                <input name="leergewicht" type="number" />
              </div>

              <div class="field">
                <label>Nutzlast (kg)</label>
                <input name="nutzlast" type="number" />
              </div>

              <div class="field full-width">
                <label>Höhe (mm)</label>
                <input name="hoehe" type="number" />
              </div>

              <div class="field">
                <label>Breite (mm)</label>
                <input name="breite" type="number" />
              </div>

              <div class="field">
                <label>Länge (mm)</label>
                <input name="laenge" type="number" />
              </div>

              <div class="field full-width">
                <label>Anhängelast (kg) gebremst</label>
                <input name="anhaengelast" type="number" />
              </div>
            </div>
          </div>

          <div>
            <div class="field">
              <label>Energieetikette</label>
              <select name="energieetikette">
                <option value="">Energieetikette auswählen</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
              </select>
            </div>

            <div class="field">
              <label>Typengenehmigung</label>
              <input name="typengenehmigung" />
            </div>

            <div class="field">
              <label>Fahrgestellnummer</label>
              <input name="fahrgestellnummer" />
            </div>

            <div class="field">
              <label>Stammnummer</label>
              <input name="stammnummer" />
            </div>

            <div class="field">
              <label>Wagen-Nr.</label>
              <input name="wagen_nr" />
            </div>
          </div>
        </div>
      </section>

      <!-- Fahrzeugbeschrieb -->
      <section class="form-section">
        <div class="section-title">
          <h2>Fahrzeugbeschrieb</h2>
        </div>

        <div class="form-grid">
          <div class="field full-width">
            <label>Beschreibung</label>

            <textarea
              name="beschreibung"
              rows="10"
              placeholder="Beschreiben Sie das Fahrzeug..."
            ></textarea>
          </div>
        </div>
      </section>

      <!-- Bilder -->
      <section class="form-section">
        <div class="section-title">
          <h2>Bilder</h2>
        </div>

        <div class="field">
          <label>Fahrzeugbilder</label>

          <input name="images" type="file" accept="image/*" multiple />
        </div>
      </section>

      <div class="bottom-actions">
        <a href="/cars" class="back-btn">← Zurück</a>

        <div class="right-actions">
          <button type="submit" name="saveAs" value="entwurf" class="draft-btn">
            Entwurf
          </button>

          <button type="submit" name="saveAs" value="aktiv" class="create-btn">
            Create
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
