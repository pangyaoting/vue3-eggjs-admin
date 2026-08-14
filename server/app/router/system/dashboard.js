'use strict'

module.exports = (app) => {
  const { router, controller } = app
  const subRouter = router.namespace('/api/system/dashboard')
  subRouter.get('/stats', controller.system.dashboard.stats)
  subRouter.get('/trend', controller.system.dashboard.trend)
}