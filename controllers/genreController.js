const RecordCopy = require("../models/recordCopy");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const Format = require("../models/format");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// // Display list of all Genre.
// exports.genre_list = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Genre list");
// });

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const allRecordCopies = await RecordCopy.find().populate("record").exec();
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  const allYears = await Record.distinct("year");

  const genreToFilter = new ObjectId(req.params.id);

  const genre = await Genre.findOne({ _id: genreToFilter });

  // Filter records by genre
  const filteredRecords = allRecordCopies.filter((recordCopy) =>
    recordCopy.record.genre.equals(genreToFilter)
  );

  res.render("index", {
    title: `All ${genre.name} records in stock`,
    recordCopies: filteredRecords,
    years: allYears,
    genres: allGenres,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("genre_create");
});

// // Handle Genre create on POST.
// exports.genre_create_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Genre create POST");
// });

// // Display Genre delete form on GET.
// exports.genre_delete_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Genre delete GET");
// });

// // Handle Genre delete on POST.
// exports.genre_delete_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Genre delete POST");
// });

// // Display Genre update form on GET.
// exports.genre_update_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Genre update GET");
// });

// // Handle Genre update on POST.
// exports.genre_update_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: Genre update POST");
// });
