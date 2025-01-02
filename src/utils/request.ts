import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken, removeToken } from './auth'
import router from '@/router'
import apiUrl from '@/config/apiUrl'

interface Response<T = any> {
    code: number
    data: T
    message: string
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: apiUrl, // API 的 base_url
    timeout: 15000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})

// 请求拦截器
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if(!config.headers) config.headers = {}
        // 获取 token 并加入请求头
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;  // 修复这里
        }
        return config;
    },
    (error) => {
        // 处理请求错误
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse<Response>) => {
        const res = response.data

        // 这里根据你的后端接口规范来定义
        // 假设后端返回格式为 { code: number, data: any, message: string }
        if(res.code === 200) return res.data

        // 处理其他状态码
        if (res.code === 401) {
            // token 过期或无效
            ElMessageBox.confirm(
                '登录状态已过期，请重新登录',
                '系统提示',
                {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                removeToken()
                router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
            })
        } else {
            ElMessage({
                message: res.message || '系统错误',
                type: 'error',
                duration: 5 * 1000
            })
        }
        return Promise.reject(new Error(res.message || '系统错误'))
    },
    (error) => {
        console.error('Response error:', error)
        const { response } = error
        
        // 处理 HTTP 状态码错误
        if (response && response.status) {
            const errorMessages: Record<number, string> = {
                400: '请求错误',
                401: '未授权，请重新登录',
                403: '拒绝访问',
                404: '请求地址出错',
                408: '请求超时',
                500: '服务器内部错误',
                501: '服务未实现',
                502: '网关错误',
                503: '服务不可用',
                504: '网关超时',
                505: 'HTTP版本不受支持'
            }
            
            const errorMessage = errorMessages[response.status] || `连接错误${response.status}`
            
            ElMessage({
                message: errorMessage,
                type: 'error',
                duration: 5 * 1000
            })

            // 401 状态码特殊处理
            if (response.status === 401) {
                removeToken()
                router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)
            }
        } else {
            ElMessage({
                message: '网络连接异常，请检查网络',
                type: 'error',
                duration: 5 * 1000
            })
        }
        return Promise.reject(error)
    }
)

// 请求方法封装
const request = {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return service.get(url, config)
    },

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return service.post(url, data, config)
    },

    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        return service.put(url, data, config)
    },

    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return service.delete(url, config)
    }
}

export default request