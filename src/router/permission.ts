import router from './index'
import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/login']
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, from, next) => {
 NProgress.start()
 const token = getToken()
 const userStore = useUserStore()
 
 document.title = `${to.meta.title} - Heblab Admin`

 if (token) {
   if (to.path === '/login') {
     next('/')
   } else {
     try {
       if (!userStore.userInfo) {
         await userStore.getUserInfo()
       }
       const hasPermission = to.meta.permission ? 
         userStore.permissions.includes(to.meta.permission as string) : 
         true
       hasPermission ? next() : next('/403')
     } catch {
       await userStore.logout()
       next(`/login?redirect=${to.path}`)
     }
   }
 } else {
   whiteList.includes(to.path) ? 
     next() : 
     next(`/login?redirect=${to.path}`)
 }
})

router.afterEach(() => {
 NProgress.done()
})