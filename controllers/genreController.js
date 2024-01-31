const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const { body, validationResult } = require("express-validator");
const passwordCheck = require("../javascripts/passwordCheck");
const getIndexData = require("../javascripts/getIndexData");

const renderGenreIndex = async (res, genreId) => {
  const { allRecordCopies, allGenres, uniqueDecades } = await getIndexData();

  const genreToFilter = new ObjectId(genreId);

  const genre = await Genre.findById(genreToFilter);

  // Filter records by genre
  const filteredRecords = allRecordCopies.filter((recordCopy) =>
    recordCopy.record.genre.equals(genreToFilter)
  );

  res.render("index", {
    title: `All ${genre.name} records in stock`,
    recordCopies: filteredRecords,
    filterType: "genre",
    id: genreId,
    decades: uniqueDecades,
    genres: allGenres,
  });
};

// Display all record copies for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  await renderGenreIndex(res, req.params.id);
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("genre_create", { title: "New Genre" });
});

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  (req, res, next) => {
    //unescape apostrophes
    req.body.name = req.body.name.replaceAll("&#x27;", "'");
    next();
  },

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_create", {
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  res.render("genre_delete", { genre: genre });
});

// Handle Genre delete on POST.
exports.genre_delete_post = [
  (req, res, next) => passwordCheck(req, res, next),

  asyncHandler(async (req, res, next) => {
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/");
  }),
];

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);
  res.render("genre_create", { title: "Update Genre", genre: genre });
});

// Handle Genre update on POST.
exports.genre_update_post = [
  (req, res, next) => passwordCheck(req, res, next),

  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  (req, res, next) => {
    //unescape apostrophes
    req.body.name = req.body.name.replaceAll("&#x27;", "'");
    next();
  },

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const genre = await Genre.findById(req.params.id);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_create", {
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name });

      await renderGenreIndex(res, req.params.id);
    }
  }),
];
