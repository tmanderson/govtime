'use strict';

angular.module('govtimeApp')
  .factory('map', function ($http, $rootScope) {
    var map, state;

    L.mapbox.accessToken = 'pk.eyJ1IjoidG1hbmRlcnNvbiIsImEiOiI0MTZYSWpZIn0.6m4OASQYYp9RvjtlAPaTZg';
    map = L.mapbox.map('map', 'tmanderson.0cf325b2').setView([ 37.8, -96 ], 4);

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();

    $http.get('/data/states.json').then(function(res) {
      L.geoJson(res.data,  {
        style: function getStyle() {
          return {
            weight: 1,
            opacity: 1.0,
            color: 'black',
            fillOpacity: 0.4,
            fillColor: '#8BC34A'
          };
        },
        onEachFeature: function onEachFeature(feature, layer) {
          layer.on({
            click: zoomToFeature,
            mouseover: function() {
              if(state) return;
              fadeStyleForLayerFromTo(layer, 0.4, 1);
            },
            mouseout: function() {
              if(state) return;
              fadeStyleForLayerFromTo(layer, 1, 0.4);
            }
          });
        }
      })
      .addTo(map);

    });

    function fadeStyleForLayerFromTo(layer, from, to) {
      var dir = Math.round(from - to) * -1;
      var d = Math.abs(from - to)/2.5;
      var o = from;

      window.requestAnimationFrame(function fadeAnimation() {
        o += d * dir;

        if(dir < 0 && o > to || dir > 0 && o < to) {
          layer.setStyle({ fillOpacity: o });
          window.requestAnimationFrame(fadeAnimation);
        }
        else {
          layer.setStyle({ fillOpacity: to });
        }
      });
    }

    function zoomToFeature(e) {
      var abbr = e.target.feature.properties.abbr;

      map.fitBounds(e.target.getBounds());
      fadeStyleForLayerFromTo(e.target, 0.4, 1);

      state = state ? null : abbr;
      $rootScope.context = state;

      if(!state) {
        map.setView([37.8, -96], 4);
      }
    }

    return map;
  });
