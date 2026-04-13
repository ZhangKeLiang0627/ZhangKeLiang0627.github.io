---
title: 杂记丨4月：涉水的大象
excerpt: 嘿，路西法！
tags: [life, record]
index_img: /images/杂记/2026年/4月/image-0.gif
banner_img: /images/杂记/2026年/4月/image-0.jpg
categories: Life Page
comment: 'twikoo'
date: 2026-4-4 13:29:00
---

### 杂记丨4月：涉水的大象
### Author：@kkl

---

### 写在前面

_**涉水的大象。**_

<figure>
<img src="/images/杂记/2026年/4月/image-2.jpg" alt="" width = "600" height = "500" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

是的没错，正如你从图片当中所看到的，我换新电脑啦！

而且还是出其不意的换成了Mac本，多少还是有点冒险精神在里头的。

依稀记得之前的Win本是三年前的这个时候去线下的荣耀店挑的Magic book 14inch，16GB的内存，就这么摇摇晃晃地陪我度过了这么多时光，而且可恶的是买回来三个月之后Honor就推出来32GB内存的Win本，把我狠狠的背刺了，当时听到消息的我气得吐血，可是机器都已经用了这么久了，想换新是必然不可能的，又没有多余的钱再补换一本...

来聊聊这个Macbook吧，确实刚到手的时候，给人的感觉是非常新奇的。无论是做工、屏幕、音响还是操作系统，都自带了一种由内而外散发的优雅，极致的优雅，性能不错的同时，离电性也非常强，粗略地估计过，正常使用到情况下，从充满电使用到20%花了我两天，才反应过来还得充个电才行吧（笑，没吃过细糠。但是除了优雅以外，对于我个人来说似乎就没有什么作用了，哈哈，我自己也惊呆了，居然还没开始，就结束了吗（damn！

本来想着整个Mac，然后装个虚拟机Ubuntu就可以无缝衔接我当前的一些开发工作，包括MCU开发、SOC的内核驱动开发、SOC的应用开发等等。太天真了，四个非常失望的大字送给自己。

Mac因为它的CPU架构是ARM64，而Windows的架构是X86，导致他们先天就有很多无法兼容的地方，我甚至很难在Mac里面找到一款好用的X86架构的Ubuntu，哪怕是转译的也好，还是怎么样都好，找来找去就找到了一个Orbstack，这个轻量化的VM确实不错，但是有个挺大的弱点就是和Docker一样不支持GPU驱动。就会导致无法拿来渲染一些需要用到界面的程序，非常的upset啊。折腾了几天，也没能在Mac上搭建起一个很顺畅的工作流。

于是，到最后我都想要放弃在Mac上搞开发，想要把它换了吧又仿佛被它完美的硬件外设给蛊惑一般，爱不释手。苹果真的很恶毒啊，毒苹果（哼！

所以，这个美丽小废物如今都被我放置在床边，睡前写写博客、听听音乐、看看视频的，还是非常赏心悦目的，有时出差，远程连接一下家里的Win，也不是不能用。唉，看需求，后面还得再置办一台Win的台式机。

怎么回想，这一次都是宛如白痴般的购物，败在了生态，和自己秀逗的脑袋！！！


<figure>
<img src="/images/杂记/2026年/4月/image-1.jpg" alt="" width = "600" height = "500" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

...

---

### 2026/4/4 - 涉水的大象
<!-- require APlayer -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<!-- require MetingJS -->
<script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>
<meting-js
	server="netease"
	type="song"
	id="417859120">
</meting-js>

好的，今天是一个非常偶然的时间，夜深了，快要一点钟，我准备要睡觉了，但是睡前我得等我放在洗衣机里面的衣服洗好，然后我得好去晾衣服，于是，就有了这么一个短短的空闲的时间！可以短促唠唠！

最近仿佛做什么都提不起劲，想要做点技术又突然没了目标，我太熟悉这种感觉了，就像是被莫名其妙地拔了电源，宕机了脑袋空空。

三月的时候，做了HOPE-Link的项目，特别疯狂，疯狂到工作日八九点下班回到家，麻溜地洗好澡开始往书桌前一坐，噼里啪啦一阵就到凌晨三点，第二天八点多又爬起来去赶上班通勤的地铁。持续时间不那么长，大概两周多，周而复始也不觉得闷。可能是年轻吧，心脏还没有“抽抽”的感觉，但是工作时段明显感觉强烈的困意阵阵袭来，中午不吃饭，到点马上呼呼大睡，下午好似活过来了一样，“我又能呼吸～”...

w我想我确实该给自己制定一些目标，像扎克伯格说的每年都给自己做一个小有挑战性的计划，然后就会有动力...了吗？

HOPE-Link的制作已经接近尾声，还差一些缝缝补补的功能，其实铆足了劲去做的话很快就能做完，但是这样的势头、干劲好像泄气的皮球、消逝了。然后剩下一些TODO-List就这么堆在那，是的你没有听错，我这个P人，甚至会为自己的项目做TODO-List，所以这到底是为什么，你明明知道还差什么这个作品就能够完整（甚至完美虽然概率很低，但是你就是不愿意再踏步了，哪怕再一步都觉得，好累啊！btw我还没有做视频预告，图文发布呢，怎么还有这么多东西要干啊！！！

当然，不仅做项目是这样拖延，我在其他领域也是妥妥的拖延星人...但这些都不愿再多说，就罢。
...
<br></br>

我在这个小区租房，没想到已经快过了整整一年。前两天和房东续租，我意料到肯定它会涨租，没想到足足涨了50蚊！好贵！我反手给它敲诈两次全屋的保洁，心满意足。

然后，听闻那个相处了大半年的室友要退租了，它说要换个城市发展了，不然这里挺好的。我们趁它临走前在这个小小公寓里下厨做了一顿晚餐，不大不小，它从房间抱出一瓶龙舌兰，我拿好洗净的玻璃杯，就这么边吃边喝边有一搭没一搭地聊着天...

“工作之后感觉整个人生都变得无趣了呢，怎么会变成这样呢？”

“我想，你需要交点新朋友了哦。”

“干杯吧，为我们虚假的情谊、为最后的晚餐！”

“庆祝你即将逃离深圳这个暗无天日的黑洞洞，干杯！”

...

### 2026/4/17 - 嘿，路西法
<!-- require APlayer -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<!-- require MetingJS -->
<script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>

<meting-js
	server="netease"
	type="song"
	id="3355117698">
</meting-js>


...

<!-- 热力图的挂件 -->
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
<div id="posts-chart"style="border-radius: 8px; height: 190px; padding: 10px;"></div>

---

### 写在后面

...


_**涉水的大象...**_

---

