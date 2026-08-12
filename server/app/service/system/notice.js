const BaseService = require('../../core/base_service')

class NoticeService extends BaseService {
  constructor(ctx) {
    super(ctx, 'permission', 'notices')
  }

  // 分页列表 + 标题模糊查询（覆盖父类的通用 list）
  async list({ page = 1, pageSize = 10, title } = {}) {
    const query = this.slaveDbQuery.select()
    if (title) {
      query.where('title', 'like', `%${title}%`)
    }
    const countResult = await query.clone().count('* as total').first()
    const list = await query
      .orderBy('id', 'desc')
      .limit(Number(pageSize))
      .offset((Number(page) - 1) * Number(pageSize))
    return {
      list,
      total: countResult ? Number(countResult.total) : 0
    }
  }
}

module.exports = NoticeService