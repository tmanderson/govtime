var WIKI_LANG = process.env.WIKI_LANG || 'en';

var _ = require('lodash');
var b = require('bluebird');
var fs = require('fs');
var jsdom = require('jsdom');
var wikihost = ['https://' + WIKI_LANG, 'wikipedia', 'org/wiki/'].join('.');

/**
 * *********************
 * CONVENIENCE METHODS
 * *********************
 */
function cleanText(text) {
  if(text === undefined || text === null) return '';
  return text.replace(/[-•\n\r\t]+|\s{2,}|\[[\w\d]+\]/g, '').replace(/(^\s+|\s+$)/, '');
}

function formatKey(text) {
  return text.toLowerCase().split('').reduce(function(txt, char, i) {
    if(char === ' ') return txt;
    return (txt + (text.charAt(i-1) === ' ' ? char.toUpperCase() : char));
  }, '').replace(/[^\w]/g, '');
}

function containsData(i, el) {
  return !!(cleanText(el.textContent).length);
}

/**
 * @class `DataStack`
 *
 * DataStack is used to keep track of a given amount of data per-wiki-page.
 * This is used since most Wikipedia pages have several informational tables,
 * this allows multiple tables to be resolved correctly.
 *
 * ## Instance Methods
 * @property {Object} `section` - The currently active section
 * @property {Array} `refstack` - Holds the parent-section of the currently active section
 * @property {Array} `data`     - Holds formatted data after processing (returned)
 */
function DataStack() {
  this.data = [];
  this.refstack = [];
  this.currentSection = {};
}

_.extend(DataStack.prototype, {
  /**
   * Creates a new dataset, this will create a new root section and add it to
   * the `data` property of this instance.
   */
  create: function() {
    this.refstack = [];
    this.currentSection = {};
    this.data.push(this.currentSection);
  },

  /**
   * Calling `section(name)` will create a new section if the name does not exist
   * on the currently active parent section, otherwise it will close the section
   * and set the active to the parent.
   *
   * @param  {String} name - The name of the section
   */
  section: function(name) {
    name = formatKey(cleanText(name));
    //  If this section doesn't exist on the parent map, create it anew
    if(name && !(this.refstack[this.refstack.length-1]||{})[name]) {
      console.log('CREATING SECTION %s', name);
      this.refstack.push(this.currentSection);
      this.currentSection = (this.currentSection[name] = {});
    }
    //  If the section was already created, then we're closing it off
    else if(this.refstack.length) {
      this.currentSection = this.refstack.pop();
    }
  },

  add: function(name, value) {
    this.currentSection[formatKey(cleanText(name))] = value;
    return name;
  },

  set: function(path, value) {
    _.set(this.currentSection, path, value);
  },

  done: function() {
    return this.data;
  }
});

/**
 * Understands wikitable layouts. These are generally straight-forwards tables
 * displaying datasets of some sort (usually 3-dimensions)
 */
function getDataTables($) {
  var data = new DataStack();

  $('.wikitable').each(function() {
    var i, key, tableName;
    var $values, $headers, $table = $(this);
    data.create();

    tableName = cleanText($table.find('caption, th:first-child:last-child').first().text());
    if(!tableName) tableName = cleanText($table.prevAll('h2,h3').first().text());
    data.section(tableName);

    $values = $table.find('tr > td:first-child, tr > th:first-child').map(function(i) {
      if(i === 0) return;
      return data.add($(this).text(), {});
    }).get();

    if(!$values.length) return;

    $headers = $table.find('tr:first-child th').map(function(i) {
      if(i === 0) return;
      key = formatKey(cleanText($(this).text()));
      for(i in data.currentSection) data.set([i, key].join('.'), null);
      return key;
    }).get();

    if(!$headers.length) return;

    $table.find('tbody tr').each(function(i) {
      var $this = $(this);
      if(!$this.find('td').length) return;
      var val;

      $this.children('th, td').each(function(i) {
        var $this = $(this);
        if(i === 0) return (val = formatKey(cleanText($this.text())));
        data.set([val, $headers[i-1]].join('.'), $this.text());
      });
    });
    ;
    data.section();
  });

  return data.done();
}

/**
 * Infobox parser with some nice parsing capabilities
 */
function getInfoBoxes($) {
  var data = new DataStack();

  $('.infobox:not(.collapsible)').each(function() {
    var $box = $(this);
    data.create();

    $box.find('tbody > tr').each(function() {
      var $row = $(this);
      if(!$row.closest('table').is($box)) return;
      var kids = $row.children('th, td').filter(containsData);

      switch(kids.length) {
        case 1:
          if(kids.first().is('th')) {
            if($row.is(':first-child')) {
              data.add('title', cleanText(kids.first().text()));
            }
            else {
              data.section();
              data.section(kids.first().text());
            }
          }
        break;
        case 2:
          if(kids.first().is('th')) data.section();
          if(/font\-size/.test($row.attr('style'))) data.section('footnotes');

          if(!kids.last().find('img').each(function() {
            data.add(kids.first().text(), {
              label: cleanText(kids.first().text()),
              value: cleanText($(this).attr('src'))
            });
          }).length) {
            data.add(kids.first().text(), {
              label: cleanText(kids.first().text()),
              value: cleanText(kids.last().text())
            });
          }
        break;
        default:
          // console.log('%s kids than planned!', kids.length ? 'More' : 'Less');
      }
    });
  });

  return data.done();
}

module.exports = {
  info: function getInfoBoxesForState(state) {
    var deferred = b.defer();

    jsdom.env({
      url: wikihost + state,
      scripts: [ 'http://code.jquery.com/jquery.js' ],
      done: function(err, window) {
        var $ = window.$;
        if(err) return deferred.reject(body);
        deferred.resolve(getInfoBoxes($));
      }
    });

    return deferred.promise;
  },

  data: function getDataTablesForState(state) {
    var deferred = b.defer();

    jsdom.env({
      url: wikihost + state,
      scripts: [ 'http://code.jquery.com/jquery.js' ],
      done: function(err, window) {
        var $ = window.$;
        if(err) return deferred.reject(body);
        deferred.resolve(getDataTables($));
      }
    });

    return deferred.promise;
  }
}
