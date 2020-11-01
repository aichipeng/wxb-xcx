import {
	ajax
} from './request.js'

// 支付成功
export const payOK = params => {
	return ajax(params, '/pay/payOK', 'POST')
}

// 微信支付
export const payWeChat= params => {
	return ajax(params, '/pay/payJsapiWxpay', 'POST')
}

