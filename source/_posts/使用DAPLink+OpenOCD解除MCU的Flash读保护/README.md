---
title: 使用DAPLink+OpenOCD解除MCU的Flash读保护
excerpt: 我就知道一定会有办法的www!!!
tags: [MCU, OpenOCD, DAPLink]
# index_img: /img/post/9.jpg
# banner_img: /img/post/10.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/21.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/21.jpg
categories: Study Page
comment: 'twikoo'
date: 2024-10-14 12:53:00

---

### 使用DAPLink+OpenOCD解除MCU的Flash读保护
### Author：@kkl

---

### 写在前面

今天在使用`Keil5`烧录STM32单片机代码的时候突然弹框警告：`Error : Flash Download failed - "Cortex-M4"` or `RDDI-DAP error`，这个错误多数是因为MCU在烧录过程中受到意外干扰，自行开启了Flash读保护导致的。

曾经我也不少时候遇到过这种情况，那时候的解决办法是利用烧录软件`flymcu`通过串口清除全部Flash内容，进而消除读保护；或者使用ST-Link搭配官方软件`STM32 ST-LINK Utility`来消除读保护。

但是现在我手里只有DAPLink（ga...，于是绞尽脑汁搜寻方法，苦闷了好久。突然间想到似乎可以尝试一下`OpenOCD`，于是抱着实验的心态，我搜罗了大量相关的内容后，得到了以下的解决办法。

### 下载OpenOCD

由于我当前的系统环境是`Win 11`，于是OpenOCD应该选择`Download pre-built OpenOCD for Windows`，选择任何版本都不影响最终效果，选择最新的版本即可。

<!-- ![下载OpenOCD](images/使用DAPLink与OpenOCD解除MCU的Flash读保护/image.png) -->
![下载OpenOCD](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/使用DAPLink与OpenOCD解除MCU的Flash读保护/image.png)

下载网址：https://gnutoolchains.com/arm-eabi/openocd/

### 解除Flash读保护

下载并且解压好OpenOCD压缩包以后，连接好单片机和DAPLink。

{% note warning %}
注意：解压文件路径尽量不要夹带中文或者特殊标点字符，以避免可能出现意外的错误。
{% endnote %}

接着在路径`\OpenOCD-20240916-0.12.0\bin`下打开命令行，输入命令：`.\openocd -f interface/cmsis-dap.cfg -f target/stm32f4x.cfg -c init -c "reset halt" -c "stm32f4x unlock 0" -c "reset halt" -c "exit"`.

这时如果生成以下日志，则代表Flash读保护解除成功，可以重新使用`Keil`进行程序的烧录啦：

<!-- ![](images/使用DAPLink与OpenOCD解除MCU的Flash读保护/image-1.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/使用DAPLink与OpenOCD解除MCU的Flash读保护/image-1.png)

如果没有成功，请检查单片机和DAPLink的连线。

{% note success %}
由于我使用的单片机型号是`STM32F401RET6`，所以我选择了`target/stm32f4x.cfg` & `stm32f4x`，你可以在该路径`\OpenOCD-20240916-0.12.0\share\openocd\scripts\target`找到适合你的单片机型号的对应文件，市面上大部分的单片机型号的对应文件应该都能够在这儿找到。
{% endnote %}



### 最后一件事（重要👀

使用DAPLink+OpenOCD解除MCU的Flash读保护可能会导致Keil在程序烧录时出现`Verify failed`的情况，这并不影响程序的正常烧录，手动给单片机复位一下就行，只是有点不优雅，如果可以的话后面拿ST-Link重新再执行一次Flash解除读保护就最好了（谁叫人家是官方...

当然也有可能只是单纯烧录频率太快了，在魔术棒的`Debug->CMSIS-DAP Debugger->Settings`设置中，将频率调整到`1MHz`，报错的警告就消失啦！

<!-- !["Verify failed"的解决办法](images/使用DAPLink与OpenOCD解除MCU的Flash读保护/image-2.png) -->
!["Verify failed"的解决办法](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/使用DAPLink与OpenOCD解除MCU的Flash读保护/image-2.png)


### 写在后面
- 感谢教程: https://bbs.21ic.com/icview-3335340-1-1.html