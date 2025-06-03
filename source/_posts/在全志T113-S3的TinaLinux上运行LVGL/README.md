---
title: 在全志T113-S3的TinaLinux上运行LVGL
excerpt: 今天！可以放开地玩Linux啦🙆！
tags: [Allwinner, T113-S3, Ubuntu, Lvgl]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/15.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/15.jpg
categories: Study Page
comment: 'twikoo'
# hide: true
date: 2024-12-22 20:30:00
---

### 在全志T113-S3的TinaLinux上运行LVGL
### Author: kkl

{% note success %}
大家看这篇文章之前，要先去看我先前的文章`全志T113-S3的TinaLinux编译流程记录`搭建好基本环境，[戳这儿直接跳转:)](https://zhangkeliang0627.github.io/2024/11/24/全志T113-S3的TinaLinux编译流程记录/README)
{% endnote %}

---

### 写在前面

**T113-S3**是**全志**的一款非常不错的能够跑Linux系统的Soc，该芯片采用**双核A7**，**主频高达1.2GHz**，具备**高效能**和**低功耗**的特点，**片上内存128MB**，**支持硬件解码**，和D1s Pin to Pin，支持相互替换支持全志提供的Tina Linux SDK，文档齐全，对于DIY玩家来说用于制作一些带显示屏的小设备是非常完美了。

前阵子在“海鲜市场”低价入了韦东山的T113-S3的开发板，经过一番摸索以后发现了TinaLinux这个新奇的东西，听说是全志基于`Openwrt`自研的系统（被戏谑为全志家的小女儿。

**_本篇文章将简述如何迅速地在Tina Linux运行LVGL。_**

#### 我的环境

- 虚拟机：VirtualBox Ubuntu 18.04
- 开发板：100ASK_T113-PRO

---

### 开始

#### 打开TinaLinux的menuconfig

首先我们要进入TinaLinux-SDK的根目录，`cd ~/tina-d1-h`并执行以下命令来设置环境：

```shell
book@ubuntu1804:~/tina-d1-h$ source build/envsetup.sh
Setup env done! Please run lunch next.
book@ubuntu1804:~/tina-d1-h$ lunch

You're building on Linux

Lunch menu... pick a combo:
     1. d1-h_nezha_min-tina
     2. d1-h_nezha-tina
     3. d1s_nezha-tina
     4. t113_nezha-tina

Which would you like?: 4
============================================
TINA_BUILD_TOP=/home/book/tina-d1-h
TINA_TARGET_ARCH=arm
TARGET_PRODUCT=t113_nezha
TARGET_PLATFORM=t113
TARGET_BOARD=t113-nezha
TARGET_PLAN=nezha
TARGET_BUILD_VARIANT=tina
TARGET_BUILD_TYPE=release
TARGET_KERNEL_VERSION=5.4
TARGET_UBOOT=u-boot-2018
TARGET_CHIP=sun8iw20p1
============================================
no buildserver to clean
[1] 35382

book@ubuntu1804:~/tina-d1-h$ make menuconfig
```
> 1. 进入TinaLinux-SDK根目录`cd ~/tina-d1-h`
> 2. `source build/envsetup.sh`
> 3. `lunch`，并选择T113平台名称
> 4. `make menuconfig`

#### 修改TinaLinux的LVGL配置

由于TinaLinux是适配了`littleVGL-v8`的，因此我们只需要在menuconfig当中将其开启即可使用啦！

按照下方步骤，打开对应的选项，然后保存退出即可！

```shell
Gui --->
    Littlevgl --->
        < > lv_demo
        <*> lv_examples （lvgl官方demo）
        -*- lvgl-8.1.0 use sunxifb double buffer （使能双缓冲，解决撕裂问题）
        [*] lvgl-8.1.0 use sunxifb cache （使能fb cache）
        [ ] lvgl-8.1.0 use sunxifb g2d （使能G2D硬件加速）
        [ ] lvgl-8.1.0 use sunxifb g2d rotate （使能G2D硬件旋转）
        [ ] lvgl-8.1.0 use freetype （自动链接freetype）
        <*> lv_g2d_test （g2d接口测试用例）
        <*> lv_monitor （压力测试与数据监测软件）
        < > smartva
        < > smartva_ota
```

LVGL的源码路径：`tina-d1-h/package/gui/littlevgl-8`


#### 重新编译内核

在以上的修改都完成以后，重新按照正常的流程编译即可。

```shell
# 内核编译
book@ubuntu1804:~/tina-d1-h$ source build/envsetup.sh
book@ubuntu1804:~/tina-d1-h$ lunch 4
book@ubuntu1804:~/tina-d1-h$ make

# 编译完成后，打包镜像
book@ubuntu1804:~/tina-d1-h$ pack
```

{% note warning %}
注意：`pack`命令在打包镜像的时候，有可能会遇到dl包过大的报错，如下：
{% endnote %}

<!-- ![alt text](images/在全志T113-S3的TinaLinux上运行LVGL/image-1.png) -->
![alt text](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在全志T113-S3的TinaLinux上运行LVGL/image-1.png)

这是因为内核编译时开启了LVGL的package，导致编译生成的`rootfs.fex`包大于设定的最大尺寸限制。因此，需要修改一下最大尺寸的设置，修改路径如下：

```shell
# gedit ~/tina-d1-h/device/config/chips/t113/configs/100ask/sys_partition.fex
vim ~/tina-d1-h/device/config/chips/t113/configs/100ask/sys_partition.fex

# 修改为如下的参数，增加rootfs分区容量
[partition]
    name         = rootfs
    size         = 74800
    downloadfile = "rootfs.fex"
    user_type    = 0x8000
```

修改后，重新执行`pack`即可！

#### 测试LVGL

将新生成的img镜像烧录到TF卡，将内存卡插入开发板，上电进入系统以后执行指令如下：

```shell
~：lv_examples 0  (lv_demo_widgets)
~：lv_examples 1  (lv_demo_music)
~：lv_examples 2  (lv_demo_benchmark)
~：lv_examples 3  (lv_demo_keypad_encoder)
~：lv_examples 4  (lv_demo_stress)
~：lv_monitor
```

#### 加入触摸支持

{% note info %}
按照上述方法一路走来，虽然LVGL的几个示例程序已经可以在开发板上运行了，但是无法通过触摸控制，因此接下来，我们为程序加入触摸支持吧！
{% endnote %}

##### 修改TinaLinux的内核触摸配置

配置内核增加电容屏驱动`GT911`：

> 1. 进入TinaLinux-SDK根目录`cd ~/tina-d1-h`
> 2. `source build/envsetup.sh`
> 3. `lunch`，并选择T113平台名称
> 4. `make kernel_menuconfig`

然后如下面这些图一样，把对应的选项都打上`*`：

<!-- {% gi 5 2-3 %}

![](images/在全志T113-S3的TinaLinux上运行LVGL/image-2.png)
![](images/在全志T113-S3的TinaLinux上运行LVGL/image-3.png)
![](images/在全志T113-S3的TinaLinux上运行LVGL/image-4.png)
![](images/在全志T113-S3的TinaLinux上运行LVGL/image-5.png)
![](images/在全志T113-S3的TinaLinux上运行LVGL/image-6.png)

{% endgi %} -->

{% gi 5 2-3 %}

![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在全志T113-S3的TinaLinux上运行LVGL/image-2.png)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在全志T113-S3的TinaLinux上运行LVGL/image-3.png)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在全志T113-S3的TinaLinux上运行LVGL/image-4.png)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在全志T113-S3的TinaLinux上运行LVGL/image-5.png)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在全志T113-S3的TinaLinux上运行LVGL/image-6.png)

