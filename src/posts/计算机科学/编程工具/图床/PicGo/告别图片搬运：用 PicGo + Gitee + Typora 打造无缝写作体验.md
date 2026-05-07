---
title: 告别图片搬运：用 PicGo + Gitee + Typora 打造无缝写作体验
cover: /assets/image-20260419140026836.png
icon: file
author: 诚
date: 2026-04-19
category:
  - PicGo
  - Typora
  - 图床
tag:
  - PicGo
  - Typora
  - 图床
# 此页面会在文章列表置顶
sticky: false
# 此页面会出现在星标文章中
star: false
# 你可以自定义页脚
footer: 
# 你可以自定义版权信息
copyright: 无版权
---

# 告别图片搬运：用 PicGo + Gitee + Typora 打造无缝写作体验

## 一、为什么你的 Markdown 文档总在“流浪”？

如果你经常用 Markdown 写作，一定遇到过这样的困扰：在本地写得图文并茂的文章，一到要发布时就“面目全非”——图片全部变成裂图。这不是 Markdown 的错，而是图片存储方式出了问题。

![裂图示例](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/20260419134644574.png)

**Markdown 的图片本质是链接引用**。当你使用本地图片路径时，这个文档就绑死在了你的电脑上。发给别人？不行。换个设备打开？不行。传到博客平台？更不行。

**真正的解决方案只有一个：图床**。把图片上传到云端服务器，生成一个永久可访问的链接。这样无论在哪里打开你的 Markdown 文档，图片都能正常显示。今天，我就带你用三款免费工具，搭建属于自己的专属图床系统。

## 二、选对工具：为什么是这套组合拳？

在众多图床方案中，我最终选择了 **PicGo + Gitee + Typora** 这个组合，原因如下：

### 2.1 Gitee：最合适的国内“图床”仓库

- **免费稳定**：Gitee 是国内代码托管平台，对个人用户提供 5GB 存储空间
- **访问速度快**：服务器在国内，图片加载速度远超 GitHub
- **无流量费用**：不像云存储服务会产生流量费用
- **管理方便**：基于 Git 版本管理，误删可恢复

> 虽然 Gitee 官方不鼓励将其作为纯图床使用，但合理存放博客图片等资源是被允许的。注意：单个图片建议小于 1MB，大图片可先压缩。

### 2.2 PicGo：图片上传的“智能管家”

- **一键上传**：截图/复制后自动上传到云端
- **多图床支持**：可同时配置多个图床备份
- **链接自动转换**：上传后自动生成 Markdown 格式链接
- **批量操作**：支持多图同时上传

### 2.3 Typora：写作体验的“终极形态”

- **所见即所得**：最优雅的 Markdown 编辑器
- **无缝集成**：与 PicGo 深度集成，粘贴即上传
- **跨平台同步**：文档+图片链接，实现真正的多端编辑

## 三、实战开始：30分钟搭建完整图床系统

### 3.1 第一步：创建你的“图片仓库”

#### **1. 注册 Gitee 账号**

