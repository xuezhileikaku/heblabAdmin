const TOKEN_KEY = 'admin_token'

// 获取 token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

// 设置 token
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

// 移除 token
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// 可选：设置 token 过期时间
export const setTokenWithExpiry = (token: string, expiryHours: number = 24): void => {
  const now = new Date()
  const item = {
    token,
    expiry: now.getTime() + expiryHours * 60 * 60 * 1000,
  }
  localStorage.setItem(TOKEN_KEY, JSON.stringify(item))
}

// 可选：获取 token 并检查是否过期
export const getTokenWithExpiry = (): string | null => {
  const itemStr = localStorage.getItem(TOKEN_KEY)
  if (!itemStr) return null

  const item = JSON.parse(itemStr)
  const now = new Date()

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(TOKEN_KEY)
    return null
  }
  return item.token
}

// 可选：刷新 token 过期时间
export const refreshTokenExpiry = (expiryHours: number = 24): void => {
  const token = getToken()
  if (token) {
    setTokenWithExpiry(token, expiryHours)
  }
}