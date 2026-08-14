'use strict'

const Service = require('egg').Service

class DashboardService extends Service {
  constructor(ctx) {
    super(ctx)
    // 跨多张表统计，不能用单表 BaseService，直接拿 knex 实例
    this.db = this.app.mysql.get('permission.master')
  }

  // 公告总数
  async noticeCount() {
    const [row] = await this.db('notices').count('* as total')
    return row ? Number(row.total) : 0
  }

  // 用户总数（只统计未删除的）
  async userCount() {
    const [row] = await this.db('users')
      .where('deleted', 0)
      .where('is_admin', 0)
      .count('* as total')
    return row ? Number(row.total) : 0
  }

  // 角色总数
  async roleCount() {
    const [row] = await this.db('roles').count('* as total')
    return row ? Number(row.total) : 0
  }

  // 公告按状态分布（返回 [{status, count}]）
  async noticeStatusDist() {
    return await this.db('notices')
      .select('status')
      .count('* as count')
      .groupBy('status')
  }

  // 用户按状态分布（只统计未删除的）
  async userStatusDist() {
    return await this.db('users')
      .where('deleted', 0)
      .where('is_admin', 0)
      .select('status')
      .count('* as count')
      .groupBy('status')
  }

  // 近 N 天公告发布趋势（返回 [{date, count}]）
  async noticeTrend(days = 7) {
    return await this.db('notices')
      .select(this.db.raw('DATE(created_at) as date'), this.db.raw('count(*) as count'))
      .where('created_at', '>=', this.db.raw('DATE_SUB(CURDATE(), INTERVAL ? DAY)', [days - 1]))
      .groupBy(this.db.raw('DATE(created_at)'))
      .orderBy('date', 'asc')
  }
}

module.exports = DashboardService