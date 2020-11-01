<template>
	<view class="activity-preview-page" :style="{paddingBottom:showDrawer ? '444rpx' : 0}">
		<view class="header flex-col">
			<text class="title">{{info.describe || '暂无描述'}}</text>
			<text class="tips">仅剩{{info.saleVolume || 0}}单可售</text>
		</view>
		<view class="body">
			<view class="info-card">
				<view class="info-item flex-row border-bottom">
					<text>{{info.name || '暂无名称'}}</text>
					<text>x{{info.num || 0}}</text>
				</view>
				<!-- <view v-if="info.freightPrice" class="info-item flex-row border-bottom">
					<text>邮费</text>
					<text>¥ {{info.freightPrice}}</text>
				</view> -->
				<view class="info-item flex-row">
					<text>总计</text>
					<text>¥ {{(info.price || 0) * (info.num ||  0) + (info.freightPrice || 0)}}</text>
				</view>
			</view>
			<view class="user-card" v-if="info.isShowWx">
				<view class="tips flex-row">
					<text class="dot"></text>
					<text>更多好货，清添加店主微信</text>
					<text class="dot"></text>
				</view>
				<view class="user-info flex-row">
					<image class="avatar" :src="info.avatar || avatar"></image>
					<view class="txt flex-1">
						<view class="name acp-ellipsis">{{info.nickName}}</view>
						<view class="contact">
							<text>{{info.wechatNo || '暂无微信号'}}</text>
							<!-- <uni-icons type="compose" size="12" color="#5D5D5D" style="padding: 0 16rpx;"></uni-icons> -->
						</view>
					</view>
					<text class="edit" @click="navigateTo('/pages/userSetting/userSetting?id=' + id)">修改名片</text>
				</view>
			</view>
			<!-- <view class="btn-bottom flex-col" @click="">
				<text>编辑</text>
			</view> -->
			<view class="btn-group flex-row">
				<view class="btn-left flex-col flex-1" @click="handleUpdate">
					<text>编辑</text>
				</view>
				<view style="width: 34rpx;"></view>
				<view class="btn-right flex-col flex-1" @click="handleCreate">
					<text>发布</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		activityDetail,
		activityCreate,
	} from "@/api/activity.js"
	export default {
		data() {
			return {
				id: undefined,
				info: {},
				showDrawer: true,
				avatar: '/static/images/avatar.png',
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
			}
		},
		onShow() {
			this.id && this.getInfo();
		},
		methods: {
			getInfo() {
				activityDetail({
					id: this.id
				}).then(res => {
					this.info = res.data
					if (res.data.status == 1) {
						uni.redirectTo({
							url: '/pages/activityShare/activityShare?id=' + this.id
						});
					}
				})
			},
			handleUpdate() {
				this.navigateTo('/pages/activityCreate/activityCreate?id=' + this.id)
			},
			// 发布
			handleCreate() {
				const {
					id,
					describe,
					saleVolume,
					name,
					price,
					num,
					freightPrice,
					isShowWx,
				} = this.info
				activityCreate({
					id,
					describe,
					saleVolume,
					name,
					price,
					num,
					freightPrice,
					isShowWx,
				}).then(res => {
					uni.redirectTo({
						url: '/pages/activityShare/activityShare?id=' + res.data
					});
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
			close() {
				this.showDrawer = false;
				this.$refs.popup.close()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.activity-preview-page {
		padding-bottom: 180rpx;

		.header {
			background-color: #FFD44D;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 0 0 40rpx 40rpx;
			padding: 48rpx 24rpx 184rpx;

			.title {
				font-size: 36rpx;
				font-weight: 500;
				line-height: 50rpx;
			}

			.tips {
				font-size: 28rpx;
				line-height: 40rpx;
				margin-top: 24rpx;
			}
		}

		.body {
			margin-top: -150rpx;
			padding: 0 24rpx;

			.info-card {
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.04);
				background-color: #fff;
				border-radius: 10rpx;
				padding: 0 24rpx;
				margin: 24rpx 0;

				.info-item {
					padding: 32rpx 0;
					justify-content: space-between;
					line-height: 42rpx;
					font-size: 30rpx;
				}
			}

			.user-card {
				box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.04);
				background-color: #fff;
				border-radius: 10rpx;
				padding: 1rpx 24rpx;
				margin: 24rpx 0;

				.tips {
					margin: 24rpx 0;
					color: #999;
					line-height: 40rpx;
					font-size: 28rpx;
					justify-content: center;

					.dot {
						width: 8rpx;
						height: 8rpx;
						border-radius: 4rpx;
						background: #D8D8D8;
						margin: 0 24rpx;
					}
				}

				.user-info {
					margin: 24rpx 0 32rpx;

					.avatar {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50rpx;
					}

					.txt {
						overflow: hidden;
						margin: 0 16rpx;

						.name {
							line-height: 42rpx;
							font-size: 30rpx;
							font-weight: 500;
							margin: 8rpx 0;
						}

						.contact {
							line-height: 34rpx;
							font-size: 24rpx;
							color: #999;
							margin: 8rpx 0;

							.copy {
								font-size: 16rpx;
								margin: 0 16rpx;
							}
						}
					}

					.edit {
						align-self: flex-end;
						color: #EFB600;
						line-height: 34rpx;
					}
				}
			}
		}

		.footer-wrap {
			position: relative;
			background-color: #fff;
			padding: 32rpx 24rpx;
			font-size: 36rpx;
			line-height: 50rpx;
			height: 380rpx;
			overflow: hidden;

			.close {
				position: absolute;
				z-index: 2;
				top: 24rpx;
				right: 16rpx;
			}

			.btn-group {
				justify-content: space-around;
				padding: 56rpx 80rpx;

				.icon-box {
					width: 82rpx;
					height: 82rpx;
					margin: 8rpx 0;

					.icon {
						width: 82rpx;
						max-height: 82rpx;
					}
				}

				.txt {
					font-size: 28rpx;
					line-height: 40rpx;
					color: #333;
				}
			}
		}

		button {
			padding: 0;
			margin: 0;
			background-color: unset;
		}

		.btn-group {
			position: fixed;
			bottom: 60rpx;
			left: 24rpx;
			right: 24rpx;

			.btn-left {
				height: 90rpx;
				background: #FFFFFF;
				box-shadow: 0 6rpx 12rpx 0 rgba(0, 0, 0, 0.04);
				border-radius: 45rpx;
				font-size: 30rpx;
				line-height: 42rpx;
			}

			.btn-right {
				height: 90rpx;
				background: #FFD44D;
				box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
				border-radius: 45px;
				font-size: 30rpx;
				line-height: 42rpx;
			}
		}
	}
</style>
