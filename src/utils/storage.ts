// localStorage封装
export const storage = {
    get(key: string) {
        const value = localStorage.getItem(key)
        try {
            return JSON.parse(value as string)
        } catch {
            return value
        }
    },
    set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    remove(key: string) {
        localStorage.removeItem(key)
    },
    clear() {
        localStorage.clear()
    }
}