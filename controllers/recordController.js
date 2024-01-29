const RecordCopy = require("../models/recordCopy");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const Format = require("../models/format");
const { body, validationResult } = require("express-validator");
const convertToArray = require("../javascripts/convertToArray");
const upload = require("../javascripts/multerSetup");
const path = require("path");
const fs = require("fs");
const arrayShuffle = require("../javascripts/arrayShuffle");

// Display list of all records.
exports.index = asyncHandler(async (req, res, next) => {
  const [allRecordCopies, allGenres, allYears] = await Promise.all([
    RecordCopy.find().populate("record").exec(),
    Genre.find().sort({ name: 1 }).exec(),
    Record.distinct("year"),
  ]);

  res.render("index", {
    title: "All records copies in stock",
    recordCopies: arrayShuffle(allRecordCopies),
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
    toDelete: false,
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
    title: "New Record",
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

  (req, res, next) => {
    //unescape apostrophes
    req.body.tracklist = req.body.tracklist.map((track) => {
      return track.replaceAll("&#x27;", "'");
    });
    next();
  },

  // create new record and save to database
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const [artist, genre, format] = await Promise.all([
      Artist.findById(req.body.artist).exec(),
      Genre.findById(req.body.genre).exec(),
      Format.findOne({ name: req.body.format }).exec(),
    ]);

    const imagePath = req.file
      ? `/images/${req.file.filename}`
      : "/images/default_cover_image.jpeg";

    // Create a Record object with escaped and trimmed data.
    const record = new Record({
      title: req.body.title,
      artist: artist._id,
      tracklist: req.body.tracklist,
      format: format._id,
      genre: genre._id,
      img: imagePath,
      year: req.body.year,
    });
    if (!errors.isEmpty()) {
      const [allArtists, allGenres] = await Promise.all([
        Artist.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);
      res.render("record_create", {
        artists: allArtists,
        genres: allGenres,
        title: "New Record",
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save record.
      await record.save();
      res.redirect(record.url);
    }
  }),
];

// Display record delete form on GET.
exports.record_delete_get = asyncHandler(async (req, res, next) => {
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
    toDelete: true,
  });
});

// Handle record delete on POST.
exports.record_delete_post = asyncHandler(async (req, res, next) => {
  try {
    const recordId = req.params.id;

    // Fetch the record from the database to get the associated image filename
    const record = await Record.findById(recordId);

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    const parentDir = path.resolve(__dirname, "..");

    // Delete the associated image file
    const imagePath = path.join(parentDir, "public", record.img);
    const defaultImagePath = path.join(
      parentDir,
      "public",
      "/images/default_cover_image.jpeg"
    );

    if (imagePath !== defaultImagePath) {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Image deleted successfully");
      } else {
        console.log("Image not found");
      }
    }

    // Delete the record from the database
    await Record.findByIdAndDelete(recordId);
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.render("error", { error: error });
  }
});

// Display record update form on GET.
exports.record_update_get = asyncHandler(async (req, res, next) => {
  const [allArtists, allGenres, record] = await Promise.all([
    Artist.find().sort({ name: 1 }).exec(),
    Genre.find().sort({ name: 1 }).exec(),
    Record.findById(req.params.id),
  ]);

  const tracklist = record.tracklist.join(", ");

  res.render("record_create", {
    artists: allArtists,
    genres: allGenres,
    title: "Update Record",
    record: record,
    tracklist: tracklist,
  });
});

// Handle record update on POST.
exports.record_update_post = [
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

  (req, res, next) => {
    //unescape apostrophes
    req.body.tracklist = req.body.tracklist.map((track) => {
      return track.replaceAll("&#x27;", "'");
    });
    next();
  },

  // create new record and save to database
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const [allArtists, allGenres, record] = await Promise.all([
        Artist.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
        Record.findById(req.params.id),
      ]);
      res.render("record_create", {
        artists: allArtists,
        genres: allGenres,
        title: "Update Record",
        record: record,
      });
    } else {
      const [artist, genre, format, record] = await Promise.all([
        Artist.findById(req.body.artist).exec(),
        Genre.findById(req.body.genre).exec(),
        Format.findOne({ name: req.body.format }).exec(),
        Record.findById(req.params.id).exec(),
      ]);
      // Create a Record object with escaped and trimmed data.

      const imagePath = req.file ? `/images/${req.file.filename}` : record.img;

      await Record.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        artist: artist._id,
        tracklist: req.body.tracklist,
        format: format._id,
        genre: genre._id,
        img: imagePath,
        year: req.body.year,
      });

      res.redirect(record.url);
    }
  }),
];
