<template>
	<view class="stat-goods">
		<view class="table-tl flex-row">
			<text style="width: 50rpx;">排行</text>
			<text class="flex-1">买家</text>
			<text style="width: 50rpx;">总单</text>
		</view>
		<block v-for="(item,index) in list" :key="index">
			<view class="table-dl flex-row">
				<text style="width: 50rpx;">{{index + 1}}</text>
				<view class="user flex-1 flex-row">
					<image :src="item.avatar" class="avatar"></image>
					<text class="name acp-ellipsis">{{item.nickName}}</text>
				</view>
				<text style="width: 50rpx;">{{item.goodsNum || 0}}</text>
				<text v-if="index < list.length - 1" class="table-dl-after"></text>
			</view>
		</block>
		<uni-keep-float />
	</view>
</template>

<script>
	import {
		statisticsBuys
	} from "@/api/stat.js"
	import uniKeepFloat from "@/components/uni-keep-float/uni-keep-float.vue"
	export default {
		data() {
			return {
				queryList: {
					id: undefined,
					page: 1,
					size: 20
				},
				list: []
			};
		},
		components: {
			uniKeepFloat
		},
		onLoad(options) {
			if (options.id) {
				this.queryList.id = options.id;
				this.getList();
			}
		},
		methods: {
			getList() {
				statisticsBuys(this.queryList).then(res => {
					this.list = res.data
				})
			}
		}
	}
</script>

<style lang="scss">
	.stat-goods {
		.table-tl {
			background-color: #F9F9F9;
			text-align: center;
			padding: 20rpx 34rpx;
			color: #999;
		}

		.table-dl {
			background-color: #fff;
			padding: 32rpx 34rpx;
			text-align: center;
			font-size: 28rpx;
			line-height: 40rpx;
			position: relative;

			.user {
				justify-content: center;

				.avatar {
					width: 64rpx;
					height: 64rpx;
					border-radius: 32rpx;
				}
				.name {
					margin: 0 20rpx;
					max-width: 240rpx;
				}
			}
		}

		.table-dl-after {
			position: absolute;
			z-index: 2;
			left: 24rpx;
			right: 24rpx;
			bottom: 0;
			height: 1rpx;
			background-color: #EEE;
		}
	}
</style>
