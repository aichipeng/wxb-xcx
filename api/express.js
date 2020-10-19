import {
	ajax
} from './request.js'

// 查询物流信息
export const expressDetial = params => {
	return ajax(params, '/express/checkExpress', 'POST')
}

// 物流列表
export const expressList = params => {
	return ajax(params, '/express/list', 'GET')
}

// 预约快递
export const expressSubscribe = params => {
	return ajax(params, '/express/subscribe', 'POST')
}
