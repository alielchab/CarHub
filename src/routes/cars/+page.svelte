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

  function countValues(cars, field) {
    const counts = {};

    for (const car of cars) {
      const value = car[field];

      if (!value) continue;

      counts[value] = (counts[value] || 0) + 1;
    }

    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }

  let marken = $derived(countValues(data.cars, "marke"));
  let treibstoffe = $derived(countValues(data.cars, "treibstoff"));
  let zustaende = $derived(countValues(data.cars, "zustand"));
  let aufbauten = $derived(countValues(data.cars, "aufbau"));
  let farben = $derived(countValues(data.cars, "farbe"));
  let getriebe = $derived(countValues(data.cars, "getriebe"));
  let antriebe = $derived(countValues(data.cars, "antrieb"));

  let modelle = $derived(
    countValues(
      selectedMarke
        ? data.cars.filter((car) => car.marke === selectedMarke)
        : [],
      "modell",
    ),
  );

  let filteredCars = $derived(
    data.cars.filter((car) => {
      return (
        (!selectedMarke || car.marke === selectedMarke) &&
        (!selectedModell || car.modell === selectedModell) &&
        (!selectedTreibstoff || car.treibstoff === selectedTreibstoff) &&
        (!selectedZustand || car.zustand === selectedZustand) &&
        (!selectedAufbau || car.aufbau === selectedAufbau) &&
        (!selectedFarbe || car.farbe === selectedFarbe) &&
        (!selectedGetriebe || car.getriebe === selectedGetriebe) &&
        (!selectedAntrieb || car.antrieb === selectedAntrieb)
      );
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
</script>

<div class="garage-page">
  <div class="garage-card">
    <div class="garage-header">
      <div>
        <h1>Manage vehicles</h1>
        <p>Overview of all vehicles in your virtual garage.</p>
      </div>

      <a href="/cars/create" class="add-btn">+ Add new vehicle</a>
    </div>

    <div class="info-box">
      <strong>Info</strong>
      <span>Manage your vehicles here.</span>
    </div>

    <div class="filters-wrapper">
      <h2>Filtern und Suchoptionen</h2>

      <!-- Erste Reihe -->
      <div class="filters-grid">
        <select
          bind:value={selectedMarke}
          onchange={() => (selectedModell = "")}
        >
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

        <select bind:value={selectedTreibstoff}>
          <option value="">Treibstoff</option>
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
            <option value="">Fahrzeugzustand</option>
            {#each zustaende as [value, count]}
              <option {value}>{value} ({count})</option>
            {/each}
          </select>

          <select bind:value={selectedAufbau}>
            <option value="">Aufbau</option>
            {#each aufbauten as [value, count]}
              <option {value}>{value} ({count})</option>
            {/each}
          </select>

          <select bind:value={selectedFarbe}>
            <option value="">Fahrzeugfarbe</option>
            {#each farben as [value, count]}
              <option {value}>{value} ({count})</option>
            {/each}
          </select>

          <select bind:value={selectedGetriebe}>
            <option value="">Getriebeart</option>
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
        </div>
      {/if}

      <!-- Status -->
      <div class="status-bar">
        <div class="status-left">
          <strong>Status:</strong>

          <label>
            <input type="radio" name="status" checked />
            Aktiv ({activeCount})
          </label>

          <label>
            <input type="radio" name="status" />
            Inaktiv ({inactiveCount})
          </label>

          <label>
            <input type="radio" name="status" />
            Entwurf ({draftCount})
          </label>

          <label>
            <input type="radio" name="status" />
            Entfernt ({removedCount})
          </label>
        </div>

        <div class="status-right">
          <button type="button" class="reset-btn" onclick={resetFilters}>
            ↻ Filter zurücksetzen
          </button>

          <button type="button" class="sort-btn">
            ⇅ Neueste Inserate zuerst
          </button>
        </div>
      </div>
    </div>

    <div class="table-header">
      <span></span>
      <span>Make and Model</span>
      <span>Year</span>
      <span>CHF</span>
      <span>KM</span>
      <span>Views</span>
      <span></span>
    </div>

    {#each filteredCars as car}
      <Car {car}></Car>
    {/each}
  </div>
</div>
