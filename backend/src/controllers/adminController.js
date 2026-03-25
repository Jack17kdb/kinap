import User from '../models/userModel.js';
import Item from '../models/itemModel.js';
import Location from '../models/locationModel.js';
import Category from '../models/categoryModel.js';

const getUsers = async(req, res) => {
	try{
		const users = await User.find({})
			.select("-password")
			.sort({ username: 1 });

		res.status(200).json(users);
	} catch(error) {
		console.log("Error fetching users: ", error);
		res.status(500).json({ "message": error.message });
	}
};

const searchUsers = async(req, res) => {
	try{
		const { search } = req.query;

		const users = await User.find({
			username: { $regex: search, $options: "i" }
		}).select("-password").sort({ username: 1 });

		res.status(200).json(users || []);
	} catch(error) {
		console.log("Error fetching users: ", error);
		res.status(500).json({ "message": error.message });
	}
};

const getUserPosts = async(req, res) => {
	try{
		const { userId } = req.params;

		const items = await Item.find({ owner: userId })
			.populate('owner', 'username')
			.sort({ createdAt: -1 });

		res.status(200).json(items || []);
	} catch(error) {
		console.log("Error fetching user items: ", error);
		res.status(500).json({ "message": error.message });
	}
};

const getUserPost = async(req, res) => {
	try{
		const { id } = req.params;

		const item = await Item.findById(id)
			.populate('owner', 'username');

		res.status(200).json(item);
	} catch(error) {
		console.log("Error fetching item: ", error);
		res.status(500).json({ "message": error.message });
	}
};

const deleteUserPost = async(req, res) => {
	try{
		const { id } = req.params;

		await Item.findByIdAndDelete(id);

		res.status(200).json({ message: "Item deleted" });
	} catch(error) {
		console.log("Error deleting item: ", error);
		res.status(500).json({ "message": error.message });
	}
};

const getItemStats = async (req, res) => {
    try {
        const [lost, found] = await Promise.all([
            Item.countDocuments({ status: "Lost" }),
            Item.countDocuments({ status: "Found" })
        ]);

        res.status(200).json({ lost, found, total: lost + found });
    } catch (error) {
    	console.log("Error fetching item stats: ", error);
        res.status(500).json({ message: error.message });
    }
};

const getLostLocations = async(req, res) => {
	try{
		const locationStats = await Item.aggregate([
			{ $match: { status: "Lost" } },

			{
				$group: {
					_id: "$location",
					count: { $sum: 1 }
				}
			},

			{ $sort: { count: -1 } }
		]);

		res.status(200).json(locationStats);
	} catch(error) {
		console.log("Error fetching location stats: ", error);
        res.status(500).json({ "message": error.message });
	}
};

const addLocations = async(req, res) => {
	try{
		const { location } = req.body;

		if(!location) return res.status(400).json({ message: "Please fill location field" });

		const locationExists = await Location.findOne({ name: location });

		if(locationExists) return res.status(400).json({ message: "Location already exists" });

		const newLocation = await Location.create({
			name: location
		});

		res.status(201).json({
			name: newLocation.name
		});
	} catch(error) {
		console.log("Error adding location: ", error);
        res.status(500).json({ "message": error.message });
	}
};

const addCategories = async(req, res) => {
	try{
		const { category } = req.body;

		if(!category) return res.status(400).json({ message: "Please fill category field" });

		const categoryExists = await Category.findOne({ name: category });

		if(categoryExists) return res.status(400).json({ message: "Category already exists" });

		const newCategory = await Category.create({
			name: category
		});

		res.status(201).json({
			name: newCategory.name
		});
	} catch(error) {
		console.log("Error adding category: ", error);
        res.status(500).json({ "message": error.message });
	}
};

export default { 
    getUsers, 
    searchUsers, 
    getUserPosts, 
    getUserPost, 
    deleteUserPost, 
    getItemStats, 
    getLostLocations, 
    addLocations,
    addCategories 
};

