const RecordCopy = require("../models/recordCopy");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const Artist = require("../models/artist");

// // Display list of all RecordCopies.
// exports.recordcopy_list = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: RecordCopy list");
// });

// Display detail page for a specific RecordCopy.
exports.recordcopy_detail = asyncHandler(async (req, res, next) => {
  const recordCopy = await RecordCopy.findById(req.params.id)
    .populate("record")
    .exec();
  const artist = await Artist.findById(recordCopy.record.artist);

  if (recordCopy === null) {
    // No results.
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("recordcopy_detail", {
    artist: artist,
    recordCopy: recordCopy,
  });
});

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
