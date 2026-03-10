---
title: 「正点原子RK3588开发板」编译Ubuntu镜像
excerpt: 请跟紧/看好我秀的这一波操作...
tags: [rockchip, rk3588, Ubuntu]
index_img: /images/正点原子RK3588开发板编译Ubuntu镜像/image-2.jpg
banner_img: /images/正点原子RK3588开发板编译Ubuntu镜像/image-1.jpg

categories: Study Page
comment: 'twikoo'
date: 2026-3-10 00:05:00

---

### 「正点原子RK3588开发板」编译Ubuntu镜像
### Author：@kkl

{% note warning %}

本文已经完成施工🎉!

{% endnote %}


{% note success %}

好！你们好！好久不见！

关于这期文章，确实是充满着魔幻的故事的。首先我要强烈地抨击一波正点原子啊，我以前都是它们家的忠实粉丝，买了挺多开发板和开发工具的，但是这次我忍不住了，我真的太失望了，我跳！太失望了，退票！Ddddamn!!!

我二四年六月的时候从它们家买了一块RK3588的板子（8+64），但是由于那个时候学业繁忙，就没有玩起来，对原子家的生态、教程都是非常自信的，于是就把板子收藏好，直到今年才想到可以把板子掏出来玩玩，也刚好踏上了`OpenClaw`的浪潮啊，想着在RK3588上面部署一手。

然后发现，板子的四个角的其中一个铜柱虚焊了，脱落下来，只能靠螺丝拧在亚克力板上，这是硬件上的品控质量问题呀...

然后是，我想要在RK3588上装一个Ubuntu系统想着这样比较熟悉、比较好操作。然后给我一通好找，最好发现二五年十二月的时候，原子家下架了所有RK3588相关的Ubuntu资源、、、我跳！资料下载了好几个钟，你告诉我Ubuntu镜像没了，成绝版资源了？我能理解有bug下架，但你好歹给补一个版本吧，就这么不了了之了？！这不是一个很好的处理方式，我认为。

接着，找盆友找同事找网友，三番五次地找寻，终于找到了传说中的被官方下架的Ubuntu镜像，一顿烧录，结果发现，wifi驱动没有移植，只能插以太网，我跳！这年头谁家里常备网线呀，开发都是连wifi的好不啦！

此时已经对原子家失望透了，所幸天无绝人之路，几个月前，我还因为吐槽泰山派的生态差而用`Lubancat-SDK`给它做过镜像，那为啥不能给原子家的RK3588板子也做一个咧，说干就干，顺便把USB WiFi的驱动也一起打上，哼，你不提供技术支持，我自己来！真是太失望了，跳！

谢谢你们看完这段废话，发泄完毕。**下面分享一波，用Lubuncat-SDK给正点原子RK3588板子编译Ubuntu镜像的全过程...**

> Btw，之前我吐槽过泰山派的生态存在非常大的问题，然后今天我重新上人家的wiki去看的时候，人家连OpenClaw的部署、Docker的部署...都做出教程来了，说明人家什么，知错能改！还是值得支持一波的，很圈粉的操作。

**——from 2026.3.10**
{% endnote %}

<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image-0.jpg" alt="" width = "600" height = "400" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image-3.jpg" alt="" width = "600" height = "500" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>


---

## 写在前面

看得出这阵子接触到的瑞芯微的芯片还是比较多的，这个时候就不得不提起开发板行业内生态做的最好的`鲁班猫`，真的，感觉至少在资料方面是无人能敌的程度，真心赞！

<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image-2.png" alt="" width = "600" height = "500" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

**_本篇文章将简述如何使用鲁班猫SDK编译「正点原子RK3588开发板」的Ubutnu20.04镜像。_**

### 我的环境

- **虚拟机：**VMware Ubuntu 20.04，**RAM >= 4GB / ROM >= 80GB**
- **开发板：**原子家RK3588（8 + 64GB）
- **鲁班猫SDK：**LubanCat_Linux_Generic_SDK_20251029.tgz，_<u>我们使用的版本可能不一样，但是基本都是可以兼容的</u>_
- **编译镜像版本：**我们这次用鲁班猫SDK给RK3588编译的镜像版本是<span class="label label-primary">5.10内核的Ubuntu20.04</span>

### 你所需的准备

- 正点原子官方RK3588-buildroot-SDK(可选)：http://www.openedv.com/docs/boards/arm-linux/RK3588Linux.html （我选择的就是那个B盘中的`linux_r8_sdk`.
- 鲁班猫通用SDK(必选)：https://doc.embedfire.com/linux/rk356x/quick_start/zh/latest/quick_start/baidu_cloud/baidu_cloud.html
- 原子家RK3588的Device-tree和wifi-driver(必选)：[戳这里下载](/images/正点原子RK3588开发板编译Ubuntu镜像/atk-rk3588_device-tree_and_wifi-driver.7z)

