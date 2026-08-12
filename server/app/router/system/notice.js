'use strict'

module.exports = (app) => {
  const { router, controller } = app
  const subRouter = router.namespace('/api/system/notice')
  subRouter.get('/list', controller.system.notice.list)
  subRouter.get('/detail', controller.system.notice.detail)
  subRouter.post('/create', controller.system.notice.create)
  subRouter.post('/update', controller.system.notice.update)
  subRouter.post('/delete', controller.system.notice.delete)
}