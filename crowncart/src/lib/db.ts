import mongoose, { mongo } from "mongoose";

const mongoURI = process.env.MONGO_URI;
if(!mongoURI){
    throw new Error("Please provide MONGO_URI in the environment variables")
}


let cached = global.mongoose;
if(!cached){
    cached = global.mongoose = {conn:null, promise:null}
}

const dbConnect = async() => {
    if(cached.conn){
        return cached.conn;
    }   
    if(!cached.promise){
        cached.promise = mongoose.connect(mongoURI).then((con) => {
            return con.connection;
        })
    } 
    try{
        const conn = await cached.promise;
        return conn;
    }catch(err){

    }
}
export default dbConnect;