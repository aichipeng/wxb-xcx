<script>
	import {
		getOpenId
	} from "@/api/login.js"
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef MP-WEIXIN
			uni.login({
				success: res => {
					console.log('code', res)
					// getOpenId({
					// 	code: res.code
					// }).then(res => {
					// 	console.log('openId',res)
					// }).catch(err=>{
					// 	console.log('err',err)
					// })
				}
			})
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #F7F7F7;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #333;
	}

	.flex-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	image {
		display: block;
	}
	.flex-1 {
		flex: 1;
	}

	/* 定位垂直水平居中 */
	.absolute-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	/* 定位垂直居中 */
	.absolute-col-center {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	/* 定位水平居中 */
	.absolute-row-center {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	// 文本单行溢出打点
	.acp-ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	// 文本两行行溢出打点
	.acp-ellipsis-l2 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		word-break: break-all;
	}

	.border-top {
		border-top: 2rpx solid #EEEEEE;
	}

	.border-bottom {
		border-bottom: 2rpx solid #EEEEEE;
	}

	button {
		border: none;
	}

	button:after {
		display: none;
	}
</style>
