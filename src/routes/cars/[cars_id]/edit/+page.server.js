import db from '$lib/db.js';
import { redirect, fail } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function load({ params, locals }) {
  if (!locals.user) {
    throw redirect(303, '/login');
  }

  const car = await db.getCar(params.cars_id);

  return {
    car
  };
}

export const actions = {
  update: async ({ request, params, locals }) => {
    if (!locals.user) {
      throw redirect(303, '/login');
    }

    const data = await request.formData();
    let existingImages = [];

    try {
      existingImages = JSON.parse(data.get('existingImages') || '[]');
    } catch {
      existingImages = [];
    }

    const files = data
      .getAll('images')
      .filter((file) => file && file.name && file.size > 0);

    if (existingImages.length + files.length > 30) {
      return fail(400, { error: 'Maximal 30 Bilder erlaubt' });
    }

    const newImagePaths = [];

    await mkdir('static/images/uploads/cars', { recursive: true });

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return fail(400, { error: 'Es sind nur Bilder erlaubt' });
      }

      const extension = path.extname(file.name);
      const filename = `${crypto.randomUUID()}${extension}`;

      const savePath = `static/images/uploads/cars/${filename}`;
      const publicPath = `/images/uploads/cars/${filename}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(savePath, buffer);

      newImagePaths.push(publicPath);
    }

    const imagePaths = [...existingImages, ...newImagePaths];

    const car = {
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
      inverkehrssetzung: data.get('inverkehrssetzung'),
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

      images: imagePaths,
      mainImage: imagePaths[0] ?? null,

      inventor: data.get('inventor'),

      updatedAt: new Date()
    };

    const updatedId = await db.updateCar(car);

    if (!updatedId) {
      return fail(400, {
        error: 'Auto konnte nicht aktualisiert werden.'
      });
    }

    throw redirect(303, `/cars/${params.cars_id}`);
  }
};