import {
	ajax
} from './request.js'
// 用户账户列表
export const accountList = params => {
	return ajax(params, '/account/accountList', 'GET')
}

// 用户账户信息
export const accountDetail = params => {
	return ajax(params, '/account/detail', 'GET')
}

// 余额列表
export const balanceList = params => {
	return ajax(params, '/account/balanceList', 'GET')
}

// 平台服务费
export const configFee = params => {
	return ajax(params, '/config/fee', 'GET')
}

// 今日销量top
export const todayTop = params => {
	return ajax(params, '/account/todayTop', 'GET')
}

// 今日营收总揽
export const todayTotal = params => {
	return ajax(params, '/account/todayTotal', 'GET')
}

// 累计销量top
export const totalTop = params => {
	return ajax(params, '/account/totalTop', 'GET')
}

// 记一笔
export const accKeepCreate = params => {
	return ajax(params, '/account/bookKeeping', 'POST')
}



