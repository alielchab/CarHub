<script>
    import Car from "$lib/components/Car.svelte";
    let {data} = $props();

</script>


<div class="container">
<p>Daten und Bilder generiert mit ChatGPT</p>
<a href="/cars/create" class="btn btn-primary">Add New Car</a>
<div class="row">
    {#each data.cars as car}
        <div class="col-md-3 margin">
            <Car {car}></Car>
        </div>
    {/each}
</div>
</div>