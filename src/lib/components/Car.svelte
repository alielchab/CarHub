<script>
    let { car } = $props();
</script>

<div class="car-row">
    <div>
        <input type="checkbox" />
    </div>

    <div class="car-main">
        <img src={car.mainImage} alt={car.marke} width="100" height="100" />

        <div>
            <span class="badge">1 DAY</span>

            <h3>{car.marke} {car.modell}</h3>

            
            <div class="actions">
                <a href={"cars/" + car._id}>Deactivate</a>
                <a href={"cars/" + car._id}>Top Listing</a>
                <a href={"cars/" + car._id}>View vehicle</a>
                <a href={"cars/" + car._id + "/edit"}>Edit data</a>
                <a href={"cars/" + car._id}>Sold</a>

                <form method="POST" action="?/delete">
                    <input type="hidden" name="id" value={car._id} />
                    <button type="submit">Remove</button>
                </form>
            </div>
        </div>
    </div>

    <div>{car.baujahr}</div>
    <div>{car.preis}.-</div>
    <div>{car.kilometer || "-"}</div>
    <div>{car.views || "-"}</div>

    <button class="plus-btn">+</button>
</div>
