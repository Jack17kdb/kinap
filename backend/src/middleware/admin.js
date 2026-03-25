import User from '../models/userModel.js';

const admin = async(req, res, next) => {
	const userId = req.user._id;

	const user = await User.findById(userId);

	if(user.role !== "admin") return res.status(401).json({ message: "Access Denied - Not authorized" });

	next();
};

export default admin;
