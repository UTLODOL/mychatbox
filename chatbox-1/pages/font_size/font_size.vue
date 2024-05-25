<template>
	<div class="div">
		<text :style="{'font-size': slidervalue+'px'}">字体大小调整</text>
		<view>
			<view>
				<slider :value="slidervalue"  @change="onSliderChange" show-value min="6" max = "36"/>
			</view>
			
		</view>
	</div>
	<div class="div">
		<cc-dropDownMenu :titleArr="titleArr" :dropArr="dropArr"  @finishDropClick="ondropchange"></cc-dropDownMenu>
		<text v-if="model">选择的模型:{{model}}</text>
		<text v-else>选择的模型：还未选择模型</text>
	</div>
	<div class="div">
		<text >输入的api keys :{{apikeys}}</text>
		<textarea class="textarea" placeholder="输入api keys" v-model="apikeys" @input="keyschange"></textarea>
	</div>

</template>

<script>
import ccdropDownMenu from '../../uni_modules/cc-dropDownMenu/components/cc-dropDownMenu/cc-dropDownMenu.vue';
export default {
  data() {
    return {
		slidervalue:'',
		model: '',
		apikeys: '',
		titleArr: ['机器人类型选择'],
		dropArr: [
			[{
					text: '不限',
					value: ""
				}, {
					text: 'palm(google 大模型)',
					value: "palm"
				},
				{
					text: 'gpt-3.5(openai 大模型)',
					value: "gpt3.5"
				},
				{
					text: 'gpt-4(openai 大模型)',
					value: "gpt4"
				},
				{
					text: '百度文心一言',
					value: "baidu"
				}
			],
		],
		ResultData: []
    };
  },
  components:{
	  ccdropDownMenu
  },
  onShow(){
	  
	  this.slidervalue = getApp().globalData.fontsize
	  this.model = getApp().globalData.robot
	  this.apikeys = getApp().globalData.api_keys
	  
	  
	  //onsole.log(getApp().globalData.fontsize)
	  //console.log(this.slidervalue)
},	

  methods: {
	keyschange(){
		console.log('eee'+this.apikeys)
		getApp().globalData.api_keys = this.apikeys
	},
    onSliderChange(e) {
	  this.slidervalue = e.detail.value
	  getApp().globalData.fontsize = this.slidervalue
	  //console.log(getApp().globalData.fontsize)
    },
	ondropchange(e){
		this.model = e[0]
		getApp().globalData.robot = e[0]
		console.log(getApp().globalData.robot)
	},
  }
}
</script>

<style>
.textarea {
	width: 100%; /* 设置宽度为父容器的100% */
	height: 50px;
	padding: 10px; /* 设置内边距 */
	font-size: 16px; /* 设置字体大小 */
	border: 1px solid #ccc; /* 设置边框样式 */
	background-color: white;
	border-radius: 5px; /* 设置边框圆角 */
	box-sizing: border-box; /* 让内边距和边框计入总宽度 */
  /* 添加其他样式，比如颜色、背景颜色等 */
}
.div {
  width: 100%; /* 设置宽度 */
  height: 120px; /* 设置高度 */
  background-color: #f2f2f2; /* 设置背景颜色 */
  border: 1px solid #ccc; /* 设置边框样式 */
  border-radius: 5px; /* 设置边框圆角 */
  padding: 20px; /* 设置内边距 */
  margin: 10px; /* 设置外边距 */
  box-sizing: border-box; /* 让内边距和边框计入总宽度 */
  /* 添加其他样式，比如文字颜色、字体大小等 */
}
</style>