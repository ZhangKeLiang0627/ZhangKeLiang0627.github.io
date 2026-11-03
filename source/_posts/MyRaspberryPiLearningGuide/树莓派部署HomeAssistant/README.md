---
title: 【树莓派】在树莓派部署HomeAssistant
excerpt: 久违地拿起了我那堆在阴暗小角落浮满灰尘的树莓...
tags: [Linux, RaspberryPi, HomeAssistant]
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image.png
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image.png
categories: Study Page
comment: 'twikoo'
date: 2025-1-9 20:55:00
---

### 【树莓派】在树莓派部署HomeAssistant
### 【Raspberry PI】Deploy HomeAssistant on Raspberry Pi
### Author: @kkl

---
### 写在前面

<!-- ![HomeAssistant logo](images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image.png) -->
![HomeAssistant logo](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image.png)

`HomeAssistant`是一个开源的智能家居自动化平台，它允许用户通过一个中心化的系统来控制和管理家中的各种智能设备。它的设计理念是为用户提供一个无需依赖特定制造商的解决方案，因此，它可以集成来自不同品牌的智能设备（如Xiaomi），为用户提供一个开放且可定制的智能家居体验。

> HomeAssistant官网：https://www.home-assistant.io

学习需要用到`HomeAssistant`啦，这个词其实对我来说并不陌生，但是从前都只是只听其名不见闻其声，如今终于要上手啦！拯救落灰树莓派行动！出发！

#### 环境
* 硬件：Raspberry Pi 4B
* 镜像版本：**HA-OS版本 HomeAssistant** or **2022-09-22-raspios-bullseye-arm64.img**：[-> 上交的镜像源](https://mirror.sjtu.edu.cn/raspberry-pi-os-images/raspios_arm64/images/raspios_arm64-2022-09-26/)
* Python版本：`3.9.2`

#### HomeAssistant 版本

![](images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image-5.png)

`HomeAssistant`一共推出了4种版本：HA-OS, Docker, Core, Supervised.

优先推荐安装`HA-OS`版本，因为该版本安装简易，同时有`Add-on`和`Superviser`，拥有加载项商店，可以方便地下载插件！

**_本篇文章将简述如何迅速地在树莓派部署 HomeAssistant（`HA-OS`和`Core`）。_**

---

### 安装`HA-OS`版本的HA

直接使用`Raspberry Pi Imager`对tf卡进行`HA-OS`系统烧录即可，具体操作官网写得很详细：[戳这里:)](https://www.home-assistant.io/installation/raspberrypi)

值得注意的是，烧录好tf卡后将tf卡插入树莓派，此时树莓派处于无网络状态，你可以使用网线连接树莓派给其提供网络环境，也可以用让树莓派连接WiFi的方式连接网络，用HDMI线将树莓派连接屏幕，屏幕会显示树莓派输出的命令行信息 (Home Assistant CLI)，接下来，将示范如何使用`HomeAssistant`首次使用配置连接无线网：

```shell
# 在首次使用Home Assistant操作系统时，有网线方式可以直接联网；没网线时就需要配置好WiFi，就是在ha提示符下输入以下联网命令：
network update wlan0 --wifi-ssid "你的WiFi名称" --wifi-psk 你的WiFi密码 --wifi-auth wpa-psk --wifi-mode infrastructure --ipv4-method auto

# 查看网络信息（包括ip地址等
network info
```
{% note info %}

**浏览器输入以下网址打开HA的页面：**

> `homeassistant.local:8123`，HA的系统操作界面
> `homeassistant.local:4357`，HA的`Observer`界面

{% endnote %}


#### FAQ

> **Q：**`homeassistant.local:8123`无法访问但是`homeassistant.local:4357`的`Observer`可访问？
**A：**如果是`404 not found`就全部推倒重来；如果是提示暂时无法访问，其实是`Supervisor`在更新，得等待几分钟至几个小时。


### 安装`Core`版本的HA

#### a. 更新源

首先，拿到落灰的小树莓派，先更新源，确保系统能够获取到最新的软件和安全更新，稍微等待，完成即可：

```shell
sudo apt-get update
sudo apt-get upgrade
```

#### b. 安装 HomeAssistant

1. 先安装一下依赖：

```shell
sudo apt-get install -y python3 python3-dev python3-venv python3-pip libffi-dev libssl-dev libjpeg-dev zlib1g-dev autoconf build-essential libopenjp2-7 libtiff5 --fix-missing
```

2. 创建虚拟环境

- 创建安装`Home Assistant`的目录

```shell
mkdir ~/hass
```

- 创建并激活用于`Home Assistant`的虚拟环境

先`cd ~/hass`，进入hass文件夹内，这就是以后要安装homeassistant的位置.

然后，输入以下命令创建虚拟环境：

```shell
python3 -m venv /home/pi/hass
```

执行完成后，在hass文件夹内`ls`一下，可以看见多了很多文件，说明虚拟环境已经创建成功了...(

- 接下来，激活虚拟环境：

```shell
source bin/activate
```

看到命令行前多加了一个`(hass)`，就代表环境激活成功啦！

3. 安装HomeAssistant

- 这里国内的下载速度可能会很慢，导致数据丢包报错，我们可以尝试为pip3下载源换源：

```shell
# 先为换源前的文件做备份
sudo cp /etc/pip.conf /etc/pip.conf.bak

# 为pip.conf加入aliyun的下载源
sudo vi /etc/pip.conf

# 将内容修改成以下内容，然后保存退出
[global]
index-url=https://mirrors.aliyun.com/pypi/simple/
extra-index-url=https://www.piwheels.org/simple
```

- 换源后，在虚拟环境中，安装Python package.

```shell
python3 -m pip install wheel
```

- 安装 Home Assistant Core.

安装时会稍微有些爆警告，但是不要紧的，静待下载完成，看到绿色的{% label success @success %}字样说明安装成功.

```shell
pip3 install homeassistant
```


#### b. 启动 HomeAssistant

1. 执行以下命令启动 HomeAssistant：

```shell
hass

# or启动成功会帮我我们自动打开web
hass --open-ui
```

首次启动 Home Assistant 时，系统会创建`~/.homeassistant`目录用于承载配置文件，并安装所需的基础依赖，这个过程会花费一定时间，请耐心等待（大约十分钟左右，可以去泡杯咖啡活动活动身体...

![首次启动HA](images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image-1.png)


2. 使用局域网内其他设备，通过浏览器访问HA页面

就算过了很久，命令行也没有动静没有输出任何东西的话也不要紧，打开浏览器如`Edge`，输入`树莓派的ip地址:8123`，例如`192.168.137.88:8123`，查看是否初始化完成。

初始化完成后会进入以下页面：

![HA注册界面](images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image-2.png)

接下来只要按步骤注册账号填写个人信息即可进入HA界面啦！

![HA用户界面](images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image-3.png)

### 写在后面

![HomeAssistant logo](images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image-4.png)


鸣谢：

- https://blog.csdn.net/qq_41793286/article/details/129041488
- https://blog.csdn.net/weixin_44614230/article/details/127593587
- https://blog.csdn.net/ajianlee/article/details/129956339
- https://blog.csdn.net/q1uTruth/article/details/121625560