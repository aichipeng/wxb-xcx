<template>
	<view>
		<uni-popup ref="popup" type="bottom">
			<view class="auth-popup">
				<view class="auth-phone" @click="loginTo()">手机号登陆</view>
				<!-- #ifdef H5 -->
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<button class="auth-wx" open-type="getUserInfo" @getuserinfo="userAuth">微信授权</button>
				<!-- #endif -->
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		wxAuth
	} from "../../api/login.js"
	export default {
		data() {
			return {

			};
		},
		props: {
			refresh: {
				type: Function,
				default () {
					return null
				}
			}
		},
		methods: {
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			// 微信小程序授权登录
			userAuth(e) {
				// console.log(e)
				this.close()
				if (e.detail.userInfo) {
					uni.login({
						success: res => {
							// console.log('code', res)
							wxAuth({
								code: res.code,
								userInfo: e.detail.userInfo
							}).then(res => {
								uni.setStorageSync('token', res.data.token);
								uni.setStorageSync('id', res.data.id);
								uni.setStorageSync('userInfo', res.data.userInfo);
								this.$emit('refresh')
							})
						}
					})
				}
			},
			// 手机号登录
			loginTo() {
				this.navigateTo('/pages/loginScreen/loginScreen');
				this.close();
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
	.auth-popup {
		background-color: #fff;
		padding: 20rpx 80rpx;
		border-radius: 20rpx 20rpx 0 0;

		.auth-phone {
			background: #FFD44D;
			height: 90rpx;
			margin: 30rpx 0;
			text-align: center;
			font-size: 30rpx;
			line-height: 90rpx;
			border-radius: 10rpx;
		}

		.auth-wx {
			background-color: #07c160;
			height: 90rpx;
			margin: 30rpx 0;
			padding: 0;
			text-align: center;
			font-size: 30rpx;
			line-height: 90rpx;
			border-radius: 10rpx;
			color: #fff;
		}
	}
</style>
