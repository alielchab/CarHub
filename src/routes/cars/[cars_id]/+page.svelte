<script>
  let { data } = $props();

  let images = data.images || [];
  let mainImage = data.mainImage || images[0];

  let previewImages = images.slice(1, 5);
  let remainingImages = Math.max(images.length - 5, 0);
</script>

<div class="detail-page">
  <div class="detail-container">
    <div class="breadcrumb">
      <a href="/cars">← Back</a>
      <span>|</span>
      <span>{data.marke}</span>
      <span>›</span>
      <span>{data.modell}</span>
    </div>

    <section class="hero-gallery">
      <div class="main-photo">
        <img src={mainImage} alt="{data.marke} {data.modell}" />
      </div>

      <div class="side-photos">
        {#each previewImages as image, index}
          <div class="thumb">
            <img src={image} alt="Car image" />

            {#if index === previewImages.length - 1 && remainingImages > 0}
              <div class="image-overlay">+ {remainingImages} Images</div>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <section class="content-grid">
      <div class="left-content">
        <h1>{data.marke} {data.modell}</h1>

        <div class="spec-grid">
          <div class="spec-item">
            <span class="icon"></span>
            <span>{data.baujahr}</span>
          </div>

          <div class="spec-item">
            <span class="icon"></span>
            <span>{data.treibstoff || 'Diesel'}</span>
          </div>

          <div class="spec-item">
            <span class="icon"></span>
            <span>{data.kilometer || '-'} km</span>
          </div>

          <div class="spec-item">
            <span class="icon"></span>
            <span>{data.leistung} PS</span>
          </div>

          <div class="spec-item">
            <span class="icon"></span>
            <span>{data.getriebe || 'Automatic'}</span>
          </div>

          <div class="spec-item">
            <span class="icon"></span>
            <span>{data.karosserie || 'Box'}</span>
          </div>
        </div>

        <a class="show-data" href="#">↓ Show all vehicle data</a>

        <hr />

        
      </div>

      <aside class="right-card">
        <h2>CHF {data.preis}.-</h2>
        <button class="contact-btn">✉ Contact</button>
      </aside>
    </section>
  </div>
</div>

