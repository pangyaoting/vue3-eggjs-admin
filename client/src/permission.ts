import router from './router'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useCache } from '@/hooks/web/useCache'

import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'

import { usePageLoading } from '@/hooks/web/usePageLoading'
import { ElMessage } from 'element-plus'

const permissionStore = usePermissionStoreWithOut()

const appStore = useAppStoreWithOut()

const { wsCache } = useCache()

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()

  try {
    if (wsCache.get(appStore.getUserInfo)) {
      // 检测是否获取过用户所对应的资源
      if (permissionStore.resources === null) {
        await permissionStore.getResource()
      }
      if (to.path === '/login') {
        next({ path: '/' })
      } else if (to.path === '/error/403' || to.path.includes('redirect')) {
        //  无需进行权限判定的路由
        next()
      } else {
        if (
          !to?.meta?.noPermission &&
          !permissionStore.resources?.some((item) => item.name === to.name)
        ) {
          return next('/error/403')
        }

        next()
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      }
    }
  } catch (e) {
    // ↓↓↓ 新增：捕获异常，防止导航卡死
    console.error('路由守卫异常:', e)
    ElMessage.error('页面加载失败，请重试')
    next(false) // 取消导航，停在原页面，不会白屏
  }

  if (wsCache.get(appStore.getUserInfo)) {
    // 检测是否获取过用户所对应的资源
    if (permissionStore.resources === null) {
      await permissionStore.getResource()
    }
    if (to.path === '/login') {
      next({ path: '/' })
    } else if (to.path === '/error/403' || to.path.includes('redirect')) {
      //  无需进行权限判定的路由
      next()
    } else {
      if (
        !to?.meta?.noPermission &&
        !permissionStore.resources?.some((item) => item.name === to.name)
      ) {
        return next('/error/403')
      }

      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
