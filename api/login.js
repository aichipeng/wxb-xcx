import {
	ajax
} from './request.js'

// 小程序通过code获取openId
export const getOpenId = params => {
	return ajax(params, '/auth/getCode', 'POST')
}

// 微信小程序授权登录
export const wxAuth = (params = {}) => {
	return ajax(params, '/auth/loginByWx', 'POST')
}

// 获取短信验证码
export const regCaptcha = params => {
	return ajax(params, '/auth/regCaptcha', 'POST')
}

// 短信验证码登录
export const loginCode = (params = {}) => {
	return ajax(params, '/auth/loginCode', 'POST')
}

// 账号密码登录
export const loginAuth = (params = {}) => {
	return ajax(params, '/auth/login', 'POST')
}

// 获取小程序码
export const getWacodeunlimit = (params = {}) => {
	return ajax(params, '/auth/getwxacodeunlimit', 'GET')
}

// 退出登录
export const authLogout = (params = {}) => {
	return ajax(params, '/auth/logout', 'POST')
}
