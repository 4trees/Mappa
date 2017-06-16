// -----------
// Mapquest Static API Demo
// -----------

// Import API key
var key = "y1X5vxHqHlvfl0i151sRbhejOAK44Iql";

// Create a new instance of Mapquest
var mappa = new Mappa('Mapquest', key);

// Options for map
var options = {
  lat: 40.782,
  lng: -73.967,
  zoom: 4,
  width: 640,
  height: 640,
  scale: 2,
  type: 'hyb',
  scalebar: 'true|bottom',
  traffic: 'flow',
  banner: 'My+Map'
}

// Create a Static Map
//var myMap = mappa.staticMap(40.782, -73.967, 10, 600, 600);
var myMap = mappa.staticMap(options);

var img;
var dots;

function preload(){
  // Load the image from the mappa instance
  img = loadImage(myMap.img);
  dots = loadStrings('./data/dots.csv');
}

function setup(){
  createCanvas(1280,1280);
  noStroke();
  fill(255, 0, 0);

  image(img, 0, 0);

  for (var i = 1; i < dots.length; i++) {
    var data = dots[i].split(/,/);

    pos = myMap.latLng(data[9], data[8]);
    ellipse(pos.x, pos.y, 10, 10);
  }
}
S
