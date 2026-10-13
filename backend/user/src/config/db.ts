import mongoose from "mongoose";

const connectDb = async () => {

    const url = process.env.MONGO_URI
    if (!url) {
        
        throw new Error("MONGO_URI is not defined in the environment variables");
    }

    try {
        mongoose.connect(url)
            .then(() => { console.log("Connected to MongoDB") })
            .catch((err: any) => { console.log(err) });
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }

}

export default connectDb;