---
title: 全志T113-S3的TinaLinux编译流程记录
excerpt: 折磨人的东西，终于是编译出来啦！
tags: [Allwinner, T113-S3, Ubuntu]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/15.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/15.jpg
categories: Study Page
comment: 'twikoo'
# hide: true
date: 2024-11-24 13:41:00
---

### 全志T113-S3的TinaLinux编译流程记录
### Author: kkl

{% note success %}
挖坑ing...有空来填坑！！！
{% endnote %}

{% note info %}
填好啦:)
{% endnote %}

---

### 写在前面

**T113-S3**是**全志**的一款非常不错的能够跑Linux系统的Soc，该芯片采用**双核A7**，**主频高达1.2GHz**，具备**高效能**和**低功耗**的特点，**片上内存128MB**，**支持硬件解码**，和D1s Pin to Pin，支持相互替换支持全志提供的Tina Linux SDK，文档齐全，对于DIY玩家来说用于制作一些带显示屏的小设备是非常完美了。

前阵子在“海鲜市场”低价入了韦东山的T113-S3的开发板，经过一番摸索以后发现了TinaLinux这个新奇的东西，听说是全志基于`Openwrt`自研的系统（被戏谑为全志家的小女儿。

**_本篇文章将简述如何迅速地对Tina Linux进行编译、打包，最终生成可烧录的镜像。_**

#### 我的环境

- 虚拟机：VirtualBox Ubuntu 18.04
- 开发板：100ASK_T113-PRO

---

### 开始

#### 获取SDK源码

首先我们需要获取`Tina-sdk`的源码：

> 百度网盘获取地址链接：https://pan.baidu.com/s/13uKlqDXImmMl9cgKc41tZg?pwd=qcw7 提取码：qcw7

1. 下载完成后将包含所有压缩文件的`DongshanNezhaSTU-TinaV2.0-SDK`文件夹拷贝到Ubuntu系统中，注意请不要在共享文件夹当中直接解压，要先拷贝到Linux系统目录中。位置可以随意，这里为了方便演示，我直接拷贝到Ubuntu系统的`~`目录下。

2. 进入该文件夹`cd ~/DongshanNezhaSTU-TinaV2.0-SDK/`并执行如下解压缩命令`cat tina-d1-h.tar.bz2.* | tar -jxv`，等待解压缩完成（大致要 3 ~ 5 分钟。

3. 把解压缩出的文件夹移动到`~`目录下：`mv ~/DongshanNezhaSTU-TinaV2.0-SDK/tina-d1-h ~`

#### 配置ubuntu环境

接着，我们配置开发环境，这里以`Ubuntu 18.04`举例，执行以下命令:
`sudo apt-get install build-essential subversion git libncurses5-dev zlib1g-dev gawk flex quilt libssl-dev xsltproc libxml-parser-perl mercurial bzr ecj cvs unzip lib32z1 lib32z1-dev lib32stdc++6 libstdc++6 libc6:i386 libstdc++6:i386 lib32ncurses5 lib32z1 -y`

#### 获取补丁包

SDK源码解压缩完毕后，我们获取扩展支持仓库（因为SDK源码不适配T113，要打个补丁，让源码支持T113，然后加以应用，依旧是在`~`目录下按顺序执行以下命令：

```shell
book@ubuntu1804:~$ git clone https://github.com/DongshanPI/100ASK_T113-Pro_TinaSDK.git
book@ubuntu1804:~$ cd 100ASK_T113-Pro_TinaSDK
book@ubuntu1804:~/100ASK_T113-Pro_TinaSDK$ git submodule update --init
book@ubuntu1804:~/100ASK_T113-Pro_TinaSDK$ cp ./* -rfvd ~/tina-d1-h
book@ubuntu1804:~/100ASK_T113-Pro_TinaSDK$ sync
```


#### 配置单板编译

应用完成，可以进入之前解压缩过的`tina-d1-h`的sdk目录内`cd ~/tina-d1-h/`，执行如下命令来开始编译`T113 Tina-SDK`：

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

book@ubuntu1804:~/tina-d1-h$ make
```

编译时间比较漫长，单核编译大概要 40 ~ 60 分钟...**途中可能会出现让你填写`[Y/n]`的情况，会填就按照自己的需求来填，不会填就全部填`n`，影响不大的。**


编译成功的现象：
<!-- ![编译成功](images/全志T113-S3的TinaLinux编译流程记录/image.png) -->
![编译成功](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/全志T113-S3的TinaLinux编译流程记录/image.png)

**但是编译总不是一帆风顺的，我在这儿也花费了不少时间来解决一些报错问题，下面一一罗列出来：**

**问题1.** `~/tina-d1-h/out/t113-100ask/compile_dir/target/fontconfig-2.13.1/missing: line 81: gperf: command not found`：具体错误是缺少 `gperf` 工具。

**解决方法**：`sudo apt-get install gperf`，通过系统的软件包管理工具来安装`gperf`.

**问题2.** Tina-Linux尝试下载`qt-5.12.9.tar.xz`失败。

**解决方法**：因为我使用T113S3主要还是使用LVGL图形库的，跑Qt还是比较吃力，于是干脆就不编译Qt了，具体方法如下：
```shell
book@ubuntu1804:~/tina-d1-h$ make menuconfig

# 找到 gui -> Qt，进入其中并把所有的 [*] 都取消，保存并退出，然后重新编译make。
```

#### 烧写更新系统

编译完成后，执行`pack`命令即可开始打包系统操作，打包完成后，最后会提示`pack finish`以及使用**红色背景色**告诉你最终输出的镜像文件。

我们可以通过 `ssh / vmware` 拖拽等工具，将生成的镜像文件 `copy` 出来使用即可。

```shell
book@ubuntu1804:~/tina-d1-h$ pack
```

打包成功的现象：
<!-- ![打包成功](images/全志T113-S3的TinaLinux编译流程记录/image-1.png) -->
![打包成功](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/全志T113-S3的TinaLinux编译流程记录/image-1.png)

烧写方式有两种，一种是使用OTG线连接板子进行烧写，使用`PhoenixSuit`将编译生成的镜像烧录至`spi nand`存储设备上；另一种是通过[PhoenixCard-V2.8](https://gitlab.com/dongshanpi/tools/-/raw/main/PhoenixCard-V2.8.zip
)工具将系统镜像烧录至TF卡启动。

> 先使用`SD Card Formatter`将TF卡进行格式化，然后使用`PhoenixCard-V2.8`对TF卡进行烧写，操作如图所示：
<!-- ![PhoenixCard-V2.8](images/全志T113-S3的TinaLinux编译流程记录/image-2.png) -->
![PhoenixCard-V2.8](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/全志T113-S3的TinaLinux编译流程记录/image-2.png)

---

### 写在后面

鸣谢以下教程：
- https://github.com/DongshanPI/100ASK_T113-Pro_TinaSDK

---