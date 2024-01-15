const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecordInstanceSchema = new Schema({
  record: { type: Schema.Types.ObjectId, ref: "Record", required: true },
  condition: {
    type: String,
    enum: ["Poor", "Fair", "Good", "New"],
  },
  price: { type: String, required: true },
});

RecordInstanceSchema.virtual("url").get(function () {
  return `/catalog/recordinstance/${this._id}`;
});

module.exports = mongoose.model("RecordInstance", RecordInstanceSchema);
