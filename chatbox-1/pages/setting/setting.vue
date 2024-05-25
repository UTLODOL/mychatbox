<template>
	<view>
		<set-list :list="list"></set-list>
		
	</view>
</template>

<script>
	import setListVue from '../../set-list_1/components/set-list/set-list.vue'
	export default {
		data() {
			return {
				list: [
					{
						name: "相关设置",
						url:"/pages/font_size/font_size"
					},
					{
						name: "支持作者(收款)",
						url:"/pages/pay/pay"
					},
					{
						name: "支持作者(看广告）",
						url:"/pages/ad/ad"
					},
					{
						name: "清空历史记录",
						url:""
					},
					{
						name: "关于APP",
						url:"/pages/info/info"
					},
				]
			}
		},
		methods: {
			
		},
		components:{
			setListVue
		}
	}
</script>

<style>

</style>
