'use strict'
const _ = require('lodash')

module.exports = () => {
  return async function (ctx, next) {
    const url = ctx.request.path
    const method = ctx.request.method

    // 1、登录 / 2FA 校验接口放行（2FA 第 4 步才用，先留好）
    if (url === '/api/system/user/sign_in' || url === '/api/system/user/verify_2fa') {
      return await next()
    }

    // 2、会话校验：无 user → 401（会话过期/未登录统一在这里处理）
    if (_.isNil(ctx.session.user)) {
      ctx.status = 401
      ctx.body = { code: 401, msg: '未登录或登录已过期' }
      return
    }

    // 3、白名单：需登录态，但不做资源权限校验
    const whitelist = [
      '/api/system/user/resource',
      '/api/system/user/sign_out',
      '/api/system/dashboard/stats',   // 数据看板，resources.json 缺资源先放行
      '/api/system/dashboard/trend',
      '/api/common/upload'
    ]
    if (whitelist.some((item) => item === url)) {
      return await next()
    }

    // 4、单点登录挤下线（第 3 步打开开关后生效）
    if (ctx.app.config.login.singleLogin) {
      const sessionId = ctx.app.sessionMap.has(ctx.session.user.id)
        ? ctx.app.sessionMap.get(ctx.session.user.id)
        : -1
      if (sessionId !== ctx.session.id) {
        ctx.session = null
        ctx.status = 401
        ctx.body = { code: 401, msg: '账号已在其他地方登录' }
        return
      }
    }

    // 5、URL 归一化：/api/system/user/list → /user/list（与 resources.json 的 uri 对齐，不用改库数据）
    const permissionUrl = url.replace(/^\/api\/system/, '')

    // 6、管理员放行
    const user = await ctx.service.system.user.findOne({ id: ctx.session.user.id })
    if (user?.is_admin === 1) {
      return await next()
    }

    // 7、普通用户按资源表精确鉴权
    const hasPermission = await ctx.service.system.user.hasPermission({
      userId: ctx.session.user.id,
      url: permissionUrl,
      method
    })
    if (!hasPermission) {
      ctx.status = 403
      ctx.body = { code: 403, msg: '无权限访问该资源' }
      return
    }
    await next()
  }
}