<script setup>
import Expand from '@arcgis/core/widgets/Expand'
import { ref, computed, onMounted } from 'vue'
import { view } from '../data/map'
import { Close } from '@element-plus/icons-vue'

const bookmarkDiv = ref(null)
const bookmark = ref(null)
const currentPage = ref(1)
const typeValue = ref(null)
const categoryValue = ref(null)
const pageSize = 3
let expandWidget

const data = [
  {
    name: '西街',
    id: 1,
    description: '历史文化街区',
    location: [118.579, 24.919],
    zoom: 17,
    children: [
      {
        name: '西街东段',
        id: 11,
        description: '开元寺在这里啦啦啦',
        location: [118.583, 24.916],
        zoom: 18
      },
      {
        name: '西街西段',
        id: 12,
        description: '有很多鸡尾酒吧',
        location: [118.575, 24.92],
        zoom: 17
      }
    ],
    type: 'firstClassRoad',
    category: 'westStreet'
  },
  {
    name: '中山路',
    id: 2,
    description: '百年历史中山路',
    location: [118.584, 24.907],
    zoom: 16,
    children: [
      {
        name: '中山北路',
        id: 21,
        location: [118.587, 24.916],
        zoom: 18,
        description: '通往威远楼'
      },
      {
        name: '中山中路',
        id: 22,
        location: [118.586, 24.911],
        zoom: 17,
        description: '曾经是繁华的商业街'
      },
      {
        name: '中山南路',
        id: 23,
        location: [118.584, 24.902],
        zoom: 17,
        description: '曾经是繁华的金融街'
      }
    ],
    type: 'firstClassRoad',
    category: 'zhongShanRoad'
  },
  {
    name: '城南',
    id: 3,
    description: '妈祖庙在这里哦',
    location: [118.584, 24.896],
    zoom: 18,
    type: 'firstClassRoad',
    category: 'citySouth'
  },
  {
    name: '通政巷',
    id: 4,
    description: '故通政司衙门所在地',
    location: [118.585, 24.913],
    zoom: 18,
    type: 'firstClassRoad',
    category: 'zhongShanRoad'
  },
  {
    name: '井亭巷',
    id: 5,
    description: '重要文物有城心塔',
    location: [118.583, 24.913],
    zoom: 18,
    type: 'firstClassRoad',
    category: 'zhongShanRoad'
  },
  {
    name: '相公巷',
    id: 6,
    description: '蚂蚁私房菜',
    location: [118.592, 24.915],
    zoom: 18,
    type: 'firstClassRoad',
    category: 'eastStreet'
  },
  {
    name: '二郎巷',
    id: 7,
    description: '有个二郎庙',
    location: [118.594, 24.917],
    zoom: 18,
    type: 'firstClassRoad',
    category: 'eastStreet'
  },
  {
    name: '破柴巷',
    id: 8,
    description: '估计过去在这里交易柴火',
    location: [118.589, 24.92],
    zoom: 18,
    type: 'otherRoad',
    category: 'beiMenStreet'
  },
  {
    name: '爱国路',
    id: 9,
    description: '华侨新村就在这条路上',
    location: [118.584, 24.92],
    zoom: 18,
    type: 'otherRoad',
    category: 'beiMenStreet'
  },
  {
    name: '涂门街',
    id: 10,
    description: '因为要从这条路拉土建城门，所以叫土门街',
    location: [118.587, 24.905],
    zoom: 17,
    type: 'otherRoad',
    category: 'tuMenStreet'
  },
  {
    name: '民权路',
    id: 11,
    description: '旧车站就在这里了',
    location: [118.587, 24.903],
    zoom: 18,
    type: 'otherRoad',
    category: 'zhongShanRoad'
  },
  {
    name: '指挥巷',
    id: 12,
    description: '触及到了我的知识盲区',
    location: [118.585, 24.903],
    zoom: 18,
    type: 'firstClassRoad',
    category: 'zhongShanRoad'
  },
  {
    name: '裴巷',
    id: 13,
    description: '传说裴道人曾居住于此',
    location: [118.584, 24.918],
    zoom: 18,
    type: 'firstClassRoad',
    category: 'westStreet'
  },
  {
    name: '象峰巷',
    id: 14,
    description: '重要的景观视廊',
    location: [118.58, 24.915],
    zoom: 18,
    type: 'secondClassRoad',
    category: 'westStreet'
  }
]

