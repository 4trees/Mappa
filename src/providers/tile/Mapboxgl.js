// -----------
// Mapbox-gl v0.37.0
// Reference: https://www.mapbox.com/mapbox-gl-js/api/
// -----------

import { TileMap } from './TileMap'

class Mapboxgl extends TileMap {
  constructor(options){
    super(options);
    this.script = 'https://api.mapbox.com/mapbox-gl-js/v0.37.0/mapbox-gl.js';
    this.style = 'https://api.mapbox.com/mapbox-gl-js/v0.37.0/mapbox-gl.css';
    (!this.options.key) ? Mapboxgl.messages().key() : this.init();
  }

  createMap () {
    mapboxgl.accessToken = this.options.key;
    let map = new mapboxgl.Map({
      container: 'mappa',
      style: this.options.style || 'mapbox://styles/mapbox/satellite-streets-v10',
      center: [this.options.lng, this.options.lat],
      zoom: this.options.zoom,
    });
    this.canvas.parent(map.getCanvasContainer());
    this.canvas.elt.style.position = 'absolute';
    return map;
  }

  fromLatLngtoPixel (latLng) {
    return this.map.project(latLng);
  }

  fromZoomtoPixel () {
    return this.map.getZoom();
  }

  static messages(){
    return {
      key: () => {console.warn('Please provide a Goolge Maps API Key. Get one here: https://developers.google.com/maps/documentation/javascript/ ')}
    }
  }

}

export { Mapboxgl };
