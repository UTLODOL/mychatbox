
<template>
	  <div>
	    <div v-html="renderedText"></div>
	  </div>
  <view class="container">
    <view class="chat-body" ref="chatItems">
      <view v-for="(item, index) in chatList" :key="index">
        <view class="chat-one" v-if="!item.isMe">
			<image class="chat-face" src="../../static/bot.jpg" />
				<view class="chat-box">
				<view class="chat-sender">{{item.robot}}</view>
<!-- 				  <view class="chat-content" :style="{ fontSize: font_size +'px'}" v-if="item.type==='txt'">{{ item.content }}</view -->>
				<!-- 	<ua-markdown class="chat-content" :style="{ fontSize: font_size +'px'}" v-if="item.type==='txt'" :source="item.content" ></ua-markdown> -->
<!-- 						<div v-if="item.type==='html'" v-html="item.content" :style="{ fontSize: font_size +'px'}" class="chat-rendered-text"></div -->>
				 <ua-markdown v-if="item.type==='html'" :style="{ fontSize: font_size +'px'}" :source="item.content" ></ua-markdown>
				</view>
        </view>
        <view v-else class="chat-one chat-one-mine">
          <view class="chat-box">
            <view class="chat-content" :style="{ fontSize: font_size +'px'}" v-if="item.type==='txt'">{{ item.content }}</view>
            <image class="chat-img" v-if="item.type==='img'" :src="item.content" mode="widthFix" />
          </view>
          <image class="chat-face" src="../../static/user.jpg" />
        </view>
      </view>
    </view>
    <view class="chat-footer">
		<image class="img-chose"  src='@/static/setting.jpeg' @click="setting"/>
		<input class="msg-input" :style="{ fontSize: font_size +'px'}" type="text" v-model="my_string" cursor-spacing="16" />
		<button @click="generateStory">提问</button>
    </view>
  </view>
</template>

