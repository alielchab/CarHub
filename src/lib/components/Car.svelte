<script>
    let { car } = $props();
</script>

<div class="car-row">
    <div>
        <input type="checkbox" hidden />
    </div>

    <div class="car-main">
        <img src={car.mainImage} alt={car.marke} width="100" height="100" />

        <div>
            <span class="badge">1 DAY</span>

            <h3>{car.marke} {car.modell}</h3>

            <div class="car-actions">
                <!-- Action Aktiv -->
                {#if car.status === "aktiv" && !car.topListing}
                    <form method="POST" action="?/deactivate">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Deaktivieren</button>
                    </form>

                    <form method="POST" action="?/topListing">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Top Listing</button>
                    </form>

                    <a href="/cars/{car._id}">Vorschau</a>

                    <a href={`/cars/${car._id}/edit`}>Bearbeiten</a>

                    <form method="POST" action="?/sold">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Verkauft</button>
                    </form>

                    <form method="POST" action="?/remove">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Entfernen</button>
                    </form>
                {/if}

                <!-- Action Top Listing -->
                {#if car.status === "aktiv" && car.topListing}
                    <form method="POST" action="?/removeTopListing">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Von Top Listing entfernen</button>
                    </form>

                    <form method="POST" action="?/deactivate">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Deaktivieren</button>
                    </form>

                    <form method="POST" action="?/sold">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Verkauft</button>
                    </form>

                    <a href="/cars/{car._id}">Vorschau</a>

                    <a href="/cars/{car._id}/edit">Bearbeiten</a>

                    <form method="POST" action="?/remove">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Entfernen</button>
                    </form>
                {/if}

                <!-- Action Inaktiv -->
                {#if car.status === "inaktiv"}
                    <form method="POST" action="?/activate">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Aktivieren</button>
                    </form>

                    <a href="/cars/{car._id}">Vorschau</a>

                    <a href="/cars/{car._id}/edit">Bearbeiten</a>

                    <form method="POST" action="?/remove">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Entfernen</button>
                    </form>

                    <form method="POST" action="?/sold">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Verkauft</button>
                    </form>
                {/if}

                <!-- Action Entwurf -->
                {#if car.status === "entwurf"}
                    <form method="POST" action="?/activate">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Aktivieren</button>
                    </form>

                    <a href="/cars/{car._id}/edit">Bearbeiten</a>

                    <a href="/cars/{car._id}">Vorschau</a>

                    <form method="POST" action="?/remove">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Entfernen</button>
                    </form>
                {/if}

                <!-- Action Verkauft -->
                {#if car.status === "verkauft"}
                    <form method="POST" action="?/activate">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Aktivieren</button>
                    </form>

                    <a href="/cars/{car._id}">Vorschau</a>

                    <a href="/cars/{car._id}/edit">Bearbeiten</a>

                    <form method="POST" action="?/remove">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Entfernen</button>
                    </form>
                {/if}

                <!-- Action Entfernt -->
                {#if car.status === "entfernt"}
                    <form method="POST" action="?/deleteForever">
                        <input type="hidden" name="id" value={car._id} />
                        <button class="danger-btn"> Endgültig löschen </button>
                    </form>

                    <form method="POST" action="?/activate">
                        <input type="hidden" name="id" value={car._id} />
                        <button>Aktivieren</button>
                    </form>
                {/if}
            </div>
        </div>
    </div>

    <div>{car.inverkehrsetzung}</div>
    <div>{car.preis}.-</div>
    <div>{car.kilometer || "-"}</div>
    <div>{car.views || "-"}</div>
</div>
