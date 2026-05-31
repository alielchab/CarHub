import { MongoClient, ObjectId} from "mongodb";
import { DB_URI} from "$env/static/private";

const client = new MongoClient(DB_URI);

await client.connect();
const db = client.db("carhub");

// Get all cars
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

// Create new car
async function createCar(car) { 
  try {
    const collection = db.collection("cars");
    const result = await collection.insertOne(car);
    return result.insertedId.toString();
  } catch (error) {
   
    console.log(error.message);
    return error;
  }
  return null;
}

// Update existing car
async function updateCar(car) {
  try {

    let id = car._id;

    delete car._id;

    const collection = db.collection("cars");

    const query = {
      _id: new ObjectId(id)
    };

    const result = await collection.updateOne(
      query,
      { $set: car }
    );

    if (result.matchedCount === 0) {
      console.log("No car with id " + id);
    } else {
      console.log("Car updated");
      return id;
    }

  } catch (error) {
    console.log(error.message);
  }

  return null;
}

// Delete car by id
async function deleteCar(id) {
  try {
    const collection = db.collection("cars");
    const query = { _id: new ObjectId(id) }; // filter by id
    const result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      console.log("No car with id " + id);
    } else {
      console.log("Car with id " + id + " has been successfully deleted.");
      return id;
    }
  } catch (error) {
    // TODO: errorhandling
    console.log(error.message);
  }
  return null;
}

// Update car status (aktiv, inaktiv, verkauft, entfernt)
async function updateCarStatus(id, status) {
  try {
    const collection = db.collection('cars');

    const update = {
      status
    };

    if (status !== 'aktiv') {
      update.topListing = false;
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return id;
  } catch (error) {
    console.log(error.message);
  }

  return null;
}

// Update top listing status
async function updateTopListing(id, value) {
  try {
    const collection = db.collection('cars');

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { topListing: value } }
    );

    return id;
  } catch (error) {
    console.log(error.message);
  }

  return null;
}

// Get user by id
async function getUserById(id) {
  try {
    const collection = db.collection('users');
    return await collection.findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.log(error.message);
  }

  return null;
}

// Get user by username
async function getUserByUsername(username) {
  try {
    const collection = db.collection('users');
    return await collection.findOne({ username });
  } catch (error) {
    console.log(error.message);
  }

  return null;
}

// export all functions so that they can be used in other files
export default {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,  
  getUserByUsername,
  getUserById, 
  updateCarStatus,
  updateTopListing
};