访问 [gitee.com](https://gitee.com/)，用手机号或邮箱注册。如果已有 GitHub 账号，可直接导入。

![image-20260419134918986](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419134918986-1778164089525-3.png)

#### **2. 新建仓库**

- 点击右上角 ➕ → “新建仓库”
- 仓库名称：`image-bed`（或其他你喜欢的名字）
- 路径：会自动生成，建议用英文
- 描述：可选填，如“个人博客图床”
- **重要设置**： 开源选择“公开”（私有仓库外网无法访问） 初始化仓库：勾选“使用 Readme 文件初始化” 分支模型：选择“单分支模型”
- 点击“创建”

![image-20260419135059013](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419135059013-1778164093639-6.png)

![image-20260419135123540](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419135123540-1778164095796-9.png)

#### **3. 获取访问令牌（Token）**

- 点击右上角头像 → “设置”
- 左侧菜单选择“私人令牌”
- 点击“生成新令牌”
- 令牌描述：填“PicGo 图床”
- 权限选择：**只勾选 projects**
- 输入密码确认
- **立即复制生成的令牌**（关闭后无法再次查看）

![image-20260419135345637](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419135345637-1778164098607-12.png)

### 3.2 第二步：配置上传神器 PicGo

#### **1. 安装 PicGo**

- 前往 PicGo 发布页 : [https://github.com/Molunerfinn/PicGo/releases](https://github.com/Molunerfinn/PicGo/releases)
- 下载对应系统的最新版本（Windows 选 .exe，Mac 选 .dmg）
- 按提示安装

#### **2. 安装 Gitee 插件**

打开 PicGo → 左侧“插件设置” → 搜索“gitee”

- 选择 `gitee-uploader`插件（作者：lizhuang，目前版本 1.x）
- 点击安装
- 如提示需安装 Node.js，按链接下载安装后重启 PicGo

![image-20260419135552992](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419135552992-1778164101842-15.png)

#### **3. 配置图床参数**

进入“图床设置” → 选择“gitee”，填写：

| 参数       | 填写内容           | 示例                  |
| ---------- | ------------------ | --------------------- |
| repo       | 用户名/仓库名      | `zhangsan/image-bed`  |
| branch     | 分支名             | `master`              |
| token      | 刚才复制的私人令牌 | `a1b2c3d4e5f6...`     |
| path       | 图片存储路径       | `blog-images`（可选） |
| customPath | 提交消息           | 默认即可              |

![image-20260419135756067](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419135756067-1778164105532-18.png)

#### **4. 设为默认并优化设置**

- 点击“设为默认图床”
- 在“PicGo设置”中开启： ✅ 时间戳重命名（避免文件名冲突） ✅ 上传后自动复制链接 ✅ 开机自启（可选） ❌ 显示上传进度（避免频繁弹窗）

#### **5. 测试上传**

- 拖拽一张图片到 PicGo 窗口
- 上传成功会提示并自动复制链接
- 到 Gitee 仓库查看是否已出现图片文件

![image-20260419140026836](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419140026836-1778164108921-21.png)

### 3.3 第三步：连接 Typora 实现自动化

#### **1. 确保 Typora 已安装**

从 [typora.io](https://typoraio.cn/)下载安装，新版本已收费，可下载历史免费版本或支持正版。

![image-20260419140014935](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419140014935-1778164112043-24.png)

#### **2. 配置图片上传**

文件 → 偏好设置 → 图像：

- 插入图片时：选择“上传图片”
- 上传服务：选择“PicGo (app)”
- PicGo 路径：浏览选择 PicGo 安装位置 Windows 默认：`C:\Program Files\PicGo\PicGo.exe` 或通过任务栏 PicGo 图标右键 → 打开配置文件查看路径

![image-20260419140351489](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419140351489-1778164115044-27.png)

#### **3. 验证配置**

点击“验证图片上传选项”，出现成功提示即配置完成。



#### **4. 开始无缝写作**

现在，当你：

- 截图后直接粘贴到 Typora
- 拖入本地图片到 Typora
- 复制网络图片粘贴到 Typora

图片都会**自动上传到 Gitee**，链接自动替换为图床链接。你只需要专注写作，其他的一切自动完成。

![image-20260419140823557](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20260419140823557-1778164118243-30.png)

## 四、进阶技巧与注意事项

### 4.1 解决 Gitee 的 1MB 限制

Gitee 对超过 1MB 的图片支持不佳，解决方法：

**方案A：压缩图片**

- 工具推荐： Windows：Caesium、TinyPNG Mac：ImageOptim、Squoosh 在线：iloveimg.com

**方案B：混合图床策略**

- 小图片（<1MB）：用 Gitee
- 大图片（≥1MB）：用其他图床
- 在 PicGo 中可配置多个图床，手动选择上传

**方案C：使用 GitHub 作为备用**

- GitHub 无单文件大小限制
- 但国内访问需搭配 CDN（如 jsDelivr）
- 适合技术博客图片

### 4.2 图片管理最佳实践

1. **分类存储**：在 `path`中按年月分类，如 `2024/04`
2. **规范命名**：用时间戳或描述性名称
3. **定期备份**：Gitee 仓库可定期克隆到本地
4. **清理无用图片**：定期删除未使用的图片

### 4.3 常见问题排查

| 问题            | 可能原因         | 解决方案                        |
| --------------- | ---------------- | ------------------------------- |
| 上传失败        | Token 失效或错误 | 重新生成 Token 并更新配置       |
| 图片不显示      | 仓库设为私有     | 在仓库设置中改为公开            |
| Typora 提示失败 | PicGo 未启动     | 启动 PicGo 并检查路径           |
| 链接 404        | 路径填写错误     | 检查 repo 格式：`用户名/仓库名` |

### 4.4 安全须知

1. **Token 是密钥**：不要泄露或在代码中明文存储
2. **公开仓库**：所有人都能看到图片，勿传隐私内容
3. **合规使用**：不上传侵权、违规内容
4. **备份意识**：重要图片在本地保留副本

## 五、从工具到习惯：真正的“图床自由”

完成以上配置后，你的写作流程将彻底改变：

**从前**：

截图 → 保存到桌面 → 命名 → 在 Typora 中插入 → 调整大小 → 发布时重新上传

**现在**：

截图 → 粘贴到 Typora（自动上传、自动插入链接、自动调整格式）

**效率提升至少 300%**。

更棒的是：

- 在 Obsidian、思源笔记、VS Code 中同样可用
- 手机端 Markdown 编辑器也能显示图片
- 团队协作时不再需要打包发送图片文件
- 博客迁移、平台切换再无障碍

## 六、开始你的“自由写作”之旅

技术只是工具，真正的价值在于解放生产力。这套方案我已经使用了两年，写了上百篇技术博客，从未因图片问题困扰。

**最后的小建议**：

1. 今天花 30 分钟配置一次，未来节省无数小时
2. 先从一篇旧文章迁移开始，感受无缝体验
3. 将这个方案分享给同样写作的朋友

真正的“图床自由”不是免费，而是**无感**——你感受不到它的存在，但它一直在为你工作。

现在，开始你的第一篇文章吧。当你粘贴第一张图片，看到它自动变成链接时，你会感受到那种久违的顺畅感。写作，本就该如此简单。

------

*注：本文介绍的方法基于个人使用经验，Gitee 相关政策可能变更，请以官方文档为准。对于重要图片，建议多处备份。*