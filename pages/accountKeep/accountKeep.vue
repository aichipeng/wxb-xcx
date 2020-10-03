<template>
	<view class="account-keep-page">
		<view class="tabbar-top flex-row">
			<block v-for="(item,index) in tabList" :key="index">
				<view class="tab-wrap flex-col flex-1" @click="toggleType(item)">
					<text :style="queryList.type === item.type ? {color: '#333', fontWeight: 500 } : {color: '#999',fontWeight: 400 }">
						{{item.name}}
					</text>
					<view v-if="queryList.type === item.type" class="line"></view>
				</view>
			</block>
		</view>
		<view class="account-content">
			<block v-if="queryList.type == 0">
				<block v-for="(item,index) in list" :key="index">
					<view class="count-month flex-row">
						<text class="">2020年{{index+1}}月</text>
						<text class="">收入¥ 300.00</text>
						<text class="">支出¥ 300.00</text>
						<text class="">顾客100</text>
					</view>
					<block v-for="(item,key) in [1,2]" :key="index + '_' + key">
						<view class="count-day">
							<view class="count flex-row">
								<text class="">8月{{item}}日</text>
								<view class="flex-row">
									<view class="flex-row">
										<text class="">收入¥ 300.00</text>
									</view>
									<view class="flex-row">
										<text class="">支出¥ 300.00</text>
									</view>
								</view>
							</view>
							<block v-for="(item,index) in [1,2]" :key="index">
								<view class="keep-item border-bottom" :style="{borderBottom: index == [1,2].length - 1 ? 'none' : ''}">
									<view class="keep-item-top flex-row">
										<view class="flex-row">
											<text>SKII面膜</text>
											<text class="tag">自动 || 手动</text>
										</view>
										<text>x1</text>
									</view>
									<view class="keep-item-bottom flex-row">
										<text style="color: #999;">18:00:34</text>
										<text style="color: #EFB600">-400.00</text>
									</view>
								</view>
							</block>
						</view>
					</block>
				</block>
			</block>
			<block v-else>
				<block v-for="(item,index) in list" :key="index">
					<view class="order-item" :style="{ borderBottom: index == list.length - 1 ? 'none':'' }">
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
							<view v-if="item.type == 1" class="btn flex-col" @click="handleBtn">
								<text>查看详情</text>
							</view>
						</view>
					</view>
				</block>
			</block>
		</view>
		<uni-keep-float />
	</view>
</template>

<script>
	import {
		orderList
	} from "@/api/order.js"
	import uniKeepFloat from "@/components/uni-keep-float/uni-keep-float.vue"
	export default {
		data() {
			return {
				tabList: [{
						name: '日报',
						type: 0
					},
					{
						name: '订单',
						type: 1
					},
					{
						name: '手动记账',
						type: 2
					}
				],
				queryList: {
					page: 1,
					size: 10,
					type: 0
				},
				isLoading: false,
				list: [],
				finish: false
			};
		},
		components: {
			uniKeepFloat
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
			toggleType(item) {
				if (this.queryList.type !== item.type) {
					this.queryList.type = item.type
					this.queryList.page = 1
					this.list = [];
					this.getList()
				}
			},
			handleBtn() {
				const {
					type
				} = this.queryList
				if (type == 1) {
					this.navigateTo('/pages/orderDetail/orderDetail?orderSn=' + item.orderSn + '&mode=server')
				}
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
	.account-keep-page {
		padding: 80rpx 0 20rpx;

		.tabbar-top {
			position: fixed;
			z-index: 99;
			/* #ifdef H5 */
			top: 88rpx;
			/* #endif */
			/* #ifndef H5 */
			top: 0;
			/* #endif */
			left: 0;
			right: 0;
			background-color: #fff;


			.tab-wrap {
				position: relative;
				line-height: 48rpx;
				font-size: 32rpx;
				height: 80rpx;

				.line {
					position: absolute;
					z-index: 2;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 103rpx;
					height: 6rpx;
					background: #EFB600;
					border-radius: 2rpx;
				}
			}
		}

		.account-content {
			.count-month {
				justify-content: space-between;
				height: 82rpx;
				padding: 0 24rpx;
			}

			.count-day {
				padding: 40rpx 24rpx 0;
				background-color: #fff;

				.count {
					justify-content: space-between;
					// margin: 20rpx 0;
					background-color: #F9F9F9;
					padding: 10rpx 20rpx;
					border-radius: 12rpx;
				}

				.keep-item {
					padding: 34rpx 0;
					font-size: 29rpx;
					line-height: 40rpx;

					.keep-item-top {
						justify-content: space-between;
						margin: 6rpx 0;

						.tag {
							font-size: 24rpx;
							line-height: 34rpx;
							font-weight: 500;
							background-color: #F1F1F1;
							margin: 0 16rpx;
							padding: 2rpx 8rpx;
							color: #999;
						}
					}

					.keep-item-bottom {
						justify-content: space-between;
						margin: 6rpx 0;
					}
				}
			}

			.order-item {
				padding: 32rpx 24rpx;
				border-bottom: solid 2rpx #EEEEEE;
				background-color: #fff;

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
