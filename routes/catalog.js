const express = require("express");
const router = express.Router();

// Require controller modules.
const record_controller = require("../controllers/recordController");
const artist_controller = require("../controllers/artistController");
const genre_controller = require("../controllers/genreController");
const record_copy_controller = require("../controllers/recordCopyController");

/// BOOK ROUTES ///

// GET catalog home page.
router.get("/", record_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/book/create", record_controller.book_create_get);

// POST request for creating Book.
router.post("/book/create", record_controller.book_create_post);

// GET request to delete Book.
router.get("/book/:id/delete", record_controller.book_delete_get);

// POST request to delete Book.
router.post("/book/:id/delete", record_controller.book_delete_post);

// GET request to update Book.
router.get("/book/:id/update", record_controller.book_update_get);

// POST request to update Book.
router.post("/book/:id/update", record_controller.book_update_post);

// GET request for one Book.
router.get("/book/:id", record_controller.book_detail);

// GET request for list of all Book items.
router.get("/books", record_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/author/create", artist_controller.artist_create_get);

// POST request for creating artist.
router.post("/artist/create", artist_controller.artist_create_post);

// GET request to delete artist.
router.get("/artist/:id/delete", artist_controller.artist_delete_get);

// POST request to delete artist.
router.post("/artist/:id/delete", artist_controller.artist_delete_post);

// GET request to update artist.
router.get("/artist/:id/update", artist_controller.artist_update_get);

// POST request to update artist.
router.post("/artist/:id/update", artist_controller.artist_update_post);

// GET request for one artist.
router.get("/artist/:id", artist_controller.artist_detail);

// GET request for list of all artists.
router.get("/artists", artist_controller.artist_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

/// BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance. NOTE This must come before route that displays BookInstance (uses id).
router.get(
  "/bookinstance/create",
  record_copy_controller.bookinstance_create_get
);

// POST request for creating BookInstance.
router.post(
  "/bookinstance/create",
  record_copy_controller.bookinstance_create_post
);

// GET request to delete BookInstance.
router.get(
  "/bookinstance/:id/delete",
  record_copy_controller.bookinstance_delete_get
);

// POST request to delete BookInstance.
router.post(
  "/bookinstance/:id/delete",
  record_copy_controller.bookinstance_delete_post
);

// GET request to update BookInstance.
router.get(
  "/bookinstance/:id/update",
  record_copy_controller.bookinstance_update_get
);

// POST request to update BookInstance.
router.post(
  "/bookinstance/:id/update",
  record_copy_controller.bookinstance_update_post
);

// GET request for one BookInstance.
router.get("/bookinstance/:id", record_copy_controller.bookinstance_detail);

// GET request for list of all BookInstance.
router.get("/bookinstances", record_copy_controller.bookinstance_list);

module.exports = router;
