
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')
const { Genre, validate } = require('../models/genre');
const mongoose = require('mongoose')
const express = require("express");
const router = express.Router();



// GET all genres
router.get("/", async(req, res, next) => {
  throw new Error('Could not get the genres.')
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// GET a genre by ID
router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send("Can't find a genre with the given ID.");
  res.send(genre);
});

// POST a new genre
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  await genre.save();
  res.send(genre);
});

// PUT (update) a genre
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) return res.status(404).send("Can't find a genre with the given ID.");
  res.send(genre);
});

// DELETE a genre
router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send("Can't find a genre with the given ID.");
  res.send(genre);
});

module.exports = router;
