<template>
	<view class="uni-record-item" @click="navigateTo('/pages/activityDetail/activityDetail?id=' + item.id)">
		<view class="header flex-row">
			<text class="header-left">
				<text>{{item.addTime}}</text>
				<!-- <text>
					<text style="margin: 0 16rpx;">|</text>
					<text style="color: #EFB600;">33</text>
					<text>人查看</text>
				</text> -->
			</text>
			<text class="header-right">{{statusMap[item.status]}}</text>
		</view>
		<view class="body">
			<text class="txt acp-ellipsis-l2">{{item.describe}}</text>
		</view>
		<view class="footer flex-row">
			<view class="footer-left">
				<view class="flex-row" style="padding: 4rpx 0;font-size: 28rpx;">
					<text class="acp-ellipsis">{{item.name}}</text>
					<text style="margin:0 24rpx; flex: 1; font-weight: 500;">¥{{item.price}}</text>
				</view>
				<view class="flex-row" style="padding: 4rpx 0;font-size: 24rpx; color: #999;">
					<text>
						<text>已售</text>
						<text style="color: #333; margin: 0 6rpx;">{{item.soldVolume}}</text>
						<text>单</text>
					</text>
					<text style="margin:0 24rpx;">
						<text>待发货</text>
						<text style="color: #B72A2A; margin: 0 6rpx;">{{item.stayDelivery}}</text>
						<text>单</text>
					</text>
				</view>
			</view>
		<!-- 	<view class="footer-right flex-row">
				<text class="btn">{{btnMap[item.status] || '去发布'}}</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniRecordItem',
		data() {
			return {
				statusMap: {
					0: '待发布',
					1: '进行中',
					2: '已结束',
				},
				btnMap: {
					0: '去发布',
					1: '去详情',
					2: '已结束',
				}
			};
		},
		props: {
			disabled: {
				type: Boolean,
				default: false
			},
			item: {
				type: Object,
				default: () => {
					return {}
				}
			},
		},
		methods: {
			navigateTo(url) {
				// console.log(this.disabled)
				if (this.disabled) {
					return
				}
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
	.uni-record-item {
		background-color: #fff;
		box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
		border-radius: 10rpx;
		padding: 10rpx 40rpx 30rpx;
		margin: 40rpx 0;

		.header {
			justify-content: space-between;
			margin: 10rpx 0;

			.header-left {
				font-size: 24rpx;
				color: #999;
				line-height: 34rpx;
			}

			.header-right {
				font-size: 30rpx;
				color: #EFB600;
				line-height: 42rpx;
			}
		}

		.body {
			margin: 24rpx 0 28rpx;

			.txt {
				font-size: 28rpx;
				line-height: 44rpx;
				word-break: break-all;
			}
		}

		.footer {
			justify-content: space-between;

			.footer-left {
				flex: 1;
				overflow: hidden;
			}

			.footer-right {
				width: 176rpx;
				height: 64rpx;
				background: #EFB600;
				box-shadow: 0 6rpx 12rpx 0 rgba(239, 182, 0, 0.2);
				border-radius: 32rpx;
				color: #fff;
				justify-content: center;

				.btn {
					line-height: 40rpx;
					font-size: 28rpx;
				}
			}
		}
	}
</style>
