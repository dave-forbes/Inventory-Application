const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RecordCopySchema = new Schema({
  record: { type: Schema.Types.ObjectId, ref: "Record", required: true },
  condition: {
    type: String,
    enum: ["Poor", "Fair", "Good", "New"],
  },
  price: { type: String, required: true },
});

RecordCopySchema.virtual("url").get(function () {
  return `/catalog/recordcopy/${this._id}`;
});

module.exports = mongoose.model("RecordCopy", RecordCopySchema);
