const asyncHandler = require("express-async-handler");
const getIndexData = require("../javascripts/getIndexData");

// Display detail page for a specific Genre.
exports.year_list = asyncHandler(async (req, res, next) => {
  const { allRecordCopies, allGenres, uniqueDecades } = await getIndexData();

  const year = req.params.id;
  const decade = req.params.id[2];

  // Filter records by decade
  const filteredRecords = allRecordCopies.filter(
    (recordCopy) => recordCopy.record.year.toString()[2] === decade
  );

  res.render("index", {
    title: `All ${year}s records in stock`,
    recordCopies: filteredRecords,
    filterType: "decade",
    decades: uniqueDecades,
    genres: allGenres,
  });
});
