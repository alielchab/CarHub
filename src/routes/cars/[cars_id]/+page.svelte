<script>
    let { data } = $props();
</script>

<div class="container">
    <a href="/cars">Back</a>
    <h1>{data.marke}</h1>
    <img src={data.poster} alt="" width="250px" height="400px" />
    <div>Baujahr: {data.baujahr}</div>
    <div>Leistung: {data.leistung}</div>
    <div>Preis: {data.preis}</div>
    
    <form method="POST" action="?/delete">
        <button class="btn btn-danger">Delete Car</button>
    </form>
</div>