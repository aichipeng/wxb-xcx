<template>
	<view class="order-page">
		<view class="order-list">
			<block v-for="(item,index) in filterList" :key="index">
				<view class="order-list_wrap">
					<view class="order-list_title">
						<text v-if="item.label">{{item.label}}</text>
						<text v-else>{{moment(item.date).format('MM月DD日')}}</text>
					</view>
					<block v-for="(val, key) in item.list" :key="key">
						<view class="order-item" :style="{ borderBottom: key == item.list.length - 1 ? 'none':'' }">
							<view class="order-item-top flex-row">
								<view class="info flex-row acp-ellipsis">
									<text class="name acp-ellipsis">{{val.goodsName}}</text>
									<text style="margin: 0 10rpx;">单价 {{val.goodsPrice}}</text>
									<text style="margin: 0 10rpx;">数量 {{val.goodsNum}}</text>
								</view>
								<text style="color: #EFB600;">+ {{(val.goodsPrice || 0) * (val.goodsNum || 0) + (val.freightPrice || 0)}}</text>
							</view>
							<view class="order-item-bottom flex-row">
								<text style="color: #999">订单支付时间：{{moment(item.addTime).format('MM.DD HH:mm:ss')}}</text>
								<view class="btn flex-col" @click="navigateTo('/pages/orderDetail/orderDetail?orderSn=' + val.orderSn + '&mode=server')">
									<text>查看详情</text>
								</view>
							</view>
						</view>
					</block>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		orderList
	} from "@/api/order.js"
	import moment from "moment";
	export default {
		name: 'OrderScreen',
		data() {
			return {
				moment,
				queryList: {
					page: 1,
					size: 10,
					type: 1
				},
				list: [],
				filterList: [],
				isLoading: false,
				finish: false
			};
		},
		onLoad() {
			this.getList()
		},
		onPullDownRefresh() {
			this.list = [];
			this.filterList = [];
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
						this.filterList = [];
						this.getFilterList();
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
			getFilterList() {
				const {
					list,
				} = this;
				const _this = this
				list.forEach(item => {
					// console.log(item)
					let filterList = _this.filterList
					const time = moment(item.addTime).format('YYYY-MM-DD');
					const index = filterList.findIndex(item => {
						return item.date == time
					})
					let temp = filterList.find(item => {
						return item.date == time
					}) || {};
					// filterList[0].list.push(temp)
					if (index == -1) {
						temp.date = time;
						if (time == moment(new Date()).format('YYYY-MM-DD')) {
							temp.label = '今天'
						} else if (time == moment(new Date().getTime() - 24 * 3600 * 1000).format('YYYY-MM-DD')) {
							temp.label = '昨天'
						}
						temp.monthCount = item.monthCount || 0
						temp.list = [item];
						filterList.push(temp);
						// this.filterList = filterList
					} else {
						temp.list.push(item);
						filterList[index] = temp
					}
					this.filterList = filterList
				})
				// console.log(this.filterList)
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
		padding: 1rpx 24rpx;

		.order-list {
			// padding: 8rpx 0;

			.order-list_wrap {
				background-color: #fff;
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
				border-radius: 10rpx;
				padding: 0 40rpx;
				margin: 40rpx 0;

				.order-list_title {
					padding: 40rpx 0 0;
					font-size: 32rpx;
					font-weight: 500;
					line-height: 44rpx;
				}

				.order-item {
					padding: 40rpx 0;
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
	}
</style>
