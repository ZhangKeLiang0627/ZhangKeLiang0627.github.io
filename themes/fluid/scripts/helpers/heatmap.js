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