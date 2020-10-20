<template>
	<view class="uni-record-item" @click="navigateTo('/pages/activityDetail/activityDetail?id=' + item.id)">
		<view class="header flex-row">
			<text class="header-left">
				<text>
					<text>{{moment(item.addTime).format('MM月DD日')}}</text>
					<text v-if="item.status != 0">已发布{{item.day || 0}}天</text>
				</text>
				<text v-if="item.status != 0">
					<text style="margin: 0 16rpx;">|</text>
					<text style="color: #EFB600;">{{item.browseNum || 0}}</text>
					<text>人查看</text>
				</text>
			</text>
			<text class="header-right">{{statusMap[item.status]}}</text>
		</view>
		<view class="body">
			<text class="txt acp-ellipsis-l2">{{item.describe || '暂无描述'}}</text>
		</view>
		<view class="footer flex-row">
			<view class="footer-left">
				<view class="name-wrap flex-row">
					<text class="acp-ellipsis" style="max-width: 300rpx;">{{item.name || '商品名称'}}</text>
					<text style="margin:0 24rpx; flex: 1; font-weight: 500;">¥{{((item.price || 0) * (item.num || 0)) + (item.freightPrice || 0)}}</text>
				</view>
				<view class="flex-row" style="font-size: 24rpx; color: #999; margin-top: 16rpx;">
					<text>
						<text>已售</text>
						<text style="margin: 0 6rpx;">{{item.soldVolume}}</text>
						<text>单</text>
					</text>
					<text style="margin:0 24rpx;">
						<text>待发货</text>
						<text style="color: #FFD44D; margin: 0 6rpx;">{{item.stayDelivery}}</text>
						<text>单</text>
					</text>
				</view>
			</view>
			<view v-if="item.stayDelivery" class="footer-right flex-row" @click.stop="navigateTo('/pages/sendScreen/sendScreen?id=' + item.id + '&name=' + item.name)">
				<text class="btn">安排发货</text>
			</view>
			<view v-else-if="item.status == 0" class="footer-right flex-row" @click.stop="navigateTo('/pages/activityCreate/activityCreate?id=' + item.id)">
				<text class="btn">编辑</text>
			</view>
			<view v-else-if="item.status == 2" class="footer-right flex-row" @click.stop="navigateTo('/pages/activityCreate/activityCreate')">
				<text class="btn">再来一笔</text>
			</view>
			<view v-else class="footer-right flex-row" @click.stop="navigateTo('/pages/activityDetail/activityDetail?id=' + item.id)">
				<text class="btn">查看详情</text>
			</view>
			<!-- <view class="footer-right flex-row" @click.stop="handleBtn(item)">
				<text class="btn">{{btnMap[item.status] || '编辑'}}</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	import moment from "moment";
	export default {
		name: 'UniRecordItem',
		data() {
			return {
				moment,
				statusMap: {
					0: '待发布',
					1: '进行中',
					2: '已结束',
				},
				btnMap: {
					0: '编辑',
					1: '安排发货',
					2: '再来一笔',
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
			handleBtn(item) {
				switch (Number(item.status)) {
					case 0:
						this.navigateTo('/pages/activityCreate/activityCreate?id=' + item.id)
						break;
					case 1:
						this.navigateTo('/pages/sendScreen/sendScreen?id=' + item.id + '&name=' + item.name)
						break;
					case 2:
						this.navigateTo('/pages/activityCreate/activityCreate')
						break;
					default:
						break;
				}
			},
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
				margin-right: 30rpx;

				.name-wrap {
					padding: 6rpx 12rpx;
					font-size: 28rpx;
					background-color: rgba($color: #D8D8D8, $alpha: 0.3);
					display: inline-flex;
					// overflow: hidden;
				}
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
