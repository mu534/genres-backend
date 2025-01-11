const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const { number } = require("joi");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});
router.post("/", async (req, res) => {
  const { error } = validate(req, body);
  if (error) return res.statusCode(400).send(error.detail[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.statusCode(400).send("Invalid genre.");
  
const  movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
});


router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!movie) return res.status(404).send("Can't find a movie with the given ID.");
  res.send(movie);
});


router.delete("/:id", async (req, res) => {
  const movie = await Genre.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("Can't find a movie with the given ID.");
  res.send(movie);
});

// Validation function for movies
function validateMovie(genre) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(movie, schema);
}
module.exports = router;