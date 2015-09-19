'use strict';

var _ = require('lodash');
var express = require('express');
var controller = require('./state.controller');
var request = require('request');

var router = express.Router();
var host = 'http://openstates.org/api/v1';
var apikey = process.env.SUNLIGHT_KEY || '878706002cd6425690499564e5c56da6';

router.get('*', function(req, res) {
  var path = req.originalUrl.replace('/api/states', '');
  path += (_.keys(req.query).length ? '&' : '?') + 'apikey=' + apikey;
  request.get(host + path).pipe(res);
});

module.exports = router;
