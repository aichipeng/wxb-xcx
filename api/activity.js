import {
	ajax
} from './request.js'

// 首页活动列表
export const activityIndex = params => {
	return ajax(params, '/activity/stayActivityTotal', 'GET')
}

// 活动列表
export const activityList = params => {
	return ajax(params, '/activity/activityTotal', 'GET')
}

// 发布活动
export const activityCreate = params => {
	return ajax(params, '/activity/add', 'POST')
}

// 保存活动
export const activityHold = params => {
	return ajax(params, '/activity/hold', 'POST')
}

// 活动详情
export const activityDetail = params => {
	return ajax(params, '/activity/detail', 'GET')
}

// 关闭活动
export const activityClose = params => {
	return ajax(params, '/activity/close', 'GET')
}

// 修改名片
export const updateWxNo = params => {
	return ajax(params, '/activity/updateWxNo', 'POST')
}
