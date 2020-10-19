<template>
	<view class="cash-apply">
		<view class="cash-card">
			<view class="title">提现金额</view>
			<view class="form-item flex-row border-bottom">
				<text class="sign">￥</text>
				<input ref="input" class="input flex-1" type="number" :focus="formData.amount < usable" :value="formData.amount"
				 @input="onKeyInput" placeholder="请输入提现金额" placeholder-class="input-place" />
				<text style="color: #EFB600;" @click="handleAll()">全部</text>
			</view>
			<view class="tips">可提现金额为<text style="color: #EFB600;">¥{{usable}}</text></view>
			<view class="rule">
				<view class="rule-title">提现说明：</view>
				<view class="rule-content">
					<view>1、提现申请：需平台审核通过之后到账，到账时间1-3天。</view>
					<view>2、到账账户：审核通过，提现金额直接到您的微信零钱包。</view>
				</view>
			</view>
			<view class="btn-bottom flex-col" @click="submit()">
				<text>提交申请</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		cashExtract
	} from "@/api/cash.js"
	import {
		accountDetail,
	} from '../../api/account.js'
	export default {
		data() {
			return {
				usable: 0,
				formData: {
					amount: undefined,
					remark: undefined
				}
			};
		},
		onLoad() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				accountDetail().then(res => {
					this.usable = res.data.usable
				})
			},
			handleAll() {
				this.formData.amount = this.usable
			},
			onKeyInput(e) {
				// this.$refs.input.value = 10
				if (e.target.value > this.usable) {
					this.formData.amount = this.usable
				} else {
					this.formData.amount = e.target.value
				}
			},
			submit() {
				if (!this.formData.amount) {
					uni.showToast({
						title: '请输入提现金额',
						icon: 'none',
						mask: true
					})
					return
				} else if (this.formData.amount > this.usable) {
					uni.showToast({
						title: '可提现金额不足',
						icon: 'none',
						mask: true
					})
					return
				}
				cashExtract(this.formData).then(res => {
					uni.showToast({
						title: '提交申请成功',
						icon: 'none',
						mask: true
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 500)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cash-apply {
		padding: 16rpx 24rpx;

		.cash-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.04);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 41rpx 41rpx 70rpx;

			.title {
				font-size: 29rpx;
				line-height: 40rpx;
			}

			.form-item {
				font-size: 29rpx;
				line-height: 40rpx;
				padding: 16rpx 0;
				margin: 35rpx 0 24rpx;

				.sign {
					align-self: flex-end;
					margin: 10rpx 0;
				}

				.input {
					font-size: 40rpx;
					font-weight: 500;
					line-height: 74rpx;
					margin: 0 10rpx;
				}

				.input-place {
					font-size: 52rpx;
					font-weight: 500;
					line-height: 74rpx;
					color: #EEE;
				}
			}

			.tips {
				font-size: 22rpx;
				line-height: 32rpx;
				margin: 24rpx 0;
			}

			.rule {
				color: #999;
				margin: 48rpx 0;

				.rule-title {}

				.rule-content {
					margin-top: 30rpx;
				}
			}

			.btn-bottom {
				height: 90rpx;
				background: #FFD44D;
				box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
				border-radius: 45rpx;
				font-size: 30rpx;
				line-height: 42rpx;
				margin-top: 104rpx;
			}
		}
	}
</style>
