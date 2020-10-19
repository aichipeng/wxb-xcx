<template>
	<view class="user-setting-page">
		<view class="cell-group">
			<view class="cell-item flex-row">
				<text class="label">头像</text>
				<!-- <view class="value flex-row" @click="handleImage"> -->
				<view class="value flex-row">
					<image class="avatar" :src="formData.avatar || avatar"></image>
					<!-- <text v-else style="color: #999;">请上传头像</text> -->
					<uni-icons type="arrowright" size="16" color="#999" style="margin-right: -8rpx; margin-left: 4rpx;"></uni-icons>
				</view>
			</view>
			<view class="cell-item flex-row">
				<text class="label">昵称</text>
				<view class="value flex-1">{{formData.nickName}}</view>
				<!-- <input class="value flex-1" v-model="formData.nickName" type="text" placeholder="请输入新昵称" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" /> -->
			</view>
			<view class="cell-item flex-row" style="border-bottom: none;">
				<text class="label">微信号</text>
				<input class="value flex-1" v-model="formData.wechatNo" type="text" placeholder="请输入微信号" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
		</view>
		<view class="bottom-btn flex-col" @click="handleSumit">
			<text>保存</text>
		</view>
	</view>
</template>

<script>
	import {
		activityDetail,
		updateWxNo
	} from "@/api/activity.js"
	import {
		BASE_URL
	} from "@/api/request.js"
	export default {
		data() {
			return {
				formData: {},
				avatar: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2476878483,4014399276&fm=26&gp=0.jpg',
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.getInfo()
			}
		},
		methods: {
			getInfo() {
				activityDetail({
					id: this.id
				}).then(res => {
					this.formData = res.data
				})
			},
			handleImage() {
				const _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: function(res) {
						console.log(res.tempFilePaths);
						uni.uploadFile({
							url: `${BASE_URL}/storage/upload`, //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							name: 'file',
							success: (res) => {
								const data = JSON.parse(res.data)
								console.log(data.data.url);
								if (data.errno == 0) {
									_this.formData.avatar = data.data.url
								}
							}
						});
					}
				});
			},
			handleSumit() {
				const {
					id,
					wechatNo
				} = this.formData;
				updateWxNo({
					id,
					wechatNo
				}).then(res => {
					uni.showToast({
						title: '修改成功',
						icon: 'none',
						mask: true
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 500)
				})
			}
		}
	}
</script>

<style lang="scss">
	.user-setting-page {
		padding: 1rpx 24rpx 180rpx;

		.cell-group {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 0 16rpx;
			margin: 15rpx 0 24rpx;

			.cell-item {
				justify-content: space-between;
				border-bottom: solid 2rpx #EEEEEE;
				font-size: 30rpx;
				line-height: 42rpx;
				padding: 32rpx 0;

				.label {}

				.value {
					text-align: right;
					max-width: 70%;

					.avatar {
						height: 80rpx;
						width: 80rpx;
						border-radius: 40rpx;
					}

					.circle-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 18rpx;
						color: #fff;
						background-color: #FFD44D;
						line-height: 30rpx;
					}
				}
			}
		}

		.bottom-btn {
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
