const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  photo: String, // image filename or URL
});

module.exports = mongoose.model('User', userSchema);
