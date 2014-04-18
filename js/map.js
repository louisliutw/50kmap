var Map = new function CanvasMap(){
      //var map = L.map('Map', {zoomControl:false}).setView([22.6079, 120.3042], 16);
      var map = L.map('Map', {zoomControl:false}).setView([22.6079, 120.3042], 16);//.locate({'watch':false, 'setView': false});

      var cycleMap = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
          maxZoom: 18
      }).addTo(map);
      L.control.layers(
          {'Cycle Map': cycleMap,
          'Cycle MapII': cycleMap}
          );
      var markers = [];
      var follow = false;
      var posJSON = null;
      var overlayImage = null;
      var imageLayer = null;
      var gpxLayer = [];
      var positionMark = null;


      /*
      map.on('locationerror', function(e){
        console.log('locationError');
        console.log(e);
        if(positionMark){
          map.removeLayer(positionMark);
          positionMark = null;
        };
      });
      */

      var reset = function reset(){
        for(var i = 0; i < markers.length; i++){
          map.removeLayer(markers[i].marker);
        }
        map.removeLayer(imageLayer);
        imageLayer = null;
        markers = [];
      };

      this.reset = reset;

      var getPos = function getPos(){
        var center = map.getCenter();
        var bound = map.getBounds();
        var sw = bound.getSouthWest();
        var ne = bound.getNorthEast();
        return {'lng':center.lng, 'lat':center.lat, 'bound': [[sw.lat, sw.lng], [ne.lat, ne.lng]], 'zoom': map.getZoom()}
      };
      this.getPos = getPos;

      this.fix = function fix(){
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
      };

      this.unfix = function unfix(){
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
      };

      this.exportData = function exportData(){
        return 'data:text/json,' + encodeURIComponent(
            JSON.stringify({'pos': getPos(), 'markers': listMarks()}));
      };

      var addMarkToLatLng = function addMarkToLatLng(text, point){
        var marker = L.marker(point).addTo(map);
        markers.push({'marker': marker, 'LatLng': point, 'text': text});
        marker.bindPopup(text);
      };

      this.addMarkTo = function addMarkTo(text, x, y){
        point = map.containerPointToLatLng([x, y]);
        addMarkToLatLng(text, point);
        //point = map.containerPointToLatLng([Math.round(x), Math.round(y)]);
      };

      var listMarks = function listMarks(){
        var r = [];
        for(var i = 0; i < markers.length; i++){
          var LatLng = [markers[i].LatLng.lat, markers[i].LatLng.lng];
          r.push({'latlng': LatLng, 'text': markers[i].text});
        }
        return r;
      };

      var locationEventHandler = function locationEventHandler(e){
        console.log(e.latlng);
        console.log(positionMark);
        if(positionMark){
          positionMark.setLatLng(e.latlng);
        }else{
          positionMark = L.marker(e.latlng, {'clickable':false}).addTo(map);
        }
        positionMark.update();
      };
      this.toggleFollow = function toggleFollow(){
        if(follow == true){
          follow = false;
          map.locate({'watch': false, 'setView': false, 'maximumAge':0});
          if(positionMark){
            map.removeLayer(positionMark);
            positionMark = null;
          };
          map.off('locationfound', locationEventHandler);
        }else{
          follow = true;
          map.locate({'watch': true, 'setView': true, 'timeout': 1000, 'maximumAge': 1000000});
          map.on('locationfound', locationEventHandler);
        }
      };

      var putOverlay = function putOverlay(){
        imageLayer = L.imageOverlay(overlayImage, posJSON.pos.bound).addTo(map);
        for(var i = 0; i < posJSON.markers.length; i++){
          var p = posJSON.markers[i].latlng;
          var point = L.latLng(p[0], p[1]);
          addMarkToLatLng(posJSON.markers[i].text, point);
        }
        document.getElementById('Canvas').setAttribute('class', 'pointerDisable');
        document.getElementById('Map').setAttribute('class', 'pointerEnabel');
        map.setView([posJSON.pos.lat, posJSON.pos.lng], posJSON.pos.zoom - 1, {'reset': true});
        //map.fitBounds([posJSON.pos.lat, posJSON.pos.lng]); //, posJSON.pos.zoom - 1, {'reset': true});
				console.log('putOverlap');
        Map.unfix();
      };

      this.loadPos = function loadPos(file){
        var reader = new FileReader();
        reader.onload = function(e){
          posJSON = JSON.parse(reader.result);
          if(overlayImage){
            putOverlay();
          }
        };
        reader.readAsText(file);
      }

      this.loadImg = function loadImg(file){
        var reader = new FileReader();
        reader.onload = function(e){
          overlayImage = reader.result;
          if(posJSON){
            putOverlay();
          }
        }
        reader.readAsDataURL(file);
      }

      this.loadGPX = function loadGPX(file){
        var reader = new FileReader();
        reader.onload = function(e){
          var newLayer = new L.GPX(reader.result, {async: true}).on('loaded',
              function(e){
                map.fitBound(e.target.getBounds());
              }).addTo(map);
        }
        reader.readAsText(file);
      }
};
