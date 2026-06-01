<script>
  import { tick, onMount } from "svelte";
  import {
    PUBLIC_CLOUDINARY_CLOUD_NAME,
    PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  } from "$env/static/public";

  let { form } = $props();

  let formElement;
  let isSubmittingAfterUpload = $state(false);
  let clickedSaveAs = $state("aktiv");
  let uploadError = $state("");
  let isUploadingImages = $state(false);

  let makes = $state([]);
  let models = $state([]);

  let selectedMake = $state("");
  let selectedModel = $state("");

  let makeSearch = $state("");
  let modelSearch = $state("");

  let showMakeOptions = $state(false);
  let showModelOptions = $state(false);

  const maxDropdownResults = 80;

  let selectedGetriebe = $state("");
  let selectedArt = $state("");
  let selectedGarantie = $state("");
  let ps = $state("");
  let kw = $state("");

  let imageInput;
  let selectedImages = $state([]);
  const maxImages = 5;
  let remainingImages = $derived(maxImages - selectedImages.length);

  async function loadMakes() {
    const res = await fetch(
      "https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json",
    );

    const data = await res.json();

    makes = data.Results.map((make) => make.Make_Name).sort();
  }

  async function loadModels() {
    selectedModel = "";
    modelSearch = "";
    models = [];

    if (!selectedMake) return;

    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(selectedMake)}?format=json`,
    );

    const data = await res.json();

    models = data.Results.map((model) => model.Model_Name).sort();
  }

  let filteredMakes = $derived(
    makes
      .filter((make) =>
        make.toLowerCase().includes(makeSearch.trim().toLowerCase()),
      )
      .slice(0, maxDropdownResults),
  );

  let filteredModels = $derived(
    models
      .filter((model) =>
        model.toLowerCase().includes(modelSearch.trim().toLowerCase()),
      )
      .slice(0, maxDropdownResults),
  );

  function handleMakeTyping(event) {
    makeSearch = event.target.value;
    showMakeOptions = true;

    if (makeSearch !== selectedMake) {
      selectedMake = "";
      selectedModel = "";
      modelSearch = "";
      models = [];
    }
  }

  async function selectMake(make) {
    selectedMake = make;
    makeSearch = make;

    selectedModel = "";
    modelSearch = "";
    models = [];

    showMakeOptions = false;

    await loadModels();
  }

  function handleModelTyping(event) {
    modelSearch = event.target.value;
    showModelOptions = true;

    if (modelSearch !== selectedModel) {
      selectedModel = "";
    }
  }

  function selectModel(model) {
    selectedModel = model;
    modelSearch = model;
    showModelOptions = false;
  }

onMount(() => {
  loadMakes();
});

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
    if (!selectedMake) {
      alert("Bitte eine Marke aus der Liste auswählen.");
      return;
    }

    if (!selectedModel) {
      alert("Bitte ein Modell aus der Liste auswählen.");
      return;
    }

    uploadError = "";
    isUploadingImages = true;

    try {
      for (const image of selectedImages) {
        if (!image.url) {
          const uploaded = await uploadImageToCloudinary(image.file);

          image.url = uploaded.url;
          image.publicId = uploaded.publicId;
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

  //Image Section - Vorschau der ausgewählten Bilder und Begrenzung auf max. 30 Bilder
  const maxFileSize = 1.5 * 1024 * 1024; // 1.5 MB pro Bild
  const maxTotalSize = 4 * 1024 * 1024; // 4 MB total

  function handleImageChange(event) {
    const files = Array.from(event.target.files);

    const availableSlots = maxImages - selectedImages.length;
    const filesToAdd = files.slice(0, availableSlots);

    const newImages = filesToAdd.map((file) => {
      return {
        file,
        preview: URL.createObjectURL(file),
        url: null,
        publicId: null,
      };
    });

    selectedImages = [...selectedImages, ...newImages];

    updateFileInput();
  }

  function removeImage(index) {
    const image = selectedImages[index];

    if (image.preview) {
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

    updateFileInput();
  }

  function moveImageRight(index) {
    if (index === selectedImages.length - 1) return;

    const copy = [...selectedImages];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];

    selectedImages = copy;

    updateFileInput();
  }

  function updateFileInput() {
    if (!imageInput) return;

    imageInput.value = "";
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

    <form
      bind:this={formElement}
      method="POST"
      action="?/create"
      onsubmit={handleSubmit}
    >
      <input type="hidden" name="saveAs" value={clickedSaveAs} />

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

      <!-- Fahrzeug Merkmale -->
      <section class="form-section">
        <div class="section-title">
          <h2>Fahrzeug-Merkmale</h2>
        </div>

        <div class="form-grid">
          <div class="field">
            <label>Marke *</label>
            <div class="search-select">
              <input type="hidden" name="marke" value={selectedMake} />

              <input required
                type="text"
                placeholder="Marke suchen..."
                bind:value={makeSearch}
                oninput={handleMakeTyping}
                onfocus={() => (showMakeOptions = true)}
                onblur={() => setTimeout(() => (showMakeOptions = false), 150)}
                autocomplete="off"
                class="search-input"
              />

              {#if showMakeOptions}
                <div class="search-options">
                  {#if filteredMakes.length > 0}
                    {#each filteredMakes as make}
                      <button
                        type="button"
                        class:selected-option={make === selectedMake}
                        onclick={() => selectMake(make)}
                      >
                        {make}
                      </button>
                    {/each}
                  {:else}
                    <div class="no-options">Keine Marke gefunden</div>
                  {/if}
                </div>
              {/if}
            </div>
          </div>

          <div class="field">
            <label>Modell *</label>
            <div class="search-select">
              <input type="hidden" name="modell" value={selectedModel} />

              <input required
                type="text"
                placeholder={selectedMake
                  ? "Modell suchen..."
                  : "Zuerst Marke auswählen"}
                bind:value={modelSearch}
                oninput={handleModelTyping}
                onfocus={() => selectedMake && (showModelOptions = true)}
                onblur={() => setTimeout(() => (showModelOptions = false), 150)}
                autocomplete="off"
                class="search-input"
                disabled={!selectedMake}
              />

              {#if showModelOptions && selectedMake}
                <div class="search-options">
                  {#if filteredModels.length > 0}
                    {#each filteredModels as model}
                      <button
                        type="button"
                        class:selected-option={model === selectedModel}
                        onclick={() => selectModel(model)}
                      >
                        {model}
                      </button>
                    {/each}
                  {:else}
                    <div class="no-options">Kein Modell gefunden</div>
                  {/if}
                </div>
              {/if}
            </div>
          </div>

          <div class="field">
            <label>Getriebe *</label>
            <select name="getriebe" required bind:value={selectedGetriebe}>
              <option selected disabled value="">Auswählen</option>
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
              <option selected disabled value=""> 
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
              <option selected disabled value="">Auswählen</option>
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
            <label>Antrieb *</label>
            <select name="antrieb" required>
              <option selected disabled value="">Auswählen</option>

              <option value="Allrad">Allrad</option>
              <option value="Hinterradantrieb">Hinterradantrieb</option>
              <option value="Vorderradantrieb">Vorderradantrieb</option>
            </select>
          </div>

          <div class="field">
            <label>Treibstoff *</label>

            <select name="treibstoff" required>
              <option selected disabled value="">Treibstoff auswählen</option>

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
            <label>Fahrzeug Farbe *</label>
            <input name="farbe" type="text" required />
          </div>

          <div class="field">
            <label>Innenfarbe</label>

            <select name="innenfarbe" required>
              <option selected disabled value="">Auswählen</option>

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
              <option selected disabled value="">Fahrzeugzustand auswählen</option>

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
            <input required name="inverkehrsetzung" type="date" />
          </div>

          <div class="field">
            <label>Kilometer *</label>
            <input required name="kilometer" type="number" />
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
              <option selected disabled value=""> Garantie auswählen </option>

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
            <input required name="preis" type="number" />
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

      <div class="bottom-actions">
        <a href="/cars" class="back-btn">← Zurück</a>

        <div class="right-actions">
          <button
            type="submit"
            onclick={() => (clickedSaveAs = "entwurf")}
            class="draft-btn"
            disabled={isUploadingImages}
          >
            Entwurf
          </button>

          <button
            type="submit"
            onclick={() => (clickedSaveAs = "aktiv")}
            class="create-btn"
            disabled={isUploadingImages}
          >
            Create
          </button>
        </div>
      </div>
    </form>
  </div>
</div>

<!-- {#if form?.result}
  {form.result.message}
{/if} -->
