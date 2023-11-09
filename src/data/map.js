// import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import Webmap from '@arcgis/core/WebMap'
import Basemap from '@arcgis/core/Basemap'
import Portal from '@arcgis/core/portal/Portal'
import PortalItem from '@arcgis/core/portal/PortalItem'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'

import { barLayer, coffeeShopLayer } from './layers'

const tianditu_key = import.meta.env.VITE_TIANDITU_KEY

export const webTileLayer = new WebTileLayer({
  urlTemplate: `http://{subDomain}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tianditu_key}`,
  subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
})

export const bdcPortal = new Portal({
  url: 'https://172.168.120.244/geoscene',
  authMode: 'auto'
})

export const portalItem = new PortalItem({
  id: 'a069450e1a384e5c912a7b88502fcccf',
  portal: bdcPortal
})

export const webmap = new Webmap({
  portalItem
})

// export const basemap = new Basemap({
//   baseLayers: [webTileLayer]
// })

// export const map = new Map({
//   basemap
// })

export const view = new MapView({
  map: webmap,
  center: [118.622, 24.89],
  zoom: 13,
  constraints: {
    maxZoom: 18
  }
})

export async function initialize(container) {
  view.container = container
  view.popupEnabled = false
  return view.when()
}

export function addLayers() {
  view.map.add(barLayer)
  view.map.add(coffeeShopLayer)
}
