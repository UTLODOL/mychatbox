<template>
	<view class="container">
	  <view class="chat-body">
	  			<view v-for="(item,index) in chatList" :key="index">
	  				<view class="chat-one" v-if="!item.isMe">
	  					<image class="chat-face" src="../../static/logo.png" />
	  					<view class="chat-box">
	  						<view class="chat-sender">AI</view>
	  						<view class="chat-content" v-if="item.type==='txt'">{{item.content}}</view>
	  						<image class="chat-img" v-if="item.type==='img'" :src="item.content" mode='widthFix' />
	  					</view>
	  				</view>
	  				<view v-else class="chat-one chat-one-mine">
	  					<view class="chat-box">
	  						<view class="chat-content" v-if="item.type==='txt'">{{item.content}}</view>
	  						<image class="chat-img" v-if="item.type==='img'" :src="item.content" mode='widthFix' ></image>
	  					</view>
	  					<image class="chat-face" src="../../static/logo.png" />
	  				</view>
	  			</view>
	  		</view>
	  		<view class="chat-footer">
	  			<input class="msg-input" type="text" v-model="myInput" cursor-spacing="16"/>
	  			<image class="img-chose" src='../../static/logo.png' @click="chooseImgAndSend"/>
	  			<button @click="generateStory">提问</button>
	  		</view>
    </view>
	
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
	  my_string:'',
	   chatList: []
    };
  },
  onShow(){
  	if(!!uni.getStorageSync('chatList')){
  		this.chatList = JSON.parse(uni.getStorageSync('chatList'))
  	}
  },
  methods: {
    async generateStory() {
      const PALM_API_KEY = ''; // 替换为你的 API 密钥

      try {
        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=' + PALM_API_KEY,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prompt: {
                text: this.my_string
              },
              temperature: 1.0,
              candidateCount: 2
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('生成的文本:', data); // 输出生成的文本数
		  console.log
          this.title = data.candidates[0].output; // 更新标题为生成的文本内容或根据返回的数据做处理
        } else {
          throw new Error('HTTP请求失败');
        }

      } catch (error) {
        console.error('发生错误:', error);
        // 处理错误情况
      }
    },
	chooseImgAndSend(){
		uni.chooseImage({
			count: 1,
			sizeType: ['original','compressed'],
			sourceType: ['album','camera'],
			
			success: res => {
				
				console.log(res.tempFilePaths[0])
				let sendMsg ={
					isMe: true,
					type: "img",
					content:res.tempFilePaths[0]
				}
				this.chatList.push(sendMsg)
				let resMsg ={
					isMe: false,
					type: "img",
					content:res.tempFilePaths[0]
				}
				this.chatList.push(resMsg)
				uni.pageScrollTo({
					scrollTop:999999,
					duration:0
				})
				uni.setStorageSync('chatList',JSON.stringify(this.chatList))
			}
		});
	}
  }
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
			font-size: 30upx;
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
		width: 680upx;
		padding:0 40upx;
		height: 120upx;
		position: fixed;
		bottom: 0;
		background-color: #f1f1f1;
		
		left: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		align-content: center;
		border-top: 1upx solid #ddd;
		.msg-input{
			background-color: #fff;
			width: calc(100% - 300upx);
			height: 70upx;
			font-size: 30upx;
			border-radius: 10upx;
			padding: 0 20upx;
		}
		.img-chose{
			height: 70upx;
			width: 70upx;
		}
	}
</style>
