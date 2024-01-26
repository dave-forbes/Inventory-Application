const RecordCopy = require("../models/recordCopy");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const Format = require("../models/format");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { body, validationResult } = require("express-validator");

// Display list of all artists.
exports.artist_list = asyncHandler(async (req, res, next) => {
  const allArtists = await Artist.find().exec();
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  const allYears = await Record.distinct("year");

  const firstLetter = req.params.id;
  const filteredArtists = allArtists.filter(
    (artist) => artist.name[0] === firstLetter
  );

  console.log(filteredArtists);

  res.render("index", {
    title: `All artists in ${firstLetter}`,
    years: allYears,
    genres: allGenres,
    artists: filteredArtists,
    listType: "artist",
  });
});

// Display detail page for a specific artist.
exports.artist_detail = asyncHandler(async (req, res, next) => {
  const allRecordCopies = await RecordCopy.find().populate("record").exec();
  const artist = await Artist.findById(req.params.id).exec();

  const artistToFilter = new ObjectId(req.params.id);

  // Filter records by artist
  const filteredRecords = allRecordCopies.filter((recordCopy) =>
    recordCopy.record.artist.equals(artistToFilter)
  );

  res.render("artist_detail", {
    artist: artist,
    record_copies: filteredRecords,
  });
});

// Display artist create form on GET.
exports.artist_create_get = asyncHandler(async (req, res, next) => {
  res.render("artist_create");
});

// Handle artist create on POST.
exports.artist_create_post = [
  body("name", "Artist name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const artist = new Artist({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("artist_create", {
        artist: artist,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if artist with same name already exists.
      const artistExists = await Artist.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (artistExists) {
        // artist exists, redirect to its detail page.
        res.redirect(artistExists.url);
      } else {
        await artist.save();
        // New artist saved. Redirect to artist detail page.
        res.redirect(artist.url);
      }
    }
  }),
];

// Display artist delete form on GET.
exports.artist_delete_get = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id).exec();

  res.render("artist_delete", {
    artist: artist,
  });
});

// Handle artist delete on POST.
exports.artist_delete_post = asyncHandler(async (req, res, next) => {
  await Artist.findByIdAndDelete(req.body.artistid);
  res.redirect("/");
});

// // Display artist update form on GET.
// exports.artist_update_get = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: artist update GET");
// });

// // Handle artist update on POST.
// exports.artist_update_post = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: artist update POST");
// });
