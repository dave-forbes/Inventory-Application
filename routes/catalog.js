const express = require("express");
const router = express.Router();

// Require controller modules.
const record_controller = require("../controllers/recordController");
const artist_controller = require("../controllers/artistController");
const genre_controller = require("../controllers/genreController");
const record_copy_controller = require("../controllers/recordCopyController");
const year_controller = require("../controllers/yearController");

/// record ROUTES ///

// GET catalog home page.
router.get("/", record_controller.index);

// GET request for creating a record. NOTE This must come before routes that display record (uses id).
router.get("/record/create", record_controller.record_create_get);

// POST request for creating record.
router.post("/record/create", record_controller.record_create_post);

// GET request to delete record.
router.get("/record/:id/delete", record_controller.record_delete_get);

// POST request to delete record.
router.post("/record/:id/delete", record_controller.record_delete_post);

// GET request to update record.
router.get("/record/:id/update", record_controller.record_update_get);

// POST request to update record.
router.post("/record/:id/update", record_controller.record_update_post);

// GET request for one record.
router.get("/record/:id", record_controller.record_detail);

// GET request for list of all record items.
// router.get("/records", record_controller.record_list);

/// AUTHOR ROUTES ///

// GET request for creating Artist. NOTE This must come before route for id (i.e. display artist).
router.get("/artist/create", artist_controller.artist_create_get);

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

// GET request for list of all artists, filtered by first letter.
router.get("/artists/:id", artist_controller.artist_list);

// /// GENRE ROUTES ///

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

// // GET request for list of all Genre.
// router.get("/genres", genre_controller.genre_list);

// /// recordINSTANCE ROUTES ///

// GET request for creating a record copy. NOTE This must come before route that displays RecordCopy (uses id).
router.get("/recordcopy/create", record_copy_controller.recordcopy_create_get);

// POST request for creating recordcopy.
router.post(
  "/recordcopy/create",
  record_copy_controller.recordcopy_create_post
);

// GET request to delete recordcopy.
router.get(
  "/recordcopy/:id/delete",
  record_copy_controller.recordcopy_delete_get
);

// POST request to delete recordcopy.
router.post(
  "/recordcopy/:id/delete",
  record_copy_controller.recordcopy_delete_post
);

// GET request to update recordcopy.
router.get(
  "/recordcopy/:id/update",
  record_copy_controller.recordcopy_update_get
);

// POST request to update recordcopy.
router.post(
  "/recordcopy/:id/update",
  record_copy_controller.recordcopy_update_post
);

// GET request for one recordcopy.
router.get("/recordcopy/:id", record_copy_controller.recordcopy_detail);

// // GET request for list of all recordcopy.
// router.get("/recordcopies", record_copy_controller.recordcopy_list);

router.get("/year/:id", year_controller.year_list);

module.exports = router;
