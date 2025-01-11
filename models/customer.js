const mongoose = require("mongoose");
const Joi = require('joi')


// Define the customers model
const Customer = mongoose.model(
    "Customer",
    new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    })
  );

  // Validation function for genre
function validateCustomer(customers) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    pnone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customers, schema);
}


exports.Customer = Customer;
exports.validate = validateCustomer;