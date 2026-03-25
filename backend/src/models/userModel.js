import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		trim: true,
		required: true,
		unique: true
	},
	email: {
		type: String,
		trim: true,
		required: true,
		unique: true,
		match: [
            /^[a-zA-Z0-9._%+-]+@(kist\.ac\.ke|kiambupoly\.ac\.ke)$/,
            "Please use a valid KINAP institutional email (@kist.ac.ke or @kiambupoly.ac.ke)"
        ]
	},
	studentId: {
		type: String,
		unique: true,
		trim: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	profilePic: {
		type: String,
		default: ""
	},
	role: {
		type: String,
		enum: ["admin", "user"],
		default: "user"
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;