import {
	ajax
} from './request.js'

// 根据条件搜素商户
export const businessList = params => {
	return ajax(params, '/business/list', 'GET')
}
