---
title: 我的Linux驱动学习笔记 - IMX6ULL
excerpt: 正点原子，俺的伙伴？！
tags: [Linux, IMX6ULL, 驱动]
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/5.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/6.jpg
categories: Study Page
comment: 'twikoo'
date: 2023-12-13 15:38:00
---

### 我的Linux驱动学习笔记 - IMX6ULL
### MyLinuxLearningGuide - IMX6ULL
### By @kkl

<p class="note note-warning">该笔记目前处于积极开发阶段。</p>

---

## 开始

## 环境

> PC：Win11
> 虚拟机：Ubuntu18.04
> 开发板：正点原子IMX6ULL开发板emmc-512MB

> 镜像：
> 1. 出厂镜像：linux-imx-4.1.15-2.1.0-g3dc0a4b-v2.7
> 2. 教程镜像：linux-imx-rel_imx_4.1.15_2.1.1_ga_alientek_v2.4

## 镜像

### 启动

用于不同启动方式的拨码开关设置：

- USB_OTG启动(0 1 0 0 0 0 0 0)
该启动方式主要用于mfg固化系统，烧录镜像。

<p class="note note-warning">注意：从USB_OTG启动时，开发板上如果有SD卡，要先把SD卡拔出来，上电后再重新插上SD卡，否则会影响镜像的烧录。
</p>

- 从TF(SDcard)卡启动(1 0 0 0 0 0 1 0)
该启动方式主要用于从TF(SDcard)卡启动内核。

- 从eMMC启动(1 0 1 00 1 1 0)
该启动方式主要用于从eMMC启动内核。

### 烧录

烧录方法请查看**I.MX6U用户快速体验V2.6 P25**

1. 出厂镜像：linux-imx-4.1.15-2.1.0-g3dc0a4b-v2.7

- 可以通过`【正点原子】阿尔法Linux开发板（A盘）-基础资料\05、开发工具\04、正点原子MFG_TOOL出厂固件烧录工具\mfgtool`进行烧录。

2. 教程镜像：linux-imx-rel_imx_4.1.15_2.1.1_ga_alientek_v2.4

- 可以通过`【正点原子】阿尔法Linux开发板（A盘）-基础资料\08、系统镜像\02、教程系统镜像\02、V2.4版本及以后的底板\mfgtool(study)`进行烧录。

- 烧录结束以后，重启以后是无法成功加载系统的，需要在Uboot中重新配置一下环境变量，如下：

```shell
# 使用Type-C数据线连接开发板的串口和个人PC
# 使用MobaXterm，Serial连接，波特率设置为115200

# 开发板上电，在Uboot准备加载内核前的倒计时结束前，按回车键留在Uboot

# 依次输入以下命令，修改环境变量

setenv bootcmd 'mmc dev 1;fatload mmc 1:1 80800000 zImage;fatload mmc 1:1 83000000 imx6ull-alientek-emmc.dtb;bootz 80800000 - 83000000'

setenv bootargs 'console=ttymxc0,115200 root=/dev/mmcblk1p2 rootwait rw'

saveenv

# 配置好环境变量后，重新上电启动内核，就可以成功进入系统啦！

# 上述内容来自【正点原子】阿尔法Linux开发板（A盘）-基础资料\08、系统镜像\02、教程系统镜像\02、V2.4版本及以后的底板\mfgtool(study)\【EMMC-bootcmd-bootargs】.txt or 【NAND-bootcmd-bootargs】.txt
```

<p class="note note-success">
当然，你可以使用该工具 <b>mfgtool(study)</b> 烧录你自己制作的镜像。
<br></br>
只要把 <b>mfgtool(study)\Profiles\Linux\OS Firmware\files\boot</b> 路径下的对应镜像和u-boot修改成你制作的就可以啦，但是名字要和原来的同名噢！！！
</p>


### 通过命令行更新emmc的内核和设备树固件

