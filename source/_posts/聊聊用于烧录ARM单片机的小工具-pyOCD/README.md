---
title: 聊聊用于烧录ARM单片机的小工具-pyOCD
excerpt: MacOS的嵌入式开发自救指南...helpme!
tags: [Python, pyOCD]
index_img: /images/聊聊用于烧录ARM单片机的小工具-pyOCD/pyOCD.png
banner_img: /images/聊聊用于烧录ARM单片机的小工具-pyOCD/pyOCD.png

categories: Study Page
comment: 'twikoo'
date: 2026-5-1 14:01:00

---

### 聊聊用于烧录ARM单片机的小工具-pyOCD
### Author：@kkl

<p class="note note-warning">本文等待施工，或长期维护中🧑‍🌾🧑‍🌾!</p>

---

## 写在前面

`pyOCD`官方wiki：https://pyocd.io/

一切的起因是因为我入手了Mac，还是一心想要把手头上部分的嵌入式工作迁移到Mac上进行开发，但是长路漫漫且艰险啊。

这两天回家了，实验性的把Win本留在了出租屋，带着Mac轻装上阵，其实我已经妥协十分多了。考虑到跨平台兼容性，现在的分工是，Mac做上位机开发，Win做下位机开发。于是带了单片机做下位机调试，发现还是逃不过需要给单片机做临时的烧录，虽然很简单，但是在Mac上依旧是一个比较折磨的事情啊。

花了十几分钟和豆老师深度探索了一番，得出了下面的结论：
**`pyOCD` + `DAPLink` 可以轻量的满足当前的调试需求。**

用起来还不赖，后续考虑把这一套方式集成到自开发的上位机当中，目前就简单记录一下常用到的指令集（晚期健忘症老人特别需要，LikeMe，笑。

## 开始


### 安装依赖

```bash
# install pyocd, python >= 3.7
pip install pyocd
```

### 指令操作

下面收录一些我常用的对ARM Cortex-M单片机的操作指令：

#### 查看当前DAPLink设备

```bash
# 查看系统是否识别出DAPLink连接
pyocd list
```

<figure>
<img src="/images/聊聊用于烧录ARM单片机的小工具-pyOCD/image.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

#### 安装包依赖

```bash
# 查看支持的包
pyocd list --targets

# 安装指定包依赖
pyocd pack install stm32f4
pyocd pack install stm32f103rc
```

#### 查看当前DAPLink和MCU的连接

```bash
pyocd cmd -t stm32f401retx

# q + Enter 退出
```

#### 固件烧录

```bash
# 烧录.hex文件
pyocd flash --target stm32f401retx yourFirmware.hex

# 烧录.bin文件（需要指定烧录地址，默认为0x08000000
pyocd flash --target stm32f401retx --address 0x08000000 yourFirmware.bin
```

<figure>
<img src="/images/聊聊用于烧录ARM单片机的小工具-pyOCD/image-1.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

#### 擦除全片闪存

```bash
pyocd erase --mass --target stm32f401retx

pyocd erase -t stm32f401retx --chip
```


## 写在后面
目前就用上这么点功能，后面再接触吧，感觉可玩性还是蛮高的，激起了我做上位机的欲望（嘻！

### 鸣谢
- pyOCD官方：https://github.com/pyocd/pyocd
