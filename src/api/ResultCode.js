/**
 * @type {{USER_LOGIN_VALID: {code: number, message: string}}}
 */

const ResultCode = {
    SUCCESS: { code: 200, message: 'success' },
    USER_LOGIN_VALID: { code: 6001, message: '登录已失效，请重新登录' },
    IO_ERROR: { code: 9999, message: '网络错误，请稍后再试' }
}
export {
    ResultCode
}
