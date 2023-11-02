import simpleRenderer from '@arcgis/core/renderers/SimpleRenderer'

export const barRenderer = new simpleRenderer({
  symbol: {
    type: 'web-style',
    name: 'bar',
    styleName: 'Esri2DPointSymbolsStyle'
  }
})

export const foodStallRenderer = new simpleRenderer({
  symbol: {
    type: 'web-style',
    name: 'Restaurant',
    styleName: 'Esri2DPointSymbolStyle'
  }
})

export const coffeeShopRenderer = new simpleRenderer({
  symbol: {
    type: 'web-style',
    name: 'coffee-shop',
    styleName: 'Esri2DPointSymbolsStyle'
  }
})
