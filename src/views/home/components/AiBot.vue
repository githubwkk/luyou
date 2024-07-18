<template>
  <div class="common-layout">
    <div class="box-card">
      <!--      <el-aside class="left"></el-aside>-->
      <!-- 消息容器 -->
      <div class="message-container" ref="messageContainer">
        <div class="topHeader"><span>AI旅行助手</span></div>
        <div v-for="(message, index) in messages" :key="index">
          <div
              class="message-item"
              :class="{ r: message.isUser, l1: !message.isUser }"
          >
            <!--否则ai的信息 -->
            <div v-if="!message.isUser">
              <div class="botAvatar">
                <el-avatar>AI</el-avatar>
              </div>
            </div>
            <div
                :class="{
                'user-message': message.isUser,
                'bot-message': !message.isUser
              }"
            >
              <p v-if="message.isTyping">{{ message.content }}</p>
              <div
                  v-else-if="message.content"
                  class="text-message"
                  v-html="parseMarkdown(message.content)"
              ></div>
              <p v-else-if="message.error" class="error-message">
                {{ message.content }}
              </p>
            </div>
            <!--如果用户的信息 -->
            <div v-if="message.isUser" class="userAvatar">
              <!-- 用户头像 -->
              <el-avatar
              >Me
              </el-avatar>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="chat-input">
        <el-input
            :disabled="robotIsReplying"
            v-model="userInput"
            autosize
            placeholder="请输入..."
        ></el-input>
        <el-button
            :disabled="robotIsReplying"
            @click="sendMessage"
            type="primary"
        >发送
        </el-button>
        <el-button type="success" class="btn" @click="clear"
        >清空对话记录
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {ElNotification} from 'element-plus'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()
export default {
  data() {
    return {
      userInput: '',
      messages: [],
      robotIsReplying: false, // 用于标识机器人是否正在回复
      // 在 data 中添加用于存储用户输入历史的变量
      chatHistory: [] // 用于存储对话历史
    }
  },
  onMounted() {
    this.chatHistory.push({sender: 'user', message: '假设你是一个旅游专家'})
  },
  methods: {
    scrollToBottom() {
      this.$refs.messageContainer.scrollTo({
        top: this.$refs.messageContainer.scrollHeight,
        behavior: 'smooth'
      });
    },
    parseMarkdown(text) {
      return md.render(text)
    },
    clear() {
      ;(this.userInput = ''),
          (this.chatHistory = []), // 用于存储对话历
          (this.messages = []),
          // 调用该函数以清除对话历史
          localStorage.removeItem('chatHistory')
      ElNotification({
        title: 'Success',
        message: '记录已经清空！',
        type: 'success'
      })
    },
    async sendMessage() {
      //页面滑动到底部
      this.scrollToBottom()
      this.robotIsReplying = true
      if (this.userInput === '') {
        this.robotIsReplying = false
        return
      }
      //特定字符拦截
      if (this.userInput === 'xxx') {
        this.robotIsReplying = false
        this.messages.push({content: '特定信息!'})
        this.userInput = ''
        return
      }
      if (this.userInput.trim() === '') return



      this.messages.push({content: this.userInput, isUser: true})

      try {
        this.messages.push({content: '等待机器人回复...', isTyping: true}) // 显示正在输入状态
        // 将用户输入的消息添加到对话历史中
        this.chatHistory.push({
          sender: 'user',
          message: '假设你是一个中国的旅游专家'
        })
        this.chatHistory.push({
          sender: 'user',
          message: this.userInput
        })

        //在发送消息时将整个对话历史发送给后台
        const historyString = JSON.stringify(this.chatHistory)
        console.log('历史记录' + JSON.stringify(this.chatHistory))
        // console.log("机器人说0"+historyString)
        // 提取用户说的消息并拼接成字符串
        // 提取所有用户的消息
        // 假设 chatHistory 是包含完整对话历史的数组
        const maxHistoryLength = 6 // 指定要保留的最大条目数

        // 裁剪对话历史到最近的 3-4 条信息
        const trimmedChatHistory = this.chatHistory.slice(-maxHistoryLength)
        // console.log('裁剪的信息' + trimmedChatHistory)
        // 现在 trimmedChatHistory 中包含了最近的 3-4 条对话历史记录
        const userMessages = trimmedChatHistory
            .filter(item => item.sender === 'user') // 过滤出 sender 为 'user' 的对话记录
            .map(item => item.message) // 通过 map 方法获取每条消息的内容
        // 处理后台返回的响应消息
        // 合并消息为字符串
        const userMessageString = userMessages.join(' ') // 使用 join 方法将消息拼接成一个字符串，用空格分隔每条消息
        // 在拼接的消息后面加上新的问题
        const fullUserMessage =
            userMessageString +
            ' 以上是我之前问你的问题，只供你回答我接下来问题做参考，请你不要重复回答我之前问过的问题，只对新问题进行处理。新问题是：' +
            this.userInput
        console.log('fullUserMessage', fullUserMessage)
        if (userMessageString.length >= 1200) {
          this.chatHistory = [] // 如果用户消息长度超过 1000 个字符，则清空聊天历史
          // 调用该函数以清除对话历史
          localStorage.removeItem('chatHistory')
        }
        // console.log("用户说"+userMessageString)
        // console.log("对话内容" + fullUserMessage)
        // console.log("机器人说1" + historyString)
        const response = await this.chatGPTRequest(fullUserMessage)

        this.handleBackendResponse(response)
        // console.log("机器人说2" + response)

        const content = response.choices[0].message.content

        // console.log("机器人说3" + content)
        if (content) {
          for (let i = 0; i < content.length; i++) {
            await this.delay(50) // 等待一段时间再添加下一个字
            this.messages = [
              ...this.messages.slice(0, -1),
              {content: content.slice(0, i + 1), isUser: false}
            ]

            await this.$nextTick(() => {
              const messageContainer = this.$refs.messageContainer
              // 滚动到消息容器的底部
              messageContainer.scrollTop = messageContainer.scrollHeight
            })
          }
          // 将用户输入添加到历史记录中，并清空当前输入

          // console.log(response)
        } else {
          this.messages.push({content: '未能解析回复', isUser: false})
        }
      } catch (error) {
        this.messages = [...this.messages.filter(msg => !msg.isTyping)] // 清除正在输入状态
        this.messages.push({content: '发生错误', isUser: false, error: true}) // 添加错误消息
      }
      this.userInput = '' // 清空用户输入
      this.robotIsReplying = false
    },

    // 处理后台返回的响应消息
    handleBackendResponse(response) {
      // 将后台返回的消息添加到对话历史中
      this.chatHistory.push({
        sender: 'bot',
        message: response.message
      })

      // 更新本地显示的对话历史
      this.saveChatHistoryToLocalStorage()
    },

    // 将对话历史保存到本地存储
    saveChatHistoryToLocalStorage() {
      localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory))
    },

    // 从本地存储加载对话历史
    loadChatHistoryFromLocalStorage() {
      const storedChatHistory = localStorage.getItem('chatHistory')
      if (storedChatHistory) {
        this.chatHistory = JSON.parse(storedChatHistory)
      }
    },
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    chatGPTRequest(msg) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'post',
          url: 'https://api.openai.com/v1/chat/completions',
          data: {
            max_tokens: 1024,
            model: 'gpt-3.5-turbo',
            temperature: 0.8,
            top_p: 1,
            presence_penalty: 1,
            messages: [
              {
                role: 'system',
                content: 'You are ChatGPT'
              },
              {
                role: 'user',
                content: msg
              }
            ],
            stream: false // 设置 stream 为 false
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization:
                'Bearer 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'
          },
          onDownloadProgress: ({event}) => {
            //数据流
          }
        })
            .then(response => {
              resolve(response.data)
            })
            .catch(error => reject(error))
      })
    }
  },
  mounted() {
    // 在组件挂载时加载本地存储中的用户输入历史
    this.loadChatHistoryFromLocalStorage()
  }
}
</script>
<style scoped>
.common-layout {
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  height: 100vh; /* 设置布局高度为整个视口高度 */
  display: flex;
  justify-content: space-between; /* 左右两侧对齐 */
  align-items: center;
}

