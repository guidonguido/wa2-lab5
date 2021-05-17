import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connection = async function connect () {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI,
            {
                user: process.env.MONGODB_USER,
                pass: process.env.MONGODB_PASSWORD,
                useNewUrlParser: true,
                useUnifiedTopology: true });

        mongoose.connection.on('error', err => {
            console.log("disconnection error")
            //handle here disconnections that may happen later
        });

        console.log("App connected to DB")
    } catch (error) {
        //problems in establishing the connection
        console.log("roblems in establishing the connection")

        // handleError(error)
    }
}

export {connection}