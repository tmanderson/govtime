var _ = require('lodash');
var req = require('request');
var cheerio = require('cheerio');

req.get('https://en.wikipedia.org/wiki/' + process.argv[2], function(err, res, body) {
  var $ = cheerio.load(body);
  var section;
  var output = {};

  $('table.infobox tr').each(function() {
    section = _.trim($(this).find('th').text()) || section;
    if(!output[section]) output[section] = [];

    $(this).find('td').each(function() {
      var $this = $(this);

      if(/\w/.test($this.text())) {
        output[section].push(
          $this.text().replace(/\[[\d\w]+\]/g, '')
        );
      }
    });

    output[section] = _.filter(output[section], _.identity);
  });
  console.log(output);
  // console.log(_.mapValues(output, function(val) {
  //   if(val.length === 1) return val[0];

  //   if(val.length%2) {
  //     return _.zipObject(_.chunk(val.slice(1), 2));
  //   }

  //   return _.zipObject(_.chunk(val, 2));
  // }));
});
