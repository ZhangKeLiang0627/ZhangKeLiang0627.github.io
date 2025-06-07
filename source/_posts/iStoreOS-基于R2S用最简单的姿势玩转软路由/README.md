---
title: iStoreOS - 基于R2S用最简单的姿势玩转软路由
excerpt: 咳咳，当然不只是用来科学上网的啦！以学习为主哦！
tags: [iStoreOS, R2S, 软路由]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-3.png
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-3.png
categories: Study Page
comment: 'twikoo'
# hide: true
date: 2025-2-4 17:26:00
---

### iStoreOS - 基于R2S用最简单的姿势玩转软路由
### Author: kkl

{% note success %}
**⚠️免责声明：叠甲术 Pro Plus Ultra!!!**
{% endnote %}

{% note warning %}
**⚠️免责声明：叠甲术 Pro Plus Ultra!!!**
{% endnote %}

{% note info %}
**⚠️免责声明：叠甲术 Pro Plus Ultra!!!**
{% endnote %}

---
### 写在前面

嘿哈，没想到我也来入门软路由啦！起因是因为初到公司（也是过上开始上班的日子哈）发现组里的WiFi非常的奇妙，无需梯子竟然也能优雅的科学上网。经过高人指点，原来是在原来的WiFi路由器的LAN口再接入一个软路由作为旁路由，应用科学节点，在同一个局域网下修改网关为旁路由，就可以科学上网了耶，太神奇了！

当然，软路由的应用远不于此，有了`iStoreOS`的加持，可以集齐NAS、去广告、个人影院等功能为一身！

`iStoreOS`是入门级的路由系统，也是入门级的`NAS`系统，基于原版`OpenWRT`，在`ARS2`上经过长期迭代，最终开放适配到多个硬件平台，更多信息戳这里参阅：https://github.com/istoreos

<!-- <figure>
<img src="/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-2.png" alt="iStoreOS" width = "650" height = "450" style="border-radius: 10px;">
<figcaption>iStoreOS</figcaption>
</figure> -->

<figure>
<img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-2.png" alt="iStoreOS" width = "650" height = "450" style="border-radius: 10px;">
<figcaption>iStoreOS</figcaption>
</figure>

`R2S`是友善电子制作的一款开发板，`NanoPi R2S`使用瑞芯微的SOC`RK3328`作为主控，有两个千兆网口（1 WAN / 1 LAN），同时配置有1G DDR4内存，从硬件资源上配置来看，非常适合做软路由。而且`R2S`外观小巧精致，搭配上了一体化CNC氧化铝外壳，才半个巴掌大小，我在某海鲜市场只花费了150+毛爷爷就到手啦！

{% gi 2 2 %}
![](images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image.png)
![](images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-1.png)
{% endgi %}

那我们这就开始吧！

**_本篇文章将简述如何迅速地利用R2S与iStoreOS部署旁路由。_**

#### 我的环境

**需要准备的物品：**

- 开发板：NanoPi R2S 1个
- tf卡：16GB及以上 1张
- 电源适配器：Type-C 5V2A及以上 1个
- 网线：1根

---

### 开始

#### 下载并为R2S烧录固件

