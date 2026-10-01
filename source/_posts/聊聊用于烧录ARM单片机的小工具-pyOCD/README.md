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

更早之前写过一篇plog记录的一下「用OpenOCD解除MCU写保护的用法」：[Click me！](https://zhangkeliang0627.github.io/2024/10/14/使用DAPLink+OpenOCD解除MCU的Flash读保护/README/)（写的比较简单昂。

但感觉呢，OpenOCD虽然功能强大但是使用起来还是比较麻烦的，又要写cfg又要敲一长串命令的，不太适合日常使用，于是说，找到了更加简易更加面向CMSIS-DAP和ARM的`pyOCD`，应付常见的stm32、gd32等Cortex-M主流mcu足够了.

**`pyOCD`官方wiki：**https://pyocd.io/

一切的起因是因为我入手了Mac，还是一心想要把手头上部分的嵌入式工作迁移到Mac上进行开发，但是长路漫漫且艰险啊。

这两天回家了，实验性的把Win本留在了出租屋，带着Mac轻装上阵，其实我已经妥协十分多了。考虑到跨平台兼容性，现在的分工是，Mac做上位机开发，Win做下位机开发。于是带了单片机做下位机调试，发现还是逃不过需要给单片机做临时的烧录，虽然很简单，但是在Mac上依旧是一个比较折磨的事情啊。

花了十几分钟和豆老师深度探索了一番，得出了下面的结论：
**`pyOCD` + `DAPLink` 可以轻量的满足当前的调试需求。**

用起来还不赖，后续考虑把这一套方式集成到自开发的上位机当中，目前就简单记录一下常用到的指令集（晚期健忘症老人特别需要，LikeMe，笑。

## 开始


### 安装依赖

```bash
# install pyocd, python >= 3.9
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
# 更新pack资源索引
pyocd pack update

# 查看pyOCD支持的芯片pack，里面去找到你要烧录/调试的mcu
# bliutin -> 自带的 / pack -> 需要下载
pyocd list --targets

# 安装指定包依赖
pyocd pack install stm32f4
pyocd pack install stm32f1
```

Ps：没有找到pack的，可以去对应的mcu的官网上下载.pack文件，然后使用`--pack`来进行引用对应算法，问题不大。

<figure>
<img src="/images/聊聊用于烧录ARM单片机的小工具-pyOCD/image-2.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

#### 查看DAPLink在线状态

```bash
# 列出当前所有插上的调试器
pyocd list

# 输出会看到调试器的序列号；多个调试器时，可以用 `--probe` 指定序列号，防止刷错板子
pyocd flash -t stm32f401retx app.hex --probe 0483:5740:xxxxxxxx
```

#### 查看当前DAPLink和MCU的连接

```bash
pyocd cmd -t stm32f401retx

# q + Enter 退出
```

```bash
# 探测芯片信息，读芯片 ID、内核版本
pyocd info
```

```bash
# 软件复位，复位之后内核继续运行
pyocd reset

# 复位并且立刻halt停机，芯片复位后不跑代码，停在复位入口
pyocd reset -h
```


#### 固件烧录

```bash
# 烧录.hex文件
pyocd flash --target stm32f401retx yourFirmware.hex
pyocd flash -t stm32f401retx yourFirmware.hex

# 烧录.bin文件（需要指定烧录地址，默认为0x08000000
pyocd flash --target stm32f401retx --address 0x08000000 yourFirmware.bin

# 校验，将烧录到mcu的内容重新读出来和固件进行字节比对
pyocd flash --target stm32f401retx yourFirmware.hex --verify

# 补充烧录策略：全片擦除后再烧录 + 校验
pyocd flash -t stm32f401retx yourFirmware.hex --erase chip --verify

# 指定pack算法进行烧录
pyocd flash -t gd32f103c8 --pack ./packs/GigaDevice.GD32F10x_DFP.2.3.0.pack app.elf --verify
```

<figure>
<img src="/images/聊聊用于烧录ARM单片机的小工具-pyOCD/image-1.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

#### 擦除全片闪存

```bash
# 可以用来解芯片写保护
pyocd erase -t stm32f401retx --mass

# 常规Flash全局擦除
pyocd erase -t stm32f401retx --chip 

# 擦除指定某一个扇区（适合只想擦部分flash，保留其他区域
pyocd erase -t stm32f401retx --sector 0
```

如果烧录的程序禁用了SWD，芯片变砖，此时有两种拯救办法：

第一种，硬件上有引出boot0 & boot1，让boot0 = 1 & boot1 = 0，然后上电或者复位，让mcu进入出厂bootloader，此时就可以重新正常的刷写程序；

第二种，硬件上有NRST硬复位引脚引出，连接到DAP-Link的NRST，所以此时要连接4根线，NRST、DIO、SCK、GND，然后敲命令`pyocd erase -t stm32f401retx --chip --connect under-reset`，在原来的常规擦除基础上加入`--connect under-reset`，即可对mcu进行全片擦除啦。

### pyocd.yaml的编写
如果你觉得每次烧录又要指定芯片、又要指定擦除模式、是否校验、地址等，非常的麻烦的话，你可以尝试写一份pyocd.yaml，把它放到工程的根目录下，然后你就可以去到工程根目录下，直接`pyocd flash xxx.bin`即可：

```yaml
# pyocd.yaml
# 按需擦扇区(sector)、开启校验、bin文件默认烧录地址0x08000000

target_override: stm32f401retx

flash:
  verify: true 
  base_address: 0x08000000
#   erase: chip # 如果需要全局擦除就打开该项

# 指定外部DFP pack，多个pack用数组
# pack:
#   - ./packs/GigaDevice.GD32F10x_DFP.2.3.0.pack

```

## 写在后面
目前就用上这么点功能，后面再接触吧，感觉可玩性还是蛮高的，激起了我做上位机的欲望（嘻！

### 鸣谢
- pyOCD官方：https://github.com/pyocd/pyocd
