const Artist = require("../models/artist");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const passwordCheck = require("../javascripts/passwordCheck");
const getIndexData = require("../javascripts/getIndexData");

// Display list of all artists whose names start with selected letter.
exports.artist_list = asyncHandler(async (req, res, next) => {
  const { allGenres, uniqueDecades } = await getIndexData();
  const allArtists = await Artist.find().exec();

  const firstLetter = req.params.id;
  const filteredArtists = allArtists.filter(
    (artist) => artist.name[0] === firstLetter
  );

  res.render("index", {
    title: `All artists in ${firstLetter}`,
    decades: uniqueDecades,
    genres: allGenres,
    artists: filteredArtists,
    listType: "artist",
    firstLetter: firstLetter,
  });
});

const renderArtistIndex = async (res, artistid) => {
  const artist = await Artist.findById(artistid).exec();
  const { allRecordCopies, allGenres, uniqueDecades } = await getIndexData();

  const artistToFilter = new ObjectId(artistid);

  const filteredRecords = allRecordCopies.filter((recordCopy) =>
    recordCopy.record.artist.equals(artistToFilter)
  );

  res.render("index", {
    title: `All copies by artist ${artist.name} in stock`,
    recordCopies: filteredRecords,
    decades: uniqueDecades,
    genres: allGenres,
    filterType: "artist",
    id: artist._id,
  });
};

// Display records copies by specific artist in stock.
exports.artist_detail = asyncHandler(async (req, res, next) => {
  await renderArtistIndex(res, req.params.id);
});

// Display artist create form on GET.
exports.artist_create_get = asyncHandler(async (req, res, next) => {
  res.render("artist_create", { title: "New Artist" });
});

// Handle artist create on POST.
exports.artist_create_post = [
  body("name", "Artist name must contain at least 3 characters")
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
    const artist = new Artist({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("artist_create", {
        artist: artist,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if artist with same name already exists.
      const artistExists = await Artist.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (artistExists) {
        // artist exists, redirect to its detail page.
        res.redirect(artistExists.url);
      } else {
        await artist.save();
        // New artist saved. Redirect to artist detail page.
        res.redirect(artist.url);
      }
    }
  }),
];

// Display artist delete form on GET.
exports.artist_delete_get = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id).exec();

  res.render("artist_delete", {
    artist: artist,
  });
});

// Handle artist delete on POST.
exports.artist_delete_post = [
  (req, res, next) => passwordCheck(req, res, next),

  asyncHandler(async (req, res, next) => {
    await Artist.findByIdAndDelete(req.body.artistid);
    res.redirect("/");
  }),
];

// Display artist update form on GET.
exports.artist_update_get = asyncHandler(async (req, res, next) => {
  const artist = await Artist.findById(req.params.id);
  res.render("artist_create", { title: "Update Artist", artist: artist });
});

// Handle artist update on POST.
exports.artist_update_post = [
  (req, res, next) => passwordCheck(req, res, next),

  body("name", "Artist name must contain at least 3 characters")
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
    const artist = await Artist.findById(req.params.id);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("artist_create", {
        artist: artist,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await Artist.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
      });

      await renderArtistIndex(res, req.params.id);
    }
  }),
];
