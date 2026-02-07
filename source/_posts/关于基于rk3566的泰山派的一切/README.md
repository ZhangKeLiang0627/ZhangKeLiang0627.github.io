---
title: 关于「基于rk3566的泰山派」的一切
excerpt: 今天！一起来拯救你吃灰的泰山派🙆！
tags: [rockchip, rk3566, Ubuntu]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: /images/关于基于rk3566的泰山派的一切/image-1.png
banner_img: /images/关于基于rk3566的泰山派的一切/image-3.png
categories: Project Page
comment: 'twikoo'
# hide: true
date: 2025-11-3 1:10:00
---

### 关于「基于rk3566的泰山派」的一切
### Author: kkl

{% note warning %}

该笔记目前处于积极开发阶段。

{% endnote %}

{% note success %}
嘿，没错，是我，我又来整活啦！自从一年前花重金188购置了一手嘉立创的泰山派（2 + 16GB），期间跟着教程做了个小手机，然后不出所料的，吃灰了。

显然这板子在我手上是不允许这样的事情发生的，于是便有了这次的企划，「拯救泰山派行动」！**但是这几天，我花了些时间调查了一下泰山派的生态，做的是真的差劲，就连个像样的镜像都没有，对我这种刚入门的新手非常的不友好。**

所幸，隔壁的野火的鲁班猫系列的sdk挺全面的，又于是乎，咱也来整一个曲线救国，分享一下我是如何用鲁班猫的sdk玩转泰山派的，这里算是给自己开了一个新坑，慢慢填吧，拭目以待！
**——from 2025.11.3**
{% endnote %}

{% note info %}
哈哈哈喽，没想到一晃眼快两个月过去了，我真真正正等到一个合适的时间、一个慵懒的假期、美好的双休，来做这次更新，先填部分的坑，让泰山派用上鲁班猫的SDK，接上屏幕，连上网络，做成一个小电脑！我们开始吧！
**——from 2025.12.27**
{% endnote %}

{% note info %}
嗨，我又来更新啦，每一次更新都挑了个夜深人静的时候（苦涩，这次来分享一下linux的驱动添加方法，不一定只是针对tspi，思想是通用的，也算是记录记录我这几天折腾的成果吧。我越发感觉这个坑是深不见底呀，啥时候能填完呢？内容分几天来零零碎碎更新，写的太困了就去睡了（嘿。
**——from 2026.1.6**
{% endnote %}

<figure>
<img src="/images/关于基于rk3566的泰山派的一切/image.png" alt="snapshot-1" width = "800" height = "600" style="border-radius: 10px;">
<figcaption>snapshot-1</figcaption>
</figure>

<figure>
<img src="/images/关于基于rk3566的泰山派的一切/image-2.png" alt="snapshot-2" width = "800" height = "600" style="border-radius: 10px;">
<figcaption>snapshot-2</figcaption>
</figure>

---

### 写在前面



**_本篇文章将简述如何从零到一玩转「基于rk3566的泰山派」。_**

#### 我的环境

