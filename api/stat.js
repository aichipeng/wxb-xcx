import {
	ajax
} from './request.js'

// 日统计
export const statisticsDay = params => {
	return ajax(params, '/statistics/day', 'GET')
}

// 周统计
export const statisticsWeek = params => {
	return ajax(params, '/statistics/week', 'GET')
}

export const statisticsWeekList = params => {
	return ajax(params, '/statistics/weekList', 'GET')
}

// 月统计
export const statisticsMonth = params => {
	return ajax(params, '/statistics/month', 'GET')
}