const categoryOption = [
  {
    id: 1,
    value: 'westStreet',
    label: '西街历史文化街区'
  },
  {
    id: 2,
    value: 'zhongShanRoad',
    label: '中山路历史文化街区'
  },
  {
    id: 3,
    value: 'citySouth',
    label: '城南聚宝街历史文化街区'
  },
  {
    id: 4,
    value: 'beiMenStreet',
    label: '北门街'
  },
  {
    id: 5,
    value: 'tuMenStreet',
    label: '涂门街'
  },
  {
    id: 6,
    value: 'eastStreet',
    label: '东街'
  }
]

const typeOptions = [
  {
    id: 1,
    value: 'firstClassRoad',
    label: '一类传统街巷'
  },
  {
    id: 2,
    value: 'secondClassRoad',
    label: '二类传统街巷'
  },
  {
    id: 3,
    value: 'otherRoad',
    label: '其他街巷'
  }
]

function isType(item) {
  const targetType = typeValue.value
  return targetType ? item.type === targetType : true
}

function isCategory(item) {
  const targetCategory = categoryValue.value
  return targetCategory ? item.category === targetCategory : true
}

let filterData = computed(() => {
  return data.filter(isType).filter(isCategory)
})

let displayData = computed(() => {
  const pageNumber = currentPage.value
  const startIndex = (pageNumber - 1) * pageSize
  const endIndex = pageNumber * pageSize - 1

  return filterData.value.slice(startIndex, endIndex + 1)
})

function handleCurrentChange(currentRow) {
  const lon = currentRow?.location[0]
  const lat = currentRow?.location[1]
  const zoom = currentRow?.zoom
  view.goTo({
    center: [lon, lat],
    zoom
  })
}

function createExpand() {
  const expand = new Expand({
    expandIcon: 'pin-tear',
    view: view,
    content: bookmarkDiv.value,
    label: 'chooseLocation'
  })
  expandWidget = expand
  view.ui.add(expand, 'top-left')
}

function closeExpand() {
  expandWidget.collapse()
}

function handleCurrentPageChange() {
  bookmark.value.setCurrentRow()
}

onMounted(() => {
  createExpand()
})
</script>

<template>
  <div id="bookmark" ref="bookmarkDiv">
    <div id="bookmark-header">
      <div id="bookmark-title">请选择地点</div>
      <el-button :icon="Close" @click="closeExpand" circle></el-button>
    </div>
    <div id="bookmark-content">
      <div id="bookmark-filter">
        <div id="bookmark-filter_title">
          <el-text size="large"> 按条件筛选 </el-text>
        </div>
        <div id="bookmark-filter_content">
          <el-text>按类型:</el-text>
          <el-select size="small" placeholder="请选择" value-key="id" v-model="typeValue" clearable>
            <el-option
              v-for="option in typeOptions"
              :key="option.id"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
          <el-text>按区域:</el-text>
          <el-select
            size="small"
            placeholder="请选择"
            value-key="id"
            v-model="categoryValue"
            clearable
          >
            <el-option
              v-for="option in categoryOption"
              :key="option.id"
              :value="option.value"
              :label="option.label"
            />
          </el-select>
        </div>
      </div>
      <el-table
        :data="displayData"
        highlight-current-row
        row-key="id"
        ref="bookmark"
        @current-change="handleCurrentChange"
      >
        <el-table-column label="地点" prop="name" />
        <el-table-column label="描述" prop="description" />
      </el-table>
      <el-pagination
        layout="prev,pager,next"
        class="bookmark-pagination"
        background
        :total="filterData.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="handleCurrentPageChange"
      />
    </div>
  </div>
</template>

<style scoped>
#bookmark {
  width: 480px;
}

#bookmark-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ad0026;
  color: white;
  border-radius: 20px 20px 0 0;
  padding: 10px;
}

#bookmark-title {
  font-size: 18px;
}

#bookmark-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 13px 25px;
  background-color: white;
  border-radius: 0 0 20px 20px;
}

#bookmark-filter {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

#bookmark-filter_content {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

#bookmark-filter_title::before {
  content: '';
  background-color: #ad0026;
  position: absolute;
  width: 5px;
  height: 20px;
  transform: translateX(-10px);
}

.el-select {
  width: 140px;
}

.bookmark-pagination {
  align-self: center;
}
</style>
