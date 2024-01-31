const RecordCopy = require("../models/recordCopy");
const Genre = require("../models/genre");
const Record = require("../models/record");

const getIndexData = async () => {
  const [allRecordCopies, allGenres, allYears] = await Promise.all([
    RecordCopy.find().populate("record").exec(),
    Genre.find().sort({ name: 1 }).exec(),
    Record.distinct("year"),
  ]);

  const getUniqueDecades = (array) => {
    const decades = array.map((item) =>
      item.toString().slice(0, 3).concat("0")
    );
    return [...new Set(decades)];
  };

  const uniqueDecades = getUniqueDecades(allYears);

  return { allRecordCopies, allGenres, uniqueDecades };
};

module.exports = getIndexData;
