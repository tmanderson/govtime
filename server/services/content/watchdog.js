var _ = require('lodash');
var b = require('bluebird');
var xml2js = require('xml2js');
var request = require('request');
var feedUrl = _.template('http://watchdog.org/category/<%=state%>/feed/');

/**
 * Get the watchdog feed for the given `state`
 * @param  {String} state   The full name of the state (case-insensitive)
 * @return {Promise}        Resolves with the state's watchdog feed
 */
function getNewsForState(state) {
  var parser = new xml2js.Parser();
  var deferred = b.defer();

  request.get(feedUrl({ state: state }), function(err, res, body) {
    if(err) return deferred.reject(err);

    parser.parseString(body, function(err, result) {
      if(err) return deferred.reject(err);

      deferred.resolve(
        _.map(
          result.rss.channel[0].item, function(item) {
            return _.mapValues(
              _.pick(
                _.mapKeys(item, function(val, key) {
                  switch(key) {
                    case 'dc:creator': return 'source';
                    case 'pubDate': return 'date';
                    case 'content:encoded': return 'content';
                    default: return key;
                  }
                }),
                'title', 'link', 'date', 'description', 'content'
              ),
              _.first
            );
          }
        )
      );
    });
  });

  return deferred.promise;
}

module.exports = getNewsForState;
