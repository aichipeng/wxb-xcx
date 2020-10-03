<template>
	<view class="login-page">
		<view class="login-item flex-row">
			<text>账号：</text>
			<input class="flex-1" type="text" v-model="formData.mobile">
		</view>
		<view class="login-item flex-row">
			<text>密码：</text>
			<input class="flex-1" type="text" v-model="formData.password">
		</view>
		<view class="submit-btn flex-col" @click="login">
			<text>登陆</text>
		</view>
	</view>
</template>

<script>
	import {
		loginAuth
	} from "../../api/login.js"
	export default {
		data() {
			return {
				formData: {
					mobile: '18578747704',
					password: 'a1111111'
				}
			};
		},
		methods: {
			login() {
				loginAuth(this.formData).then(res => {
					console.log(res)
					try {
						uni.setStorageSync('token', res.data.token);
						uni.navigateBack({
							delta: 1
						})
					} catch (e) {
						// error
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.login-page {
		padding: 24rpx;

		.login-item {
			margin: 32rpx 0;
		}

		.submit-btn {
			height: 80rpx;
			border-radius: 40rpx;
			background-color: green;
			color: #fff;
		}
	}
</style>
