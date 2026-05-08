import db from "$lib/db.js"


export async function load( {params, locals}) {
//    if(!locals.user) {
    
    
//     throw redirect(303, '/login');
//   }

   
   
const car = await db.getCar(params.cars_id);
    return car;

    
}