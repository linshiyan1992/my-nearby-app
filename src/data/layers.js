import FeatureLayer from '@arcgis/core/layers/FeatureLayer'

// symbol for render point of interest etc...
import { barRenderer, foodStallRenderer, coffeeShopRenderer } from '../config/symbolConfig'

export const barLayer = new FeatureLayer({
  title: '酒吧',
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
  },
  popupEnabled: true,
  renderer: barRenderer
})

export const foodStallLayer = new FeatureLayer({
  title: '大排档',
  url: 'https://www.geosceneonline.cn/server/rest/services/Hosted/dapaidang/FeatureServer',
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
      name: 'ad',
      alias: '县市区',
      type: 'string'
    }
  ],
  popupEnabled: true,
  popupTemplate: {
    title: '大排档：{name}',
    content: [
      {
        type: 'fields',
        fieldInfos: [
          {
            fieldName: 'address',
            label: '地址'
          },
          {
            fieldName: 'ad',
            label: '县市区'
          }
        ]
      }
    ]
  },
  renderer: foodStallRenderer
})

export const coffeeShopLayer = new FeatureLayer({
  title: '咖啡店',
  url: 'https://www.geosceneonline.cn/server/rest/services/Hosted/kafei/FeatureServer',
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
      name: 'ad',
      alias: '县市区',
      type: 'string'
    }
  ],
  popupEnabled: true,
  popupTemplate: {
    title: '咖啡馆：{name}',
    content: [
      {
        type: 'fields',
        fieldInfos: [
          {
            fieldName: 'address',
            label: '地址'
          },
          {
            fieldName: 'ad',
            label: '县市区'
          }
        ]
      }
    ]
  },
  renderer: coffeeShopRenderer
})
