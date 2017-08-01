/* -----------
Mapboxgl and p5 with webgl demo.
Visualizing 2000 Meteorite Landings. 
Data from NASA's Open Data Portal.(https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh)
----------- */

// API Key for Mapboxgl. Get one here:
// https://www.mapbox.com/studio/account/tokens/
var key = 'pk.eyJ1IjoibWFwcGF1c2VyIiwiYSI6ImNqNXNrbXIyZDE2a2cyd3J4Ym53YWxieXgifQ.JENDJqKE1SLISxL3Q_T22w'

// Options for map
var options = {
  lat: 0,
  lng: 0,
  zoom: 4,
  style: 'mapbox://styles/mapbox/traffic-night-v2',
  pitch: 50
}

// Create an instance of Mapboxgl
var mappa = new Mappa('Mapboxgl', key);
var myMap;

var canvas;
var meteorites;

function preload(){
  // Load the data
  meteorites = loadTable('../../data/Meteorite_Landings.csv', 'csv', 'header');
}

function setup() {
  // Create a canvas with WEBGL
  canvas = createCanvas(800, 700, WEBGL);

  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

}

function draw(){
  // Move the origin to the top-left
  translate(-width/2, -height/2, 0);

  for (var i = 0; i < 1000; i++){
    // Get the pixel position of the lat/lng of each meteorite
    var pos = myMap.latLngToPixel(meteorites.getString(i, 'reclat'), meteorites.getString(i, 'reclong'));

    push();
    translate(pos.x, pos.y, 0);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    // Get the size of the meteorite and map it. 60000000 is the mass of the largest
    // meteorite (https://en.wikipedia.org/wiki/Hoba_meteorite)
    var size = meteorites.getString(i, 'mass (g)');
    size = map(size, 558, 60000000, 1, 25) + myMap.zoom();
    // Create a box for each meteorite
    box(size);
    pop();
  }
}


