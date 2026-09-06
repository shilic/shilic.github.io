# 原神风物之琴自动演奏器`SkyPiano`使用指南

## 前言

本项目一开始是来自于作者在`2024`年参加的一个开源项目：[BetterGI · 更好的原神](https://github.com/babalae/better-genshin-impact)；简单来讲，`BetterGI`是一个基于计算机视觉技术，意图让原神变的更好的项目；可以自动过剧情、自动拾取、自动钓鱼、自动打牌、自动伐木、自动挖矿、运行自定义脚本(基于webview2)等。

而本项目的最第一版，就是在`BetterGI`之上，使用`javascript`编写，实现了最简单神风物之琴自动演奏器功能。

第一版项目地址: [https://github.com/shilic/YuanQin](https://github.com/shilic/YuanQin)。

示例如下：

<BiliBili bvid="BV1ZokqYmEQE" />

[https://www.bilibili.com/video/BV1ZokqYmEQE/](https://www.bilibili.com/video/BV1ZokqYmEQE/)

最初版本存在很多问题，最主要的问题是，无法暂停，并且只支持一种格式的乐谱，无法手动选择乐谱。

于是，就有了重构的想法，本项目就诞生了，使用`WPF`重写了一遍的原神风物之琴自动演奏器`SkyPiano`。

## 乐谱准备

本项目主要支持两种格式的原琴乐谱：

### 1.MIDI格式(不推荐)

MIDI格式是音乐界的标准格式，文件中描述了如何演奏一段音乐的所有必要信息，包括乐器、音轨、音符、时长、间隔等。

直接导入到项目的 `appData/MyScore`文件夹，重启后，软件即可加载新的乐谱。

推荐在网站：[https://www.midishow.com/](https://www.midishow.com/)上下载MIDI文件(可能需要付费)。

> [!WARNING]
>
> 使用这种方式，目前存在一些问题，因为原神的演奏是21键，范围只有 `C3` 到 `C4` ，再到`C5`的 21 个按键，超出范围的音符将无法演奏。

### 2.原琴博主

这是我最推荐的方式，直接到`bilibili`的各大原琴博主下边去找谱子即可。因为他们重新编排了乐谱，使之适配了原神的21键。

例如这首最经典的 One Last Kiss  [https://www.bilibili.com/video/BV1WU4y1X7LS](https://www.bilibili.com/video/BV1WU4y1X7LS)，到视频简介中将谱子拿过来即可。

格式如下：

```json
{
    "name":"乐曲名称",
    "short" :90,
    "pause":200,
    "longPause":200,
    "split":"括号",
    "toneStr":"将乐谱复制到这里即可"
}
```

直接将乐谱复制过来即可，再调整一下播放速度，注意，`json`中的字符串不允许换行，需要手动合并成一行字符串。

这里简单说明一下这种格式的分隔符都是什么个意思，

| 分隔符   | 含义             |
| -------- | ---------------- |
| (DH)     | 表示D和H同时按下 |
| /        | 表示一个长间隔   |
| 单个字母 | 单个音符         |

实际上非常简单，复制过来即可。我在`appData/MyScore`文件夹中提供了一些预留的乐谱，可直接播放。

## 运行

使用VS，编译源代码。

目前仍在测试中，不满足释放的标准，还需要多轮迭代，故只推荐源代码运行。

## 暂停/播放

使用`ctrl`+`alt`+`space(空格)`按键即可暂停和播放

## 项目演示

<BiliBili bvid="BV14vbp6UE8P" />

[https://www.bilibili.com/video/BV14vbp6UE8P](https://www.bilibili.com/video/BV14vbp6UE8P)

## 项目地址

[https://github.com/shilic/SkyPiano](https://github.com/shilic/SkyPiano)