import {
	ajax
} from './request.js'

// 用户收货地址列表
export const addressList = params => {
	return ajax(params, '/address/list', 'GET')
}

// 添加或更新收货地址
export const addressCreate = params => {
	return ajax(params, '/address/save', 'POST')
}


