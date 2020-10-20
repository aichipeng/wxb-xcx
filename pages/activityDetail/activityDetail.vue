<template>
	<view class="activity-detail-page" :style="{paddingBottom: queryList.status == 201 ? '294rpx' : 0}">
		<view class="activity-card" @click="handleActivity">
			<view class="header flex-row">
				<text class="header-left">
					<text>{{moment(info.addTime).format('MM月DD日 HH:mm')}}</text>
					<text v-if="info.status != 0">
						<text style="margin: 0 16rpx;">|</text>
						<!-- <text style="color: #EFB600;">{{info.browseNum || 0}}</text> -->
						<text>已发布{{info.day || 0}}天</text>
					</text>
				</text>
				<text class="header-right">{{typeMap[info.status]}}</text>
			</view>
			<view class="body">
				<text class="txt acp-ellipsis-l2">{{info.describe || '暂无描述'}}</text>
			</view>
			<view class="footer flex-row">
				<view class="footer-left">
					<view class="flex-row" style="padding: 4rpx 0;font-size: 28rpx;">
						<!-- <text class="acp-ellipsis" style="margin-right: 24rpx">{{info.name || '商品名称'}}</text> -->
						<text style="font-weight: 500;">¥{{((info.price || 0) * (info.num || 0)) + (info.freightPrice || 0)}}</text>
						<text style="margin: 0 16rpx;">|</text>
						<text class="flex-1" style="white-space: nowrap;">可售单量{{info.saleVolume || 0}}单</text>
					</view>
				</view>
				<view v-if="info.status != 2" class="footer-right flex-row" @click.stop="handleClick">
					<text class="btn">{{btnMap[info.status] || '安排发货'}}</text>
				</view>
			</view>
		</view>
		<block v-if="info.status != 0">
			<view class="activity-count flex-row">
				<view class="count-item flex-col">
					<text class="val">{{info.soldVolume|| 0}}单</text>
					<text class="lab">已售</text>
				</view>
				<view class="count-item flex-col">
					<text class="val">{{info.stayDeliver || 0}}</text>
					<text class="lab">待发货</text>
				</view>
				<view class="count-item flex-col">
					<text class="val">{{info.browseNum || 0}}</text>
					<text class="lab">浏览人次</text>
				</view>
			</view>
			<view class="activity-order">
				<view class="title-bar">
					<text>关联订单</text>
				</view>
				<view class="tabbar-order flex-row">
					<block v-for="(item,index) in tabList" :key="index">
						<view class="tab-wrap flex-col flex-1" :style="{color: queryList.status == item.status ? '#333' : '#999',fontWeight: queryList.status == item.status ? '500' : '400'}"
						 @click="toggleType(item)">
							<text class="tab">{{item.statusName}}</text>
							<text class="num">{{item.statusSum}}</text>
							<view v-if="queryList.status == item.status" class="line"></view>
						</view>
					</block>
				</view>
				<view class="order-list">
					<block v-for="(item,index) in list" :key="index">
						<view class="order-item flex-row" @click="navigateTo('/pages/orderDetail/orderDetail?orderSn=' + item.orderSn + '&mode=server')">
							<view class="item-left flex-row" @click.stop="select(item)">
								<view v-if="queryList.status == 201" class="checkbox">
									<uni-icons v-if="checkedMap.indexOf(item.orderSn) == -1" type="checkbox-filled" size="20" color="#ddd"></uni-icons>
									<uni-icons v-else type="checkbox-filled" size="20" color="#FFD44D"></uni-icons>
								</view>
								<view class="time flex-col">
									<text v-if="item.addTime">{{item.addTime.substring(5,10)}}</text>
									<text v-if="item.addTime">{{item.addTime.substring(11,16)}}</text>
								</view>
							</view>
							<view class="item-center flex-row flex-1">
								<text class="status">{{statusMap[item.orderStatus] || '待付款'}}</text>
								<image class="avatar" :src="item.avatar || avatar"></image>
								<text class="name acp-ellipsis flex-1">{{item.nickName}}</text>
							</view>
							<view class="item-right btn flex-col" @click.stop="handleBtn(item)">
								<text>{{btnTxtMap[item.orderStatus] || '查看详情'}} </text>
							</view>
						</view>
					</block>
				</view>
			</view>
		</block>
		<uni-popup ref="popup" type="bottom" :maskShow="false">
			<view class="footer-fixed">
				<view class="select-all flex-row">
					<view class="checkbox" @click="selectAll">
						<uni-icons v-if="!isAll" type="checkbox-filled" size="20" color="#ddd"></uni-icons>
						<uni-icons v-else type="checkbox-filled" size="20" color="#FFD44D"></uni-icons>
					</view>
					<text style="margin-left: 16rpx;">全选</text>
					<text style="margin-left: 40rpx;">已选 {{checkedMap.length}} 条</text>
				</view>
				<view class="btn-group flex-row">
					<view class="btn flex-col flex-1" @click="handleSend()">
						<text class="name">直接发货</text>
						<text class="tips">填写物流单号</text>
					</view>
					<view style="width: 18rpx;"></view>
					<view class="btn flex-col flex-1" @click="handlePick()">
						<text class="name">预约取件</text>
						<text class="tips">快递上门更便宜</text>
					</view>
					<view style="width: 18rpx;"></view>
					<view class="btn flex-col flex-1" @click="handleExport()">
						<text class="name">他人代发</text>
						<text class="tips">导出excel</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		activityDetail,
		activityClose
	} from "@/api/activity.js"
	import {
		orderByActivity,
		orderByActivityCount
	} from "@/api/order.js"
	import moment from "moment";
	import uniRecordItem from "@/components/uni-record-item/uni-record-item.vue"
	export default {
		name: 'ActivityDetail',
		components: {
			uniRecordItem,
		},
		data() {
			return {
				moment,
				id: undefined,
				info: {
					status: 0
				},
				typeMap: {
					0: '待发布',
					1: '进行中',
					2: '已结束',
				},
				btnMap: {
					0: '编辑',
					1: '关闭活动',
					2: '已结束',
				},
				avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2476878483,4014399276&fm=26&gp=0.jpg',
				statusMap: {
					101: '待付款',
					201: '待发货',
					202: '预约中',
					203: '已导出',
					301: '运输中',
					601: '已结束',
					602: '已关闭',
				},
				btnTxtMap: {
					101: '查看详情',
					201: '安排发货',
					202: '安排发货',
					203: '安排发货',
					301: '查看物流',
					601: '查看详情',
					602: '查看详情',
				},
				tabList: [{
						statusName: '待付款',
						status: 101,
						statusSum: 0
					},
					{
						statusName: '待发货',
						status: 201,
						statusSum: 0
					},
					{
						statusName: '运输中',
						status: 301,
						statusSum: 0
					},
					{
						statusName: '已结束',
						status: 601,
						statusSum: 0
					},
					{
						statusName: '交易关闭',
						status: 602,
						statusSum: 0
					}
				],
				queryList: {
					status: 101,
					page: 1,
					size: 10
				},
				list: [],
				length: 0,
				isLoading: false,
				finish: false,
				isAll: false,
				checkedMap: [],
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.getInfo();
			}
		},
		onShow() {
			this.isAll = false;
			this.checkedMap = [];
		},
		onPullDownRefresh() {
			this.list = [];
			this.queryList.page = 1;
			this.getInfo();
		},
		onReachBottom() {
			if (!this.finish && !this.isLoading) {
				this.isLoading = true
				this.queryList.page++;
				this.getOrder()
			}
		},
		methods: {
			getInfo() {
				activityDetail({
					id: this.id
				}).then(res => {
					uni.stopPullDownRefresh();
					this.info = res.data;
					if (res.data.status != 0) {
						this.getOrder()
						this.getCount()
					} else {
						this.finish = true
					}
				}).catch(() => {
					uni.stopPullDownRefresh();
				})
			},
			// 关联订单统计
			getCount() {
				orderByActivityCount({
					activityId: this.id
				}).then(res => {
					this.tabList = res.data;
				})
			},
			// 关联订单
			getOrder() {
				let {
					queryList
				} = this
				queryList.activityId = this.id
				orderByActivity(queryList).then(res => {
					this.isLoading = false
					if (res.data && res.data.length > 0) {
						this.list = this.list.concat(res.data)
						this.finish = false
					} else {
						this.finish = true
					}
				}).catch(() => {
					this.isLoading = false
				})
			},

			handleActivity() {
				const {
					status
				} = this.info,
					_this = this
				switch (Number(status)) {
					case 0:
						_this.navigateTo('/pages/activityPreview/activityPreview?id=' + this.id)
						break;
					case 1:
						this.navigateTo('/pages/activityShare/activityShare?id=' + this.id)
						break;
					case 2:
						// 关闭
						// _this.navigateTo('/pages/activityShare/activityShare?id=' + this.id)
						break;
					default:
						break
				}
			},
			handleClick() {
				// console.log(this.info);
				const {
					status
				} = this.info,
					_this = this
				switch (Number(status)) {
					case 0:
						// 发布 
						_this.navigateTo('/pages/activityCreate/activityCreate?id=' + this.id)
						break;
					case 1:
						// 关闭活动 
						_this.closeActivity()
						break;
					case 2:
						// 关闭
						// _this.navigateTo('/pages/activityShare/activityShare?id=' + this.id)
						break;
					default:
						break
				}
			},
			closeActivity() {
				const _this = this
				uni.showModal({
					title: '提示',
					content: '是否确定关闭当前活动',
					success: function(res) {
						if (res.confirm) {
							activityClose({
								activityId: _this.id
							}).then(res => {
								uni.showToast({
									title: '关闭成功',
									icon: 'none',
									mask: true
								})
								_this.info.status = 2
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 切换状态
			toggleType(item) {
				let {
					queryList
				} = this;
				if (queryList.status != item.status) {
					queryList.status = item.status;
					queryList.page = 1;
					this.list = [];
					this.queryList = queryList;
					this.getOrder();
					if (this.queryList.status == 201) {
						this.$refs.popup.open()
					} else {
						this.$refs.popup.close()
					}
				}
			},
			// 选择选项
			select(item) {
				const {
					queryList,
					checkedMap,
					list
				} = this;
				const idx = checkedMap.indexOf(item.orderSn);
				if (idx == -1) {
					checkedMap.push(item.orderSn)
				} else {
					checkedMap.splice(idx, 1)
				}
				this.isAll = checkedMap.length == list.length
			},
			// 全选
			selectAll() {
				const {
					isAll,
					list
				} = this;
				let checkedMap = [];
				if (isAll) {
					this.isAll = false;
					this.checkedMap = checkedMap;
				} else {
					this.isAll = true;
					list.forEach((item, index) => {
						checkedMap.push(item.orderSn)
					});
					this.checkedMap = checkedMap;
				}
			},
			
			handleBtn(item) {
				switch (Number(item.orderStatus)) {
					case 201:
						this.navigateTo('/pages/sendScreen/sendScreen?id=' + this.id + '&name=' + this.info.name)
						break;
					case 202:
						this.navigateTo('/pages/sendScreen/sendScreen?id=' + this.id + '&name=' + this.info.name)
						break;
					case 203:
						this.navigateTo('/pages/sendScreen/sendScreen?id=' + this.id + '&name=' + this.info.name)
						break;
					case 301:
						this.navigateTo('/pages/orderExpress/orderExpress?no=' + item.shipSn + '&code=' + item.shipChannel)
						break;
					default:
						this.navigateTo('/pages/orderDetail/orderDetail?orderSn=' + item.orderSn + '&mode=server')
						break;
				}
				// console.log(item)
			},
			
			// 直接发货
			handleSend() {
				const {
					checkedMap
				} = this;
				if (checkedMap.length > 0) {
					this.navigateTo('/pages/orderSend/orderSend?item=' + JSON.stringify(checkedMap))
				} else {
					uni.showToast({
						title: '请选择订单',
						icon: 'none',
						mask: true
					})
				}
			},
			// 预约取件
			handlePick() {
				const {
					checkedMap
				} = this;
				if (checkedMap.length > 0) {
					this.navigateTo('/pages/orderPick/orderPick?item=' + JSON.stringify(checkedMap))
				} else {
					uni.showToast({
						title: '请选择订单',
						icon: 'none',
						mask: true
					})
				}
			},
			// 他人代发
			handleExport() {
				const {
					checkedMap
				} = this;
				if (checkedMap.length > 0) {
					this.navigateTo('/pages/orderExport/orderExport?item=' + JSON.stringify(checkedMap))
				} else {
					uni.showToast({
						title: '请选择订单',
						icon: 'none',
						mask: true
					})
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
	.activity-detail-page {
		padding: 1rpx 24rpx;

		.activity-card {
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
					margin-left: 20rpx;

					.btn {
						line-height: 40rpx;
						font-size: 28rpx;
					}
				}
			}
		}

		.activity-count {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			justify-content: space-between;
			padding: 36rpx 0;
			margin: 40rpx 0;

			.count-item {
				flex: 1;
				margin: 0 50rpx;

				.val {
					font-size: 36rpx;
					line-height: 50rpx;
					margin: 4rpx 0;
				}

				.lab {
					color: #666;
					font-size: 26rpx;
					line-height: 36rpx;
					margin: 4rpx 0;
				}
			}
		}

		.activity-order {
			margin: 40rpx 0;

			.title-bar {
				font-size: 36rpx;
				line-height: 50rpx;
				font-weight: 500;
				padding: 40rpx 0;
			}

			.tabbar-order {
				background-color: #fff;
				position: absolute;
				left: 0;
				right: 0;

				.tab-wrap {
					position: relative;
					line-height: 42rpx;
					font-size: 30rpx;
					height: 132rpx;

					.tab {
						margin: 4rpx 0;
					}

					.num {
						margin: 4rpx 0;
					}

					.line {
						position: absolute;
						z-index: 2;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						width: 40rpx;
						height: 6rpx;
						background: #EFB600;
					}
				}
			}

			.order-list {
				padding: 132rpx 0 0;

				.order-item {
					margin: 40rpx 0;
					padding: 40rpx 20rpx;
					box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
					background-color: #fff;
					border-radius: 10rpx;
					justify-content: space-between;

					.item-left {
						.checkbox {
							transform: translateY(4rpx);
							margin-right: 10rpx;
						}

						.time {
							align-items: flex-start;
							// padding: 0 10rpx;
							width: 100rpx;
						}
					}

					.item-center {
						overflow: hidden;

						.status {
							font-size: 28rpx;
							color: #EFB600;
							width: 100rpx;
						}

						.avatar {
							width: 60rpx;
							height: 60rpx;
							border-radius: 30rpx;
							margin: 0 6rpx;
						}

						.name {
							margin: 0 6rpx;
						}
					}

					.btn {
						width: 176rpx;
						height: 60rpx;
						background: #EFB600;
						box-shadow: 0 6rpx 12rpx 0 rgba(239, 182, 0, 0.2);
						border-radius: 32rpx;
						color: #fff;
					}
				}
			}
		}

		.footer-fixed {
			background: #fff;
			height: 270rpx;
			padding: 12rpx 24rpx;
			overflow: hidden;

			.select-all {
				font-size: 30rpx;
				line-height: 42rpx;
				margin: 12rpx 0;

				.checkbox {
					transform: translateY(4rpx);
				}
			}

			.btn-group {
				margin: 40rpx 0;

				.btn {
					height: 136rpx;
					border-radius: 10rpx;
					border: 2rpx solid #FFD44D;

					.name {
						font-weight: 500;
						font-size: 30rpx;
						line-height: 42rpx;
						margin: 4rpx 0;
						color: #333;
					}

					.tips {
						margin: 4rpx 0;
						color: #999;
					}
				}
			}
		}
	}
</style>
