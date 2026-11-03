---
title: Twikoo评论系统的安装与个性化设置
excerpt: 这几天，迎来了博客大修，同时加入了评论功能，eventually! 可以和大家bablababababa!!!
tags: [Hexo, Twikoo]
# index_img: /img/post/9.jpg
# banner_img: /img/post/10.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/Twikoo评论系统的安装与个性化设置/image-0.png
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/Twikoo评论系统的安装与个性化设置/image-2.png
categories: Study Page
comment: 'twikoo'
date: 2024-9-7 15:00:00

---

### Twikoo评论系统的安装与个性化设置
### 这几天，迎来了博客大修，同时加入了评论功能，eventually! 可以和大家bablababababa!!!
### Author：@kkl

---

很喜欢这个表情包小猫，it reminds me the github cat!!!

<!-- {% gi 2 2 %}
<center><img src="https://emojis.slackmojis.com/emojis/images/1643515259/12807/meow_attentionreverse.png?1643515259" width = "135" height = "135" style="border-radius: 15px;"></center>
<center><img src="/images/Twikoo评论系统的安装与个性化设置/image-3.gif" width = "135" height = "135" style="border-radius: 15px;"></center>
{% endgi %} -->

{% gi 2 2 %}
<center><img src="https://emojis.slackmojis.com/emojis/images/1643515259/12807/meow_attentionreverse.png?1643515259" width = "135" height = "135" style="border-radius: 15px;"></center>
<center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/Twikoo评论系统的安装与个性化设置/image-3.gif" width = "135" height = "135" style="border-radius: 15px;"></center>
{% endgi %}


## 写在前面
其实在当初在为博客建站做准备的时候，我是并没有打算往博客当中安装评论系统的。原因是当时觉得作为浩瀚互联网中的一个普普的小站，访问密度一定是十分渺小的。其次，原意是作为技术博客来进行建设，用来存放个人学习时的记录的笔记、方法等，仅仅面向个人。于是就会在那捧脑袋想：评论应该没有必要吧...

不过近期发现，除了技术这类~~严肃内容（~~的输出，渐渐也会分享一些生活方面的内容以及一些自己的想法。想想坐在电脑面前边想边敲啊敲，发布前还得呼出命令行`hexo clean && hexo g && hexo d`，这种复古的仪式感，嗯，old good times，感觉起来还是很愉快的！后期可能会慢慢往「技术 + 生活」两大块内容发展、生长。这个时候，突然就感到，要是能有友人在底下comment还是很幸福的，所以博客拥有一个评论系统还是很重要的。

还有一件事，就是我开始写博客接近快一年了！鼓掌祝贺piapiapia！但是，也没有交到多少赛博友邻，沮丧...希望添加评论系统以后能够开始make good friends!

## 开始

