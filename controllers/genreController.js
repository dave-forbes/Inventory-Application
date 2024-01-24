const RecordCopy = require("../models/recordCopy");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const Format = require("../models/format");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { body, validationResult } = require("express-validator");

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
    filterType: "Genre",
    years: allYears,
    genres: allGenres,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("genre_create");
});

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_create", {
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

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
