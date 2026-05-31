<script>
import Car from "$lib/components/CarInventor.svelte";
    let { data } = $props();

</script>

<h1>top listing</h1>

{#each data.cars.filter(car => car.topListing) as car}
  <Car {car} />
{/each}