#### 更新原理
因为Linux内核和设备树是在uboot运行的时候被从emmc加载到内存当中去的，所以Linux系统正在运行的时候，我们是可以修改emmc中存放的固件的，然后reset等待重启即可。

#### 更新方法
1. 查看emmc分区

使用命令`fdisk -l`查看分区信息

在使用mfg tool烧录之后，emmc会有两个分区，第一个分区是FAT32文件系统`/dev/mmcblk1p1`，用来存放kernel和设备树，第二个分区是Linux文件系统，用来存放根文件系统

2. 更新固件

* 使用命令`mount /dev/mmcblk1p1 /mnt`挂载emmc分区
* 接着使用`ls /mnt/`就可以看到设备树dtb文件和zImage已经出现
* 然后使用cp命令将自己最新的文件（可以只替换其中一个或两个）替换掉旧的
* 最后通过`umount /mnt`卸载emmc分区

3. 测试

* 按下板载的reset按键或者命令行输入`reboot`进行重启
* 重启之后可以通过`uname`命令或者查找设备树信息的方式检查是否替换成功。

---

## 配网

* `cd /etc/`去到此文件夹当中
* 编写`wpa_supplicant.conf`
> ctrl_interface=/var/run/wpa_supplicant
> update_config=1
> 
> network={
>  ssid="MagicEyes"
>  psk="12345678"
> }

* `vi wpa_supplicant.conf`用vi打开这个文件配置你的网络
* `modprobe 8188eu.ko`加载 RTL8188EUS 驱动模块（USB-WiFi-RTL8188EUS）
* `wpa_supplicant -D wext -c /etc/wpa_supplicant.conf -i wlan0 &`使用 wpa_supplicant 工具让 RTL8188 USB WIFI 连接到热点上
* `udhcpc -i wlan0`从路由器获取IP地址，执行了这一步才可以得到分配的IP地址
* `ifconfig wlan0`查看IP地址

<br></br>

* `ping [-I wlan0的IP地址] www.baidu.com`可以使用这个指令测试WiFi是否工作正常，[]的内容可以省略，-I 是指定执行 ping 操作的网卡 IP 地址，我们可以指定要使用的 wlan0 去 ping 百度网站。

* 更加详细的内容在**驱动开发指南P1765**

<p class="note note-warning">注意！RTL8188EUS 请使用 8188eu.ko 驱动，RTL8188CUS 请使用 8192cu.ko 驱动！</p>

在出厂镜像中，默认加载的是RTL8188CUS驱动，所以要手动cd到对应的文件夹加载RTL8188EUS驱动模块：
- `cd /lib/modules/4.1.15-g3dc0a4b/kernel/drivers/net/wireless/rtlwifi/rtl8188EUS`
- `insmod 8188eu.ko`

## 内核

### 内核编译

* `Uboot`和内核的编译步骤：

> 1. `distclean`清理工程
> 2. `make xxx_defconfig`使用默认配置文件配置工程
> 3. `make menuconfig`打开配置界面，进行配置
> 4. `make -j12`编译所有文件，`-j12`表示十二核编译
> * 编译的时间会比较长

* **Warning:**

> **内核的解压和编译绝对不可以在共享文件夹里进行！**
> 否则会出现无法软链接的情况，比如`ln: failed to create symbolic link './dt-bindings': Operation not permitted`
> 因为共享文件夹是windows和linux的的共享目录，而windows下的文件系统，不支持linux的`symbolic link`!

* 实践

> 1. 出厂镜像：linux-imx-4.1.15-2.1.0-g3dc0a4b-v2.7
* 这里的编译的内核选用`linux-imx-4.1.15-2.1.0-g3dc0a4b-v2.7.tar.bz2`即正点原子imx6ull的出厂镜像
* 解压方法：`tar -vxjf xxx.tar.bz2`
* 注意！编译内核时，请先安装Poky交叉编译工具链（具体参照**用户快速体验P115**）
* 执行`linux-imx-4.1.15-2.1.0-g3dc0a4b-v2.7`文件夹内的`build.sh`一键全编译。
* 最后请使用**04、正点原子MFG_TOOL出厂固件烧录工具**进行开发板的烧录哦！

