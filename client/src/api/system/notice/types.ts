// 公告数据接口
export interface NoticeData {
  id: number
  title: string
  content: string
  status: number
  created_at: string
}

// 公告列表查询参数
export interface NoticeListParams {
  page: number
  pageSize: number
  title?: string
}