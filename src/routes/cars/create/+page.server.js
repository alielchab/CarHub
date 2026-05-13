import db from '$lib/db.js';
import { fail, redirect } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { stat } from 'fs';

export async function load({ locals }) {
    if (!locals.user) {
        throw redirect(303, '/login');
    }
}


export const actions = {
    create: async ({ request }) => {


        const data = await request.formData();

        const saveAs = data.get('saveAs');

        const files = data
            .getAll('images')
            .filter((file) => file && file.name && file.size > 0);

        if (files.length > 30) {
            return fail(400, { error: 'Maximal 30 Bilder erlaubt' });
        }

        const imagePaths = [];

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

            imagePaths.push(publicPath);
        }

        const car = {
            status: saveAs === 'entwurf' ? 'entwurf' : 'aktiv',
            topListing: false,
            // Fahrzeug-Merkmale
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

            // Zustand
            zustand: data.get('zustand'),
            mfk: data.get('mfk'),
            ab_mfk: data.get('ab_mfk') ? true : false,
            inverkehrsetzung: data.get('inverkehrsetzung'),
            kilometer: data.get('kilometer'),

            // Garantie
            garantie: data.get('garantie'),
            garantie_datum: data.get('garantie_datum'),
            garantie_monate: data.get('garantie_monate'),
            garantie_km: data.get('garantie_km'),
            garantie_beschreibung: data.get('garantie_beschreibung'),

            // Preis
            preis: data.get('preis'),
            neupreis: data.get('neupreis'),

            // Beschreibung
            beschreibung: data.get('beschreibung'),

            // Technische Daten
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

            // Bilder
            images: imagePaths,
            mainImage: imagePaths[0] ?? null,

            inventor: data.get('inventor'),

            createdAt: new Date()
           
        };

        let result = await db.createCar(car);
        if(result !== null) {
            return {result: result}
        }

        throw redirect(303, '/success');
    }
};