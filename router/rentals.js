const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const Transaction = require("mongoose-transactions");  // Import mongoose-transactions
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const rental = await Rental.find().sort("-dateOut");
  res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Find customer by ID
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  // Find movie by ID
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  // Check if the movie is in stock
  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  // Create rental object
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,  
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // Initialize a transaction
  const transaction = new Transaction();

  try {
    // Add operations to the transaction
    transaction.insert("rentals", rental);  // Save the rental
    transaction.update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } });  // Update movie stock

    // Run the transaction
    await transaction.run();

    // Send the response after successful transaction
    res.send(rental);
  } catch (ex) {
    // Abort transaction in case of error
    await transaction.abort();
    res.status(500).send("Something failed");
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send("Can't find a rental with the given ID.");
  res.send(rental);
});

module.exports = router;
