import mongoose from "mongoose"


async function connect () {
    try {
        await mongoose.connect(
            'mongodb://localhost:27017',
            {
                user: "root",
                pass: "password",
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

export {connect}