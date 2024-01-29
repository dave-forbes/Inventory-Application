const RecordCopy = require("../models/recordCopy");
const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");

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
    filterType: "decade",
    years: allYears,
    genres: allGenres,
  });
});
