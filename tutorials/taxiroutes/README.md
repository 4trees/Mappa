# Taxi Routes


This tutorial is based on the [taxitracker](https://github.com/chriswhong/nyctaxi) data visualization. The idea is to create a sketch that will show the route of a taxi during a day in New York. I will try to keep things as simple as possible in order to show how to use maps and p5.js to create visualizations.

You can see the final result [here]().

### Setup

- In a new folder create `index.html` and `script.js` files.
- Download [`p5.js`](https://github.com/processing/p5.js/releases/download/0.5.11/p5.js) and  [`Mappa.js`](https://raw.githubusercontent.com/cvalenzuela/Mappa/master/dist/mappa.js) and save them in a folder call `libraries`
- Download the [data for one taxi for one day](data/taxiday1.geojson) and save it in a folder called `data`.
- In order to run this tutorial you will need a local server. There are many different ways to create a [local server](https://github.com/shiffman/The-Nature-of-Code-JTerm-2015/wiki/Local-Server-Tutorial). Here are some:

If you use node and npm you can install `live-server`: 
```zsh
npm install -g live-server
```
And then run
```
live-server
```
If you use python 2:
```zsh
python -m SimpleHTTPServer
```
In python 3
```
python3 -m http.server
```

By the end you should have this:
- TaxiRoutes
  + `index.html`
  + `script.js`
  - libraries
    + `p5.js`
    + `mappa.js`
  - data
    + `taxiday1.geojson`

### index.html

Open the `index.html` file in any text editor and add references to the libraries and script to it. This is the only thing that needs to be done with this file.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Taxi Routes</title>

    <!-- p5.js -->
    <script src="libraries/p5.min.js"></script>

    <!-- Mappa -->
    <script src="libraries/mappa.js"></script>

  </head>

  <body>
    <!-- Your script -->
    <script src="script.js"></script>
  </body>
</html>

```

### First Part

Open the `script.js` file in any text editor and create a basic `p5.js` sketch.

```javascript
var canvas;

function setup(){
  canvas = createCanvas(800,700);
}
```

Add a Mappa instance using Leaflet at the top of your sketch.

```javascript
var mappa = new Mappa('Leaflet');
```
Create an object holding the origin, zoom and a reference to basemap style. You can use any basemap you want. For now we will use CartoDB.

```javascript
var options = {
  lat: 40.73447,
  lng: -74.00232,
  zoom: 13,
  style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}
```
Create a new variable called `myMap`. Inside the `setup` function initialize that variable as an instance of a `tileMap` with the options we just created.

```javascript
...

var myMap;

function setup(){
  canvas = createCanvas(800,700);
  myMap = mappa.tileMap(options); // This will import the Leaflet library into your sketch and create all necesary references
}
```
Then, overlay the canvas on to the Leaflet map:

```javascript
...

function setup(){
  canvas = createCanvas(800,700);
  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas); // Overlay the canvas on top of the map.
}
```

By now you should have something like this:

```javascript
var canvas;
var myMap;

var options = {
  lat: 40.73447,
  lng: -74.00232,
  zoom: 13,
  style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}

var mappa = new Mappa('Leaflet');

function setup(){
  canvas = createCanvas(800,700);
  myMap = mappa.tileMap(options); 
  myMap.overlay(canvas); 
}
```
If you open your sketch you will see this:

![black map](imgs/01.png)

A black map center in New York.


#### The data

The data for this project is taken from the [2013 NYC Taxi Trip Data](https://github.com/andresmh/nyctaxitrips). This is the same dataset used in the [taxitracker](https://github.com/chriswhong/nyctaxi) data visualization. It is in [GeoJson](http://geojson.org/) format. GeoJSON is a format for encoding a variety of geographic data structures. It looks like this:

```javascript
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
}
```
From [geojson.org](http://geojson.org/): 
> GeoJSON supports the following geometry types: Point, LineString, Polygon, MultiPoint, MultiLineString, and MultiPolygon. Geometric objects with additional properties are Feature objects. Sets of features are contained by FeatureCollection objects.

The actual file for the taxi routes looks like this:

```javascript
{
  "type": "FeatureCollection",
  "features": [{ 
    "type": "Feature",
    "properties": {
      "medallion": "21B98CAC5B31414B9446D381D38EEC7F",
      "passengers": "3",
      "fare":"18",
      "paymenttype":"CSH",
      "surcharge":"0.5",
      "mtatax":"0.5",
      "tip":"0",
      "tolls":"0",
      "total":"19",
      "pickuptime":"5/30/13 0:01",
      "dropofftime":"5/30/13 0:18",
      "nextpickuptime":"5/30/13 1:45",
      "key":"0","hasfare":true},
      "geometry": {
        "type": "LineString",
        "coordinates":[[-74.00232,40.73447],[-74.0024,40.73433],[-74.00278,40.7337],[-74.00282,40.73361],[-74.00305,40.7332],[-74.00329,40.73278] (...) 
```
You can see it contains a lot of informationa about the trips a taxi makes in a day. There is one object for every trip recorded with information about the fare, the number of passengers, pick up time and location. For now, we are just interested in using the coordinates of the taxi during its differents trips. So for each trip in the `features` array we need the `properties.geometry.coordinates` array. This contains a series of arrays with the latitude and longitude position we need.

To load the data add a `preload` function before your `setup` and load the file as a JSON file:

```javascript
var data;

function preload(){
  data = loadJSON('./data/taxiday1.geojson');
}

...
```
Since we are interested in using the latitude and longitude of the file we can loop over the array of `features` and then loop again over the array of `coordinates` in the `properties.geometry` object and then again over each array containing the latitude and longitud. Fortunately, there is a Mappa method to get all properties of a GeoJSON file and store them in an variable.

Create a variable called `tripsCoordinates` and initilized it to an array of all `LineString` types in your `setup`.

```javascript
var tripsCoordinates;

function setup(){
  tripsCoordinates = myMap.geoJSON(data, "LineString");
  ...
}
```

This will create an array holding one array for each trip. Each trip is represented by an series of latitude and longitude coordinates.

```javascript
[Array(220), Array(188), Array(165), Array(178), Array(564), Array(225), Array(90), Array(114), Array(150), Array(9), Array(62), Array(5), Array(168), Array(37), Array(27), Array(211), Array(28), Array(159), Array(89), Array(3), Array(119), Array(9), Array(177), Array(11), Array(25), Array(26), Array(30), Array(4), Array(84), Array(6), Array(13), Array(26), Array(60), Array(6), Array(64), Array(7), Array(31), Array(4), Array(10), Array(4), Array(153), Array(17), Array(15), Array(13), Array(264), Array(8), Array(110), Array(9), Array(104), Array(144), Array(41), Array(39), Array(181), Array(55), Array(42), Array(10), Array(230), Array(43), Array(215), Array(2), Array(102), Array(19), Array(52), Array(2), Array(82), Array(42), Array(19), Array(17), Array(79), Array(13)]
```

For example, the 10th trip holds 9 tracked positions:

```javascript
[Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2), Array(2)]
```
Where each position is a latitude and longitud. Here's the first location for the 10th trip:

```javascript
[-73.98021, 40.74747]
```

There are many ways to loop over this array of locations. Here, we'll create a new variable holding just all locations together. 

Create a new empty array called `allCoordinates` and in your `setup` loop through every object in the `tripsCoordinates` array:

```javascript
var allCoordinates = [];

function setup(){
  ...

  tripsCoordinates.forEach(function(trip){
	  trip.forEach(function(coordinate){
		  allCoordinates.push(coordinate)
	  })
  });
}
```

Now `allCoordinates` holds 5530 pairs of latitudes and longitudes describing the taxi's whole route in one day. The first element is the longitud and the second is the latitude

```javascript
(5530) [[-74.00232, 40.73447], [-74.0024, 40.73433], [-74.00278, 
40.7337] (...) ]
```


Lets diplay this data! In your `draw` function draw a circle for every location in the `allCoordinates` array. Use the `latLngtoPixel` method to transform latitude and longitud positions into pixel positions.

```javascript
function draw(){
  clear() // Clear the canvas at every frame so we see the map when moved.
  noStroke();
  fill(255);
  for(var i = 0; i < allCoordinates.length; i++){
    var pos = myMap.latLngToPixel(allCoordinates[i][1], allCoordinates[i][0]) // The first element is the latitud and the second the longitud
    ellipse(pos.x, pos.y, 5, 5);
  }
}
```

You should have something like this until now:

```javascript
var canvas;
var myMap;
var tripsCoordinates;
var allCoordinates = [];
var data;

var options = {
  lat: 40.73447,
  lng: -74.00232,
  zoom: 13,
  style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}
var mappa = new Mappa('Leaflet');

function preload() {
  data = loadJSON('./data/taxiday1.geojson');
}

function setup() {
  canvas = createCanvas(800, 700);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas); 
  tripsCoordinates = myMap.geoJSON(data, "LineString");

  tripsCoordinates.forEach(function (trip) {
    trip.forEach(function (coordinate) {
        allCoordinates.push(coordinate)
      })
  });
}

function draw(){
  clear() 
  noStroke();
  fill(255);
  for(var i = 0; i < allCoordinates.length; i++){
    var pos = myMap.latLngToPixel(allCoordinates[i][1], allCoordinates[i][0])
    ellipse(pos.x, pos.y, 5, 5);
  }
}
```

That will output a map where you can move/pan/zoom and see all of the taxi's registered positions overlay into the map:
![02](imgs/02.png)

One thing you can notice is that this may get a little bit slow after a while. This is because the sketch is computing 5530 arrays every frame. Since we still want to keep the dots sync to the map we can just compute them everytime the map moves and not every frame. For that we can use the `onChange` method. Create a new function called `drawPoints` and move the loop to visualize the dots from `draw` to `drawPoints`:

```javascript
function drawPoints(){
  clear() 
  noStroke();
  fill(255);
  for(var i = 0; i < allCoordinates.length; i++){
    var pos = myMap.latLngToPixel(allCoordinates[i][1], allCoordinates[i][0])
    ellipse(pos.x, pos.y, 5, 5);
  }
}
```

And in the `setup` function, link it to the map:

```javascript
function setup(){
  ...
  myMap.onChange(drawPoints)
}
```

Now it will run more smoothly.

### Second Part

We have all we need to animate the taxi route. So far the sketch looks like this:

```javascript
var canvas;
var myMap;
var tripsCoordinates;
var allCoordinates = [];
var data;

var options = {
  lat: 40.73447,
  lng: -74.00232,
  zoom: 13,
  style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}
var mappa = new Mappa('Leaflet');

function preload() {
  data = loadJSON('./data/taxiday1.geojson');
}

function setup() {
  canvas = createCanvas(800, 700);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas); 
  tripsCoordinates = myMap.geoJSON(data, "LineString");

  tripsCoordinates.forEach(function (trip) {
    trip.forEach(function (coordinate) {
        allCoordinates.push(coordinate)
      })
  });
  myMap.onChange(drawPoints);
}

function draw(){
}

function drawPoints(){
  clear() 
  noStroke();
  fill(255);
  for(var i = 0; i < allCoordinates.length; i++){
    var pos = myMap.latLngToPixel(allCoordinates[i][1], allCoordinates[i][0])
    ellipse(pos.x, pos.y, 5, 5);
  }
}
```

In order to move the taxi over each position we need to create a couple of new variables. At the top of your sketch create:

```javascript
var delta = 0; // This will allow to move from one position to another
var coordinate = 0; // The current coordinate in the allCoordinates array that will tell the orign and destination

var origin; // Pixel position of the origin
var originVector;  // Vector representation of the origin
var destination; // Pixel position of the destination
var destinationVector; // Vector representation of the destination

var taxiPosition; // The current position of the taxi
...

```

We are going to tranform all origins and destinations of the taxi into a [Vector](https://p5js.org/reference/#/p5.Vector) and calculate the distance between the two with [lerp](https://p5js.org/reference/#/p5.Vector/lerp). The taxi will move from one position(origin with x1, y1) to the next position(destination with x2,y2) in the array. [Lerp](https://p5js.org/reference/#/p5.Vector/lerp) will return a linear interpolation between this two. Every destination, besides the first one, will become an origin for the next one. 

First, comment the line to visualize all the positions:

```javascript
function setup(){
  ...
  //myMap.onChange(drawPoints);
}
```

Now, inside the `draw` loop add the following:

```javascript
...

function draw() {
  clear(); // Clear the canvas at every frame
  if(delta < 1){
    delta += 0.2; // Delta holds the current distance between the origin and the destination. 0 means is all the way in the origin and 1 that it's in the destination. We'll increase this value by 0.2 each frame.
  } else {
    delta = 0; // Reset the value once it hits the destination
    coordinate ++; // Move one coordinate in the allCoordinates array.
  }

  origin = myMap.latLngToPixel(allCoordinates[coordinate][1], allCoordinates[coordinate][0]); // Get the Lat/Lng position of the origin and tranform it into pixel position at every frame
  originVector = createVector(origin.x, origin.y); // A vector representation of the origin. Holds x and y
  destination = myMap.latLngToPixel(allCoordinates[coordinate + 1][1], allCoordinates[coordinate + 1][0]); // Get the Lat/Lng position of the destination and tranform it into pixel position at every frame. The destination is one element in front of the current coordinate
  destinationVector = createVector(destination.x, destination.y); // A vector representation of the destination. Holds x and y

  position = originVector.lerp(destinationVector, delta); // The current position of the taxi will be determined by the distance between the origin and the destination that delta contains.
  
  fill(255,255,0);
  ellipse(position.x, position.y, 7, 7); // Draw the taxi in the current position
}

```

Your code should look like this:

```javascript
var canvas;
var myMap;
var tripsCoordinates;
var allCoordinates = [];
var data;

var delta = 0; 
var coordinate = 0; 

var origin; 
var originVector;  
var destination; 
var destinationVector;

var taxiPosition;

var options = {
  lat: 40.73447,
  lng: -74.00232,
  zoom: 13,
  style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}
var mappa = new Mappa('Leaflet');

function preload() {
  data = loadJSON('./data/taxiday1.geojson');
}

function setup() {
  canvas = createCanvas(800, 700);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas); 
  tripsCoordinates = myMap.geoJSON(data, "LineString");

  tripsCoordinates.forEach(function (trip) {
    trip.forEach(function (coordinate) {
        allCoordinates.push(coordinate)
      })
  });
  //myMap.onChange(drawPoints);
}

function draw(){
  clear();
  if(delta < 1){
    delta += 0.2; 
  } else {
    delta = 0; 
    coordinate ++; 
  }

  origin = myMap.latLngToPixel(allCoordinates[coordinate][1], allCoordinates[coordinate][0]); 
  originVector = createVector(origin.x, origin.y); 
  destination = myMap.latLngToPixel(allCoordinates[coordinate + 1][1], allCoordinates[coordinate + 1][0]);  
  destinationVector = createVector(destination.x, destination.y);

  taxiPosition = originVector.lerp(destinationVector, delta);
  fill(255,255,0);
  ellipse(taxiPosition.x, taxiPosition.y, 7, 7);
}

function drawPoints(){
  clear() 
  noStroke();
  fill(255);
  for(var i = 0; i < allCoordinates.length; i++){
    var pos = myMap.latLngToPixel(allCoordinates[i][1], allCoordinates[i][0])
    ellipse(pos.x, pos.y, 5, 5);
  }
}
```

And the output should look like this:

![03](imgs/03.gif)

Now lets add a trail for the taxi.

```javascript

var canvas;
var myMap;
var tripsCoordinates;
var allCoordinates = [];
var data;

var delta = 0; 
var coordinate = 0; 

var origin; 
var originVector;  
var destination; 
var destinationVector;

var taxiPosition;

var visitedRoutes = []; // A new array to hold all visited positions

var options = {
  lat: 40.73447,
  lng: -74.00232,
  zoom: 13,
  style: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
}
var mappa = new Mappa('Leaflet');

function preload() {
  data = loadJSON('./data/taxiday1.geojson');
}

function setup() {
  canvas = createCanvas(800, 700);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas); 
  tripsCoordinates = myMap.geoJSON(data, "LineString");

  tripsCoordinates.forEach(function (trip) {
    trip.forEach(function (coordinate) {
        allCoordinates.push(coordinate)
      })
  });
  //myMap.onChange(drawPoints);
  myMap.onChange(drawRoute); // Everytime the map is zoomed or moved update the route
}

function draw(){
  //clear(); clear can be commented since drawRoute() will handle clearing the canvas
  if(delta < 1){
    delta += 0.2; 
  } else {
    visitedRoutes.push(allCoordinates[coordinate]) // Once it has arrived at its destination, add the origin as a visited location
    delta = 0; 
    coordinate ++;
    drawRoute(); // Call the drawRoute to update the route
  }

  origin = myMap.latLngToPixel(allCoordinates[coordinate][1], allCoordinates[coordinate][0]); 
  originVector = createVector(origin.x, origin.y); 
  destination = myMap.latLngToPixel(allCoordinates[coordinate + 1][1], allCoordinates[coordinate + 1][0]);  
  destinationVector = createVector(destination.x, destination.y);

  taxiPosition = originVector.lerp(destinationVector, delta);

  noStroke(); // remove the stroke from the route
  fill(255,255,0);
  ellipse(taxiPosition.x, taxiPosition.y, 7, 7);
}

function drawPoints(){
  clear() 
  noStroke();
  fill(255);
  for(var i = 0; i < allCoordinates.length; i++){
    var pos = myMap.latLngToPixel(allCoordinates[i][1], allCoordinates[i][0])
    ellipse(pos.x, pos.y, 5, 5);
  }
}

// This functions draws a line with n-vertices where n = visited routes;
function drawRoute(){
  clear();
  stroke(255,0,0, 40); // stroke color and width to see the route line
  strokeWeight(5);
  if(visitedRoutes.length > 0){
    noFill();
    beginShape();
    visitedRoutes.forEach(function (e) {
        var pos = myMap.latLngToPixel(e[1], e[0]);
        vertex(pos.x, pos.y);
    })
    endShape()
  }
}

```

And you should get something like this:

![04](imgs/04.gif)
