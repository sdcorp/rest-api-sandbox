const TestModel = require('../models/Test');
const { catchExpValidatorErrors } = require('../helpers/errorHandlers');

const { acceptOnlyJson, checkIfExist } = require('../helpers/customHandlers');

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
  const doc = await checkIfExist(id, TestModel);
  res.status(200).json({ doc });
};

exports.postData = async (req, res) => {
  // only json
  acceptOnlyJson(req);
  // validation
  catchExpValidatorErrors(req);
  const { email, tel } = req.body;
  // check if doc exist
  const doc = await TestModel.findOne({ email });
  if (doc) {
    const err = new Error('Doc with this email already exists');
    err.status = 400;
    throw err;
  }
  // add new doc to DB
  const newDoc = new TestModel({ email, tel });
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
  // check if doc in DB
  await checkIfExist(id, TestModel);
  // check if email not taken by someone else
  const isTaken = await TestModel.findOne({ email }); // TODO Make custom handlder
  if (isTaken && isTaken._id.toString() !== id) {
    const err = new Error(`This email is already taken`);
    err.status = 422;
    throw err;
  }
  // finally update the doc
  const updatedDoc = await TestModel.findByIdAndUpdate(id, { $set: { ...req.body } }, { new: true });
  res.status(200).json({ msg: 'Doc updated successfully', doc: updatedDoc });
};

exports.deleteSingleDoc = async (req, res) => {
  // validation params id
  catchExpValidatorErrors(req);
  const { id } = req.params;
  const doc = await checkIfExist(id, TestModel);
  const deleted = await TestModel.findByIdAndDelete(doc._id);
  res.status(200).json({ msg: 'Doc deleted successfully', doc: deleted });
};
