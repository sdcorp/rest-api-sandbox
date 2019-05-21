const { validationResult } = require('express-validator/check');
const TestModel = require('../models/Test');
const {
  catchExpValidatorErrors,
  acceptOnlyJson,
} = require('../handlers/errorHandlers');

// TODO Make check if exist also a separate handler (mb combine with Express Validator)

exports.getData = async (req, res) => {
  const docs = await TestModel.find();
  if (docs.length === 0) {
    const err = new Error('No Docs in DB');
    err.status = 404;
    throw err;
  }
  res.json({ docs });
};

exports.getSingleDoc = async (req, res) => {
  // validation params id
  catchExpValidatorErrors(req);
  const { id } = req.params;
  const doc = await TestModel.findById(id);
  // check if doc is not in DB.  we can do this in custom validator -> check('email').custom(cb)
  if (!doc) {
    const err = new Error(`Doc with id [${id}] not found`);
    err.status = 404;
    throw err;
  }
  res.status(200).json({ doc });
};

exports.postData = async (req, res) => {
  // only json
  acceptOnlyJson(req);
  // validation
  catchExpValidatorErrors(req);
  const { email } = req.body;
  // TODO we can do this in custom validator -> check('email').custom(cb)
  // check if doc exist OR
  const doc = await TestModel.findOne({ email });
  if (doc) {
    const err = new Error('Doc with this email already exists');
    err.status = 400;
    throw err;
  }
  // add new doc to DB
  const newDoc = new TestModel({ email });
  await newDoc.save();
  res.status(201).json({ msg: 'Doc added successfully!', doc: newDoc });
};

exports.editSingleDoc = async (req, res) => {
  // only json headers
  acceptOnlyJson(req);
  // validation params id
  catchExpValidatorErrors(req);
  const { id } = req.params;
  const { email } = req.body;
  const doc = await TestModel.findById(id);
  // check if doc is not in DB. we can do this in custom validator -> check('email').custom(cb)
  if (!doc) {
    const err = new Error(`Doc with id [${id}] not found`);
    err.status = 404;
    throw err;
  }
  // check if email not taken by someone else
  const isTaken = await TestModel.findOne({ email });
  if (isTaken && isTaken._id.toString() !== id) {
    const err = new Error(`This email is already taken`);
    err.status = 422;
    throw err;
  }

  // finally update the doc
  const updatedDoc = await TestModel.findByIdAndUpdate(
    id,
    { email },
    { new: true }
  );
  // result
  res.status(200).json({ msg: 'Doc updated successfully', doc: updatedDoc });
};

exports.deleteSingleDoc = async (req, res) => {
  // validation params id
  catchExpValidatorErrors(req);
  const { id } = req.params;
  const doc = await TestModel.findByIdAndDelete(id);
  // TODO we can do this in custom validator -> check('email').custom(cb)
  // check if doc is not in DB.
  if (!doc) {
    const err = new Error(`Doc with id [${id}] not found`);
    err.status = 404;
    throw err;
  }
  res.status(200).json({ msg: 'Doc deleted successfully', doc });
};
