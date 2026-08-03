import { MongoClient } from "mongodb";

// FIX: Append 'as string' to reassure TypeScript it won't be undefined
const uri = process.env.MONGODB_URI as string; 

if (!uri) {
  throw new Error("MONGODB_URI must be configured.");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let productionClientPromise: Promise<MongoClient> | undefined;

function connectToMongo() {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }

    return global._mongoClientPromise;
  }

  if (!productionClientPromise) {
    productionClientPromise = new MongoClient(uri).connect();
  }

  return productionClientPromise;
}

/** Establishes a MongoDB connection only when a route actually awaits it. */
const clientPromise: PromiseLike<MongoClient> = {
  then: (onfulfilled, onrejected) => connectToMongo().then(onfulfilled, onrejected),
};

export default clientPromise;