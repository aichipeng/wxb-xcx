<template>
	<view class="send-screen">
		<view class="header-fixed flex-row">
			<view class="header-left flex-row flex-1">
				<view>待发货 {{list.length}} 单</view>
				<view style="margin: 0 40rpx;">|</view>
				<view class="acp-ellipsis flex-1">{{name || '商品名称'}}</view>
			</view>
			<view class="header-right flex-col" @click="$refs.guide && $refs.guide.open()">
				<view class="">导入</view>
				<view class="">EXCEL</view>
			</view>
		</view>
		<view class="body">
			<block v-for="(item,index) in list" :key="index">
				<view class="content-item flex-row">
					<view class="item-left flex-row" @click="select(item)">
						<view class="checkbox">
							<uni-icons v-if="checkedMap.indexOf(item.orderSn) == -1" type="checkbox-filled" size="20" color="#ddd"></uni-icons>
							<uni-icons v-else type="checkbox-filled" size="20" color="#FFD44D"></uni-icons>
						</view>
					</view>
					<view class="info-card flex-1">
						<view class="flex-row">
							<view class="time flex-col">
								<text v-if="item.addTime">{{item.addTime.substring(5,10)}}</text>
								<text v-if="item.addTime">{{item.addTime.substring(11,16)}}</text>
							</view>
							<view class="user-info flex-row flex-1">
								<image :src="item.avatar || avatar" class="avatar"></image>
								<view class="name acp-ellipsis flex-1">{{item.nickName}}</view>
								<view class="flex-row" @click="navigateTo('/pages/orderDetail/orderDetail?orderSn=' + item.orderSn + '&mode=server')">
									<text class="status-txt" :style="{color: item.orderStatus == 202 ? '#EFB600' : item.orderStatus == 203 ? '#4CB17E' : '#333'}">{{statusMap[item.orderStatus]}}</text>
									<uni-icons type="arrowright" size="16" color="#333" style="margin-right: -6rpx;margin-top: 4rpx;"></uni-icons>
								</view>
							</view>
						</view>
						<view class="address-info flex-row">
							<view class="time"></view>
							<view class="address-wrap flex-1">
								<view class="address-item flex-row">
									<view class="label">收件人：</view>
									<view class="value flex-1 flex-row">
										<text class="consignee acp-ellipsis flex-1">{{item.consignee}}</text>
										<text class="mobile">{{item.mobile}}</text>
									</view>
								</view>
								<view class="address-item flex-row" style="align-items: flex-start;">
									<view class="label">收货地址：</view>
									<view class="value flex-1 acp-ellipsis-l2">{{item.address}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>
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
		<uni-popup ref="guide" type="bottom" @change="guideChange">
			<view class="guide-wrap">
				<uni-icons class="close" type="closeempty" size="24" color="#999" @click="$refs.guide && $refs.guide.close()"></uni-icons>
				<view class="title">导入详情</view>
				<image class="img" src="@/static/images/guide.png" mode="widthFix" style="width: 100%;"></image>
				<view class="site-wrap flex-row">
					<text>登录网址：{{site}}</text>
					<uni-icons @click="copeText(site)" type="compose" size="16" color="#5D5D5D" style="padding: 0 16rpx; margin-left: 20rpx;"></uni-icons>
				</view>
				<view class="submit-btn flex-col" @click="$refs.guide && $refs.guide.close()">
					<text>知道了</text>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		orderByActivity,
	} from "@/api/order.js"
	export default {
		data() {
			return {
				id: undefined,
				name: undefined,
				avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2476878483,4014399276&fm=26&gp=0.jpg',
				queryList: {
					status: 201,
					page: 1,
					size: 10
				},
				statusMap: {
					201: '待发货',
					202: '预约取件中',
					203: '已导出',
				},
				list: [],
				isLoading: false,
				finish: false,
				isAll: false,
				checkedMap: [],
				site: 'http://sell.banyuge.com'
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
			}
			if (options.name) {
				this.name = options.name
			}
		},
		onShow() {
			this.list = []
			this.isLoading = false;
			this.finish = false;
			this.checkedMap = [];
			this.isAll = false,
				this.id && this.getList();
			this.$refs.popup && this.$refs.popup.open()
		},
		onReady() {
			if (!this.token) {
				this.$refs.popup && this.$refs.popup.open()
			}
		},
		methods: {
			// 关联订单
			getList() {
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
			// filterList() {
			// 	const {
			// 		list
			// 	} = this;
			// 	return list.filter(item => item.orderStatus == 201 || item.orderStatus == 201)
			// },
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
			guideChange(e) {
				console.log(e.show)
				if (e.show) {
					this.$refs.popup.close()
				} else {
					this.$refs.popup.open()
				}
			},
			copeText(data) {
				if (!data) return;
				uni.setClipboardData({
					data: data,
					success: function(data) {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							mask: true
						})
					},
					fail: function(err) {
						uni.showToast({
							title: '复制失败',
							icon: 'none',
							mask: true
						})
					},
					complete: function(res) {}
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

<style lang="scss">
	.send-screen {
		padding: 110rpx 25rpx 280rpx;

		.header-fixed {
			background-color: #5D6368;
			padding: 25rpx;
			position: fixed;
			top: 0;
			/* #ifdef H5 */
			top: 88rpx;
			/* #endif */
			left: 0;
			right: 0;
			z-index: 11;
			color: #fff;

			.header-left {
				font-size: 30rpx;
				line-height: 42rpx;
				overflow: hidden;
			}

			.header-right {
				width: 140rpx;
				height: 60rpx;
				font-size: 22rpx;
				line-height: 32rpx;
				color: #5D6368;
				background-color: #FFF;
				border-radius: 30rpx;
				margin-left: 25rpx;
			}
		}

		.body {
			.content-item {
				margin: 24rpx 0 40rpx;

				.info-card {
					margin-left: 24rpx;
					padding: 40rpx 20rpx;
					background: #FFF;
					box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
					border-radius: 10rpx;
					overflow: hidden;

					.time {
						// align-items: flex-start;
						// padding: 0 10rpx;
						color: #5D6368;
						width: 90rpx;
						font-size: 22rpx;
						line-height: 32rpx;
					}

					.user-info {
						margin-left: 40rpx;
						overflow: hidden;

						.avatar {
							width: 80rpx;
							height: 80rpx;
						}

						.name {
							font-weight: 500;
							font-size: 30rpx;
							line-height: 42rpx;
							margin: 0 16rpx;
						}

						.status-txt {
							font-size: 30rpx;
							line-height: 42rpx;
							margin: 0 10rpx;
							font-weight: 500;
						}
					}

					.address-info {
						margin-top: 32rpx;

						.address-wrap {
							margin-left: 40rpx;
							overflow: hidden;

							.address-item {
								margin: 8rpx 0;

								.label {
									color: #999;
									width: 120rpx;
								}

								.value {
									overflow: hidden;

									.mobile {
										margin-left: 20rpx;
									}
								}
							}
						}
					}
				}
			}

		}

		.footer-fixed {
			background: #fff;
			height: 270rpx;
			padding: 12rpx 24rpx;

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

		.guide-wrap {
			background: #fff;
			padding: 20rpx 24rpx 60rpx;
			position: relative;

			.close {
				position: absolute;
				z-index: 11;
				right: 18rpx;
				top: 26rpx;
			}

			.title {
				font-size: 30rpx;
				line-height: 42rpx;
				text-align: center;
			}

			.img {
				margin: 32rpx 0 24rpx;
			}

			.site-wrap {
				font-size: 28rpx;
				line-height: 40rpx;
				margin: 24rpx 0;
			}

			.submit-btn {
				height: 90rpx;
				border-radius: 45px;
				background: #FFD44D;
				box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
				font-size: 30rpx;
				line-height: 42rpx;
				margin-top: 60rpx;
			}
		}

	}
</style>
