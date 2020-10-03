<template>
	<view class="account-keep-create">
		<view class="keep-card">
			<view class="header flex-row" style="justify-content: space-between;">
				<view class="tabs flex-row">
					<view class="tab" :style="{color: formData.plusMinus == 1 ? '#EFB600' : '#999'}" @click="formData.plusMinus=1">
						<text>收入</text>
						<view class="line" v-if="formData.plusMinus == 1"></view>
					</view>
					<view class="tab" :style="{marginLeft: '60rpx', color: formData.plusMinus == 2 ? '#EFB600' : '#999'}" @click="formData.plusMinus=2">
						<text>支出</text>
						<view class="line" v-if="formData.plusMinus == 2"></view>
					</view>
				</view>
				<picker mode="date" :value="getDate(formData.addTime, '-')" @change="bindDateChange">
					<view class="add-time">{{getDate(formData.addTime)}}</view>
				</picker>
			</view>
			<view class="form-item flex-row">
				<text class="label">类目</text>
				<view class="value flex-1 flex-row" style="margin-right: 0;">
					<view :class="['tabT', index == formData.tradeType ? 'inTabT' : '']" v-for="(item,index) in tradeTypeMap" :key="index"
					 @click="formData.tradeType = index">
						<text>{{item}}</text>
					</view>
				</view>
			</view>
			<view class="form-item flex-row">
				<text class="label">名称</text>
				<input class="value flex-1" type="text" v-model="formData.goodsName" placeholder="请输入物商品名称" placeholder-style="color: #DDD; font-size: 29rpx;line-height: 40rpx;" />
			</view>
			<view class="form-item flex-row">
				<view class="flex-1 flex-row">
					<text class="label">单价</text>
					<input class="value flex-1" type="number" v-model="formData.goodsPrice" placeholder="¥ 0.00" placeholder-style="color: #DDD; font-size: 29rpx;line-height: 40rpx;" />
				</view>
				<view class="flex-1 flex-row">
					<text class="label">数量</text>
					<view class="value flex-1 flex-row">
						<view class="circle-box flex-col" @click="changeNum('minus')" @longpress="changeNum('minus_max')">
							<!-- <text style="margin-bottom: 6rpx;">-</text> -->
							<uni-icons type="minus-filled" size="20" :color="formData.goodsNum > 1 ? '#FFD44D' : '#ddd'"></uni-icons>
						</view>
						<!-- <text style="padding: 10rpx 30rpx;">1</text> -->
						<view class="input-box flex-col">
							<input class="num-input" maxlength="8" type="number" v-model="formData.goodsNum" data-name="goodsNum" @input="filterMath"
							 @blur="filterMath" />
							<text v-if="formData.goodsNum > 999" class="absolute-row-center tips">{{formData.goodsNum}}</text>
						</view>
						<view class="circle-box flex-col" @click="changeNum('plus')" @longpress="changeNum('plus_max')">
							<!-- <text style="margin-bottom: 6rpx;">+</text> -->
							<uni-icons type="plus-filled" size="20" color="#FFD44D"></uni-icons>
						</view>
					</view>
				</view>
			</view>
			<view class="form-item flex-row">
				<text class="label">总额</text>
				<text class="value flex-1" :style="{color:formData.goodsPrice ? '#333' : '#ddd'}">{{formData.goodsPrice ? formData.goodsNum * formData.goodsPrice : '￥0.00'}}</text>
				<!-- <input class="value flex-1" type="number" v-model="formData.allPrice" placeholder="¥ 0.00" placeholder-style="color: #DDD; font-size: 29rpx;line-height: 40rpx;" /> -->
			</view>
		</view>
		<view class="btn-group flex-row">
			<view class="btn-left flex-col flex-1">
				<text>记一笔</text>
			</view>
			<view style="width: 34rpx;"></view>
			<view class="btn-right flex-col flex-1" @click="submit() ">
				<text>完成</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		accKeepCreate
	} from "@/api/account.js"
	export default {
		data() {
			return {
				formData: {
					plusMinus: 1,
					type: 2,
					tradeType: 10,
					addTime: new Date(),
					goodsName: '商品名称',
					goodsPrice: undefined,
					goodsNum: 1
				},
				tradeTypeMap: {
					'10': '物流',
					'11': '商品',
					'12': '成本',
					'13': '退款',
					'14': '优惠',
					'15': '自定义',
				}
			};
		},
		onLoad() {},
		methods: {
			getDate(date, type) {
				// console.log(date)
				if (date instanceof Date) {
					let y = date.getFullYear()
					let m = date.getMonth() + 1;
					m = m > 9 ? m : '0' + m
					let d = date.getDate();
					d = d > 9 ? d : '0' + m
					if (!type) {
						return `${y}年${m}月${d}日`
					} else {
						return `${y}${type}${m}${type}${d}`
					}
				} else {
					return date
				}
			},
			bindDateChange(e) {
				let {
					value
				} = e.detail
				this.formData.addTime = new Date(value)
			},
			changeNum(type) {
				switch (type) {
					case 'plus':
						this.formData.goodsNum++
						break;
					case 'plus_max':
						this.formData.goodsNum++
						break;
					case 'minus':
						if (this.formData.goodsNum > 1) {
							this.formData.goodsNum--
						}
						break;
					case 'minus_max':
						if (this.formData.goodsNum > 1) {
							this.formData.goodsNum--
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
			submit() {
				console.log(this.formData)
				accKeepCreate(this.formData).then(res => {
					uni.navigateBack({
						delta: 1
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.account-keep-create {
		padding: 24rpx 24rpx 180rpx;

		.keep-card {
			box-shadow: 0 8rpx 20rpx 0 rgba(0, 0, 0, 0.02);
			background-color: #fff;
			border-radius: 10rpx;
			padding: 24rpx 30rpx;

			.header {
				.tabs {
					.tab {
						font-size: 29rpx;
						line-height: 40rpx;
						position: relative;

						.line {
							position: absolute;
							width: 57rpx;
							height: 4rpx;
							background-color: #EFB600;
							bottom: -8rpx;
							left: 50%;
							transform: translateX(-50%);
						}
					}
				}

				.add-time {
					font-size: 22rpx;
					color: #999;
					line-height: 32px;
				}
			}

			.form-item {
				margin: 48rpx 0;

				.label {
					font-size: 29rpx;
					line-height: 40rpx;
				}

				.value {
					margin: 0 40rpx;
					flex-wrap: wrap;
					font-size: 29rpx;
					line-height: 40rpx;

					.tabT {
						margin: 5rpx 24rpx 5rpx 0;
						padding: 8rpx 28rpx 6rpx;
						border-radius: 30rpx;
						background-color: #F1F1F1;
						color: #999;
						font-size: 24rpx;
						line-height: 34rpx;
					}

					.inTabT {
						background-color: #FFF8E3;
						color: #EFB600;
					}

					.circle-box {
						width: 36rpx;
						height: 36rpx;
						border-radius: 18rpx;
					}

					.input-box {
						position: relative;
						width: 76rpx;

						.tips {
							font-size: 20rpx;
							line-height: 28rpx;
							color: #999;
							bottom: -20rpx;
						}
					}

					.num-input {
						text-align: center;
						margin: 10rpx;
						font-size: 29rpx;
						line-height: 40rpx;
					}
				}
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
