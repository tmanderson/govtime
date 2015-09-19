var _ = require('lodash');
var b = require('bluebird');
var req = require('request');
var cheerio = require('cheerio');
var deferred;

function cleanText(text) {
  return _.trim(
    text.replace(/\[[\d\w]+\]/g, '')
      .replace(/\n\r\t•/g, '')
        .replace(/^\s*[-•]|[-•]\s*$/g, '') );
}

function getInfo(title, callback) {
  req.get('https://en.wikipedia.org/wiki/' + title, function(err, res, body) {
    var $ = cheerio.load(body);
    var section, cells, subsec, text;
    var output = {};

    /**
     * parses the `vcard infobox` (the main wikipedia infobox, the first one),
     * and attempts to consistently format most US national and state pages.
     */
    $('table.infobox.vcard').each(function() {
      var $this = $(this);
      output.title = title;

      $this.find('tr th:first-child, tr td[colspan], tr.mergedrow td[style]').slice(1)
        .each(function() {
          $this.parent().addClass('SECTION');
        }).each(function() {
          var $this = $(this);
          section = _.camelCase(cleanText($this.text()));
          output[section] = [];
          cells = {};

          if($this.next().text()) {
            output[section].push(cleanText($this.next().text()));
          }

          if(!$this.parent().next('.SECTION').length) return;

          $this.parent().nextUntil('.SECTION')
            .find('td:last-child')
            .each(function() {
              subsec = _.camelCase(cleanText($(this).prev().text()));
              cells[subsec] = cleanText($(this).text());
            });

          if(_.keys(cells).length) output[section].push(cells);
        });
    });

    if(_.keys(output).indexOf('') > -1) {
      _.extend(output, _.first([].concat(output[''])));
      delete output[''];
    }

    callback(
      _.mapValues(output, function(val, k) {
        if(val.length === 1) val = val[0];
        if(_.isString(val) && val.indexOf('\n') > -1)  val = val.split('\n');
        return val;
      })
    );
  });
}

_.extend(module.exports, {
  get: function(page) {
    deferred = b.defer();
    getInfo(page, deferred.resolve.bind(deferred));
    return deferred.promise;
  }
});
