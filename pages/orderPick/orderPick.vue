<template>
	<view class="activity-pick">
		<view class="form-card">
			<view class="form-item flex-row border-bottom">
				<text class="label">取件时间</text>
				<picker mode="date" :value="getDate(formData.time, '-')" @change="bindDateChange">
					<view class="flex-row">
						<view class="add-time">{{getDate(formData.time, '.')}}</view>
						<uni-icons type="arrowright" size="16" color="#5D5D5D" style="margin-right: -6rpx;"></uni-icons>
					</view>
				</picker>
			</view>
			<view class="form-item flex-row border-bottom">
				<text class="label">取件地址</text>
				<view class="value flex-1 flex-row">
					<input class="value flex-1" v-model="formData.address" type="text" placeholder="选择取件地址" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
					<uni-icons type="location-filled" size="20" color="#5D5D5D" style="margin-right: -6rpx;"></uni-icons>
				</view>
			</view>
			<view class="form-item flex-row border-bottom">
				<text class="label">联系人</text>
				<input class="value flex-1" v-model="formData.nickName" type="text" placeholder="请输入联系人" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
			<view class="form-item flex-row">
				<text class="label">联系电话</text>
				<input class="value flex-1" v-model="formData.mobile" type="number" maxlength="11" placeholder="请输入联系电话"
				 placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
		</view>
		<view class="btn-bottom flex-col" @click="submit">
			<text>确认预约</text>
		</view>
	</view>
</template>

<script>
	import {
		userInfo,
	} from "@/api/user.js"
	export default {
		data() {
			return {
				formData: {
					time: new Date(),
					mobile: '',
					nickName: '',
					address: ''
				}
			}
		},
		onLoad() {
			this.getInfo()
		},
		methods: {
			getInfo() {
				userInfo().then(res => {
					this.formData.mobile = res.data.mobile
					this.formData.nickName = res.data.nickName
				})
			},
			bindDateChange(e) {
				let {
					value
				} = e.detail
				this.formData.time = new Date(value)
			},
			getDate(date, type) {
				// console.log(date)
				if (date instanceof Date) {
					let y = date.getFullYear()
					let m = date.getMonth() + 1;
					m = m > 9 ? m : '0' + m
					let d = date.getDate();
					d = d > 9 ? d : '0' + d
					if (!type) {
						return `${y}年${m}月${d}日`
					} else {
						return `${y}${type}${m}${type}${d}`
					}
				} else {
					return date
				}
			},
			submit() {
				console.log(this.formData)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.activity-pick {
		padding: 16rpx 24rpx 180rpx;

		.form-card {
			background-color: #fff;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 10rpx;
			padding: 0 41rpx;
			font-size: 30rpx;
			line-height: 42rpx;

			.form-item {
				padding: 41rpx 0;
				justify-content: space-between;

				.label {
					font-size: 30rpx;
					line-height: 42rpx;
				}

				.value {
					text-align: right;
					margin-left: 20rpx;
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
