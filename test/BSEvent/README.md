## BSBind
   
`Browser-Simple-EventEmitter`
`v0.2`

### 测试

#### /test/BSEvent/BSEvent.html

##### 目的：测试事件的一次性注册、持久性注册、触发、解除注册

##### 过程：

1. 访问 `http://localhost/test/BSEvent/BSEvent.html`

2. 打开控制台可以看见一条输出：`success`，表示一次性注册功能测试通过

3. 在 message 输入框中任意修改字符串，点击 `emit('message')` 按钮，可以看见左侧的输入区域内输出了刚刚输入的字符串，表示单事件注册测试通过

4. 控制台中有一条输出：`this message should not been printed again`，且不再出现，表示解除注册测试通过

5. 在 a 与 b 输入框中任意输入数字，点击 `emit('message')` 按钮，可以看到关于 a 与 b 的四条计算式子，表示多事件注册测试通过

### 文档

github.io: [https://bluesky-07.github.io/?BSEvent](https://bluesky-07.github.io/?BSEvent)

ihint.me: [https://pages.ihint.me/?BSEvent](https://pages.ihint.me/?BSEvent)