<template>
	<view>
		<uni-popup ref="popup" type="bottom">
			<view class="auth-popup flex-col">
				<view class="auth-phone" @click="loginTo()">手机号登陆</view>
				<button class="auth-wx" open-type="getUserInfo" @getuserinfo="userAuth">微信授权</button>
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
				this.$refs.popup.close()
				if (e.detail.userInfo) {
					uni.login({
						success: res => {
							// console.log('code', res)
							wxAuth({
								code: res.code,
								userInfo: e.detail.userInfo
							}).then(res => {
								uni.setStorageSync('token', res.data.token);
								this.$emit('refresh')
							})
						}
					})
				}
			},
			loginTo() {
				this.navigateTo('/pages/loginScreen/loginScreen');
				this.$refs.popup.close();
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
		padding: 30rpx 24rpx;
		border-radius: 20rpx 20rpx 0 0;

		.auth-phone {
			background-color: green;
			height: 80rpx;
			margin: 10rpx 0;
			width: 300rpx;
			margin: 10rpx 0;
			text-align: center;
			font-size: 30rpx;
			line-height: 80rpx;
			color: #fff;
			border-radius: 10rpx;
		}

		.auth-wx {
			background-color: green;
			height: 80rpx;
			margin: 10rpx 0;
			width: 300rpx;
			margin: 10rpx 0;
			padding: 0;
			text-align: center;
			font-size: 30rpx;
			line-height: 80rpx;
			color: #fff;
			border-radius: 10rpx;
		}
	}
</style>
