import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    category: String,
    status: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

export default Item;