> 2. 教程镜像：linux-imx-rel_imx_4.1.15_2.1.1_ga_alientek_v2.4
* 这里的编译的内核选用`linux-imx-rel_imx_4.1.15_2.1.1_ga_alientek_v2.4.tar.bz2`即正点原子imx6ull的教程镜像
* 解压方法：`tar -vxjf xxx.tar.bz2`

## 驱动开发
* Linux驱动有**两种运行方式**，**第一种**就是将驱动**编译进Linux内核**中，这样当Linux内核启动的时候就会自动运行驱动程序。**第二种**就是**将驱动编译成模块**(Linux下模块扩展名为.ko)，在Linux内核启动以后使用`insmod`或`modprobe`命令加载驱动模块，使用`rmmod`或`modprobe -r`命令卸载驱动模块。

### 驱动模块的加载与卸载
#### 说明
* Linux的驱动程序可以编译到`kernel`里面（也就是`zImage`），也可以编译为模块`.ko`。测试的时候只需要加载`.ko`模块就可以。
* 编写驱动时的注意事项
> * 编译驱动的时候需要用到Linux内核源码！因此要解压缩Linux内核源码，编译Linux内核源码！编译完成会得到`zImage`和`.dtb`设备树。需要使用编译后得到的`zImage`和`.dtb`启动系统。

#### 驱动模块的Makefile
* Makefile的通用写法
```Makefile
KERNELDIR := /home/embedfire/kl_files/linux/IMX6ULL/linux
CURRENT_PATH := $(shell pwd)
obj-m := chrdevbase.o

build : kernel_modules

kernel_modules:
	$(MAKE) -C $(KERNELDIR) M=$(CURRENT_PATH) modules
clean:
	$(MAKE) -C $(KERNELDIR) M=$(CURRENT_PATH) clean
```
* 注意要修改`c_cpp_properties.json`当中的路径哦！（修改了你就可以写代码的时候有补全，不管它对模块的编译和应用没影响）

#### 驱动模块的编译
* `make`在Makefile存放的目录下执行该命令进行编译，编译完成后生成`.ko`模块
* `make clean`用于清理编译生成的模块等文件
* 请在使用`make`命令之前先使用此命令选择交叉工具链`source /opt/fsl-imx-x11/4.1.15-2.1.0/environment-setup-cortexa7hf-neon-poky-linux-gnueabi`

* 编译应用`arm-linux-gnueabihf-gcc chrdevbaseApp.c -o chrdevbaseApp`

#### 模块加载和卸载命令
> 模块的加载
* `insmod`具体用法：`insmod xxx.ko`
* `modprobe`具体用法：`modprobe xxx`，记得使用之前用`depmod`刷新当前的模块变量哦！
* 加载完成可以使用`cat /proc/devices`查看模块的设备号哦！

> 模块的卸载
* `rmmod`具体用法：`rmmod xxx.ko`
* `modprobe -r`具体用法：`modprobe -r xxx`

#### 字符设备驱动 - 基于设备树的GPIO高低电平驱动模块编写

Plus：驱动编写完成进行测试的时候要多次加载卸载来测试驱动的稳健性，如果一两次加载卸载可以成功，试多几次就不行了，可能是我们在驱动编写的时候没有注销、摧毁设备，没有释放内存导致的，这时就需要我们回去修改驱动相关代码啦！

##### 具体编写流程

* 编写设备结构体
```c
struct module_dev{
	dev_t devid; // 设备号
	struct cdev cdev; // cdev
	struct class *class; // 类
	struct device *device; // 设备
	int major; // 主设备号
	int minor; // 次设备号
	struct device_node *nd; // 设备节点
	int module_gpio; // module设备所使用的GPIO编号
}

struct module_dev module; /* module 设备 */
```

