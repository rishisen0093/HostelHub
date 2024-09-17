const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const AdminModel = require('../Models/Admin')


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

const adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the admin already exists
        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({
                message: 'Admin already exists, you can login',
                success: false
            });
        }

        // Create a new admin instance
        const admin = new AdminModel({ name, email, password });

        // Hash the password before saving
        admin.password = await bcrypt.hash(password, 10);

        // Save the new admin to the database
        await admin.save();

        // Respond with success message
        res.status(201).json({
            message: 'Admin signed up successfully',
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};



const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        console.log(user);
        const errorMsg = 'Auth failed email or password is wrong';

        if (!user) {
            console.log("not user");
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            console.log("jndjks");
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: err,
                success: false
            })
    }
}

const adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;
        // console.log(req.body)
        const admin = await AdminModel.findOne({ email });
        console.log(admin);

        const errorMsg = 'Authentication failed: email or password is incorrect';

        if (!admin) {
            console.log("Admin not found");
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const isPassEqual = await bcrypt.compare(password, admin.password);
        if (!isPassEqual) {
            console.log("Incorrect password");
            return res.status(403).json({ message: errorMsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: admin.email, _id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: admin.name
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
};

module.exports = {
    signup,
    login,
    adminSignup,
    adminLogin
}