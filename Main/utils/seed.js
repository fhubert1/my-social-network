const mongoose = require('mongoose');
const User = require('../models/User'); 
const Thought = require('../models/Thought');

const mongoDb = 'mongodb://localhost:27017/socialNetworkDB'; 

// Connect to MongoDB
mongoose.connect(mongoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected to Social Network DB');
})
.catch((err) => {
    console.error('MongoDB connection failed:', err);
});

// Seed data for User model
const userData = [
    {
        username: 'johnSmith',
        email: 'john@smith.com',
        thoughts: [],
        friends: []
    },
    {
        username: 'janeSmith',
        email: 'jane@smith.com',
        thoughts: [],
        friends: []
    }
];

// Seed data for Thought model
const thoughtData = [
    {
        thoughtText: 'What is on Johns mind today?  Nothing!!',
        username: 'johnSmith',
        reactions: []
    },
    {
        thoughtText: 'What is on Janes mind today? That John has no thought for today!',
        username: 'janeSmith',
        reactions: []
    }
];

// Function to seed the database
const seedDB = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Thought.deleteMany({});

        // Insert seed data
        const users = await User.insertMany(userData);
        const thoughts = await Thought.insertMany(thoughtData);

        // Link thoughts to users
        users[0].thoughts.push(thoughts[0]._id);
        users[1].thoughts.push(thoughts[1]._id);

        await users[0].save();
        await users[1].save();

        console.log('My Social Network database seeded successfully');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
};

// Run the seed function
seedDB();
