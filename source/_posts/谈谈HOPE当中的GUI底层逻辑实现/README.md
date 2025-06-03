---
title: 谈谈HOPE当中的GUI底层逻辑实现✨
excerpt: 第一次萌生如此想要激烈追寻技术大佬的心愿，感恩，感谢！
tags: [Project, STM32, GUI, MCU]
# index_img: /images/谈谈HOPE当中的GUI底层逻辑实现/index-cover.jpg
# banner_img: /images/谈谈HOPE当中的GUI底层逻辑实现/index-cover.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/index-cover.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/index-cover.jpg
categories: Project Page
comment: 'twikoo'
date: 2024-8-31 11:55:00

---

### 谈谈HOPE当中的GUI底层逻辑实现✨
### Let's talk about how to make a GUI like HOPE's !!!
### Project name：HOPE
### Author：@kkl

<p class="note note-warning">本文由于Gif图片存储较大，请耐心等待图片加载🙇‍♂️🙇‍♂️...</p>

---

<!-- {% gi 5 2-3 %}

<center><img src="/images/谈谈HOPE当中的GUI底层逻辑实现/image-0.jpg" alt="exhibition" width="100%;"></center>
<center><img src="/images/谈谈HOPE当中的GUI底层逻辑实现/image-1.jpg" alt="exhibition" width="100%;"></center>
<center><img src="/images/谈谈HOPE当中的GUI底层逻辑实现/image-2.jpg" alt="exhibition" width="100%;"></center>
<center><img src="/images/谈谈HOPE当中的GUI底层逻辑实现/image-3.jpg" alt="exhibition" width="100%;"></center>
<center><img src="/images/谈谈HOPE当中的GUI底层逻辑实现/image-4.jpg" alt="exhibition" width="100%;"></center>

{% endgi %} -->

{% gi 5 2-3 %}

<center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-0.jpg" alt="exhibition" width="100%;"></center>
<center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-1.jpg" alt="exhibition" width="100%;"></center>
<center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-2.jpg" alt="exhibition" width="100%;"></center>
<center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-3.jpg" alt="exhibition" width="100%;"></center>
<center><img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-4.jpg" alt="exhibition" width="100%;"></center>

{% endgi %}

## 前记

该从哪里开始说起呢？

让我开启`HOPE`这个项目的原因其实是非常机缘巧合的，首先是23年暑假期间我们正在紧张准备电赛，需要准备些开发板，但是由于经费不足，于是打算自己动手制作，丰衣足食。

当时正好看见了**稚晖君**发布的项目`REF`，包括硬件和代码框架`MonoUI`都开发地非常的优雅，令人感到遗憾的是，那时并没有开源（现在应该已经开源在他的机械臂项目仓库当中，于是打算从头到脚狠狠的复刻一波！

<!-- ![REF and MonoUI](/images/谈谈HOPE当中的GUI底层逻辑实现/image-5.jpg) -->
<!-- ![UltraLink](/images/谈谈HOPE当中的GUI底层逻辑实现/image-6.jpg) -->

![REF and MonoUI](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-5.jpg)
![UltraLink](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-6.jpg)

- 谈谈硬件

于是，我就开始在自己一步一步慢慢摸索下，第一个HOPE的雏形诞生了！紧接着，秉持着快速迭代的理念，很快地，第二版、第三版都接踵而至...

<!-- ![HOPE的设计草稿图](/images/谈谈HOPE当中的GUI底层逻辑实现/image-11.jpg) -->

![HOPE的设计草稿图](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-11.jpg)

<!-- {% gi 4 2-2 %}

![](/images/谈谈HOPE当中的GUI底层逻辑实现/image-7.jpg)
![](/images/谈谈HOPE当中的GUI底层逻辑实现/image-8.jpg)
![](/images/谈谈HOPE当中的GUI底层逻辑实现/image-9.jpg)
![](/images/谈谈HOPE当中的GUI底层逻辑实现/image-10.jpg)

{% endgi %} -->

{% gi 4 2-2 %}

![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-7.jpg)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-8.jpg)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-9.jpg)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-10.jpg)

{% endgi %}

那时候就想一直无头苍蝇一样，目的性不明确，技术也不成熟，唯一拥有的就是满腔热血，不怕苦不怕累，做梦都在想着项目怎么优化，最后呢，也是很开心做出了目前这个比较稳定的硬件版本。

- 谈谈软件

硬件解决以后，噩梦才真正开始，对于一个数据结构菜鸟而言，如何设计一个优雅的单色GUI呢？所以这就是今天要着重要讲的主题：谈谈HOPE当中底层逻辑实现。

<p class="note note-info">当然，对于HOPE，包括代码和硬件设计都比较稚嫩，仅仅只做提供思路和参考的作用！仅以此博客，纪念这个有趣的项目hhh😁</p>

## 关于如何接触到GUI

