<template>
	<view class="fixed-btn flex-col" @click="navigateTo('/pages/accKeepCreate/accKeepCreate')">
		<uni-icons type="compose" size="24" color="#fff"></uni-icons>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
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
	.fixed-btn {
		position: fixed;
		right: 38rpx;
		bottom: 148rpx;
		width: 88rpx;
		height: 88rpx;
		border-radius: 44rpx;
		background-color: #FFD44D;
		box-shadow: 0 6rpx 12rpx 0 rgba(255, 212, 77, 0.28);
		z-index: 99;
	}
</style>
