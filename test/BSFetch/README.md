## BSFetch

`Browser-Simple-Fetch`
`v1.1`

### 测试

*以下测试需要运行 Spring Boot 配套后台*

#### 运行部署

1. 安装 [JDK 1.8.*](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

2. 安装 [Maven 3.*](http://maven.apache.org/)

3. 在 `/test/BSFetch` 下执行 `mvn spring-boot:run`，等待依赖环境部署完毕

4. 打开浏览器，访问 `http://localhost/?.html`，所有的 `html` 文件位于 `/test/BSFetch/src/main/resources/static` 下

5. 打开浏览器控制台查看结果

----

#### head.html

##### 目的：测试 `HEAD` 请求，对应 `BSFetch.head(...)` 方法

##### 过程：

1. 访问 `http://localhost/head.html`

2. 在浏览器控制台查看 4 条预设请求的结果和对应的 `Request` 及 `Response` 信息，在服务端控制台查看第 4 条请求向服务端发送的数据是 `hello`

----

#### get.html

##### 目的：测试 `GET` 请求，对应 `BSFetch.get(...)` 方法

##### 过程：

1. 访问 `http://localhost/get.html`

2. 在浏览器控制台查看 2 条预设请求的结果和对应的 `Request` 及 `Response` 信息

3. 不在输入框中输入字符，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `no valid message received!`

4. 在输入框中输入任意字符，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `received: ?`

5. 点击 `google.png` 按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面载入了一张图片

6. 点击 `text.txt` 按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面载入了一段文本

----

#### post.html

##### 目的：测试 `POST` 请求，对应 `BSFetch.post(...)` 方法

##### 过程：

1. 访问 `http://localhost/post.html`

2. 在浏览器控制台查看 1 条预设请求的结果和对应的 `Request` 及 `Response` 信息

3. 不在输入框中输入字符，分别从右侧下拉框中选择请求的数据格式，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `no valid message received!`

4. 在输入框中输入任意字符，分别从右侧下拉框中选择请求的数据格式，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `received: ?`

5. 不选择文件，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `no valid file received!`

5. 选择文件，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `received: {文件名}, size: {文件大小} bytes.`

----

#### put.html

##### 目的：测试 `PUT` 请求，对应 `BSFetch.put(...)` 方法

##### 过程：

1. 访问 `http://localhost/put.html`

2. 在浏览器控制台查看 1 条预设请求的结果和对应的 `Request` 及 `Response` 信息

3. 随机决定不在输入框中输入字符或在输入框中输入任意字符，随机从右侧下拉框中选择请求的数据格式，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，在服务端控制台查看后台存储值的变化，同时页面有 4 种提示：

> created: 存储了一个新的值
>
> updated: 存储的值被修改
>
> no changes: 存储的值未被修改
>
> unknown: 其他情况

*关于 `PUT` 请求规范可参阅 [此处](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/PUT)*

4. 不选择文件，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `no changes, ...`，服务端控制台提示 `no valid file received!`

5. 选择文件，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `updated, ...`，服务端控制台提示 `received: {文件名}, size: {文件大小} bytes.`

----

#### delete.html

##### 目的：测试 `DELETE` 请求，对应 `BSFetch.delete(...)` 方法

##### 过程：

1. 访问 `http://localhost/delete.html`

2. 在浏览器控制台查看 1 条预设请求的结果和对应的 `Request` 及 `Response` 信息

3. 随机决定不在输入框中输入字符或在输入框中输入任意字符，随机从右侧下拉框中选择请求的数据格式，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，在服务端控制台查看后台接收到的参数，同时页面有 4 种提示：

> will be deleted soon: 将会在不久后删除
>
> deleted, received following detail: 已删除，同时服务器提供了信息
>
> deleted: 已删除，服务器没有提供信息
>
> unknown: 其他情况

*关于 `DELETE` 请求规范可参阅 [此处](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/DELETE)*

#### 已知 BUG：

1. 数据格式为 `'default'` ，即将`content-type` 设为 `application/x-www-form-urlencoded` ，此时后台无法接收到数据

----

#### patch.html

##### 目的：测试 `PATCH` 请求，对应 `BSFetch.patch(...)` 方法

##### 过程：

1. 访问 `http://localhost/patch.html`

2. 在浏览器控制台查看 1 条预设请求的结果和对应的 `Request` 及 `Response` 信息

3. 随机决定不在输入框中输入字符或在输入框中输入任意字符，随机从右侧下拉框中选择请求的数据格式，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，在服务端控制台查看后台存储值的变化，同时页面有 2 种提示：

> patched: 存储的值被修改
>
> unknown: 其他情况

*关于 `PATCH` 请求规范可参阅 [此处](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/PATCH)*

4. 不选择文件，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `unknown, ...`，服务端控制台提示 `no valid file received!`

5. 选择文件，点击右侧的提交按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面提示 `patched, ...`，服务端控制台提示 `received: {文件名}, size: {文件大小} bytes.`

----

#### options.html

##### 目的：测试 `OPTIONS` 请求，对应 `BSFetch.options(...)` 方法

1. 访问 `http://localhost/options.html`

2. 在浏览器控制台查看 2 条预设请求的结果和对应的 `Request` 及 `Response` 信息

*关于 `OPTIONS` 请求说明可参阅 [此处](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS)*

----

#### cookie.html

##### 目的：测试 `cookies` 的传输、服务端的读取与设置

1. 访问 `http://localhost/cookie.html`

2. 在浏览器控制台查看 4 条预设请求的结果和对应的 `Request` 及 `Response` 信息

----

#### header.html

##### 目的：测试请求的 `headers` 的设置与读取

1. 访问 `http://localhost/header.html`

2. 在浏览器控制台查看 2 条预设请求的结果和对应的 `Request` 及 `Response` 信息

----

#### global.html

##### 目的：测试`BSFetch`的全局注册与使用

1. 访问 `http://localhost/global.html`

2. 点击 `google.png` 按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面载入了一张图片

----

#### error.html

##### 目的：测试`BSFetch`出错时的返回值

1. 访问 `http://localhost/error.html`

2. 在浏览器控制台查看 1 条预设请求的结果和对应的 `Request` 及 `Response` 信息

----

#### prefix.html

##### 目的：测试实例化`BSFetch`的自动添加 URL 前缀

1. 访问 `http://localhost/prefix.html`

2. 点击 `google.png` 按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面载入了一张图片

3. 点击 `text.txt` 按钮，在浏览器控制台查看到此次请求的 `Request` 及 `Response` 信息，页面载入了一段文本

----

在以上所有测试过程中可将浏览器开发者工具切换至“网络”标签以查看有关请求的详细信息

### 文档

github.io: [https://bluesky-07.github.io/?BSFetch](https://bluesky-07.github.io/?BSFetch)

ihint.me: [https://pages.ihint.me/?BSFetch](https://pages.ihint.me/?BSFetch)