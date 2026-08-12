const BaseController = require('../../core/base_controller')

class NoticeController extends BaseController {
  // 分页列表
  async list() {
    const { ctx, service } = this
    const { page = 1, pageSize = 10, title } = ctx.query
    const where = {}
    if (title) {
      where.title = title
    }
    const list = await service.system.notice.list({ page, pageSize, where })
    this.success(list)
  }

  // 详情
  async detail() {
    const { ctx, service } = this
    const rules = { id: 'number' }
    ctx.validate(rules, ctx.query)
    const { id } = ctx.query
    const data = await service.system.notice.findOne({ id })
    this.success(data)
  }

  // 新增
  async create() {
    const { ctx, service } = this
    const rules = {
      title: 'string',
      content: 'string?'
    }
    ctx.validate(rules)
    const { title, content } = ctx.request.body
    await service.system.notice.create({ title, content, status: 1 })
    this.success()
  }

  // 编辑
  async update() {
    const { ctx, service } = this
    const rules = {
      id: 'number',
      title: 'string'
    }
    ctx.validate(rules)
    const { id, title, content, status } = ctx.request.body
    const data = { title, content }
    if (status !== undefined) data.status = status
    await service.system.notice.update(data, { id })
    this.success()
  }

  // 删除
  async delete() {
    const { ctx, service } = this
    const rules = { id: 'number' }
    ctx.validate(rules)
    const { id } = ctx.request.body
    await service.system.notice.destroy({ id })
    this.success()
  }
}

module.exports = NoticeController