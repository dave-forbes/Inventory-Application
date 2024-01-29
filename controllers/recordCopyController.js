const RecordCopy = require("../models/recordCopy");
const asyncHandler = require("express-async-handler");
const Record = require("../models/record");
const Artist = require("../models/artist");
const { body, validationResult } = require("express-validator");

// // Display list of all RecordCopies.
// exports.recordcopy_list = asyncHandler(async (req, res, next) => {
//   res.send("NOT IMPLEMENTED: RecordCopy list");
// });

// Display detail page for a specific RecordCopy.
exports.recordcopy_detail = asyncHandler(async (req, res, next) => {
  const recordCopy = await RecordCopy.findById(req.params.id)
    .populate("record")
    .exec();
  const artist = await Artist.findById(recordCopy.record.artist);

  if (recordCopy === null) {
    // No results.
    const err = new Error("Book copy not found");
    err.status = 404;
    return next(err);
  }

  res.render("recordcopy_detail", {
    artist: artist,
    recordCopy: recordCopy,
    toDelete: false,
  });
});

// Display RecordCopy create form on GET.
exports.recordcopy_create_get = asyncHandler(async (req, res, next) => {
  const allRecords = await Record.find()
    .populate("artist")
    .populate("genre")
    .exec();
  res.render("recordcopy_create", { record_list: allRecords });
});

// Handle RecordCopy create on POST.
exports.recordcopy_create_post = [
  // Validate and sanitize fields.
  body("record", "Record must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("catalogNum")
    .isInt({ min: 1, max: 100000 })
    .withMessage("Catalog Number must be a number between 1 and 100000"),
  body("condition").escape(),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create a BookInstance object with escaped and trimmed data.
    const recordCopy = new RecordCopy({
      record: req.body.record,
      catalogNum: req.body.catalogNum,
      condition: req.body.condition,
      price: req.body.price,
    });

    if (!errors.isEmpty()) {
      // There are errors.
      // Render form again with sanitized values and error messages.
      const allRecords = await Record.find()
        .populate("artist")
        .populate("genre")
        .exec();

      res.render("recordCopy_create", {
        record_list: allRecords,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid
      await recordCopy.save();
      res.redirect(recordCopy.url);
    }
  }),
];

// Display RecordCopy delete form on GET.
exports.recordcopy_delete_get = asyncHandler(async (req, res, next) => {
  const recordCopy = await RecordCopy.findById(req.params.id)
    .populate("record")
    .exec();
  const artist = await Artist.findById(recordCopy.record.artist);

  res.render("recordcopy_detail", {
    artist: artist,
    recordCopy: recordCopy,
    toDelete: true,
  });
});

// Handle RecordCopy delete on POST.
exports.recordcopy_delete_post = asyncHandler(async (req, res, next) => {
  await RecordCopy.findByIdAndDelete(req.body.recordcopyid);
  res.redirect("/");
});

// Display RecordCopy update form on GET.
exports.recordcopy_update_get = asyncHandler(async (req, res, next) => {
  const recordCopy = await RecordCopy.findById(req.params.id)
    .populate("record")
    .exec();
  const artist = await Artist.findById(recordCopy.record.artist);
  const allRecords = await Record.find()
    .populate("artist")
    .populate("genre")
    .exec();

  res.render("recordcopy_create", {
    record_list: allRecords,
    recordCopy: recordCopy,
    title: "Update Copy",
    artist: artist,
  });
});

// Handle RecordCopy update on POST.
exports.recordcopy_update_post = [
  // Validate and sanitize fields.
  body("record", "Record must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("catalogNum")
    .isInt({ min: 1, max: 100000 })
    .withMessage("Catalog Number must be a number between 1 and 100000"),
  body("condition").escape(),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const recordCopy = await RecordCopy.findById(req.params.id)
        .populate("record")
        .exec();
      const artist = await Artist.findById(recordCopy.record.artist);
      const allRecords = await Record.find()
        .populate("artist")
        .populate("genre")
        .exec();

      res.render("recordcopy_create", {
        record_list: allRecords,
        recordCopy: recordCopy,
        title: "Update Copy",
        artist: artist,
        errors: errors.errors,
      });
      return;
    } else {
      // Data from form is valid

      const recordCopy = await RecordCopy.findById(req.params.id);

      await RecordCopy.findByIdAndUpdate(req.params.id, {
        record: req.body.record,
        catalogNum: req.body.catalogNum,
        condition: req.body.condition,
        price: req.body.price,
      });

      res.redirect(recordCopy.url);
    }
  }),
];
