<script>
  let { form } = $props();

  let makes = $state([]);
  let models = $state([]);

  let selectedMake = $state("");
  let selectedModel = $state("");
  let selectedGetriebe = $state("");
  let selectedArt = $state("");

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

  const getriebeArten = {
    Automat: ["Automat", "Stufenlos", "Halbautomatisches Getriebe"],
    Schaltung: ["Schaltgetriebe manuell"],
  };

  let availableArten = $derived(
    selectedGetriebe ? getriebeArten[selectedGetriebe] : [],
  );

  loadMakes();
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
            <select name="getriebe" bind:value={selectedGetriebe}>
              <option value="">Auswählen</option>
              <option value="Automat">Automat</option>
              <option value="Schaltung">Schaltung</option>
            </select>
          </div>

          <div class="field">
            <label>Art *</label>
            <select
              name="art"
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

          <div class="field full-width">
            <label>Version</label>
            <input name="version" type="text" />
          </div>

          <div class="field">
            <label>Aufbau *</label>

            <select name="aufbau">
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
            <select name="antrieb">
              <option>Auswählen</option>

              <option value="Bus">Allrad</option>
              <option value="Cabriolet">Hinterradantrieb</option>
              <option value="Coupé">Vorderradantrieb</option>
            </select>
          </div>

          <div class="field full-width">
            <label>Fahrzeug Farbe</label>
            <input name="farbe" type="text" />
          </div>

          <div class="field">
            <label>Innenfarbe</label>

            <select name="innenfarbe">
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

          <div class="field">
            <label>Treibstoff</label>

            <select name="treibstoff">
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

            <select name="zustand">
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
          </div>

          <div class="field">
            <label>Inverkehrsetzung *</label>
            <input name="inverkehrsetzung" type="date" />
          </div>

          <div class="field">
            <label>Garantie</label>
            <select name="garantie">
              <option>Keine Garantie</option>
            </select>
          </div>

          <div class="field">
            <label>Kilometer *</label>
            <input name="kilometer" type="number" />
          </div>
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

        <button type="submit" class="next-btn"> Create </button>
      </div>
    </form>
  </div>
</div>
