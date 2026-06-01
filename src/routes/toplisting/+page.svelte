<script>
  import Car from "$lib/components/CarInventor.svelte";

  let { data } = $props();

  let selectedMarke = $state("");
  let selectedModell = $state("");
  let selectedTreibstoff = $state("");
  let selectedZustand = $state("");
  let selectedAufbau = $state("");
  let selectedFarbe = $state("");
  let selectedGetriebe = $state("");
  let selectedAntrieb = $state("");
  let selectedSort = $state("createdAt_desc");

  function countValues(cars, field) {
    const counts = {};

    for (const car of cars) {
      const value = car[field];

      if (!value) continue;

      counts[value] = (counts[value] || 0) + 1;
    }

    return Object.entries(counts).sort((a, b) =>
      a[0].localeCompare(b[0], "de", { sensitivity: "base" }),
    );
  }

  function toNumber(value) {
    const number = Number(value);
    return Number.isNaN(number) ? 0 : number;
  }

  function toDateTime(value) {
    if (!value) return 0;

    const time = new Date(value).getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  function compareText(a, b) {
    return String(a ?? "").localeCompare(String(b ?? ""), "de", {
      sensitivity: "base",
    });
  }

  let topListingCars = $derived(
    data.cars.filter(
      (car) => car.status === "aktiv" && car.topListing === true,
    ),
  );

  function carMatchesFilters(car, ignore = "") {
    return (
      (ignore === "marke" || !selectedMarke || car.marke === selectedMarke) &&
      (ignore === "modell" ||
        !selectedModell ||
        car.modell === selectedModell) &&
      (ignore === "treibstoff" ||
        !selectedTreibstoff ||
        car.treibstoff === selectedTreibstoff) &&
      (ignore === "zustand" ||
        !selectedZustand ||
        car.zustand === selectedZustand) &&
      (ignore === "aufbau" ||
        !selectedAufbau ||
        car.aufbau === selectedAufbau) &&
      (ignore === "farbe" || !selectedFarbe || car.farbe === selectedFarbe) &&
      (ignore === "getriebe" ||
        !selectedGetriebe ||
        car.getriebe === selectedGetriebe) &&
      (ignore === "antrieb" ||
        !selectedAntrieb ||
        car.antrieb === selectedAntrieb)
    );
  }

  function carsForFilterOptions(ignore) {
    return topListingCars.filter((car) => carMatchesFilters(car, ignore));
  }

  let filteredCars = $derived(
    topListingCars.filter((car) => carMatchesFilters(car)),
  );

  let marken = $derived(countValues(carsForFilterOptions("marke"), "marke"));

  let modelle = $derived(
    selectedMarke ? countValues(carsForFilterOptions("modell"), "modell") : [],
  );

  let treibstoffe = $derived(
    countValues(carsForFilterOptions("treibstoff"), "treibstoff"),
  );

  let zustaende = $derived(
    countValues(carsForFilterOptions("zustand"), "zustand"),
  );

  let aufbauten = $derived(
    countValues(carsForFilterOptions("aufbau"), "aufbau"),
  );

  let farben = $derived(countValues(carsForFilterOptions("farbe"), "farbe"));

  let getriebe = $derived(
    countValues(carsForFilterOptions("getriebe"), "getriebe"),
  );

  let antriebe = $derived(
    countValues(carsForFilterOptions("antrieb"), "antrieb"),
  );

  let sortedCars = $derived(
    [...filteredCars].sort((a, b) => {
      switch (selectedSort) {
        case "createdAt_asc":
          return toDateTime(a.createdAt) - toDateTime(b.createdAt);

        case "createdAt_desc":
          return toDateTime(b.createdAt) - toDateTime(a.createdAt);

        case "marke_asc":
          return compareText(a.marke, b.marke);

        case "marke_desc":
          return compareText(b.marke, a.marke);

        case "preis_asc":
          return toNumber(a.preis) - toNumber(b.preis);

        case "preis_desc":
          return toNumber(b.preis) - toNumber(a.preis);

        case "jahrgang_asc":
          return (
            toDateTime(a.inverkehrsetzung) - toDateTime(b.inverkehrsetzung)
          );

        case "jahrgang_desc":
          return (
            toDateTime(b.inverkehrsetzung) - toDateTime(a.inverkehrsetzung)
          );

        default:
          return toDateTime(b.createdAt) - toDateTime(a.createdAt);
      }
    }),
  );

  function resetFilters() {
    selectedMarke = "";
    selectedModell = "";
    selectedTreibstoff = "";
    selectedZustand = "";
    selectedAufbau = "";
    selectedFarbe = "";
    selectedGetriebe = "";
    selectedAntrieb = "";
    selectedSort = "createdAt_desc";
  }

  function handleMarkeChange() {
    selectedModell = "";
  }
</script>

<section class="public-filter-section">
  <div class="section-heading">
    <h1><span>UNSERE</span> TOP-LISTING FAHRZEUGE</h1>
    <div class="heading-line"></div>
  </div>

  <div class="public-filter-grid">
    <select bind:value={selectedMarke} onchange={() => (selectedModell = "")}>
      <option value="">Marke</option>
      {#each marken as [value, count]}
        <option {value}>{value} ({count})</option>
      {/each}
    </select>

    <select bind:value={selectedModell} disabled={!selectedMarke}>
      <option value="">
        {selectedMarke ? "Modell" : "Zuerst Marke auswählen"}
      </option>
      {#each modelle as [value, count]}
        <option {value}>{value} ({count})</option>
      {/each}
    </select>

    <select bind:value={selectedAufbau}>
      <option value="">Typ</option>
      {#each aufbauten as [value, count]}
        <option {value}>{value} ({count})</option>
      {/each}
    </select>

    <select bind:value={selectedZustand}>
      <option value="">Zustand</option>
      {#each zustaende as [value, count]}
        <option {value}>{value} ({count})</option>
      {/each}
    </select>

    <select bind:value={selectedGetriebe}>
      <option value="">Getriebe</option>
      {#each getriebe as [value, count]}
        <option {value}>{value} ({count})</option>
      {/each}
    </select>

    <select bind:value={selectedAntrieb}>
      <option value="">Antrieb</option>
      {#each antriebe as [value, count]}
        <option {value}>{value} ({count})</option>
      {/each}
    </select>

    <select bind:value={selectedTreibstoff}>
      <option value="">Treibstoff</option>
      {#each treibstoffe as [value, count]}
        <option {value}>{value} ({count})</option>
      {/each}
    </select>
  </div>

  <div class="filter-bottom">
    <div class="filter-actions-row">
      <button type="button" class="reset-btn" onclick={resetFilters}>
        ↻ Filter zurücksetzen
      </button>

      <select bind:value={selectedSort} class="sort-select">
        <option value="createdAt_desc">⇅ Neueste Inserate zuerst</option>
        <option value="createdAt_asc">⇅ Älteste Inserate zuerst</option>
        <option value="marke_asc">Marke A-Z</option>
        <option value="marke_desc">Marke Z-A</option>
        <option value="preis_asc">Preis niedrig bis hoch</option>
        <option value="preis_desc">Preis hoch bis niedrig</option>
        <option value="jahrgang_asc">Jahrgang alt bis neu</option>
        <option value="jahrgang_desc">Jahrgang neu bis alt</option>
      </select>
    </div>

    <div class="result-message">
      {#if sortedCars.length === 0}
        Momentan wurde noch kein Fahrzeug als Top-Listing markiert.
      {:else if sortedCars.length === 1}
        1 Fahrzeug gefunden
      {:else}
        {sortedCars.length} Fahrzeuge gefunden
      {/if}
    </div>
  </div>
</section>

<div class="inventory-list">
  {#each sortedCars as car}
    <Car {car} />
  {/each}
</div>
