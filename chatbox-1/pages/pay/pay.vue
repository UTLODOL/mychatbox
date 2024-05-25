<template>
	<view>
		<image src="../../static/pay.png"></image>
		<p></p>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
			change(){
				this.text = getApp().globalData.text
			}
			
		}
	}
</script>

<style>

</style>
