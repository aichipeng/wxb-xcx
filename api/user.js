import {
	ajax
} from './request.js'

// 用户信息
export const userInfo = params => {
	return ajax(params, '/user/info', 'GET')
}

// 修改用户信息
export const updateUser = params => {
	return ajax(params, '/user/updateUser', 'POST')
}

// 微信手机号码绑定
export const wxBindPhone = params => {
	return ajax(params, '/auth/wxBindPhone', 'POST')
}

// 上传图片
export const storageUpload = params => {
	return ajax(params, '/storage/upload', 'GET')
}

// 添加意见反馈
export const feedbackSubmit = params => {
	return ajax(params, '/feedback/submit', 'POST')
}