* 编写`module_open`函数
```c
static int module_open(struct inode *inode, struct file *filp)
{
	filp->private_data = &module; /* 设置私有数据 */
	return 0;
}
```

* 编写`module_read`函数
```c
static ssize_t module_read(struct file *filp, char __user *buf,
size_t cnt, loff_t *offt)
{
	return 0;
}
```

* 编写`module_write`函数
```c
static ssize_t module_write(struct file *filp, const char __user *buf,
size_t cnt, loff_t *offt)
{
	/* ...... */
	return 0;	
}
```

* 编写`module_release`函数
```c
static int led_release(struct inode *inode, struct file *filp)
{
	return 0;
}
```

* 编写设备操作函数
```c
static struct file_operations module_fops = {
	.owner = THIS_MODULE,
	.open = module_open,
 	.read = module_read,
 	.write = module_write,
 	.release = module_release,
};
```

* 编写驱动入口函数`_module_init`
```c
#define MODULE_CNT 1 // 设备号个数
#define MODULE_NAME "module" // 名字

static int __init _module_init(void)
{	
	/* 设置module设备所使用的GPIO */
	// 1.获取设备节点（gpio子系统节点）
	module.nd = of_find_node_by_path("/module");
	// 判断设备节点是否获取成功
	if(module.nd == NULL) 
	{
 		printk("module node cant not found!\r\n");
 		return -EINVAL; // 获取失败返回失败值
 	}
	else
	{
		printk("module node has been found!\r\n");
 	}

	// 2.获取设备树中的gpio属性，得到module所使用的gpio编号
	module.module_gpio = of_get_named_gpio(module.nd, "module-gpio", 0);
	if(module.module_gpio < 0)
	{
 		printk("can't get module-gpio");
		return -EINVAL;
	}
 	printk("module-gpio num = %d\r\n", module.module_gpio);

	// 3.其他设置，比如设置gpio的电平输出状态等

	/* 注册字符设备驱动 */
	// 1.创建设备号
	if (module.major)
	{ 
	/* 定义了设备号 */
 	module.devid = MKDEV(module.major, 0);
 	register_chrdev_region(module.devid, MODULE_CNT,MODULE_NAME);
 	} 
	else 
	{ 
	/* 没有定义设备号 */
 	alloc_chrdev_region(&module.devid, 0, MODULE_CNT, MODULE_NAME); /* 申请设备号 */
 	module.major = MAJOR(module.devid); /* 获取分配号的主设备号 */
 	module.minor = MINOR(module.devid); /* 获取分配号的次设备号 */
 	}
 	printk("module major=%d,minor=%d\r\n",module.major,module.minor);

	// 2.初始化 cdev
	module.cdev.owner = THIS_MODULE;
	cdev_init(&module.cdev, &module_fops);

	// 3.添加一个 cdev
	cdev_add(&module.cdev, module.devid, MODULE_CNT);

	// 4.创建类
	module.class = class_create(THIS_MODULE, MODULE_NAME);
 	if (IS_ERR(module.class))
	{
 		return PTR_ERR(module.class);
 	}

	// 5.创建设备
	module.device = device_create(module.class, NULL, module.devid, NULL, MODULE_NAME);
 	if (IS_ERR(module.device))
	{
 		return PTR_ERR(module.device);
 	}
 	return 0;
}
```

* 编写驱动出口函数`_module_exit`
```c
static void __exit _module_exit(void)
{
 	/* 注销字符设备驱动 */
 	cdev_del(&module.cdev); /* 删除 cdev */
 	unregister_chrdev_region(module.devid, MODULE_CNT); /* 注销设备号 */

 	device_destroy(module.class, module.devid); /* 注销设备 */
 	class_destroy(module.class); /* 注销类 */
}

/* 将自己编写的驱动出入口函数注册进API当中 */
module_init(_module_init); 
module_exit(_module_exit);

MODULE_LICENSE("GPL"); // 添加版权信息
MODULE_AUTHOR("kkl"); // 添加作者信息
```

