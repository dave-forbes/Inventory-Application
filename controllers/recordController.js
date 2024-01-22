const Record = require("../models/record");
const asyncHandler = require("express-async-handler");

// Display list of all records.
exports.index = asyncHandler(async (req, res, next) => {
  const allRecords = await Record.find()
    .sort({ title: 1 })
    .populate("artist")
    .populate("genre")
    .limit(18)
    .exec();

  res.render("index", { record_list: allRecords });
});

// Display record create form on GET.
exports.record_create_get = asyncHandler(async (req, res, next) => {
  res.render("record_create", {
    artists: ["artist1", "artist2", "artist3"],
    formats: ["format1", "format2"],
  });
});
