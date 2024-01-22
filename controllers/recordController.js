const Record = require("../models/record");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");

// Display list of all records.
exports.index = asyncHandler(async (req, res, next) => {
  const allRecords = await Record.find()
    .sort({ title: 1 })
    .populate("artist")
    .populate("genre")
    .exec();
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  const allYears = await Record.distinct("year");

  res.render("index", {
    record_list: allRecords,
    years: allYears,
    genres: allGenres,
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
