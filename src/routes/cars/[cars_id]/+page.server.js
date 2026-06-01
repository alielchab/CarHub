import db from "$lib/db.js";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const id = params.cars_id ?? params.id;

  const car = await db.incrementCarViews(id);

  if (!car) {
    throw error(404, "Fahrzeug nicht gefunden");
  }

  return {
    car
  };
}