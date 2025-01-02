<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
      <div class="logo">
        <h2 v-if="!isCollapse">HebLab Admin</h2>
        <h2 v-else>HLA</h2>
      </div>
      <el-menu :default-active="route.path" class="el-menu-vertical" :collapse="isCollapse" background-color="#304156"
        text-color="#bfcbd9" active-text-color="#409EFF" router>
        <el-menu-item index="/dashboard">
          <el-icon>
            <Monitor />
          </el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <Tools />
            </el-icon>
            <span>系统设置</span>
          </template>
          <el-sub-menu index="/user">
            <template #title>用户管理</template>
            <el-menu-item index="/user/profile">个人信息</el-menu-item>
            <el-menu-item index="/user/index">用户列表</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/menu">
            <template #title>菜单设置</template>
            <el-menu-item index="/settings/menu">菜单列表</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/role">
            <template #title>角色设置</template>
            <el-menu-item index="/settings/role">角色列表</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/permission">
            <template #title>权限设置</template>
            <el-menu-item index="/settings/permission">权限列表</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <el-menu-item index="/log">
          <el-icon>
            <MessageBox />
          </el-icon>
          <template #title>消息</template>
        </el-menu-item>

      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="toggle-icon" @click="toggleSidebar">
            <component :is="isCollapse ? 'Expand' : 'Fold'" />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <el-button type="primary">
              {{ userStore.userInfo?.username || '管理员' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="userInfo">个人信息</el-dropdown-item>
                <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主要内容区 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router' 
import { useUserStore } from '@/stores/user'
import {
  Monitor,
  User,
  Fold,
  Expand,
  ArrowDown
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()  // 添加这一行
const userStore = useUserStore()
console.log('userStore', userStore.userInfo)
const isCollapse = ref(false)
// 侧边切换
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}
// 退出登录
const logOut = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')

  router.push('/login')  // 更新这里
}

// 跳转到个人信息页面
const userInfo = () => {
  console.log('Navigating to user info page'); // 添加调试信息
  router.push('/profile')  // 更新这里
}
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;

  .aside {
    background-color: #304156;
    transition: width 0.3s;

    .logo {
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #fff;
      overflow: hidden;

      h2 {
        font-size: 16px;
      }
    }

    .el-menu {
      border-right: none;
    }
  }

  .header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .header-left {
      display: flex;
      align-items: center;

      .toggle-icon {
        margin-right: 20px;
        cursor: pointer;
        font-size: 20px;
      }
    }

    .user-info {
      cursor: pointer;
      display: flex;
      align-items: center;

      .el-icon {
        margin-left: 5px;
        font-size: 20px;
      }
    }
  }

  .main {
    background-color: #f0f2f5;
    padding: 20px;
  }
}

:deep(.el-menu-item) {
  .el-icon {
    font-size: 18px;
    margin-right: 5px;
  }
}

:deep(.el-menu--collapse) {
  .el-menu-item {
    .el-icon {
      margin-right: 0;
    }
  }
}
</style>