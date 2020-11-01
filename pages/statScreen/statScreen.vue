<template>
	<view class="stat-screen">
		<cover-view class="tabbar-top flex-row border-bottom">
			<cover-view v-for="(item,index) in tabList" :key="index" class="tab-wrap flex-col flex-1" @click="toggleType(item)">
				<cover-view :style="{color: current === item.type ? '#333' : '#999'}">{{item.name}}</cover-view>
				<cover-view v-if="current === item.type" class="line"></cover-view>
			</cover-view>
		</cover-view>
		<view class="stat-warp border-bottom">
			<view class="flex-col">
				<view class="select-wrap flex-row" v-if="current != 4">
					<view class="flex-row">
						<block>
							<view class="time" v-if="current == 1">{{moment(new Date(formData.data)).format('YYYY年MM月DD日')}}</view>
							<view class="time flex-col" v-if="current == 2">
								<view class="">{{moment(currentWeek.yearMonth + '01').format('YYYY年MM月')}}第{{currentWeek.nameNum}}周</view>
								<view class="">{{currentWeek.data}}</view>
							</view>
							<view class="time" v-if="current == 3">{{moment(formData.month + '-01').format('YYYY年MM月')}}</view>
						</block>
						<block>
							<picker v-if="current == 1" mode="date" fields='day' :end="end" :value="formData.data" @change="bindDateChange"
							 style="transform: translateY(4rpx);">
								<uni-icons type="info" size="16"></uni-icons>
							</picker>
							<picker v-if="current == 2" :range="weekList" range-key="label" :value="weekList.length-1" @change="bindDateChange"
							 style="transform: translateY(4rpx);">
								<uni-icons type="info" size="16"></uni-icons>
							</picker>
							<picker v-if="current == 3" mode="date" fields="month" :end="end" :value="formData.month" @change="bindDateChange"
							 style="transform: translateY(4rpx);">
								<uni-icons type="info" size="16"></uni-icons>
							</picker>
						</block>
					</view>
				</view>
			</view>
			<view class="flex-row">
				<view class="stat-item flex-col flex-1">
					<text class="label">收入总额</text>
					<text class="value"><text class="sign">￥</text><text>{{(info.incomeTotal || 0).toFixed(2)}}</text></text>
				</view>
				<view class="stat-item flex-col flex-1">
					<text class="label">支出总额</text>
					<text class="value"><text class="sign">￥</text><text>{{(info.expendTotal || 0).toFixed(2)}}</text></text>
				</view>
			</view>
			<view class="flex-row">
				<view class="stat-item flex-col flex-1">
					<text class="label">订单总数</text>
					<text class="value">{{(info.orderNumTotal||0)}}</text>
				</view>
				<view class="stat-item flex-col flex-1">
					<text class="label">顾客总数</text>
					<text class="value">{{(info.customerTotal||0)}}</text>
				</view>
			</view>
		</view>
		<!-- 数据概览图 收入、支出统计环状图表 -->
		<view class="border-bottom" style="padding: 80rpx 0 30rpx;">
			<view class="flex-row" style="justify-content: space-between;">
				<text style="font-size: 40rpx; font-weight: 500;line-height: 56rpx;">数据概览图</text>
				<view class="tabs flex-row">
					<text class="tab" @click="rIndex = 0" :style="{ color: rIndex == 0 ? '#FFD44D' : '#999' }">收入</text>
					<text class="tab" @click="rIndex = 1" :style="{ color: rIndex == 1 ? '#FFD44D' : '#999' }">支出</text>
				</view>
			</view>
			<view class="" style="margin: 20rpx 0;font-size: 24rpx;">
				<text>单位/元</text>
			</view>
			<swiper ref="ringSwiper" :current="rIndex" @change="ringChange" :style="{height: rHeight + 'px', marginTop: '-60rpx'}">
				<swiper-item class="ring_chart flex-col">
					<canvas canvasId="canvaRing0" id="canvaRing0" :style="{ width: rWidth + 'px', height: rHeight + 'px'}" @touchstart="touchRing" />
				</swiper-item>
				<swiper-item class="ring_chart flex-col">
					<canvas canvasId="canvaRing1" id="canvaRing1" :style="{ width: rWidth + 'px', height: rHeight + 'px'}" @touchstart="touchRing" />
				</swiper-item>
			</swiper>
		</view>
		<!-- 数据概览图 订单、顾客统计柱状图表 -->
		<view class="border-bottom" style="padding: 80rpx 0 70rpx;">
			<view class="flex-row" style="justify-content: space-between;">
				<text style="font-size: 24rpx;">单位/个</text>
				<view class="tabs flex-row">
					<text class="tab" @click="qIndex = 0" :style="{ color: qIndex == 0 ? '#FFD44D' : '#999' }">订单</text>
					<text class="tab" @click="qIndex = 1" :style="{ color: qIndex == 1 ? '#FFD44D' : '#999' }">顾客</text>
				</view>
			</view>
			<swiper ref="ringSwiper" :current="qIndex" @change="qiunChange" :style="{height: qHeight + 'px'}">
				<swiper-item class="qiun-charts flex-col">
					<canvas canvasId="canvaQiun0" id="canvaQiun0" :style="{ width: qWidth + 'px', height: qHeight + 'px'}" @touchstart="touchQiun" />
				</swiper-item>
				<swiper-item class="qiun_chart flex-col">
					<canvas canvasId="canvaQiun1" id="canvaQiun1" :style="{ width: qWidth + 'px', height: qHeight + 'px'}" @touchstart="touchQiun" />
				</swiper-item>
			</swiper>
		</view>

		<view class="border-bottom" style="padding: 80rpx 0;">
			<view class="flex-row" style="justify-content: space-between;">
				<text style="font-size: 40rpx; font-weight: 500;line-height: 56rpx;">商品销量排行</text>
				<text style="font-size: 26rpx;" @click="navigateTo('/pages/statGoods/statGoods?id=' + info.id)">查看全部</text>
			</view>
			<view class="stack-charts flex-col" style="margin: 60rpx 0 20rpx;">
				<canvas canvasId="canvaStack" id="canvaStack" :style="{ width: sWidth + 'px', height: sHeight + 'px'}" @touchstart="touchColumn"></canvas>
			</view>
			<view class="flex-row" style="justify-content: space-between;">
				<view class="flex-row">
					<text style="width: 16rpx; height: 16rpx; background-color: #FFAE00;"></text>
					<text style="color: #8C8C8C; margin: 0 16rpx 0 10rpx;">记账</text>
					<text style="width: 16rpx; height: 16rpx; background-color: #FAD673;"></text>
					<text style="color: #8C8C8C; margin: 0 16rpx 0 10rpx;">订单</text>
				</view>
				<text style="font-size: 26rpx;">单位/单</text>
			</view>
		</view>
		<view style="padding: 80rpx 0 0;">
			<view class="flex-row" style="justify-content: space-between;">
				<text style="font-size: 40rpx; font-weight: 500;line-height: 56rpx;">买家排行</text>
				<text style="font-size: 26rpx;" @click="navigateTo('/pages/statBuys/statBuys?id=' + info.id)">查看全部</text>
			</view>
			<view class="" style="margin: 16rpx 0;font-size: 26rpx;">
				<text>单位/元</text>
			</view>
			<view class="buy-rank" style="padding: 4rpx 0" v-if="info.buys">
				<block v-for="(item,index) in info.buys" :key="index">
					<view class="flex-row" style="margin: 40rpx 0; font-size: 30rpx;">
						<view class="flex-row flex-1 acp-ellipsis">
							<view class="flex-col" style="width: 33rpx;">
								<text>{{index+1}}</text>
							</view>
							<image :src="item.avatar || avatar" style="width: 64rpx; height: 64rpx; border-radius: 32rpx;margin: 0 20rpx;"></image>
							<view class="">{{item.nickName}}</view>
						</view>
						<view>{{item.goodsNum}}</view>
					</view>
				</block>
			</view>
		</view>
		<uni-keep-float />
	</view>
