<script>
    import Car from "$lib/components/Car.svelte";
    let {data} = $props();



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

    <h2>Filtering and search options</h2>

    <div class="filters">
      <select><option>Vehicle category</option></select>
      <select><option>Make</option></select>
      <select><option>Model</option></select>
      <button>More Filters</button>
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

    {#each data.cars as car}
       <Car {car}></Car>
    {/each}
  </div>
</div>