{% endgi %}

##### 为LVGL的`lv_drv_conf.h`添加触摸屏控制
在`tina-d1-h/package/gui/littlevgl-8/lv_examples/src/lv_drv_conf.h`中修改`EVDEV_NAME`为触摸屏的`event`节点：

```c
# lv_drv_conf.h

#ifndef USE_EVDEV
#  define USE_EVDEV           1
#endif

#ifndef USE_BSD_EVDEV
#  define USE_BSD_EVDEV       0
#endif

#if USE_EVDEV || USE_BSD_EVDEV
#  define EVDEV_NAME   "/dev/input/event1"        /*You can use the "evtest" Linux tool to get the list of devices and test them*/
#  define EVDEV_SWAP_AXES         0               /*Swap the x and y axes of the touchscreen*/
```

这个地方一般情况下`event1`节点就是我们的触摸输入节点啦，或者你可以自行去查看：`event`可以在开发板的linux系统中使用`cat /dev/input/eventX`(X请用数字替代)，确认是否正确.

最后没什么问题，就重新正常的编译内核，然后烧录，然后运行LVGL示例程序看看触摸效果啦！

##### 触摸测试

查看输入节点：`cat /proc/bus/input/devices`
<!-- ![查看输入节点](images/在全志T113-S3的TinaLinux上运行LVGL/image-7.png) -->
![查看输入节点](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在全志T113-S3的TinaLinux上运行LVGL/image-7.png)

查看原始触摸数据：`hexdump /dev/input/event1`

查看中断：`cat /proc/interrupts`


#### adb命令（这里临时穿插一条，不然以后找不到

- `adb devices`，该命令用于查找已经连接上Ubuntu系统上的adb设备.
  
- `adb push`，该命令用于**将Ubuntu系统上的文件上传到开发板**，比如:

```shell
adb push demo  /tmp
```

这表示将Ubuntu系统内当前目录下的`demo`文件上传到开发板的`/tmp`目录下.

- `adb pull`，该命令用于**从开发板获取文件到Ubuntu系统上**，比如：

```shell
adb pull /tmp/demo .
```

这表示下载开发板中的`/tmp/demo`文件到当前目录下.

- `adb shell`，该命令用于**打开开发板的命令行**.

---

{% note success %}
如果你想要做自己的一些LVGL的开发，在TinaLinux上开发自己的LVGL项目，可以参照这篇文章：[click here!](https://allwinner-docs.100ask.net/Application/LVGL8-UI/100ASK_T113-PRO_01-Introduction.html)
{% endnote %}

我的T113-S3的LVGL-Tamplate（经过[100ask原仓库的LVGL模板](https://github.com/DongshanPI/T113-lv_port_linux_frame_buffer)修改而来：[-> chilk here for download (24.4MB)!!!](https://zhangkeliang0627.github.io/images/在全志T113-S3的TinaLinux上运行LVGL/t113s3_lv_tamplate.zip)

### 写在后面

鸣谢以下教程：
- https://blog.csdn.net/weixin_43482414/article/details/139090866
- https://blog.csdn.net/noabcd32/article/details/130602900

---