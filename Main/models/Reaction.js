const { Schema, Types } = require('mongoose');

// getter to format date
const formatDate = (date) => {
    return date.toLocaleString();
};

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxLength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: formatDate // Use getter to format date
    }
}, {
    _id: false, // Prevents creating an automatic _id field for nested documents
    toJSON: { getters: true },
    toObject: { getters: true }
});

module.exports = reactionSchema;