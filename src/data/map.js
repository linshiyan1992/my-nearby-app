import WebTileLayer from '@arcgis/core/layers/WebTileLayer'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import Basemap from '@arcgis/core/Basemap'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'

const tianditu_key = import.meta.env.VITE_TIANDITU_KEY

export const webTileLayer = new WebTileLayer({
  urlTemplate: `http://{subDomain}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${tianditu_key}`,
  subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7']
})

export const barLayer = new FeatureLayer({
  url: 'https://www.geosceneonline.cn/server/rest/services/Hosted/jiuba/FeatureServer',
  fields: [
    {
      name: 'name',
      alias: '店面',
      type: 'string'
    },
    {
      name: 'address',
      alias: '地址',
      type: 'string'
    },
    {
      name: 'tel',
      alias: '电话',
      type: 'string'
    }
  ],
  renderer: {
    type: 'simple',
    symbol: {
      type: 'simple-marker',
      size: 20,
      color: '#FF8080',
      outline: {
        width: 0.5,
        color: 'white'
      }
    }
  },
  popupEnabled: true,
  popupTemplate: {
    title: '{name}',
    content: [
      {
        type: 'fields',
        fieldInfos: [
          {
            fieldName: 'address',
            label: '地址'
          }
        ]
      }
    ]
  }
})

export const foodStallLayer = new FeatureLayer({
  url: 'https://www.geosceneonline.cn/server/rest/services/Hosted/dapaidang/FeatureServer'
})

export const coffeeShopLayer = new FeatureLayer({
  url: 'https://www.geosceneonline.cn/server/rest/services/Hosted/kafei/FeatureServer'
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
  zoom: 13
})

export async function initialize(container) {
  console.log(tianditu_key)
  view.container = container
  return view.when()
}

export function addLayers() {
  view.map.layers.add(barLayer)
}
