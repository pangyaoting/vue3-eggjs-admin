import request from '@/config/axios'

// 汇总统计
export const getDashboardStatsApi = (): Promise<IResponse> => {
  return request.get({ url: '/system/dashboard/stats' })
}

// 公告趋势
export const getDashboardTrendApi = (days = 7): Promise<IResponse> => {
  return request.get({ url: '/system/dashboard/trend', params: { days } })
}