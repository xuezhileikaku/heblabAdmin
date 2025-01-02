<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2 class="login-title">系统登录</h2>
      </template>

      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock" show-password />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

// 登录表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_-]+$/, message: '用户名只能包含字母、数字、下划线和连字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    // { pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/, message: '密码需包含大小写字母和数字', trigger: 'blur' }
  ]
}
// 登录
let debounceLogin: ReturnType<typeof setTimeout> | null = null;

const handleLogin = async () => {
  console.log('handleLogin');
  if (debounceLogin) clearTimeout(debounceLogin);
  debounceLogin = setTimeout(async () => {
    if (!loginFormRef.value) return;

    await loginFormRef.value.validate(async (valid) => {
      if (valid) {
        loading.value = true;
        try {
          await userStore.login(loginForm)
          ElMessage.success('登录成功')
          router.push('/')
        } catch (error: any) {
          ElMessage.error(error.message || '登录失败');
        } finally {
          loading.value = false;
        }
      }
    });
  }, 500);  // 设置 500ms 的防抖
};
</script>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 5px;

  .login-card {
    width: 400px;

    .login-title {
      text-align: center;
      font-weight: bold;
      color: #303133;
    }

    .login-button {
      width: 100%;
    }
  }
}
</style>