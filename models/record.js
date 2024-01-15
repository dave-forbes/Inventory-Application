const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecordSchema = new Schema({
  title: { type: String, required: true },
  artist: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
  tracklist: [{ type: String, required: true }],
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  format: { type: Schema.Types.ObjectId, ref: "Format", required: true },
  img: { type: String },
  release_date: { type: Date, default: Date.now },
});

RecordSchema.virtual("url").get(function () {
  return `/catalog/record/${this._id}`;
});

module.exports = mongoose.model("Record", RecordSchema);
