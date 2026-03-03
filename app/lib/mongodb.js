import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = { maxPoolSize: 10 };

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;
let client;
let clientPromise;
// declare global {
//     var _mongoClientPromise;
// }

if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;
console.log(clientPromise)

export default clientPromise;
