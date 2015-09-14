'use strict';

angular.module('govtimeApp')
  .controller('MainCtrl', function($scope, $http, map, stateData) {
    map.setView([37.8, -96], 4);

    L.geoJson(stateData,  {
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
            if($scope.zoomed === true) return;
            fadeStyleForLayerFromTo(layer, 0.4, 1);
          },
          mouseout: function() {
            if($scope.zoomed === true) return;
            fadeStyleForLayerFromTo(layer, 1, 0.4);
          }
        });
      }
    }).addTo(map);

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
      var state = e.target.feature.properties.abbr;
      map.fitBounds(e.target.getBounds());
      fadeStyleForLayerFromTo(e.target, 0.4, 1);
      $scope.zoomed = !$scope.zoomed;
      if(!$scope.zoomed) map.setView([37.8, -96], 4);
    }

  });
