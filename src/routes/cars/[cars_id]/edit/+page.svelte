<script>
  import { tick, onMount } from "svelte";
  import {
    PUBLIC_CLOUDINARY_CLOUD_NAME,
    PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  } from "$env/static/public";

  let { data, form } = $props();

  const car = data.car;

  let makes = $state([]);
  let models = $state([]);

  let selectedMake = $state(car.marke ?? "");
  let selectedModel = $state(car.modell ?? "");
  let selectedGetriebe = $state(car.getriebe ?? "");
  let selectedArt = $state(car.art ?? "");
  let selectedGarantie = $state(car.garantie ?? "");

  let ps = $state(car.leistung ?? "");
  let kw = $state(car.kw ?? "");

  let formElement;
  let imageInput;

  let isSubmittingAfterUpload = $state(false);
  let isUploadingImages = $state(false);
  let uploadError = $state("");

  const maxImages = 30;

  let selectedImages = $state(
    (car.images ?? []).map((url) => ({
      type: "existing",
      url,
      preview: url,
      file: null,
      publicId: null,
    })),
  );

  let remainingImages = $derived(maxImages - selectedImages.length);

  async function loadMakes() {
    const res = await fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json",
    );

    const result = await res.json();

    makes = result.Results.map((make) => make.Make_Name).sort();
  }

  async function loadModels(resetModel = true) {
    if (resetModel) {
      selectedModel = "";
    }

    models = [];

    if (!selectedMake) return;

    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${selectedMake}?format=json`,
    );

    const result = await res.json();

    models = result.Results.map((model) => model.Model_Name).sort();
  }

  onMount(async () => {
    await loadMakes();
    await loadModels(false);
  });

  const getriebeArten = {
    Automat: ["Automat", "Stufenlos", "Halbautomatisches Getriebe"],
    Schaltung: ["Schaltgetriebe manuell"],
  };

  let availableArten = $derived(
    selectedGetriebe ? getriebeArten[selectedGetriebe] : [],
  );

  function updateKw() {
    if (!ps) {
      kw = "";
      return;
    }

    kw = Math.round(Number(ps) * 0.735499);
  }

  function updatePs() {
    if (!kw) {
      ps = "";
      return;
    }

    ps = Math.round(Number(kw) / 0.735499);
  }

  async function uploadImageToCloudinary(file) {
    const uploadData = new FormData();

    uploadData.append("file", file);
    uploadData.append("upload_preset", PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary error:", errorText);
      throw new Error("Cloudinary Upload fehlgeschlagen");
    }

    const result = await response.json();

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async function handleSubmit(event) {
    if (isSubmittingAfterUpload) {
      return;
    }

    event.preventDefault();

    uploadError = "";
    isUploadingImages = true;

    try {
      for (const image of selectedImages) {
        if (image.type === "new" && !image.url) {
          const uploaded = await uploadImageToCloudinary(image.file);

          image.url = uploaded.url;
          image.publicId = uploaded.publicId;
          image.preview = uploaded.url;
        }
      }

      selectedImages = [...selectedImages];

      await tick();

      isSubmittingAfterUpload = true;
      formElement.requestSubmit();
    } catch (error) {
      console.error(error);
      uploadError = "Bilder konnten nicht hochgeladen werden.";
      alert("Bilder konnten nicht hochgeladen werden.");
    } finally {
      isUploadingImages = false;
    }
  }

  function handleImageChange(event) {
    const files = Array.from(event.target.files);

    const availableSlots = maxImages - selectedImages.length;
    const filesToAdd = files.slice(0, availableSlots);

    const newImages = filesToAdd.map((file) => ({
      type: "new",
      file,
      preview: URL.createObjectURL(file),
      url: null,
      publicId: null,
    }));

    selectedImages = [...selectedImages, ...newImages];

    updateFileInput();
  }

  function removeImage(index) {
    const image = selectedImages[index];

    if (image.type === "new" && image.preview) {
      URL.revokeObjectURL(image.preview);
    }

    selectedImages = selectedImages.filter((_, i) => i !== index);

    updateFileInput();
  }

  function moveImageLeft(index) {
    if (index === 0) return;

    const copy = [...selectedImages];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];

    selectedImages = copy;
  }

  function moveImageRight(index) {
    if (index === selectedImages.length - 1) return;

    const copy = [...selectedImages];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];

    selectedImages = copy;
  }

  function updateFileInput() {
    if (!imageInput) return;

    imageInput.value = "";
  }
</script>

<div class="create-page">
  <div class="create-container">
    <div class="create-header">
      <h1>Fahrzeug bearbeiten</h1>
      <p>Bearbeite die gespeicherten Fahrzeugdaten.</p>
    </div>
    <form
      bind:this={formElement}
      method="POST"
      action="?/update"
      onsubmit={handleSubmit}
    >
      {#each selectedImages as image}
        {#if image.url}
          <input type="hidden" name="imageUrls" value={image.url} />
        {/if}
      {/each}

      {#if uploadError}
        <p class="error-message">{uploadError}</p>
      {/if}

      {#if isUploadingImages}
        <p>Bilder werden hochgeladen...</p>
      {/if}
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
              onchange={() => loadModels(true)}
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
            <input name="version" type="text" value={car.version || ""} />
          </div>

          <div class="field">
            <label>Aufbau *</label>
            <select name="aufbau" required>
              <option value="">Auswählen</option>
              <option value="Bus" selected={car.aufbau === "Bus"}>Bus</option>
              <option value="Cabriolet" selected={car.aufbau === "Cabriolet"}
                >Cabriolet</option
              >
              <option value="Coupé" selected={car.aufbau === "Coupé"}
                >Coupé</option
              >
              <option value="Kleinwagen" selected={car.aufbau === "Kleinwagen"}
                >Kleinwagen</option
              >
              <option value="Kombi" selected={car.aufbau === "Kombi"}
                >Kombi</option
              >
              <option
                value="Kompaktvan / Minivan"
                selected={car.aufbau === "Kompaktvan / Minivan"}
                >Kompaktvan / Minivan</option
              >
              <option value="Limousine" selected={car.aufbau === "Limousine"}
                >Limousine</option
              >
              <option value="Pick-up" selected={car.aufbau === "Pick-up"}
                >Pick-up</option
              >
              <option
                value="SUV / Geländewagen"
                selected={car.aufbau === "SUV / Geländewagen"}
                >SUV / Geländewagen</option
              >
              <option value="Van" selected={car.aufbau === "Van"}>Van</option>
              <option value="Wohnmobil" selected={car.aufbau === "Wohnmobil"}
                >Wohnmobil</option
              >
              <option
                value="Transporter"
                selected={car.aufbau === "Transporter"}>Transporter</option
              >
              <option value="Roadster" selected={car.aufbau === "Roadster"}
                >Roadster</option
              >
            </select>
          </div>

          <div class="field">
            <label>Antrieb</label>
            <select name="antrieb" required>
              <option value="">Auswählen</option>
              <option value="Allrad" selected={car.antrieb === "Allrad"}
                >Allrad</option
              >
              <option
                value="Hinterradantrieb"
                selected={car.antrieb === "Hinterradantrieb"}
                >Hinterradantrieb</option
              >
              <option
                value="Vorderradantrieb"
                selected={car.antrieb === "Vorderradantrieb"}
                >Vorderradantrieb</option
              >
            </select>
          </div>

          <div class="field">
            <label>Treibstoff</label>
            <select name="treibstoff" required>
              <option value="">Treibstoff auswählen</option>
              <option value="Benzin" selected={car.treibstoff === "Benzin"}
                >Benzin</option
              >
              <option
                value="Bioethanol/Benzin"
                selected={car.treibstoff === "Bioethanol/Benzin"}
                >Bioethanol/Benzin</option
              >
              <option value="Diesel" selected={car.treibstoff === "Diesel"}
                >Diesel</option
              >
              <option value="Elektro" selected={car.treibstoff === "Elektro"}
                >Elektro</option
              >
              <option
                value="Erdgas (CNG)/Benzin"
                selected={car.treibstoff === "Erdgas (CNG)/Benzin"}
                >Erdgas (CNG)/Benzin</option
              >
              <option
                value="Flüssiggas (LPG)/Benzin"
                selected={car.treibstoff === "Flüssiggas (LPG)/Benzin"}
                >Flüssiggas (LPG)/Benzin</option
              >
              <option
                value="Mild-Hybrid Benzin/Elektro"
                selected={car.treibstoff === "Mild-Hybrid Benzin/Elektro"}
                >Mild-Hybrid Benzin/Elektro</option
              >
              <option
                value="Mild-Hybrid Diesel/Elektro"
                selected={car.treibstoff === "Mild-Hybrid Diesel/Elektro"}
                >Mild-Hybrid Diesel/Elektro</option
              >
              <option
                value="Plug-in-Hybrid Benzin/Elektro"
                selected={car.treibstoff === "Plug-in-Hybrid Benzin/Elektro"}
                >Plug-in-Hybrid Benzin/Elektro</option
              >
              <option
                value="Plug-in-Hybrid Diesel/Elektro"
                selected={car.treibstoff === "Plug-in-Hybrid Diesel/Elektro"}
                >Plug-in-Hybrid Diesel/Elektro</option
              >
              <option
                value="Voll-Hybrid Benzin/Elektro"
                selected={car.treibstoff === "Voll-Hybrid Benzin/Elektro"}
                >Voll-Hybrid Benzin/Elektro</option
              >
              <option
                value="Voll-Hybrid Diesel/Elektro"
                selected={car.treibstoff === "Voll-Hybrid Diesel/Elektro"}
                >Voll-Hybrid Diesel/Elektro</option
              >
              <option
                value="Wasserstoff"
                selected={car.treibstoff === "Wasserstoff"}>Wasserstoff</option
              >
            </select>
          </div>

          <div class="field">
            <label>Fahrzeug Farbe</label>
            <input name="farbe" type="text" required value={car.farbe || ""} />
          </div>

          <div class="field">
            <label>Innenfarbe</label>
            <select name="innenfarbe" required>
              <option value="">Auswählen</option>
              <option
                value="anthrazit"
                selected={car.innenfarbe === "anthrazit"}>anthrazit</option
              >
              <option value="beige" selected={car.innenfarbe === "beige"}
                >beige</option
              >
              <option value="blau" selected={car.innenfarbe === "blau"}
                >blau</option
              >
              <option value="bordeaux" selected={car.innenfarbe === "bordeaux"}
                >bordeaux</option
              >
              <option value="braun" selected={car.innenfarbe === "braun"}
                >braun</option
              >
              <option value="gelb" selected={car.innenfarbe === "gelb"}
                >gelb</option
              >
              <option value="gold" selected={car.innenfarbe === "gold"}
                >gold</option
              >
              <option value="grau" selected={car.innenfarbe === "grau"}
                >grau</option
              >
              <option value="grün" selected={car.innenfarbe === "grün"}
                >grün</option
              >
              <option
                value="mehrfarbig"
                selected={car.innenfarbe === "mehrfarbig"}>mehrfarbig</option
              >
              <option value="orange" selected={car.innenfarbe === "orange"}
                >orange</option
              >
              <option value="rosa" selected={car.innenfarbe === "rosa"}
                >rosa</option
              >
              <option value="rot" selected={car.innenfarbe === "rot"}
                >rot</option
              >
              <option value="schwarz" selected={car.innenfarbe === "schwarz"}
                >schwarz</option
              >
              <option value="silber" selected={car.innenfarbe === "silber"}
                >silber</option
              >
              <option value="türkis" selected={car.innenfarbe === "türkis"}
                >türkis</option
              >
              <option value="violett" selected={car.innenfarbe === "violett"}
                >violett</option
              >
              <option value="weiss" selected={car.innenfarbe === "weiss"}
                >weiss</option
              >
              <option
                value="sonstiges"
                selected={car.innenfarbe === "sonstiges"}>sonstiges</option
              >
            </select>
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <h2>Zustand</h2>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Fahrzeugzustand *</label>
            <select name="zustand" required>
              <option value="">Fahrzeugzustand auswählen</option>
              <option
                value="Neues Fahrzeug"
                selected={car.zustand === "Neues Fahrzeug"}
                >Neues Fahrzeug</option
              >
              <option
                value="Neues Fahrzeug mit Tageszulassung"
                selected={car.zustand === "Neues Fahrzeug mit Tageszulassung"}
                >Neues Fahrzeug mit Tageszulassung</option
              >
              <option value="Occasion" selected={car.zustand === "Occasion"}
                >Occasion</option
              >
              <option value="Oldtimer" selected={car.zustand === "Oldtimer"}
                >Oldtimer</option
              >
              <option
                value="Vorführmodell"
                selected={car.zustand === "Vorführmodell"}>Vorführmodell</option
              >
            </select>
          </div>

          <div class="field">
            <label>Letzte MFK</label>
            <input name="mfk" type="date" value={car.mfk || ""} />

            <label class="checkbox-field">
              <input type="checkbox" name="ab_mfk" checked={car.ab_mfk} />
              Ab MFK
            </label>
          </div>

          <div class="field">
            <label>Inverkehrsetzung *</label>
            <input
              name="inverkehrsetzung"
              type="date"
              value={car.inverkehrsetzung || ""}
            />
          </div>

          <div class="field">
            <label>Kilometer *</label>
            <input name="kilometer" type="number" value={car.kilometer || ""} />
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
              <option value="">Garantie auswählen</option>
              <option value="Keine Garantie">Keine Garantie</option>
              <option value="Ab Übernahme">Ab Übernahme</option>
              <option value="Ab 1. Inverkehrsetzung"
                >Ab 1. Inverkehrsetzung</option
              >
              <option value="Ab Datum">Ab Datum</option>
            </select>
          </div>

          {#if selectedGarantie && selectedGarantie !== "Keine Garantie"}
            <div class="info-box full-width">
              <strong>Info</strong>
              <span>
                Bitte geben Sie entweder die Dauer der Garantie in Monaten oder
                die maximale Kilometerzahl an.
              </span>
            </div>

            {#if selectedGarantie === "Ab Datum"}
              <div class="field full-width">
                <label>Garantiebeginn</label>
                <input
                  type="date"
                  name="garantie_datum"
                  value={car.garantie_datum || ""}
                />
              </div>
            {/if}

            <div class="field">
              <label>Dauer (Monate) *</label>
              <input
                type="number"
                name="garantie_monate"
                value={car.garantie_monate || ""}
              />
            </div>

            <div class="field">
              <label>max. KM</label>
              <input
                type="number"
                name="garantie_km"
                value={car.garantie_km || ""}
              />
            </div>

            <div class="field full-width">
              <label>Beschreibung der Garantie</label>
              <textarea
                name="garantie_beschreibung"
                rows="5"
                maxlength="100"
                placeholder="Beschreibung der Garantie, wie z.B. Herstellergarantie. (Maximal 100 Zeichen)"
                >{car.garantie_beschreibung || ""}</textarea
              >
            </div>
          {/if}
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <h2>Preis</h2>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Verkaufspreis - CHF *</label>
            <input
              name="preis"
              type="number"
              required
              value={car.preis || ""}
            />
          </div>

          <div class="field">
            <label>Neupreis - CHF</label>
            <input name="neupreis" type="number" value={car.neupreis || ""} />
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
                <input name="tueren" type="number" value={car.tueren || ""} />
              </div>

              <div class="field">
                <label>Sitze</label>
                <input name="sitze" type="number" value={car.sitze || ""} />
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
                <input name="hubraum" type="number" value={car.hubraum || ""} />
              </div>

              <div class="field full-width">
                <label>Radstand (mm)</label>
                <input
                  name="radstand"
                  type="number"
                  value={car.radstand || ""}
                />
              </div>

              <div class="field">
                <label>Leergewicht (kg)</label>
                <input
                  name="leergewicht"
                  type="number"
                  value={car.leergewicht || ""}
                />
              </div>

              <div class="field">
                <label>Nutzlast (kg)</label>
                <input
                  name="nutzlast"
                  type="number"
                  value={car.nutzlast || ""}
                />
              </div>

              <div class="field full-width">
                <label>Höhe (mm)</label>
                <input name="hoehe" type="number" value={car.hoehe || ""} />
              </div>

              <div class="field">
                <label>Breite (mm)</label>
                <input name="breite" type="number" value={car.breite || ""} />
              </div>

              <div class="field">
                <label>Länge (mm)</label>
                <input name="laenge" type="number" value={car.laenge || ""} />
              </div>

              <div class="field full-width">
                <label>Anhängelast (kg) gebremst</label>
                <input
                  name="anhaengelast"
                  type="number"
                  value={car.anhaengelast || ""}
                />
              </div>
            </div>
          </div>

          <div>
            <div class="field">
              <label>Energieetikette</label>
              <select name="energieetikette">
                <option value="">Energieetikette auswählen</option>
                <option value="A" selected={car.energieetikette === "A"}
                  >A</option
                >
                <option value="B" selected={car.energieetikette === "B"}
                  >B</option
                >
                <option value="C" selected={car.energieetikette === "C"}
                  >C</option
                >
                <option value="D" selected={car.energieetikette === "D"}
                  >D</option
                >
                <option value="E" selected={car.energieetikette === "E"}
                  >E</option
                >
                <option value="F" selected={car.energieetikette === "F"}
                  >F</option
                >
                <option value="G" selected={car.energieetikette === "G"}
                  >G</option
                >
              </select>
            </div>

            <div class="field">
              <label>Typengenehmigung</label>
              <input
                name="typengenehmigung"
                value={car.typengenehmigung || ""}
              />
            </div>

            <div class="field">
              <label>Fahrgestellnummer</label>
              <input
                name="fahrgestellnummer"
                value={car.fahrgestellnummer || ""}
              />
            </div>

            <div class="field">
              <label>Stammnummer</label>
              <input name="stammnummer" value={car.stammnummer || ""} />
            </div>

            <div class="field">
              <label>Wagen-Nr.</label>
              <input name="wagen_nr" value={car.wagen_nr || ""} />
            </div>
          </div>
        </div>
      </section>

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
              >{car.beschreibung || ""}</textarea
            >
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <h2>Bilder</h2>
        </div>

        <div class="image-upload-box">
          <div class="upload-header">
            <div>
              <strong>Fahrzeugbilder</strong>
              <p>{remainingImages} Bilder verfügbar</p>
            </div>

            <label
              class:disabled-upload={remainingImages === 0}
              class="upload-btn"
            >
              + Bilder hinzufügen

              <input
                bind:this={imageInput}
                type="file"
                accept="image/*"
                multiple
                disabled={remainingImages === 0}
                onchange={handleImageChange}
                hidden
              />
            </label>
          </div>

          {#if selectedImages.length > 0}
            <div class="image-preview-grid">
              {#each selectedImages as image, index}
                <div class="image-preview-card">
                  {#if index === 0}
                    <span class="main-image-badge">Hauptbild</span>
                  {/if}

                  <img src={image.preview} alt="Preview" />

                  <div class="image-actions">
                    <button
                      type="button"
                      onclick={() => moveImageLeft(index)}
                      disabled={index === 0}
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onclick={() => moveImageRight(index)}
                      disabled={index === selectedImages.length - 1}
                    >
                      →
                    </button>

                    <button
                      type="button"
                      class="remove-image-btn"
                      onclick={() => removeImage(index)}
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="empty-upload">Noch keine Bilder ausgewählt.</div>
          {/if}
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <h2>In welchen Inventor speichern</h2>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Inventor</label>
            <select name="inventor" required>
              <option value="">Inventor auswählen</option>
              <option
                value="Inventor A"
                selected={car.inventor === "Inventor A"}
              >
                Inventor A
              </option>
              <option
                value="Inventor B"
                selected={car.inventor === "Inventor B"}
              >
                Inventor B
              </option>
            </select>
          </div>
        </div>
      </section>

      {#if form?.error}
        <p class="text-danger">{form.error}</p>
      {/if}

      <div class="bottom-actions">
        <a href="/cars/" class="back-btn">← Zurück</a>

        <div class="right-actions">
          <button type="submit" class="create-btn" disabled={isUploadingImages}>
            Speichern
          </button>
        </div>
      </div>
    </form>
  </div>
</div>
