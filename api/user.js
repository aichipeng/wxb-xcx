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

// 上传图片
export const storageUpload = params => {
	return ajax(params, '/storage/upload', 'GET')
}