.box-card {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  position: relative; /* 让卡片成为定位上下文 */
  /*height: 500px; !* 假设卡片容器有固定高度 *!*/
  overflow: auto; /* 如果需要滚动条的话 */

  .left {
    background-color: #f2f3f5;
    width: 2%;
    height: 100%;
    float: left;
  }
}

.message-container {
  .topHeader {
    background-color: white;
    height: 50px;
    border-bottom: 1px solid #d7d7d7;

    span {
      line-height: 50px;
      color: #394569;
      font-weight: bold;
      margin-left: 10px;
      font-size: 25px;
    }
  }
  min-height: 80vh;
  overflow-y: auto; /* 设置内容超出时显示滚动条 */
  margin-left: auto;
  //float: right;
  width: 100%;
}

.message-item {
  font-size: 20px;
  display: flex;
  padding: 10px 20px;
}

.user-message,
.bot-message {
  border-radius: 10px;
  margin-bottom: 30px;
  width: auto;
  height: auto;
  padding: 2px 10px;
}

.user-message {
  background-color: #D2F9D1;
  text-align: right;
}

.userAvatar {
  margin-left: 10px;
}

.bot-message {
  text-align: left;
  margin-left: 20px;
  background-color: #f0f0f0;
}

.clearfix {
  clear: both;
}

.chat-input {
  margin-top: 10%;
  filter: blur(0.5);
  background: #f3f6f9;
  padding: 0 10px 40px 10px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  height: 12vh;

  .el-input {
    margin-left: 10px;
    width: 660px;
    height: 40px;
  }

  .el-button {
    margin-left: 14px;
    height: 40px;
  }
}

.chat-input el-input {
  margin-right: 10px;
}

.l {
  float: left;
}

.r {
  float: right;
}
</style>
