const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thought'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// virtual friendCount
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

userSchema.set('toJSON', {
    virtuals: true
});

userSchema.set('toObject', {
    virtuals: true
});

// create and export User
const User = model('User', userSchema);

module.exports = User;
