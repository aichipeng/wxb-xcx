<template>
	<view class="address-create-page">
		<view class="form-group">
			<view class="form-item flex-row">
				<text class="label">收件人</text>
				<input class="value flex-1" v-model="formData.userName" type="text" placeholder="请输入收件人名字" placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
			<view class="form-item flex-row">
				<text class="label">手机号码</text>
				<input class="value flex-1" v-model="formData.telNumber" type="number" maxlength="11" placeholder="11位手机号"
				 placeholder-style="color: #999; font-size: 30rpx;line-height: 42rpx;" />
			</view>
			<view class="form-item flex-row">
				<text class="label">选择地区</text>
				<picker class="value flex-1" mode='region' @change="bindPickerChange" :value="region">
					<!-- <view class="uni-input">{{array[index]}}</view> -->
					<view v-if="!formData.postcode" style="color: #999">请选择省市区</view>
					<view v-else>{{region[0]}} {{region[1]}} {{region[2]}}</view>
				</picker>
			</view>
			<view class="form-item flex-row" style="border-bottom: none">
				<text class="label">详细地址</text>
				<input class="value flex-1" v-model="formData.detailInfo" type="text" placeholder="街道门牌信息" placeholder-style="color: #999; font-size: 30rpx;line-height: 34rpx;" />
			</view>
		</view>
		<view class="discern-card">
			<textarea class="input-value" placeholder="粘贴地址信息，自动拆分姓名、电话和地址" placeholder-style="color: #999; font-size: 24rpx;line-height: 42rpx;"></textarea>
			<view class="tips flex-row">
				<uni-icons type="info" size="16" color="#EFB600" style="transform: translateY(2rpx);"></uni-icons>
				<text style="margin: 0 10rpx; color: #999;">智能识别</text>
			</view>
		</view>
		<view class="btn-bottom flex-col" @click="submit">
			<text>完成</text>
		</view>
	</view>
</template>

<script>
	import {
		addressCreate
	} from "@/api/address.js"
	export default {
		data() {
			return {
				addressList: [],
				formData: {
					id: undefined,
					userName: undefined,
					telNumber: undefined,
					provinceId: undefined,
					cityId: undefined,
					areaId: undefined,
					provinceName: undefined,
					cityName: undefined,
					countyName: undefined,
					detailInfo: undefined,
					isDefault: false,
					postcode: undefined
				},
				region: ["", "", ""],
			}
		},
		onLoad(options) {
			this.formData.id = options.id;
			this.getList();
		},
		methods: {
			getList() {
				try {
					let addressList = uni.getStorageSync('addressList') || [];
					let id = this.formData.id;
					this.addressList = addressList;
					if (id !== undefined) {
						this.formData = addressList[id]
						this.region = [
							addressList[id].provinceName || '',
							addressList[id].cityName || '',
							addressList[id].countyName || ''
						]
					} else {
						this.formData.id = addressList.length
					}
				} catch (e) {}
			},
			bindPickerChange(e) {
				const {
					value,
					code,
					postcode
				} = e.detail
				// console.log(e)
				this.region = value
				this.formData.provinceId = code[0]
				this.formData.cityId = code[1]
				this.formData.areaId = code[2]
				this.formData.provinceName = value[0]
				this.formData.cityName = value[1]
				this.formData.countyName = value[2]
				this.formData.postcode = postcode
			},
			submit() {
				// console.log(this.formData)
				const {
					id,
					userName,
					telNumber,
					provinceId,
					detailInfo,
				} = this.formData, msg = this.verifyForm();
				let addressList = this.addressList;
				// console.log(msg)
				if (!msg) {
					addressList.splice(id, 1, this.formData)
					console.log(addressList)
					try {
						uni.setStorageSync('addressList', addressList)
						uni.navigateBack({
							delta: 1
						})
					} catch (e) {
						//TODO handle the exception
					}
				} else {
					uni.showToast({
						title: msg,
						icon: 'none',
						mask: true
					})
				}
			},
			verifyForm() {
				const {
					userName,
					telNumber,
					provinceId,
					detailInfo,
				} = this.formData;
				let msg = '';
				if (!userName) {
					msg = '收件人不能为空！'
				} else if (!telNumber) {
					msg = '手机号码不能为空！'
				} else if (!(/^1[3456789]\d{9}$/.test(telNumber))) {
					msg = '请输入正确手机号码！'
				} else if (!provinceId) {
					msg = '省市区不能为空！'
				} else if (!detailInfo) {
					msg = '详细地址不能为空！'
				}
				return msg
			},
		}
	}
</script>

<style lang="scss" scoped>
	.address-create-page {
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

		.discern-card {
			margin: 16rpx 0;
			background-color: #fff;
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			border-radius: 10rpx;
			padding: 1rpx 20rpx 16rpx;

			.input-value {
				height: 208rpx;
				background-color: #F9F9F9;
				margin: 24rpx 0 16rpx;
				border-radius: 10rpx;
				font-size: 24rpx;
				line-height: 34rpx;
				padding: 20rpx;
				width: 100%;
				box-sizing: border-box
			}

			.tips {
				margin: 16rpx 0;
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
