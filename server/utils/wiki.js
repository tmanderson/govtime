var data = [];
var refstack = [];
var section;

function createSection(name) {
  if(!name) {
    refstack = [];
    data.push({});
    return (section = data[data.length-1]);
  }
  else if(!(refstack[refstack.length-1]||{})[name]) {
    console.log('CREATING SECTION %s', name);
    refstack.push(section);
    return (section = section[formatKey(name)] = {});
  }
}

function prevSection() {
  return (section = refstack.pop());
}

function cleanText(text) {
  return text.replace(/[-•\n\r\t]+|\s{2,}|\[[\w\d]+\]/g, '').replace(/(^\s+|\s+$)/, '');
}

function formatKey(text) {
  return text.toLowerCase().split('').reduce(function(txt, char, i) {
    if(char === ' ') return txt;
    return (txt + (text.charAt(i-1) === ' ' ? char.toUpperCase() : char));
  }, '').replace(/[^\w]/g, '');
}

function containsData() {
  return !!(cleanText($(this).text()).length);
}

/**
 * Understands wikitable layouts. These are generally straight-forwards tables
 * displaying datasets of some sort (usually 3-dimensions)
 */
function getDataTables() {
  var dataTables = {};

  $('.wikitable').each(function() {
    var i, key, data, tableName;
    var $values, $headers, $table = $(this);
    
    data = {};

    $values = $table.find('tr > td:first-child, tr > th:first-child').map(function(i) {
      if(i === 0) return;
      key = formatKey(cleanText($(this).text()));
      data[key] = {};
      return key;
    }).get();
    
    if(!$values.length) return;

    $headers = $table.find('tr:first-child th').map(function(i) {
      if(i === 0) return;
      key = formatKey(cleanText($(this).text()));
      for(i in data) data[i][key] = null;
      return key;
    }).get();

    if(!$headers.length) return;

    $table.find('tbody tr').each(function(i) {
      if(!$(this).find('td').length) return;
      var val;

      $(this).children('th, td').each(function(i) {
        if(i === 0) return (val = formatKey(cleanText($(this).text())));
        data[val][$headers[i-1]] = $(this).text();
      });
    });

    tableName = cleanText($table.find('caption, th:first-child:last-child').first().text());
    if(!tableName) tableName = cleanText($table.prevAll('h2,h3').first().text());
    dataTables[cleanText(tableName)] = data;
  }).get();

  return dataTables;
}

/**
 * Infobox parser with some nice parsing capabilities
 */
function getInfoBoxes() {
  $('.infobox').each(function() {
    var $box = $(this);
    createSection();

    $box.find('tbody > tr').each(function() {
      var $row = $(this);
      if(!$row.closest('table').is($box)) return;
      var kids = $row.children('th, td').filter(containsData);

      switch(kids.length) {
        case 1: 
          if(kids.first().is('th')) {
            if($row.is(':first-child')) {
              section.title = cleanText(kids.first().text());
            }
            else {
              if(refstack.length) prevSection();
              createSection(formatKey(cleanText(kids.first().text())));
            }
          }
        break;
        case 2:
          if(kids.first().is('th') && refstack.length) prevSection();
          if(/font\-size/.test($row.attr('style'))) createSection('footnotes');
          if(!kids.last().find('img').each(function() {
            section[formatKey(cleanText(kids.first().text()))] = {
              label: cleanText(kids.first().text()),
              value: cleanText($(this).attr('src'))
            };
          }).length) {
            section[formatKey(cleanText(kids.first().text()))] = {
              label: cleanText(kids.first().text()),
              value: cleanText(kids.last().text())
            };
          }
        break;
        default:
          console.log('%s kids than planned!', kids.length ? 'More' : 'Less');
      }
    });
  });

  return data;
}