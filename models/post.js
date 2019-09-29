const { UserSchema } = require('./user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.DB_HOST + process.env.DB_NAME, { useNewUrlParser: true });
var db = mongoose.connection;

const Post = mongoose.model('Post', new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 2
    },
    body: {
        type: String,
        required: true,
        minlength: 2
    },
    created_at: {
        type: String
    },
    active: {
        type: Boolean, default: true
    },
    deleted: {
        type: Boolean, default: false
    }
}));

module.exports.PostSchema = Post;
module.exports.createPost = (newPost, callback) => {
    newPost.save(callback);
};

module.exports.findPostByUserId = function (userId, callback) {
    //UserSchema.findById(mongoose.Types.ObjectId(userId), callback);
    Post.find({ user: userId, "$and": [{ deleted: false }, { active: true }] }, callback).sort('created_at');

}

module.exports.changePostStatus = (data, callback) => {
    Post.updateOne({ user: data.user, _id: mongoose.Types.ObjectId(data.post) }, { $set: { active: false, deleted: true } }, callback);
};
