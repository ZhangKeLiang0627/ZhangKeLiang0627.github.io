---
title: STM32F405的DCMI外设的一些小的项目尝试🎶
excerpt: 真的没有想到过，F405居然还可以用来做摄像头方向！
tags: [Project, STM32, Camera, MCU]
# index_img: /img/post/14.jpg
# banner_img: /img/post/14.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/STM32F405的DCMI外设的一些小的项目尝试/pic2.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/14.jpg
categories: Project Page
comment: 'twikoo'
date: 2024-8-11 12:35:00

---

### STM32F405的DCMI外设的一些小的项目尝试🎶
### Use STM32F405 DCMI peripheral to do some small projects!!!
### Project name：Color-Tracer
### Author：@kkl

<p class="note note-warning">本文由于Gif图片存储较大，请耐心等待图片加载🙇‍♂️🙇‍♂️...</p>

---

<!-- {% gi 2 2 %}

<center><img src="/images/STM32F405的DCMI外设的一些小的项目尝试/pic2.jpg" alt="exhibition" width="75%;"></center>

<center><img src="/images/STM32F405的DCMI外设的一些小的项目尝试/pic3.jpg" alt="exhibition" width="100%;"></center>

{% endgi %} -->

{% gi 2 2 %}

<center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/STM32F405的DCMI外设的一些小的项目尝试/pic2.jpg" alt="exhibition" width="75%;"></center>

<center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/STM32F405的DCMI外设的一些小的项目尝试/pic3.jpg" alt="exhibition" width="100%;"></center>

{% endgi %}

## 前记

这些个项目Demos都是基于先前设计的基于STM32F405的HMI开发板LUMOS进行的开发。当时不知道是从哪里听来的STM32F405也可以使用DCMI外设的这个说法，我反复翻阅了意法半导体的芯片手册，上面明确指出STM32F405是没有DCMI这个外设的。

但是出于好奇，也算是机缘巧合之下，在Bilibil看见有同学拿F405结合摄像头实现了电赛送药小车题目的数字识别，根据那位同学的描述，F405其实是有DCMI外设的，使用标准库可以驱动，但是在HAL库将这个外设阉割掉了hhh，当然现在使用HAL库是趋势，但难免还是为这样的损失而感到可惜。

于是乎，我就想要亲身复现一下这位同学利用STM32F405和摄像头实现的数字识别功能，所以就有了下面一系列的折腾...

<p class="note note-info">当然，这些DEMOs都比较远古，包括代码和硬件设计都比较稚嫩，仅仅只做提供思路和参考的作用！仅以此博客，纪念这个有趣的尝试hhh😁</p>

## 关于程序

### 在LCD屏幕上显示摄像头画面

> 1. 全屏显示(240x240)

<center><img src="/images/STM32F405的DCMI外设的一些小的项目尝试/pic1.jpg" width="80%;" style="border-radius: 15px;"></center>
<!-- <center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/STM32F405的DCMI外设的一些小的项目尝试/pic1.jpg" width="80%;" style="border-radius: 15px;"></center> -->



### 对特定的颜色进行识别与跟踪

> 2. 颜色识别(白、红、绿)

默认烧录为识别追踪浅绿色（草绿色），可以前往`dcmi.c`文件当中修改`TARGET_CONDI Conditionred`变量为其他色彩阈值。

演示效果如下：
<center><img src="/images/STM32F405的DCMI外设的一些小的项目尝试/vedio1_converted.gif" width="100%;" style="border-radius: 15px;"></center>
<!-- <center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/STM32F405的DCMI外设的一些小的项目尝试/vedio1_converted.gif" width="90%;" style="border-radius: 15px;"></center> -->

### 识别标准数字(0-9)

> 3. 数字识别(模板匹配)

<center><img src="/images/STM32F405的DCMI外设的一些小的项目尝试/vedio2_converted.gif" width="50%;" style="border-radius: 15px;"></center>
<!-- <center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/STM32F405的DCMI外设的一些小的项目尝试/vedio2_converted.gif" width="50%;" style="border-radius: 15px;"></center> -->

## 关于硬件

硬件是我自己制作的基于STM32F405的HMI开发板LUMOS，但不是最新的版本，[最新版本戳这里:p](https://oshwhub.com/hugego/lumos-stm32f405-based-hmi-core-board).

您可以到关联仓库当中的`2.Hardware`当中获取旧版本的PCB打样文件，top为顶板，base为底板，但是本项目不建议复刻。

外观展示如下：

<img src="/images/STM32F405的DCMI外设的一些小的项目尝试/vedio3_converted.gif" width="100%;" style="border-radius: 15px;">

<br></br>


<!-- {% gi 2 2 %} -->

<!-- <img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/STM32F405的DCMI外设的一些小的项目尝试/vedio3_converted.gif" width="99.5%;"> -->

<!-- <img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/STM32F405的DCMI外设的一些小的项目尝试/vedio4_converted.gif" width="100%;"> -->

<!-- {% endgi %} -->

## 后记

- 关联的仓库[请戳这里;P](https://github.com/ZhangKeLiang0627/Color-Tracer)，您可以在该仓库中获取项目源码和PCB打样文件，但，**因为历史过于悠久不推荐复刻本项目。**