下载R2S iStoreOS固件的最新版本：[戳这儿:)](https://www.koolcenter.com/fw/device/r2s/iStoreOS)

{% note warning %}
不知道为啥我用电脑无法下载，最后我拿手机浏览器把固件下载了下来hahah，然后传到电脑就好。
{% endnote %}

<!-- ![R2S iStoreOS固件](images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-5.png) -->
![R2S iStoreOS固件](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-5.png)

然后使用[Balena](https://www.balena.io/)对tf卡进行烧录即可，烧录完将tf卡插到R2S上然后就可以上电啦。

<!-- ![Balena](images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-4.png) -->
![Balena](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-4.png)

#### 设置为旁路由模式

{% note primary %}
**`iStoreOS`的系统登录默认参数：**
- **IP地址：**192.168.100.1
- **账号：**root
- **密码：**password
{% endnote %}

<figure>
<img src="/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-6.png" alt="iStoreOS登录界面" width = "650" height = "450" style="border-radius: 10px;">
<figcaption>iStoreOS登录界面</figcaption>
</figure>


`iStoreOS`的默认IP地址为 192.169.100.1，我的WiFi路由器的网段为 192.168.0.xxx**（不同的路由器网段可能不同**，这里我们将`R2S`接到WiFi路由器的 LAN 口上后，再将电脑的IP地址修改为 192.169.100.xxx 如下：

> 硬件连接：可以直接将电脑网口连接到`NanoPi-R2S`的 LAN 口，如果电脑没有网口，可将无线AP的 LAN 口与`NanoPi-R2S`的 LAN 口相连接，电脑再通过WiFi连接到无线AP.

<figure>
<img src="/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-7.png" alt="---" width = "650" height = "420" style="border-radius: 10px;">
<figcaption>---</figcaption>
</figure>

然后再在浏览器中输入 192.168.100.1，默认账号为 root，默认密码为 password，进入iStoreOS系统操作界面。

<!-- ![](images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-8.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-8.png)

点击`网络向导`选项，然后选择`配置为旁路由`：

<!-- ![](images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-9.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-9.png)

接着设置旁路由自身的IP地址为 192.168.0.2（只要和主路由同一个网段即可，以及主路由的IP地址等（此步可以选择自动设置：

<!-- ![](images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-10.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-10.png)

设置完成后，`R2S`自己会重启，我们现在可以将电脑的IP地址修改回原样啦（或者 192.168.0.xxx 内选一个。

再次来到浏览器中，输入我们新设置的旁路由的IP地址 192.168.0.2 打开iStoreOS系统操作界面。

此时设置一下防火墙：网络->防火墙->IP动态伪装☑️

<!-- ![](images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-11.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/iStoreOS-基于R2S用最简单的姿势玩转软路由/image-11.png)

此时，旁路由的系统设置就完成了，接下来我们来简单指路科学上网的功能（浅浅提一嘴，最后安装[代理科学上网插件](https://github.com/AUK9527/Are-u-ok)就好啦。

### FAQ
{% note primary %}

Q：在iStoreOS登录界面遇到以下的报错信息：

```shell
/usr/lib/lua/luci/dispatcher.lua:1136: Invalid controller file found
The file '/usr/lib/lua/luci/controller/store.lua' contains an invalid module line.
Please verify whether the module name is set to 'luci.controller.store' - It must correspond to the file path!
stack traceback:
[C]: in function 'assert'
/usr/lib/lua/luci/dispatcher.lua:1136: in function 'createindex'
/usr/lib/lua/luci/dispatcher.lua:1236: in function 'createtree'
/usr/lib/lua/luci/dispatcher.lua:638: in function 'menu_json'
/usr/lib/lua/luci/dispatcher.lua:887: in function 'dispatch'
/usr/lib/lua/luci/dispatcher.lua:482: in function </usr/lib/lua/luci/dispatcher.lua:481>
```

A：通过ssh连接到设备，删除`/usr/lib/lua/luci/controller/store.lua`，亲测有效，我也是这么解决的（笑，尽量选择下载新版本的固件吧，老版本的固件还是容易碰到许多奇奇怪怪的问题的。

{% note secondary %}

解决方法来源：https://github.com/maxlicheng/luci-app-unblockmusic/issues/23

{% endnote %}

{% endnote %}

### 写在后面

**参考：**

- iStoreOS官网：https://site.istoreos.com
- iStoreOS开源地址：https://github.com/istoreos/istoreos
- iStore代理插件包：https://github.com/AUK9527/Are-u-ok
- R2S iStoreOS固件：https://www.koolcenter.com/fw/device/r2s/iStoreOS

**鸣谢：**

- iStoreOS - 可能是目前使用软(旁)路由的最简单姿势：https://mintisan.github.io/post/istoreos-for-go-out
- R2S/R4S刷写OpenWrt（iStoreOS）软路由系统教程：https://unvmax.com/r2s-r4s刷写openwrt软路由系统教程.html
---