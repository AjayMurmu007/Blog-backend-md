const express = require('express');
const router = express.Router();
const Blog = require('../model/blog.model');
const Comment = require('../model/comment.model');
const {
    createPost,
    // getAllPosts,
    // getSinglePost,
    // updatePost,
    // deletePost,
    // getRelatedPosts
} = require('../controllers/blog.controller');
const verifyToken = require('../middleware/verifyToken');
const isAdmin = require('../middleware/isAdmin');

// Create a new blog post
router.post('/create-post', verifyToken, isAdmin, createPost);

// Get all blog posts
router.get('/', async (req, res) => {
    // res.send('Hello from blog route');  // Temporary response for testing
    try {
        const { search, category, location } = req.query;
        // console.log("Search query:", search);

        let query = {}

        if (search) {
            query = {
                ...query,
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } }
                ]
            }
        }

        if (category) {
            query = {
                ...query,
                category: { $regex: category, $options: 'i' }
                // category
            }
        }

        if (location) {
            query = {
                ...query,
                location: { $regex: location, $options: 'i' }
            }
        }
        // console.log("Query object:", query);

        const posts = await Blog.find(query).populate('author', 'username email').sort({ createdAt: -1 });
        res.status(200).send(posts)
        // res.status(200).send({
        //     message: "All Blog posts fetched successfully",
        //     posts: posts
        // });
    } catch (error) {
        // console.error("Error fetch blog post :", error);
        res.status(500).send({ message: "Failed to fetch blog post", error: error.message });
    }
});

// Get a single blog post by ID
router.get('/:id', async (req, res) => {
    try {
        // console.log("Fetching blog post with ID:", req.params.id);
        const postId = req.params.id;
        const post = await Blog.findById(postId).populate('author', 'username email');;
        if (!post) {
            return res.status(404).send({
                message: "Blog post not found"
            });
        }

        // TODO - with also fetch comment related to the post
        const comments = await Comment.find({ postId: postId }).populate('user', 'username email');
        //
        res.status(200).send({
            message: "Single blog post fetched successfully",
            post: post,
            comments: comments
        });
    } catch (error) {
        // console.error("Error fetching blog post by ID or Single Post:", error);
        res.status(500).send({
            message: "Failed to fetch single blog post",
            error: error.message
        });
    }
});

// Update a blog post by ID
router.patch('/update-post/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const postId = req.params.id;
        const updatePost = await Blog.findByIdAndUpdate(postId, {
            ...req.body
        }, { new: true });
        if (!updatePost) {
            return res.status(404).send({
                message: "Blog post not found"
            });
        }
        res.status(200).send({
            message: "Blog post updated successfully",
            post: updatePost
        });
    } catch (error) {
        // console.error("Error updating blog post:", error);
        res.status(400).send({
            message: "Failed to update blog post",
            error: error.message
        });
    }
});

// Delete a blog post by ID
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Blog.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).send({
                message: "Blog post not found"
            });
        }

        // Delete associated comments
        await Comment.deleteMany({ postId: postId });
        //

        res.status(200).send({
            message: "Blog post deleted successfully",
            post: post
        });
    } catch (error) {
        res.status(500).send({
            message: "Failed to delete blog post",
            error: error.message
        });
    }
});

//related blog
router.get('/related/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if id is defined
        if (!id) {
            return res.status(400).send({ message: 'Blog ID is required' });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).send({ message: 'Blog post not found' });
        }

        // Create a regex to match similar titles
        const titleRegex = new RegExp(blog.title.split(' ').join('|'), 'i');

        const relatedQuery = {
            _id: { $ne: id }, // Exclude the current blog post
            title: { $regex: titleRegex } // Match similar titles
        };
        // Fetch related posts
        const relatedPosts = await Blog.find(relatedQuery);

        res.status(200).send(relatedPosts);
    } catch (error) {
        // console.error('Error fetching related posts:', error);
        res.status(500).send({ message: 'Failed to fetch related posts' });
    }
});


module.exports = router;
