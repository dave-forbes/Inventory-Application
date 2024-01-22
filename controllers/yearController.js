const RecordCopy = require("../models/recordCopy");
const Artist = require("../models/artist");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const Format = require("../models/format");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Display detail page for a specific Genre.
exports.year_list = asyncHandler(async (req, res, next) => {
  const allRecordCopies = await RecordCopy.find().populate("record").exec();
  const allGenres = await Genre.find().sort({ name: 1 }).exec();
  const allYears = await Record.distinct("year");

  const year = req.params.id;
  const decade = req.params.id[2];

  // Filter records by genre
  const filteredRecords = allRecordCopies.filter(
    (recordCopy) => recordCopy.record.year.toString()[2] === decade
  );

  res.render("index", {
    title: `All ${year}s records in stock`,
    recordCopies: filteredRecords,
    years: allYears,
    genres: allGenres,
  });
});
