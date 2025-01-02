import { defineStore } from 'pinia'
import { login, getUserInfo, logout } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'; // 导入 useRouter


interface UserState {
  token: string | null
  userInfo: any
  roles: string[]
  permissions: string[]
}
const router = useRouter();
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken(),
    userInfo: null,
    roles: [],
    permissions: []
  }),

  actions: {
    async login(credentials: { username: string, password: string }) {
      try {
        // const credentialsPlain = { ...credentials };
        const response = await login(credentials)
        console.log('store response:', response);
        this.token = response.token
        this.userInfo = response.user_info
        setToken(response.token)
        return response
      } catch (error) {
        removeToken()
        throw error
      }
    },

    async getUserInfo() {
      try {
        const data = await getUserInfo()
        this.userInfo = data
        this.roles = data.roles || []
        this.permissions = data.permissions || []
        return data
      } catch (error) {
        removeToken()
        throw error
      }
    },

    async logout() {
      try {
        await logout()
      } finally {
        this.token = null
        this.userInfo = null
        this.roles = []
        this.permissions = []
        removeToken()
      }
    }
  }
})