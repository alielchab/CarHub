import db from "$lib/db.js"


export async function load( {params}) {
    const car = await db.getCar(params.cars_id);

    return car;

    
}