const RecordCopy = require("../models/recordCopy");
const asyncHandler = require("express-async-handler");

// Display list of all RecordCopies.
exports.recordcopy_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: RecordCopy list");
});

// Display detail page for a specific RecordCopy.
exports.recordcopy_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: RecordCopy detail: ${req.params.id}`);
});

// Display RecordCopy create form on GET.
exports.recordcopy_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: RecordCopy create GET");
});

// Handle RecordCopy create on POST.
exports.recordcopy_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: RecordCopy create POST");
});

// Display RecordCopy delete form on GET.
exports.recordcopy_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: RecordCopy delete GET");
});

// Handle RecordCopy delete on POST.
exports.recordcopy_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: RecordCopy delete POST");
});

// Display RecordCopy update form on GET.
exports.recordcopy_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: RecordCopy update GET");
});

// Handle bookinstance update on POST.
exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: RecordCopy update POST");
});
