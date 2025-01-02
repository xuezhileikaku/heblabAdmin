// 表单验证规则
export const validateUsername = (rule: any, value: string, callback: Function) => {
    if (!value) {
        callback(new Error('请输入用户名'))
    } else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(value)) {
        callback(new Error('用户名只能包含字母、数字、下划线，长度3-20'))
    } else {
        callback()
    }
}

export const validatePassword = (rule: any, value: string, callback: Function) => {
    if (!value) {
        callback(new Error('请输入密码'))
    } else if (value.length < 6 || value.length > 20) {
        callback(new Error('密码长度必须在6-20个字符之间'))
    } else {
        callback()
    }
}