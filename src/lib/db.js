import { MongoClient} from "mongodb";
import { DB_URI, DB_NAME } from "$env/static/private";


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


// Get car by id
async function getCar(id) {
  let car = null;
  try {
    const collection = db.collection("cars");
    const query = { _id: new ObjectId(id) }; // filter by id
    car = await collection.findOne(query);

    if (!car) {
      console.log("No car with id " + id);
      // TODO: errorhandling
    } else {
      car._id = car._id.toString(); // convert ObjectId to String
    }
  } catch (error) {
    // TODO: errorhandling
    console.log(error.message);
  }
  return car;
}

async function createCar(car) { 
  try {
    const collection = db.collection("cars");
    const result = await collection.insertOne(car);
    return result.insertedId.toString(); // convert ObjectId to String
  } catch (error) {
    // TODO: errorhandling
    console.log(error.message);
  }
  return null;
}



// export all functions so that they can be used in other files
export default {
  getCars,
  getCar,
createCar,
};


