import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'

import { barLayer, foodStallLayer, coffeeShopLayer } from './layers'

const tianditu_key = import.meta.env.VITE_TIANDITU_KEY

export const webTileLayer = new WebTileLayer({
  urlTemplate: `http://{subDomain}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tianditu_key}`,
  subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
})

export const basemap = new Basemap({
  baseLayers: [webTileLayer]
})

export const map = new Map({
  basemap
})

export const view = new MapView({
  map,
  center: [118.622, 24.89],
  zoom: 13,
  constraints: {
    maxZoom: 18
  }
})

export async function initialize(container) {
  view.container = container
  return view.when()
}

export function addLayers() {
  view.map.add(barLayer)
  view.map.add(coffeeShopLayer)
  view.map.add(foodStallLayer)
}
