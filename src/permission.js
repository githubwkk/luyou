import { ElLoading } from 'element-plus'
import router from '@/router'
import { TOKEN } from '@/pinia/modules/app' // TOKEN变量名
import { nextTick } from 'vue'
import { useApp } from './pinia/modules/app'
import { useAccount } from './pinia/modules/account'
import { useMenus } from './pinia/modules/menu'

const getPageTitle = title => {
  const { title: appTitle } = useApp()
  if (title) {
    return `${title} - ${appTitle}`
  }
  return appTitle
}
// checkRole 路由守卫函数

// 白名单，里面是路由对象的 name
const WhiteList = [
  'login',
  'register',
  'HotelOrder',
  'TouristOrder',
  'ArticleListHome',
  'singleArticle',
  'HotelListHome',
  'singleHotel',
  'TouristListHome',
  'singleTourist',
  'lock',
  'index',
  'Dashboard'
]

let loadingInstance = null
// vue-router4的路由守卫不再是通过next放行，而是通过return返回true或false或者一个路由地址
router.beforeEach(async to => {
  //加载页面
  loadingInstance = ElLoading.service({
    lock: true,
    // text: '正在加载数据，请稍候~',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  // try {
  //   const { getUserinfo } = useAccount()
  //   await getUserinfo()
  // } catch (e) {
  //   console.log(e)
  // }
  // if (to.name === 'index') {
  //   const { getUserinfo } = useAccount()
  //   await getUserinfo()
  // }
  if (WhiteList.includes(to.name)) {
    return true
  }
  //先判断有无token，没有再检测白名单，白名单没有则跳转登录界面登录
  if (!window.localStorage[TOKEN]) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath, // redirect是指登录之后可以跳回到redirect指定的页面
        message: '请先登录'
      },
      replace: true
    }
  } else {
    //token存在
    const { userinfo, getUserinfo } = useAccount()
    if (!userinfo) {
      try {
        // 获取用户信息
        await getUserinfo()
      } catch (err) {
        loadingInstance.close()
        console.log('登录过期')
        return {
          name: 'login',
          query: {
            redirect: to.fullPath, // redirect是指登录之后可以跳回到redirect指定的页面
            message: '登录过期'
          },
          replace: false
        }
      }
      return to.fullPath
    }

    // 生成菜单（如果你的项目有动态菜单，在此处会添加动态路由）
    const { menus, generateMenus } = useMenus()
    if (menus.length <= 0) {
      try {
        await generateMenus()
        return to.fullPath // 添加动态路由后，必须加这一句触发重定向，否则会404
      } catch (err) {
        loadingInstance.close()
        return {
          name: 'login',
          query: {
            redirect: to.fullPath, // redirect是指登录之后可以跳回到redirect指定的页面
            message: '登录过期'
          },
          replace: false
        }
        // return false
      }
    }

    // 判断是否处于锁屏状态
    if (to.name !== 'lock') {
      const { authorization } = useApp()
      if (!!authorization && !!authorization.screenCode) {
        return {
          name: 'lock',
          query: {
            redirect: to.path
          },
          replace: true
        }
      }
    }
  }
})

router.afterEach(to => {
  loadingInstance.close()
  if (router.currentRoute.value.name === to.name) {
    nextTick(() => {
      document.title = getPageTitle(!!to.meta && to.meta.truetitle)
    })
  }
})
