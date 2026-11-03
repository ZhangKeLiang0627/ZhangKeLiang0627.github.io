---
title: 关于Hexo's Fluid主题拓展的N种配置👾
excerpt: 前端麻瓜也能有出头的一天😁！
tags: [Hexo, Fluid]
# index_img: /img/post/13.jpg
# banner_img: /img/post/13.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/13.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/13.jpg
categories: Study Page
comment: 'twikoo'
date: 2024-7-31 12:35:00

---

### 关于Hexo's Fluid主题拓展的N种配置👾
### make your Hexo's theme more graceful!!!
### Author：@kkl

---

## 给Fluid主题添加MAC风格代码块

> 完整路径: `blog_root_path/themes/fluid/source/css`

- 首先，到`hexo-theme-fluid`主题根目录下`source/css`创建名为`macpanel.styl`的文件并往该文件当中写入以下内容：

```css
.highlight
    background: #21252b
    border-radius: 10px
    box-shadow: 0 0px 20px 0 rgba(0, 0, 0, .4)
    padding-top: 30px

    &::before
      background: #fc625d
      border-radius: 50%
      box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b
      content: ' '
      height: 12px
      left: 12px
      margin-top: -20px
      position: absolute
      width: 12px
```

- 到管理主题的`_config.fluid.yml`配置文件当中添加新建的`macpanel.styl`文件，如下：

```yml
custom_css:    
  - /css/macpanel
```

- 随后，重新`hexo g`后就可以看到效果啦。不过可能会出现MAC栏是黑色的，但是代码块背景是白色的情况（因为代码块风格默认为白色。此时如果你不满意，可以继续在`_config.fluid.yml`配置文件当中修改代码块风格，操作如下：

```yml
highlightjs:

  # style: "github gist"

  style: "github dark dimmed"
  style_dark: "dark"
```

其实呢，建议不需要修改这个默认的代码块背景颜色的风格，因为你选择使用夜间模式，画面就可以对的上了哈哈哈哈哈！

## 给Fluid主题添加首页图片缩放动画

<!-- ![首页图片缩放动画](images/关于Fluid主题拓展的N种配置/Wos2i6.gif) -->
![首页图片缩放动画](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/关于Fluid主题拓展的N种配置/Wos2i6.gif)

> 完整路径：`blog_root_path/themes/fluid/source/css`

- 在`blog_root_path/themes/fluid/source/css`中新建`indeximg-hover.css`，并往该文件内写入以下内容：

```css
.index-img {
  /* 动画时间 */
  transition: .4s;           
}
.index-card:hover .index-img {
  /* 放大倍数 */
  transform: scale(1.05);    
}
```

- 在Fluid主题配置文件`_config.fluid.yml`中添加自定义CSS，操作如下：

```yml
custom_css:
  - /css/indeximg-hover.css
```

## 给Fluid主题添加热力图

