<script>
   let { data } = $props();

//   let currentIndex = $state(0);

//   const next = () => {
//     currentIndex = (currentIndex + 1) % data.car.images.length;
//   };

//   const prev = () => {
//     currentIndex =
//       (currentIndex - 1 + data.car.images.length) % data.car.images.length;
//   };
</script>
<!-- 
<div class="container">
    <a href="/cars">Back</a>
    <h1>{data.marke}</h1>   

    {#if data.car.images?.length}
  <div class="gallery">
    <button on:click={prev}>‹</button>

    <img
      src={data.car.images[currentIndex]}
      alt={`${data.car.marke} ${data.car.modell}`}
      class="main-image"
    />

    <button on:click={next}>›</button>
  </div>

  <p>{currentIndex + 1} / {data.car.images.length}</p>
{/if}

    
    <div>Baujahr: {data.baujahr}</div>
    <div>Leistung: {data.leistung}</div>
    <div>Preis: {data.preis}</div>
    
    <form method="POST" action="?/delete">
        <button class="btn btn-danger">Delete Car</button>
    </form>
</div> -->


<style>
  .gallery {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .main-image {
    max-width: 700px;
    width: 100%;
    height: 450px;
    object-fit: cover;
    border-radius: 12px;
  }

  button {
    font-size: 2rem;
  }
</style>