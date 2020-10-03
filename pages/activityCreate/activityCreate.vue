<template>
	<view class="activity-create-page">
		<view class="form-group">
			<view class="form-item flex-row">
				<text class="label">描述</text>
				<input class="value flex-1" type="text" v-model="formData.describe" placeholder="请输入收款活动描述" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
			<view class="form-item flex-row" style="border-bottom: none">
				<text class="label">可售单量</text>
				<input class="value flex-1" type="number" v-model="formData.saleVolume" placeholder="请输入收款活动可售单量" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
		</view>
		<view class="form-group">
			<view class="form-item flex-row">
				<text class="label">名称</text>
				<input class="value flex-1" type="text" v-model="formData.name" placeholder="请输入物商品名称" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
			<view class="form-item flex-row">
				<text class="label">单价</text>
				<input class="value flex-1" type="number" v-model="formData.price" placeholder="¥ 0.00" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
			<view class="form-item flex-row">
				<text class="label">数量</text>
				<view class="value flex-row">
					<view class="circle-box flex-col" @click="changeNum('minus')" @longpress="changeNum('minus_max')">
						<!-- <text style="margin-bottom: 6rpx;">-</text> -->
						<uni-icons type="minus-filled" size="20" :color="formData.num > 1 ? '#FFD44D' : '#ddd'"></uni-icons>
					</view>
					<!-- <text style="padding: 10rpx 30rpx;">1</text> -->
					<view class="input-box flex-col">
						<input class="num-input" maxlength="8" type="number" v-model="formData.num" data-name="num" @input="filterMath"
						 @blur="filterMath" />
						<text v-if="formData.num > 999" class="absolute-row-center tips">{{formData.num}}</text>
					</view>
					<view class="circle-box flex-col" @click="changeNum('plus')" @longpress="changeNum('plus_max')">
						<!-- <text style="margin-bottom: 6rpx;">+</text> -->
						<uni-icons type="plus-filled" size="20" color="#FFD44D"></uni-icons>
					</view>
				</view>
			</view>
			<view class="form-item flex-row">
				<text class="label">邮费</text>
				<input class="value flex-1" v-model="formData.freightPrice" type="number" placeholder="¥ 0.00" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
			<view class="form-item flex-row" style="border-bottom: none">
				<text></text>
				<text>总计：¥ {{Number(formData.freightPrice) + Number(formData.price)}}</text>
			</view>
		</view>
		<view class="form-group">
			<view class="form-item flex-row" style="border-bottom: none">
				<text class="label">显示微信名片</text>
				<switch class="value flex-1" style="transform:scale(0.7) translateX(23%)" color="#FFD44D" checked @change="changeShowWx" />
			</view>
		</view>
		<view class="agree-checkbox flex-row">
			<view class="checkbox" @click="agree = !agree">
				<uni-icons v-if="!agree" type="circle" size="14" color="#ddd"></uni-icons>
				<uni-icons v-else type="checkbox-filled" size="14" color="#FFD44D"></uni-icons>
			</view>
			<!-- <checkbox color="#49C265" style="transform: scale(0.5) translateX(30%)" /> -->
			<text><text>已阅读并同意</text> <text style="color: #EFB600;">《用户协议》</text></text>
		</view>
		<view class="btn-group flex-row">
			<view class="btn-left flex-col flex-1" @click="handleSubmit(1)">
				<text>保存并预览</text>
			</view>
			<view style="width: 34rpx;"></view>
			<view class="btn-right flex-col flex-1" @click="handleSubmit(2) ">
				<text>发布</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		activityDetail,
		activityCreate,
		activityHold
	} from "../../api/activity.js"
	export default {
		data() {
			return {
				agree: true,
				formData: {
					describe: undefined,
					saleVolume: undefined,
					name: undefined,
					price: 0,
					num: 1,
					freightPrice: 0,
					isShowWx: true,
				}
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.getInfo();
			}
		},
		methods: {
			getInfo() {
				activityDetail({
					id: this.id
				}).then(res => {
					this.formData = res.data;
				})
			},
			changeNum(type) {
				switch (type) {
					case 'plus':
						this.formData.num++
						break;
					case 'plus_max':
						this.formData.num++
						break;
					case 'minus':
						if (this.formData.num > 1) {
							this.formData.num--
						}
						break;
					case 'minus_max':
						if (this.formData.num > 1) {
							this.formData.num--
						}
						break;
					default:
						break;
				}
			},
			filterMath(e) {
				const {
					name
				} = e.currentTarget.dataset;
				let {
					value
				} = e.detail;
				if (value) {
					this.formData[name] = Math.ceil(value)
				} else {
					this.formData[name] = 1
				}
			},
			changeShowWx(e) {
				// console.log(e)
				this.formData.isShowWx = e.target.value
			},
			handleSubmit(type) {
				// console.log(res)
				const _this = this
				switch (Number(type)) {
					case 1:
						_this.handleHold()
						break;
					case 2:
						_this.handleCreate()
						break;
					default:
						break;
				}
			},
			// 发布
			handleCreate() {
				activityCreate(this.formData).then(res => {
					uni.redirectTo({
						url: '/pages/activityPreview/activityPreview?id=' + res.data
					});
				})
			},
			// 保存并预览
			handleHold() {
				activityHold(this.formData).then(res => {
					uni.redirectTo({
						url: '/pages/activityClient/activityClient?id=' + res.data
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.activity-create-page {
		padding: 1rpx 24rpx 180rpx;

		.form-group {
			margin: 16rpx 0;
			background-color: #fff;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 10rpx;
			padding: 0 16rpx;

			.form-item {
				justify-content: space-between;
				border-bottom: solid 2rpx #EEEEEE;
				font-size: 30rpx;
				line-height: 42rpx;
				padding: 32rpx 0;

				.label {}

				.value {
					text-align: right;
					max-width: 70%;
					font-size: 30rpx;
					line-height: 42rpx;

					.circle-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 18rpx;
					}

					.input-box {
						position: relative;

						.tips {
							font-size: 20rpx;
							line-height: 28rpx;
							color: #999;
							bottom: -20rpx;
						}
					}

					.num-input {
						width: 56rpx;
						text-align: center;
						margin: 10rpx;
						font-size: 30rpx;
						line-height: 42rpx;
					}
				}
			}
		}

		.agree-checkbox {
			justify-content: center;
			color: #999;

			.checkbox {
				transform: translateY(1rpx);
				margin-right: 10rpx;
			}
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
