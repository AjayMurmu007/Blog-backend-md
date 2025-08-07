const express = require('express');
const router = express.Router();
// const verifyToken = require('../middleware/verifyToken');
const Comment = require('../model/comment.model');

// Post comment (protected route)
router.post('/post-comment', async (req, res) => {
    try {
        // console.log('Request body:', req.body);
        // const { comment, postId, user } = req.body;
        // const newComment = new Comment({
        //     comment,
        //     user,
        //     postId
        // });

        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).send({ message: 'Comment posted successfully', comment: newComment });
    } catch (error) {
        // console.error('Error posting comment:', error);
        res.status(500).send({ message: 'Failed to post comment' });
    }
});


router.get('/total-comments', async (req, res) => {
    try {
        const totalComments = await Comment.countDocuments({});
        res.status(200).send({
            message: 'Total comments fetched successfully',
            totalComments: totalComments
        });
    } catch (error) {
        // console.error('Error fetching total comments:', error);
        res.status(500).send({ message: 'Failed to fetch total comments' });
    }
});


module.exports = router;