</template>

<script>
	import {
		statisticsDay,
		statisticsWeek,
		statisticsWeekList,
		statisticsMonth
	} from '@/api/stat.js'
	import {
		getRatio
	} from "@/static/utils/common.js"
	import moment from "moment";
	// console.log(moment(new Date()).format("YYYY年"));
	import uCharts from '@/static/stan-ucharts/u-charts/u-charts.js';
	import uniKeepFloat from "@/components/uni-keep-float/uni-keep-float.vue"
	export default {
		data() {
			return {
				moment,
				avatar: '/static/images/avatar.png',
				current: 1,
				tabList: [{
						name: '日报',
						type: 1
					},
					{
						name: '周报',
						type: 2
					},
					{
						name: '月报',
						type: 3
					}
				],
				weekList: [],
				currentWeek: {

				},
				end: moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
				formData: {
					data: moment(new Date().getTime() - 24 * 60 * 60 * 1000).format("YYYY-MM-DD"),
					month: moment(new Date()).format("YYYY-MM"),
					num: 1,
				},
				info: {},
				pixelRatio: getRatio(),
				rIndex: 0,
				rWidth: '',
				rHeight: '',
				qIndex: 0,
				qWidth: '',
				qHeight: '',
				sWidth: '',
				sHeight: '',
			};
		},
		components: {
			uniKeepFloat
		},
		onLoad() {
			this.getInfo()
			this.getWeekList()
			// console.log(this.pixelRatio)
			this.rWidth = this.pixelRatio * 320;
			this.rHeight = this.pixelRatio * 320;
			this.qWidth = this.pixelRatio * 340;
			this.qHeight = this.pixelRatio * 400;
			this.sWidth = this.pixelRatio * 340;
			this.sHeight = this.pixelRatio * 320;
		},
		methods: {
			toggleType(item) {
				if (this.current !== item.type) {
					this.info = {}
					this.current = item.type
					this.getInfo()
				}
			},
			getWeekList() {
				statisticsWeekList().then(res => {
					const weekList = res.data || [];
					this.weekList = weekList;
					if (res.data.length > 0) {
						this.currentWeek = weekList[weekList.length - 1];
					}
				})
			},
			getInfo() {
				let {
					current,
					formData,
					currentWeek
				} = this, api = undefined, obj = {}
				switch (Number(current)) {
					case 1:
						api = statisticsDay
						obj = {
							data: moment(new Date(formData.data)).format("YYYYMMDD")
						}
						break;
					case 2:
						obj = {
							month: currentWeek.yearMonth || moment(new Date(formData.month + '-01')).format("YYYYMM"),
							num: currentWeek.nameNum || 1,
						}
						api = statisticsWeek
						break;
					case 3:
						obj = {
							data: moment(new Date(formData.month + '-01')).format("YYYYMM")
						}
						api = statisticsMonth
						break;
					default:
						break
				}
				if (api) {
					// console.log(formData)
					api(obj).then(res => {
						this.info = res.data || {};
						this.setRingChart(res.data, 0)
						this.setRingChart(res.data, 1)
						this.setQiunChart(res.data, 0)
						this.setQiunChart(res.data, 1)
						this.setStackChart(res.data)
					})
				}
			},
			bindDateChange(e) {
				let {
					value
				} = e.detail
				// console.log(value)
				switch (Number(this.current)) {
					case 1:
						this.formData.data = value;
						this.getInfo()
						break;
					case 2:
						// console.log(this.weekList[value].isClick)
						this.currentWeek = this.weekList[value];
						this.getInfo()
						break;
					case 3:
						this.formData.month = value;
						this.getInfo()
						break;
					default:
						break
				}
			},
			// 收入、支出统计表
			setRingChart(info = {}, type) {
				const _self = this;
				const series = [{
					name: '记账总额',
					data: type == 0 ? (info.bookkeepingIncomeTotal || 0) : (info.bookkeepingExpendTotal || 0),
					color: '#FFDD79',
				}, {
					name: '订单总额',
					data: type == 0 ? (info.orderIncomeTotal || 0) : (info.orderExpendTotal || 0),
					color: '#FFAE00',
				}]
				this['canvaRing' + type] = new uCharts({
					$this: _self,
					canvasId: 'canvaRing' + type,
					type: 'ring',
					fontSize: 12,
					legend: {
						show: true,
						fontSize: 12 * _self.pixelRatio,
					},
					title: {
						name: type == 0 ? '收入总额' : '支出总额',
						color: '#999',
						fontSize: 12 * _self.pixelRatio,
					},
					subtitle: {
						name: type == 0 ? '¥' + Number(info.incomeTotal || 0).toFixed(2) : '¥' + Number(info.expendTotal || 0).toFixed(
							2),
						color: '#333',
						fontSize: 20 * _self.pixelRatio,
					},
					extra: {
						pie: {
							offsetAngle: -45,
							ringWidth: 30 * _self.pixelRatio,
							lableWidth: 15
						}
					},
					background: '#fff',
					pixelRatio: 1,
					series,
					animation: true,
					width: _self.rWidth,
					height: _self.rHeight,
					disablePieStroke: true,
					dataLabel: true,
				});
			},
			// 支出、收入点击查看
			touchRing(e) {
				let canva = this[e.target.id];
				if (canva) {
					canva.showToolTip(e, {
						format: function(item) {
							return item.name + ':' + item.data
						}
					});
				}
			},
			// 收入、支出切换
			ringChange(e) {
				this.rIndex = e.detail.current
			},
			// 订单、顾客统计表
			setQiunChart(info = {}, type) {
				const _self = this;
				let arr = type == 0 ? info.orderList || [] : info.customerList || [],
					categories = [],
					series = [{
						name: type == 0 ? '订单量' : '顾客量',
						color: '#FFAE00',
						data: []
					}];
				arr.forEach((item, index) => {
					categories.push(item.time);
					series[0].data.push({
						value: item.num
					})
				})
				this['canvaQiun' + type] = new uCharts({
					$this: _self,
					canvasId: 'canvaQiun' + type,
					type: 'column',
					fontSize: 12,
					legend: {
						show: false
					},
					yAxis: {
						disabled: true,
						disableGrid: true
					},
					xAxis: {
						disableGrid: true,
					},
					background: '#FFFFFF',
					pixelRatio: 1,
					categories,
					series,
					animation: true,
					width: _self.qWidth,
					height: _self.qHeight,
					extra: {
						column: {
							type: 'group',
							width: _self.qWidth / categories.length > 20 ? 20 : _self.qWidth / categories.length
						}
					}
				});
			},
			// 订单、顾客切换
			qiunChange(e) {
				this.qIndex = e.detail.current
			},
			// 订单、顾客点击查看
			touchQiun(e) {
				let canva = this[e.target.id];
				if (canva) {
					canva.showToolTip(e, {
						format: function(item) {
							return item.name + ':' + item.data.value
						}
					});
				}
			},
			// 商品排行统计表
			setStackChart(info = {}) {
				const _self = this;
				let arr = info.goods || [],
					categories = [],
					series = [{
						name: '订单',
						color: '#FFAE00',
						data: []
					}, {
						name: '记账',
						color: '#FFD44D',
						data: []
					}];
				arr.forEach((item, index) => {
					categories.push(`No${index+1} ${item.goodsName}`);
					series[0].data.push(item.automaticNum || 0)
					series[1].data.push(item.manualNum || 0)
				})
				console.log(series)
				this.canvaStack = new uCharts({
					$this: _self,
					canvasId: 'canvaStack',
					type: 'column',
					legend: {
						show: false
					},
					rotate: true,
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: 1,
					animation: true,
					categories,
					series,
					xAxis: {
						rotateLabel: true,
						disabled: false,
						disableGrid: true,
					},
					yAxis: {
						disabled: true,
						disableGrid: true
					},
					dataLabel: false,
					width: _self.sWidth * _self.pixelRatio,
					height: _self.sHeight * _self.pixelRatio,
					extra: {
						column: {
							type: 'stack',
							width: _self.sHeight / categories.length > 20 ? 20 : _self.sHeight / categories.length
						}
					}
				});
			},
			touchColumn(e) {
				this.canvaStack.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
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
	page {
		background-color: #fff;
	}

	.stat-screen {
		padding: 86rpx 40rpx 20rpx;

		.tabbar-top {
			position: fixed;
			z-index: 999;
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
				line-height: 42rpx;
				font-size: 30rpx;
				height: 90rpx;

				.line {
					position: absolute;
					z-index: 2;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 103rpx;
					height: 4rpx;
					border-radius: 2rpx;
					background: #EFB600;
				}
			}
		}

		.stat-warp {
			padding: 50rpx 0;

			.select-wrap {
				background-color: #F9F9F9;
				padding: 10rpx 20rpx;
				border-radius: 4rpx;

				.time {
					padding: 0 30rpx 0 10rpx;
					color: #999999;
				}
			}

			.stat-item {
				padding: 26rpx 0;

				.label {
					color: #999;
					margin: 4rpx 0;
				}

				.value {
					font-size: 52rpx;
					line-height: 72rpx;
					font-weight: 500;
					margin: 4rpx 0;

					.sign {
						font-size: 24rpx;
						line-height: 34rpx;
						font-weight: 400;
					}
				}
			}
		}

		.tabs {
			width: 228rpx;
			justify-content: space-between;

			.tab {
				flex: 1;
				font-size: 24rpx;
				line-height: 56rpx;
				text-align: center;
				height: 56rpx;
				background-color: #F9F9F9;
			}
		}
	}
</style>
