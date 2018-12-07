## ES-6

### BSXml

`Browser-Slim-XML`
`v3.6`

[源码](/modules/BSXml)
[测试](/test/BSXml)

这是一个关于模版引擎渲染、事件注册、输入框双向绑定、组件化开发的简单实现。该工具仅用作学习用途，如需在实际环境中使用还需要更多的测试与完善。

#### 文档

模版引擎渲染、事件注册、输入框双向绑定：

github.io: [https://bluesky-07.github.io/?BSXml-Template](https://bluesky-07.github.io/?BSXml-Template)

ihint.me: [https://pages.ihint.me/?BSXml-Template](https://pages.ihint.me/?BSXml-Template)

组件化开发：

github.io: [https://bluesky-07.github.io/?BSXml-Component](https://bluesky-07.github.io/?BSXml-Component)

ihint.me: [https://pages.ihint.me/?BSXml-Component](https://pages.ihint.me/?BSXml-Component)

----

### BSModule

`Browser-Simple-Module`
`v1.6`

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
`v1.2`

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

#### 文档

github.io: [https://bluesky-07.github.io/?BSFetch](https://bluesky-07.github.io/?BSFetch)

ihint.me: [https://pages.ihint.me/?BSFetch](https://pages.ihint.me/?BSFetch)

----

### BSBind

`Browser-Simple-DataBind`
`v0.1`

[源码](/modules/BSBind.js)
[测试](/test/BSBind)

这是一个关于数据绑定的简单实现。该工具仅用作学习用途，如需在实际环境中使用还需要更多的测试与完善。


#### 3 种绑定方式

- 本身可写可读，但源数据更新时会被更新
- 只读实时源数据
- 与源数据读写双向绑定

#### 文档

github.io: [https://bluesky-07.github.io/?BSBind](https://bluesky-07.github.io/?BSBind)

ihint.me: [https://pages.ihint.me/?BSBind](https://pages.ihint.me/?BSBind)

----

### BSEvent

`Browser-Simple-EventEmitter`
`v0.2`

[源码](/modules/BSEvent.js)
[测试](/test/BSEvent)

这是一个关于事件处理的简单实现。该工具仅用作学习用途，如需在实际环境中使用还需要更多的测试与完善。

#### 文档

github.io: [https://bluesky-07.github.io/?BSEvent](https://bluesky-07.github.io/?BSEvent)

ihint.me: [https://pages.ihint.me/?BSEvent](https://pages.ihint.me/?BSEvent)

----

### BSXml-Lite

`Browser-Slim-XML-Renderer`
`v2.6`

[源码](/modules/BSXmlLite.js)
[测试](/test/BSXmlLite)

这是 `Browser-Slim-XML` 的单文件版，包含模版引擎渲染、事件注册、输入框双向绑定功能，不包含组件化开发功能。该工具仅用作学习用途，如需在实际环境中使用还需要更多的测试与完善。

*Lite 版将不再更新，此版本功能实现与 BSXml v3.0 完全一致*