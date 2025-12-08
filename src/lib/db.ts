import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env");
}

declare global {
  // allow global var for mongoose cache
  // eslint-disable-next-line no-var
  var _mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

if (!global._mongoose) {
  global._mongoose = { conn: null, promise: null };
}

export default async function connectdb() {
  if (global._mongoose.conn) {
    return global._mongoose.conn;
  }

  if (!global._mongoose.promise) {
    global._mongoose.promise = mongoose
      .connect(MONGODB_URI, {
        // optional configs
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    global._mongoose.conn = await global._mongoose.promise;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw err; // do NOT swallow errors
  }

  return global._mongoose.conn;
}
