<template>
	<view class="cash-screen">
		<view class="cash-card flex-col">
			<view style="align-self: flex-end;" @click="navigateTo('/pages/cashList/cashList')">余额明细</view>
			<view class="title flex-row">
				<text>余额</text>
				<uni-icons @click="handlePass" type="eye" size="14" color="#333" style="padding: 0 8rpx"></uni-icons>
			</view>
			<view class="usable">
				<text class="sign">￥</text>
				<text class="value" v-if="!pass"> {{(usable || 0).toFixed(2)}}</text>
				<text class="value" v-else> {{setStar((usable || 0).toFixed(2))}}</text>
			</view>
			<view class="tips">
				可提现金额为<text style="color: #EA864E;">¥{{(usable || 0).toFixed(2)}}</text>平台收取10%作为佣金）
			</view>
			<view class="submit-btn flex-col" @click="navigateTo('/pages/cashApply/cashApply')">
				<text>提现</text>
			</view>
			<view class="logs" @click="navigateTo('/pages/cashLogs/cashLogs')">提现记录</view>
		</view>
	</view>
</template>

<script>
	import {
		accountDetail,
	} from '../../api/account.js'
	export default {
		data() {
			return {
				usable: 0,
				pass: false
			};
		},
		onShow() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				accountDetail().then(res => {
					this.usable = res.data.usable
				})
			},
			handlePass() {
				this.pass = !this.pass;
			},
			setStar(str) {
				let newStr = ''
				for (let i in str) {
					if (str[i] == '.') {
						newStr = newStr + str[i]
					} else {
						newStr = newStr + '*'
					}
				}
				return newStr
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

<style lang="scss">
	.cash-screen {
		padding: 16rpx 24rpx;

		.cash-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.04);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 40rpx 40rpx 60rpx;

			.title {
				font-size: 30rpx;
				line-height: 42rpx;
			}

			.usable {
				margin: 24rpx 0 30rpx;

				.sign {
					font-size: 30rpx;
					line-height: 42rpx;
				}

				.value {
					font-size: 52rpx;
					font-weight: 500;
					line-height: 74rpx;
				}
			}

			.tips {
				font-size: 22rpx;
				line-height: 32rpx;
				color: #999;
			}

			.submit-btn {
				width: 320rpx;
				height: 90rpx;
				border-radius: 45px;
				background: #FFD44D;
				box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
				font-size: 30rpx;
				line-height: 42rpx;
				margin-top: 84rpx;
			}

			.logs {
				color: #999;
				text-decoration: underline;
				margin-top: 60rpx;
			}
		}
	}
</style>
