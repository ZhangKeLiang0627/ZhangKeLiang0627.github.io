---
title: 对Qt项目进行打包的三种方式
excerpt: PPPack！一处打包到处运行，🥳🐍
tags: [Qt]
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-0.png
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-0.png
categories: Study Page
comment: 'twikoo'
# hide: true
date: 2025-1-2 21:04:00
---

### 对Qt项目进行打包的三种方式

#### PPPack！一处打包到处运行！
#### Author: kkl

{% note success %}
首先！是来到了2025年！新年快乐各位！🥳🐍
{% endnote %}

---

### 写在前面

先前，我有使用Qt写过一些项目，类似`EasyGPS`的上位机[EasyGPS-MAP](https://zhangkeliang0627.github.io/2024/09/02/基于Qt与高德地图API与阿里云MQTT的EasyMap/README/)，然后我发现我每一回要向他人展示的时候都需要打开`Qt Creater`然后重新编译一下这个项目才行（而且在Windows中打开Qt**真的很慢**，显然这种操作是不够优雅的，同时我有在别的电脑环境运行上位机的需要。基于以上诉求，这篇文章将会记录三种对Qt项目进行打包的方式！

**_本篇文章将简述如何迅速地对Qt项目进行打包。_**

#### 我的环境

- 电脑环境：Windows 11
- Qt版本：5.14.1

---

### 开始

### 1. 打包成绿色便携版本

> 特点：无需安装，可以制作成为一个压缩包文件来转发给别人，解压即用。

1. 首先，将项目的编译版本修改为`Release`，然后执行一次编译运行。这里不是必须要改，只是修改后发布的软件体积比较小，推荐使用`Release`.

2. 然后找到编译输出的目录类似`/build-EasyGPS-Map-Desktop_Qt_5_14_1_MSVC2017_64bit-Release`，然后进入`release`文件夹.

3. 把`release`文件夹中除了.exe文件以外的所有文件都删除，当然你也可以不删除，只不过会徒增内存，对功能无影响.

{% gi 2 1-1 %}

<figure>
<img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-1.png" alt="---" width = "800" height = "350" style="border-radius: 10px;">
<figcaption>---</figcaption>
</figure>

<figure>
<img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-2.png" alt="---" width = "800" height = "350" style="border-radius: 10px;">
<figcaption>---</figcaption>
</figure>

{% endgi %}

1. 根据你的**编译Kit**打开对应的**命令行工具**，比方说我这里使用的是`MSVC2017_64bit`进行的编译，那我就选择如图所示的工具：
<!-- ![](images/对Qt项目进行打包的三种方式/image-3.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-3.png)

1. 打开对应的命令行工具，cd到对应的`release`文件夹，然后执行`windeployqt + xxxname.exe`.

> 这里记录在windows命令行使用`cd`命令的小技巧，倘若你仅仅在一个盘内进行cd（如只在C盘、只在D盘，正常`cd + address`即可。
> 如果你要跨盘cd（如从C盘到D盘，此时需要`cd /d + address`，或者先敲一个`D: + 回车键`切换盘符，然后正常cd。

<!-- ![](images/对Qt项目进行打包的三种方式/image-4.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-4.png)

然后Qt自带的工具程序，会把该.exe文件缺失的库文件补充齐全，如下图。此时你就可以双击打开该.exe文件，惊喜地发现，它可以直接运行啦！
{% gi 2 2 %}

<figure>
<img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-5.png" alt="---" width = "400" height = "230" style="border-radius: 10px;">
<figcaption>---</figcaption>
</figure>

<figure>
<img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-6.png" alt="---" width = "400" height = "230" style="border-radius: 10px;">
<figcaption>---</figcaption>
</figure>

{% endgi %}


6. 接着，你可以单独将这个`release`文件夹压缩成压缩包发送给别人，解压即用！非常舒适！

### 2. 打包成单文件版本

> 特点：给他人发送一个包含运行环境的.exe文件，双击即用！无需压缩or解压。

**首先，你需要对Qt项目做`打包成绿色便携版本`的操作！**

这里使用软件`Enigma Virtual Box`进行Qt项目的封包，该软件官网下载地址：https://www.enigmaprotector.com/en/downloads.html

{% note warning %}
我的电脑环境是Windows 11，我选择64位的版本，然后下载安装时一路`next`就行，没什么特别的操作。
{% endnote %}

1. 打开软件`Enigma Virtual Box`，选择等待封包的主程.

<!-- ![](images/对Qt项目进行打包的三种方式/image-7.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-7.png)

1. 选择`增加...`->`增加文件夹[递归]`，选择`release`文件夹，点击`确定`.

<!-- ![](images/对Qt项目进行打包的三种方式/image-8.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-8.png)

3. 点击`文件选项`->`压缩文件`，然后点击`确定`.

<!-- ![](images/对Qt项目进行打包的三种方式/image-9.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-9.png)

4. 最后，点击`执行封包`.

<!-- ![](images/对Qt项目进行打包的三种方式/image-10.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/对Qt项目进行打包的三种方式/image-10.png)

5. 然后在`release`文件夹下会多出来一个`xxxname_boxed.exe`结尾的.exe文件啦！

{% note warning %}
不过请**注意**，如果你的Qt项目包含了类似`QtWebEngineWidgets`等模块，可能会导致封包失败或者封包之后的文件不可用！最好还是使用`打包成绿色便携版本`的方法吧，这个方法十分稳妥！
{% endnote %}

### 3. 打包成可安装版本

...


{% note info %}
未完待续...
{% endnote %}

### 写在后面

鸣谢以下教程：
- 视频教程：https://www.bilibili.com/video/BV1cB4aeHEHr
- 图文教程：https://blog.csdn.net/KK_2018/article/details/131899658

---