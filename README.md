## ES-6

### BSModule

`Browser-Simple-Module`
`v1.1`

[源码](/modules/BSModule.js)
[测试](/test/BSModule)

这是一个关于页面组件载入的简单实现。该工具仅用作学习用途，如需在实际环境中使用还需要更多的测试与完善。

#### 功能包含

- 模块载入
- 单页面模块间与多页面数据传输
- 页面路由

#### 文档

github.io: [https://bluesky-07.github.io/?BSModule](https://bluesky-07.github.io/?BSModule)

ihint.me: [https://pages.ihint.me/?BSModule](https://pages.ihint.me/?BSModule)

----

### BSFetch

`Browser-Simple-Fetch`
`v1.0`

[源码](/modules/BSFetch.js)
[测试](/test/BSFetch)

这是一个关于`fetch(...)`的简单封装。该工具仅用作学习用途，如需在实际环境中使用还需要更多的测试与完善。

#### 功能包含

- `BSFetch.head(...)`

- `BSFetch.get(...)`

- `BSFetch.post(...)`

- `BSFetch.put(...)`

- `BSFetch.delete(...)`

- `BSFetch.patch(...)`

- `BSFetch.options(...)`

- `BSFetch.fetch(...)`

#### 测试

在 [这里](/test/BSFetch) 有一份完整的由 `Spring Boot (2.0.4)` 搭建的完整后台，包含所有的配套请求的对应后台 API。

##### 运行部署

1. 安装 [JDK 1.8.*](https://www.oracle.com/technetwork/java/javase/downloads/index.html)

2. 安装 [Maven 3.*](http://maven.apache.org/)

3. 在 `/test/BSFetch` 下执行 `mvn spring-boot:run`，等待依赖环境部署完毕

4. 打开浏览器，访问 `http://localhost/?.html`，所有的 `html` 文件位于 `/test/BSFetch/src/main/resources/static` 下

5. 打开浏览器控制台查看结果

#### 文档

github.io: [https://bluesky-07.github.io/?BSFetch](https://bluesky-07.github.io/?BSFetch)

ihint.me: [https://pages.ihint.me/?BSFetch](https://pages.ihint.me/?BSFetch)