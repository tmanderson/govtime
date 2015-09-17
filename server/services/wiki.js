var _ = require('lodash');
var b = require('bluebird');
var jsdom = require('jsdom');
var infobox = require('wiki-infobox');
var WikiFetch = require('wikifetch').WikiFetch;
var fs = require('fs')
var deferred, wiki;

var fn = '$.fn.findDeepest = function() { var results = []; this.each(function() { var deepLevel = 0; var deepNode = this; treeWalkFast(this, function(node, level) { if (level > deepLevel) { deepLevel = level; deepNode = node; } }); results.push(deepNode); }); return this.pushStack(results);};';

function getInfo(title, callback) {
  jsdom.env({
    url: 'https://en.wikipedia.org/wiki/' + _.snakeCase(title),
    src: [ fs.readFileSync('node_modules/jquery/dist/jquery.js').toString() + fn ],
    done: function(err, window) {
      var $this, $children, entry, mergedEls, key;
      var $ = window.$, j = 0, output = {};

      $('table.infobox > tbody > tr').each(function(i) {
        if(i < j) return;

        $this = $(this);
        $children = $this.children();
        key = _.trim($children[0].textContent);
        entry = [];

        entry.push(_.trim($this.find('td:last').parent().children().slice(1).text()));

        if($this.is('.mergedtoprow')) {
          if($this.next().is('.mergedbottomrow')) {
            entry.push( _.trim($this.next().find('td:last').text()) );
            j++;
          }
          else {
            entry.push(_.trim(
              $this.nextUntil('.mergedbottomrow').find('td:last').each(function() {
                $(this).parent().children().slice(1).each(function() {
                  entry.push(_.trim(this.textContent));
                });
              })
              .last().next().find('td:last').text())
            );
          }
        }
        else if($this.next().is('.mergedrow')) {
          mergedEls = $this.nextUntil('.mergedbottomrow');
          j += mergedEls.length;

          mergedEls.find('td:last').each(function() {
            $(this).parent().children().slice(1).each(function() {
              entry.push(_.trim(this.textContent));
            });
          });
        }

        output[key] = entry;
        j++;
      });

      callback(_.mapValues(output, function(vals) { return _.filter(vals, _.identity); }));
    }
  });
}

_.extend(module.exports, {
  get: function(page) {
    deferred = b.defer();
    getInfo(page, deferred.resolve.bind(deferred));
    return deferred.promise;
  }
});
