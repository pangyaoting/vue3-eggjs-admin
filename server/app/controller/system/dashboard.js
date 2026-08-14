'use strict'

const BaseController = require('../../core/base_controller')

class DashboardController extends BaseController {
  // 汇总统计
  async stats() {
    const { service } = this
    const noticeCount = await service.system.dashboard.noticeCount()
    const userCount = await service.system.dashboard.userCount()
    const roleCount = await service.system.dashboard.roleCount()
    const noticeStatusDist = await service.system.dashboard.noticeStatusDist()
    const userStatusDist = await service.system.dashboard.userStatusDist()
    this.success({
      noticeCount,
      userCount,
      roleCount,
      noticeStatusDist,
      userStatusDist
    })
  }

  // 公告趋势
  async trend() {
    const { ctx, service } = this
    const { days = 7 } = ctx.query
    const list = await service.system.dashboard.noticeTrend(Number(days))
    this.success(list)
  }
}

module.exports = DashboardController