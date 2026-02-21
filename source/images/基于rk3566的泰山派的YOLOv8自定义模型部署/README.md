---
title: 「基于rk3566的泰山派」的YOLOv8自定义模型部署
excerpt: 今天！一起来拯救你吃灰的泰山派2.0🙆！
tags: [rockchip, rk3566, Ubuntu, YOLO]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: /images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-0.jpg
banner_img: /images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-1.png
categories: Project Page
comment: 'twikoo'
# hide: true
date: 2026-2-22 2:16:00
---

### 关于「基于rk3566的泰山派」的YOLOv8自定义模型部署
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

https://github.com/airockchip/ultralytics_yolov8/blob/main/RKOPT_README.zh-CN.md

---

### 开始


---

### 写在后面

**鸣谢：**


...

---