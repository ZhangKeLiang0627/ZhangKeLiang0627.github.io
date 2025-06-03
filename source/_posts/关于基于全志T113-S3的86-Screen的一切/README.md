---
title: 关于「基于全志T113-S3的86-Screen」的一切
excerpt: 今天！一起来复刻🙆！
tags: [Allwinner, T113-S3, Ubuntu]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: images/关于基于全志T113-S3的86-Screen的一切/image-1.jpg
banner_img: images/关于基于全志T113-S3的86-Screen的一切/image.jpg
categories: Project Page
comment: 'twikoo'
# hide: true
date: 2025-2-1 15:10:00
---

### 关于基于全志T113-S3的86-Screen的一切
### Author: kkl

{% note warning %}

该笔记目前处于积极开发阶段。

{% endnote %}

{% note info %}
**往期相关文章总览：**
- [全志T113-S3的TinaLinux编译流程记录](https://zhangkeliang0627.github.io/2024/11/24/全志T113-S3的TinaLinux编译流程记录/README/)
- [在全志T113-S3的TinaLinux上运行LVGL](https://zhangkeliang0627.github.io/2024/12/22/在全志T113-S3的TinaLinux上运行LVGL/README/)
- [在全志T113-S3的TinaLinux上添加驱动支持](https://zhangkeliang0627.github.io/2025/01/20/在全志T113-S3的TinaLinux上添加驱动支持/README/)
{% endnote %}

{% note success %}
hahaha标题有点吹大了哈，虽然说是关于一切，但再细节的东西的说不完的。但是我会把我上手以后摸索的整个心路历程尽量地都详细展现出来。本篇文章围绕着[基于T113-S3的86-Screen](https://oshwhub.com/fanhuacloud/t113-s3-86panel)的复现展开，项目作者by[@FanHuaCloud](https://oshwhub.com/fanhuacloud/works)
{% endnote %}


{% gi 2 2 %}

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-1.jpg" alt="snapshot-1" width = "400" height = "200" style="border-radius: 10px;">
<figcaption>snapshot-1</figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-2.jpg" alt="snapshot-2" width = "400" height = "200" style="border-radius: 10px;">
<figcaption>snapshot-2</figcaption>
</figure>

{% endgi %}

---

### 写在前面

**T113-S3**是**全志**的一款非常不错的能够跑Linux系统的Soc，该芯片采用**双核A7**，**主频高达1.2GHz**，具备**高效能**和**低功耗**的特点，**片上内存128MB**，**支持硬件解码**，和D1s Pin to Pin，支持相互替换支持全志提供的Tina Linux SDK，文档齐全，对于DIY玩家来说用于制作一些带显示屏的小设备是非常完美了。

前阵子在“海鲜市场”低价入了韦东山的T113-S3的开发板，经过一番摸索以后发现了TinaLinux这个新奇的东西，听说是全志基于`Openwrt`自研的系统（被戏谑为全志家的小女儿。

前面已经折腾得够多韦东山的全志T113-S3开发板了，从内核编译、运行LVGL到新增驱动都体验了个遍，现在咱们想要开发属于自己的基于全志T113-S3的设备了。正好遇见了这个优秀的开源项目**基于T113-S3的86-Screen**，作者事无巨细得交代了从零到一搭建内核编译的平台并且开源了详细的文档和虚拟机，非常适合初学者上手学习（感谢@FanHuaCloud对此进行开源，事不宜迟，我们直接开始！


**_本篇文章将简述如何从零到一复刻「基于T113-S3的86-Screen」。_**

#### 我的环境

- 虚拟机：VMware Ubuntu 20.04

{% note success %}
最近才得知，在年尾的时候VMware被博通并购了，可以放开免费使用啦！所以本次想要尝试一下使用VMware的虚拟机平台进行操作！
{% endnote %}

{% note secondary %}
> 虚拟机获取链接: https://pan.baidu.com/s/1INtes0puPvBo2v6UM7_SBA 提取码: u4vt 

这个虚拟机是交流群中分享的，如果你不想折腾内核的话，可以直接拿来用，或者你想学习一下内核编译修改配置流程，可以按照作者的教程来（在立创硬件开源的附件：`Tina SDK构建指南`）。

或者戳这里获取：[Tina SDK构建指南.pdf](https://zhangkeliang0627.github.io/images/关于基于全志T113-S3的86-Screen的一切/TinaSDK构建指南.pdf)

**我接下来的教程会以分享的虚拟机为基础来进行，为了尽量保持系统开发环境统一哈。**
{% endnote %}

- 开发板：基于T113-S3的86-Screen
- Tina-Linux版本：linux-5.4

---

### 开始

#### 下载并安装VMware

这个自行去官网下载就好，或者什么别的渠道下载都行，记得要下载最新的免费的版本就行。

#### PCB打样与器件采购

![PCB-3D](images/关于基于全志T113-S3的86-Screen的一切/image.jpg)

- 打样参数：1.6mm、无阻抗需求

硬件焊接这部分就不多赘述啦，熟能生巧！而且焊接难度不高，元器件在某宝都能买齐。

{% note warning %}

**注意1：`spinand`要购买`w25n02`这款芯片，而不是原理图里面的`w25q128`！作者应该是没有更正原理图。**

**注意2：屏幕那些大件尽量买作者推荐的商家，不然可能会遇到一些硬件bug，修复起来很头疼的！**

{% endnote %}

#### 虚拟机的设置

##### 账号

交流群中提供的虚拟机有三个账号：

| 账号 | 密码 | 
| :-: | :-: |
| taiji | taiji | 
| ubuntu20 | ubuntu20 | 
| root | root |

{% note warning %}

注意：root账户是隐藏的，是管理员，要在命令行中执行`su -`，输入对应的密码才可以使用。`tina-sdk`放在taiji账户中。

taiji 和 ubuntu20 这两个账户都是没有`sudo`权限的，你需要在root账户下给它们添加到`sudo`组：

```bash
su - # 进入root账户

usermod -aG sudo taiji  

usermod -aG sudo ubuntu20  

exit # 退出root账户

groups taiji # 用这个命令看一下是否分配sudo组成功
groups ubuntu20 
```

{% endnote %}

##### 配网

交流群分享的虚拟机一开始是上不了网的，需要执行一些步骤（跟着链接中的教程：https://blog.csdn.net/qq_35291429/article/details/132070006

#### 内核编译

具体的内核编译过程请参考我之前的文章：[全志T113-S3的TinaLinux编译流程记录](https://zhangkeliang0627.github.io/2024/11/24/全志T113-S3的TinaLinux编译流程记录/README/)

记得选择开发板要选`t113_pi-tina`

![](images/关于基于全志T113-S3的86-Screen的一切/image-2.png)

...

##### FAQ

{% note primary %}

**Q：TINA在编译打包PACK之后出现ERROR: unable to open file boot-resource.fex？**

![](images/关于基于全志T113-S3的86-Screen的一切/image-3.jpg)

A：解决方法：安装`i386 gcc`兼容包 `sudo apt-get install libc6:i386 libgcc1:i386 libstdc++6:i386 -y`

解决参考1：https://blog.csdn.net/zengsenhua/article/details/129946001
解决参考2：https://bbs.aw-ol.com/topic/804/tina在编译打包pack之后有问题/10

{% endnote %}

{% note primary %}

**Q：TINA在编译时出现ERROR诸如此类: /bin/sh:1: cc: not found？**

![](images/关于基于全志T113-S3的86-Screen的一切/image-3.png)

A：解决方法：你编译环境没搞好，`gcc`的安装包没装上，估计还有许多安装包都没有装上，所以请执行以下命令，重新安装编译环境（根据你的ubuntu的版本）：

```bash
# for ubuntu20.04 version
# 直接全部复制到命令行执行即可
sudo apt update -y 
sudo apt full-upgrade -y 
sudo apt install -y ack antlr3 asciidoc autoconf automake autopoint binutils bison 
build-essential \ 
bzip2 ccache cmake cpio curl device-tree-compiler fastjar flex gawk gettext gcc
multilib g++-multilib \ 
git gperf haveged help2man intltool libc6-dev-i386 libelf-dev libfuse-dev 
libglib2.0-dev libgmp3-dev \ 
libltdl-dev libmpc-dev libmpfr-dev libncurses5-dev libncursesw5-dev libpython3
dev libreadline-dev \ 
libssl-dev libtool lrzsz mkisofs msmtp ninja-build p7zip p7zip-full patch pkgconf 
python2.7 python3 \ 
python3-pyelftools python3-setuptools qemu-utils rsync scons squashfs-tools 
subversion swig texinfo \ 
uglifyjs upx-ucl unzip vim wget xmlto xxd zlib1g-dev \
sudo apt-get install libc6:i386 libgcc1:i386 libstdc++6:i386 -y
```

```bash
# for ubuntu18.04 version 
# 直接全部复制到命令行执行即可
sudo apt-get install build-essential subversion git libncurses5-dev zlib1g-dev gawk flex quilt libssl-dev xsltproc libxml-parser-perl mercurial bzr ecj cvs unzip lib32z1 lib32z1-dev lib32stdc++6 libstdc++6 libc6:i386 libstdc++6:i386 lib32ncurses5 lib32z1 -y
```

解决参考：https://bbs.aw-ol.com/topic/2913/tina编译出现md5sum错误/4

{% endnote %}

#### 关于tina-sdk的压缩、转移与解压

有时候我们可能需要将当前虚拟机当中的tina-sdk打包压缩，发送到另外一个虚拟机当中解压编译。因为我们不可能又去官网拉取一个全新的sdk然后又自己从头到尾修改一遍内核，这样很麻烦。因此，以下提供一些压缩与解压的指令（tar和7z），推荐使用7z，压缩和解压的速度都比较快！

##### tar

在ubuntu当中，tar通常都是预安装的，不需要手动安装（如果要，自行去问问ai安装一下吧！

```bash
# 先cd到 tina-sdk 文件夹的上级目录
# 压缩 tina-sdk 目录  
tar -cjvf tina-sdk.tar.bz2 tina-sdk
```

```bash
# 解压 tina-sdk 文件夹到当前目录
tar -xjvf tina-sdk.tar.bz2
```

##### 7z

```bash
# 安装依赖
sudo apt-get install p7zip-full
```

```bash
# 先cd到 tina-sdk 文件夹的上级目录
# 压缩 tina-sdk 目录  
7z a tina-sdk.7z tina-sdk 
```

```bash
# 解压 tina-sdk 文件夹到当前目录
7z x tina-sdk.7z
```

{% note warning %}

注意：转移到其他虚拟机后，记得要将tina-sdk当中的out文件夹删除干净，然后`make clean`，再去做编译打包的操作哦！否则会遇到路径不一致的报错问题，是因为文件发生了移动，从前的编译结果在这里已经不适用了。

{% endnote %}

#### 关于如何解决Read-only file system

> 文章参考1：https://bbs.aw-ol.com/topic/1000/在d1的tina上整上overlayfs
> 文章参考2：https://bbs.aw-ol.com/topic/3461/问题解决-使用sd卡启动系统时-文件系统为只读状态

执行`make menuconfig`，找到对应目录，勾选`e2fsprogs`，如图：
![](images/关于基于全志T113-S3的86-Screen的一切/image-4.png)

然后分区表`sys_partition.fex`当中加入`rootfs_data`（若已有，就不用，操作如下：
```bash
# 打开分区表，大致路径如下
gedit ~/tina-d1-h/device/config/chips/t113/configs/100ask/sys_partition.fex

# 加入rootfs_data，如果已经有了，就不需要加入
[partition]
    name = rootfs_data
    size = 25600
    user_type = 0x8000
```

最后就可以编译打包，烧录上电测试。顺利的话，此时在`/mnt/UDISK`文件夹中创建新文件就能够成功啦（或者adb传输文件就能成功啦！

#### 添加uboot启动logo

> 文章参考：https://dshanpi.100ask.net/docs/T113s3-Industrial/part7/AddABootLogoImageInUboot/

##### 准备图片

准备一张图片，**名字和格式一定为`bootlogo.bmp`!!!**

图片的分辨率要求在屏幕的分辨率范围内，如这里使用的86屏的分辨率是480x480像素，所以我们准备的图片的分辨率就要小于480x480，我在这准备了一张图片（我的头像，240x240像素：

![bootlogo.bmp](images/关于基于全志T113-S3的86-Screen的一切/bootlogo.bmp)

将这个图片拷贝到`~/tina-sdk/device/config/chips/t113/configs/pi/configs/`

##### 修改配置

执行`make kernel_menuconfig`

> \>Device Drivers -> Graphics support -> Bootup logo

{% gi 2 2 %}

![](images/关于基于全志T113-S3的86-Screen的一切/image.png)
![](images/关于基于全志T113-S3的86-Screen的一切/image-1.png)

{% endgi %}

修改`sun8iw20p1_uart3_defconfig`，路径为`/home/taiji/tina-sdk/lichee/brandy-2.0/u-boot-2018/configs/sun8iw20p1_uart3_defconfig`，在末尾加上下面两句：

```shell
CONFIG_BOOT_GUI=y
CONFIG_LCD_SUPPORT_ST7701S_86=y
```

##### 编译、测试
然后，编译打包，上电测试，看看效果吧！

![](images/关于基于全志T113-S3的86-Screen的一切/image-4.jpg)

##### BTW

如果你需要为其他的屏幕添加uboot启动logo，你需要在uboot`brandy2.0`当中手动配置一下屏幕驱动哦！原理和在内核`linux5.4`配置屏幕驱动差不多的。

然后将`CONFIG_LCD_SUPPORT_ST7701S_86=y`，修改成你的屏幕支持就ok啦！

#### tplayerdemo的使用方法

> 文章参考1：[D1s使用tplayerdemo播放badapple](https://bbs.aw-ol.com/topic/1238/d1s芯片-开发板-ready-准备放出来给大家玩/8)
> 文章参考2：[T113-S3的音频输入与输出方法](https://bbs.aw-ol.com/topic/2196/全志T113-S3_100ask-音频输入与输出)

tplayerdemo是`tina-sdk`自带的程序，里面基于全志开放的硬件解码API接口实现了多种格式的音视频的播放。

##### 内核配置（编译程序

首先，根据全志给的开发指南[Tina_Linux_多媒体解码_开发指南](https://zhangkeliang0627.github.io/images/关于基于全志T113-S3的86-Screen的一切/Tina_Linux_多媒体解码_开发指南.pdf)修改内核配置，勾选对应的选项✔

配置好内核以后，重新编译打包，烧录上电。

##### 播放音视频（运行程序

然后我们就可以在开发板的命令行中使用`tplayerdemo`命令播放音视频啦，如播放视频`tplayerdemo /mnt/UDISK/video.mp4`。

{% note warning %}

**注意：在执行`tplayerdemo`命令之前，要确认音频通路是否打开（是否解除静音），要执行`amixer -D hw:audiocodec cset name='Headphone Switch' 1`打开音频通路，否则音视频播放几秒钟就会卡死！**

{% endnote %}

> 我们可以使用`amixer`命令来查看与编辑音频相关的设备情况：
>
> {% fold info @查看音频相关的设备节点的情况 %}
```bash
# 命令amixer：查看音频相关的设备节点的情况
root@TinaLinux:/# amixer

Simple mixer control 'Headphone',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'Headphone volume',0
  Capabilities: volume volume-joined
  Playback channels: Mono
  Capture channels: Mono
  Limits: 0 - 7
  Mono: 4 [57%]
Simple mixer control 'FMINL gain volume',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'FMINR gain volume',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'ADC1 ADC2 swap',0
  Capabilities: enum
  Items: 'Off' 'On'
  Item0: 'Off'
Simple mixer control 'ADC1 Input FMINL',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'ADC1 Input LINEINL',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'ADC1 Input MIC1 Boost',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'ADC1 volume',0
  Capabilities: volume volume-joined
  Playback channels: Mono
  Capture channels: Mono
  Limits: 0 - 255
  Mono: 160 [63%]
Simple mixer control 'ADC2 Input FMINR',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'ADC2 Input LINEINR',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'ADC2 Input MIC2 Boost',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'ADC2 volume',0
  Capabilities: volume volume-joined
  Playback channels: Mono
  Capture channels: Mono
  Limits: 0 - 255
  Mono: 160 [63%]
Simple mixer control 'ADC3 ADC4 swap',0
  Capabilities: enum
  Items: 'Off' 'On'
  Item0: 'Off'
Simple mixer control 'ADC3 Input MIC3 Boost',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'ADC3 volume',0
  Capabilities: volume volume-joined
  Playback channels: Mono
  Capture channels: Mono
  Limits: 0 - 255
  Mono: 160 [63%]
Simple mixer control 'DAC volume',0
  Capabilities: volume
  Playback channels: Front Left - Front Right
  Capture channels: Front Left - Front Right
  Limits: 0 - 255
  Front Left: 160 [63%]
  Front Right: 160 [63%]
Simple mixer control 'HpSpeaker',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'LINEINL gain volume',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'LINEINR gain volume',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'LINEOUT',0
  Capabilities: pswitch pswitch-joined
  Playback channels: Mono
  Mono: Playback [off]
Simple mixer control 'LINEOUT volume',0
  Capabilities: volume volume-joined
  Playback channels: Mono
  Capture channels: Mono
  Limits: 0 - 31
  Mono: 26 [84%]
Simple mixer control 'LINEOUTL Output Select',0
  Capabilities: enum
  Items: 'DAC_SINGLE' 'DAC_DIFFER'
  Item0: 'DAC_DIFFER'
Simple mixer control 'LINEOUTR Output Select',0
  Capabilities: enum
  Items: 'DAC_SINGLE' 'DAC_DIFFER'
  Item0: 'DAC_DIFFER'
Simple mixer control 'MIC1 Input Select',0
  Capabilities: enum
  Items: 'MIC_DIFFER' 'MIC_SINGLE'
  Item0: 'MIC_DIFFER'
Simple mixer control 'MIC1 gain volume',0
  Capabilities: volume volume-joined
  Playback channels: Mono
  Capture channels: Mono
  Limits: 0 - 31
  Mono: 31 [100%]
Simple mixer control 'MIC2 Input Select',0
  Capabilities: enum
  Items: 'MIC_DIFFER' 'MIC_SINGLE'
  Item0: 'MIC_DIFFER'
Simple mixer control 'MIC2 gain volume',0
  Capabilities: volume volume-joined
  Playback channels: Mono
  Capture channels: Mono
  Limits: 0 - 31
  Mono: 31 [100%]
Simple mixer control 'MIC3 Input Select',0
  Capabilities: enum
  Items: 'MIC_DIFFER' 'MIC_SINGLE'
  Item0: 'MIC_DIFFER'
Simple mixer control 'MIC3 gain volume',0
  Capabilities: volume volume-joined
  Playback channels: Mono
  Capture channels: Mono
  Limits: 0 - 31
  Mono: 31 [100%]
Simple mixer control 'codec hub mode',0
  Capabilities: enum
  Items: 'hub_disable' 'hub_enable'
  Item0: 'hub_disable'
Simple mixer control 'digital volume',0
  Capabilities: volume volume-joined
  Playback channels: Mono
  Capture channels: Mono
  Limits: 0 - 63
  Mono: 63 [100%]
```
{% endfold %}
>
> {% fold info @快速查看音频相关的设备节点 %}
```bash
# 命令amixer controls：快速查看音频相关的设备节点
root@TinaLinux:/# amixer controls

numid=17,iface=MIXER,name='Headphone volume'
numid=30,iface=MIXER,name='Headphone Switch'
numid=12,iface=MIXER,name='FMINL gain volume'
numid=13,iface=MIXER,name='FMINR gain volume'
numid=2,iface=MIXER,name='ADC1 ADC2 swap'
numid=24,iface=MIXER,name='ADC1 Input FMINL Switch'
numid=25,iface=MIXER,name='ADC1 Input LINEINL Switch'
numid=23,iface=MIXER,name='ADC1 Input MIC1 Boost Switch'
numid=6,iface=MIXER,name='ADC1 volume'
numid=27,iface=MIXER,name='ADC2 Input FMINR Switch'
numid=28,iface=MIXER,name='ADC2 Input LINEINR Switch'
numid=26,iface=MIXER,name='ADC2 Input MIC2 Boost Switch'
numid=7,iface=MIXER,name='ADC2 volume'
numid=3,iface=MIXER,name='ADC3 ADC4 swap'
numid=29,iface=MIXER,name='ADC3 Input MIC3 Boost Switch'
numid=8,iface=MIXER,name='ADC3 volume'
numid=5,iface=MIXER,name='DAC volume'
numid=31,iface=MIXER,name='HpSpeaker Switch'
numid=14,iface=MIXER,name='LINEINL gain volume'
numid=15,iface=MIXER,name='LINEINR gain volume'
numid=32,iface=MIXER,name='LINEOUT Switch'
numid=16,iface=MIXER,name='LINEOUT volume'
numid=18,iface=MIXER,name='LINEOUTL Output Select'
numid=19,iface=MIXER,name='LINEOUTR Output Select'
numid=20,iface=MIXER,name='MIC1 Input Select'
numid=9,iface=MIXER,name='MIC1 gain volume'
numid=21,iface=MIXER,name='MIC2 Input Select'
numid=10,iface=MIXER,name='MIC2 gain volume'
numid=22,iface=MIXER,name='MIC3 Input Select'
numid=11,iface=MIXER,name='MIC3 gain volume'
numid=33,iface=MIXER,name='Soft Volume Master'
numid=1,iface=MIXER,name='codec hub mode'
numid=4,iface=MIXER,name='digital volume'
```

```bash
# 使用命令amixer cget：快速查看单个音频相关设备节点的当前状态
amixer cget numid=30,iface=MIXER,name='Headphone Switch'             # 查看耳机输出
```
{% endfold %}
>
> {% fold info @修改音频设备的参数 %}
```bash
# 修改音频设备的参数
amixer -D hw:audiocodec cset name='Headphone Switch' 1                # 开启耳机输出
amixer -D hw:audiocodec cset name='Headphone Volume' 3                # 设定音量

# 或者使用以下方法（效果一样
amixer cset numid=30,iface=MIXER,name='Headphone Switch' 1            # 开启耳机输出
amixer cset numid=17,iface=MIXER,name='Headphone volume' 3            # 设定音量
```
{% endfold %}

#### 简易音视频播放器（Simple Player

##### 克隆
> 这个功能是从作者的仓库找到的，感谢开源：https://gitee.com/fhcloud/tplayer_kbd

##### 修改
把这个仓库克隆下来之后，你需要修改一些文件当中的路径为自己虚拟机当中的路径（以分享的虚拟机为例：

```bash
# env
export STAGING_DIR=/home/taiji/tina-sdk/out/t113-pi/staging_dir/target
```

```cmake
# CMakeLists.txt

set(CMAKE_C_COMPILER "/home/taiji/tina-sdk/prebuilt/gcc/linux-x86/arm/toolchain-sunxi-musl/toolchain/bin/arm-openwrt-linux-gcc")

include_directories(
        .
        "/home/taiji/tina-sdk/out/t113-pi/staging_dir/target/usr/include"
        "/home/taiji/tina-sdk/out/t113-pi/staging_dir/target/usr/include/allwinner"
        "/home/taiji/tina-sdk/out/t113-pi/staging_dir/target/usr/include/allwinner/include/"
)

link_directories(
        "/home/taiji/tina-sdk/out/t113-pi/staging_dir/target/lib"
        "/home/taiji/tina-sdk/out/t113-pi/staging_dir/target/usr/lib"
)
```

```c
// main.c
// 我使用的86屏分辨率是480x480，所以修改一下LCD宽度的宏定义为480.0

// #define LCD_WIDTH 720.0
#define LCD_WIDTH 480.0
```

##### 编译
修改好以上文件以后，按顺序执行以下命令：

```shell
mkdir build
cd build/
cmake ..
make
```

##### 测试
最后把生成的可执行文件`tplayer_kbd`通过`adb`传输到开发板上，然后再传几个`mp3`、`mp4`文件用于测试，尽量都把文件传到`/mnt/UDISK/`路径下吧，这里是用户存放文件的区域，不会对其他文件有影响，文件也不会意外被删除。

然后，我们来测试一下例程：

```bash
./tplayer_kbd test1.mp4 # 播放视频

./tplayer_kbd test2.mp3 # 播放音频

# 在播放视频或者音频的时候，命令行输入特定的字符可以对音视频做调整

l # 循环模式，播放结束之后重复播放
q # 退出程序
p # 暂停播放/恢复播放
/ # 减小音量（-5）
* # 增大音量（+5）
f # 打印当前视频帧率
t # 打印当前播放位置
w # 前进（+60s）
s # 退回（-60s）
a # 前进（+10s）
d # 退回（-10s）
m # 当前播放的音视频的详细参数属性
```

展示一下我的实际效果，弹钢琴的帅老头大家应该都很熟悉了吧haha：

![](images/关于基于全志T113-S3的86-Screen的一切/image-5.jpg)

#### 关于U盘的挂载

这里基于全志的开发指南[Tina_Linux_存储_开发指南](https://zhangkeliang0627.github.io/images/关于基于全志T113-S3的86-Screen的一切/Tina_Linux_存储_开发指南.pdf)简单讲解一下U盘如何挂载。

当我们往开发板的USB口插入U盘时，设备会自动识别到U盘，你可以在`dev`文件夹下看到新增了诸如`sda`的设备，此时说明咱们的U盘已经连接到开发板，接下来执行`mount /dev/sda /mnt/exUDISK/`挂载U盘设备到`/mnt/exUDISK`文件夹中。顺利的话，接下来cd到该文件夹，你就能读取到U盘当中的内容啦！

![默认挂载设备节点](images/关于基于全志T113-S3的86-Screen的一切/image-5.png)

##### 自动挂载

...

更多的内容，看开发指南吧（笑！

#### 命令行日志输出到LCD屏幕

> 文章参考：https://bbs.aw-ol.com/topic/4223/t113-s3-log输出到rgb屏幕

##### 修改env.cfg

env.cfg的路径参考`/home/hugokkl/tina-d1-h/device/config/chips/t113/configs/100ask/env.cfg`

![](images/关于基于全志T113-S3的86-Screen的一切/image-6.png)

#### 修改kernel_menuconfig

![勾选(1](images/关于基于全志T113-S3的86-Screen的一切/image-7.png)
![勾选(2](images/关于基于全志T113-S3的86-Screen的一切/image-8.png)
![搜索"Framebuffer"](images/关于基于全志T113-S3的86-Screen的一切/image-9.png)
![选择"1"](images/关于基于全志T113-S3的86-Screen的一切/image-10.png)
![勾选(3](images/关于基于全志T113-S3的86-Screen的一切/image-11.png)

然后就配置完成，重新编译打包啦！下面是显示效果展示：

![](images/关于基于全志T113-S3的86-Screen的一切/image-6.jpg)

#### LVGL示例测试

交流群中提供的虚拟机中刚好提供了一份LVGL测试的程序`lvgl_taiji`，咱们拿来用一用！

先cd到`lvgl_taiji`文件夹中，执行以下命令编译程序：
```bash
cd build/
./build_lv_taiji
```
然后将编译出来的执行文件`lv_taiji`通过adb丢到开发板当中运行就可以咯！

...

#### 设备开机后程序自启动

有些时候，我们想要在设备上电开机之后，不想通过命令行输入，自动加载一些内核模块，执行某些命令或者程序时，就会用到以下的操作！

修改开发板当中的`/etc/rc.local`文件，加入自己想要执行的命令：
```bash
# /etc/rc.local file

# 在exit 0前加入自己想要执行的命令，exit 0不能删除哦！
# 如下，我先cd到对应的文件夹，然后再执行了一个程序

# Put your custom commands here that should be executed once
# the system init finished. By default this file does nothing.
cd /mnt/UDISK && ./eMP_mainPage
exit 0
```

---

### 写在后面

**鸣谢：**

- [@FanHuaCloud](https://oshwhub.com/fanhuacloud/works)：[基于T113-S3的86-Screen](https://oshwhub.com/fanhuacloud/t113-s3-86panel)

...

---