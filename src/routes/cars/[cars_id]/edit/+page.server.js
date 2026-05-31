import db from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';
import { getStore } from '@netlify/blobs';
import path from 'node:path';
import crypto from 'node:crypto';

export async function load({ locals, params }) {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const car = await db.getCar(params.id);

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

    const imageOrder = data.getAll('imageOrder').map(String);

    const files = data
      .getAll('images')
      .filter((file) => file && file.name && file.size > 0);

    const uploads = getStore('car-images');
    const uploadedImagePaths = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return fail(400, { error: 'Es sind nur Bilder erlaubt' });
      }

      const extension = path.extname(file.name).toLowerCase() || '.jpg';
      const key = `cars/${crypto.randomUUID()}${extension}`;

      const arrayBuffer = await file.arrayBuffer();

      await uploads.set(key, arrayBuffer, {
        metadata: {
          contentType: file.type,
          originalName: file.name
        }
      });

      uploadedImagePaths.push(`/api/images/${key}`);
    }

    let newImageIndex = 0;
    const finalImages = [];

    for (const item of imageOrder) {
      if (item.startsWith('existing:')) {
        finalImages.push(item.slice('existing:'.length));
      }

      if (item === 'new') {
        const uploadedImage = uploadedImagePaths[newImageIndex];

        if (uploadedImage) {
          finalImages.push(uploadedImage);
          newImageIndex++;
        }
      }
    }

    const updatedCar = {
      _id: params.id,

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

      images: finalImages,
      mainImage: finalImages[0] ?? null,

      inventor: data.get('inventor'),
      updatedAt: new Date()
    };

    const result = await db.updateCar(updatedCar);

    if (!result) {
      return fail(500, {
        error: 'Auto konnte nicht aktualisiert werden.'
      });
    }

    throw redirect(303, `/cars/${params.id}`);
  }
};