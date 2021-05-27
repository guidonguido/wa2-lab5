import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connection = async function connect () {
    try {
        await mongoose.connect(
            process.env.MONGODB_URI,
            {
                dbName: process.env.MONGODB_DB_NAME,
                user: process.env.MONGODB_USER,
                pass: process.env.MONGODB_PASSWORD,
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

        mongoose.connection.on('error', err => {
            console.log('Mongoose default connection error: ' + err);
            //Handle here disconnections that may happen later
        });

        // When the connection to DB is lost
        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose default connection disconnected, retrying connection');
            connection()
                .catch(() => {
                    console.log("Server stopped due to a DB connection error")
                    process.exit(1);
                })
        })

        // Connection success
        console.log("App connected to DB")
    } catch (error) {
        //Problems in establishing the connection
        console.log(`Problems occurred while  establishing the connection, Error: ${error}`)
        throw error
    }
}

export default connection
