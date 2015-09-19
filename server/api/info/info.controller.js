'use strict';

var _ = require('lodash');
var Info = require('./info.model');
var wiki = require('../../services/wiki');

// Get list of infos
exports.index = function(req, res) {
  wiki.get('United States').then(function(info) {
    res.status(200).json(info);
  }, function(err) {
    res.status(500).json(err);
  });
};

// Get a single info
exports.show = function(req, res) {
  wiki.get(req.params.id).then(function(info) {
    res.status(200).json(info);
  }, function(err) {
    res.status(500).json(err);
  });
};

// Creates a new info in the DB.
exports.create = function(req, res) {
  Info.create(req.body, function(err, info) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(info);
  });
};

// Updates an existing info in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Info.findById(req.params.id, function (err, info) {
    if (err) { return handleError(res, err); }
    if(!info) { return res.status(404).send('Not Found'); }
    var updated = _.merge(info, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(info);
    });
  });
};

// Deletes a info from the DB.
exports.destroy = function(req, res) {
  Info.findById(req.params.id, function (err, info) {
    if(err) { return handleError(res, err); }
    if(!info) { return res.status(404).send('Not Found'); }
    info.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
