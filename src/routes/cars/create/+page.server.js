import db from '$lib/db.js'

export const actions = {
    create: async ( {request} ) => {
        console.log("create")
        const data = await request.formData()


        let car =  {
        marke: data.get("marke"),
        modell: data.get("modell"),
        baujahr: data.get("baujahr"),
        leistung: data.get("leistung"),
        preis: data.get("preis")
        }

        await db.createCar(car)
        console.log(car)
        
    }
}