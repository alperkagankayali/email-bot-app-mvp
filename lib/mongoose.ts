"use server"
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI; // .env dosyasındaki MongoDB URI'sini kullanıyoruz

const cached: {
  connection?: typeof mongoose;
  promise?: Promise<typeof mongoose>;
} = {};
async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGO_URI environment variable inside .env.local"
    );
  }
  if (cached.connection) {
    return cached.connection;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI as string, opts);
  }
  try {
    cached.connection = await cached.promise;
  } catch (e) {
    cached.promise = undefined;
    throw e;
  }
  return cached.connection;
}
export default connectToDatabase;
