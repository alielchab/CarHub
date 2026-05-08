import db from "$lib/db.js";

export async function load({ locals }) {
   if (!locals.user) {
    throw redirect(303, '/login');
  }
   
   
   
    return {
        cars: await db.getCars()
    }
}