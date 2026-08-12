const BaseService = require('../../core/base_service')

class NoticeService extends BaseService {
  constructor(ctx) {
    super(ctx, 'permission', 'notices')
  }
}

module.exports = NoticeService