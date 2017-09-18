var express = require('express');
var router = express.Router();
var Song = require("../models").Song;

// Default View
/* GET list of all songs in alphabetical order */
router.get('/', function(req, res, next) {
  Song.findAll({order: [["title", "ASC"]]}).then(function(songs){
    res.render("library/index", {songs: songs, title: "JAMsync"});
  }).catch(function(error){
      res.status(500).send(error);
   });
});

/* GET list of all songs in alphabetical by artist order */
router.get('/artists', function(req, res, next) {
  Song.findAll({order: [["artist", "ASC"]]}).then(function(songs){
    res.render("library/index", {songs: songs, title: "JAMsync"});
  }).catch(function(error){
      res.status(500).send(error);
   });
});

/* GET list of all songs in alphabetical by artist order */
router.get('/albums', function(req, res, next) {
  Song.findAll({order: [["album", "ASC"]]}).then(function(songs){
    res.render("library/index", {songs: songs, title: "JAMsync"});
  }).catch(function(error){
      res.status(500).send(error);
   });
});

/* SEARCH for songs. */
router.get("/search", function(req, res, next){
	console.log(req.query.search)
	Song.findAll ({
		where: {
			$or: [
				{
					title: {
						$like: '%' + req.query.search + "%"
					}
				},
				{
					artist: {
						$like: '%' + req.query.search + "%"
					}
				},
				{
					album: {
						$like: '%' + req.query.search + "%"
					}
				},
				{
					genre: {
						$like: '%' + req.query.search + "%"
					}
				}
			]
		}
	})
	.then(function(songs){
		    res.render("library/index", {songs: songs, title: "JAMsync"});
	}).catch(function(error){
	      res.send(500, error);
	   });
});






/* POST add a new song. */
router.post('/', function(req, res, next) {
  Song.create(req.body).then(function(song) {
    res.redirect("/library/" + song.id);
  }).catch(function(error){
      if(error.name === "SequelizeValidationError") {
        res.render("library/new", {song: Song.build(req.body), errors: error.errors, title: "New Song"})
      } else {
        throw error;
      }
  }).catch(function(error){
      res.send(500, error);
   });
;});

/* Add a new song form. */
router.get('/new', function(req, res, next) {
  res.render("library/new", {song: {}, title: "New Song", artist: "Artist Name", album: "Album Name", genre: "genre"});
});

/* GET individual song. */
router.get("/:id", function(req, res, next){
  Song.findById(req.params.id).then(function(song){
    if(song) {
      res.render("library/show", {song: song, title: song.title});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});


/* Delete song form. */
router.get("/:id/delete", function(req, res, next){
  Song.findById(req.params.id).then(function(song){
    if(song) {
      res.render("library/delete", {song: song, title: "Delete Song"});
    } else {
      res.send(404);
    }
  }).catch(function(error){
      res.send(500, error);
   });
});


/* DELETE individual song. */
router.delete("/:id", function(req, res, next){
  Song.findById(req.params.id).then(function(song){
    if(song) {
      return song.destroy();
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect("/library");
  }).catch(function(error){
      res.send(500, error);
   });
});


module.exports = router;