<template>
	<view class="stat-goods">
		<view class="table-tl flex-row">
			<text style="flex: 1;">排行</text>
			<text style="flex: 2;">商品</text>
			<text style="flex: 1;">总件</text>
			<text style="flex: 1;">订单</text>
			<text style="flex: 1;">记账</text>
		</view>
		<block v-for="(item,index) in list" :key="index">
			<view class="table-dl flex-row">
				<text style="flex: 1;">{{index + 1}}</text>
				<text class="acp-ellipsis" style="flex: 2;">{{item.goodsName}}</text>
				<text style="flex: 1;">{{(item.goodsNum || 0) + (item.manualNum || 0)}}</text>
				<text style="flex: 1;">{{item.goodsNum || 0}}</text>
				<text style="flex: 1;">{{item.manualNum || 0}}</text>
				<text v-if="index < list.length - 1" class="table-dl-after"></text>
			</view>
		</block>
		<uni-keep-float />
	</view>
</template>

<script>
	import {
		statisticsGoods
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
				statisticsGoods(this.queryList).then(res => {
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
			padding: 20rpx 0;
			color: #999;
		}

		.table-dl {
			background-color: #fff;
			padding: 32rpx 0;
			text-align: center;
			font-size: 28rpx;
			line-height: 40rpx;
			position: relative;
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
