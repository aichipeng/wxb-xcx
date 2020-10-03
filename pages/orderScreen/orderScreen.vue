<template>
	<view class="order-page">
		<view class="order-list">
			<!-- <block v-for="(item,index) in list" :key="index">
				<view class="order-list_title">
					<text>{{item.title}}</text>
				</view> -->
			<view class="order-list_wrap">
				<block v-for="(item,key) in list" :key="key">
					<view class="order-item" :style="{ borderBottom: key == list.length - 1 ? 'none':'' }">
						<view class="order-item-top flex-row">
							<view class="info flex-row acp-ellipsis">
								<text class="name acp-ellipsis">{{item.goodsName}}</text>
								<text style="margin: 0 10rpx;">单价 {{item.goodsPrice}}</text>
								<text style="margin: 0 10rpx;">数量 {{item.goodsNum}}</text>
							</view>
							<text style="color: #EFB600;">+{{(item.goodsPrice||0).toFixed(2)}}</text>
						</view>
						<view class="order-item-bottom flex-row">
							<text style="color: #999">订单支付时间：{{item.addTime}}</text>
							<view class="btn flex-col" @click="navigateTo('/pages/orderDetail/orderDetail?orderSn=' + item.orderSn + '&mode=server')">
								<text>查看详情</text>
							</view>
						</view>
					</view>
				</block>
			</view>
			<!-- </block> -->
		</view>
	</view>
</template>

<script>
	import {
		orderList
	} from "@/api/order.js"
	export default {
		name: 'OrderScreen',
		data() {
			return {
				queryList: {
					page: 1,
					size: 10,
					type: 1
				},
				list: []
			};
		},
		onLoad() {
			this.getList()
		},
		onPullDownRefresh() {
			this.list = [];
			this.queryList.page = 1;
			this.getList()
		},
		onReachBottom() {
			if (!this.finish && !this.isLoading) {
				this.isLoading = true
				this.queryList.page++;
				this.getList()
			}
		},
		methods: {
			getList() {
				orderList(this.queryList).then(res => {
					if (res.data && res.data.length > 0) {
						this.list = this.list.concat(res.data)
						this.finish = false
					} else {
						this.finish = true
					}
					this.isLoading = false
					uni.stopPullDownRefresh();
				}).catch(() => {
					this.isLoading = false
					uni.stopPullDownRefresh();
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-page {
		padding: 8rpx 24rpx;

		.order-list {
			// padding: 8rpx 0;

			.order-list_title {
				padding: 8rpx 20rpx;
				font-size: 28rpx;
				font-weight: 500;
				line-height: 40rpx;
			}

			.order-list_wrap {
				background-color: #fff;
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
				border-radius: 10rpx;
				padding: 0 20rpx;
				margin: 8rpx 0;
			}

			.order-item {
				padding: 32rpx 0;
				border-bottom: solid 2rpx #EEEEEE;

				.order-item-top {
					justify-content: space-between;
					font-size: 28rpx;

					.info {
						max-width: 75%;

						.name {
							margin-right: 10rpx;
						}
					}
				}

				.order-item-bottom {
					justify-content: space-between;
					margin-top: 32rpx;

					.btn {
						width: 168rpx;
						height: 60rpx;
						background-color: #FFD44D;
						box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
						border-radius: 45rpx;
						font-size: 28rpx;
						line-height: 40rpx;
					}
				}
			}
		}
	}
</style>
