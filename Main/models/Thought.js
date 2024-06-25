const { Schema, Types, model } = require('mongoose');

// import Reaction schema
const reactionSchema = require('./Reaction');

// getter to format date
const formatDate = (date) => {
    return date.toLocaleString();
};

const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        maxLength: 280,
        minLength: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: formatDate // getter method
    },
    username: {
        type: String,
        required: true,
    },
    reactions: [reactionSchema]
}, {
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true }
});

// create and export Thought
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