#### 通用的i2c_dev驱动 - 基于设备树的I2C驱动模块编写

##### 具体编写流程（基于ap3216c光传感器

* 编写设备结构体
```c
struct ap3216c_dev {
	dev_t devid; // 设备号
	struct cdev cdev; // cdev
	struct class *class; // 类
	struct device *device; // 设备
	struct device_node *nd; // 设备节点
	int major; // 主设备号
	void *private_data; // 私有数据
	unsigned short ir, als, ps;	// 三个光传感器数据
};

static struct ap3216c_dev ap3216cdev;
```

* 编写I2C读多个寄存器函数
```c
/*
 * @description: 从ap3216c读取多个寄存器数据
 * @param - dev: ap3216c设备
 * @param - reg: 要读取的寄存器首地址
 * @param - val: 读取到的数据
 * @param - len: 要读取的数据长度
 * @return: 操作结果
 */
static int ap3216c_read_regs(struct ap3216c_dev *dev, u8 reg, void *val, int len)
{
	/* ...... */
}
```

* 编写I2C写多个寄存器函数
```c
/*
 * @description: 向ap3216c多个寄存器写入数据
 * @param - dev: ap3216c设备
 * @param - reg: 要写入的寄存器首地址
 * @param - val: 要写入的数据缓冲区
 * @param - len: 要写入的数据长度
 * @return: 操作结果
 */
 static s32 ap3216c_write_regs(struct ap3216c_dev *dev, u8 reg, u8 *buf, u8 len)
{
	/* ...... */
}
```

* 编写设备文件打开函数
```c
/*
 * @description: 打开设备
 * @param - inode: 传递给驱动的inode
 * @param - filp: 设备文件，file结构体有个叫做private_data的成员变量
 * @return: 0 成功;其他 失败
 */
static int ap3216c_open(struct inode *inode, struct file *filp)
{
	/* 一般在open的时候将private_data指向设备结构体 */ 
	filp->private_data = &ap3216cdev;
	/* 初始化AP3216C */
	ap3216c_write_reg(&ap3216cdev, AP3216C_SYSTEMCONG, 0x04); // 复位ap3216c
	mdelay(50); // AP3216C复位最少10ms
	ap3216c_write_reg(&ap3216cdev, AP3216C_SYSTEMCONG, 0X03); // 开启ALS、PS+IR 	
	return 0;
}
```

* 编写设备文件读取函数
```c
/*
 * @description: 从设备读取数据 
 * @param - filp: 要打开的设备文件(文件描述符)
 * @param - buf: 返回给用户空间的数据缓冲区
 * @param - cnt: 要读取的数据长度
 * @param - offt: 相对于文件首地址的偏移
 * @return: 读取的字节数，如果为负值，表示读取失败
 */
static ssize_t ap3216c_read(struct file *filp, char __user *buf, size_t cnt, loff_t *off)
{
	short data[3];
	long err = 0;

	struct ap3216c_dev *dev = (struct ap3216c_dev *)filp->private_data;
	
	ap3216c_readdata(dev);

	data[0] = dev->ir;
	data[1] = dev->als;
	data[2] = dev->ps;
	err = copy_to_user(buf, data, sizeof(data));
	return 0;
}
```

* 编写设备释放函数
```c
/*
 * @description: 关闭/释放设备
 * @param - filp: 要关闭的设备文件(文件描述符)
 * @return: 0 成功;其他 失败
 */
static int ap3216c_release(struct inode *inode, struct file *filp)
{
	return 0;
}
```

