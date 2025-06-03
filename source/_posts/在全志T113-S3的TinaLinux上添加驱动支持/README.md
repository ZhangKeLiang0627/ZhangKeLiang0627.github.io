---
title: 在全志T113-S3的TinaLinux上添加驱动支持
excerpt: 今天！可以放开地玩Linux啦🙆！
tags: [Allwinner, T113-S3, Ubuntu]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/15.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/15.jpg
categories: Study Page
comment: 'twikoo'
# hide: true
date: 2025-1-20 20:30:00
---

### 在全志T113-S3的TinaLinux上添加驱动支持
### Author: kkl

{% note success %}
大家看这篇文章之前，要先去看我先前的文章`全志T113-S3的TinaLinux编译流程记录`搭建好基本环境，[戳这儿直接跳转:)](https://zhangkeliang0627.github.io/2024/11/24/全志T113-S3的TinaLinux编译流程记录/README)
{% endnote %}

---

### 写在前面

**T113-s3**是**全志**的一款非常不错的能够跑Linux系统的Soc，该芯片采用**双核A7**，**主频高达1.2GHz**，具备**高效能**和**低功耗**的特点，**片上内存128MB**，**支持硬件解码**，和D1s Pin to Pin，支持相互替换支持全志提供的Tina Linux SDK，文档齐全，对于DIY玩家来说用于制作一些带显示屏的小设备是非常完美了。

前阵子在“海鲜市场”低价入了韦东山的T113-s3的开发板，经过一番摸索以后发现了TinaLinux这个新奇的东西，听说是全志基于`Openwrt`自研的系统（被戏谑为全志家的小女儿。

自从入坑以后，折腾折腾，就想加入更多的功能，加入自定义的外设，这个时候就不得不自己手动地修改设备树修改驱动啦。但是好在Tina-Linux已经为我们加入新的驱动做了许多的工作，于是我们今天所需完成的事情其实非常轻松，咱们来为T113s3添加一个`gpio-key驱动`和一个`xr829驱动`吧！


**_本篇文章将简述如何迅速地在Tina Linux添加驱动支持。_**

#### 我的环境

- 虚拟机：VirtualBox Ubuntu 18.04
- 开发板：100ASK_T113-PRO
- Tina-Linux版本：linux-5.4

---

### 开始

#### 添加gpio-key驱动

> 这里的100ask原文档的内容：[->戳这里跳转下载:P](https://gitee.com/weidongshan/eLinuxDevGeneralCourse/blob/master/06-2_TinaSDKLinuxKernel基本使用.pdf)

下面咱们来复现一下，原理原文档中讲的很清晰，我们跳过直接开始操作：

##### 增加设备节点

修改设备树文件，使用`Vscode`打开以下路径的设备树文件，`code ~/tina-d1-h/device/config/chips/t113/configs/100ask/linux/board.dts`；

新增`gpio-keys`的设备配置，开发板上的`User-Key`使用`PB4`引脚（注意要在根节点下添加，添加完成后，保存退出：

```dts
gpio-keys {
    compatible = "gpio-keys";
    status = "okay";
    vol-down-key {
        gpios = <&pio PB 4 GPIO_ACTIVE_LOW>;
        linux,code = <114>;
        label = "volume down";
        debounce-interval = <10>;
        wakeup-source = <0x1>;
    };
};

// compatible：用于匹配驱动
// status：是否加载设备
// vol-down-key：每一个按键都是单独的一份配置，需要分别区分开来
// gpios：GPIO 口配置
// linux,code：这个按键对应的 input 键值
// label：单个按键对应的标签
// debounce-interval：消抖时间，单位为us
// wakeup-source：是否作为唤醒源，配置了这个项的按键可以作为唤醒源唤醒系统
```

![board.dts add gpio-keys](images/在全志T113-S3的TinaLinux上添加驱动支持/image-11.png)

{% note warning %}
注意：添加节点之后请检查整个设备中是否存在其他设备使用`PB4`引脚的问题！
{% endnote %}

![make sure Pin-PB4 is available](images/在全志T113-S3的TinaLinux上添加驱动支持/image-12.png)

##### 增加内核模块

在`Tina-Linux SDK`中，`Kernel`模块和`SDK`直接做了强关联，原厂默认已经帮你配置好了常用模
块的依赖关系（别人帮我们写好了常见的驱动模块，比方说支持`interrupt-key, poll-key`驱动文件如下:

> - gpio poll key: lichee/linux-5.4/drivers/input/keyboard/gpio-keys-polled.c
> - interrupt key: lichee/linux-5.4/drivers/input/keyboard/gpio-keys.c 

于是我们只需要配置就好啦，执行`make menuconfig`，配置选项：

> Kernel modules > Input modules > kmod-input-gpio-keys

![menuconfig](images/在全志T113-S3的TinaLinux上添加驱动支持/image-13.png)

选中后，保存并退出，执行`make`命令，等待编译完成，打包烧录一气呵成，我们已经非常熟练了，[还不会的戳这里w=w](https://zhangkeliang0627.github.io/2024/11/24/全志T113-S3的TinaLinux编译流程记录/README)。

##### 开发板验证功能

- 查看是否出现新的`input`设备节点：`cat /proc/bus/input/devices`，**注意你的节点可能会跟示例中不一样，可能是`event1`或者其他，照常操作对其就行。**

![](images/在全志T113-S3的TinaLinux上添加驱动支持/image-14.png)

- 通过`cat`命令去捕获`event3`的操作：先输入命令行`cat /dev/input/event3`，然后按下`User-Key`按键，就能看见系统打印出来的信息（因为没有专门的用户程序去操作，所以看到的数据是乱码，正常现象，到这里咱们的按键驱动就打好啦！

![](images/在全志T113-S3的TinaLinux上添加驱动支持/image-15.png)

#### 添加xr829驱动（WiFi & BLE

> 这段的100ask原文档支持：[->戳这里:P](https://dshanpi.100ask.net/docs/D1s-CVBS/part6/TransplantingWiFiModuleXR829IntoD1s)

![read-only system](images/在全志T113-S3的TinaLinux上添加驱动支持/image.png)

其实100ask的T113s3这个tina-linux的镜像是适配了`xr829驱动`的，但是由于`rootfs`设置成了只可读系统，于是无法正常的初始化`wpa_supplicant`。现在我们就要解决这个只可读的问题，需要把原来的根文件系统 (squashfs) 改为 (ext4)，于是我们需要对内核进行以下步骤的修改：

##### 配置准备环境

> 1. 进入TinaLinux-SDK根目录`cd ~/tina-d1-h`
> 2. `source build/envsetup.sh`
> 3. `lunch`，并选择T113平台名称

##### 首先对`kernel_menuconfig`进行一些修改

执行`make kernel_menuconfig`：

> \>File Systems

![make kernel_menuconfig](images/在全志T113-S3的TinaLinux上添加驱动支持/image-1.png)

##### 对`menuconfig`进行一些修改

执行`make menuconfig`：

> \>Target Images

{% gi 2 2 %}
![make menuconfig](images/在全志T113-S3的TinaLinux上添加驱动支持/image-2.png)
![make menuconfig](images/在全志T113-S3的TinaLinux上添加驱动支持/image-3.png)
{% endgi %}

##### 编译内核与打包镜像（make & pack

如果`make`过程中遇到rootfs空间太小，无法分配内存的问题：可以回到`menuconfig`修改大一些`> Target Images > Root filesystem partition size(in MB)`

如果`pack`过程中遇到下图问题，可以执行`gedit ~/tina-d1-h/device/config/chips/t113/configs/100ask/sys_partition.fex`，修改大一些对应的分区容量：

{% gi 2 2 %}
<figure>
<img src="/images/在全志T113-S3的TinaLinux上添加驱动支持/image-4.png" alt="dl包过大的报错" width = "300" height = "150" style="border-radius: 10px;">
<figcaption>dl包过大的报错</figcaption>
</figure>

<figure>
<img src="/images/在全志T113-S3的TinaLinux上添加驱动支持/image-5.png" alt="dl包过大的报错" width = "300" height = "150" style="border-radius: 10px;">
<figcaption>dl包过大的报错</figcaption>
</figure>
{% endgi %}

##### 烧录与调试

烧录的方法咱就不多说啦：[戳这儿直接跳转:)](https://zhangkeliang0627.github.io/2024/11/24/全志T113-S3的TinaLinux编译流程记录/全志T113-S3的TinaLinux编译流程记录/README)

下面我们来说说如何**在开发板上**调试WiFi功能：

- 手动加载`xr829驱动`模块：`insmod xr829.ko`

- 启动wpa_supplicant：`/etc/init.d/wpa_supplicant start`

- 执行`ps`，查看 wpa_supplicant 是否启动成功（如下图，如果没有下图显示wpa_supplicant进程正在运行，说明启动失败：

![](images/在全志T113-S3的TinaLinux上添加驱动支持/image-6.png)

- 可以尝试手动启动wpa_supplicant：`wpa_supplicant -i wlan0 -Dnl80211 -c/etc/wifi/wpa_supplicant.conf -O /etc/wifi/sockets -B`

- 确认wpa_supplicant启动成功，可以进行WiFi扫描测试验证一下效果：`wifi_scan_results_test`

![](images/在全志T113-S3的TinaLinux上添加驱动支持/image-7.png)

- WiFi联网测试，`wifi_connect_ap_test <ssid> <pwd>`：`wifi_connect_ap_test HUGO 12345678`

- 查看 ip 地址：`ifconfig`

![](images/在全志T113-S3的TinaLinux上添加驱动支持/image-8.png)

- ping 百度测试：`ping www.baidu.com`

![](images/在全志T113-S3的TinaLinux上添加驱动支持/image-9.png)


##### FAQ

{% note primary %}
**Q：rootfs 已经更换为 ext4，为什么开发板卡在“无法加载根文件系统”这儿了（如图？**

![](images/在全志T113-S3的TinaLinux上添加驱动支持/image-10.png)

A：没有进行`make kernel_menuconfig -> File Systems -> <*> The Extended 4 (ext4) filesystem`。
{% endnote %}


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

### 写在后面

**鸣谢以下文章：**

驱动添加过程的问题答疑：

{% fold info @驱动添加过程的问题答疑 %}
- https://bbs.aw-ol.com/topic/618/faq-全志R系列如何解决wpa_supplicant服务启动问题
- https://bbs.aw-ol.com/topic/427/D1哪吒开发板wifi连接出错-这是什么情况
- https://bbs.aw-ol.com/topic/5173/将系统文件设置ext4格式-启动提示no-filesystem-could-mount-root
{% endfold %}


100ask文档参考：

{% fold info @100ask文档参考 %}
- https://dshanpi.100ask.net/docs/D1s-CVBS/part6/TransplantingWiFiModuleXR829IntoD1s
- https://dshanpi.100ask.net/docs/T113s3-Industrial/part8/TinaSDKV2.0LinuxKernelBasicDevelopment
- 全志`Linux Tina-SDK`开发完全手册：https://tina.100ask.net
- 百问网`T113-S3 Pro`资料下载页面：https://download.100ask.net/boards/Allwinner/T113/index.html
- 百问网`T113-S3 Pro`的基础开发手册：https://dshanpi.100ask.org/docs/T113s3-Pro/BoardIntroduction
{% endfold %}

其他：

{% fold info @其他 %}
- 电脑弹出U盘显示设备正在使用中（已解决：https://blog.csdn.net/m0_48556264/article/details/131456791
{% endfold %}

---