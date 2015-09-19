'use strict';

angular.module('govtimeApp')
  .factory('map', function ($http, $rootScope) {
    var map, state;

    L.mapbox.accessToken = 'pk.eyJ1IjoidG1hbmRlcnNvbiIsImEiOiI0MTZYSWpZIn0.6m4OASQYYp9RvjtlAPaTZg';
    map = L.mapbox.map('map', 'mapbox.satellite', { zoomControl: false }).setView([ 33, -96 ], 4);

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
      var selected = e.target.feature.properties;

      if(state && selected.abbr !== state) return;

      fadeStyleForLayerFromTo(e.target, 0.4, 1);
      state = state ? null : selected.abbr;

      if(!state) {
        map.setView([37.8, -96], 4);
        $rootScope.region = 'national';
      }
      else {
        map.fitBounds(e.target.getBounds());
        $rootScope.region = selected.name;
      }
    }

    return map;
  });
