<script>
    let { car } = $props(); 
</script>


<a class="link" href={"cars/" + car._id}>
    <img src={car.bild} alt="" class="card-image">
    <div class="car">
        <div class="carPara"><b>{car.marke}</b></div>
        <div class="carPara">{car.modell}</div>
        <div class="carPara">{car.baujahr}</div>
        <div class="carPara">{car.leistung} </div>
        <div class="carPara">{car.preis}</div>
    </div>
</a>