* 编写设备操作函数集合结构体
```c
static const struct file_operations ap3216c_ops = {
 	.owner = THIS_MODULE,
 	.open = ap3216c_open,
 	.read = ap3216c_read,
 	.release = ap3216c_release,
};
```

* 编写I2C驱动的匹配函数
```c
/*
* @description: i2c驱动的probe函数，当驱动与设备匹配以后此函数就会执行      
* @param - client: i2c设备
* @param - id: i2c设备ID
* @return: 0->成功; 其他负值->失败
*/
static int ap3216c_probe(struct i2c_client *client, const struct i2c_device_id *id)
{
	// 1.构建设备号
	if (ap3216cdev.major)
	{
		ap3216cdev.devid = MKDEV(ap3216cdev.major, 0);
		register_chrdev_region(ap3216cdev.devid, AP3216C_CNT, AP3216C_NAME);
	}
	else
	{
		alloc_chrdev_region(&ap3216cdev.devid, 0, AP3216C_CNT, AP3216C_NAME);
		ap3216cdev.major = MAJOR(ap3216cdev.devid);
	}

	// 2.注册设备
	cdev_init(&ap3216cdev.cdev, &ap3216c_ops);
	cdev_add(&ap3216cdev.cdev, ap3216cdev.devid, AP3216C_CNT);

	// 3.创建类
	ap3216cdev.class = class_create(THIS_MODULE, AP3216C_NAME);
	if (IS_ERR(ap3216cdev.class))
	{
		return PTR_ERR(ap3216cdev.class);
	}

	// 4.创建设备
	ap3216cdev.device = device_create(ap3216cdev.class, NULL, ap3216cdev.devid, NULL, AP3216C_NAME);
	if (IS_ERR(ap3216cdev.device))
	{
		return PTR_ERR(ap3216cdev.device);
	}

	ap3216cdev.private_data = client;

	return 0;
}
```

* 编写I2C驱动的移除函数
```c
/*
 * @description: i2c驱动的remove函数，移除i2c驱动的时候此函数会执行
 * @param - client: i2c设备
 * @return: 0->成功; 其他负值->失败
 */
static int ap3216c_remove(struct i2c_client *client)
{
	/* 删除设备 */
	cdev_del(&ap3216cdev.cdev);
	unregister_chrdev_region(ap3216cdev.devid, AP3216C_CNT);

	/* 注销掉类和设备 */
	device_destroy(ap3216cdev.class, ap3216cdev.devid);
	class_destroy(ap3216cdev.class);
	return 0;
}
```

* 创建匹配列表和I2C驱动结构体
```c
/* 传统匹配方式ID列表 */
static const struct i2c_device_id ap3216c_id[] = {
	{"alientek,ap3216c", 0},  
	{}
};

/* 设备树匹配列表 */
static const struct of_device_id ap3216c_of_match[] = {
	{ .compatible = "alientek,ap3216c" },
	{ /* Sentinel */ }
};

/* i2c驱动结构体 */	
static struct i2c_driver ap3216c_driver = {
	.probe = ap3216c_probe,
	.remove = ap3216c_remove,
	.driver = {
			.owner = THIS_MODULE,
		   	.name = "ap3216c",
		   	.of_match_table = ap3216c_of_match, 
		   },
	.id_table = ap3216c_id,
};
```

* 编写驱动出入口函数
```c
/*
 * @description: 驱动入口函数
 * @param: 无
 * @return: 无
 */
static int __init ap3216c_init(void)
{
	int ret = 0;

	ret = i2c_add_driver(&ap3216c_driver);
	return ret;
}

/*
 * @description: 驱动出口函数
 * @param: 无
 * @return: 无
 */
static void __exit ap3216c_exit(void)
{
	i2c_del_driver(&ap3216c_driver);
}

/* module_i2c_driver(ap3216c_driver) */

module_init(ap3216c_init);
module_exit(ap3216c_exit);
MODULE_LICENSE("GPL");
MODULE_AUTHOR("kkl");

```




