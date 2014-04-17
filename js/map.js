var Map = new function CanvasMap(){
      //var map = L.map('Map', {zoomControl:false}).setView([22.6079, 120.3042], 16);
      var map = L.map('Map', {zoomControl:false}).locate({'watch':false, 'setView': true});

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
      var overlay = null;

      var listMarks = function listMarks(){
        return [];
      };

      this.reset = function reset(){
        markers = [];
      };

      var getPos = function getPos(){
        var center = map.getCenter();
        return {'lng':center.lng, 'lat':center.lat, 'zoom': map.getZoom()}
      };
      this.getPos = getPos;

      this.fix = function fix(){
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        //map.tap.disable();
        //map.zoomControl.disable();
        //map.attributionControl.disable();
      };

      this.unfix = function unfix(){
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        //map.tap.enable();
        //map.zoomControl.enable();
        //map.attributionControl.enable();
      };

      this.exportData = function exportData(){
        var pos = getPos();
        var markersList = listMarks();
        return 'data:text/json,' + encodeURIComponent(JSON.stringify({'pos': pos, 'markers': markersList}));
      };

      this.addMarkTo = function addMarkTo(text, x, y){
        console.log(text+" "+x+" "+y);
        point = L.containerPointToLatLng(x, y);
        markers.push({'marker': marker, 'LatLng': point, 'text': text});
        marker = L.marker(point).addTo(map);
        marker.on('click', function(e){
          this.bindPop(text).openPopup();
        });
      };

      this.toggleFollow = function toggleFollow(){
        if(follow == true){
          follow = false;
          map.locate({'watch': false, 'setView': false});
        }else{
          follow = true;
          map.locate({'watch': true, 'setView': true});
        }
      };

      this.loadPos = function loadPos(file){
        var reader = new FileReader();
        reader.onload = function(e){
          posJSON = JSON.parse(reader.result);
          if(overlay){
            putOverlay();
          }
        };
        reader.readAsText(file);
      }

      this.loadImg = function loadImg(file){
        var reader = new FileReader();
        reader.onload = function(e){
          overlay = reder.result;
          if(posJSON){
            putOverlay();
          }
        }
        reader.readAsDataURL();
      }
};
