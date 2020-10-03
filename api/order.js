import {
	ajax
} from './request.js'

// 提交订单
export const orderSubmit = params => {
	return ajax(params, '/order/submit', 'POST')
}

// 修改订单
export const updateOrder = params => {
	return ajax(params, '/order/updateOrder', 'POST')
}

// 订单列表(卖家)
export const orderList = params => {
	return ajax(params, '/order/orderList', 'GET')
}

// 订单详情
export const orderDetail = params => {
	return ajax(params, '/order/orderDetail', 'GET')
}

// 填写快递单号
export const orderExpress = params => {
	return ajax(params, '/order/sendExpress', 'POST')
}

// 关闭订单(卖家)
export const orderClose = params => {
	return ajax(params, '/order/closeOrder', 'POST')
}

// 关联订单(卖家)
export const orderByActivity = params => {
	return ajax(params, '/order/associatedOrder', 'GET')
}

// 关联订单统计(卖家)
export const orderByActivityCount = params => {
	return ajax(params, '/order/associatedOrderCount', 'GET')
}

// 订单导出
export const orderExport = params => {
	return ajax(params, '/order/export', 'POST')
}

// 预览订单导出
export const orderExportShow = params => {
	return ajax(params, '/order/exportShow', 'POST')
}