## 开始

### 1. 搭建鲁班猫SDK：LubanCat_Gen_SDK

请移步文章[关于「基于rk3566的泰山派」的一切](https://zhangkeliang0627.github.io/2025/11/03/关于基于rk3566的泰山派的一切/README/#1-搭建鲁班猫SDK：LubanCat-Gen-SDK)进行SDK的搭建，讲解非常的细致！我这里就不反复赘述了。

### 2. 制作适配RK3588的镜像

#### 添加mk

我这次准备构建`5.10内核 + Ubuntu20.04`的`xfce`含有图形操作界面的环境，<span class="label label-success"><u>这里lite指无图形操作界面，xfce指有图形操作界面。</u>
</span>所以，先前往目录`~/LubanCat_SDK/device/rockchip/.chips/rk3588`，在这里新建了自己的配置文件是`Hugokkl_rk3588_ubuntu_linux5.10_xfce_defconfig`<u>（这里我是复制了一份`LubanCat_rk3588_ubuntu_linux5.10_xfce_defconfig`然后把里面的`RK_KERNEL_DTS_NAME`改为原子家提供的设备树，其他的都没有变化.</u>


<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

```cfg
# RK_BUILDROOT is not set
# RK_YOCTO is not set
RK_UBUNTU_FOCAL=y
RK_ROOTFS_SYSTEM_UBUNTU=y
RK_ROOTFS_TARGET_XFCE=y
RK_KERNEL_PREFERRED="5.10"
RK_KERNEL_CFG="lubancat_linux_rk3588_defconfig"
RK_KERNEL_DTS_NAME="rk3588-atk-devkit"
RK_KERNEL_EXTBOOT=y
# RK_RECOVERY is not set
RK_EXTRA_PARTITION_NUM=0
RK_PARAMETER="parameter-extboot.txt"
RK_USE_FIT_IMG=y
RK_PACKAGE_FILE_CUSTOM=y
RK_PACKAGE_FILE="package-file-extboot"
```

#### 添加设备树
首先，先[戳这里下载 -> atk-rk3588_device-tree_and_wifi-driver](/images/正点原子RK3588开发板编译Ubuntu镜像/atk-rk3588_device-tree_and_wifi-driver.7z)

获取到原子家RK3588开发板提供的设备树文件，或者你可以从它们家的资料盘的SDK当中拿到，几个设备树文件如下：

<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image-1.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

然后，把下载好的`device-tree`文件夹内的**这几个文件**放到设备树存放目录`~/LubanCat_SDK/kernel-5.10/arch/arm64/boot/dts/rockchip`下，即可！

#### 添加网卡驱动

首先，先[戳这里下载 -> atk-rk3588_device-tree_and_wifi-driver](/images/正点原子RK3588开发板编译Ubuntu镜像/atk-rk3588_device-tree_and_wifi-driver.7z)

同样的，网卡驱动你也可以在原子家RK3588开发板提供的buildroot-SDK中找到，这块板子使用的USB WiFi网卡是`RTL8733BU`。

由于原Lubancat-SDK中没有这个驱动，所以我们只要把下载好的`wifi-driver`里面的`rtl8733bu`文件夹放到目录`~/LubanCat_SDK/kernel-5.10/drivers/net/wireless/rockchip_wlan`下。

好了，这样网卡的驱动源码就有了，接下来，我们开始配置驱动：

```bash
# 回到sdk根目录，我们开始来配置驱动
(base) hugokkl@ubuntu:~$ cd ~/LubanCat_SDK 
# 选择的你的芯片型号和mk
(base) hugokkl@ubuntu:~/LubanCat_SDK$ ./build.sh chip

############### LubanCat Linux SDK ###############

Manifest: lubancat_linux_generic_20250826.xml

Log colors: message notice warning error fatal

Log saved at /home/hugokkl/LubanCat_SDK/output/sessions/2026-03-10_23-22-01
Pick a chip:

1. rk312x
2. rk3528
3. rk3562
4. rk3566_rk3568
5. rk3576
6. rk3588
Which would you like? [1]: 6
Switching to chip: rk3588
Pick a defconfig:

1. rockchip_defconfig
2. Hugokkl_rk3588_ubuntu_linux5.10_xfce_defconfig
3. LubanCat_rk3588_buildroot_extboot_defconfig
4. LubanCat_rk3588_buildroot_rkboot_defconfig
5. LubanCat_rk3588_debian_gnome_linux5.10_defconfig
6. LubanCat_rk3588_debian_gnome_linux6.1_defconfig
7. LubanCat_rk3588_debian_lite_linux5.10_defconfig
8. LubanCat_rk3588_debian_lite_linux6.1_defconfig
9. LubanCat_rk3588_ubuntu_linux5.10_gnome_defconfig
10. LubanCat_rk3588_ubuntu_linux5.10_lite_defconfig
11. LubanCat_rk3588_ubuntu_linux5.10_xfce_defconfig
12. rockchip_rk3588_evb1_lp4_v10_amp_defconfig
13. rockchip_rk3588_evb1_lp4_v10_defconfig
14. rockchip_rk3588_evb1_lp4_v10_mcu_defconfig
15. rockchip_rk3588_evb7_v11_defconfig
16. rockchip_rk3588_ipc_evb1_v10_defconfig
17. rockchip_rk3588_ipc_evb7_lp4_v11_defconfig
18. rockchip_rk3588_multi_ipc_evb1_v10_defconfig
19. rockchip_rk3588s_evb1_lp4x_v10_defconfig
Which would you like? [1]: 2
Switching to defconfig: /home/hugokkl/LubanCat_SDK/device/rockchip/.chip/Hugokkl_rk3588_ubuntu_linux5.10_xfce_defconfig
#
# configuration written to /home/hugokkl/LubanCat_SDK/output/.config
#
Using preferred kernel version(5.10)
(base) hugokkl@ubuntu:~/LubanCat_SDK$ 
```

然后，执行以下命令，进入图形化内核驱动配置界面：
```bash
# 进入图形化配置界面
./build.sh kconfig
```

搜索`rtl8733bu`，勾选`Realtek 8733B USB WiFi`为模块，然后保存，即可！
<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image-3.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

#### 修改boot_init.sh

打开`~/LubanCat_SDK/ubuntu20.04/overlay/etc/init.d/boot_init.sh`，如下图，修改一下`BOARD_DTB`字段：

<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image-4.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>


```shell
echo "Device ID Error !!!"
BOARD_NAME='LubanCat-RK3588'
BOARD_DTB='rk3588-atk-devkit.dtb'
BOARD_uEnv='uEnvLubanCat.txt'
```

#### 镜像编译

```bash
# 首先，前往SDK根目录下
cd ~/LubanCat_SDK

# 如果你的rootfs需要更新，你需要先把原来的删掉 / 只是修改设备树、内核、uboot等可以跳过此步骤
sudo rm ~/LubanCat_SDK/ubuntu20.04/ubuntu-rk3588-xfce-rootfs.img

# 清理上一次的编译结果
./build.sh cleanall

# 选择芯片和对应配置文件 / 选择对应的数字按回车就行
./build.sh chip

# 最后，全编译
./build.sh
```

最后的编译出来的镜像为`~/LubanCat_SDK/output/update/Image/update.img`，然后用瑞芯微官方的烧录工具进行烧录就ok啦！

这里有泰山派官方详细的[烧录教程](https://wiki.lckfb.com/zh-hans/tspi-rk3566/system-usage/img-download.html)，我就不重复赘述啦，讲得很好的！

原子家的板子是按下`Update`键再上电，是`Mushroom`模式、按下`+V`键再上电，是`Loader`模式，数据线插`Type-C0`连接电脑。

#### 烧录验证

最后我们就可以拿板子来验证一下咱们编译的镜像，数据线插`UART`口，波特率`1500000`，启动非常的流畅，可以看到LubanCat的Logo，然后测试wifi连接网络也没有什么问题！

```bash
# 一些wifi测试指令

nmcli device status # 列出所有网络设备

nmcli device wifi list # 扫描可用 WiFi 网络

sudo nmcli device wifi connect "SSID名称" password "密码" # 连接到 WiFi 网络

sudo nmcli connection up "SSID名称" # 连接已保存网络

sudo nmcli connection down "SSID名称" # 断开当前的网络连接

sudo nmcli connection delete "SSID名称" # 删除已保存的 WiFi 网络配置
```

<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image-5.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image-6.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

最后，再放一张我在这块板子上养的小龙虾！

<figure>
<img src="/images/正点原子RK3588开发板编译Ubuntu镜像/image-7.png" alt="" width = "" height = "" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>


## 写在后面

我编译好的原子家RK3588的Ubuntu镜像（baidu网盘自取：https://pan.baidu.com/s/1VmlDE7szSX_R9GTtuXEx8w?pwd=rn46


### 鸣谢
- Lubancat-SDK：https://doc.embedfire.com/linux/rk356x/build_and_deploy/zh/latest/building_image/lubancat_sdk/lubancat_gen_sdk.html
- RK3588的wifi模组移植：https://blog.csdn.net/qq_37603131/article/details/146775806
- 正点原子RK3588安装和编译SDK：https://blog.csdn.net/mmmm123CC/article/details/154131785
...

