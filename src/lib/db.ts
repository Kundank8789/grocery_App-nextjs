import mongoose from "mongoose";


const mongodbUri = process.env.MONGODB_URI || "";

if (!mongodbUri) {
    throw new Error("db error")
}

let cached=global.mongoose;
if(!cached){
    cached=global.mongoose={conn:null,promise:null};
}

const connectdb=async()=>{
    if(cached.conn){
        return cached.conn;
    }

    if(!cached.promise){
        cached.promise=mongoose.connect(mongodbUri).then((conn)=>conn.connection);
    
    }
    try {
        const conn=await cached.promise;
        return conn;
    } catch (error) {
        console.log(error);
    }
}
export default connectdb;