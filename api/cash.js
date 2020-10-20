import {
	ajax
} from './request.js'

// 取现记录
export const cashList = params => {
	return ajax(params, '/cash/list', 'GET')
}

// 取现申请
export const cashExtract = params => {
	return ajax(params, '/cash/extract', 'POST')
}

