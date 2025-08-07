const Blog = require('../model/blog.model');
const Comment = require('../model/comment.model');

const createPost = async (req, res) => {
    try {
        // console.log("Creating blog post with data:", req.body);
        const newPost = new Blog({ ...req.body });  // todo: use auther: req.userId, when you have token verify
        await newPost.save();
        res.status(201).send({
            message: "Blog post created successfully",
            post: newPost
        });
    } catch (error) {
        // console.error("Error creating blog post:", error);
        res.status(500).send({ message: "Failed to create blog post", error: error.message });
    }
};

module.exports = {
    createPost,
    // getAllPosts,
    // getSinglePost,
    // updatePost,
    // deletePost,
    // getRelatedPosts
};