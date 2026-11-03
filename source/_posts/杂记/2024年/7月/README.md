---
title: 杂记丨7月：最近在学习网络编程...
excerpt: 乘着期末考速成计算机网络这份巨浪！
tags: [Linux, Web, Socat, Cmake, tar, record]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/11.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/12.jpg
categories: Life Page
comment: 'twikoo'
date: 2024-7-14 18:43:00

---

### 杂记丨7月：最近在学习网络编程...
### Author：@kkl

---

### 前记
一直有一个机器人梦啊，这回不能再gugubird啦。只不过刚好碰上忙时，知识点零散，一点点慢慢积累吧。

---

### 【2024/07/14】找到一个有趣且强大的网络工具`Socat`

**Socat**或**SOcket CAT**是一个基于 Linux 命令行/终端的实用程序，用于在两个双向字节流之间建立和传输数据。


在linux环境`(Debian/Ubuntu)`下安装socat

```bash
# sudo apt-get update

sudo apt-get install socat
```

- **1.接着可以尝试一个简单的TCP通信测试**

```bash
# 分别打开两个终端窗口

# 窗口1输入以下命令，监听端口5555
socat -d -d TCP-LISTEN:5555 -

# 窗口2输入以下命令，连接端口5555
# ip地址可以使用ifconfig指令查询

# 这条指令是全双工的
# 连接成功以后，可以在各自的窗口发言，信息会传送到对方的窗口！
socat -d -d TCP-CONNECT:192.168.26.163:5555 -

# 这条指令是单工的
# 连接成功以后，监听窗口只能听不能发，只有发送窗口可以发！
socat - TCP:192.168.26.163:5555

# 上述的所有TCP可以更换为UDP，就会得到UDP通信！
```
<!-- ![socat-TCP](images/杂记/2024年/7月/image.png) -->
![socat-TCP](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/杂记/2024年/7月/image.png)

- **2.创建两个虚拟串口并转发数据**

打开一个新终端窗口，输入：
```bash
socat -d -d pty,raw,echo=0 pty,raw,echo=0
```

返回结果如下:
```bash
2024/07/14 20:39:00 socat[2297] N PTY is /dev/pts/1
2024/07/14 20:39:00 socat[2297] N PTY is /dev/pts/2
2024/07/14 20:39:00 socat[2297] N starting data transfer loop with FDs [5,5] and [7,7]
```

创建了`/dev/pts/1`和`/dev/pts/2`两个串口，并且将两个串口连接起来，此时打开两个终端，在终端1输入命令：
```bash
# 去到对应的文件夹
cd /dev/pts/
cat < 1
```

在另一个新终端，终端2中输入命令：
```bash
# 去到对应的文件夹
cd /dev/pts/
echo "abc" > 2
```

此时在终端1上就会显示`abc`数据，此时说明`/dev/pts/2`把数据传输到了`/dev/pts/1`.

<!-- ![socat-UART](images/杂记/2024年/7月/image-1.png) -->
![socat-UART](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/杂记/2024年/7月/image-1.png)

**上面创建的串口，在不同的机器上名称可能不一致，对于调试、测试来讲很麻烦，下面给出解决方法！**

- **3.创建“固定名称”的串口**

```bash
#使用link即可把创建的虚拟的串口映射到任何你有权限的位置（这里是home目录）
 socat -d -d pty,raw,echo=0,link=$HOME/socatpty1 pty,raw,echo=0,link=$HOME/socatpty2 
```

返回内容如下：
```bash
2024/07/14 20:57:47 socat[3041] N PTY is /dev/pts/1
2024/07/14 20:57:47 socat[3041] N PTY is /dev/pts/2
2024/07/14 20:57:47 socat[3041] N starting data transfer loop with FDs [5,5] and [7,7]
```

创建串口并设置串口参数
```bash
 socat -d -d pty,raw,b19200,csize=3,cstopb=1,parenb=1,parodd=1,echo=0,link=$HOME/socatpty1 pty,raw,b19200,csize=3,cstopb=1,parenb=1,parodd=1,echo=0,link=$HOME/socatpty2
```
解释如下：
```bash
1. b19200 # 设置波特率为19200
2. csize3 # 设置character size为8
3. cstopb=1 # 设置两个停止位
4. parenb=1 # 不进行奇偶检测
5. parodd=1 # 奇校验
```
类似参数还有很多很多，请查阅相关的帮助[文档](http://www.dest-unreach.org/socat/doc/socat.html)

<!-- ![socat-UART](images/杂记/2024年/7月/image-2.png) -->
![socat-UART](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/杂记/2024年/7月/image-2.png)

---

### 【2024/07/16】浅薄地了解`Cmake`

> 最近要学习的东西用到很多makefile的知识，但是我横竖怎么写都不得心应手。那不如学学Cmake工具好了（其实是信号与系统学累了在摸鱼...

找到一个关于`Cmake`的优良教程，阿里嘎多这位作者：[教程戳我:)](https://subingwen.cn/cmake/CMake-primer/)

---

### 【2024/7/27】tar：常用的文件打包和压缩工具

> 最近遇到镜像压缩、解压缩的小问题，找到这些tar常用的命令，这里统一收集一下。

当然还有其他的工具比如zip、unzip等，这里只讲解tar，其他自行百度吧！

```shell
tar [选项] [压缩文件名] [文件或目录...]
```

常用的选项包括：
- `-c`：创建压缩文件
- `-x`：提取压缩文件
- `-z`：使用`gzip`算法压缩文件
- `-j`：使用`bzip2`算法压缩文件
- `-J`：使用`xz`算法压缩文件
- `-f`：指定归档文件的名称
- `-v`：显示详细的处理信息

`-z -j -J`这三种参数如何选择？
如果对时间比较敏感，可以使用`-z`参数进行`gzip`压缩，虽然压缩率比较低，但是速度较快。
而如果您对压缩率比较看重，可以选择`-j`参数进行`bzip2`压缩，尽管速度较慢，但压缩率比较高。
如果您对压缩率要求非常高，可以选择`-J`参数进行`xz`压缩，这需要更长的时间。

<br></br>

下面提供几个常见的后缀名和对应的压缩和解压命令，大家不用过于纠结命令组合，以后看见相应的后缀直接用对应的命令就行。

1. `.tar.gz 或 .tgz`：

```shell
1 压缩：tar -czf package.tar.gz file1.txt file.txt directory
2 解压缩：tar -xzf package.tar.gz
```

2. `.tar.bz2 或 .tbz2`：

```shell
1 压缩：tar -cjf package.tar.bz2 file1.txt file.txt directory
2 解压缩：tar -xjf package.tar.bz2
```

3. `.tar.xz`：

```shell
1 压缩：tar -cJf package.tar.xz file1.txt file.txt directory
2 解压缩：tar -xJf package.tar.xz
```

---
### 后记
- 鸣谢文章的思路：https://blog.csdn.net/hitgavin/article/details/116162329
- 鸣谢文章答疑解惑，我对此内容做了搬运：https://lianshaohua.blog.csdn.net/article/details/135709779
- 鸣谢文档：https://lceda001.feishu.cn/wiki/WXwJw77ZRitCiYkimVGcO5q5nGh
---