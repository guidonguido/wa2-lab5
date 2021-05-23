import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: String,
    stars: {
        type: Number,
        required: true,
        min: 1, //TODO do we assume it?
        max: 5
    },
    date: {
        type: Date,
        required: true
    }
});


//The compiled schema is made available to other modules
export default mongoose.model('Comment', commentSchema);
