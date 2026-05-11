<script>
    let { car } = $props();
</script>

<div class="car-row">
    

    <div class="car-main">
        <img src={car.mainImage} alt={car.marke} width="100" height="100" />

        <div>
            <span class="badge">1 DAY</span>

            <h3>{car.marke} {car.modell}</h3>

            
          
        </div>
    </div>

    <div>{car.inverkehrsetzung}</div>
    <div>{car.preis}.-</div>
    <div>{car.kilometer || "-"}</div>
    <div>{car.views || "-"}</div>

    
</div>
