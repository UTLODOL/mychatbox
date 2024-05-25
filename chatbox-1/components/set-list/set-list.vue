<template>
	<view class="home-list">
		<block v-for="(item,index) in list" :key="index">
			<view class="home-list-item" hover-class="home-list-hover" @click="clickevent(item)">
				<view class="home-list-item-left">
					<view class="home-list-item-text">{{item.name}}</view>
				</view>
				<view class="home-list-item-right icon iconfont icon-icon-right"></view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			list: Array
		},
		methods: {
			clickevent(item) {
				if (item.name == "清空历史记录") {
					uni.showModal({
						title: '提示',
						content: '是否要清空历史记录？',
						confirmText:"立刻清除",
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								uni.clearStorage()
								uni.showToast({
									title:"清除成功"
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
				if (item.url) {
					uni.navigateTo({
						url: item.url
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("iconfont.css");

	.home-list {
		display: flex;
		flex-direction: column;

		.home-list-item {
			display: flex;
			justify-content: space-between;
			padding: 20rpx;
			border-bottom: 1px solid #f6f6f6;

			.home-list-item-left {
				display: flex;
				align-items: center;

				.home-list-item-text {
					margin-left: 20rpx;
					font-size: 30rpx;
				}

				.home-list-item-icon {
					font-size: 40rpx;
				}
			}

			.home-list-item-right {
				display: flex;
				align-items: center;
				color: #B8B8B8;
			}
		}

		.home-list-hover {
			background-color: #eee;
		}

		.exit-button {
			margin-top: 30rpx;
			width: 90%;
			background-color: #FFE933;
			font-size: 30rpx;
			color: #333;
			border: 0;
		}
	}
</style>