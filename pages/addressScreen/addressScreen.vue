<template>
	<view class="address-screen-page">
		<view class="address-weixin flex-row" @click="addressWx">
			<uni-icons type="weixin" size="20" color="#19AD19" style="margin-left: -2rpx;"></uni-icons>
			<text class="value">获取微信收货地址</text>
			<uni-icons type="arrowright" size="16" color="#33" style="margin-right: -8rpx;"></uni-icons>
		</view>
		<view class="address-card">
			<block v-for="(item,index) in list" :key="index">
				<view class="address-item flex-row" @click="select(item)" :style="{ borderBottom: index == list.length - 1 ? 'none':'' }">
					<uni-icons v-if="current == item.id" type="checkbox-filled" size="20" color="#FFD44D"></uni-icons>
					<uni-icons v-else type="circle" size="20" color="#ddd"></uni-icons>
					<view class="address-info flex-1">
						<view class="user flex-row">
							<text class="name acp-ellipsis">{{item.userName}}</text>
							<text class="phone">{{item.telNumber}}</text>
						</view>
						<view class="address acp-ellipsis-l2">收货地址：{{item.provinceName}}{{item.cityName}}{{item.countyName}}{{item.detailInfo}}</view>
					</view>
					<view @click.stop="navigateTo('/pages/addressCreate/addressCreate?id=' + item.id)">
						<uni-icons type="compose" size="20" color="#5E5E5E" style="margin-right: -4rpx;"></uni-icons>
					</view>
				</view>
			</block>
		</view>
		<view v-if="list.length <= 10" class="btn-bottom flex-col" @click="navigateTo('/pages/addressCreate/addressCreate')">
			<text>新增收货地址</text>
		</view>
	</view>
</template>

<script>
	import {
		addressList
	} from "@/api/address.js"
	export default {
		data() {
			return {
				current: undefined,
				queryList: {
					page: 1,
					size: 10,
					// isDefault: ''
				},
				isLoading: false,
				list: [],
				finish: false
			};
		},
		onShow() {
			this.getList()
		},
		methods: {
			// 地址列表
			getList() {
				try {
					this.list = uni.getStorageSync('addressList') || [];
				} catch (e) {}
			},
			select(item) {
				this.current = item.id
				this.navigateBack(item)
			},
			addressWx() {
				const _this = this;
				uni.chooseAddress({
					success(res) {
						_this.navigateBack(res)
					}
				})
			},
			navigateBack(data) {
				let pages = getCurrentPages();
				const prevPage = pages[pages.length - 2]
				prevPage.setData({
					addressInfo: data
				})
				uni.navigateBack({
					delta: 1
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
			},
		}
	}
</script>

<style lang="scss" scoped>
	.address-screen-page {
		padding: 1rpx 24rpx 180rpx;

		.address-weixin {
			margin: 24rpx 0;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 32rpx 22rpx 34rpx;

			.value {
				margin: 0 18rpx;
				flex: 1;
				font-size: 30rpx;
				line-height: 42rpx;
			}
		}

		.address-card {
			margin: 24rpx 0;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 0 22rpx;

			.address-item {
				border-bottom: solid 2rpx #EEEEEE;
				font-size: 30rpx;
				line-height: 42rpx;
				padding: 32rpx 0;

				.address-info {
					margin: 0 24rpx;
					overflow: hidden;
					font-size: 30rpx;
					line-height: 42rpx;

					.user {
						margin: 4rpx 0;
						align-items: flex-end;

						.name {
							max-width: 65%;
						}

						.phone {
							font-size: 24rpx;
							line-height: 34rpx;
							margin: 0 16rpx;
						}
					}

					.address {
						margin: 4rpx 0;
						font-size: 24rpx;
						line-height: 34rpx;
						color: #999;
					}
				}
			}
		}

		.btn-bottom {
			position: fixed;
			bottom: 60rpx;
			left: 24rpx;
			right: 24rpx;
			height: 90rpx;
			background: #FFD44D;
			box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
			border-radius: 45rpx;
			font-size: 30rpx;
			line-height: 42rpx;
		}
	}
</style>
