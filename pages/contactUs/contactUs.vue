<template>
	<view class="contact-us-screen">
		<view class="form-card">
			<view class="title">文本介绍</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		methods: {
		
		}
	}
</script>

<style lang="scss">
	.contact-us-screen {
		padding: 16rpx 24rpx;

		.form-card {
			background: #FFFFFF;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 10rpx;
			padding: 40rpx;
			height: 920rpx;
			box-sizing: border-box;

			.title {
				font-size: 36rpx;
				line-height: 50rpx;
				text-align: center;
			}
		}
	}
</style>
