<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in cardList" :key="card.title">
        <el-card shadow="hover" class="card">
          <el-row align="middle">
            <el-col :span="12">
              <h3>{{ card.title }}</h3>
              <div class="number">{{ card.number }}</div>
              <div class="change">
                <span :class="card.change >= 0 ? 'up' : 'down'">
                  {{ card.change >= 0 ? '+' : '' }}{{ card.change }}%
                </span>
                较上周
              </div>
            </el-col>
            <el-col :span="12" class="icon">
              <el-icon :size="40" :color="card.color">
                <component :is="card.icon" />
              </el-icon>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-4">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="chart-header">
              <span>访问趋势</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="visitChartRef" style="height: 350px"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>系统信息</template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="系统版本">v1.0.0</el-descriptions-item>
            <el-descriptions-item label="Node版本">v16.0.0</el-descriptions-item>
            <el-descriptions-item label="系统时间">
              {{ new Date().toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="系统环境">
              {{ mode }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <!-- <div class="dashboard-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <h2><span>欢迎使用管理系统</span></h2>
          </div>
        </template>
      </el-card>
    </div> -->

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getToken } from '@/utils/auth'
const router = useRouter()
const isLoggedIn = ref(false) // 添加登录状态变量

import * as echarts from 'echarts'
import { User, ShoppingCart, Tickets, View } from '@element-plus/icons-vue'

const cardList = ref([
  {
    title: '用户数量',
    number: 1234,
    change: 12,
    icon: 'User',
    color: '#409EFF'
  },
  {
    title: '订单数量',
    number: 5678,
    change: -8,
    icon: 'ShoppingCart',
    color: '#67C23A'
  },
  {
    title: '商品数量',
    number: 890,
    change: 5,
    icon: 'Tickets',
    color: '#E6A23C'
  },
  {
    title: '访问量',
    number: 12345,
    change: 15,
    icon: 'View',
    color: '#F56C6C'
  }
])
const chartType = ref('week')
const visitChartRef = ref()
let chart: echarts.ECharts
const mode = ref(import.meta.env.MODE)
// 检查登录状态
const checkLoginStatus = () => {
  const token = getToken();
  if (!token) {
    router.push('/login') // 未登录时跳转到登录页面
  } else {
    isLoggedIn.value = true // 已登录
    console.log('已登录')
  }
}

// 在组件挂载时检查登录状态
onMounted(() => {
  checkLoginStatus()
  // 配置图表数据
  chart = echarts.init(visitChartRef.value)
  updateChart()
})


watch(chartType, updateChart)

function updateChart() {
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartType.value === 'week'
        ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        : Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '访问量',
      type: 'line',
      smooth: true,
      data: chartType.value === 'week'
        ? [820, 932, 901, 934, 1290, 1330, 1320]
        : Array.from({ length: 30 }, () => Math.floor(Math.random() * 1000 + 500))
    }]
  }
  chart.setOption(option)
}
</script>
<style lang="scss" scoped>
.dashboard {
  .card {
    .number {
      font-size: 24px;
      font-weight: bold;
      margin: 10px 0;
    }

    .change {
      font-size: 12px;
      color: #909399;

      .up {
        color: #67C23A;
      }

      .down {
        color: #F56C6C;
      }
    }

    .icon {
      display: flex;
      justify-content: flex-end;
    }
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mt-4 {
    margin-top: 20px;
  }
}
</style>