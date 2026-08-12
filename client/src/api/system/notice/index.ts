import request from '@/config/axios'
import type { NoticeData, NoticeListParams } from './types'

// 获取公告列表
export const getNoticeListApi = (params: NoticeListParams): Promise<IResponse> => {
  return request.get({ url: '/system/notice/list', params })
}

// 获取公告详情
export const getNoticeDetailApi = (id: number): Promise<IResponse> => {
  return request.get({ url: '/system/notice/detail', params: { id } })
}

// 新增公告
export const createNoticeApi = (data: Partial<NoticeData>): Promise<IResponse> => {
  return request.post({ url: '/system/notice/create', data })
}

// 编辑公告
export const updateNoticeApi = (data: Partial<NoticeData>): Promise<IResponse> => {
  return request.post({ url: '/system/notice/update', data })
}

// 删除公告
export const deleteNoticeApi = (id: number): Promise<IResponse> => {
  return request.post({ url: '/system/notice/delete', data: { id } })
}