const RecordCopy = require("../models/recordCopy");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const Format = require("../models/format");

// Display list of all records.
exports.index = asyncHandler(async (req, res, next) => {
  const allRecordCopies = await RecordCopy.find().populate("record").exec();
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  const allYears = await Record.distinct("year");

  res.render("index", {
    title: "All records in stock",
    recordCopies: allRecordCopies,
    years: allYears,
    genres: allGenres,
  });
});

// Display detail page for a specific record.
exports.record_detail = asyncHandler(async (req, res, next) => {
  const [record, recordCopies] = await Promise.all([
    Record.findById(req.params.id)
      .populate("artist")
      .populate("genre")
      .populate("format")
      .exec(),
    RecordCopy.find({ record: req.params.id }).exec(),
  ]);

  if (record === null) {
    // No results.
    const err = new Error("Record not found");
    err.status = 404;
    return next(err);
  }

  res.render("record_detail", {
    title: record.title,
    record: record,
    record_copies: recordCopies,
  });
});

// Display record create form on GET.
exports.record_create_get = asyncHandler(async (req, res, next) => {
  const [allArtists, allGenres] = await Promise.all([
    Artist.find().sort({ name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
  ]);
  res.render("record_create", {
    artists: allArtists,
    genres: allGenres,
  });
});

// // Handle book create on POST.
// exports.book_create_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Book create POST");
// });

// // Display book delete form on GET.
// exports.book_delete_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Book delete GET");
// });

// // Handle book delete on POST.
// exports.book_delete_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Book delete POST");
// });

// // Display book update form on GET.
// exports.book_update_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Book update GET");
// });

// // Handle book update on POST.
// exports.book_update_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Book update POST");
// })
