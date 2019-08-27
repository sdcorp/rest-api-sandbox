const HttpError = require('http-errors');
const Post = require('../models/Post');
const User = require('../models/User');
const { catchExpressValidatorErrors } = require('../helpers/customValidators');
const { checkIfExist } = require('../helpers/customHandlers');

// TODO Make check if exist also a separate handler (mb combine with Express Validator)

exports.getPosts = async (req, res) => {
  const posts = await Post.find().populate('author', { password: 0, posts: 0 });
  if (!posts) {
    throw new HttpError[404]('Cannot get posts');
  }
  res.status(200).json({ message: 'Posts loaded successfully', data: posts });
};

exports.getSinglePost = async (req, res) => {
  // validation params.id
  catchExpressValidatorErrors(req);
  const { id } = req.params;
  const post = await checkIfExist({ id }, Post, { entity: 'Post' });
  res.status(200).json({ message: 'Post loaded successfully', data: post });
};

exports.createPost = async (req, res) => {
  // validation
  catchExpressValidatorErrors(req);
  const { title, text } = req.body;
  const user = await User.findOne({ email: req.email });
  // add new post to DB
  const post = new Post({ title, text, author: user._id });
  user.posts.push(post);
  await user.save();
  await post.save();
  res.status(201).json({ message: 'Post created successfully!', data: post });
};

exports.editSinglePost = async (req, res) => {
  // validation params id
  catchExpressValidatorErrors(req);
  const { id } = req.params;
  const { title, text } = req.body;
  // update the post
  const updatedPost = await Post.findByIdAndUpdate(id, { $set: { title, text } }, { new: true });
  if (!updatedPost) {
    throw new HttpError[404]('Post not found or updating failed');
  }
  res.status(200).json({ message: 'Post updated successfully', data: updatedPost });
};

exports.deleteSinglePost = async (req, res) => {
  // validation params id
  catchExpressValidatorErrors(req);
  const { id } = req.params;
  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    throw new HttpError[404]('Post not found');
  }
  res.status(200).json({ message: 'Post deleted successfully' });
};