<script>
import uaMarkdown from '../../components/ua-markdown/ua-markdown.vue';
export default {
	
  data() {
    return {
		font_size: '',
		apikeys: '',
		renderedText: '',
		my_string: '',
		chatList: [],
		robot: '',
    };
  },
  onShow() {
	this.robot = getApp().globalData.robot;
	this.font_size = getApp().globalData.fontsize;
	this.apikeys =getApp().globalData.api_keys;
	//console.log('eeee'+this.apikeys)
    if (uni.getStorageSync('chatList')) {
      this.chatList = JSON.parse(uni.getStorageSync('chatList'));
    }

  },
  components:{
	  uaMarkdown,
  },
  methods: {
	setting(){
		uni.navigateTo({
			url:'/pages/setting/setting'
		})
	},
    async generateStory() {
	if(this.robot.length==0)
	{
		alert('请选择机器人模型');
		uni.navigateTo({
			url:'/pages/font_size/font_size'
		});
		return;
	}
	if(this.apikeys.length ==0)
	{
		alert('请输入apikeys');
		uni.navigateTo({
			url:'/pages/font_size/font_size'
		});
		return;
	}
	const API_KEY = this.apikeys;
	console.log(API_KEY)
	console.log(this.robot)
		if(this.robot=='palm'){
		try {
				const response = await fetch(
						  'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=' + API_KEY,
						  {
							method: 'POST',
							headers: {
							  'Content-Type': 'application/json',
							},
							body: JSON.stringify({
							  prompt: {
								text: this.my_string, // 使用用户输入的文本作为提示内容
							  },
							  temperature: 1.0,
							  candidateCount: 2,
							}),
						  }
						);
				if (response.ok) {
					
					  const data = await response.json();
					  console.log('生成的文本:', data);
					  const aiReply = data.candidates[0].output;// 获取 AI 回复的文本
					  const userMsg = {
						isMe: true,
						type: 'txt',
						content: this.my_string, // 用户输入的内容
					  };
					  this.chatList.push(userMsg);
				
					// 将 AI 的回复存储为 HTML 类型的消息
					//const aiRenderedReply = this.renderMarkdown(aiReply); // 渲染 AI 回复的文本为 HTML
					const aiRenderedReply =aiReply
					const aiMsg = {
					  isMe: false,
					  type: 'html', // 将消息类型定义为 HTML
					  content: aiRenderedReply, // 存储渲染后的 HTML 内容
					  robot: this.robot
					};
					this.chatList.push(aiMsg);
					uni.setStorageSync('chatList',JSON.stringify(this.chatList))
					  this.renderedText = '';
					  //滑动部分实现
				this.$nextTick(() => {
				  const chatItems = this.$refs.chatItems;
				  if (chatItems && chatItems.$el) {
					const lastChatItem = chatItems.$el.children[chatItems.$el.children.length - 1];
					// 先滚动到更近的位置，比如倒数第二个元素
					const secondLastChatItem = chatItems.$el.children[chatItems.$el.children.length - 2];
					if (secondLastChatItem) {
					  secondLastChatItem.scrollIntoView({ behavior: 'auto', block: 'end' });
					}
				
					// 使用 requestAnimationFrame 来确保首次滚动执行完毕后再进行第二次滚动
					requestAnimationFrame(() => {
					  lastChatItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
						// 延迟执行第二次滚动
						setTimeout(() => {
						  chatItems.$el.scrollTop = chatItems.$el.scrollHeight - 120; // 滚动到底部输入框高度的位置
						}, 100); // 设置适当的延迟时间
					});
				  }
				});
						this.my_string = ''; // 清空输入框
						} else {
						  const errorData = await response.json();
						  console.error('服务器错误:', errorData.error.message);
						  throw new Error(errorData.error.message || '未知错误');
						}
					 } catch (error) {
					   console.error('请求发生错误:', error);
					   if (error.response) {
						// 请求已发出，但服务器以状态码响应
						// 超出了2xx的范围
						console.error(error.response.data);
						console.error(error.response.status);
						console.error(error.response.headers);
					   } else if (error.request) {
						// 请求已经发出，但没有收到响应
						console.error(error.request);
					   } else {
						// 在设置请求时触发了某些事情
						console.error('Error', error.message);
					   }
					   alert(error);
					 }
		}
		else if(this.robot =='gpt3.5'){
			try {
				const endpointUrl_Turbo = "https://api.openai.com/v1/chat/completions"
				const response = await fetch(endpointUrl_Turbo,
				    {
					body: JSON.stringify({
					  "model": "gpt-3.5-turbo",
					  "messages": [{
									role: "user",
									content: this.my_string
								  }],
					  "temperature": 0.7,
					}),
				    method: 'POST',
				    headers: {
				        'Content-Type': 'application/json',
						Authorization: "Bearer "+API_KEY,
				    },

				    }
				  );
					if (response.ok) {
					
					  const data = await response.json();
					  console.log('生成的文本:', data);
					  const aiReply = data.choices[0].message.content;// 获取 AI 回复的文本
					  const userMsg = {
						isMe: true,
						type: 'txt',
						content: this.my_string, // 用户输入的内容
					  };
					  this.chatList.push(userMsg);
				
					// 将 AI 的回复存储为 HTML 类型的消息
					//const aiRenderedReply = this.renderMarkdown(aiReply); // 渲染 AI 回复的文本为 HTML
					const aiRenderedReply =aiReply
					const aiMsg = {
					  isMe: false,
					  type: 'html', // 将消息类型定义为 HTML
					  content: aiRenderedReply, // 存储渲染后的 HTML 内容
					  robot: this.robot
					};
					this.chatList.push(aiMsg);
					uni.setStorageSync('chatList',JSON.stringify(this.chatList))
					  this.renderedText = '';
					  //滑动部分实现
				this.$nextTick(() => {
				  const chatItems = this.$refs.chatItems;
				  if (chatItems && chatItems.$el) {
				    const lastChatItem = chatItems.$el.children[chatItems.$el.children.length - 1];
				    // 先滚动到更近的位置，比如倒数第二个元素
				    const secondLastChatItem = chatItems.$el.children[chatItems.$el.children.length - 2];
				    if (secondLastChatItem) {
				      secondLastChatItem.scrollIntoView({ behavior: 'auto', block: 'end' });
				    }
				
				    // 使用 requestAnimationFrame 来确保首次滚动执行完毕后再进行第二次滚动
				    requestAnimationFrame(() => {
				      lastChatItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
				        // 延迟执行第二次滚动
				        setTimeout(() => {
				          chatItems.$el.scrollTop = chatItems.$el.scrollHeight - 120; // 滚动到底部输入框高度的位置
				        }, 100); // 设置适当的延迟时间
				    });
				  }
				});
				        this.my_string = ''; // 清空输入框
						} else {
						  const errorData = await response.json();
						  console.error('服务器错误:', errorData.error.message);
						  throw new Error(errorData.error.message || '未知错误');
				        }
				     } catch (error) {
				       console.error('请求发生错误:', error);
				       if (error.response) {
				     	// 请求已发出，但服务器以状态码响应
				     	// 超出了2xx的范围
				     	console.error(error.response.data);
				     	console.error(error.response.status);
				     	console.error(error.response.headers);
				       } else if (error.request) {
				     	// 请求已经发出，但没有收到响应
				     	console.error(error.request);
				       } else {
				     	// 在设置请求时触发了某些事情
				     	console.error('Error', error.message);
				       }
				       alert(error);
				     }
		}
		else if(this.robot=='gpt4'){
			try {
				const endpointUrl_Turbo = "https://api.openai.com/v1/chat/completions"
				const response = await fetch(endpointUrl_Turbo,
				    {
					body: JSON.stringify({
					  "model": "gpt-4",
					  "messages": [
								  {
									role: "user",
									content: this.my_string
								  }],
					  "temperature": 0.7,
					}),
				    method: 'POST',
				    headers: {
				        'Content-Type': 'application/json',
						Authorization: "Bearer "+API_KEY,
				    },
			
				    }
				  );
					if (response.ok) {
					
					  const data = await response.json();
					  console.log('生成的文本:', data);
					  const aiReply = data.choices[0].message.content;// 获取 AI 回复的文本
					  const userMsg = {
						isMe: true,
						type: 'txt',
						content: this.my_string, // 用户输入的内容
					  };
					  this.chatList.push(userMsg);
				
					// 将 AI 的回复存储为 HTML 类型的消息
					//const aiRenderedReply = this.renderMarkdown(aiReply); // 渲染 AI 回复的文本为 HTML
					const aiRenderedReply =aiReply
					const aiMsg = {
					  isMe: false,
					  type: 'html', // 将消息类型定义为 HTML
					  content: aiRenderedReply, // 存储渲染后的 HTML 内容
					  robot: this.robot
					};
					this.chatList.push(aiMsg);
					uni.setStorageSync('chatList',JSON.stringify(this.chatList))
					  this.renderedText = '';
					  //滑动部分实现
				this.$nextTick(() => {
				  const chatItems = this.$refs.chatItems;
				  if (chatItems && chatItems.$el) {
				    const lastChatItem = chatItems.$el.children[chatItems.$el.children.length - 1];
				    // 先滚动到更近的位置，比如倒数第二个元素
				    const secondLastChatItem = chatItems.$el.children[chatItems.$el.children.length - 2];
				    if (secondLastChatItem) {
				      secondLastChatItem.scrollIntoView({ behavior: 'auto', block: 'end' });
				    }
				
				    // 使用 requestAnimationFrame 来确保首次滚动执行完毕后再进行第二次滚动
				    requestAnimationFrame(() => {
				      lastChatItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
				        // 延迟执行第二次滚动
				        setTimeout(() => {
				          chatItems.$el.scrollTop = chatItems.$el.scrollHeight - 120; // 滚动到底部输入框高度的位置
				        }, 100); // 设置适当的延迟时间
				    });
				  }
				});
				        this.my_string = ''; // 清空输入框
						} else {
						  const errorData = await response.json();
						  console.error('服务器错误:', errorData.error.message);
						  throw new Error(errorData.error.message || '未知错误');
				        }
				     } catch (error) {
				       console.error('请求发生错误:', error);
				       if (error.response) {
				     	// 请求已发出，但服务器以状态码响应
				     	// 超出了2xx的范围
				     	console.error(error.response.data);
				     	console.error(error.response.status);
				     	console.error(error.response.headers);
				       } else if (error.request) {
				     	// 请求已经发出，但没有收到响应
				     	console.error(error.request);
				       } else {
				     	// 在设置请求时触发了某些事情
				     	console.error('Error', error.message);
				       }
				       alert(error);
				     }
		}
		else if(this.robot=='baidu'){
			try {
				
				const endpointUrl_Turbo = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token="+API_KEY;
				const response = await fetch(endpointUrl_Turbo,
				    {
					body: JSON.stringify({
					  "messages": [{
									role: "user",
									content: this.my_string
								  },],
					}),
				    method: 'POST',
				    headers: {
				        'Content-Type': 'application/json',
				    },
				    }
				  );
					if (response.ok) {
					
					  const data = await response.json();
					  console.log('生成的文本:', data);
					  const aiReply = data.result;// 获取 AI 回复的文本
					  const userMsg = {
						isMe: true,
						type: 'txt',
						content: this.my_string, // 用户输入的内容
					  };
					  this.chatList.push(userMsg);
				
					// 将 AI 的回复存储为 HTML 类型的消息
					//const aiRenderedReply = this.renderMarkdown(aiReply); // 渲染 AI 回复的文本为 HTML
					const aiRenderedReply =aiReply
					const aiMsg = {
					  isMe: false,
					  type: 'html', // 将消息类型定义为 HTML
					  content: aiRenderedReply, // 存储渲染后的 HTML 内容
					  robot: this.robot
					};
					this.chatList.push(aiMsg);
					uni.setStorageSync('chatList',JSON.stringify(this.chatList))
					  this.renderedText = '';
					  //滑动部分实现
				this.$nextTick(() => {
				  const chatItems = this.$refs.chatItems;
				  if (chatItems && chatItems.$el) {
				    const lastChatItem = chatItems.$el.children[chatItems.$el.children.length - 1];
				    // 先滚动到更近的位置，比如倒数第二个元素
				    const secondLastChatItem = chatItems.$el.children[chatItems.$el.children.length - 2];
				    if (secondLastChatItem) {
				      secondLastChatItem.scrollIntoView({ behavior: 'auto', block: 'end' });
				    }
				
				    // 使用 requestAnimationFrame 来确保首次滚动执行完毕后再进行第二次滚动
				    requestAnimationFrame(() => {
				      lastChatItem.scrollIntoView({ behavior: 'smooth', block: 'end' });
				        // 延迟执行第二次滚动
				        setTimeout(() => {
				          chatItems.$el.scrollTop = chatItems.$el.scrollHeight - 120; // 滚动到底部输入框高度的位置
				        }, 100); // 设置适当的延迟时间
				    });
				  }
				});
				        this.my_string = ''; // 清空输入框
						} else {
						  const errorData = await response.json();
						  console.error('服务器错误:', errorData);
						  throw new Error(errorData.error.message || '未知错误');
				        }
				     } catch (error) {
				       console.error('请求发生错误:', error);
				       if (error.response) {
				     	// 请求已发出，但服务器以状态码响应
				     	// 超出了2xx的范围
				     	console.error(error.response.data);
				     	console.error(error.response.status);
				     	console.error(error.response.headers);
				       } else if (error.request) {
				     	// 请求已经发出，但没有收到响应
				     	console.error(error.request);
				       } else {
				     	// 在设置请求时触发了某些事情
				     	console.error('Error', error.message);
				       }
				       alert(error);
				     }
		}
		
    },
  },
};
</script>