---

## 设备树

* VScode设备树高亮插件：devicetree

### pinctrl子系统

1. 在`iomuxc`中创建pinctrl节点
```devicetree
pinctrl_test: testgrp {

	/* 具体的PIN信息 */

};
```

2. 添加"fsl,pins"属性
```devicetree
pinctrl_test: testgrp {
	fsl,pins = <
	/* 设备所使用的 PIN 配置信息 */
	MX6UL_PAD_GPIO1_IO00__GPIO1_IO00 config /* config 是具体设置值 */
	>;
};
```

### gpio子系统

1. 在根节点`/`下创建gpio设备子节点

```devicetree
test {
	/* 节点内容 */
};
```

2. 添加pinctrl信息

```devicetree
test {
	pinctrl-names = "default"; /* 添加pinctrl-name属性，描述pinctrl名字为"default" */
	pinctrl-0 = <&pinctrl_test>; /* 添加pinctrl-0节点，表示test设备所使用的Pin信息保存在pinctrl_test节点当中 */
	/* 其他节点内容 */
};
```

3. 添加gpio属性信息

```devicetree
test {
	pinctrl-names = "default"; /* 添加pinctrl-name属性，描述pinctrl名字为"default" */
	pinctrl-0 = <&pinctrl_test>; /* 添加pinctrl-0节点，表示test设备所使用的Pin信息保存在pinctrl_test节点当中 */
	gpio = <&gpio1 0 GPIO_ACTIVE_LOW>;
};
```

### 定时器
#### 长定时（P1260）
#### 短延时Delay（P1260）

---

## 常用命令
### 打开有管理员权限的文件管理器
* `sudo nautilus`

### 删除非空文件夹
* `rm -r xxx`-r的意思就是递归操作，将会删除该文件夹下的所有子文件夹和文件！

### 查看dmesg日志信息
* `dmesg`把从启动开始到当前是所有日志都打印出来
* `dmesg | tail`默认打印最近的十条日志
* `dmesg | tail -20`打印最近的二十条日志

### 挂载SD卡
1. 通过`fdisk -l`确定sd卡的存在
2. 创建一个空文件夹，我选择`/mnt/mmc`
3. 挂载sd卡到新创建的空文件夹`mount /dev/mmcblk0p1 /mnt/mmc`

* 卸载可以使用`umount /mnt/mmc`，注意卸载的时候你所在的当前目录不能是/mnt，否则会卸载失败的。

### 复制非空文件夹
* `cp -r /home/packageA/* /home/packageB/` 或者`cp /home/packageA/* /home/packageB/`是把packageA中的文件都复制到packageB中
* `cp -r /home/packageA/ /home/cp/packageB/` 是直接把packageA文件夹复制到packageB中

```shell
Linux cp（英文全拼：copy file）命令主要用于复制文件或目录。

语法
cp [options] source dest
或

cp [options] source... directory
参数说明：

-a：此选项通常在复制目录时使用，它保留链接、文件属性，并复制目录下的所有内容。其作用等于dpR参数组合。
-d：复制时保留链接。这里所说的链接相当于 Windows 系统中的快捷方式。
-f：覆盖已经存在的目标文件而不给出提示。
-i：与 -f 选项相反，在覆盖目标文件之前给出提示，要求用户确认是否覆盖，回答 y 时目标文件将被覆盖。
-p：除复制文件的内容外，还把修改时间和访问权限也复制到新文件中。
-r：若给出的源文件是一个目录文件，此时将复制该目录下所有的子目录和文件。
-l：不复制文件，只是生成链接文件。
实例
使用指令 cp 将当前目录 test/ 下的所有文件复制到新目录 newtest 下，输入如下命令：

$ cp –r test/ newtest          
注意：用户使用该指令复制目录时，必须使用参数 -r 或者 -R 。
```