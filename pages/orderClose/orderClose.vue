<template>
	<view class="order-close">
		<view class="title">信息描述</view>
		<view class="form-card">
			<view class="acp-ellipsis-l2">{{info.describe || '收款描述'}}</view>
			<view class="name acp-ellipsis">{{info.goodsName}}</view>
			<view class="price-wrap">
				<text>￥{{Number(info.actualPrice || 0).toFixed(2)}}</text>
				<text style="margin: 0 16rpx;">|</text>
				<text>可售{{info.saleVolume || 0}}单</text>
			</view>
			<view class="form-item flex-row border-top">
				<text class="label">关闭原因</text>
				<view class="picker-warp flex-row flex-1">
					<picker @change="rangeChange" :value="current" :range="range" range-key="name">
						<view class="flex-row">
							<text class="flex-1" :style="{color: remark ? '#333':'#999'}">{{remark || '请选择关闭原因'}}</text>
							<uni-icons type="arrowdown" size="16"></uni-icons>
						</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="submit-btn flex-col" @click="handleClose">
			<text>关闭交易</text>
		</view>
	</view>
</template>

<script>
	import {
		orderDetail,
		orderClose,
		closeList
	} from "@/api/order.js"
	export default {
		data() {
			return {
				info: {},
				current: 0,
				range: [],
				remark: undefined,
			};
		},
		onLoad(options) {
			if (options.orderSn) {
				this.orderSn = options.orderSn
				this.getInfo()
			}
		},
		methods: {
			getInfo() {
				orderDetail({
					orderSn: this.orderSn
				}).then(res => {
					this.info = res.data
				})
				closeList({
					page: 1,
					size: 10
				}).then(res => {
					this.range = res.data
				})
			},
			rangeChange(e) {
				// console.log(e.detail.value)
				const {
					range
				} = this
				this.remark = range[e.detail.value].name
			},
			handleClose() {
				const {
					orderSn,
					remark
				} = this
				if (!remark) {
					uni.showToast({
						title: '请选择关闭原因',
						icon: 'none',
						mask: true
					})
					return
				}
				orderClose({
					orderNo: orderSn,
					remark
				}).then(res => {
					uni.showToast({
						title: '关闭成功',
						icon: 'none',
						mask: true
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 500)
				})
			},
		}
	}
</script>

<style lang="scss">
	.order-close {
		.title {
			font-weight: 500;
			font-size: 36rpx;
			line-height: 50rpx;
			padding: 49rpx 49rpx 0;
		}

		.form-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 32rpx 20rpx 15rpx;
			margin: 40rpx 24rpx;
			font-size: 29rpx;
			line-height: 40rpx;

			.name {
				margin-top: 32rpx;
			}

			.price-wrap {
				color: #999;
				margin-top: 16rpx;
			}

			.form-item {
				margin-top: 32rpx;
				padding: 25rpx 0;

				.picker-warp {
					background: #F9F9F9;
					border-radius: 10rpx;
					border: 2rpx solid #EEEEEE;
					padding: 14rpx 20rpx;
					margin-left: 16rpx;

					picker {
						width: 100%;
					}
				}
			}
		}

		.submit-btn {
			height: 90rpx;
			border-radius: 45px;
			background: #FFD44D;
			box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
			font-size: 30rpx;
			line-height: 42rpx;
			margin: 120rpx 24rpx 0;
		}
	}
</style>
