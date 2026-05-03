import { MongoClient, ObjectId } from "mongodb";
import { DB_URI } from "$env/static/private";

const client = new MongoClient(DB_URI);

await client.connect();
const db = client.db("carhub");


async function getCars() {
    let cars = [];
    try {
        const collection = db.collection("cars");

        const query = {};

        cars = await collection.find(query).toArray();
        cars.forEach((car) => {
            car._id = car._id.toString();
        });
    } catch (error) {
        console.error("Error fetching cars:", error);
    }
    return cars;
}   


async function getCar(id) {
    let car = null;
    try {
        const collection = db.collection("cars");
        const query = { _id: new ObjectId(id) };
        car = await collection.findOne(query);
        if (!car) {
           console.log("Car not found with id:", id);
        } else {
            car._id = car._id.toString();
        }
    } catch (error) {
        console.error("Error fetching car:", error);
    }
    return car;
}


