<script>
import Car from "$lib/components/CarInventor.svelte";
    let { data } = $props();
</script>

<h1>All Inventors</h1>

   {#each data.cars as car}
      <Car {car}></Car>
    {/each}