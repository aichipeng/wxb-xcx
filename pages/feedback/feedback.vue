<template>
	<view class="feedback-screen">
		<view class="form-card">
			<view class="title">问题说明</view>
			<textarea class="content" v-model="formData.content" placeholder="请描述您的吐槽点或者建议吧～" />
			<view class="img-group flex-row">
				<block v-for="(item,index) in formData.picUrls" :key="index">
					<image class="img-item" :src="item"></image>
				</block>
				<image v-if="formData.picUrls.length < 4" style="border: 1rpx dashed #999;" class="img-item" src="@/static/images/upload.png" @click="uploadImg"></image>
			</view>
			<view class="submit-btn flex-col" @click="handleSumbit">
				<text>提交</text>
			</view>
			<view class="tips-wrap">
				<view class="">温馨提示：</view>
				<view style="color: #999;margin-top: 16rpx;">您的反馈只是作为产品的改进与建议，若有问题需要咨询或解决，请联系小程序客服，谢谢！</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		feedbackSubmit
	} from "@/api/user.js"
	import {
		BASE_URL
	} from "@/api/request.js"
	export default {
		data() {
			return {
				formData: {
					content: undefined,
					mobile: undefined,
					hasPicture: false,
					picUrls: [],
					type: undefined
				}
			};
		},
		methods: {
			uploadImg() {
				const { formData } = this;
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
								if (data.errno == 0) {
									formData.picUrls.push(data.data.url)
								}
							}
						});
					}
				});
			},
			handleSumbit() {
				const { formData } = this;
				formData.hasPicture = formData.picUrls.length > 0
				feedbackSubmit(formData).then(res => {
					uni.showToast({
						title: '反馈成功',
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
	.feedback-screen {
		padding: 16rpx 24rpx;
		.form-card {
			background: #FFFFFF;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 10rpx;
			padding: 40rpx;
			.title {
				font-size: 36rpx;
				line-height: 50rpx;
			}
			.content {
				background-color: #F9F9F9;
				margin: 34rpx 0 30rpx;
				padding: 24rpx;
				width: 100%;
				box-sizing: border-box;
				height: 240rpx;
			}
			.img-group {
				flex-wrap: wrap;
				.img-item {
					width: 100rpx;
					height: 100rpx;
					display: block;
					margin: 0 20rpx 20rpx 0;
				}
			}
			.submit-btn {
				height: 90rpx;
				border-radius: 45px;
				background: #FFD44D;
				box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.2);
				font-size: 30rpx;
				line-height: 42rpx;
				margin-top: 80rpx;
			}
			
			.tips-wrap {
				margin-top: 60rpx;
			}
		}
	}
</style>
