---
title: 关于「基于全志T113-S3的86-Screen」的一切
excerpt: 今天！一起来复刻🙆！
tags: [Allwinner, T113-S3, Ubuntu]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-1.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image.jpg
categories: Project Page
comment: 'twikoo'
# hide: true
date: 2025-2-1 15:10:00
---

### 关于基于全志T113-S3的86-Screen的一切
### Author: kkl

{% note warning %}

该笔记目前进入长期维护阶段。

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


<!-- {% gi 2 2 %}

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-1.jpg" alt="snapshot-1" width = "400" height = "200" style="border-radius: 10px;">
<figcaption>snapshot-1</figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-2.jpg" alt="snapshot-2" width = "400" height = "200" style="border-radius: 10px;">
<figcaption>snapshot-2</figcaption>
</figure>

{% endgi %} -->

{% gi 2 2 %}

<figure>
<img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-1.jpg" alt="snapshot-1" width = "400" height = "200" style="border-radius: 10px;">
<figcaption>snapshot-1</figcaption>
</figure>

<figure>
<img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-2.jpg" alt="snapshot-2" width = "400" height = "200" style="border-radius: 10px;">
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

<!-- ![PCB-3D](images/关于基于全志T113-S3的86-Screen的一切/image.jpg) -->
![PCB-3D](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image.jpg)

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

<!-- ![](images/关于基于全志T113-S3的86-Screen的一切/image-2.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-2.png)

...

##### FAQ

{% note primary %}

**Q：TINA在编译打包PACK之后出现ERROR: unable to open file boot-resource.fex？**

<!-- ![](images/关于基于全志T113-S3的86-Screen的一切/image-3.jpg) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-3.jpg)

A：解决方法：安装`i386 gcc`兼容包 `sudo apt-get install libc6:i386 libgcc1:i386 libstdc++6:i386 -y`

解决参考1：https://blog.csdn.net/zengsenhua/article/details/129946001
解决参考2：https://bbs.aw-ol.com/topic/804/tina在编译打包pack之后有问题/10

{% endnote %}

{% note primary %}

**Q：TINA在编译时出现ERROR诸如此类: /bin/sh:1: cc: not found？**

<!-- ![](images/关于基于全志T113-S3的86-Screen的一切/image-3.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-3.png)

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
<!-- ![](images/关于基于全志T113-S3的86-Screen的一切/image-4.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-4.png)

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

<!-- ![bootlogo.bmp](images/关于基于全志T113-S3的86-Screen的一切/bootlogo.bmp) -->
![bootlogo.bmp](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/bootlogo.bmp)

将这个图片拷贝到`~/tina-sdk/device/config/chips/t113/configs/pi/configs/`

##### 修改配置

执行`make kernel_menuconfig`

> \>Device Drivers -> Graphics support -> Bootup logo

{% gi 2 2 %}

<!-- ![](images/关于基于全志T113-S3的86-Screen的一切/image.png)
![](images/关于基于全志T113-S3的86-Screen的一切/image-1.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image.png)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-1.png)
{% endgi %}

修改`sun8iw20p1_uart3_defconfig`，路径为`/home/taiji/tina-sdk/lichee/brandy-2.0/u-boot-2018/configs/sun8iw20p1_uart3_defconfig`，在末尾加上下面两句：

```shell
CONFIG_BOOT_GUI=y
CONFIG_LCD_SUPPORT_ST7701S_86=y
```

##### 编译、测试
然后，编译打包，上电测试，看看效果吧！

<!-- ![](images/关于基于全志T113-S3的86-Screen的一切/image-4.jpg) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-4.jpg)

##### BTW

如果你需要为其他的屏幕添加uboot启动logo，你需要在uboot`brandy2.0`当中手动配置一下屏幕驱动哦！原理和在内核`linux5.4`配置屏幕驱动差不多的。

