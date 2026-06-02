<script>
  let { car } = $props();

  function formatNumber(value) {
    if (!value) return "-";
    return new Intl.NumberFormat("de-CH").format(Number(value));
  }
</script>

<div class="car-card">
  <img class="car-img" src={car.mainImage} alt={car.marke} />

  <div class="car-info">
    <h2>{car.marke} {car.modell} {car.version}</h2>

    <div class="car-grid">
      <p>⚡ {formatNumber(car.leistung) || "-"} PS</p>
      <p>🛣️ {formatNumber(car.kilometer)} km</p>
      <p>⚙️ {car.antrieb}</p>
      <p>📅 {car.inverkehrsetzung ? new Date(car.inverkehrsetzung).getFullYear() : "-"}</p>
      <p>⛽ {car.treibstoff}</p>
      <p>🔘 {car.getriebe}</p>
    </div>

    <p class="label">Preis</p>
    <p class="price">CHF {formatNumber(car.preis)}.-</p>

    <a href={`/cars/${car._id}`} data-sveltekit-preload-data="off"class="details">DETAILS</a>
  </div>
</div>
