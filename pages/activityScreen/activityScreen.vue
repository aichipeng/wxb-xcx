<template>
	<view class="activity-screen-page">
		<view class="tabbar-top flex-row">
			<block v-for="(item,index) in tabList" :key="index">
				<view class="tab-wrap flex-col flex-1" @click="toggleType(item)">
					<text :style="{color: queryList.status === item.type ? '#333' : '#999'}">{{item.name}}</text>
					<view v-if="queryList.status === item.type" class="line"></view>
				</view>
			</block>
		</view>
		<block class="record-item" v-for="(item,index) in list" :key="index">
			<uni-record-item :item="{...item}"></uni-record-item>
		</block>
	</view>
</template>

<script>
	import {
		activityIndex
	} from "@/api/activity.js"
	import uniRecordItem from "@/components/uni-record-item/uni-record-item.vue"
	export default {
		data() {
			return {
				tabList: [{
						name: '全部活动',
						type: ''
					},
					{
						name: '待发布',
						type: 0
					},
					{
						name: '进行中',
						type: 1
					},
					{
						name: '已结束',
						type: 2
					}
				],
				queryList: {
					page: 1,
					size: 10,
					status: ''
				},
				isLoading: false,
				list: [],
				finish: false
			};
		},
		components: {
			uniRecordItem,
		},
		created() {
			this.getList()
		},
		onPullDownRefresh() {
			this.list = [];
			this.queryList.page = 1;
			this.getList()
		},
		onReachBottom() {
			if (!this.finish && !this.isLoading) {
				this.isLoading = true
				this.queryList.page++;
				this.getList()
			}
		},
		methods: {
			// 活动列表
			getList() {
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
			toggleType(item) {
				if (this.queryList.status !== item.type) {
					this.queryList.status = item.type
					this.queryList.page = 1
					this.list = [];
					this.getList()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.activity-screen-page {
		padding: 86rpx 24rpx 20rpx;

		.tabbar-top {
			position: fixed;
			z-index: 99;
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
					bottom: 4rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 40rpx;
					height: 6rpx;
					background: #EFB600;
				}
			}
		}
	}
</style>
