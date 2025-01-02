export interface User {
    id: string
    username: string
    realName: string
    email: string
    avatar?: string
    roles: string[]
    status: number
}