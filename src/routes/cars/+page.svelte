<script>
  import Car from "$lib/components/Car.svelte";
  let { data } = $props();
  let showMoreFilters = $state(false);

  let selectedMarke = $state("");
  let selectedModell = $state("");
  let selectedTreibstoff = $state("");
  let selectedZustand = $state("");
  let selectedAufbau = $state("");
  let selectedFarbe = $state("");
  let selectedGetriebe = $state("");
  let selectedAntrieb = $state("");
  let selectedStatus = $state("aktiv");
  let selectedSort = $state("createdAt_desc");

  function countValues(cars, field) {
    const counts = {};

    for (const car of cars) {
      const value = car[field];

      if (!value) continue;

      counts[value] = (counts[value] || 0) + 1;
    }

    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }

  let carsByStatus = $derived(
    data.cars.filter((car) => {
      if (selectedStatus === "toplisting") {
        return car.status === "aktiv" && car.topListing === true;
      }

      return car.status === selectedStatus;
    }),
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
    return carsByStatus.filter((car) => carMatchesFilters(car, ignore));
  }

  let filteredCars = $derived(
    carsByStatus.filter((car) => carMatchesFilters(car)),
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

  let activeCount = $derived(
    data.cars.filter((car) => car.status === "aktiv").length,
  );

  let inactiveCount = $derived(
    data.cars.filter((car) => car.status === "inaktiv").length,
  );

  let draftCount = $derived(
    data.cars.filter((car) => car.status === "entwurf").length,
  );

  let removedCount = $derived(
    data.cars.filter((car) => car.status === "entfernt").length,
  );

  let toplisting = $derived(
    data.cars.filter((car) => car.status === "aktiv" && car.topListing === true)
      .length,
  );

  let sold = $derived(
    data.cars.filter((car) => car.status === "verkauft").length,
  );

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
</script>

<div class="garage-page">
  <div class="garage-card">
    <div class="garage-header">
      <div>
        <h1>Meine Fahrzeuge verwalten</h1>
        <p>Übersicht aller Fahrzeuge in Ihrer virtuellen Garage.</p>
      </div>

      <a href="/cars/create" class="add-btn">+ Neues Fahrzeug hinzufügen</a>
    </div>

    <div class="info-box">
      <strong>Info</strong>
      <span>Verwalten Sie hier Ihre Fahrzeuge.</span>
    </div>

    <div class="filters-wrapper">
      <h2>Filtern und Suchoptionen</h2>

      <!-- Erste Reihe -->
      <div class="filters-grid">
        <select
          bind:value={selectedMarke}
          onchange={() => (selectedModell = "")}
        >
          <option selected disabled value="">Marke</option>
          {#each marken as [value, count]}
            <option {value}>{value} ({count})</option>
          {/each}
        </select>

        <select bind:value={selectedModell} disabled={!selectedMarke}>
          <option selected disabled value="">
            {selectedMarke ? "Modell" : "Zuerst Marke auswählen"}
          </option>
          {#each modelle as [value, count]}
            <option {value}>{value} ({count})</option>
          {/each}
        </select>

        <select bind:value={selectedTreibstoff}>
          <option selected disabled value="">Treibstoff</option>
          {#each treibstoffe as [value, count]}
            <option {value}>{value} ({count})</option>
          {/each}
        </select>

        <button
          type="button"
          class="filter-btn"
          onclick={() => (showMoreFilters = !showMoreFilters)}
        >
          {showMoreFilters ? "Weniger Filter" : "Mehr Filter"}
        </button>
      </div>

      <!-- Erweiterte Filter -->
      {#if showMoreFilters}
        <div class="filters-grid extra-filters">
          <select bind:value={selectedZustand}>
            <option selected disabled value="">Fahrzeugzustand</option>
            {#each zustaende as [value, count]}
              <option {value}>{value} ({count})</option>
            {/each}
          </select>

          <select bind:value={selectedAufbau}>
            <option selected disabled value="">Aufbau</option>
            {#each aufbauten as [value, count]}
              <option {value}>{value} ({count})</option>
            {/each}
          </select>

          <select bind:value={selectedFarbe}>
            <option selected disabled value="">Fahrzeugfarbe</option>
            {#each farben as [value, count]}
              <option {value}>{value} ({count})</option>
            {/each}
          </select>

          <select bind:value={selectedGetriebe}>
            <option selected disabled value="">Getriebeart</option>
            {#each getriebe as [value, count]}
              <option {value}>{value} ({count})</option>
            {/each}
          </select>

          <select bind:value={selectedAntrieb}>
            <option selected disabled value="">Antrieb</option>
            {#each antriebe as [value, count]}
              <option {value}>{value} ({count})</option>
            {/each}
          </select>
        </div>
      {/if}

      <!-- Status -->
      <div class="status-bar">
        <div class="status-left">
          <strong>Status:</strong>

          <label>
            <input type="radio" bind:group={selectedStatus} value="aktiv" />
            Aktiv ({activeCount})
          </label>

          <label>
            <input type="radio" bind:group={selectedStatus} value="inaktiv" />
            Inaktiv ({inactiveCount})
          </label>

          <label>
            <input type="radio" bind:group={selectedStatus} value="entwurf" />
            Entwurf ({draftCount})
          </label>

          <label>
            <input
              type="radio"
              bind:group={selectedStatus}
              value="toplisting"
            />
            Top Listing ({toplisting})
          </label>

          <label>
            <input type="radio" bind:group={selectedStatus} value="entfernt" />
            Entfernt ({removedCount})
          </label>

          <label>
            <input type="radio" bind:group={selectedStatus} value="verkauft" />
            Verkauft ({sold})
          </label>
        </div>

        <div class="status-right">
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
      </div>
    </div>

    <div class="table-header">
      <span></span>
      <span>Marke und Model</span>
      <span>Jahr</span>
      <span>CHF</span>
      <span>KM</span>
      <span>Views</span>
      <span></span>
    </div>

    {#each sortedCars as car}
      <Car {car}></Car>
    {/each}
  </div>
</div>
