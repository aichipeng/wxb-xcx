<template>
	<view class="login-page">
		<view class="login-card">
			<view class="login-item flex-row border-bottom">
				<image class="label" src="/static/images/phone.png" style="width: 52rpx; height: 52rpx;"></image>
				<input class="value flex-1" type="number" v-model="formData.mobile" maxlength="11" placeholder="请输入您的账号"
				 placeholder-style="color: #D1D1D1">
			</view>
			<view class="login-item flex-row border-bottom">
				<image class="label" src="/static/images/password.png" style="width: 52rpx; height: 52rpx;"></image>
				<input class="value flex-1" type="text" v-model="formData.code" placeholder="请输入您的验证码" placeholder-style="color: #D1D1D1">
				<text class="code-btn" :style="{color: codeTime ? '#999' : '#EFB600'}" @click="getCode">{{codeTime ? codeTime + 's' : '发送验证码'}}</text>
			</view>
			<view class="submit-btn flex-col" @click="login">
				<text>登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		loginAuth,
		regCaptcha,
		loginCode
	} from "../../api/login.js"
	export default {
		data() {
			return {
				formData: {
					channel: 'wx',
					mobile: '',
					code: ''
					// mobile: '18578747704',
					// password: 'a1111111'
				},
				codeTime: 0,
				time: null
			};
		},
		destroyed() {
			if (this.time) {
				clearInterval(this.time)
			}
		},
		methods: {
			login() {
				const msg = this.verifyForm();
				if (!msg) {
					loginCode(this.formData).then(res => {
						// console.log(res)
						try {
							uni.setStorageSync('token', res.data.token);
							uni.setStorageSync('id', res.data.id || '');
							uni.setStorageSync('userInfo', res.data.userInfo || {});
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
						} catch (e) {
							// error
						}
					})
				} else {
					uni.showToast({
						title: msg,
						icon: 'none',
						mask: true
					})
				}
			},
			verifyForm() {
				const {
					mobile,
					code,
				} = this.formData;
				let msg = '';
				if (!mobile) {
					msg = '请输入您的账号！'
				} else if (!(/^1[3456789]\d{9}$/.test(mobile))) {
					msg = '请输入正确的账号！'
				} else if (!code) {
					msg = '请输入您的验证码！'
				}
				return msg
			},
			getCode() {
				const {
					mobile
				} = this.formData
				if (this.codeTime) {
					return
				} else if (!mobile) {
					uni.showToast({
						title: "请输入您的账号!",
						icon: "none",
						mask: true,
					})
					return
				} else if (!(/^1[3456789]\d{9}$/.test(mobile))) {
					uni.showToast({
						title: "请输入正确的账号!",
						icon: "none",
						mask: true,
					})
					return
				}
				regCaptcha({
					mobile
				}).then(res => {
					uni.showToast({
						title: "发送成功",
						icon: "none",
						mask: true,
					})
					this.countDown()
				})
			},
			countDown() {
				const that = this;
				let codeTime = 60;
				that.time = setInterval(() => {
					that.codeTime = codeTime;
					if (!codeTime) {
						clearInterval(that.time)
					} else {
						codeTime--;
					}
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	.login-page {
		padding: 24rpx;

		.login-card {
			height: 1136rpx;
			box-sizing: border-box;
			margin: 6rpx 0;
			padding: 30rpx 50rpx;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;

			.login-item {
				padding: 31rpx 0;

				.label {
					width: 52rpx;
					height: 52rpx;
					display: block;
					margin-right: 20rpx;
				}

				.value {
					font-size: 30rpx;
					line-height: 42rpx;
				}

				.code-btn {
					font-size: 30rpx;
					line-height: 42rpx;
				}
			}

			.submit-btn {
				height: 90rpx;
				border-radius: 45px;
				background: #FFD44D;
				box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
				font-size: 30rpx;
				line-height: 42rpx;
				margin-top: 121rpx;
			}
		}
	}
</style>
