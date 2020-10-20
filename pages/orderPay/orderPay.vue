<template>
	<view class="order-pay-page">
		<view class="address-card flex-row" @click="navigateTo('/pages/addressScreen/addressScreen')">
			<uni-icons type="location-filled" size="16" color="#444" style="margin-left: -8rpx;"></uni-icons>
			<view class="address-info flex-1">
				<block v-if="formData.address">
					<view class="user flex-row">
						<text class="name acp-ellipsis">{{formData.consignee}}</text>
						<text class="phone">{{formData.mobile}}</text>
					</view>
					<view class="address">收货地址：{{formData.address}}</view>
				</block>
				<block v-else>
					<view class="tips">请选择地址</view>
				</block>
			</view>
			<uni-icons type="arrowright" size="16" color="#33" style="margin-right: -8rpx;"></uni-icons>
		</view>
		<view class="info-card">
			<view class="info-item flex-row border-bottom">
				<text>{{info.goodsName}}</text>
				<text>x{{info.goodsNum || 1}}</text>
			</view>
			<view class="info-item flex-row">
				<text>总计</text>
				<text>¥ {{((info.goodsPrice || 0) * (info.goodsNum || 0)) +(info.freightPrice || 0)}}</text>
			</view>
		</view>
		<view class="info-card">
			<view class="info-item flex-row border-bottom">
				<text>订单编号：</text>
				<view class="flex-row">
					<text>{{info.orderSn}}</text>
					<uni-icons type="compose" size="12" color="#5D5D5D" style="margin-right: -2rpx; padding-left: 14rpx;"></uni-icons>
				</view>
			</view>
			<view class="info-item flex-row">
				<text>订单时间：</text>
				<view class="flex-row">
					<text>{{info.addTime}}</text>
					<uni-icons type="compose" size="12" color="#5D5D5D" style="margin-right: -2rpx; padding-left: 14rpx;"></uni-icons>
				</view>
			</view>
		</view>
		<view class="user-card">
			<view class="tips flex-row">
				<text class="dot"></text>
				<text>更多好货，清添加店主微信</text>
				<text class="dot"></text>
			</view>
			<view class="user-info flex-row">
				<image class="avatar" :src="info.sellerAvatar || avatar"></image>
				<view class="txt flex-1">
					<view class="name acp-ellipsis">{{info.sellerName || '商家名称'}}</view>
					<view class="contact">
						<text>{{info.wechatNo || '商家微信'}}</text>
						<uni-icons @click="copeText(info.wechatNo)" type="compose" size="12" color="#5D5D5D" style="padding: 0 16rpx;"></uni-icons>
					</view>
				</view>
				<!-- <text class="edit" @click="navigateTo('/pages/userSetting/userSetting')">修改名片</text> -->
			</view>
		</view>
		<view class="btn-bottom flex-col" @click="handleSubmit">
			<text>确认支付</text>
		</view>
	</view>
</template>

<script>
	import {
		orderDetail,
		updateOrder
	} from "@/api/order.js"
	import {
		payOK
	} from "@/api/payment.js"
	export default {
		data() {
			return {
				orderSn: undefined,
				info: {},
				avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2476878483,4014399276&fm=26&gp=0.jpg',
				formData: {
					id: undefined,
					address: undefined,
					consignee: undefined,
					mobile: undefined
				},
			};
		},
		onLoad(options) {
			if (options.orderSn) {
				this.orderSn = options.orderSn
				this.getInfo();
			}
		},
		onShow() {
			const pages = getCurrentPages()
			const currPage = pages[pages.length - 1]
			if (currPage && currPage.data) {
				const {
					addressInfo
				} = currPage.data
				if (addressInfo) {
					this.formData.address = addressInfo.provinceName + addressInfo.cityName + addressInfo.countyName + addressInfo.detailInfo
					this.formData.consignee = addressInfo.userName
					this.formData.mobile = addressInfo.telNumber
				}
			}
		},
		methods: {
			getInfo() {
				orderDetail({
					orderSn: this.orderSn
				}).then(res => {
					this.info = res.data;
					this.formData = {
						id: res.data.id,
						address: res.data.address,
						consignee: res.data.consignee,
						mobile: res.data.mobile,
					}
				})
			},
			handleSubmit() {
				// console.log(this.formData)
				const {
					address
				} = this.formData
				if (!address) {
					uni.showToast({
						title: "请选择地址",
						icon: "none",
						mask: true,
					})
					return
				}
				updateOrder(this.formData).then(res => {
					payOK({
						orderNo: res.data
					}).then(e => {
						uni.showToast({
							title: "支付成功",
							icon: "none",
							mask: true,
						})
						setTimeout(() => {
							uni.redirectTo({
								url: "/pages/orderDetail/orderDetail?orderSn=" + res.data
							});
						}, 500)
					})
				})
			},
			copeText(data) {
				if (!data) return;
				uni.setClipboardData({
					data: data,
					success: function(data) {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							mask: true
						})
					},
					fail: function(err) {
						uni.showToast({
							title: '复制失败',
							icon: 'none',
							mask: true
						})
					},
					complete: function(res) {}
				})
			},
			navigateTo(url) {
				uni.navigateTo({
					url,
					fail: err => {
						uni.switchTab({
							url,
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-pay-page {
		padding: 1rpx 24rpx 180rpx;

		.address-card {
			margin: 15rpx 0 24rpx;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			height: 130rpx;
			padding: 0 22rpx;

			.address-info {
				margin: 0 15rpx;
				overflow: hidden;
				font-size: 30rpx;
				line-height: 42rpx;

				.user {
					margin: 4rpx 0;
					align-items: flex-end;

					.name {
						max-width: 65%;
					}

					.phone {
						font-size: 24rpx;
						line-height: 34rpx;
						margin: 0 16rpx;
					}
				}

				.address {
					margin: 4rpx 0;
					font-size: 24rpx;
					line-height: 34rpx;
					color: #999;
				}
			}
		}

		.info-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 0 24rpx;
			margin: 24rpx 0;

			.info-item {
				padding: 32rpx 0;
				justify-content: space-between;
				line-height: 42rpx;
				font-size: 30rpx;
			}
		}

		.user-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 1rpx 24rpx;
			margin: 24rpx 0;

			.tips {
				margin: 24rpx 0;
				color: #999;
				line-height: 40rpx;
				font-size: 28rpx;
				justify-content: center;

				.dot {
					width: 8rpx;
					height: 8rpx;
					border-radius: 4rpx;
					background: #D8D8D8;
					margin: 0 24rpx;
				}
			}

			.user-info {
				margin: 24rpx 0 32rpx;

				.avatar {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50rpx;
				}

				.txt {
					overflow: hidden;
					margin: 0 16rpx;

					.name {
						line-height: 42rpx;
						font-size: 30rpx;
						font-weight: 500;
						margin: 8rpx 0;
					}

					.contact {
						line-height: 34rpx;
						font-size: 24rpx;
						color: #999;
						margin: 8rpx 0;

						.copy {
							font-size: 16rpx;
							margin: 0 16rpx;
						}
					}
				}

				.edit {
					align-self: flex-end;
					color: #EFB600;
					line-height: 34rpx;
				}
			}
		}

		.btn-bottom {
			position: fixed;
			bottom: 60rpx;
			left: 24rpx;
			right: 24rpx;
			height: 90rpx;
			background: #FFD44D;
			box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
			border-radius: 45rpx;
			font-size: 30rpx;
			line-height: 42rpx;
		}
	}
</style>