<style lang="scss" scoped>
	.container{
		background-color: #f1f1f1;
		min-height: 100vh;
	}
	.chat-body{
		padding-bottom: 178upx;
		.chat-one{
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-items: flex-start;
			padding:20upx 0;
		}
		.chat-one-mine{
			justify-content: flex-end;
		}
		.chat-face{
			width: 84upx;
			height: 84upx;
			border-radius: 10upx;
			margin-left: 40upx;
		}
		.chat-one-mine .chat-face{
			margin-left: 0;
			margin-right: 40upx;
		}
		.chat-box{
			max-width: calc(100% - 290upx);
			margin-left: 20upx;
		}
		.chat-one-mine .chat-box{
			margin-right:  20upx;
		}
		.chat-sender{
			color: #888;
			font-size: 28upx;
			margin-top: -8upx;
			margin-bottom: 10upx;
		}
		.chat-content{
			background-color: #fff;
			border-radius: 5px;
			padding: 10px;
		}
		.chat-img{
			float: left;
			max-width: 60%;
			border-radius: 5px;
		}
		.chat-one-mine .chat-img{
			float: right;
		}
	}
	.chat-footer{
		width: 90%;
		padding:0 40upx;
		height: 120upx;
		position: fixed;
		bottom: 0;
		background-color: #f1f1f1;
		transform: translateX(5%);
		left: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		z-index: 9999;
		border-top: 1upx solid #ddd;
	.msg-input{
		background-color: #fff;
		flex: 1; /* 占据剩余空间 */
		height: 70upx;
		font-size: 30upx;
		border-radius: 10upx;
		padding: 0 20upx; /* 调整左右内边距 */
		}
	.img-chose{
		height: 70upx;
		width: 70upx;
	}
	}
</style>
