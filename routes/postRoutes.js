const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
// const auth = require("../middleware/auth");
const auth = require("../middleware/validateTokenHandler");


const User = require("../models/userModel");
const Post = require( "../models/postModel");
// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]], // check middleware
  async (req, res) => {
    // check middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there are errors
      return res.status(400).json({ errors: errors.array() }); // return errors
    }
  
    try {
      const user = await User.findById(req.user.id).select("-password"); 
    
      const newPost = new Post({
        // create new post
        text: req.body.text, // get text from req.body
        name: user.name, // get name from user
        avatar: user.avatar, // get avatar from user
        user: req.user.id, // get user id from req.user
      });

      const post = await newPost.save(); // save post to db

      res.json(post); // return post
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error"); // server error
    }
  }
);


// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get("/", auth, async (req, res) => {
    
  // get all posts
  try {
    const posts = await Post.find().sort({ date: -1 }); // get posts from db
    res.json(posts); // return posts
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error"); // server error
  }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private

router.get("/:id", auth, async (req, res) => {
    // get post by id
    try {
        const post = await Post.findById(req.params.id); // get post from db
    
        if (!post) {
        // if no post
        return res.status(404).json({ msg: "Post not found" }); // return error
        }
    
        res.json(post); // return post
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
        // if id is not valid
        return res.status(404).json({ msg: "Post not found" }); // return error
        }
        res.status(500).send("Server Error"); // server error
    }
    });

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete("/:id", auth, async (req, res) => {
    // delete post by id
    try {
        const post = await Post.findById(req.params.id); // get post from db
    
        if (!post) {
        // if no post
        return res.status(404).json({ msg: "Post not found" }); // return error
        }
    
        // Check user
        if (post.user.toString() !== req.user.id) {
        // if user is not authorized
        return res.status(401).json({ msg: "User not authorized" }); // return error
        }
    
        await post.remove(); // remove post from db
    
        res.json({ msg: "Post removed" }); // return message
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
        // if id is not valid
        return res.status(404).json({ msg: "Post not found" }); // return error
        }
        res.status(500).send("Server Error"); // server error
    }
    });

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put("/like/:id", auth, async (req, res) => {
    // like a post
    try {
        const post = await Post.findById(req.params.id); // get post from db
    
        // Check if the post has already been liked
        if (
        post.likes.filter((like) => like.user.toString() === req.user.id).length >
        0
        ) {
        // if post has already been liked
        return res.status(400).json({ msg: "Post already liked" }); // return error
        }
    
        post.likes.unshift({ user: req.user.id }); // add like to post
    
        await post.save(); // save post to db
    
        res.json(post.likes); // return likes
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error"); // server error
    }
    });

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put("/unlike/:id", auth, async (req, res) => {
    // unlike a post
    try {
        const post = await Post.findById(req.params.id); // get post from db
    
        // Check if the post has not yet been liked
        if (
        post.likes.filter((like) => like.user.toString() === req.user.id)
            .length === 0
        ) {
        // if post has not yet been liked
        return res.status(400).json({ msg: "Post has not yet been liked" }); // return error
        }
    
        // Get remove index
        const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.user.id); // get index of like to be removed
    
        post.likes.splice(removeIndex, 1); // remove like from post
    
        await post.save(); // save post to db
    
        res.json(post.likes); // return likes
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error"); // server error
    }
    });

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private

router.post(
    "/comment/:id",
    [auth, [check("text", "Text is required").not().isEmpty()]], // check middleware
    async (req, res) => {
      // comment on a post
      const errors = validationResult(req); // check middleware
      if (!errors.isEmpty()) {
        // if there are errors
        return res.status(400).json({ errors: errors.array() }); // return errors
      }
  
      try {
        const user = await User.findById(req.user.id).select("-password"); // get user from db
        const post = await Post.findById(req.params.id); // get post from db
  
        const newComment = {
          // create new comment
          text: req.body.text, // get text from req.body
          name: user.name, // get name from user
          avatar: user.avatar, // get avatar from user
          user: req.user.id, // get user id from req.user
        };
  
        post.comments.unshift(newComment); // add comment to post
  
        await post.save(); // save post to db
  
        res.json(post.comments); // return comments
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error"); // server error
      }
    }
  );

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    // delete comment
    try {
        const post = await Post.findById(req.params.id); // get post from db
    
        // Pull out comment
        const comment = post.comments.find(
        (comment) => comment.id === req.params.comment_id
        ); // get comment from post
    
        // Make sure comment exists
        if (!comment) {
        // if no comment
        return res.status(404).json({ msg: "Comment does not exist" }); // return error
        }
    
        // Check user
        if (comment.user.toString() !== req.user.id) {
        // if user is not authorized
        return res.status(401).json({ msg: "User not authorized" }); // return error
        }
    
        // Get remove index
        const removeIndex = post.comments
        .map((comment) => comment.id)
        .indexOf(req.params.comment_id); // get index of comment to be removed
    
        post.comments.splice(removeIndex, 1); // remove comment from post
    
        await post.save(); // save post to db
    
        res.json(post.comments); // return comments
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error"); // server error
    }
    }
);

module.exports = router;














