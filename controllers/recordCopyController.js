const RecordCopy = require("../models/recordCopy");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");

// // Display list of all RecordCopies.
// exports.recordcopy_list = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: RecordCopy list");
// });

// // Display detail page for a specific RecordCopy.
// exports.recordcopy_detail = asyncHandler(async (req, res, next) => {
//   res.send(`NOT IMPLEMENTED: RecordCopy detail: ${req.params.id}`);
// });

// Display RecordCopy create form on GET.
exports.recordcopy_create_get = asyncHandler(async (req, res, next) => {
  const allRecords = await Record.find()
    .populate("artist")
    .populate("genre")
    .exec();
  res.render("recordcopy_create", { record_list: allRecords });
});

// // Handle RecordCopy create on POST.
// exports.recordcopy_create_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: RecordCopy create POST");
// });

// // Display RecordCopy delete form on GET.
// exports.recordcopy_delete_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: RecordCopy delete GET");
// });

// // Handle RecordCopy delete on POST.
// exports.recordcopy_delete_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: RecordCopy delete POST");
// });

// // Display RecordCopy update form on GET.
// exports.recordcopy_update_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: RecordCopy update GET");
// });

// // Handle RecordCopy update on POST.
// exports.recordcopy_update_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: RecordCopy update POST");
// });
