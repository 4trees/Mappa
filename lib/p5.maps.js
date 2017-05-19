/*! p5.maps.js v0.0.0 May 16, 2017 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.p5 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

console.log('%c p5.maps Loaded ', 'color:white; background:black;');
//require('./static/static');

var map = {
  lat: 0,
  lng: 0,
  zoom: 1,
  width: 1024,
  height: 512
};

p5.prototype.staticMap = function (vendor, token, lat, lng, zoom, width, height) {

  map.lat = lat;
  map.lng = lng;
  map.zoom = zoom;
  map.width = width;
  map.height = height;

  // Vendors
  if(vendor === 'mapbox'){
    vendor = 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/'
    return loadImage(vendor + map.lat + ',' + map.lng + ',' + map.zoom + '/' + width + 'x' + height + '?access_token=' + token )
  }
  else if (vendor === 'google'){
    vendor = 'https://maps.googleapis.com/maps/api/staticmap?center='
    return loadImage(vendor + map.lat + ',' + map.lng + '&zoom=' + map.zoom + '&scale=2' + '&size=' + width + 'x' + height + '&maptype=roadmap&format=png&visual_refresh=true')
  }
  // Load a static image from disk
};

p5.prototype.drawMap = function (img){
  translate(map.width/2, map.height/2);
  imageMode(CENTER);
  image(img, 0, 0);
};

p5.prototype.tileMap = function(lat, lng, zoom, width, height){
  translate(map.width/2, map.height/2);
  imageMode(CENTER);
  var div = document.createElement('div');
  document.body.appendChild(div)
  div.setAttribute('style', 'position:absolute;height:'+ height + 'px;width:' + width + 'px;top:0;left:0;z-index:-99')
  var leafletMap = L.map(div).setView([lat, lng], zoom);
  L.tileLayer("https://{s}.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}@2x.png?access_token=pk.eyJ1IjoiZ2xlYWZsZXQiLCJhIjoiY2lxdWxoODl0MDA0M2h4bTNlZ2I1Z3gycyJ9.vrEWCC2nwsGfAYKZ7c4HZA")
  .addTo(leafletMap);
}

p5.prototype.latlngToPixels = function(lat, lng){
  // define projection
  return [mercatorLat(lat), mercatorLong(lng)];
};

p5.prototype.latToPixels = function(lat){
  return mercatorLat(lat) - mercatorLat(map.lat);
};

p5.prototype.lngToPixels = function(lng){
  return mercatorLong(lng) - mercatorLong(map.lng);
};

function mercatorLat(lat){
  return ((256 / PI) * pow(2, map.zoom)) * (PI - log(tan(PI / 4 + radians(lat) / 2)));
};

function mercatorLong(lng){
  return (256 / PI) * pow(2, map.zoom) * radians(lng) + PI;
}

},{}]},{},[1])(1)
});