const express = require('express');
const router = express.Router();
const Thought = require('../../models/Thought'); 
const User = require('../../models/User'); 

// get all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find({});
        res.status(200).json(thoughts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get thought using id
router.get('/:id', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }
        res.status(200).json(thought);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// create new thought
router.post('/', async (req, res) => {
    try {
        const newThought = new Thought(req.body);
        await newThought.save();

        // use created thought's id to associated users
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.thoughts.push(newThought._id);
        await user.save();

        res.status(201).json(newThought);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// update a thought using id
router.put('/:id', async (req, res) => {
    try {
        const updatedThought = await Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedThought) {
            return res.status(404).json({ message: 'Possible error - thought not found' });
        }
        res.status(200).json(updatedThought);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// delete thought using id
router.delete('/:id', async (req, res) => {
    try {
        const deletedThought = await Thought.findByIdAndDelete(req.params.id);
        if (!deletedThought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        // Remove thought id from associated users
        const user = await User.findById(deletedThought.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.thoughts = user.thoughts.filter(thoughtId => thoughtId.toString() !== deletedThought._id.toString());
        await user.save();

        res.status(200).json({ message: 'Thought deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// create reaction 
router.post('/:id/reactions', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        thought.reactions.push(req.body); 
        await thought.save();

        res.status(201).json(thought);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// delete and remove a reaction using reactionId 
router.delete('/:id/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.id);
        if (!thought) {
            return res.status(404).json({ message: 'Thought not found' });
        }

        // lookup index of the reaction to delete
        const reactionIndex = thought.reactions.findIndex(reaction => reaction.reactionId.toString() === req.params.reactionId);
        if (reactionIndex === -1) {
            return res.status(404).json({ message: 'Reaction not found' });
        }

        // delete
        thought.reactions.splice(reactionIndex, 1);
        await thought.save();

        res.status(200).json(thought);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