```bash
# linux5.4 内核中屏幕驱动文件路径
cd ~/tina-sdk/lichee/linux-5.4/drivers/video/fbdev/sunxi/disp2/disp/lcd

# brandy2.0 uboot中屏幕驱动文件路径
cd ~/tina-sdk/lichee/brandy-2.0/u-boot-2018/drivers/video/sunxi/disp2/disp/lcd
```

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

<!-- ![](images/关于基于全志T113-S3的86-Screen的一切/image-5.jpg) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-5.jpg)

#### 关于U盘的挂载

这里基于全志的开发指南[Tina_Linux_存储_开发指南](https://zhangkeliang0627.github.io/images/关于基于全志T113-S3的86-Screen的一切/Tina_Linux_存储_开发指南.pdf)简单讲解一下U盘如何挂载。

##### 手动挂载

当我们往开发板的USB口插入U盘时，设备会自动识别到U盘，你可以在`dev`文件夹下看到新增了诸如`sda`的设备，此时说明咱们的U盘已经连接到开发板，接下来执行`mount /dev/sda /mnt/exUDISK/`挂载U盘设备到`/mnt/exUDISK`文件夹中。顺利的话，接下来cd到该文件夹，你就能读取到U盘当中的内容啦！

<!-- ![默认挂载设备节点](images/关于基于全志T113-S3的86-Screen的一切/image-5.png) -->
![默认挂载设备节点](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-5.png)

##### 自动挂载

千呼万唤使出来，终于，我成功的解决的U盘自动挂载的问题，当然，连同U盘的热插拔问题我也一并解决啦！

这里，我提供两种做法：

###### fstab

使用`fstab`实现U盘的开机自动挂载，此法适合`procd-init`，刚好咱们的86屏就可以使用这个方法.

```bash
# 列出fstab
root@TinaLinux:/etc/config# cd /etc/config && cat fstab
config 'global'
	option	anon_swap       '0'
	option	anon_mount      '0'
	option	auto_swap       '1'
	option	auto_mount      '1'
	option	delay_root      '5'
	option  check_fs        '1'

config 'mount'
	option  target		'/boot'
	option	device		'/dev/by-name/boot'
	option	options		'ro,sync'
	option	enabled		'1'

config 'mount'
	option  target		'/boot-res'
	option	device		'/dev/by-name/boot-res'
	option	options		'ro,sync'
	option	enabled		'1'

config 'mount'
	option  target		'/mnt/UDISK'
	option	device		'/dev/by-name/UDISK'
	option	options		'rw,async'
	option	enabled		'0'

config 'mount'
	option  target		'/overlay'
	option	device		'/dev/by-name/UDISK'
	option	options		'rw,async'
	option	enabled		'1'

config 'mount'
	option  target		'/mnt/SDCARD'
	option	device		'/dev/mmcblk0'
	option	options		'rw,async'
	option	enabled		'0'

config 'mount'
	option  target		'/mnt/SDCARD'
	option	device		'/dev/mmcblk0p1'
	option	options		'rw,async'
	option	enabled		'0'

config 'mount'
	option  target		'/mnt/exUDISK'
	option	device		'/dev/sda'
	option	options		'rw,async'
	option	enabled		'1'

config 'mount'
	option  target		'/mnt/exUDISK'
	option	device		'/dev/sda1'
	option	options		'rw,async'
	option	enabled		'1'
```

然后把最后两个选项的`enabled`改成`1`，即可实现开机自动挂载U盘设备啦，但是这种做法有一个缺点，就算无法热插拔，每一次拔出U盘再插回去，就没有办法自动挂载啦。

所幸，好处是，这种方法没有什么依赖，适合简单的开发使用。

###### udev

好，接下来来到了`udev`，这可是个好东西，后面有机会单独拿一篇文章出来讲。

这个需要你先`make menuconfig`打开配置项`libevdev`.

![](images/关于基于全志T113-S3的86-Screen的一切/image-31.png)

以我们这个板子为例，它使用的是`procd-init`，所以需要先按照上面的步骤修改好`fstab`，然后再往该路径下`cd /lib/udev/rules.d`，然后新建文件`vim 91-mount-udisk.rules`:

```bash
# 91-mount-udisk.rules
ACTION=="add", SUBSYSTEM=="block", KERNEL=="sd[a-z][0-9]", ENV{DEVTYPE}=="partition", ENV{ID_BUS}=="usb", ENV{ID_FS_TYPE}!="", RUN+="mount -o rw,nosuid,nodev,noexec,relatime,uid=0,gid=0,dmask=000,fmask=111 /dev/%k /mnt/exUDISK"
ACTION=="remove", SUBSYSTEM=="block", KERNEL=="sd[a-z][0-9]", ENV{DEVTYPE}=="partition", ENV{ID_BUS}=="usb", ENV{ID_FS_TYPE}!="", RUN+="umount -l /mnt/exUDISK"
```

然后保存退出，重新加载`udev`规则：
```bash
# 重新加载 udev 规则
udevadm control --reload-rules
# 触发一次 udev 事件扫描，让新规则立即对已连接的设备生效
udevadm trigger
```

然后，不出意外的话，你就可以顺利的实现U盘的热插拔啦！

...

更多的内容，看开发指南吧（笑！

#### 命令行日志输出到LCD屏幕

> 文章参考：https://bbs.aw-ol.com/topic/4223/t113-s3-log输出到rgb屏幕

##### 修改env.cfg

env.cfg的路径参考`/home/hugokkl/tina-d1-h/device/config/chips/t113/configs/100ask/env.cfg`

<!-- ![](images/关于基于全志T113-S3的86-Screen的一切/image-6.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-6.png)

##### 修改kernel_menuconfig

<!-- ![勾选(1](images/关于基于全志T113-S3的86-Screen的一切/image-7.png)
![勾选(2](images/关于基于全志T113-S3的86-Screen的一切/image-8.png)
![搜索"Framebuffer"](images/关于基于全志T113-S3的86-Screen的一切/image-9.png)
![选择"1"](images/关于基于全志T113-S3的86-Screen的一切/image-10.png)
![勾选(3](images/关于基于全志T113-S3的86-Screen的一切/image-11.png) -->

![勾选(1](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-7.png)
![勾选(2](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-8.png)
![搜索"Framebuffer"](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-9.png)
![选择"1"](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-10.png)
![勾选(3](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-11.png)

然后就配置完成，重新编译打包啦！下面是显示效果展示：

<!-- ![](images/关于基于全志T113-S3的86-Screen的一切/image-6.jpg) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于基于全志T113-S3的86-Screen的一切/image-6.jpg)

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

#### 关于串口设备
在这块开发板中，原作者设计使用uart0作为console的输出口，同时也在开发板侧面留下了两个串口供大家自行DIY，分别是：uart3和uart5，但是提供的虚拟机当中的设备树里并没有使能这两个串口设备，于是如果你想要使用这两个额外的串口，就需要手动设置，下面我粗略地演示一下，如何在设备树中设置串口驱动（以uart3为例：

首先去到`~/tina-sdk/device/config/chips/t113/configs/pi/linux-5.4/board.dts`.

打开`board.dts`设备树文件，做以下修改：

参照下列步骤图，把uart3对应的引脚进行修改、然后把status改为`okay`，结束！

然后，你就可以重新编译内核，打包镜像啦。

最后你可以在咱们的开发板上`cat /dev/ttyS*`，可以看到`ttyS3`串口设备已经被注册存在啦，然后你就可以愉快的使用它！

{% note warning %}
注意：要确定所选择的引脚没有被别的外设复用哟！
{% endnote %}

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-14.png" alt="开发板外接引脚图" width = "600" height = "400" style="border-radius: 15px;">
<figcaption>开发板外接引脚图</figcaption>
</figure>

![uart -> 步骤1](images/关于基于全志T113-S3的86-Screen的一切/image-13.png)
![uart -> 步骤2](images/关于基于全志T113-S3的86-Screen的一切/image-12.png)

![uart -> 成功](images/关于基于全志T113-S3的86-Screen的一切/image-15.png)

```dts
&pio {

  uart3_pins_a: uart3_pins@0 {  /* For t113_evb */
    //pins = "PG8", "PG9";
    //pins = "PB6", "PB7";
    pins = "PE8", "PE9";
    function = "uart3";
    drive-strength = <10>;
    bias-pull-up;
  };

  uart3_pins_b: uart3_pins@1 {  /* For t113_evb */
    //pins = "PB6", "PB7";
    pins = "PE8", "PE9";
    function = "gpio_in";
  };

}

&uart3 {
	pinctrl-names = "default", "sleep";
	pinctrl-0 = <&uart3_pins_a>;
	pinctrl-1 = <&uart3_pins_b>;
	status = "okay";
};
```

_**TODO: 原作者还预留了两个RS485的方向引脚，所以这两个串口还可以作为485总线，后面有空做一下分享吧！**_

#### USB摄像头推流

> 文章参考：https://blog.csdn.net/qq_28877125/article/details/127824696

##### 内核配置
86屏开发板本身的固件并没有打开摄像头相关的配置，因此在最开始，我们要对Tina-sdk进行一波配置。

Tina文件系统配置：`make menuconfig`
{% gi 7 3 %}

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-17.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-18.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-22.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-23.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-24.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-25.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-26.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>
{% endgi %}

这里需要注意的是，mjpg-streamer依赖libjpeg，但是我们勾选的图像库是libjpeg-turbo，顾名思义是libjpeg的加强版，因此我们需要到mjpg-streamer的makefile里修改一下依赖：**将libjpeg改为libjpeg-turbo**.

{% gi 2 2 %}

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-16.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-27.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-21.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

{% endgi %}


Linux Kernel配置：`make kernel_menuconfig`
{% gi 3 3 %}

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-19.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-20.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-21.png" alt="" width = "300" height = "200" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

{% endgi %}

然后重新给sdk编译打包，将镜像烧到sd卡里，插入板子上电！板子的USB口接上UVC摄像头即可。

如果看到设备节点存在`/dev/video0`和`/dev/video1`，那就说明板子检测到了摄像头，如图：

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-28.png" alt="" width = "400" height = "300" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

此时，你可以使用指令`v4l2-ctl -d /dev/video0 --list-formats-ext`，来看一下这个摄像头支持的格式和分辨率，如图：

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-29.png" alt="" width = "400" height = "300" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

##### 浏览器显示摄像头画面

提前联网！联网我就不多说了，贴两条指令出来，没看明白的话这里[有篇文章:D](https://zhangkeliang0627.github.io/2025/01/20/在全志T113-S3的TinaLinux上添加驱动支持/README/#添加xr829驱动（WiFi-BLE)：
```bash
# 扫描附近的wifi
wifi_scan_results_test

# 连接wifi
wifi_connect_ap_test <wifi_ssid> <wifi_pwd>
```

然后板子上输入指令，推流：`mjpg_streamer -i "/usr/lib/input_uvc.so -r 640x480 -d /dev/video0 -y -f 30 -n" -o "/usr/lib/output_http.so"`.

然后打开浏览器输入网址`http://<你板子的ip>:8080/?action=stream`，看到有画面输出，就说明成功啦！

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-30.png" alt="" width = "400" height = "300" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

##### 屏幕显示摄像头画面

“因为我的摄像头不支持RGB模式，所以就设置成YUV格式的输出模式，然后再将YUV格式转成RGB格式的视频流显示”，原作者如是说，源码如下：
{% fold info @camera_test.c %}
```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <ctype.h>
#include <errno.h>
#include <sys/mman.h>
#include <sys/time.h>
#include <asm/types.h>
#include <linux/videodev2.h>
#include <linux/fb.h>
#include <sys/stat.h>
#include <sys/ioctl.h>
#include <poll.h>
#include <math.h>
#include <wchar.h>
#include <time.h>
#include <stdbool.h>

#define CAM_WIDTH 640
#define CAM_HEIGHT 480

static char *dev_video;
static char *dev_fb0;

static char *yuv_buffer;
static char *rgb_buffer;
typedef unsigned int u32;
typedef unsigned short u16;
typedef unsigned char u8;
#define YUVToRGB(Y)                                                            \
	((u16)((((u8)(Y) >> 3) << 11) | (((u8)(Y) >> 2) << 5) | ((u8)(Y) >> 3)))
struct v4l2_buffer video_buffer;
/*全局变量*/
int lcd_fd;
int video_fd;
static unsigned char *lcd_mem_p = NULL; //保存LCD屏映射到进程空间的首地址
struct fb_var_screeninfo vinfo;
struct fb_fix_screeninfo finfo;

char *video_buff_buff[4]; /*保存摄像头缓冲区的地址*/
int video_height = 0;
int video_width = 0;
unsigned char *lcd_display_buff; //LCD显存空间
unsigned char *lcd_display_buff2; //LCD显存空间
static void errno_exit(const char *s)
{
	fprintf(stderr, "%s error %d, %s\n", s, errno, strerror(errno));
	exit(EXIT_FAILURE);
}

static int xioctl(int fh, int request, void *arg)
{
	int r;

	do {
		r = ioctl(fh, request, arg);
	} while (-1 == r && EINTR == errno);

	return r;
}

static int video_init(void)
{
	struct v4l2_capability cap;
	ioctl(video_fd, VIDIOC_QUERYCAP, &cap);

	struct v4l2_fmtdesc dis_fmtdesc;
	dis_fmtdesc.index = 0;
	dis_fmtdesc.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	printf("-----------------------支持格式---------------------\n");
	while (ioctl(video_fd, VIDIOC_ENUM_FMT, &dis_fmtdesc) != -1) {
		printf("\t%d.%s\n", dis_fmtdesc.index + 1,
		       dis_fmtdesc.description);
		dis_fmtdesc.index++;
	}
	struct v4l2_format video_format;
	video_format.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	video_format.fmt.pix.width = CAM_WIDTH;
	video_format.fmt.pix.height = CAM_HEIGHT;
	video_format.fmt.pix.pixelformat =
		V4L2_PIX_FMT_YUYV; //使用JPEG格式帧，用于静态图像采集

	ioctl(video_fd, VIDIOC_S_FMT, &video_format);

	printf("当前摄像头支持的分辨率:%dx%d\n", video_format.fmt.pix.width,
	       video_format.fmt.pix.height);
	if (video_format.fmt.pix.pixelformat != V4L2_PIX_FMT_YUYV) {
		printf("当前摄像头不支持YUYV格式输出.\n");
		video_height = video_format.fmt.pix.height;
		video_width = video_format.fmt.pix.width;
		//return -3;
	} else {
		video_height = video_format.fmt.pix.height;
		video_width = video_format.fmt.pix.width;
		printf("当前摄像头支持YUYV格式输出.width %d height %d\n",
		       video_height, video_height);
	}
	/*3. 申请缓冲区*/
	struct v4l2_requestbuffers video_requestbuffers;
	memset(&video_requestbuffers, 0, sizeof(struct v4l2_requestbuffers));
	video_requestbuffers.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	video_requestbuffers.count = 4;
	video_requestbuffers.memory = V4L2_MEMORY_MMAP;
	if (ioctl(video_fd, VIDIOC_REQBUFS, &video_requestbuffers))
		return -4;
	printf("成功申请的缓冲区数量:%d\n", video_requestbuffers.count);
	/*4. 得到每个缓冲区的地址: 将申请的缓冲区映射到进程空间*/
	struct v4l2_buffer video_buffer;
	memset(&video_buffer, 0, sizeof(struct v4l2_buffer));
	int i;
	for (i = 0; i < video_requestbuffers.count; i++) {
		video_buffer.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
		video_buffer.index = i;
		video_buffer.memory = V4L2_MEMORY_MMAP;
		if (ioctl(video_fd, VIDIOC_QUERYBUF, &video_buffer))
			return -5;
		/*映射缓冲区的地址到进程空间*/
		video_buff_buff[i] =
			mmap(NULL, video_buffer.length, PROT_READ | PROT_WRITE,
			     MAP_SHARED, video_fd, video_buffer.m.offset);
		printf("第%d个缓冲区地址:%#X\n", i, video_buff_buff[i]);
	}
	/*5. 将缓冲区放入到采集队列*/
	memset(&video_buffer, 0, sizeof(struct v4l2_buffer));
	for (i = 0; i < video_requestbuffers.count; i++) {
		video_buffer.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
		video_buffer.index = i;
		video_buffer.memory = V4L2_MEMORY_MMAP;
		if (ioctl(video_fd, VIDIOC_QBUF, &video_buffer)) {
			printf("VIDIOC_QBUF error\n");
			return -6;
		}
	}
	printf("启动摄像头采集\n");
	/*6. 启动摄像头采集*/
	int opt_type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	if (ioctl(video_fd, VIDIOC_STREAMON, &opt_type)) {
		printf("VIDIOC_STREAMON error\n");
		return -7;
	}

	return 0;
}
int lcd_init(void)
{
	/*2. 获取可变参数*/
	if (ioctl(lcd_fd, FBIOGET_VSCREENINFO, &vinfo))
		return -2;
	printf("屏幕X:%d   屏幕Y:%d  像素位数:%d\n", vinfo.xres, vinfo.yres,
	       vinfo.bits_per_pixel);
	//分配显存空间,完成图像显示
	lcd_display_buff =
		malloc(vinfo.xres * vinfo.yres * vinfo.bits_per_pixel / 8);
	/*3. 获取固定参数*/
	if (ioctl(lcd_fd, FBIOGET_FSCREENINFO, &finfo))
		return -3;
	printf("smem_len=%d Byte,line_length=%d Byte\n", finfo.smem_len,
	       finfo.line_length);

	/*4. 映射LCD屏物理地址到进程空间*/
	lcd_mem_p = (unsigned char *)mmap(0, finfo.smem_len,
					  PROT_READ | PROT_WRITE, MAP_SHARED,
					  lcd_fd, 0); //从文件的那个地方开始映射
	memset(lcd_mem_p, 0xFFFFFF, finfo.smem_len);
	printf("映射LCD屏物理地址到进程空间\n");
	return 0;
}

static void close_device(void)
{
	if (-1 == close(video_fd))
		errno_exit("close");
	video_fd = -1;

	if (-1 == close(lcd_fd))
		errno_exit("close");
	lcd_fd = -1;
}

static void open_device(void)
{
	video_fd = open(dev_video, O_RDWR /* required */ | O_NONBLOCK, 0);
	if (-1 == video_fd) {
		fprintf(stderr, "Cannot open '%s': %d, %s\n", dev_video, errno,
			strerror(errno));
		exit(EXIT_FAILURE);
	}

	lcd_fd = open(dev_fb0, O_RDWR, 0);
	if (-1 == lcd_fd) {
		fprintf(stderr, "Cannot open '%s': %d, %s\n", dev_fb0, errno,
			strerror(errno));
		exit(EXIT_FAILURE);
	}
}
/*
将YUV格式数据转为RGB
*/
void yuv_to_rgb(unsigned char *yuv_buffer, unsigned char *rgb_buffer,
		int iWidth, int iHeight)
{
	int x;
	int z = 0;
	unsigned char *ptr = rgb_buffer;
	unsigned char *yuyv = yuv_buffer;

	for (x = 0; x < iWidth * iHeight; x++) {
		int r, g, b;
		int y, u, v;
		if (!z)
			y = yuyv[0] << 8;
		else
			y = yuyv[2] << 8;
		u = yuyv[1] - 128;
		v = yuyv[3] - 128;
		r = (y + (359 * v)) >> 8;
		g = (y - (88 * u) - (183 * v)) >> 8;
		b = (y + (454 * u)) >> 8;
		*(ptr++) = (b > 255) ? 255 : ((b < 0) ? 0 : b); // b color
		*(ptr++) = (g > 255) ? 255 : ((g < 0) ? 0 : g); // g color
		*(ptr++) = (r > 255) ? 255 : ((r < 0) ? 0 : r); // r color
		*(ptr++) = 0xff;                                // a color
		if (z++) {
			z = 0;
			yuyv += 4;
		}
	}
}

void rgb24_to_rgb565(char *rgb24, char *rgb16)
{
	int i = 0, j = 0;
	for (i = 0; i < 240 * 240 * 3; i += 3) {
		rgb16[j] = rgb24[i] >> 3; // B
		rgb16[j] |= ((rgb24[i + 1] & 0x1C) << 3); // G
		rgb16[j + 1] = rgb24[i + 2] & 0xF8; // R
		rgb16[j + 1] |= (rgb24[i + 1] >> 5); // G

		j += 2;
	}
}

static void lcd_image(unsigned int start_x, unsigned int end_x,
                    unsigned int start_y, unsigned int end_y,
                    unsigned char* color)
{
    unsigned long i;
    unsigned int j;
    /* 填充颜色 */
    i = start_y * vinfo.xres; //定位到起点行首

    for ( ; start_y <= end_y; start_y++, i+=(vinfo.xres*4))
    {
        for (j = start_x; j <= end_x*4; j++)
        {
            lcd_mem_p[i + j] = *color++;
        }
		*color--;
    }
}

int main(int argc, char **argv)
{
	dev_video = "/dev/video0";
	dev_fb0 = "/dev/fb0";
	open_device();
	video_init();
	lcd_init();
	/*3. 读取摄像头的数据*/
	struct pollfd video_fds;
	video_fds.events = POLLIN;
	video_fds.fd = video_fd;

	memset(&video_buffer, 0, sizeof(struct v4l2_buffer));
	rgb_buffer = malloc(CAM_WIDTH * CAM_HEIGHT * 4);
	yuv_buffer = malloc(CAM_WIDTH * CAM_HEIGHT * 4);
	unsigned char *rgb_p;
	int w, h, i, j;
	unsigned char r, g, b;
	unsigned int c;
	while (1) {
		/*等待摄像头采集数据*/
		poll(&video_fds, 1, -1);
		/*得到缓冲区的编号*/
		video_buffer.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
		video_buffer.memory = V4L2_MEMORY_MMAP;
		ioctl(video_fd, VIDIOC_DQBUF, &video_buffer);
		//printf("当前采集OK的缓冲区编号:%d,地址:%#X num:%d\n",
		       //video_buffer.index, video_buff_buff[video_buffer.index],
		       //strlen(video_buff_buff[video_buffer.index]));

		/*对缓冲区数据进行处理*/
		yuv_to_rgb(video_buff_buff[video_buffer.index], yuv_buffer, video_height, video_width);
		//rgb24_to_rgb565(yuv_buffer, rgb_buffer);


		//printf("显示屏进行显示\n");
		//显示屏进行显示: 将显存空间的数据拷贝到LCD屏进行显示
		/*memcpy(lcd_mem_p, yuv_buffer,
		       vinfo.xres * vinfo.yres * vinfo.bits_per_pixel / 8);*/
		// video stream show
		lcd_image(0, 640, 0, 480, yuv_buffer);

		//printf("buffer size: %d\r\n", (vinfo.xres * vinfo.yres * vinfo.bits_per_pixel / 8));
		/*将缓冲区放入采集队列*/
		ioctl(video_fd, VIDIOC_QBUF, &video_buffer);
		//printf("将缓冲区放入采集队列\n");
	}
	/*4. 关闭视频设备*/
	close(video_fd);

	return 0;
}
```
{% endfold %}

使用Tina-sdk的交叉编译工具链进行交叉编译，推入，运行：
```bash
# 编译
arm-openwrt-linux-gcc camera_test.c -o camera2framebuffer

# 推入开发板
adb push camera2framebuffer /mnt/UDISK

# 运行
cd /mnt/UDISK && ./camera2framebuffer
```

顺利的话，就能在屏幕上看到视频流啦！

<figure>
<img src="/images/关于基于全志T113-S3的86-Screen的一切/image-31.jpg" alt="" width = "400" height = "300" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

#### 自定义根目录系统

> 文章参考：https://bbs.aw-ol.com/topic/3907/请问下-t113-s3tinalinux-如何新增文件到根文件系统中

当我们已经对T113-S3和Tina-Linux足够了解，也写了不少程序了，每一次重新烧录镜像就要把程序再拷贝到开发板里，这样还是比较麻烦的。如何能够直接将我们所需要的文件、资源或者库依赖一起打包到镜像里面，生成一个自定义镜像呢，继续往下看吧！

首先，在对应的地方贴上你需要自定义的文件或者文件夹，比方说你要修改的`/etc`或者`/lib`的内容都可，如下，根据你的系统做不同的选择：
```bash
# procd-init
cd ~/tina-sdk/package/base-files/files
cd ~/tina-sdk/target/allwinner/t113-pi/base-files # 优先级更高
# busybox-init
cd ~/tina-sdk/package/busybox-init-base-files/busybox-init-base-files
cd ~/tina-sdk/target/allwinner/t113-pi/busybox-init-base-files # 优先级更高
```

然后，`make`，你会发现，如果你在里面放入了可执行文件，就会报错，因为执行make编译的时候会有脚本检测你放入当前路径的内容里面是否包含**可执行文件**，然后会找到它需要什么库依赖。

所以，此时编译报错，不要慌，翻翻编译记录，找到如下图所示的一些所需的库依赖：

![](/images/关于基于全志T113-S3的86-Screen的一切/image-32.png)

然后，在`~/tina-sdk/package/busybox-init-base-files/Makefile`或者`~/tina-sdk/package/base-files/Makefile`下添加如下内容（选择哪个Makefile一样是取决于你的系统）：

引号中改成你缺少的库名字就行啦，你缺什么就echo什么，格式按照下面的来：

```makefile
define Package/$(PKG_NAME)/extra_provides
	echo "libasound.so.2"; \
	echo "libc.so.6"; \
	echo "libcdx_base.so"; \
	echo "libfreetype.so.6" \
	echo "libjpeg.so.62"; \
	echo "libm.so.6"; \
	echo "libmad.so.0"; \
	echo "libncurses.so.5"; \
	echo "libpng12.so.0"; \
	echo "libpthread.so.0"; \
	echo "libstdc++.so.6"; \
	echo "libtplayer.so"; \
	echo "libudev.so.1"; \
	echo "libfreetype.so.6"; \
	echo "libjpeg.so.62"; \
	echo "libz.so.1";
endef
```

然后，重新编译make，可能你会发现又有新的报错，没关系往上翻编译记录，可能它还是会再报一两次的库依赖缺少，你继续把它缺少的库依赖在Makefile里面echo一下，最后就能编译成功啦，祝你成功！

接下来，pack，这个时候可能rootfs.fex的空间就不够大了，你需要修改一下`gedit ~/tina-sdk/device/config/chips/t113/configs/pi/sys_partition.fex`

把`rootfs`的size改大一些就行了，具体改多大呢，你可以把pack的报错和sys_partition.fex内容一起贴给ai，它会帮你算出一个合理的大小（我就是用豆包算的，der包~

重新修改后保存，重新再pack，到这一步，基本上就能打包成功啦！

#### ssh远程连接（测试）

```bash
# adb连接一下板子，然后输入下面的命令
uci set dropbear.@dropbear[0].PasswordAuth=on
uci set dropbear.@dropbear[0].RootPasswordAuth=on
uci commit dropbear

# 然后重启一下服务
/etc/init.d/dropbear restart

# 设置一下密码，默认账号是root
passwd
# 然后两次输入设置你自己的密码

# 接着你就可以用ssh远程连接啦~
```

...


---

### 写在后面

**鸣谢：**

- [@FanHuaCloud](https://oshwhub.com/fanhuacloud/works)：[基于T113-S3的86-Screen](https://oshwhub.com/fanhuacloud/t113-s3-86panel)

...

---