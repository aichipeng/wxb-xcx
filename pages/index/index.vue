<template>
	<view class="index-page">
		<view class="header-card" @click="navigateTo('/pages/orderScreen/orderScreen')">
			<view class="user-info flex-row">
				<block v-if="token">
					<image class="avatar" :src="userInfo.avatar || avatar" @click.stop="navigateTo('/pages/userScreen/userScreen')"></image>
					<text class="nick-name acp-ellipsis flex-1">{{userInfo.nickName}}</text>
				</block>
				<view v-else class="flex-row flex-1" @click.stop="$refs.popup.open()">
					<image class="avatar" src="/static/images/avatar.png"></image>
					<text class="nick-name acp-ellipsis flex-1">未授权</text>
				</view>
				<view class="assets">
					<view class="assets-bg"></view>
					<view class="assets-wrap flex-row" @click.stop="navigateTo('/pages/cashScreen/cashScreen')">
						<view class="flex-col">
							<text class="amount acp-ellipsis">
								<text style="font-size: 20rpx;font-weight: 400;">￥</text>
								<text>{{Number(account.usable || 0).toFixed(2)}}</text>
							</text>
							<text style="font-size: 20rpx;line-height: 28rpx;">可提现金额</text>
						</view>
						<uni-icons type="arrowright" size="14" color="#333" style="margin-left: 12rpx;"></uni-icons>
					</view>
				</view>
			</view>
			<view class="count-info flex-row">
				<view class="count-item flex-col">
					<text class="num acp-ellipsis">
						<text style="font-size: 24rpx;font-weight: 400;">￥</text>
						<text>{{Number(todayTotal.revenue || 0).toFixed(2)}}</text>
					</text>
					<text class="txt">今日营收</text>
				</view>
				<view class="count-item flex-col">
					<text class="num">{{todayTotal.orderNum || 0}}</text>
					<text class="txt">订单</text>
				</view>
				<view class="count-item flex-col">
					<text class="num">{{todayTotal.customer || 0}}</text>
					<text class="txt">顾客</text>
				</view>
			</view>
		</view>
		<view class="rank-card">
			<view class="rank-header flex-row">
				<view class="header-tab flex-row">
					<text class="tab" @click="current = 0" :style="{ color: current == 0 ? '#fff' : '#999', backgroundColor: current == 0 ? '#FFD44D' : '#F7F7F7'}">累计</text>
					<text class="tab" @click="current = 1" :style="{ color: current == 1 ? '#fff' : '#999', backgroundColor: current == 1 ? '#FFD44D' : '#F7F7F7' }">今日</text>
				</view>
				<text style="font-size: 36rpx; line-height: 50rpx;">销量TOP</text>
				<view class="more">
					<text @click="navigateTo('/pages/statScreen/statScreen')">更多数据 ></text>
				</view>
			</view>
			<swiper class="rank-body" :current="current" @change="changeCurret" style="height: 160rpx;">
				<swiper-item class="flex-row" style="padding-right: 20rpx; box-sizing: border-box;">
					<block v-if="totalTop.length > 0">
						<view class="swiper-item flex-1" v-for="(item,index) in totalTop" :key="index">
							<image v-if="index == 0" class="badge" src="@/static/images/No1.png"></image>
							<view class="rank-wrap flex-row flex-1">
								<text class="index">{{index + 1}}</text>
								<view class="flex-1" style="margin-left: 20rpx;overflow: hidden;">
									<view class="name acp-ellipsis">{{item.goodsName}}</view>
									<view class="num acp-ellipsis">{{item.automaticNum}}</view>
								</view>
							</view>
						</view>
					</block>
					<view v-else class="flex-1 flex-col">
						<text style="font-size: 30rpx; line-height: 42rpx;">~暂无排行数据~</text>
					</view>
				</swiper-item>
				<swiper-item class="flex-row" style="padding-right: 20rpx; box-sizing: border-box;">
					<block v-if="totalTop.length > 0">
						<view class="swiper-item flex-1" v-for="(item,index) in todayTop" :key="index">
							<image v-if="index == 0" class="badge" src="@/static/images/No1.png"></image>
							<view class="rank-wrap flex-row flex-1">
								<text class="index">{{index + 1}}</text>
								<view class="flex-1 acp-ellipsis" style="margin: 0 20rpx;overflow: hidden;">
									<view class="name acp-ellipsis">{{item.goodsName}}</view>
									<view class="num acp-ellipsis">{{item.automaticNum}}</view>
								</view>
							</view>
						</view>
					</block>
					<view v-else class="flex-1 flex-col">
						<text style="font-size: 30rpx; line-height: 42rpx;">~暂无排行数据~</text>
					</view>
				</swiper-item>
			</swiper>
			<view class="rank-footer flex-col">
				<view class="flex-row">
					<text class="page-sign" @click="current = 0" :style="current == 0 ? 'background-color: #EFB600' : 'background-color:#ddd'"></text>
					<text class="page-sign" @click="current = 1" :style="current == 1 ? 'background-color: #EFB600' : 'background-color:#ddd'"></text>
				</view>
			</view>
		</view>
		<view class="nav-list flex-row">
			<view class="nav-item flex-row flex-1" @click="navigateTo('/pages/activityCreate/activityCreate')">
				<view class="icon-box flex-row">
					<image src="@/static/images/nav-index-1.png" style="width: 48rpx; height: 48rpx"></image>
				</view>
				<text class="txt flex-1 acp-ellipsis">多人收款</text>
				<uni-icons type="arrowright" size="14" color="#BBB" style="margin-right: -8rpx;"></uni-icons>
			</view>
			<view style="width: 18rpx;"></view>
			<view class="nav-item flex-row flex-1" @click="navigateTo('/pages/accountKeep/accountKeep')">
				<view class="icon-box flex-row">
					<image src="@/static/images/nav-index-2.png" style="width: 46rpx; height: 48rpx"></image>
				</view>
				<text class="txt flex-1 acp-ellipsis">记账</text>
				<uni-icons type="arrowright" size="14" color="#BBB" style="margin-right: -8rpx;"></uni-icons>
			</view>
		</view>
		<!-- <view class="record-list" v-if='list && list.length > 0'> -->
		<view class="record-list">
			<view class="record-title flex-row">
				<view class="title">
					<text>待发货活动</text>
					<view class="title-line"></view>
				</view>
				<view class="more flex-row" @click="navigateTo('/pages/activityScreen/activityScreen')">
					<text>查看全部</text>
					<uni-icons type="arrowright" size="12" color="#333" style="transform: translate(8rpx, 2rpx);"></uni-icons>
				</view>
			</view>
			<block v-if="list.length > 0">
				<view class="record-item" v-for="(item,index) in list" :key="index">
					<uni-record-item :item="{...item}"></uni-record-item>
				</view>
			</block>
			<view v-else class="flex-col" style="height: 300rpx; font-size: 30rpx; line-height: 42rpx;">
				<text>~暂无待发货活动~</text>
			</view>
		</view>
		<uni-auth ref="popup" @refresh="onRefresh"></uni-auth>
		<uni-popup ref="bind" type="bottom">
			<view class="bind-wrap">
				<button class="phone-btn" open-type="getPhoneNumber" @getphonenumber="decryptPhoneNumber">绑定手机号</button>
			</view>
		</uni-popup>
		<uni-popup ref="mask" type="center" :maskClick="false">
			<view class="mask-wrap">
				<block v-if="step == 1">
					<view style="margin-top: 74rpx">
						<image src="../../static/images/jt-1.png" style="width: 128rpx; height: 108rpx;margin-left: 359rpx;"></image>
						<view style="margin-top: 7rpx; margin-left: 109rpx;">这里可以将赚到的钱提现到自己的账户</view>
					</view>
					<view style="margin-top: 94rpx">
						<image src="../../static/images/jt-3.png" style="width: 123rpx; height: 115rpx;margin-left: 94rpx"></image>
						<view style="margin-top: 6rpx; margin-left: 201rpx;">这里显示今日营收总额和订单数</view>
					</view>
					<view style="margin-top: 100rpx">
						<image src="../../static/images/jt-2.png" style="width: 109rpx; height: 127rpx;"></image>
						<view style="margin-right: 94rpx; margin-top: 28rpx;">这里显示数据分析，可以看到卖的最好的单品和买的最多的人</view>
					</view>
					<view class="flex-col next-btn" @click="handleNext">
						<text>下一步</text>
					</view>
				</block>
				<block v-if="step == 2">
					<view class="flex-row" style="margin-top: 440rpx;">
						<view>
							<view style="margin-left: 6rpx;margin-bottom: 22rpx;">这里可以发布收款活动</view>
							<image src="../../static/images/jt-4.png" style="width: 83rpx; height: 79rpx;margin-left: -14rpx;"></image>
						</view>
						<view style="width: 80rpx;"></view>
						<view>
							<view style="margin-left: 6rpx;margin-bottom: 22rpx;">这里可以手动记账</view>
							<image src="../../static/images/jt-4.png" style="width: 83rpx; height: 79rpx;margin-left: -14rpx;"></image>
						</view>
					</view>
					<view style="margin-top: 158rpx;">
						<view style="margin-left: 6rpx; margin-bottom: 22rpx;">这里可以查看需要发货的订单</view>
						<image src="../../static/images/jt-4.png" style="width: 83rpx; height: 79rpx;margin-left: -14rpx;"></image>
					</view>
					<view class="flex-col next-btn" @click="handleOver" style="margin-top: 170rpx;">
						<text>结束引导</text>
					</view>
				</block>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		accountDetail,
		todayTop,
		todayTotal,
		totalTop
	} from '@/api/account.js'
	import {
		activityIndex
	} from '@/api/activity.js'
	import {
		userInfo,
		wxBindPhone
	} from '@/api/user.js'
	import uniRecordItem from "@/components/uni-record-item/uni-record-item.vue"
	import uniAuth from "@/components/uni-auth/uni-auth.vue"
	export default {
		name: 'Index',
		components: {
			uniRecordItem,
			uniAuth
		},
		data() {
			return {
				token: undefined,
				avatar: '/static/images/avatar.png',
				userInfo: {},
				account: {},
				todayTop: [],
				totalTop: [],
				current: 0,
				todayTotal: {},
				queryList: {
					page: 1,
					size: 10,
					// status: 1
				},
				isLoading: false,
				list: [],
				finish: false,
				step: 1
			}
		},
		onLoad() {
			this.token = uni.getStorageSync('token');
			this.init()
		},
		onShow() {
			const pages = getCurrentPages()
			const currPage = pages[pages.length - 1]
			// console.log(currPage)
			if (currPage && currPage.data && currPage.data.refresh) {
				this.onRefresh();
				// #ifdef MP-WEIXIN
				currPage.setData({
					refresh: false
				})
				// #endif
			}
		},
		onReady() {
			if (!this.token) {
				this.$refs.popup && this.$refs.popup.open()
			} else {
				const notFirst = uni.getStorageSync('notFirst')
				if (!notFirst) {
					this.$refs.mask && this.$refs.mask.open()
				}
			}
		},
		onPullDownRefresh() {
			this.onRefresh()
		},
		onReachBottom() {
			if (!this.finish && !this.isLoading && this.token) {
				this.isLoading = true
				this.queryList.page++;
				this.getActivity()
			}
		},
		methods: {
			init() {
				if (this.token) {
					this.getAccount()
					this.getActivity()
					this.getUserInfo()
				} else {
					this.$refs.popup && this.$refs.popup.open()
					uni.stopPullDownRefresh();
				}
			},
			onRefresh() {
				const token = uni.getStorageSync('token');
				this.token = token
				this.userInfo = {};
				this.account = {};
				this.todayTop = [];
				this.totalTop = [];
				this.todayTotal = {};
				this.queryList.page = 1;
				this.list = [];
				this.init();
				const notFirst = uni.getStorageSync('notFirst')
				if (!notFirst && token) {
					this.step = 1
					this.$refs.mask && this.$refs.mask.open()
				}
			},
			// 用户信息
			getUserInfo() {
				userInfo().then(res => {
					this.userInfo = res.data;
					// console.log(res)
					const notFirst = uni.getStorageSync('notFirst')
					if (!res.data.mobile && notFirst) {
						this.$refs.bind && this.$refs.bind.open()
					}
				})
			},
			// 资产统计相关信息
			getAccount() {
				// 总资产
				accountDetail().then(res => {
					this.account = res.data
				})
				// 今天统计
				todayTotal().then(res => {
					this.todayTotal = res.data
				})
				// 今日top
				todayTop().then(res => {
					this.todayTop = res.data
				})
				// 累计top
				totalTop().then(res => {
					this.totalTop = res.data
				})
			},
			// 活动列表
			getActivity() {
				activityIndex(this.queryList).then(res => {
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
			changeCurret(e) {
				this.current = e.detail.current
			},
			// 绑定手机号
			decryptPhoneNumber(e) {
				// console.log(e.detail)
				this.$refs.bind && this.$refs.bind.close()
				if (e.detail.encryptedData) {
					wxBindPhone(e.detail).then(res => {
						uni.showToast({
							title: '绑定成功！',
							icon: 'none',
							mask: true
						})
						this.getUserInfo()
					})
				}
			},
			handleNext() {
				uni.pageScrollTo({
					scrollTop: 100,
					duration: 300
				});
				this.step = 2
			},
			handleOver() {
				uni.setStorageSync('notFirst', true);
				this.$refs.mask && this.$refs.mask.close()
				if (!this.userInfo.mobile) {
					this.$refs.bind && this.$refs.bind.open()
				}
			},
			navigateTo(url) {
				if (this.token) {
					uni.navigateTo({
						url,
						fail: err => {
							uni.switchTab({
								url,
							});
						}
					});
				} else {
					this.$refs.popup && this.$refs.popup.open()
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.index-page {
		padding: 4rpx 24rpx;

		.header-card {
			margin: 28rpx 0 40rpx;
			padding: 10rpx 40rpx 30rpx;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;

			button {
				padding: 0;
				margin: 0;
				background-color: unset;
				line-height: normal;
				text-align: left;
			}

			.user-info {
				padding: 30rpx 0;

				.avatar {
					width: 90rpx;
					height: 90rpx;
					border-radius: 45rpx;
				}

				.nick-name {
					font-weight: 500;
					line-height: 42rpx;
					font-size: 30rpx;
					margin: 0 24rpx;
				}

				.assets {
					position: relative;

					.assets-bg {
						position: relative;
						transform: translateX(50rpx);
						background-color: #FFD44D;
						z-index: 1;
						width: 222rpx;
						height: 90rpx;
						box-shadow: 0 4rpx 12rpx 0 rgba(248, 210, 90, 0.29);
						border-radius: 45rpx 0 0 45rpx;
					}

					.assets-wrap {
						position: absolute;
						z-index: 2;
						right: -44rpx;
						top: 50%;
						transform: translateY(-50%);

						.amount {
							font-size: 28rpx;
							font-weight: 500;
							line-height: 40rpx;
							max-width: 160rpx;
						}
					}
				}
			}

			.count-info {
				padding: 30rpx 0;
				justify-content: space-around;

				.count-item {
					width: 30%;
					overflow: hidden;

					.num {
						font-size: 36rpx;
						font-weight: 500;
						line-height: 34rpx;
						max-width: 100%;
					}

					.txt {
						font-size: 24rpx;
						line-height: 34rpx;
						margin: 8rpx 0 0;
					}
				}
			}
		}

		.rank-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 40rpx 42rpx;
			margin: 40rpx 0;

			.rank-header {
				padding: 20rpx 0;
				justify-content: space-between;
				font-size: 30rpx;
				line-height: 42rpx;

				.header-tab {
					width: 170rpx;
					justify-content: space-between;

					.tab {
						flex: 1;
						font-size: 28rpx;
						line-height: 48rpx;
						text-align: center;
						height: 48rpx;
					}
				}

				.more {
					font-size: 24rpx;
					line-height: 34rpx;
					color: #999;
					width: 170rpx;
					text-align: right;
				}
			}

			.rank-body {
				.swiper-item {
					position: relative;
					overflow: hidden;
					padding: 30rpx 0rpx 30rpx 20rpx;
					box-sizing: border-box;
					width: 100%;
					height: 100%;

					.badge {
						position: absolute;
						width: 70rpx;
						height: 50rpx;
						left: 0rpx;
						top: 6rpx;
					}

					.rank-wrap {
						justify-content: center;
						overflow: hidden;

						.index {
							width: 68rpx;
							height: 68rpx;
							line-height: 68rpx;
							border-radius: 34rpx;
							text-align: center;
							background-color: #F9F9F9;
							font-weight: 500;
						}

						.name {
							font-size: 24rpx;
							line-height: 36rpx;
							color: #000;
						}

						.num {
							font-size: 24rpx;
							line-height: 36rpx;
							color: #333;
						}
					}
				}
			}

			.rank-footer {
				justify-content: space-between;
				// padding: 20rpx 0;

				.page-sign {
					width: 28rpx;
					height: 4rpx;
					margin: 0 4rpx;
				}
			}
		}

		.nav-list {
			margin: 40rpx 0;

			.nav-item {
				background-color: #fff;
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
				border-radius: 10rpx;
				padding: 40rpx 18rpx 40rpx 40rpx;

				.icon-box {
					width: 48rpx;
					height: 48rpx;
					justify-content: center;
					// margin: 0 12rpx;
				}

				.txt {
					font-size: 30rpx;
					line-height: 42rpx;
					color: #000;
					margin: 0 20rpx;
				}
			}
		}

		.record-list {
			margin: 80rpx 0 24rpx;
			min-height: 400rpx;

			.record-title {
				justify-content: space-between;

				.title {
					position: relative;
					font-size: 36rpx;
					line-height: 50rpx;
					font-weight: 500;
					background-color: unset;
					padding-bottom: 8rpx;

					.title-line {
						position: absolute;
						z-index: 1;
						bottom: 2rpx;
						left: 0;
						width: 72rpx;
						height: 10rpx;
						background-color: #EFB600;
						opacity: 0.3;
					}
				}

				.more {
					font-size: 30rpx;
					line-height: 42rpx;
				}
			}
		}

		.bind-wrap {
			padding: 20rpx 80rpx;
			border-radius: 20rpx 20rpx 0 0;
			background-color: #fff;

			.phone-btn {
				background: #FFD44D;
				height: 90rpx;
				margin: 30rpx 0;
				text-align: center;
				font-size: 30rpx;
				line-height: 90rpx;
				border-radius: 10rpx;
			}
		}

		.mask-wrap {
			position: fixed;
			top: 0;
			/* #ifdef H5 */
			top: 88rpx;
			/* #endif */
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 11;
			color: #fff;
			font-size: 29rpx;
			line-height: 40rpx;
			padding: 0 52rpx;

			.next-btn {
				width: 292rpx;
				height: 88rpx;
				background: #FFFFFF;
				border-radius: 44rpx;
				margin: 80rpx auto 0;
				font-size: 30rpx;
				line-height: 42rpx;
				font-weight: 500;
				color: #333;
			}
		}
	}
</style>
