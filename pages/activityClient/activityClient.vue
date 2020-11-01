<template>
	<view class="activity-client-page">
		<view class="header flex-col">
			<text class="title">{{info.describe}}</text>
			<text class="tips">仅剩{{info.saleVolume || 0}}单可售</text>
		</view>
		<view class="body">
			<view class="info-card">
				<view class="info-item flex-row border-bottom">
					<text>{{info.name}}</text>
					<text>x{{info.num || 0}}</text>
				</view>
				<!-- <view v-if="info.freightPrice" class="info-item flex-row border-bottom">
					<text>邮费</text>
					<text>¥ {{info.freightPrice}}</text>
				</view> -->
				<view class="info-item flex-row">
					<text>总计</text>
					<text>¥ {{(info.price || 0) * (info.num || 0) + (info.freightPrice || 0)}}</text>
				</view>
			</view>
			<view class="user-card" v-if="info.isShowWx">
				<view class="tips flex-row">
					<text class="dot"></text>
					<text>更多好货，清添加店主微信</text>
					<text class="dot"></text>
				</view>
				<view class="user-info flex-row">
					<image class="avatar" :src="info.avatar || avatar"></image>
					<view class="txt flex-1">
						<view class="name acp-ellipsis">{{info.nickName}}</view>
						<view class="contact flex-row">
							<text>{{info.wechatNo || '暂无微信'}}</text>
							<image src="/static/images/copy.png" @click="copeText(info.wechatNo)" style="width: 32rpx;height: 32rpx; margin-left: 10rpx;"></image>
						</view>
					</view>
					<!-- <text class="edit" @click="navigateTo('/pages/userSetting/userSetting?id=' + id)">修改名片</text> -->
				</view>
			</view>
		</view>
		<view class="btn-bottom flex-col" @click="submit()">
			<text>付款</text>
		</view>
		<uni-auth ref="popup" @refresh="refresh"></uni-auth>
	</view>
</template>

<script>
	import {
		activityDetail
	} from "@/api/activity.js"
	import {
		orderSubmit
	} from "@/api/order.js"
	import UniAuth from "@/components/uni-auth/uni-auth.vue"
	export default {
		data() {
			return {
				token: undefined,
				id: undefined,
				channelId: undefined,
				info: {},
				avatar: '/static/images/avatar.png',
			};
		},
		components: {
			UniAuth
		},
		onLoad(options) {
			if (!options.scene) {
				if (options.id) {
					this.id = options.id
				}
				if (options.channelId) {
					this.channelId = options.channelId
				}
			} else {
				let scene = decodeURIComponent(options.scene)
				// console.log(scene)
				scene = scene.split('&')
				this.id = scene[0] || ''
				this.channelId = scene[1] || ''
			}
		},
		onShow() {
			const token = uni.getStorageSync('token');
			if (token) {
				this.token = token
				this.getInfo();
			} else {
				this.$refs.popup && this.$refs.popup.open()
			}
		},
		onReady() {
			if (!this.token) {
				this.$refs.popup && this.$refs.popup.open()
			}
		},
		onShareAppMessage(res) {
			return {
				title: `你关注的热销单品 “${this.info.name || '内有微商'}” 已限时出售,快来下单抢购吧`,
				path: '/pages/activityClient/activityClient?id=' + this.id + '&channelId=' + uni.getStorageSync('id')
			}
		},
		methods: {
			getInfo() {
				activityDetail({
					id: this.id,
					channelId: this.channelId
				}).then(res => {
					this.info = res.data
				})
			},
			refresh() {
				const token = uni.getStorageSync('token');
				this.getInfo()
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
			submit() {
				if (this.token) {
					if (!this.id) return;
					orderSubmit({
						id: this.id
					}).then(res => {
						this.navigateTo('/pages/orderPay/orderPay?orderSn=' + res.data)
					}).catch(() => {
						this.navigateTo('/pages/orderPay/orderPay?orderSn=' + res.data)
					})
				} else {
					this.$refs.popup && this.$refs.popup.open()
				}
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
			},
		}
	}
</script>

<style lang="scss" scoped>
	.activity-client-page {
		padding-bottom: 20rpx;

		.header {
			background-color: #FFD44D;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 0 0 40rpx 40rpx;
			padding: 48rpx 24rpx 184rpx;

			.title {
				font-size: 36rpx;
				font-weight: 500;
				line-height: 50rpx;
			}

			.tips {
				font-size: 28rpx;
				line-height: 40rpx;
				margin-top: 24rpx;
			}
		}

		.body {
			margin-top: -150rpx;
			padding: 0 24rpx;

			.info-card {
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.04);
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
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.04);
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
