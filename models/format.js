const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FormatSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

FormatSchema.virtual("url").get(function () {
  return `/catalog/format/${this._id}`;
});

module.exports = mongoose.model("Format", FormatSchema);
