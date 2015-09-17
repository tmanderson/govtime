'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var InfoSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Info', InfoSchema);