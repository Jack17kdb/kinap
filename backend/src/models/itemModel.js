import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: {
        type: String,
        default: ""
    },
    category: { type: String, index: true },
    location: { type: String, index: true },
    status: { type: String, index: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

export default Item;
