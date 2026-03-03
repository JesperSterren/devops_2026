// contact.model.js
const mongoose = require('mongoose');
// Setup schema
const contactSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  email: String,
  city: String,
  postalCode: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});
// Export Contact model
const Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;
module.exports.get = (callback, limit) => {
  Contact.find(callback).limit(limit);
};
