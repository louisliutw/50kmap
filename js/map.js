var Map = new function CanvasMap(){
      var map = L.map('Map', {zoomControl:false}).setView([22.6079, 120.3042], 16);
      L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
          maxZoom: 18
      }).addTo(map);
};
