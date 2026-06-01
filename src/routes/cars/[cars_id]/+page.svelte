<script>
  let { data } = $props();

  const car = data.car ?? data;

  const images = car.images ?? [];

  let selectedImage = $state(car.mainImage ?? images[0] ?? "");
  let galleryOpen = $state(false);
  let galleryIndex = $state(0);

  function openGallery(index) {
    galleryIndex = index;
    selectedImage = images[index];
    galleryOpen = true;
  }

  function closeGallery() {
    galleryOpen = false;
  }

  function nextImage() {
    if (images.length === 0) return;

    galleryIndex = (galleryIndex + 1) % images.length;
    selectedImage = images[galleryIndex];
  }

  function previousImage() {
    if (images.length === 0) return;

    galleryIndex = (galleryIndex - 1 + images.length) % images.length;
    selectedImage = images[galleryIndex];
  }

  function selectImage(index) {
    galleryIndex = index;
    selectedImage = images[index];
  }

  function formatPrice(value) {
    if (!value) return "-";
    return new Intl.NumberFormat("de-CH").format(Number(value));
  }

  function formatDate(value) {
    if (!value) return "-";
    return value;
  }

  function yesNo(value) {
    return value ? "Ja" : "Nein";
  }
</script>

<div class="vehicle-detail-page">
  <div class="vehicle-detail-container">
    <a class="back-link" href={data.user ? "/cars" : "/fahrzeuge"}>
      ‹ zurück zur Übersicht
    </a>

    <div class="vehicle-header">
      <h1>
        {car.marke} {car.modell}
        {#if car.version}
          {car.version}
        {/if}
      </h1>

      {#if car.beschreibung}
        <p>{car.beschreibung}</p>
      {:else}
        <p>
          {car.marke} {car.modell}
          {car.aufbau ? `/ ${car.aufbau}` : ""}
          {car.ab_mfk ? "/ Ab MFK" : ""}
          {car.garantie && car.garantie !== "Keine Garantie" ? "/ Inklusive Garantie" : ""}
        </p>
      {/if}
    </div>

    <div class="detail-layout">
      <main class="gallery-section">
        <div class="main-image-box">
          {#if selectedImage}
            <button
              type="button"
              class="main-image-button"
              onclick={() => openGallery(galleryIndex)}
              aria-label="Galerie öffnen"
            >
              <img src={selectedImage} alt={`${car.marke} ${car.modell}`} />
            </button>
          {:else}
            <div class="no-image">Kein Bild vorhanden</div>
          {/if}
        </div>

        {#if images.length > 1}
          <div class="thumbnail-grid">
            {#each images as image, index}
              <button
                type="button"
                class:selected={index === galleryIndex}
                onclick={() => openGallery(index)}
                aria-label={`Bild ${index + 1} in Galerie öffnen`}
              >
                <img src={image} alt="Fahrzeugbild" />
              </button>
            {/each}
          </div>
        {/if}
      </main>

      <aside class="vehicle-data-card">
        <h2>Fahrzeugdaten</h2>

        <div class="data-row price-row">
          <span>Preis</span>
          <strong>CHF {formatPrice(car.preis)}.–</strong>
        </div>

        <div class="data-row">
          <span>Inverkehrsetzung</span>
          <strong>{formatDate(car.inverkehrsetzung)}</strong>
        </div>

        <div class="data-row">
          <span>Zustand</span>
          <strong>{car.zustand || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Aufbau</span>
          <strong>{car.aufbau || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Aussenfarbe</span>
          <strong>{car.farbe || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Innenfarbe</span>
          <strong>{car.innenfarbe || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Kilometer</span>
          <strong>{car.kilometer ? `${formatPrice(car.kilometer)} km` : "-"}</strong>
        </div>

        <div class="data-row">
          <span>Getriebeart</span>
          <strong>{car.getriebe || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Getriebe</span>
          <strong>{car.art || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Antriebsart</span>
          <strong>{car.antrieb || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Treibstoff</span>
          <strong>{car.treibstoff || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Türen</span>
          <strong>{car.tueren || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Sitze</span>
          <strong>{car.sitze || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Hubraum</span>
          <strong>{car.hubraum ? `${car.hubraum} cm³` : "-"}</strong>
        </div>

        <div class="data-row">
          <span>PS</span>
          <strong>{car.leistung || "-"}</strong>
        </div>

        <div class="data-row">
          <span>KW</span>
          <strong>{car.kw || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Leergewicht</span>
          <strong>{car.leergewicht ? `${car.leergewicht} kg` : "-"}</strong>
        </div>

        <div class="data-row">
          <span>Ab MFK</span>
          <strong>{yesNo(car.ab_mfk)}</strong>
        </div>

        <div class="data-row">
          <span>Letzte MFK</span>
          <strong>{car.mfk || "-"}</strong>
        </div>

        <div class="data-row">
          <span>Garantie</span>
          <strong>{car.garantie || "-"}</strong>
        </div>

        {#if car.garantie && car.garantie !== "Keine Garantie"}
          <div class="data-row">
            <span>Garantie Monate</span>
            <strong>{car.garantie_monate || "-"}</strong>
          </div>

          <div class="data-row">
            <span>Garantie KM</span>
            <strong>{car.garantie_km || "-"}</strong>
          </div>
        {/if}

        <div class="equipment-section">
          <h2>Ausstattung</h2>

          {#if car.beschreibung}
            <p>{car.beschreibung}</p>
          {:else}
            <p>Keine zusätzliche Beschreibung vorhanden.</p>
          {/if}
        </div>
      </aside>
    </div>
  </div>
</div>


{#if galleryOpen}
  <div class="gallery-overlay">
    <button
      type="button"
      class="gallery-backdrop"
      onclick={closeGallery}
      aria-label="Galerie schließen"
    ></button>

    <button
      type="button"
      class="gallery-close"
      onclick={closeGallery}
      aria-label="Galerie schließen"
    >
      ×
    </button>

    {#if images.length > 1}
      <button
        type="button"
        class="gallery-arrow gallery-arrow-left"
        onclick={previousImage}
        aria-label="Vorheriges Bild"
      >
        ‹
      </button>

      <button
        type="button"
        class="gallery-arrow gallery-arrow-right"
        onclick={nextImage}
        aria-label="Nächstes Bild"
      >
        ›
      </button>
    {/if}

    <div class="gallery-image-wrap">
      <img
        src={images[galleryIndex]}
        alt={`${car.marke} ${car.modell}`}
        class="gallery-image"
      />

      <div class="gallery-counter">
        {galleryIndex + 1} / {images.length}
      </div>
    </div>
  </div>
{/if}