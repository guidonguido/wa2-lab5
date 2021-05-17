import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    title: String,
    body: String,
    stars: Number,
    date: Date
});



//The compiled schema is made available to other modules
export default mongoose.model('comment', commentSchema);
