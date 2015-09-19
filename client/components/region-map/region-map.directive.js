'use strict';

angular.module('govtimeApp')
  .run(function() {
    L.mapbox.accessToken = 'pk.eyJ1IjoidG1hbmRlcnNvbiIsImEiOiI0MTZYSWpZIn0.6m4OASQYYp9RvjtlAPaTZg';
  })
  .directive('regionMap', function () {
    return {
      templateUrl: 'components/region-map/region-map.html',
      restrict: 'EA',
      replace: true,
      scope: {
        'geoFeatures': '=',
        'onFeatureSelect': '=',
        'selectedFeature': '='
      },
      link: function ($scope, element, attrs) {
        var map = L.mapbox.map('region-map', 'mapbox.satellite', { zoomControl: false });
        map.setView([ 33, -96 ], 4);

        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();

        function zoomToFeature(e) {
          var selected = e.target.feature.properties;

          if($scope.selectedFeature) {
            map.setView([37.8, -96], 4);
            $scope.selectedFeature = null;
          }
          else {
            map.fitBounds(e.target.getBounds());
            $scope.selectedFeature = selected;
          }

          $scope.onFeatureSelect($scope.selectedFeature);
        }

        L.geoJson($scope.geoFeatures,  {
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
              click: zoomToFeature
            });
          }
        })
        .addTo(map);
      }
    };
  });
