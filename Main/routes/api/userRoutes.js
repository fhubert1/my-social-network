const express = require('express');
const router = express.Router();
const User = require('../../models/User'); 
const Thought = require('../../models/Thought');

// get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
            .populate('thoughts') // Populate thoughts field
            .populate('friends'); // Populate friends field
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users', error: err });
    }
});

// get single user using id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('thoughts') // Populate thoughts field
            .populate('friends'); // Populate friends field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err });
    }
});

// create a new user
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: 'Error creating user', error: err });
    }
});

// update a user by using id
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: 'Error updating user', error: err });
    }
});

// delete user using id
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Optionally, remove thoughts associated with the user
        await Thought.deleteMany({ username: deletedUser.username });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err });
    }
});

// POST to add a friend to a user's friends list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const friend = await User.findById(req.params.friendId);
        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        if (!user.friends.includes(req.params.friendId)) {
            user.friends.push(req.params.friendId);
            await user.save();
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE to remove a friend from a user's friends list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const friendIndex = user.friends.indexOf(req.params.friendId);
        if (friendIndex === -1) {
            return res.status(404).json({ message: 'Friend not found in user\'s friends list' });
        }

        user.friends.splice(friendIndex, 1);
        await user.save();

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
