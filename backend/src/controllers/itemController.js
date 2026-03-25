import cloudinary from '../lib/cloudinary.js';
import Item from '../models/itemModel.js';
import stringSimilarity from 'string-similarity';
import Location from '../models/locationModel.js';
import Category from '../models/categoryModel.js';

const createItem = async(req, res) => {
    try {
        const { title, description, image, category, location, status } = req.body;

        if (!title || !description || !image || !location || !category) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        try{
            const uploadResponse = await cloudinary.uploader.upload(image);
            const imageUrl = uploadResponse.secure_url;
        } catch(error) {
            console.log("Error uploading image: ", error);
            return res.status(500).json({ "message": error.message })
        }

        const newItem = new Item({
            title,
            description,
            image: imageUrl,
            category,
            location,
            status: status || "Found",
            owner: req.user._id
        });

        await newItem.save();

        res.status(201).json(newItem);
    } catch (error) {
        console.log("Error creating item: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const getItems = async(req, res) => {
    try {
        const { category, location, date, search } = req.query;
        
        const filter = {};

        if(category){
            filter.category = category;
        }

        if(location){
            filter.location = location;
        }

        if(date){
            filter.createdAt = { $gte: new Date(date) };
        }

        if(search){
            const sanitizedQuery = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            filter.$or = [
                { title: { $regex: sanitizedQuery, $options: "i" } },
                { description: { $regex: sanitizedQuery, $options: "i" } },
                { location: { $regex: sanitizedQuery, $options: "i" } }
            ];
        }

        const items = await Item.find(filter)
                    .populate('owner', 'username studentId')
                    .sort({ createdAt: -1 });

        res.status(200).json(items || []);
    } catch (error) {
        console.log("Error fetching items: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const getItemById = async(req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findById(id).populate('owner', 'username studentId');
        if (!item) return res.status(404).json({ message: "Item not found" });

        res.status(200).json(item);
    } catch (error) {
        console.log("Error fetching item: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const searchItems = async(req, res) => {
    try {
        const { query } = req.query;

        const sanitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const items = await Item.find({
            $or: [
                {title: { $regex: sanitizedQuery, $options: "i" }},
                {description: { $regex: sanitizedQuery, $options: "i" }}
            ]
        }).populate('owner', 'username studentId').sort({ createdAt: -1 });

        res.status(200).json(items || []);
    } catch (error) {
        console.log("Error searching items: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const updateItemStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if(item.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Unauthorized to update this item" });
        }

        item.status = status;
        await item.save();

        res.status(200).json({ "message": "Status updated successfully", item });
    } catch (error) {
        console.log("Error updating status: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const deleteItem = async(req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if(item.owner.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: "Unauthorized to delete this item" });
        }

        await item.deleteOne();

        res.status(200).json({ "message": "Item deleted successfully" });
    } catch (error) {
        console.log("Error deleting item: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const lostItem = async(req, res) => {
    try{
        const { title, description, image, category, location, status } = req.body;

        if (!title || !description || !location || !category) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        let imageUrl = "";
        if(image){
            try{
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch(error) {
                console.log("Error uploading image: ", error);
                return res.status(500).json({ "message": error.message })
            }
        }

        const newLostItem = new Item({
            title,
            description,
            image: imageUrl || "",
            category,
            location,
            status: status || "Lost",
            owner: req.user._id
        });

        await newLostItem.save();

        res.status(201).json(newLostItem);
    } catch(error) {
        console.log("Error creating item: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const getPotentialMatches = async(req, res) => {
    try{
        const { id } = req.params;

        const sourceItem = await Item.findById(id);
        if (!sourceItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        const targetType = sourceItem.status.toLowerCase() === "lost" ? "Found" : "Lost";

        const candidates = await Item.find({
            status: targetType,
            category: sourceItem.category,
            _id: { $ne: sourceItem._id }
        }).populate("owner", "username");

        const results = candidates.map(candidate => {
            const titleScore = stringSimilarity.compareTwoStrings(
                sourceItem.title.toLowerCase(),
                candidate.title.toLowerCase()
            );

            const descScore =stringSimilarity.compareTwoStrings(
                sourceItem.description.toLowerCase(),
                candidate.description.toLowerCase()
            );

            const locationMatch = sourceItem.location.toLowerCase() === candidate.location.toLowerCase();
            
            const finalScore = (titleScore * 0.6) + (descScore * 0.4);

            return {
                item: candidate,
                matchPercentage: Math.round(finalScore * 100),
                locationMatch
            };
        });

        const filteredMatches = results
            .filter(m => m.matchPercentage > 35 && m.locationMatch)
            .sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.status(200).json(filteredMatches);
    } catch(error) {
        console.log("Error fetching potential matches: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const getCategories = async(req, res) => {
    try{
        const categories = await Category.find({}).sort({ name: 1 });

        res.status(200).json(categories);
    } catch(error) {
        console.log("Error fetching categories: ", error);
        res.status(500).json({ "message": error.message });
    }
};

const getLocations = async(req, res) => {
    try{
        const locations = await Location.find({}).sort({ name: 1 });

        res.status(200).json(locations);
    } catch(error) {
        console.log("Error fetching locations: ", error);
        res.status(500).json({ "message": error.message });
    }
};

export default { createItem, getItems, getItemById, searchItems, updateItemStatus, deleteItem, lostItem, getPotentialMatches, getCategories, getLocations };

