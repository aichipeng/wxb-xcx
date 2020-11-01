<template>
	<view class="order-pay-page" :style="{paddingBottom: mode == 'server' && info.orderStatus == 201 || info.orderStatus == 101 ? '180rpx' : '10rpx'}">
		<view class="order-status">
			<text>{{info.orderStatusText}}<text v-if="info.orderStatus == 602">（原因：{{info.remark}}）</text> </text>
		</view>
		<block v-if="mode == 'server'">
			<view v-if="info.orderStatus == 201" class="btn-group flex-row">
				<view class="btn flex-col flex-1" @click="handleSend()">
					<text class="name">直接发货</text>
					<text class="tips">填写物流单号</text>
				</view>
				<view style="width: 30rpx;"></view>
				<view class="btn flex-col flex-1" @click="handlePick()">
					<text class="name">预约取件</text>
					<text class="tips">快递上门更便宜</text>
				</view>
			</view>
		</block>
		<view class="address-card">
			<view v-if="mode == 'server'" class="seller-info flex-row">
				<image class="avatar" :src="info.userAvatar || avatar"></image>
				<view class="flex-row flex-1 acp-ellipsis">
					<text class="name acp-ellipsis">{{info.nickName || '神秘人'}}</text>
					<uni-icons type="compose" size="14" color="#5D5D5D"></uni-icons>
				</view>
			</view>
			<view class="address-item flex-row">
				<text class="label">收件人:</text>
				<text class="acp-ellipsis">{{info.consignee}}</text>
				<text style="margin-left: 48rpx;">{{info.mobile}}</text>
			</view>
			<view class="address-item flex-row">
				<text class="label">收货地址:</text>
				<text class="flex-1 acp-ellipsis-l2">{{info.address}}</text>
			</view>
		</view>
		<view class="info-card" v-if="info.orderStatus == 301">
			<view class="info-item flex-row" @click="navigateTo('/pages/orderExpress/orderExpress?no=' + info.shipSn + '&code=' + info.shipChannel)">
				<text class="label">查看物流</text>
				<uni-icons type="arrowright" size="14" color="#5D5D5D"></uni-icons>
			</view>
		</view>
		<view class="info-card">
			<view v-if="info.message" class="info-item flex-row border-bottom">
				<text>{{info.message}}</text>
			</view>
			<view class="info-item flex-row border-bottom">
				<text class="acp-ellipsis flex-1">{{info.goodsName}}</text>
				<view class="flex-row flex-1" style="justify-content: space-between;">
					<text>x{{info.goodsNum || 0}}</text>
					<text>￥{{Number(info.goodsPrice || 0).toFixed(2)}}</text>
					<!-- <text>￥{{Number((info.goodsPrice || 0) * (info.goodsNum || 0)).toFixed(2)}}</text> -->
				</view>
			</view>
			<view class="info-item flex-row border-bottom">
				<text>邮费</text>
				<text>￥{{(info.freightPrice || 0).toFixed(2)}}</text>
			</view>
			<view class="info-item flex-row">
				<text>总计</text>
				<text>¥ {{Number((info.actualPrice || 0)).toFixed(2)}}</text>
			</view>
		</view>
		<view class="info-card">
			<view class="info-item flex-row border-bottom">
				<text>订单编号：</text>
				<view class="flex-row">
					<text>{{info.orderSn}}</text>
					<image src="/static/images/copy.png" @click="copeText(info.orderSn)" style="width: 32rpx;height: 32rpx; margin-left: 10rpx; margin-right: -4rpx;"></image>
				</view>
			</view>
			<view class="info-item flex-row">
				<text>订单时间：</text>
				<view class="flex-row">
					<text>{{info.addTime}}</text>
					<!-- <uni-icons type="compose" size="12" color="#5D5D5D" style="margin-right: -2rpx; padding-left: 14rpx;"></uni-icons> -->
				</view>
			</view>
		</view>
		<view class="user-card" v-if="mode == 'client'">
			<view class="tips flex-row">
				<text class="dot"></text>
				<text>更多好货，清添加店主微信</text>
				<text class="dot"></text>
			</view>
			<view class="user-info flex-row">
				<image class="avatar" :src="info.sellerAvatar || avatar"></image>
				<view class="txt flex-1">
					<view class="name acp-ellipsis">{{info.sellerName}}</view>
					<view class="contact flex-row">
						<text>{{info.wechatNo || '暂无微信'}}</text>
						<image src="/static/images/copy.png" @click="copeText(info.wechatNo)" style="width: 32rpx;height: 32rpx; margin-left: 10rpx;"></image>
					</view>
				</view>
				<!-- <text class="edit" @click="navigateTo('/pages/userSetting/userSetting?id=' + id)">修改名片</text> -->
			</view>
		</view>
		<block v-if="mode=='server'">
			<view v-if="info.orderStatus == 201 || info.orderStatus == 101" class="btn-bottom flex-col" @click="navigateTo('/pages/orderClose/orderClose?orderSn=' + info.orderSn)">
				<text>关闭订单</text>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		orderDetail,
		orderClose
	} from "@/api/order.js"
	export default {
		data() {
			return {
				mode: undefined, // server(卖家) client(买家)
				orderSn: undefined,
				addressId: 1,
				info: {},
				avatar: '/static/images/avatar.png',
				remark: ''
			};
		},
		onLoad(options) {
			if (options.orderSn) {
				this.orderSn = options.orderSn
				this.mode = options.mode || 'client'
			}
		},
		onShow() {
			if (this.orderSn) {
				this.getInfo();
			}
		},
		methods: {
			getInfo() {
				orderDetail({
					orderSn: this.orderSn
				}).then(res => {
					this.info = res.data
				})
			},
			// 直接发货
			handleSend() {
				const checkedMap = [this.orderSn]
				this.navigateTo('/pages/orderSend/orderSend?item=' + JSON.stringify(checkedMap))
			},
			// 预约取件
			handlePick() {
				const checkedMap = [this.orderSn]
				this.navigateTo('/pages/orderPick/orderPick?item=' + JSON.stringify(checkedMap))
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
		padding: 1rpx 24rpx;

		.order-status {
			margin: 48rpx 0 40rpx;
			font-size: 36rpx;
			line-height: 50rpx;
			font-weight: 500;
		}

		.btn-group {
			margin: 40rpx 0;

			.btn {
				height: 136rpx;
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
				background-color: #fff;
				border-radius: 10rpx;

				.name {
					font-weight: 500;
					font-size: 30rpx;
					line-height: 42rpx;
					margin: 4rpx 0;
					color: #333;
				}

				.tips {
					margin: 4rpx 0;
					color: #999;
				}
			}
		}

		.address-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 34rpx 41rpx;
			margin: 40rpx 0;

			.seller-info {
				margin: 16rpx 0 40rpx;

				.avatar {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50rpx;
				}

				.name {
					margin: 0 16rpx;
					font-size: 30rpx;
					line-height: 42rpx;
					font-weight: 500;
				}
			}

			.address-item {
				margin: 16rpx 0;

				.label {
					width: 118rpx;
					color: #999;
				}
			}
		}

		.info-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 0 41rpx;
			margin: 40rpx 0;

			.info-item {
				padding: 41rpx 0;
				justify-content: space-between;
				line-height: 42rpx;
				font-size: 30rpx;
			}
		}

		.user-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 1rpx 40rpx;
			margin: 40rpx 0;

			.tips {
				margin: 41rpx 0 48rpx;
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
				margin: 41rpx 0;

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
