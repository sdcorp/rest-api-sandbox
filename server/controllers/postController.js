const mongoose = require('mongoose');
const HttpError = require('http-errors');
const { checkIfExist, acceptOnlyJson } = require('../utils/customHandlers');

const Post = mongoose.model('Post');
const User = mongoose.model('User');

exports.getPosts = async (req, res) => {
  const posts = await Post.find().populate('author', { password: 0, posts: 0 });
  if (!posts) {
    throw new HttpError[404]('Cannot get posts');
  }
  res.status(200).json({ message: 'Posts loaded successfully', data: posts });
};

exports.getSinglePost = async (req, res) => {
  const { id } = req.params;
  const post = await checkIfExist({ id }, Post, { entity: 'Post' });
  res.status(200).json({ message: 'Post loaded successfully', data: post });
};

exports.createPost = async (req, res) => {
  acceptOnlyJson(req);
  const { title, text } = req.body;

  // add new post to DB
  const post = new Post({ title, text, author: req.userId });
  const storedPost = await post.save();

  const user = await User.findById(req.userId);
  user.posts.push(post);
  await user.save();

  res.status(201).json({ message: 'Post created successfully!', data: storedPost });
};

exports.editSinglePost = async (req, res) => {
  acceptOnlyJson(req);
  const { id } = req.params;
  const { title, text } = req.body;

  const post = await Post.findById(id);
  if (!post) {
    throw new HttpError[404]('Post not found');
  }

  // check author
  if (post.author.toString() !== req.userId.toString()) {
    throw new HttpError[403]('You have not permissions to this operation');
  }

  // update the post
  const updatedPost = await Post.findByIdAndUpdate(id, { $set: { title, text } }, { new: true });
  if (!updatedPost) {
    throw new HttpError[400]('Updating failed');
  }

  res.status(200).json({ message: 'Post updated successfully', data: updatedPost });
};

exports.deleteSinglePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    throw new HttpError[404]('Post not found');
  }
  // check author
  if (post.author.toString() !== req.userId.toString()) {
    throw new HttpError[403]('You have not permissions to this operation');
  }

  // author confirmed - delete post
  await Post.findByIdAndRemove(id);

  // delete post from user model
  const user = await User.findById(req.userId);
  user.posts.pull(id);
  await user.save();

  res.status(200).json({ message: 'Post deleted successfully' });
};
