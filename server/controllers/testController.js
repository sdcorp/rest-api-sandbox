const HttpError = require('http-errors');
const TestModel = require('../models/Test');
const { catchExpressValidatorErrors } = require('../helpers/customValidators');
const { checkIfExist } = require('../helpers/customHandlers');

// TODO Make check if exist also a separate handler (mb combine with Express Validator)

exports.getData = async (req, res) => {
  const docs = await TestModel.find();
  if (docs.length === 0) {
    throw new HttpError[404]('No Docs in DB');
  }
  res.json({ data: req.user, docs });
};

exports.getSingleDoc = async (req, res) => {
  // validation params.id
  catchExpressValidatorErrors(req);
  const { id } = req.params;
  const doc = await checkIfExist({ id }, TestModel);
  res.status(200).json({ doc });
};

exports.postData = async (req, res) => {
  // validation
  catchExpressValidatorErrors(req);
  const { uniqId, documentName } = req.body;
  // check if doc exist
  const doc = await TestModel.findOne({ uniqId });
  if (doc) {
    throw new HttpError[409]('Doc with this ID already exists');
  }
  // add new doc to DB
  const newDoc = new TestModel({ uniqId, documentName });
  await newDoc.save();
  res.status(201).json({ msg: 'Doc added successfully!', doc: newDoc });
};

exports.editSingleDoc = async (req, res) => {
  // validation params id
  catchExpressValidatorErrors(req);
  const { id } = req.params;
  const { documentName } = req.body;
  // check if doc in Model
  await checkIfExist({ value: id }, TestModel);
  // update the doc
  const updatedDoc = await TestModel.findByIdAndUpdate(id, { $set: { documentName } }, { new: true });
  res.status(200).json({ msg: 'Doc updated successfully', doc: updatedDoc });
};

exports.deleteSingleDoc = async (req, res) => {
  // validation params id
  catchExpressValidatorErrors(req);
  const { id } = req.params;
  const doc = await checkIfExist({ value: id }, TestModel);
  const deleted = await TestModel.findByIdAndDelete(doc._id);
  res.status(200).json({ msg: 'Doc deleted successfully', doc: deleted });
};
