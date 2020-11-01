<template>
	<view class="user-screen">
		<view class="info-card">
			<view class="user-info flex-row">
				<image class="avatar" :src="info.avatar || avatar" mode=""></image>
				<view class="flex-1 user-txt">
					<view class="nickName">{{info.nickName}}</view>
					<view class="flex-row info">
						<text class="label">微信号：</text>
						<view class="flex-row flex-1" v-if="info.wechatNo || showWx">
							<input class="input-wx flex-1" type="text" placeholder="请输入微信号" v-model="info.wechatNo" :disabled="info.wechatNo && !showWx" />
							<block v-if="showWx">
								<text class="edit-btn" style="border-color: #999; color: #999;" @click="showWx = false">取消</text>
								<text class="edit-btn" @click="handleWx">确定</text>
							</block>
							<block v-else>
								<text class="edit-btn" style="border-color: #EFB600; color: #EFB600;" @click="showWx = true">修改</text>
							</block>
						</view>
						<view class="phone-btn" v-else @click="showWx = true">点击输入</view>
					</view>
					<view class="flex-row info">
						<text class="label">手机号：</text>
						<view class="" v-if="info.mobile">{{info.mobile}}</view>
						<button v-else class="phone-btn" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">点击授权</button>
					</view>
				</view>
			</view>
		</view>
		<view class="info-card">
			<view class="info-item flex-row border-bottom" @click="navigateTo('/pages/feedback/feedback')">
				<text>意见反馈</text>
				<uni-icons type="arrowright" size="16" color="#5D5D5D" style="margin-right: -4rpx;"></uni-icons>
			</view>
			<view class="info-item flex-row" @click="navigateTo('/pages/contactUs/contactUs')">
				<text>联系我们</text>
				<uni-icons type="arrowright" size="16" color="#5D5D5D" style="margin-right: -4rpx;"></uni-icons>
			</view>
		</view>
		<view class="log-out flex-col" @click="logout">
			<text>退出登录</text>
		</view>
	</view>
</template>

<script>
	import {
		userInfo,
		updateUser,
		wxBindPhone
	} from "@/api/user.js"
	export default {
		data() {
			return {
				info: {},
				showWx: false,
				avatar: '/static/images/avatar.png'
			};
		},
		onLoad() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				userInfo().then(res => {
					this.info = res.data
				})
			},
			// 修改微信
			handleWx() {
				const {
					wechatNo
				} = this.info;
				if (!wechatNo) {
					uni.showToast({
						title: '微信号不能为空！',
						icon: 'none',
						mask: true
					})
				} else {
					updateUser(this.info).then(res => {
						uni.showToast({
							title: '修改成功！',
							icon: 'none',
							mask: true
						})
						this.showWx = false
					})
				}
			},
			// 绑定手机号
			decryptPhoneNumber(e) {
				// console.log(e.detail)
				if (e.detail.encryptedData) {
					wxBindPhone(e.detail).then(res => {
						uni.showToast({
							title: '绑定成功！',
							icon: 'none',
							mask: true
						})
						this.getInfo()
					})
				}
			},
			// 退出登录
			logout() {
				const that = this
				uni.showModal({
					title: '提示',
					content: '是否确定退出登录',
					success: function(res) {
						if (res.confirm) {
							uni.clearStorageSync();
							that.navigateBack()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			navigateBack() {
				let pages = getCurrentPages();
				const prevPage = pages[pages.length - 2]
				// console.log(prevPage)
				// #ifdef MP-WEIXIN
				prevPage.setData({
					refresh: true
				})
				// #endif
				uni.navigateBack({
					delta: 1
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
			},
		}
	}
</script>


<style lang="scss">
	.user-screen {
		padding: 24rpx 24rpx 150rpx;

		.info-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 0 41rpx;
			margin: 0 0 32rpx;

			.info-item {
				padding: 41rpx 0;
				justify-content: space-between;
				line-height: 42rpx;
				font-size: 30rpx;
			}

			.user-info {
				align-items: flex-start;
				padding: 40rpx 0;

				.avatar {
					width: 96rpx;
					height: 96rpx;
					border-radius: 48rpx;
				}

				.user-txt {
					font-size: 30rpx;
					line-height: 42rpx;
					margin-left: 20rpx;

					.nickName {
						font-weight: 500;
					}

					.info {
						font-size: 29rpx;
						line-height: 40rpx;
						margin: 16rpx 0;
						white-space: nowrap;

						.phone-btn {
							margin: 0;
							padding: 0;
							font-size: 29rpx;
							line-height: 40rpx;
							color: #4682C5;
							text-decoration: underline #4682C5;
							background-color: #fff;
						}

						.input-wx {
							font-size: 29rpx;
							line-height: 40rpx;
							flex: 1;
						}

						.edit-btn {
							margin-left: 10rpx;
							font-size: 22rpx;
							line-height: 30rpx;
							border-radius: 30rpx;
							padding: 0rpx 10rpx;
							border: 1rpx solid #4682C5;
							color: #4682C5;
						}
					}
				}

			}
		}

		.log-out {
			font-size: 30rpx;
			height: 92rpx;
			background: #FFF;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 10rpx;
			position: fixed;
			bottom: 54rpx;
			left: 24rpx;
			right: 24rpx;
			z-index: 11;
			color: #999;
		}
	}
</style>
