<script>
    let {from} = $props();
</script>


<div class="container">
  <a href="/cars">Back</a>
  <h1>Add a Car</h1>
  <form method="POST" action="?/create" enctype="multipart/form-data">
    <div class="mb-3">
        <label for="" class="form-label">Marke</label>
        <input name="marke" type="text" class="form-control" placeholder="Marke" />
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Modell</label>
        <input name="modell" type="text" class="form-control" placeholder="Modell" />
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Baujahr</label>
        <input name="baujahr" type="text" class="form-control" placeholder="Baujahr" />
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Leistung</label>
        <input name="leistung" type="text" class="form-control" placeholder="Leistung" />
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Preis</label>
        <input name="preis" type="text" class="form-control" placeholder="Preis" />
      </div>
      <div class="mb-3">
        <label for="" class="form-label">Bilder</label>
        <input name="images" type="file" class="form-control" accept="image/*" multiple/>
      </div>

      {#if from?.error}
        <p class="text-danger">{from.error}</p>
      {/if}

      <button type="submit" class="btn btn-primary">Add a Car</button>
  </form>
</div>

