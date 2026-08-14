<template>
  <div class="dashboard-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="8">
        <el-card>
          <div class="stat-item">
            <div class="stat-num">{{ stats.noticeCount }}</div>
            <div class="stat-label">{{ t('dashboard.noticeCount') }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="stat-item">
            <div class="stat-num">{{ stats.userCount }}</div>
            <div class="stat-label">{{ t('dashboard.userCount') }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="stat-item">
            <div class="stat-num">{{ stats.roleCount }}</div>
            <div class="stat-label">{{ t('dashboard.roleCount') }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表（容器常驻，空数据用 echarts title 提示） -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>{{ t('dashboard.noticeStatus') }}</template>
          <div ref="noticePieRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>{{ t('dashboard.userStatus') }}</template>
          <div ref="userPieRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="24" class="mt-20px">
        <el-card>
          <template #header>{{ t('dashboard.noticeTrend') }}</template>
          <div ref="trendLineRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStatsApi, getDashboardTrendApi } from '@/api/system/dashboard'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

// 统计数据
const stats = reactive({
  noticeCount: 0,
  userCount: 0,
  roleCount: 0,
  noticeStatusDist: [] as { status: number; count: number }[],
  userStatusDist: [] as { status: number; count: number }[]
})

// 图表容器
const noticePieRef = ref<HTMLDivElement>()
const userPieRef = ref<HTMLDivElement>()
const trendLineRef = ref<HTMLDivElement>()

// echarts 实例
let noticePie: echarts.ECharts | null = null
let userPie: echarts.ECharts | null = null
let trendLine: echarts.ECharts | null = null

// 加载数据
const loadData = async () => {
  const res = await getDashboardStatsApi()
  Object.assign(stats, res.data)
  renderCharts()
}

// 渲染图表（容器常驻，无需 nextTick）
const renderCharts = () => {
  // 公告状态饼图
  if (noticePieRef.value) {
    noticePie = echarts.init(noticePieRef.value)
    noticePie.setOption({
      title: {
        text: stats.noticeStatusDist.length ? '' : t('dashboard.noNoticeData'),
        left: 'center',
        top: 'center',
        textStyle: { fontSize: 14, color: '#909399' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 条 ({d}%)'
      },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          label: {
            show: true,
            formatter: '{b}: {c} 条 ({d}%)'
          },
          data: stats.noticeStatusDist.map((item) => ({
            name: item.status === 1 ? t('notice.show') : t('notice.hide'),
            value: item.count
          }))
        }
      ]
    })
  }

  // 用户状态饼图
  if (userPieRef.value) {
    userPie = echarts.init(userPieRef.value)
    userPie.setOption({
      title: {
        text: stats.userStatusDist.length ? '' : t('dashboard.noUserData'),
        left: 'center',
        top: 'center',
        textStyle: { fontSize: 14, color: '#909399' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} 条 ({d}%)'
      },
      legend: { bottom: 0 },
      series: [
        {
          type: 'pie',
          radius: ['40%', '60%'],
          label: {
            show: true,
            formatter: '{b}: {c} 条 ({d}%)'
          },
          data: stats.userStatusDist.map((item) => ({
            name: item.status === 1 ? t('dashboard.normal') : t('dashboard.frozen'),
            value: item.count
          }))
        }
      ]
    })
  }
}

const trendData = ref<{ date: string; count: number }[]>([])

// 加载趋势数据并渲染折线图
const loadTrend = async () => {
  const res = await getDashboardTrendApi(7)
  trendData.value = res.data
  if (trendLineRef.value) {
    trendLine = echarts.init(trendLineRef.value)
    trendLine.setOption({
      title: {
        text: trendData.value.length ? '' : t('dashboard.noTrendData'),
        left: 'center',
        top: 'center',
        textStyle: { fontSize: 14, color: '#909399' }
      },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: trendData.value.map((item) => item.date)
      },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        {
          name: t('dashboard.noticeCount'),
          type: 'line',
          smooth: true,
          data: trendData.value.map((item) => item.count),
          areaStyle: { opacity: 0.2 }
        }
      ]
    })
  }
}

// 窗口变化时图表自适应
const handleResize = () => {
  noticePie?.resize()
  userPie?.resize()
  trendLine?.resize()
}

onMounted(async () => {
  await loadData()
  await loadTrend()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  noticePie?.dispose()
  userPie?.dispose()
  trendLine?.dispose()
})
</script>

<style scoped lang="less">
.dashboard-container {
  padding: 16px;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px 0;
}

.stat-num {
  font-size: 32px;
  font-weight: 600;
  color: var(--el-color-primary);
}

.stat-label {
  margin-top: 6px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.chart-box {
  height: 300px;
  width: 100%;
}

.mt-20px {
  margin-top: 20px;
}
</style>