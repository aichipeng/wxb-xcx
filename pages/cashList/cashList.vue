<template>
	<view class="cash-list">
		<view class="cash-card">
			<!-- {{filterList}} -->
			<view class="month-wrap" v-for="(item,index) in filterList" :key="index">
				<view class="month-title flex-row">
					<view class="">
						{{moment(item.date).format('YYYY年MM月')}}
					</view>
					<!-- <view class="">
						<text>总计：</text>
						<text>￥{{(item.monthCount).toFixed(2)}}</text>
					</view> -->
				</view>
				<view class="day-group" v-for="(val,key) in item.list" :key="key">
					<view class="day-wrap border-bottom">
						<view class="day-title flex-row">
							<view class="">{{val.remark}}</view>
							<text style="color: #EFB600">{{val.plusMinus == 1 ? '+' : val.plusMinus == 2 ? '-' : ''}}{{Number(val.tradeMoney || 0).toFixed(2)}}</text>
						</view>
						<view class="day-content flex-row">
							<view>{{moment(val.addTime).format('MM月DD日 HH:mm')}}</view>
							<view>余额 {{(val.usable).toFixed(2)}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		balanceList
	} from "@/api/account.js"
	import moment from "moment";
	export default {
		data() {
			return {
				moment,
				queryList: {
					page: 1,
					limit: 10,
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
				balanceList(this.queryList).then(res => {
					// console.log(res.data)
					if (res.data && res.data.length > 0) {
						this.list = this.list.concat(res.data);
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
					const time = moment(item.addTime).format('YYYY-MM');
					const index = filterList.findIndex(item => {
						return item.date == time
					})
					let temp = filterList.find(item => {
						return item.date == time
					}) || {};
					// filterList[0].list.push(temp)
					if (index == -1) {
						temp.date = time;
						temp.list = [item];
						filterList.push(temp);
						// this.filterList = filterList
					} else {
						temp.list.push(item);
						filterList[index] = temp
					}
					this.filterList = filterList
				})
			}
		}
	}
</script>

<style lang="scss">
	.cash-list {
		padding: 16rpx 24rpx;
		font-size: 28rpx;
		line-height: 40rpx;

		.cash-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.04);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 1rpx 40rpx 0;

			.month-wrap {
				.month-title {
					justify-content: space-between;
					background-color: #F9F9F9;
					padding: 10rpx 20rpx;
					border-radius: 12rpx;
					font-weight: 500;
					margin-top: 40rpx;
				}
			}

			.day-group {
				.day-wrap {
					padding: 40rpx 0;

					.day-title {
						justify-content: space-between;
					}

					.day-content {
						justify-content: space-between;
						margin-top: 16rpx;
						font-size: 24rpx;
						line-height: 32rpx;
						color: #999;

						.tag {
							margin: 0 24rpx;
							font-size: 20rpx;
							line-height: 28rpx;
							background-color: #F1F1F1;
							color: #999;
							padding: 6rpx 12rpx;
							border-radius: 30rpx;
						}

					}
				}
			}

			.day-group:last-child {
				.day-wrap:last-child {
					border-bottom: none;
				}
			}
		}
	}
</style>
