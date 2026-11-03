---
title: 在Lvgl中添加自定义字体和图片
excerpt: kkl | 搞Lvgl的都赚不了几个钱的啦！
tags: [Lvgl]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/16.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/16.jpg
categories: Study Page
comment: 'twikoo'
# hide: true
date: 2024-3-21 22:09:00
---

# 在Lvgl中添加自定义字体和图片
### Author: @kkl

---

## 写在前面

仅仅**保证**对于`X-TRACK`项目的自定义字体和图片的有效使用哦！

---

## Font convert - 字体格式转换成.c文件

### 生成

首先我们要访问到Lvgl官方网站上的**Online Font Converter**.

网址：https://lvgl.io/tools/fontconverter


然后我们会看到以下页面！
<!-- ![](images/Lvgl添加自定义字体和图片/image.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/Lvgl添加自定义字体和图片/image.png)

> 1. Name

填写.c文件的名字，如`font_smliey_36`，36表示字号大小，这样就清晰明了！

> 2. Size

填写字号大小，刚刚我们名字写了`font_smliey_36`，字号是36，那我们这里就填写36px的字号大小，统一格式规范。

> 3. Bpp(bit-per-piel)

填写Bpp为4，这个值会让字体看起来更顺滑而且占据的内存空间相对不大（填别的也行，自己尝试对比一下

> 4. Fallback

这里填写和Name一样的`font_smliey_36`就行啦！

> 5. 三个选项框都不要勾选！

不然生成的字体在`X-TRACK`没法用！

> 6. TTF/WOFF file

在这里选择我们准备好的字体文件，推荐用`ttf`格式。

> 7. Range

这里是设置范围来选择你的.c文件需要包含哪些文字（Symbols），我们不用这个，这里空着，我们直接在下面的Symbols栏里面写我们需要的字。

> 8. Symbols

在这里我们填入希望在Lvgl里使用的文字，比方说我想要在Lvgl里显示`鸡你太美`，那我就需要在这个栏里填入`鸡你太美`。

> 9. 点击红色的Convert按钮等待.c文件的渲染和下载即可！

### 修改

首先打开刚刚生成的.c文件，如`font_smiley_36.c`

1. 找到注释`KERNING`和注释`ALL CUSTOM DATA`之间的一大串，注释掉或者删掉！

```c
// 里面注释掉或者删掉！
/*-----------------
 *    KERNING
 *----------------*/


/*Map glyph_ids to kern left classes*/
static const uint8_t kern_left_class_mapping[] =
{
    0, 0, 1, 2, 3, 4, 5, 6,
    7
};

/*Map glyph_ids to kern right classes*/
static const uint8_t kern_right_class_mapping[] =
{
    0, 0, 1, 2, 1, 3, 4, 5,
    6
};

/*Kern values between classes*/
static const int8_t kern_class_values[] =
{
    0, -6, 0, 0, 0, 0, 0, 0,
    0, 0, 0, -12, 0, 0, -6, -12,
    0, 0, -6, -12, 0, -12, -6, -17,
    0, 0, 0, 0, -6, -6, -6, 0,
    0, -6, -6, -6, -6, 0, 0, -6,
    -12, 0
};


/*Collect the kern class' data in one place*/
static const lv_font_fmt_txt_kern_classes_t kern_classes =
{
    .class_pair_values   = kern_class_values,
    .left_class_mapping  = kern_left_class_mapping,
    .right_class_mapping = kern_right_class_mapping,
    .left_class_cnt      = 7,
    .right_class_cnt     = 6,
};

/*--------------------
 *  ALL CUSTOM DATA
 *--------------------*/
```

2. 将注释`ALL CUSTOM DATA`和注释`PUBLIC FONT`之间的一大坨，用以下代码替换掉！

```c
// 用它们替换掉原来的一大坨！
/*--------------------
 *  ALL CUSTOM DATA
 *--------------------*/

#if LV_VERSION_CHECK(8, 0, 0)
/*Store all the custom data of the font*/
static  lv_font_fmt_txt_glyph_cache_t cache;
static const lv_font_fmt_txt_dsc_t font_dsc = {
#else
static lv_font_fmt_txt_dsc_t font_dsc = {
#endif
    .glyph_bitmap = glyph_bitmap,
    .glyph_dsc = glyph_dsc,
    .cmaps = cmaps,
    .kern_dsc = NULL,
    .kern_scale = 0,
    .cmap_num = 1,
    .bpp = 4,
    .kern_classes = 0,
    .bitmap_format = 0,
#if LV_VERSION_CHECK(8, 0, 0)
    .cache = &cache
#endif
};

/*-----------------
 *  PUBLIC FONT
 *----------------*/

```

3. 最后，删除注释`PUBLIC FONT`下的`.fallback`和`.user_data`

```c
// 删除以下两条！
/*-----------------
 *  PUBLIC FONT
 *----------------*/

    // ...

    .fallback = &font_smiley_36,
    .user_data = NULL,
```

4. 最后拿去Lvgl仿真或者MCU跑一下，基本上没有问题啦！

## Pictures convert - 图片格式转换成.c文件

> LVGL官方在线图片转换器(LVGL Online Image Converter): https://lvgl.io/tools/imageconverter

这里主要讲解使用代码中的变量（存储着像素值的C数组）进行图像显示。

首先，我们打开LVGL官方在线图片转换器，可以看到以下最新（截止2024.12.26）的应用界面：

<!-- ![](images/Lvgl添加自定义字体和图片/image-1.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/Lvgl添加自定义字体和图片/image-1.png)


> 1. Select image file(s)：选择图片文件，可批量选择，记得修改文件名，因为稍后生成的c文件是和图片文件同名的

> 2. Color format：设置颜色格式

<!-- ![](images/Lvgl添加自定义字体和图片/image-2.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/Lvgl添加自定义字体和图片/image-2.png)


- 一般的彩色图片，选择`CF_TRUE_COLOR_ALPHA`
- 如果想要省空间，图片想要显示成纯白色的，可以选择`CF_INDEXED_X_BIT`，`X`越大图片内存越大也越清晰，`X`越小图片内存越小锯齿越明显
- 如果想要省空间，图片想要显示成纯黑色的，可以选择`CF_ALPHA_X_BIT`，`X`越大图片内存越大也越清晰，`X`越小图片内存越小锯齿越明显

> 3. Output format：可以选择输出的文件格式，C数组或者bin文件（bin文件需要配合LVGL的文件系统使用），这里选择C数组（C array）即可

> 4. Dither images (can improve quality)：加入图像抖动算法，可以提升图像最终质量（这里不打勾）

> 5. Output in big-endian format：以`big-endian`格式输出（这里不打勾）

全部选择好了之后就可以点击`Convert`即可！

## 写在后面

- 鸣谢：https://blog.csdn.net/weixin_45677295/article/details/137949968


