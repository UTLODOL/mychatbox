<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
	<textarea v-model="my_string" placeholder="输入"></textarea>
    <view class="text-area">
      <text class="title">{{ title }}</text>
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
    };
  },
  methods: {
    async generateStory() {
      const PALM_API_KEY = ''; // 替换为你的 API 密钥

      try {
        const response = await fetch(
		//curl 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=【API Key】&client_secret=【Secret Key】'
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
    }
  }
};
</script>


<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
