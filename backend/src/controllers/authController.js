import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import cloudinary from '../lib/cloudinary.js';
import generateCode from '../utils/generateCode.js';
import generateToken from '../utils/generateToken.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../lib/emailService.js';

const register = async(req, res) => {
	try{
		const { username, email, studentId, password } = req.body;

		if(!username || !email || !studentId || !password){
			return res.status(400).json({ message: "Please fill all fields" });
		}

		if(password.length < 6){
			return res.status(400).json({ message: "Password should not be less that 6 characters" });
		}

		let user = await User.findOne({username});
		if(user){
			return res.status(400).json({ message: "Username already exists" });
		}

		user = await User.findOne({email});
		if(user){
			return res.status(400).json({ message: "Email already exists" });
		}

		user = await User.findOne({studentId});
        if(user){
            return res.status(400).json({ message: "Student ID already exists"});
        };

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		const code = generateCode();

		const newUser = new User({
			username,
			email,
			studentId,
			password: hash,
			verificationToken: code,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
		});

		if(newUser){
			await newUser.save();

			try{
				await sendVerificationEmail(email, code);
			} catch(error) {
				console.log("Error sending verification email:", error);
			}

			return res.status(201).json({
				message: "User created successfully. Please check email for verification.",
				_id: newUser._id,
				username: newUser.username,
				email: newUser.email,
				studentId: newUser.studentId,
				profilePic: newUser.profilePic
			});
		} else {
			return res.status(400).json({ message: "Invalid user data" });
		}
	} catch(error) {
		console.log("Error signing up: ", error);
		res.status(500).json({ message: "Error signing up" });
	}
};

const login = async(req, res) => {
	try{
		const { email, password } = req.body;

		if(!email || !password){
			return res.status(400).json({ message: "Please fill all fields" });
		}

		const user = await User.findOne({email});
		if(!user){
			return res.status(400).json({ message: "Invalid user credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if(!isMatch){
			return res.status(400).json({ message: "Invalid user credentials" });
		}

		if(!user.isVerified){
			return res.status(400).json({ message: "Please verify email before logging in" });
		}

		generateToken(user._id, res);

		return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            isVerified: user.isVerified,
        });
	} catch(error) {
		console.log("Error signing in: ", error);
		res.status(500).json({ message: "Error signing in" });
	}
};

const verifyEmail = async(req, res) => {
    const { token } = req.query;
    try {
        if(!token){
            return res.status(400).json({"message": "Please provide token"});
        }

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if(!user) return res.status(400).json({ message: "Invalid or expired verification token" });

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.log("Error in verifyEmail:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const forgotPassword = async(req, res) => {
    const { email } = req.body;
    try {

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({"message": "Password reset email sent"});
        }

        const resetToken = generateCode();

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 3600000;
        await user.save();

        try {
            await sendPasswordResetEmail(email, resetToken);
        } catch (error) {
            console.log("Error sending password reset email: ", error);
        }

        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        console.log("Error sending reset email: ", error);
        res.status(500).json( {message: "Internal server error"} );
    }
};

const resetPassword = async(req, res) => {
    const { token } = req.query;
    const { password } = req.body;
    try {

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({"message": "Invalid or expired reset token"});
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        user.password = hash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async(req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error logging out user", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updatePic = async(req, res) => {
    const { profilePic } = req.body;
    try {
        if (!profilePic) {
            return res.status(400).json({ message: "Please provide a profile picture" });
        }

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {new: true});

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error updating profile picture", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getUserById = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) {
            return res.status(400).json({ "message": "User not found" });
        }

        res.status(200).json(user);
    } catch(error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteAccount = async(req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await User.findByIdAndDelete(req.user._id);

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const checkAuth = async(req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error checking auth", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { register, verifyEmail, login, forgotPassword, resetPassword, logout, deleteAccount, checkAuth, updatePic, getUserById };

