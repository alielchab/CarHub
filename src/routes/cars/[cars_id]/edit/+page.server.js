import db from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals, params }) {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  console.log('EDIT PARAMS:', params);
  console.log('CARS ID:', params.cars_id);

  const car = await db.getCar(params.cars_id);

  console.log('LOADED CAR:', car);

  if (!car) {
    throw redirect(303, '/cars');
  }

  return {
    car
  };
}
export const actions = {
  update: async ({ request, locals, params }) => {
    if (!locals.user) {
      throw redirect(303, '/login');
    }

    const data = await request.formData();

    const imageUrls = data.getAll('imageUrls').map(String).filter(Boolean);

    if (imageUrls.length > 30) {
      return fail(400, {
        error: 'Maximal 30 Bilder erlaubt.'
      });
    }

    const updatedCar = {
      _id: params.cars_id,

      marke: data.get('marke'),
      modell: data.get('modell'),
      getriebe: data.get('getriebe'),
      art: data.get('art'),
      version: data.get('version'),
      aufbau: data.get('aufbau'),
      antrieb: data.get('antrieb'),
      farbe: data.get('farbe'),
      innenfarbe: data.get('innenfarbe'),
      treibstoff: data.get('treibstoff'),

      zustand: data.get('zustand'),
      mfk: data.get('mfk'),
      ab_mfk: data.get('ab_mfk') ? true : false,
      inverkehrsetzung: data.get('inverkehrsetzung'),
      kilometer: data.get('kilometer'),

      garantie: data.get('garantie'),
      garantie_datum: data.get('garantie_datum'),
      garantie_monate: data.get('garantie_monate'),
      garantie_km: data.get('garantie_km'),
      garantie_beschreibung: data.get('garantie_beschreibung'),

      preis: data.get('preis'),
      neupreis: data.get('neupreis'),

      beschreibung: data.get('beschreibung'),

      leistung: data.get('leistung'),
      kw: data.get('kw'),
      tueren: data.get('tueren'),
      sitze: data.get('sitze'),
      hubraum: data.get('hubraum'),
      radstand: data.get('radstand'),
      leergewicht: data.get('leergewicht'),
      nutzlast: data.get('nutzlast'),
      hoehe: data.get('hoehe'),
      breite: data.get('breite'),
      laenge: data.get('laenge'),
      anhaengelast: data.get('anhaengelast'),

      energieetikette: data.get('energieetikette'),
      typengenehmigung: data.get('typengenehmigung'),
      fahrgestellnummer: data.get('fahrgestellnummer'),
      stammnummer: data.get('stammnummer'),
      wagen_nr: data.get('wagen_nr'),

      images: imageUrls,
      mainImage: imageUrls[0] ?? null,

      updatedAt: new Date()
    };

    const result = await db.updateCar(updatedCar);

    if (!result) {
      return fail(500, {
        error: 'Auto konnte nicht aktualisiert werden.'
      });
    }

    throw redirect(303, `/cars/${params.cars_id}`);
  }
};