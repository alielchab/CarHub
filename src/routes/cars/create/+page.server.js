import db from '$lib/db.js'
import { fail, redirect } from '@sveltejs/kit';
import {writeFile, mkdir} from 'fs/promises';
import path from 'path';
import crypto from 'crypto'
import { create } from 'domain';


export function load({ locals }) {
    if (!locals.user) {
        throw redirect(303, '/login');
    }
}


export const actions = {
    create: async ( {request} ) => {
        console.log("create")
        const data = await request.formData()

        const files = data.getAll("images").filter((file) => file && file.name 
        && file.size > 0);

        if(files.length > 30) {
            return fail(400, { error: "Maximal 30 Bilder erlaubt" });
        }

        const imagePaths = [];

        await mkdir("static/images", { recursive: true });

        for (const file of files) {
            if(!file.type.startsWith("image/")) {
                return fail(400, { error: "Es sind nur Bilder erlaubt" });
            }

            const extension = path.extname(file.name);
            const filename = '${crypto.randomUUID()}${extension}';
            const savePath = 'static/images/uploads/cars${filename}';
            const publicPath = '/images/uploads/cars${filename}';

            const buffer = Buffer.from(await file.arrayBuffer());
            await writeFile(savePath, buffer);

            imagePaths.push(publicPath);
        }

        let car =  {
        marke: data.get("marke"),
        modell: data.get("modell"),
        baujahr: data.get("baujahr"),
        leistung: data.get("leistung"),
        preis: data.get("preis"),
        images: imagePaths,
        mainImage: imagePaths[0] ?? null,
        createdAt: new Date()
        };

        await db.createCar(car)

        redirect(303, "/success");
        console.log(car)
        
    }
}