- **虚拟机：**VMware Ubuntu 20.04，**RAM >= 4GB / ROM >= 80GB**
- **开发板：**泰山派（2 + 16GB），_<u>注意本篇文章主要针对有emmc的开发板哈</u>_
- **屏幕：**立创10.1寸31Pin MIPI显示触摸屏全贴合总成，[详细戳这里<-](https://item.szlcsc.com/43215251.html?spm=sc.ols.it0-1___sc.ct.hd.hd.dd&c=Q2&lcsc_vid=FlMPA1JVEgVbBQAHFQRYAlUHQFFXV1AAFgJXBV1STgAxVlNQQVlcVlFQQ1NaUjsOAxUeFF5JWBYZEEoEHg8JSQcJGk4%3D)
- **鲁班猫SDK：**LubanCat_Linux_Generic_SDK_20251029.tgz，_<u>我们使用的版本可能不一样，但是基本都是可以兼容的</u>_

- **编译镜像版本：**我们这次用鲁班猫SDK给泰山派编译的镜像版本是<span class="label label-primary">5.10内核的Ubuntu20.04</span>


---

### 开始

#### 💻. 你需要准备

- 泰山派官方SDK(可选)：https://wiki.lckfb.com/zh-hans/tspi-rk3566/sdk-compilation/linux-compilation.html
- 鲁班猫通用SDK(必选)：https://doc.embedfire.com/linux/rk356x/quick_start/zh/latest/quick_start/baidu_cloud/baidu_cloud.html
- 泰山派的Device-tree和wifi-firmware(必选)：[戳这里下载](/images/关于基于rk3566的泰山派的一切/tspi_device-tree_and_wifi-firmware.zip)

#### 📖. 你需要知道

##### tspi的资源标注

{% gi 2 2 %}

<figure>
<img src="/images/关于基于rk3566的泰山派的一切/image-13.png" alt="tspi的资源标注 - 1" width = "500" height = "500" style="border-radius: 15px;">
<figcaption>tspi的资源标注 - 1</figcaption>
</figure>

<figure>
<img src="/images/关于基于rk3566的泰山派的一切/image-14.png" alt="tspi的资源标注 - 2" width = "500" height = "500" style="border-radius: 15px;">
<figcaption>tspi的资源标注 - 2</figcaption>
</figure>

{% endgi %}

##### tspi的引脚定义表

- 40Pin默认引脚定义表

<figure>
<img src="/images/关于基于rk3566的泰山派的一切/image-12.png" alt="40Pin默认引脚定义表" width = "1000" height = "600" style="border-radius: 15px;">
<figcaption>40Pin默认引脚定义表</figcaption>
</figure>

- 40Pin引脚复用详细图

<figure>
<img src="/images/关于基于rk3566的泰山派的一切/image-11.png" alt="40Pin引脚复用详细图" width = "1000" height = "600" style="border-radius: 15px;">
<figcaption>40Pin引脚复用详细图</figcaption>
</figure>


##### sdk中的常用内容存放路径

mk: `~/LubanCat_SDK/device/rockchip/.chips/rk3566_rk3568/`

drivers: `~/LubanCat_SDK/kernel-5.10/drivers`
defconfig: `~/LubanCat_SDK/kernel-5.10/arch/arm64/configs`

device-tree: `~/LubanCat_SDK/kernel-5.10/arch/arm64/boot/dts/rockchip/`
device-tree overlay: `~/LubanCat_SDK/kernel-5.10/arch/arm64/boot/dts/rockchip/overlay/`
device-tree overlay uEnv: `~/LubanCat_SDK/kernel-5.10/arch/arm64/boot/dts/rockchip/uEnv/`



#### 👾. 新手指引

因为是涉及内核编译，所以难度还是有点大的，需要较强的动手能力。因此，在正式开始搭建鲁班猫sdk之前，你如果是非常新手，可以先去跟着泰山派官方的Linux编译[教程](https://wiki.lckfb.com/zh-hans/tspi-rk3566/sdk-compilation/linux-compilation.html)完整的走一遍，这样对整个流程会有一些认识，后续开展的时候会更顺利一些。下面我们真正开始！

#### 1. 搭建鲁班猫SDK：LubanCat_Gen_SDK

{% note info %}
🎉非常感谢野火官方的SDK和开发教程，此处鼓掌n秒，接下来的教程会大量参考野火官方（人家写的很全面，该偷懒的咱得偷...
{% endnote %}

LubanCat_Gen_SDK是基于Ubuntu LTS系统开发测试的，在开发过程中，主要是用Ubuntu 20.04版本，**推荐用户使用Ubuntu20.04或Ubuntu22.04，不支持Ubuntu20.04以下版本开发。**

硬件配置推荐：64位系统，硬盘空间⼤于80G。如果您进⾏多个构建，将需要更⼤的硬盘空间。我的虚拟机分了4G内存和4核CPU，体验下来还算凑合能用吧，不知道啥时候能够换一个趁手一点的“鞍”（笑

##### SDK开发环境搭建

鲁班猫SDK源码有两种获取方式，一个是从云上拉取，另一个是从网盘上面下载离线包，再到本地解压更新，我网没那么好，所以下面主要写一下离线包的安装，更全面的教程[指路野火官方<-](https://doc.embedfire.com/linux/rk356x/build_and_deploy/zh/latest/building_image/lubancat_sdk/lubancat_gen_sdk.html#sdk)

##### 安装软件依赖
安装SDK依赖的软件包，没装好这些依赖，编译时候报错会到处飞。

```bash
# 安装SDK构建所需要的软件包 / 整体复制下面内容到终端中安装

sudo apt-get update && sudo apt-get install git ssh make gcc libssl-dev \
liblz4-tool expect expect-dev g++ patchelf chrpath gawk texinfo chrpath \
diffstat binfmt-support qemu-user-static live-build bison flex fakeroot \
cmake gcc-multilib g++-multilib unzip device-tree-compiler ncurses-dev \
libgucharmap-2-90-dev bzip2 expat gpgv2 cpp-aarch64-linux-gnu libgmp-dev \
libmpc-dev bc python-is-python3 python3-pip python2 u-boot-tools curl \
python3-pyelftools dpkg-dev
```

##### 安装repo

repo是google⽤Python脚本写的调⽤git的⼀个脚本，主要是⽤来下载、管理项⽬的软件仓库。

```bash
mkdir ~/bin
curl https://storage.googleapis.com/git-repo-downloads/repo > ~/bin/repo
# 如果上面的地址无法访问，可以用下面的：
# curl -sSL  'https://gerrit-googlesource.proxy.ustclug.org/git-repo/+/master/repo?format=TEXT' |base64 -d > ~/bin/repo
chmod a+x ~/bin/repo
echo PATH=~/bin:$PATH >> ~/.bashrc
source ~/.bashrc
```

执行完上面的命令后来验证repo是否安装成功能正常运行。

```bash
repo --version

# 返回以下信息 / 返回的信息根据Ubuntu版本的不同略有差异
<repo not installed>
repo launcher version 2.32
    (from /home/he/bin/repo)
git 2.25.1
Python 3.8.10 (default, Nov 14 2022, 12:59:47)
[GCC 9.4.0]
OS Linux 5.15.0-60-generic (#66~20.04.1-Ubuntu SMP Wed Jan 25 09:41:30 UTC 2023)
CPU x86_64 (x86_64)
Bug reports: https://bugs.chromium.org/p/gerrit/issues/entry?template=Repo+tool+issue
```

##### 切换Python 3 版本
首先，先要查看一下当前的Python版本：
```bash
#查看当前Python版本
python -V
```

若返回的版本号为Python3版本，则无需再切换Python版本。若为Python2版本或未发现python，则可以用以下方式切换：

```bash
#查看当前系统安装的Python版本有哪些
ls /usr/bin/python*

#将python链接到python3
sudo ln -sf /usr/bin/python3 /usr/bin/python

#重新查看默认Python版本
python -V
```

此时系统默认Python版本便切换为python3，done!

![](/images/关于基于rk3566的泰山派的一切/image-4.png)

##### 源码获取
首先是解压下载好的sdk包，老样子，我习惯将sdk包解压到`~/`路径下：

```bash
# 安装tar压缩工具，一般来说系统是默认安装的
sudo apt install tar

# 在用户家目录创建LubanCat_SDK目录
mkdir ~/LubanCat_SDK

# 将下载的SDK源码移动到LubanCat_SDK目录下，xxx为日期
mv LubanCat_Linux_Generic_SDK_xxx.tgz ~/LubanCat_SDK

# 进入LubanCat_SDK目录
cd ~/LubanCat_SDK

# 解压SDK压缩包
tar -xzvf LubanCat_Linux_Generic_SDK_xxx.tgz

# 查看解压后的文件，可以看到解压出.repo文件夹
ls -al

# 检出各个git子仓库
# 注意：下面的命令一点要在SDK顶层文件夹中执行，且repo路径一定为.repo/repo/repo
.repo/repo/repo sync -l

# 将所有的源码仓库同步到最新版本
# 如果使用LubanCat_Linux_Gen_Full_SDK，则无需使用下面的命令更新SDK
.repo/repo/repo sync -c
```

#### 2. 制作适配tspi的镜像

##### 修改mk
我这次准备构建`5.10内核 + Ubuntu20.04`的`xfce`含有图形操作界面的环境，<span class="label label-success"><u>这里lite指无图形操作界面，xfce指有图形操作界面。</u></span>所以这里使用配置文件是`LubanCat_rk3566_ubuntu_xfce_defconfig`，但是鲁班猫默认是6.1内核+Ubuntu20.04的版本，这里需要进行修改：

- `RK_KERNEL_PREFERRED="5.10"`，它默认是6.1内核版本。

Ps：如何选择构建Ubuntu版本？`RK_UBUNTU_FOCAL=y`，FOCAL是Ubuntu20.04版本，这里=y的话，就是要构建Ubuntu20.04，所以注释它，这样就是构建Ubuntu22.04。

修改 `~/LubanCat_SDK/device/rockchip/.chips/rk3566_rk3568/LubanCat_rk3566_ubuntu_xfce_defconfig`，完整内容如下：

```cfg
# RK_BUILDROOT is not set
# RK_YOCTO is not set
RK_UBUNTU_FOCAL=y
RK_ROOTFS_SYSTEM_UBUNTU=y
RK_ROOTFS_TARGET_XFCE=y
RK_ROOTFS_IMAGE="ubuntu-rk356x-${RK_ROOTFS_TARGET}-rootfs.img"
RK_KERNEL_PREFERRED="5.10"
RK_KERNEL_CFG="lubancat_linux_rk356x_defconfig"
RK_KERNEL_DTS_NAME="tspi-rk3566-user-v10-linux"
RK_KERNEL_EXTBOOT=y
# RK_RECOVERY is not set
RK_EXTRA_PARTITION_NUM=0
RK_PARAMETER="parameter-extboot.txt"
RK_USE_FIT_IMG=y
RK_PACKAGE_FILE_CUSTOM=y
RK_PACKAGE_FILE="package-file-extboot"
```

##### 添加网卡驱动和固件
这里是在`lubancat_linux_rk356x_defconfig`中添加博通网卡配置去编译内核时能生成bcmdhd.ko等内核模块（网卡驱动），修改`~/LubanCat_SDK/kernel-5.10/arch/arm64/configs/lubancat_linux_rk356x_defconfig`
![](/images/关于基于rk3566的泰山派的一切/image-5.png)
```cfg
# new config
CONFIG_BCMDHD=y
CONFIG_AP6XXX=m
CONFIG_BCMDHD_SDIO=y
```

接着，在对应位置`~/LubanCat_SDK/ubuntu20.04/overlay-firmware/usr/lib/firmware`添加博通网卡的固件wifi-firmware：

![](/images/关于基于rk3566的泰山派的一切/image-6.png)

##### 添加设备树
在对应位置`~/LubanCat_SDK/kernel-5.10/arch/arm64/boot/dts/rockchip`添加泰山派的设备树：
![](/images/关于基于rk3566的泰山派的一切/image-7.png)

##### 修改boot_init.sh
修改`boot_init.sh`中这个逻辑，让内核默认使用泰山派的设备树：

![](/images/关于基于rk3566的泰山派的一切/image-8.png)

```shell
BOARD_NAME='LubanCat-RK356X'
BOARD_DTB='tspi-rk3566-user-v10-linux.dtb'
BOARD_uEnv='uEnvLubanCat.txt'
```

##### 镜像编译

```bash
# 首先，前往SDK根目录下
cd ~/LubanCat_SDK

# 如果你的rootfs需要更新，你需要先把原来的删掉 / 只是修改设备树、内核、uboot等可以跳过此步骤
sudo rm ~/LubanCat_SDK/ubuntu20.04/ubuntu-rk356x-xfce-rootfs.img

# 清理上一次的编译结果
./build.sh cleanall

# 选择芯片和对应配置文件 / 选择对应的数字按回车就行
./build.sh chip

# 最后，全编译
./build.sh
```

最后的编译出来的镜像为`~/LubanCat_SDK/output/update/Image/update.img`，然后用瑞芯微官方的烧录工具进行烧录就ok啦！

这里有泰山派官方详细的[烧录教程](https://wiki.lckfb.com/zh-hans/tspi-rk3566/system-usage/img-download.html)，我就不重复赘述啦，讲得很好的！

##### 烧录验证 

最后我们就可以拿泰山派来验证一下咱们编译的镜像，启动非常的流畅，可以看到LubanCat的Logo，然后测试wifi连接网络也没有什么问题！

```bash
# 一些wifi测试指令

nmcli device status # 列出所有网络设备

nmcli device wifi list # 扫描可用 WiFi 网络

sudo nmcli device wifi connect "SSID名称" password "密码" # 连接到 WiFi 网络

sudo nmcli connection up "SSID名称" # 连接已保存网络

sudo nmcli connection down "SSID名称" # 断开当前的网络连接

sudo nmcli connection delete "SSID名称" # 删除已保存的 WiFi 网络配置
```

{% gi 2 2 %}

<figure>
<img src="/images/关于基于rk3566的泰山派的一切/image-9.png" alt="" width = "500" height = "500" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/关于基于rk3566的泰山派的一切/image-10.png" alt="" width = "500" height = "500" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

{% endgi %}

这个时候，你把屏幕也接上的话，会显示出linux的操作界面，插上鼠标键盘就可以愉快的当成一个小电脑来玩耍啦，只是很卡就对了（苦笑。

#### 3. tspi添加新的驱动

好的，当我们制作好了泰山派的ubuntu镜像以后，下一步肯定要接着搞事情嘛，做项目必然少不了传感器等外设的加入。为此，我们需要给tspi添加新的驱动。

如何添加驱动是一门大学问，知识点太多太多了，很多工程师上班天天写驱动才练的如此熟练，我们这些小卡拉米想要一下子全部记住还是非常难的，好在驱动不是在考我们数学，所以，熟能生巧！下面我们开始吧！

##### 为10.1寸mipi屏幕添加触摸驱动gt9xx

[tspi触摸驱动官方教程<-](https://wiki.lckfb.com/zh-hans/tspi-rk3566/project-case/fat-little-cell-phone/touch-drive.html)，讲得非常的仔细，赞哦！


##### 为tspi添加六轴传感器mpu6050驱动

刚好手头上还有之前打电赛剩下的mpu6050模块，而且这芯片也是老江湖了，想必大家都非常熟悉，或多或少听过用过，非常适合做一手驱动演示。同时，刚好linux内核当中内置了[mpu6050这个芯片的驱动](https://github.com/torvalds/linux/tree/master/drivers/iio/imu/inv_mpu6050)，那是相当的哇塞了！

> Plus：大家拿到一个芯片、模块以后要为它编写驱动之前，不妨先去linux内核里面查看一下有没有前人已经写好的轮子，找到赚到，省时省力，官方驱动网站在这里：[www.kernelconfig.io](https://www.kernelconfig.io/index.html)

既然实物有了，驱动也有了，那么我们这次只是简单的演示一手操作流程：
- **想要添加一个传感器，设备树要怎么写？**
- **设备树怎么和相应驱动对接？**
- **配置文件怎么改？**
- **驱动是如何生效的？**
- **驱动如何打包到镜像当中？**

###### 编写设备树

我选择将mpu6050挂载到tspi的`i2c2`上面，于是需要按照官方提供的[40Pin引脚示意表](#tspi的引脚定义表)来进行接线.

用vscode打开设备树：`code ~/LubanCat_SDK/kernel-5.10/arch/arm64/boot/dts/rockchip/tspi-rk3566-user-v10-linux.dts`

我直接**把相关的驱动源码喂给了豆包ai**，它给我输出了对应的设备树写法，当然这样可能不太准确，其实还有两种好用的办法：

1. 你可以参考[linux官方的驱动设备树的说明书](https://github.com/torvalds/linux/blob/master/Documentation/devicetree/bindings/iio/imu/invensense%2Cmpu6050.yaml)，只要是内核自带的驱动，这里都能找到参考写法；
2. 你也可以参考内核中其他设备树文件有没有启用这个驱动，拿来主义 -> `grep -nr "invensense,mpu6050"`.

```dts
//用户I2C2
&i2c2 {
	status = "okay";

	/*添加你的I2C设备参考
	gt1x: gt1x@14 {
		compatible = "goodix,gt1x";
		reg = <0x14>;
		pinctrl-names = "default";
		pinctrl-0 = <&touch_gpio>;
		goodix,rst-gpio = <&gpio0 RK_PB6 GPIO_ACTIVE_HIGH>;
		goodix,irq-gpio = <&gpio0 RK_PB5 IRQ_TYPE_LEVEL_LOW>;
	};*/

    mpu6050: mpu6050@68 {
        compatible = "invensense,mpu6050"; 
        reg = <0x68>; 
		interrupt-parent = <&gpio0>;      
		interrupts = <0 IRQ_TYPE_NONE>;  
		status = "okay";
    };
};
```

###### 配置kconfig

mpu6050的驱动源码：`~/LubanCat_SDK/kernel-5.10/drivers/iio/imu/inv_mpu6050`

去到这个目录，我们可以看到目录下的kconfig，找到我们需要配置的项：`INV_MPU6050_I2C`.

{% fold info @kconfig %}
```kconfig
# SPDX-License-Identifier: GPL-2.0-only
#
# inv-mpu6050 drivers for Invensense MPU devices and combos
#

config INV_MPU6050_IIO
	tristate
	select IIO_BUFFER
	select IIO_TRIGGERED_BUFFER

config INV_MPU6050_I2C
	tristate "Invensense MPU6050 devices (I2C)"
	depends on I2C
	select I2C_MUX
	select INV_MPU6050_IIO
	select REGMAP_I2C
	help
	  This driver supports the Invensense MPU6050/9150,
	  MPU6500/6515/9250/9255, ICM20608/20609/20689, ICM20602/ICM20690 and
	  IAM20680 motion tracking devices over I2C.
	  This driver can be built as a module. The module will be called
	  inv-mpu6050-i2c.

config INV_MPU6050_SPI
	tristate "Invensense MPU6050 devices (SPI)"
	depends on SPI_MASTER
	select INV_MPU6050_IIO
	select REGMAP_SPI
	help
	  This driver supports the Invensense MPU6000,
	  MPU6500/6515/9250/9255, ICM20608/20609/20689, ICM20602/ICM20690 and
	  IAM20680 motion tracking devices over SPI.
	  This driver can be built as a module. The module will be called
	  inv-mpu6050-spi.
```
{% endfold %}

接下来，我们开始配置驱动。

```bash
# 回到sdk根目录，我们开始来配置驱动
cd ~/LubanCat_SDK 

# 选择的你的芯片型号和mk
./build.sh chip

# 进入图形化配置界面
./build.sh kconfig
```

![](/images/关于基于rk3566的泰山派的一切/image-15.png)

![](/images/关于基于rk3566的泰山派的一切/image-16.png)

`=n`、`=m`、`=y`三者的简单区分就是：

- `=n`：为驱动不启用，不编译。
- `=m`：为驱动编译成模块.ko，如果打包时将其加入rootfs的话，linux启动时会自动加载。模块可加载(insmod)/可卸载(rmmod)，会更加灵活一点。
- `=y`：为驱动编译到内核当中，这将是“永久性”的将驱动固化到编译出来的kernel当中，启动时驱动必会加载，不能卸载，适用于那些长期稳定的外设不需要变更内容。

我这里选择把驱动编译成模块ko，然后退出保存即可。

###### 将ko模块打包到根目录系统

鲁班猫SDK里面需要把之前生成的rootfs.img删除掉，这样才能触发脚本重新编译rootfs，会默认自动把新编译出来的所有ko模块都打包到新的rootfs.img里面去。

所以这时咱们要把`~/LubanCat_SDK/ubuntu20.04`路径下的`*rootfs.img`给删掉，然后`./build.sh`重新编译打包镜像。

...

###### 烧录验证

```bash
# 从内核启动日志中查询是否有mpu6050相关驱动的启动信息
dmesg | grep -i mpu6050

# 列出当前已加载的模块ko
lsmod

# 查看IIO设备所有可操作属性
ls /sys/bus/iio/devices/iio:deviceX
```
能像如图这样加载驱动，说明驱动是成功打好了，报错信息问题不大（只是电源没有配置，没关系的.
![](/images/关于基于rk3566的泰山派的一切/image-17.png)

```bash
cat@lubancat:/userdata$ ls /sys/bus/iio/devices/iio:device1
buffer                      in_anglvel_y_calibbias
current_timestamp_clock     in_anglvel_y_raw
dev                         in_anglvel_z_calibbias
in_accel_matrix             in_anglvel_z_raw
in_accel_mount_matrix       in_gyro_matrix
in_accel_scale              in_temp_offset
in_accel_scale_available    in_temp_raw
in_accel_x_calibbias        in_temp_scale
in_accel_x_raw              name
in_accel_y_calibbias        of_node
in_accel_y_raw              power
in_accel_z_calibbias        sampling_frequency
in_accel_z_raw              sampling_frequency_available
in_anglvel_mount_matrix     scan_elements
in_anglvel_scale            subsystem
in_anglvel_scale_available  trigger
in_anglvel_x_calibbias      uevent
in_anglvel_x_raw

```

---

### 写在后面

**鸣谢：**
- https://doc.embedfire.com/linux/rk356x/build_and_deploy/zh/latest/README.html
- https://wiki.lckfb.com/zh-hans/tspi-rk3566/
- https://blog.csdn.net/qq_37264095/article/details/152731497?spm=1001.2014.3001.5502
- https://blog.csdn.net/qq_37264095/article/details/147023151?spm=1001.2014.3001.5502
- https://blog.csdn.net/qq_37264095/article/details/152455773?spm=1001.2014.3001.5502
- https://github.com/luckkfliu/tspi_ubuntu
- https://www.bilibili.com/opus/912396584371617809

...

---