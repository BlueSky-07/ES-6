## BSModule

`Browser-Simple-Module`
`v1.2`

### 测试

#### /test/BSModule/diffpage

##### 目的：测试多页面的数据传输

##### 过程：

1. 访问 `http://localhost/test/BSModule/diffpage/1.html`，点击页面上的 `goto(2)` 按钮

2. 页面跳转至 `http://localhost/test/BSModule/diffpage/2.html`，可以看到含有 `{msg: 'this data is from page 1'}` 的信息

3. 点击页面上的 `goto(1)` 按钮

4. 页面跳转至 `http://localhost/test/BSModule/diffpage/1.html`，可以看到含有 `{msg: 'this data is from page 2'}` 的信息

----

#### /test/BSModule/router

##### 目的：

1. 测试路由功能

2. `index.html` 的强制跳转

##### 过程：

1. 访问 `http://localhost/test/BSModule/router/router.html`

2. 点击页面上的链接或按钮，可以看到地址的变动，同时页面上方的提示语、页面下方的数据区域均发生相应变化

3. 点击浏览器后退按钮，可以看到页面后退至上一路径，同时页面上方的提示语、页面下方的数据区域均发生相应变化回去

4. 访问 `http://localhost/test/BSModule/router/index.html`，页面自动从 `/index.html#/` 跳转至 `/#/`

----

#### /test/BSModule/samepage-diffmodules

##### 目的：测试单页面的不同模块的载入及数据传输

##### 过程：

1. 访问 `http://localhost/test/BSModule/samepage-diffmodules/BSModule.html`

2. 点击页面上的 `a` 按钮，可以看到含有 `module_a has been added.` 的提示语，及含有 `{"a":?}` 的数据信息

3. 点击页面上的 `b` 按钮，可以看到含有 `module_b has been added.` 的提示语，及含有 `{"b":?}` 的数据信息

4. 重复上述操作，得到相应的变化

----

#### /test/BSModule/samepage-diffsrcs

##### 目的：测试单页面的相同模块不同路径的载入及数据传输

##### 过程：

1. 访问 `http://localhost/test/BSModule/samepage-diffsrcs/BSModule.html`

2. 点击页面上的 `a` 按钮，可以看到含有 `module form a.js has been added.` 的提示语，及含有 `{"a":?,"b":?,"_src_":"a"}` 的数据信息

3. 点击页面上的 `b` 按钮，可以看到含有 `module form b.js has been added.` 的提示语，及含有 `{"a":?,"b":?,"_src_":"b"}` 的数据信息

4. 重复上述操作，得到相应的变化

----

#### /test/BSModule/router-patharg

##### 目的：测试带参数路径的路由功能

##### 过程：

1. 访问 `http://localhost/test/BSModule/router_patharg/BSModule.html`

2. 分别点击不同的链接与按钮可以看到相应的数据变化，同时地址也发生变化

### 文档

github.io: [https://bluesky-07.github.io/?BSModule](https://bluesky-07.github.io/?BSModule)

ihint.me: [https://pages.ihint.me/?BSModule](https://pages.ihint.me/?BSModule)