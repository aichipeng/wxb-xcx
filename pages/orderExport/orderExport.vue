<template>
	<view class="activity-export">
		<view class="tips">
			<text>您已选 <text style="margin: 0 10rpx;">{{formData.orderNos.length}}</text> 个订单数据，生成EXCEL</text>
		</view>
		<view class="export-content">
			<view class="title">导出示例：</view>
			<view class="value">
				<image style="width: 100%; height: 220rpx;" src="@/static/images/excel.png"></image>
			</view>
			<view class="title">将EXCEL导出到邮箱：</view>
			<view class="value">
				<input class="input" type="text" v-model="formData.email" placeholder="请输入有效的邮箱地址" placeholder-class="input-place" />
			</view>
		</view>
		<view class="btn-bottom flex-col" @click="submit()">
			<text>下一步</text>
		</view>
	</view>
</template>

<script>
	import {
		orderExport
	} from "@/api/order.js"
	export default {
		data() {
			return {
				formData: {
					email: undefined,
					orderNos: []
				}
			};
		},
		onLoad(options) {
			const _this = this
			if (options.item) {
				this.formData.orderNos = JSON.parse(options.item)
			}
		},
		methods: {
			submit() {
				const {
					email
				} = this.formData
				let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
				if (!email) {
					uni.showToast({
						title: "请输入邮箱！",
						icon: "none",
						mask: true
					})
					return
				} else if (!reg.test(email)) {
					uni.showToast({
						title: "请输入正确邮箱！",
						icon: "none",
						mask: true
					})
					return
				}
				uni.showModal({
					title: email,
					cancelColor: '#1677FF',
					confirmColor: '#1677FF',
					confirmText: '确认邮箱',
					content: '请确认你的邮箱填写无误，账单流水包含个人重要隐私信息，请勿随意发送。',
					success: function(res) {
						if (res.confirm) {
							orderExport(this.formData).then(res => {

							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.activity-export {
		font-size: 30rpx;
		line-height: 42rpx;
		padding: 0 0 30rpx;

		.tips {
			background-color: #5D6368;
			padding: 32rpx 24rpx 34rpx;
			color: #fff;
		}

		.export-content {
			padding: 41rpx 24rpx;

			.value {
				margin: 41rpx 0 61rpx;

				.input {
					background-color: #F9F9F9;
					border: 2rpx solid #EEE;
					padding: 21rpx 24rpx;
					font-size: 29rpx;
					line-height: 40rpx;
				}

				.input-place {
					color: #BBB;
					font-size: 29rpx;
					line-height: 40rpx;
				}
			}
		}

		.btn-bottom {
			height: 90rpx;
			background: #FFD44D;
			box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
			border-radius: 45rpx;
			margin: 60rpx 24rpx 0;
		}
	}
</style>