第一次接触GUI的制作是接触到了UP主小蛋显璐的视频[OLED菜单动画教程](https://www.bilibili.com/video/BV1RY411f7GT/)。

教程中的这套GUI框架是基于`U8G2图像库`的，大致的实现方法是：

> 通过注册proc函数和对应的状态位到列表list当中，然后循环遍历list，比对当前状态位和list当中的状态位，若相同，则执行对应的proc函数。
> 
> proc函数中包括OLED动画显示、按钮响应等交互操作、菜单页面之间切换、过渡动画等逻辑操作，简单易学，虽然全部东西都挤在了一个文件对当中，非常的不优雅，也不易维护和移植。

但是呢，正是这套教程开启了我在GUI设计开发当中的不归路。

我第一个亲自构思并设计的项目「伪诗云」，便是第一次用上了该GUI框架，找个机会可以再聊聊这个项目。

<!-- ![伪诗云](/images/谈谈HOPE当中的GUI底层逻辑实现/image-12.jpg) -->

![伪诗云](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-12.jpg)

## 关于HugoUI的底层逻辑实现

目前HOPE当中使用的HugoUI是我从MonoUI追溯到创天蓝大佬的烙铁项目中的GUI框架修改而来的，目前采用**链表**的形式实现该GUI，底层依然基于`u8g2`。

HugoUI主要包括两个结构体：菜单页面`Page`和页面挂件`Item`。

- 菜单页面`Page`顾名思义，就是菜单的每一页都是一个Page，翻页时便会切换Page。
- 而该页面上的挂件`Item`就像是页面上的APP，负责实现特定的功能。

```c
/* Item的结构体 */
typedef struct HugoUI_item // 小挂件的结构体
{
    struct HugoUI_item *next;
    HugoUIItem_e funcType;  // 作用类型
    uint16_t itemId;        // 小挂件的id
    uint16_t lineId;        // 在每一页的id
    // float item_x, item_x_trg;
    // float item_y, item_y_trg;
    uint8_t *pic;
    // uint8_t step;
    char *title; // 小挂件的名字
    char *msg;   // ITEM_MESSAGE
    char *desc;
    bool *flag; // ITEM_CHECKBOX and ITEM_RADIO_BUTTON and ITEM_SWITCH //小挂件用于这些作用时的标志位
    // bool flagDefault; // Factory default setting // 恢复出厂设置
    paramType *param;                                                     // ITEM_CHANGE_VALUE and ITEM_PROGRESS_BAR //小挂件可改变的参数
    uint8_t inPage;                                                       // ITEM_JUMP_PAGE // Item在哪一页
    uint8_t JumpPage;                                                     // 将要跳转到哪一个page
    uint8_t JumpItem;                                                     // 将要跳转到哪一个Item
    void (*FuncCallBack)(void);                                           // 回调函数 // ITEM_CHANGE_VALUE and ITEM_PROGRESS_BAR // 该挂件的函数
    struct HugoUI_item *(*SetIconSrc)(const uint8_t *pic);                // 传入图片
    struct HugoUI_item *(*SetJumpId)(uint8_t pageId, uint8_t itemLineId); // 传入PageId和ItemLineId
    struct HugoUI_item *(*SetDescripition)(char *desc);                   // 传入descripition
    struct HugoUI_item *(*ReturnThisItem)(struct HugoUI_item *thisItem);  // 返回该item的指针
} HugoUIItem_t;
```

```c
/* Page的结构体 */
typedef struct HugoUI_page
{
    struct HugoUI_page *next;
    HugoUIPage_e funcType;
    HugoUIItem_t *itemHead, *itemTail;
    char *title; // 该页的名字
    uint8_t pageId;
    uint16_t itemMax; // 该page含有的item数
    float page_x, page_x_trg;
    float page_y, page_y_trg;
    float page_y_forlist, page_y_forlist_trg;

    void (*FuncCallBack)(void);
    struct HugoUI_page *(*SetPgaeFunCallBack)(void (*FuncCallBack)(void));

    void (*PageEventProc)(void);
    struct HugoUI_page *(*SetPgaeEventProc)(void (*PageEventProc)(void));

    void (*PageUIShow)(struct HugoUI_page *thispage, HugoUIItem_t *thisitem);
    struct HugoUI_page *(*SetPageUIShow)(void (*PgagUIShow)(struct HugoUI_page *thispage, HugoUIItem_t *thisitem));

    HugoUIItem_t *(*AddItem)(struct HugoUI_page *thisPage, char *title, HugoUIItem_e itemType, ...);
} HugoUIPage_t;
```

使用链表的形式编写GUI菜单框架的好处就是，Layout时非常的舒适优雅~

<!-- ![较为优雅舒适的UI-Layout](/images/谈谈HOPE当中的GUI底层逻辑实现/image-13.jpg) -->

![较为优雅舒适的UI-Layout](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/谈谈HOPE当中的GUI底层逻辑实现/image-13.jpg)


<p class="note note-warning">等待施工🙇‍♂️🙇‍♂️...</p>

## 后记

- 关联的仓库[请戳这里;P](https://github.com/ZhangKeLiang0627/HOPE)，您可以在该仓库中获取项目源码和PCB打样文件。