这里非常感谢博主邓布利多的冥想盆分享的[实现方法](https://pensieve.wangxindi.org/2024/06/18/2024-06-18-blogfurnish2/)👏👏👏!!!

### 实现过程

1. 将`heatmap.js`放入`fluid/scripts/helpers/`文件夹下。

2. 在`Markdown`当中添加以下两行代码即可进行调用：

```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
<div id="posts-chart"style="border-radius: 8px; height: 190px; padding: 10px;"></div>
```

{% fold info @完整的 heatmap.js 代码 %}
```js
const cheerio = require('cheerio')
const moment = require('moment')
const { stripHTML } = require('hexo-util');

hexo.extend.filter.register('after_render:html', function (locals) {
  const $ = cheerio.load(locals)
  const post = $('#posts-chart')
  const htmlEncode = false

  if (post.length > 0) {
    if (post.length > 0 && $('#postsChart').length === 0) {
      if (post.attr('data-encode') === 'true') htmlEncode = true
      post.after(postsChart())
    }

    if (htmlEncode) {
      return $.root().html().replace(/&amp;#/g, '&#')
    } else {
      return $.root().html()
    }
  } else {
    return locals
  }
}, 15)

function getWordCount(contentString){
  // post.origin is the original post content of hexo-blog-encrypt
  const content = stripHTML(String(contentString)).replace(/\r?\n|\r/g, '').replace(/\s+/g, '');
  const zhCount = (content.match(/[\u4E00-\u9FA5]/g) || []).length;
  const enCount = (content.replace(/[\u4E00-\u9FA5]/g, '').match(/[a-zA-Z0-9_\u0392-\u03c9\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|\w+/g) || []).length;
  var wordcount = zhCount + enCount
  return wordcount;
};

function postsChart () {
    const postArr = [];
    const dataArr = [];
    hexo.locals.get('posts').map(function (post) {
    postArr.push({ title: post.title,
                   date: post.date.format('YYYY-MM-DD'),
                   wordcount: (getWordCount(post.content)/1000).toFixed(2),
                   path: post.path })
    dataArr.push([post.date.format('YYYY-MM-DD'), getWordCount(post.content)/1000])
                })

    var dataCalendar = JSON.stringify(dataArr)
    var dataPosts = JSON.stringify(postArr)

  return `
  <script id="postsChart" type="text/javascript">
    var postsChart = echarts.init(document.getElementById('posts-chart'), document.documentElement.getAttribute('data-user-color-scheme'));
    window.onresize = function() {
      postsChart.resize();
      };
    let dataPosts = ${dataPosts}
    const dataMap = new Map(dataPosts.map((obj) => [obj.date, {title: obj.title, wordCount: obj.wordcount, path: obj.path}]));

    function heatmap_width(months){
        var startDate = new Date();
        var mill = startDate.setMonth((startDate.getMonth() - months));
        var endDate = +new Date();
        startDate = +new Date(mill);
        endDate = echarts.format.formatTime('yyyy-MM-dd', endDate);
        startDate = echarts.format.formatTime('yyyy-MM-dd', startDate);
        var showmonth = [];
        showmonth.push([
            startDate,
            endDate
        ]);
        return showmonth
    };

    function getRangeArr() {
        const windowWidth = window.innerWidth;
        if (windowWidth >= 600) {
          return heatmap_width(12);
        }
        else if (windowWidth >= 400) {
          return heatmap_width(9);
        }
        else {
          return heatmap_width(6);
        }
    }

    var postsOption = {
    title: {
        top: 0,
        left: 'center',
        text: '博客热力图'
    },
    tooltip: {
      formatter: function (p) {
        const post = dataMap.get(p.data[0]);
        return post.title + ' | ' + post.wordCount + ' 千字';
      }
    },
    visualMap: {
        min: 0,
        max: 10,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 30,
        inRange: {
          //  [floor color, ceiling color]
          color: ['#cde1ae', '#778f3d' ]
        },
        splitNumber: 4,
        text: ['千字', ''],
        showLabel: true,
        itemGap: 20,
    },
    calendar: {
        top: 80,
        left: 20,
        right: 4,
        cellSize: ['auto', 12],
        range: getRangeArr(),
        itemStyle: {
            color: '#F1F1F1',
            borderWidth: 2.5,
            borderColor: '#fff',
        },
        yearLabel: { show: false },
        // the splitline between months
        splitLine: {
          lineStyle: {
            color: "#000",
            width: 1,
            type: "solid",
          }
        }
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: ${dataCalendar}
    }
  };

    postsChart.setOption(postsOption);
    window.addEventListener('resize', () => {
      postsChart.resize();
    });
    postsChart.on('click', function(params) {
      const post = dataMap.get(params.data[0]);
      const link = window.location.origin + "/" + post.path;
      window.open(link, '_blank').focus();
});
    document.body.addEventListener('click', function(e) {
        if (document.documentElement.getAttribute('data-user-color-scheme')==='dark') {
            postsChart.dispose();
            postsChart = echarts.init(document.getElementById('posts-chart'), 'dark');
            postsChart.setOption(postsOption);
            postsChart.on('click', function(params) {
                  const post = dataMap.get(params.data[0]);
                  const link = window.location.origin + "/" + post.path;
                  window.open(link, '_blank').focus();
            });
        } else {
            postsChart.dispose();
            postsChart = echarts.init(document.getElementById('posts-chart'), 'light');
            postsChart.setOption(postsOption);
            postsChart.on('click', function(params) {
              const post = dataMap.get(params.data[0]);
              const link = window.location.origin + "/" + post.path;
              window.open(link, '_blank').focus();
        });
        }
    });
  </script>`
}
```
{% endfold %}

热力图效果展示如下：

<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
<div id="posts-chart"style="border-radius: 8px; height: 190px; padding: 10px;"></div>


{% note warning %}
在实践博主分享的方法时，遇到了以下问题：未找到`cheerio`，解决方法：`npm install cheerio`.
{% endnote %}

## 给Fluid主题更换自定义页脚(footer)

自定义页脚效果图如下：
![自定义页脚效果图](images/关于Fluid主题拓展的N种配置/image-0.png)

{% fold info @自定义页脚的代码段 %}
```html
<div class="text-center py-1">  
    <div class="img-circle rotate">  
        <img src="https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/sys/myimg.png" alt="Image">  
    </div>  
    <br>  
    <span># Carpe diem </span>  
    <p></p>  
</div>  

<span>Framework</span>  
<a href="https://hexo.io" target="_blank" rel="nofollow noopener">  
    <span>Hexo</span>  
</a>  
<i class="iconfont icon-switch-fill"></i>  
<a href="https://github.com/fluid-dev/hexo-theme-fluid" target="_blank" rel="nofollow noopener">  
    <span>fluid</span>  
</a>  

<div>  
    <span>Copyright © 2023-2024</span>  
    <a href="https://zhangkeliang0627.github.io/" target="_blank" rel="nofollow noopener">  
        <span>Hugo@kkl</span>  
    </a>  
</div>  

<style>  
    .img-circle {  
        display: block;  
        margin: 0 auto;  
        border-radius: 50%;  
        overflow: hidden;  
        width: 150px;  
        height: 150px;  
    }  

    .img-circle img {  
        display: block;  
        max-width: 100%;  
        height: auto;  
    }  

    .text-center {  
        text-align: center;  
    }  

    .py-1 {  
        padding-top: 1rem;  
        padding-bottom: 1rem;  
    }  

    .rotate {  
        transition: transform 0.8s;  
    }  

    .rotate:hover {  
        transform: rotate(360deg);  
    }  

    div {  
        line-height: 1.5;  
    }  
</style>
```
{% endfold %}

## 给Fluid主题添加 tabs 分栏容器

### Install

```shell
npm install hexo-tag-common
```
### Usage

Reference: [plugins-tabs | next](https://theme-next.js.org/docs/tag-plugins/tabs)

{% tabs first unique name %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}

{% fold info @还可以打出组合击！ %}

但是反过来组合却不行，略sad😥

{% tabs second unique name %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}

{% endfold %}

## 给Fluid主题添加音乐卡片

功能来自：https://github.com/metowolf/MetingJS

你只需要在你的markdown页面加入以下HTML代码即可添加音乐卡片，支持网易云音乐、QQ音乐等（当然有外链的都可以，更多功能戳上面的链接去看吧！

<!-- require APlayer -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<!-- require MetingJS -->
<script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>

<meting-js
	server="netease"
	type="playlist"
	id="60198">
</meting-js>

```html
<!-- require APlayer -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<!-- require MetingJS -->
<script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>

<meting-js
	server="netease"
	type="playlist"
	id="60198">
</meting-js>
```

<!-- require APlayer -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<!-- require MetingJS -->
<script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>

<meting-js
	server="netease"
	type="song"
	id="1806075545">
</meting-js>

```html
<!-- require APlayer -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css">
<script src="https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js"></script>
<!-- require MetingJS -->
<script src="https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js"></script>

<meting-js
	server="netease"
	type="song"
	id="1806075545">
</meting-js>
```


## 一些我常用到的Fluid特性（记性不好，这里再记一记📖✏️

### 折叠块

{% fold info @你确定要打开看看么？ %}
好吧，既然你看到这里，我祝你今天愉快🤗
{% endfold %}

使用折叠块，可以折叠代码、图片、文字等任何内容，你可以在 markdown 中按如下格式：

```md
{% fold info @title %}
需要折叠的一段内容，支持 markdown
{% endfold %}

example:

{% fold info @你确定要打开看看么？ %}
好吧，既然你看到这里，我祝你今天愉快🤗
{% endfold %}
```

### 组图

如果想把多张图片按一定布局组合显示，你可以在 markdown 中按如下格式：

```md
{% gi total n1-n2-... %}
  ![](url)
  ![](url)
  ![](url)
  ![](url)
  ![](url)
{% endgi %}
```

total：图片总数量，对应中间包含的图片 url 数量
n1-n2-...：每行的图片数量，可以省略，默认单行最多 3 张图，求和必须相等于 total，否则按默认样式

### 便签
在 markdown 中加入如下的代码来使用便签：

```md
{% note success %}
文字 或者 `markdown` 均可
{% endnote %}
```

或者使用 HTML 形式：

```html
<p class="note note-primary">标签</p>
```

可选便签：
{% note primary %}
primary
{% endnote %}

{% note secondary %}
secondary
{% endnote %}

{% note success %}
success
{% endnote %}

{% note danger %}
danger
{% endnote %}

{% note warning %}
warning
{% endnote %}

{% note info %}
info
{% endnote %}

{% note light %}
light
{% endnote %}

### 行内标签

在markdown中加入如下代码来使用Label：

```md
{% label primary @text %}
```

或者使用HTML形式：

```html
<span class="label label-primary">Label</span>
```

以下是可选Label：
{% label primary @primary %} {% label default @default %} {% label info @info %} {% label success @success %} {% label warning @warning %} {% label danger @danger %}

### 图片脚注

终于找到可以在markdown里写html注入图片可以添加脚注的方法啦，因为markdown注入图片的写法有时候不能改变图片的大小比例，这就非常令人抓狂。

```html
<figure>
<img src=[img_source] width="50%"/>
<figcaption>[Your awesome caption]</figcaption>
</figure>
```

## 后记

- 如果某些配置没有成功，可以尝试先`hexo clean`，再`hexo g && hexo d`，因为我有遇到过修改nav-bg-color失败的经历，就是没有`hexo clean`，捣鼓了半天...

- 前端麻瓜也能有出头的一天😁！