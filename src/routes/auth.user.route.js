const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const generateToken = require('../middleware/generateToken');
require('dotenv').config()


// REGISTER ENDPOINT
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Check if user with the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already registered' });
        }
        const user = new User({ email, password, username });
        await user.save();
        res.status(201).send({ message: 'User registered successfully', user: user });
    } catch (error) {
        // console.error('Error registering user:', error);
        res.status(500).send({ message: 'Registration failed' });
    }
});

// LOGIN ENDPOINT
router.post('/login', async (req, res) => {
    try {
        // console.log(req.body)
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        // console.log(user._id)
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        // COMPARE PASSWORD
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // GENERATE TOKEN AND SET IT IN COOKIES
        const token = await generateToken(user._id);     // Generate token with user ID , pass the payload as user._id
        // console.log("Generated Token:", token);
        res.cookie('token', token, {
            httpOnly: true,       // enable this only when you have HTTPS
            // maxAge: 3600000,   // 1 hour
            secure: true,         // Ensure this is true for HTTPS
            sameSite: 'None'
        });
        res.status(200).send({
            message: 'Logged in successfully', token, user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        // console.error('Error logging in:', error);
        res.status(500).send({ message: 'Login failed' });
    }
});

// LOGOUT ENDPOINT (OPTIONAL)
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send({ message: 'Logged out successfully' });
});




// ALL USERS 
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role');
        res.status(200).send({
            message: 'Users fetched successfully',
            users: users
        });
    } catch (error) {
        // console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Failed to fetch users' });
    }
});

// DELETE A USER
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        // console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Failed to delete user' });
    }
})

// UPDATE A USER ROLE
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User role updated successfully', user });
    } catch (error) {
        // console.error('Error updating user role:', error);
        res.status(500).send({ message: 'Failed to update user role' });
    }
});


module.exports = router;