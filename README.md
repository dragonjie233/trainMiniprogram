# 小程序及服务端文档


| 项目相关   | 详细                                                         |
| ---------- | ------------------------------------------------------------ |
| 运行环境   | 微信小程序、Ubuntu 20.04.6 LTS                               |
| 技术和框架 | 主技术：JavaScript                                           |
|            | 小程序：微信小程序JS基础模板                                 |
|            | 服务端：Node.js、[Express](https://www.npmjs.com/package/express)、[Axios](https://www.npmjs.com/package/axios)、[MySQLs](https://www.npmjs.com/package/mysqls)、[EJS](https://ejs.bootcss.com/) |
|            | 后台页：JQuery 3.7.1、[Bootstrap 5.3.2](https://v5.bootcss.com/docs/getting-started/introduction/)、[Bootstrap-table](https://bootstrap-table-docs3.wenzhixin.net.cn/zh-cn/getting-started/)、[js-xlsx](https://docs.sheetjs.com/) |
| 开发工具   | [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)、[VSCode](https://code.visualstudio.com/) |


## 小程序目录和文件结构

```bash
train
├─ app.js #小程序逻辑
├─ app.json #小程序公共配置
├─ app.wxss #小程序公共样式表
├─ .eslintrc.js #用于检查js代码规则的配置（可忽略）
├─ project.config.json #用于保存开发工具的配置项（可忽略）
├─ project.private.config.json #同上
├─ sitemap.json #站点地图用于优化（可忽略）
├─ assets #资源文件
├─ custom-tab-bar #自定义tarBar
├─ utils #工具方法
│  └─ util.js
└─ pages #所有页面
   ├─ memory #记单词页面
   │  ├─ index.js #页面逻辑
   │  ├─ index.json #页面配置
   │  ├─ index.wxml #页面结构
   │  └─ index.wxss #页面样式表
   ├─ learnedWords #已学单词历史页面
   │  └─ #同上
   └─ index	#主页面
      └─ #同上
```



## 小程序相关说明

安装好微信开发者工具并打卡，点击加号符号，选择项目的目录，下边的后端服务选“不使用云服务”，确定即可。

如果你想运行小程序看看效果可以点击上边工具栏的“预览”，用微信扫码即可。

如果你想运行调试小程序，一样的，点击刚才“预览”旁边的“真机调试”，扫码测试，或者你可以用微信登录开发工具，然后在真机调试的小窗口点击自动调试，再点击下边的“编译并自动调试”，它就会自动推送到你的手机微信上面了，不需要手动扫码。

### 底部 tabBar 增加菜单项

因为使用了自定义tabBar，所以要增加菜单项需要在`/custom-tab-bar/index.js`文件的`data.list`里面增加或修改。

### 上线小程序

当你完成小程序开发，确认代码没有错误后，点击工具栏最右边的“上传”，把代码更新到微信里。

打开并登录[微信公众平台](https://mp.weixin.qq.com/)，在“管理”的“版本管理”中提交审核，等审核完毕后提交发布就OK了。

小程序的版本管理大致思路是`上传代码后的开发版本 -> 提交审核 -> 审核完毕后提交发布 -> 线上版本`。



## 小程序设计思路

### 用户相关

通过微信提供的 `wx.login` 接口获取临时登录凭证code，作用是向微信的code2Session API接口换取该用户在该小程序的唯一标识openid。

第一次打开小程序时会自动注册账号，然后让你进行第一次设置。



### 记单词功能

`1 获取服务器词库数据 -> 2 临时保存到变量中 -> 3 选择正确答案 -> 4 保存该条数据到本地储存 -> 5 变量中删除该条数据 -> 6 显示新内容 -> 7 回到第三步继续`

主页的“已学单词”和“今日所学”的数据和统计来自于本地储存。



## 服务端目录和文件结构

```bash
train_api
├─ app.js #服务端入口
├─ config.json #配置文件
├─ package.json #项目依赖包清单（可忽略）
├─ test.http #接口测试文件（可忽略）（需配合vscode的REST Client拓展使用）
├─ routes #服务端API接口路由
│  ├─ daka.js #打卡相关接口
│  ├─ dicts.js #词库相关接口
│  ├─ index.js #后台管理页相关接口
│  └─ user.js #用户相关接口
├─ static #静态文件资源
│  ├─ index.js
│  └─ login.js
└─ views #后台管理页
   ├─ index.ejs #后台主页面
   └─ login.ejs #登录页
```



## 服务端配置文件

```json
{
    "address": "0.0.0.0", // 服务端监听地址
    "port": 5001, // 服务端监听端口
    "apiPrefix": "/", // API接口的前缀
    "db": {
        "host": "127.0.0.1", // 数据库地址
        "port": 3306, // 数据库端口
        "user": "", // 用户
        "password": "", //密码
        "database": "train_api" // 数据库
    },
    "wxAppID": "", // 小程序AppID
    "wxAppSecret": "" // 小程序AppSecret
}
```



## 服务端相关说明

### 运行服务端项目

第一次运行服务端前，需要先执行 `npm install` 或 `npm i` 命令来安装项目需要用到的所有第三方依赖包。

依赖包安装完毕后，执行 `node app.js` 即可运行服务端项目了。

要注意的是！你一旦退出了SSH连接或控制台，运行的项目就会被关闭，因此你需要将项目运行放在后台进行，首先，安装好 screen 软件，执行 `screen -R trainapi` 进入另一个控制台后进入项目执行上面的运行命令即可看到项目开始运行了，按下 `Ctrl A + D` 快捷键退出控制台即可。

查看有哪些后台控制台在运行：`screen -ls`

进入后台控制台：`screen -R 名称`

关闭后台控制台：进入控制台后按 `Ctrl D` 或者直接 `kill PID进程号`



### 服务端域名证书问题

由于微信要求小程序请求的域名需要https协议，需给域名加SSL证书，所以服务器里面用acme.sh脚本给域名进行一键申请SSL证书。

目前服务器已经配置好了SSL，只需要在每次过期前进行续期即可，相关文档请自行查阅：https://www.cnblogs.com/RidingWind/p/15849756.html



## 服务端接口文档

### 部分固定内容说明

| 变量   | 注释                                                 |
| ------ | ---------------------------------------------------- |
| code   | 用于小程序判断执行情况的状态<br />0 为失败，1 为成功 |
| msg    | 用于描述状态的信息                                   |
| openid | 小程序的唯一标识                                     |



### 后台页面 /

```
### 后台管理页面
GET /index
```

```
### 后台登录接口
POST /admin/login
Content-Type: application/json

{
	user: 管理员账号,
	passwd: 管理员密码
}


返回数据:
{
	code: code,
	msg: msg
}
```



### 用户接口 /user

```
### 用户登录和自动注册
POST /user/login
Content-Type: application/json

{
	code: 小程序wx.login提供的code,
	date: 当前日期时间
}


自动注册时返回数据:
{
	code: code,
	openid: openid,
	status: 绑定状态
}
正常登录时返回数据:
{
	code: code,
	openid: openid,
	status: 绑定状态，0 为未绑定，1 为已绑定,
	nickName: 昵称,
	daka_total: 打卡统计,
	daka_today: 当天打卡状态，0 为未打卡，1 为已打卡
}
```

```
### 用户绑定信息
POST /user/bind
Content-Type: application/json

{
	openid: openid,
	name: 昵称,
}


返回数据:
{
	code: code,
	msg: msg
}
```

```
### 用户修改信息
POST /user/modify
Content-Type: application/json

{
	openid: openid,
	name: 修改后的昵称
}


返回数据:
{
	code: code,
	msg: msg
}
```

```
### 用户删除账号
POST /user/delete 未完成
```

```
### 获取用户列表 [管理员权限]
POST /user/list


返回数据: 
{
	code: 1,
	rows: [
		{
			id: 用户id,
			openid: openid,
			name: 昵称,
			status: 绑定状态，0 为未绑定，1 为已绑定,
			jointime: 注册日期
		},
		...
	]
}
```

### 词库接口 /dicts

```
### 加载词库数据
GET /dicts/load/:skip

:skip 是路径参数，用于跳过已学单词序号的数据


返回数据:
{
	code: 1,
	rows: [
		{
			id: 序号,
			word: 单词,
			pos: 词性,
			cn: 中文,
			left_pos: 左选项 词性,
			left_cn: 左选项 中文,
			right_pos: 右选项 词性,
			right_cn: 右选项 中文,
			key: 正确选项
		},
		...
	]
}
```

```
### 获取完整的词库数据 [管理员权限]
GET /dicts/list


返回数据:
{
	code: 1,
	rows: [
		{
			id: 序号,
			word: 单词,
			cn: 中文,
			pos: 词性,
			left_cn: 左选项 中文,
			left_pos: 左选项 词性,
			right_cn: 右选项 中文,
			right_pos: 右选项 词性
		}
	]
}
```

```
### 增加单词 [管理员权限]
POST /dicts/new
Content-Type: application/json

[
	{
		word: 单词,
		cn: 中文,
		pos: 词性,
		left_cn: 左选项 中文,
		left_pos: 左选项 词性,
		right_cn: 右选项 中文,
		right_pos: 右选项 词性
	}
]


返回数据:
{
	code: code,
	msg: msg
}
```

```
### 修改单词 [管理员权限]
POST /dicts/modify 未完成
```

### 打卡接口 /daka

```
### 打卡
POST /daka/
Content-Type: application/json

{
	openid: openid
}


返回数据:
{
	code: code,
	msg: msg
}
```

```
### 打卡数据列表 [管理员权限]
POST /daka/list


返回数据:
{
	code: code,
	rows: [
		{
			id: 序号,
			name: 用户昵称,
			date: 打卡日期时间
		},
		...
	]
}
```

```
### 查询某个用户的打卡数据
PSOT /daka/:uid/list 未完成
```
