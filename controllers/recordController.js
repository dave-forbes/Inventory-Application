const RecordCopy = require("../models/recordCopy");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const Format = require("../models/format");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const convertToArray = require("../convertToArray");
const path = require("path");

// Set up multer storage and specify the destination for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(
        "/Users/davidforbes/repos/Inventory-Application/",
        "public/images"
      )
    );
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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

// Handle record create on POST.
exports.record_create_post = [
  // upload image
  upload.single("image"),

  // convert tracklist to array
  (req, res, next) => {
    req.body.tracklist = convertToArray(req.body.tracklist);
    next();
  },

  // validate and sanitize data
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("artist", "Artist must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("tracklist.*").escape({ ignore: ["'"] }),
  body("genre", "Genre must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("format", "Format must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre", "Genre must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("year")
    .isInt({ min: 1920, max: 2024 })
    .withMessage("Catalog Number must be a number between 1920 and 2024"),

  // create new record and save to database
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const artist = await Artist.findOne({ name: req.body.artist }).exec();
    const genre = await Genre.findOne({ name: req.body.genre }).exec();
    const format = await Format.findOne({ name: req.body.format }).exec();

    // Create a Record object with escaped and trimmed data.
    const record = new Record({
      title: req.body.title,
      artist: artist._id,
      tracklist: req.body.tracklist,
      format: format._id,
      genre: genre._id,
      img: `/images/${req.file.filename}`,
      year: req.body.year,
    });
    if (!errors.isEmpty()) {
      res.render("record_create", {
        artists: allArtists,
        genres: allGenres,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save record.
      await record.save();
      res.redirect(record.url);
    }
  }),
];

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
