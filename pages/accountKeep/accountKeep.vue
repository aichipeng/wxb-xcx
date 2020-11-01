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
			<block v-for="(i,k) in filterList" :key="k">
				<view class="month-count flex-row">
					<view class="month">{{moment(i.date).format('YYYY年MM月')}}</view>
					<view class="">收入¥ {{i.inMonthCount}}</view>
					<view class="">支出¥ {{i.payMonthCount}}</view>
					<view v-if="queryList.type != 2">顾客{{i.customerNum}}</view>
				</view>
				<view class="month-card">
					<block v-for="(val,key) in i.list" :key="k + '_' + key">
						<view class="day-count flex-row">
							<view class="day">{{moment(val.date).format('MM月DD日')}}</view>
							<view class="count">
								<view class="flex-row" style="margin: 8rpx 0;">
									<image class="icon" src="/static/images/sr.png"></image>
									<text class="txt">￥{{val.inDayCount}}</text>
								</view>
								<view class="flex-row" style="margin: 8rpx 0;">
									<image class="icon" src="/static/images/zc.png"></image>
									<text class="txt">￥{{val.payDayCount}}</text>
								</view>
							</view>
						</view>
						<block v-for="(item,index) in val.list" :key="k + '_' + key + '_' + index">
							<view class="order-item" :style="{ borderBottom: index == val.list.length - 1 ? 'none':'' }">
								<view class="order-item-top flex-row">
									<view class="info flex-row acp-ellipsis">
										<text class="name acp-ellipsis">{{item.remark}}</text>
										<text class="tag">{{item.type == 2 ? '手动' : '自动'}}</text>
									</view>
									<text v-if="item.plusMinus == 1 && item.num">X {{item.num}}</text>
								</view>
								<view class="order-item-bottom flex-row">
									<text style="color: #999">{{moment(item.addTime).format('HH:mm:ss')}}</text>
									<text style="color: #EFB600">{{item.plusMinus == 1 ? '+' : item.plusMinus == 2 ? '-' : ''}}{{Number(item.tradeMoney || 0).toFixed(2)}}</text>
								</view>
							</view>
						</block>
					</block>
				</view>
			</block>
		</view>
		<uni-keep-float />
	</view>
</template>

<script>
	import {
		accountList
	} from "@/api/account.js"
	import moment from "moment";
	import uniKeepFloat from "@/components/uni-keep-float/uni-keep-float.vue"
	export default {
		data() {
			return {
				moment,
				tabList: [{
						name: '全部',
						type: ''
					},
					{
						name: '自动记账',
						type: 1
					},
					{
						name: '手动记账',
						type: 2
					}
				],
				queryList: {
					page: 1,
					limit: 10,
					type: ''
				},
				isLoading: false,
				list: [],
				filterList: [],
				finish: false
			};
		},
		components: {
			uniKeepFloat
		},
		onShow() {
			this.list = [];
			this.filterList = [];
			this.queryList.page = 1;
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
				accountList(this.queryList).then(res => {
					if (res.data && res.data.length > 0) {
						this.list = this.list.concat(res.data)
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
			toggleType(item) {
				if (this.queryList.type !== item.type) {
					this.queryList.type = item.type
					this.queryList.page = 1
					this.list = [];
					this.filterList = [];
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
			getFilterList() {
				const {
					list,
				} = this;
				const _this = this
				let filterList = []
				list.forEach(item => {
					// console.log(item)
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
						temp.customerNum = item.customerNum || 0
						temp.inMonthCount = item.inMonthCount || 0
						temp.payMonthCount = item.payMonthCount || 0
						temp.list = [item];
						filterList.push(temp);
						// this.filterList = filterList
					} else {
						temp.list.push(item);
						filterList[index] = temp
					}
				})
				// this.filterList = filterList
				// console.log(filterList)
				this.getFilterList1(filterList)
			},
			getFilterList1(list) {
				// console.log(list)
				list.forEach((item, index) => {
					const data = [];
					item.list.forEach(value => {
						const day = moment(value.addTime).format('YYYY-MM-DD');
						const index = data.findIndex(e => {
							return e.date == day
						})
						const temp = data.find(e => {
							return e.date == day
						}) || {};
						// filterList[0].list.push(temp)
						if (index == -1) {
							temp.date = day;
							temp.payDayCount = value.payDayCount || 0
							temp.inDayCount = value.inDayCount || 0
							temp.list = [value];
							data.push(temp);
							// this.filterList = filterList
						} else {
							temp.list.push(value);
							data[index] = temp
						}
					})
					list[index].list = data
				})
				// console.log(list)
				this.filterList = list
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
			padding: 10rpx 24rpx;

			.month-count {
				justify-content: space-between;
				padding: 24rpx 0;
			}

			.month-card {
				background: #FFF;
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
				border-radius: 10rpx;
				overflow: hidden;

				.day-count {
					background-color: #EEE;
					padding: 12rpx 40rpx;
					justify-content: space-between;
					border-radius: 12rpx 12rpx 0 0;

					.day {
						font-size: 28rpx;
						line-height: 40rpx;
						font-weight: 500;
					}

					.count {
						.icon {
							width: 40rpx;
							height: 40rpx;
							margin: 0 44rpx;
						}

						.txt {
							font-weight: 500;
							text-align: right;
							flex: 1;
						}
					}
				}

				.order-item {
					padding: 40rpx 0;
					margin: 0 24rpx;
					border-bottom: solid 2rpx #EEEEEE;
					font-size: 28rpx;
					line-height: 40rpx;

					.order-item-top {
						justify-content: space-between;
						font-size: 28rpx;

						.info {
							max-width: 75%;

							.name {
								margin-right: 24rpx;
							}

							.tag {
								background-color: #F1F1F1;
								border-radius: 4rpx;
								font-size: 24rpx;
								line-height: 34rpx;
								font-weight: 500;
								color: #999;
								padding: 2rpx 8rpx;
							}
						}
					}

					.order-item-bottom {
						justify-content: space-between;
						margin-top: 10rpx;

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
