import Post from "../models/Post.js";

// @desc Create a post
// @route POST /api/posts
// @access Protected
export const createPost = async (req, res) => {
  try {
    const { content, image, dog } = req.body;

    if (!content || !dog) {
      return res.status(400).json({ message: "Content and dog are required" });
    }

    const post = await Post.create({
      content,
      image,
      dog,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get feed posts
// @route GET /api/posts
// @access Public
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "email")
      .populate("dog", "name breed avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Like / Unlike post
// @route POST /api/posts/:id/like
// @access Protected
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString();

    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      postId: post._id,
      likesCount: post.likes.length,
      likedByUser: !alreadyLiked,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
