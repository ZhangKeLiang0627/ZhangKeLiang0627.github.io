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
Damnnn!!! 我又来了哈，各位新年平安！

趁着这个新年假期，来捣鼓一下RK系列芯片上面的模型推理部署，然后刚好想要了解一下视觉类的模型YOLO，这个时候不得不搬出之前做过的[YOLOv8-loopy](https://github.com/ZhangKeLiang0627/YOLOv8-loopy)的内容（笑，这么看来，简直是手到擒来呀这期。

其实这里有一个故事：就是也算工作上的小插曲，最近工作性质偏向视觉端，刚好也是瑞芯微的芯片，于是接触了很多“模型端侧推理”的内容。我和视觉组的同事开玩笑说，你们莫非只是用个YOLO而已？钱也太好赚了吧，w我也要干视觉（其实除了YOLO还有很多算法在里头。然后同事打趣摇摇头，给你一个月你也学不来哒...

我对此嗤之以鼻，哼，幽默（￣へ￣

**——from 2026.2.22**
{% endnote %}

{% note info %}
写完开头结尾，倒头就睡（经典开局。今日起床，充满活力，经过几天的假期休养，身体终于从苦不堪言的出差中恢复过来了。但是又想到今天就是初七，明天就是开工大吉，心情瞬间低落，damn啊！不过今天天气多云，确实适合宅家写写文档...

**——from 2026.2.23**
{% endnote %}

---

### 写在前面

tspi的玩家们可以去回顾一下我之前的文章，这里贴上跳转链接[关于「基于rk3566的泰山派」的一切](https://zhangkeliang0627.github.io/2025/11/03/关于基于rk3566的泰山派的一切/README/).

这篇文章受用并不仅限于tspi，其他瑞芯微带NPU的Soc都可以作为参考借鉴，比如：RK3588、RK3576、RK3568、RV1126/RV1126P...

- 先来聊聊我对**YOLOv8**粗浅理解，目前业界上最万金油视觉检测模型非YOLOv8莫属，大家都在用，也嘎嘎好用，多任务统一，做检测、分割、关键点检测都很不错，性价比高啊。

- 当然现在很多老旧项目里面还在跑**YOLOv5**，这模型也很棒很经典新手入门资料齐全踩坑少，但对比上后面的模型性价比有点低了，稍微有些吃力（没想到2020年才出，感觉很近啊。

- **YOLOv11**也不错，小目标检测效果最好，这几个模型可以根据实际检测场景穿插来使用ahh...

更深的就不说啦，再底层的咱们也不太懂大家自行了解，本此我们主要围绕YOLOv8展开学习，知道怎么使用怎么部署就已经非常棒了，下面我们开始吧。

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-2.png" alt="" width = "600" height = "400" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

**_本篇文章将简述如何「基于rk3566的泰山派」快速部署YOLOv8。_**

---

### 开始









---

### 写在后面

**鸣谢：**
- https://doc.embedfire.com/linux/rk356x/Ai/zh/latest/lubancat_ai/example/yolov8.html
- https://wiki.lckfb.com/zh-hans/tspi-3-rk3576/ai/yolov8/detection-model.html

...

---