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
Damnnn!!! 我又来了哈，各位新年平安！趁着这个新年假期，来捣鼓一下RK系列芯片上面的模型推理部署，然后刚好想要了解一下视觉类的模型YOLO，这个时候不得不搬出之前做过的YOLOv8-loopy的内容（笑，
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