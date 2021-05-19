import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    title: String,
    body: String,
    stars: Number,
    date: Date,
    product_id: String
});



//The compiled schema is made available to other modules
export default mongoose.model('comment', commentSchema);
