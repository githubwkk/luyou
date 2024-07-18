import { defineStore } from 'pinia'
import router, { asyncRoutes, fixedRoutes } from '@/router'
import { ref } from 'vue'
import { GetMenus } from '@/api/menu'
//----------------------------------------------------------------------------------
//---------------------------···动态生成的菜单总Pinia······---------------------------------
//----------------------------------------------------------------------------------
export const useMenus = defineStore('menu', () => {
  //URl
  const generateUrl = (path, parentPath) => {
    return path.startsWith('/')
      ? path
      : path
      ? `${parentPath}/${path}`
      : parentPath
  }
  //路由
  const getFilterRoutes = (targetRoutes, ajaxRoutes) => {
    const filterRoutes = []
    ajaxRoutes.forEach(item => {
      const target = targetRoutes.find(target => target.name === item.name)
      if (target) {
        const { children: targetChildren, ...rest } = target
        const route = {
          ...rest
        }
        if (item.children) {
          route.children = getFilterRoutes(targetChildren, item.children)
        }
        filterRoutes.push(route)
      }
    })
    return filterRoutes
  }

  //菜单
  const getFilterMenus = (arr, parentPath = '') => {
    const menus = []

    arr.forEach(item => {
      if (!item.hidden) {
        const menu = {
          url: generateUrl(item.path, parentPath),
          title: item.meta.title,
          icon: item.icon
        }
        if (item.children) {
          if (item.children.filter(child => !child.hidden).length <= 1) {
            menu.url = generateUrl(item.children[0].path, menu.url)
          } else {
            menu.children = getFilterMenus(item.children, menu.url)
          }
        }
        menus.push(menu)
      }
    })

    return menus
  }

  const menus = ref([])
  const setMenus = data => {
    menus.value = data
  }
  const generateMenus = async () => {
    // 从后台获取菜单动态菜单
    const { code, data } = await GetMenus()
    if (+code === 200) {
      // 添加路由之前先删除所有动态路由
      asyncRoutes.forEach(item => {
        router.removeRoute(item.name)
      })
      // 过滤出需要添加的动态路由（system路由-固定路由）
      const filterRoutes = getFilterRoutes(asyncRoutes, data)
      filterRoutes.forEach(route => router.addRoute(route))

      // 生成菜单(固定菜单+需要添加的菜单）
      const menus = getFilterMenus([...fixedRoutes, ...filterRoutes])
      setMenus(menus)
    } else {
      throw new Error('获取菜单失败，可能登录过期')
    }
  }
  return {
    menus,
    setMenus,
    generateMenus
  }
})
