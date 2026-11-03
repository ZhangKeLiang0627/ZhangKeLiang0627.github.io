---
title: 基于阿里云OSS+Hexo+PicGo搭建图床🖼️🛏️
excerpt: 阿里云是真的香啊！快是真的快，贵还真的没这么贵（划掉！
tags: [Hexo, aliyun, PicGo]
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/20.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/20.jpg
categories: Study Page
comment: 'twikoo'
date: 2024-8-24 16:21:00

---

### 基于阿里云OSS+Hexo+PicGo搭建图床🖼️🛏️
#### 阿里云是真的香啊！快是真的快，~~贵还真的没这么贵~~，其实还是蛮贵的🥹💰💸
#### LUV form aliyun...
#### Author：@kkl

---

## 前记

随着博客文章的数量越来越多，难免地，图片存储的数量也渐渐增多。之前是使用文件夹本地存储图片，部署的时候是全数上传到Github的，慢慢会使得这个仓库变得极其臃肿，而且不便于更换网站的托管。于是还是决定使用图床！！！

没错，阿里云的对象存储OSS！买了三年的空间才27元，40GB，又可以霍霍一阵啦！

> **Q：关于为什么要搭建图床？**

> A：我首先能给出的答复就是，**快！访问快，上传快，迁移快。**然后我选择aliyun就是**求稳，不丢数据。**最后，搭建图床，其实也可以**用来实现一些其他的功能如：网页Download。**比方说我可以往OSS当中存放一些PDF、PPT、txt等文件文档，我可以随时在我的博客当中下载获取，**非常的便利！**

---

## 开始

### PicGo图床工具

PicGo是一款非常优秀的图床工具，支持微博、腾讯云COS、阿里云OSS、七牛云、又拍云、GitHub、SM.MS、imgur等。功能强大，简单易用，可惜我不爱它...

我还是喜欢简单粗暴，因为我是直接用Vscode敲原生Markdown，用不惯Typora、Obsidian之类的编辑器，所以敲文章编辑图片的时候还要在中间插入一层PicGo，过程繁琐。最后还是没有使用PicGo，后面我会分享我敲Markdown对图片管理的技巧，这里讲讲PicGo的安装和使用，优秀的软件工具说不定适合您！

#### PicGo的下载与安装

- 下载

您可以在PicGo的Github仓库的Releases当中获取对应的版本：[戳这里:)](https://github.com/Molunerfinn/PicGo/releases)

选择最新的版本就行啦（截止2024/8/25）：
<!-- ![PicGo版本选择](images/基于阿里云OSS与Hexo与PicGo搭建图床/image-0.png) -->

![PicGo版本选择](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/基于阿里云OSS与Hexo与PicGo搭建图床/image-0.png)

- 安装

进行安装，一路打 √ 即可！

### 阿里云对象存储OSS

关于阿里云对象存储OSS的创建和配置，我找到了一篇优秀的教程[戳这里:P](https://blog.csdn.net/Unamattina_/article/details/136463281)

当然，其中还包括了对PicGo图床工具的配置，教的很赞！

谢谢该教程作者的分享！非常的手把手教学！

### 阿里云对象存储OSS+Vscode替换本地图片链接

emmm，说来奇怪，我初使用PicGo的时候，我发现我不能用PicGo查看已经存在于OSS当中的图片，只能查看通过PicGo上传到OSS的图片。同时，在PicGo端对图片进行删除后，并不会连同OSS端的图片一起删除。这就导致了操作的不流畅性。

而且，PicGo不能批量扫描文件夹，上传图片过多过大的时候，会出现**在OSS端已经成功上传但在PicGo端查看不到该图片的情况。**

最后，PicGo不能随我心意地自如的将图片上传到OSS对应的文件夹当中，一张一张地传真的很要命。

我还遇到一个问题是，**OSS当中的图片是上传后不能也不允许改动在文件夹当中的位置的**，比方说：原来图片A在文件夹1中，现在我想要将图片A从文件夹1移动到文件夹2当中去，这是做不到的。你只能删除文件夹1中的图片A，并在文件夹2中重新上传图片A。

关于这个问题的解答，我询问了我的从事后端的盆友。它说，你可以把OSS当作是每一个存储对象都对应着一个URL，这个URL是由文件夹的存储路径决定的。倘若你上传了图片A到文件夹1，返回的永久的URL是`https://hugokkl.com/file1/pictureA.jpg`，云端会根据这个URL到对应的路径当作找到对应的图片。此时你修改该图片A的路径到文件夹2，可是URL却不会改变，会导致文件路径和URL对应不上，云端也不知道去哪里找这个URL对应的图片A了。

于是，最后我选择使用简单粗暴，**扫描文件夹 + 给原来的图片链接加上前缀的方式**完成了图片的迁移以及图床的搭建！这真的很方便！

**然后，源的切换也非常简单，从本地图片存储切换到OSS存储只需要在原来的URL的前面加入前缀`https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/`即可，反之就删除。**

<!-- ![](images/基于阿里云OSS与Hexo与PicGo搭建图床/image-1.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/基于阿里云OSS与Hexo与PicGo搭建图床/image-1.png)

## 后记

- OSS当中的文件夹以及文件名不要带有标点符号一类的，否则可能会导致生成的URL不可用。

- OSS的流量费用还是比较高昂的，这一点要注意！每小时内外网流出流量超过20MB便会开始计费！

- 目前，截至到2024/8/25，本博客绝大部分的图片已经转移到阿里云OSS进行存储！于是，即便不使用魔法，也可以快速地访问本博客！解决了一个挺令人头疼的难题😁