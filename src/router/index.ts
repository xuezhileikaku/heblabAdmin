import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/components/layouts/BasicLayout.vue'

// 定义路由组件
const Login = () => import('../views/login/index.vue')


const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { 
          title: '仪表盘',
          icon: 'Monitor'
        }
      },
      {
        path: '/user/profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { 
          title: '个人中心',
          icon: 'User',
          hidden: true
        }
      },
      {
        path: '/user/index',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/user/list',
        name: 'List',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户列表' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/settings',
    component: BasicLayout,
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: '/settings/menu',
        name: 'Menu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: { title: '菜单管理', permission: 'system:menu:list' }
      },
      {
        path: '/settings/permission',
        name: 'Permission',
        component: () => import('@/views/system/permission/index.vue'),
        meta: { title: '权限管理', permission: 'system:permission:list' }
      },
      {
        path: '/settings/role',
        name: 'Role',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', permission: 'system:role:list' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router