### Vercel + Twikoo 云函数部署
我搭建评论功能使用的平台是`Twikoo`，一个简洁、安全、免费的静态网站评论系统：[->poke here](https://twikoo.js.org/).

因为我当前的静态博客搭建使用的是`Hexo + Fluid`，然后 Fluid 主题当中集成好了 Twikoo 的插件，因此我只需要完成云函数部署即可（我选择使用[Vercel部署方式](https://twikoo.js.org/backend.html#vercel-%E9%83%A8%E7%BD%B2)。

### Twikoo个性化设置

Twikoo评论系统的个性化设置参考了[这篇文章](https://www.gigigatgat.ca/posts/twikoo-tutorial/)，非常谢谢这位Po主！

#### 头像设置

`Configuration-General-GRAVATAR_CDN`一栏填入`gravatar.com`.

自定义头像，可以前往[Gravatar](https://gravatar.com/)这个网站用自己的邮箱注册账号并上传个人头像，即可使用该邮箱进行评论时显示自己的自定义头像啦！

#### 自定义表情包

`Configuration-Plugin-EMOTION_CDN`一栏输入`https://raw.githubusercontent.com/avocadoTiff/twikoo/main/owo.json`，这是原文章Po主制作的自定义表情包库，然后你也可以拥有这么一只可爱小猫！

**WHAT A LOVELY CAT!!!**

<!-- ![Twikoo评论效果图](/images/Twikoo评论系统的安装与个性化设置/image-1.png) -->

![Twikoo评论效果图](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/Twikoo评论系统的安装与个性化设置/image-1.png)

接下来，我也照猫画虎地尝试起制作自己的自定义表情包库啦（撸起袖子状！

表情包的制作其实很简单！只要按照以下的`json`文件格式制作一份`owo.json`文件，然后将这个文件放到你的仓库，或者对象存储等区域就可以进行调用啦！

{% fold info @制作表情包的 json 文件格式 %}

制作表情包有三种`type`：
- `emoticon`：颜文字，文字类。
- `emoji`：这个怎么翻译啊，小表情包吗hhh？
- `image`：获取图片当成表情包，需要提供URL。

```json
{
    "颜文字": {
        "type": "emoticon",
        "container": [
            {
                "icon": "(ノ°ο°)ノ",
                "text": "前方高能预警"
            },
            {
                "icon": "(´இ皿இ｀)",
                "text": "我从未见过如此厚颜无耻之人"
            },
        ]
    },
    "Emoji": {
        "type": "emoji",
        "container": [
            {
                "icon": "😂",
                "text": ""
            },
            {
                "icon": "😀",
                "text": ""
            },
        ]
    },
    "Bilibili": {
        "type": "image",
        "container": [
            {
                "icon": "<img src=\"https://owo.imaegoo.com/bilibili/6ea59c827c414b4a2955fe79e0f6fd3dcd515e24.png\">",
                "text": "tv_doge"
            },
            {
                "icon": "<img src=\"https://owo.imaegoo.com/bilibili/a8111ad55953ef5e3be3327ef94eb4a39d535d06.png\">",
                "text": "tv_亲亲"
            },
        ]
    }
}
```
{% endfold %}


以下是几个包含了很多很多各种各样的自定义表情包的地址：
- [Twikoo-Magic](Twikoo-Magic)，一个搜罗了许多热门Twikoo表情包的仓库。
- [Slackmojis](https://slackmojis.com/)，超超超多表情包，提供了`alt text`，右键可以`复制图片链接`。
- [小康的表情速查](https://emotion.xiaokang.me/#/)，居然可以一键生成Twikoo表情包的 json 文件，不过看上眼的就少了些（

最后终于，我也制作了一个自定义的表情包库，和我的博客扔在同一个Github仓库啦！

`Configuration-Plugin-EMOTION_CDN`一栏输入`https://raw.githubusercontent.com/ZhangKeLiang0627/ZhangKeLiang0627.github.io/main/img/sys/owo.json`，即可使用同款表情ahhh！

{% gi 2 2 %}
<center><img src="https://emojis.slackmojis.com/emojis/images/1643514476/4594/blob-wave.gif?1643514476" width = "135" height = "135" style="border-radius: 15px;"></center>
<center><img src="https://emojis.slackmojis.com/emojis/images/1666924513/62049/blob_crazy_happy.gif?1666924513" width = "135" height = "135" style="border-radius: 15px;"></center>
{% endgi %}

#### 配置邮件通知服务

这里以配置QQ邮箱为例：

首先，你要先开启邮箱的POP3/SMTP服务：[->click here to know more details](https://blog.csdn.net/weixin_58068682/article/details/122770936).

{% fold info @你仅需要填写的邮件通知选项 %}
```md
SENDER_EMAIL: <你的QQ邮箱地址>
SENDER_NAME: <发送邮件者名称>
MAIL_SUBJECT: <自定义通知邮件主题>
SMTP_SERVICE: <你的邮件服务提供商>
SMTP_USER: <邮件通知邮箱用户名>(需与SENDER_EMAIL一致)
SMTP_PASS: <邮件通知邮箱密码>(授权码)
```
{% endfold %}

填写好后，可以使用「邮件通知测试」测试该设置是否能够正常使用。

## 写在后面

终于是把评论功能系统添加好啦！现在我也可以说，欢迎大家的留言!!!