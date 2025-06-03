---
title: 基于STM32和SimpleFOC的EasyFOC矢量控制器
excerpt: 基于STM32F401的迷你FOC矢量控制驱动器，巨小而且五脏俱全😆
tags: [STM32, SimpleFOC, Project]
index_img: images/基于STM32和SimpleFOC的EasyFOC矢量控制器/image-0.jpg
banner_img: images/基于STM32和SimpleFOC的EasyFOC矢量控制器/image-0.jpg
categories: Project Page
comment: 'twikoo'
date: 2024-12-27 14:54:00

---

### 基于STM32和SimpleFOC的EasyFOC矢量控制器
#### 基于STM32F401的迷你FOC矢量控制驱动器，巨小而且五脏俱全😆
#### Author：@kkl

---

![EasyFOC](images/基于STM32和SimpleFOC的EasyFOC矢量控制器/image-0.jpg)

## 写在前面

{% note info %}
本项目基于：**SimpleFOC** & **Ctrl-FOC-Lite**
{% endnote %}

Github关联仓库：https://github.com/ZhangKeLiang0627/EasyFOC
立创硬件开源：https://oshwhub.com/hugego/easyfoc

> 本项目`EasyFOC`旨意用于学习FOC时对SimpleFOC算法的验证，感谢@loop222提供的系列移植教程：[戳这里:)](https://blog.csdn.net/loop222/article/details/119220638)

---

## 开始

### Hardware

#### 硬件配置
- 1. 主控：STM32F401RET6
- 2. 屏幕：SSD1312 Oled 0.96inch IIC接口 128x64分辨率
- 3. 电机驱动：DRV8313
- 4. 电流采样：INA240A2
- 5. 蓝牙通信：KT6368A
- 6. 串口通信：CH340N
- 7. 外壳：3D打印

#### Snapshots

{% gi 2 2 %}
<figure>
<img src="/images/基于STM32和SimpleFOC的EasyFOC矢量控制器/image-1.jpg" alt="PCB-Front" width = "300" height = "300" style="border-radius: 15px;">
<figcaption>PCB-Front</figcaption>
</figure>

<figure>
<img src="/images/基于STM32和SimpleFOC的EasyFOC矢量控制器/image-2.jpg" alt="PCB-Back" width = "300" height = "300" style="border-radius: 15px;">
<figcaption>PCB-Back</figcaption>
</figure>

{% endgi %}

{% gi 2 2 %}
<figure>
<img src="/images/基于STM32和SimpleFOC的EasyFOC矢量控制器/image-4.jpg" alt="PCB-Front" width = "300" height = "300" style="border-radius: 15px;">
<figcaption>PCB-Front</figcaption>
</figure>

<figure>
<img src="/images/基于STM32和SimpleFOC的EasyFOC矢量控制器/image-5.jpg" alt="PCB-Back" width = "300" height = "300" style="border-radius: 15px;">
<figcaption>PCB-Back</figcaption>
</figure>

{% endgi %}

![3D-Shell](images/基于STM32和SimpleFOC的EasyFOC矢量控制器/image-3.jpg)


### Firmware

#### 软件功能

- 目前已经实现**小功率无刷电机的位置、角度开闭环控制，适配了电流环的代码，可以正常运行。** 
- 支持使用串口进行有线调试或者使用**蓝牙**进行无线调试。
- 支持3S航模锂电池接入（12.6V / XT60接口）.
- 板载Oled、两颗实体按钮以及蜂鸣器方便于人机交互。
- 引出一路IIC接口和一路SPI接口。
- 引出SWD烧录口，方便使用`ST-Link`or`DAP-Link`进行程序烧录。

#### Showcases

- 力矩测试 - Torque
![torque](images/基于STM32和SimpleFOC的EasyFOC矢量控制器/torque.gif)

- 速度测试 - Velocity
![velocity](images/基于STM32和SimpleFOC的EasyFOC矢量控制器/velocity.gif)

- 角度测试 - Angle
![Angle](images/基于STM32和SimpleFOC的EasyFOC矢量控制器/angle.gif)

- 速度迅速转向测试 - Velocity hard test
![Velocity hard test](images/基于STM32和SimpleFOC的EasyFOC矢量控制器/velocity_hard_test.gif)

#### 待改进
- 该款MCU并不支持CAN通信（sad:(
- `STM32F401`计算速度有限，驱动电机的同时驱动Oled稍显吃力，更换为`STM32F405`可能会更好，而且解决了没有CAN的问题。
- ...

## 写在后面

相关文章参考：
- @稚晖君：https://zhihui.lingjun.life/2020/07/02/foc/
- @loop222：https://blog.csdn.net/loop222/article/details/119220638
- @SimpleFOC：http://simplefoc.cn/#/