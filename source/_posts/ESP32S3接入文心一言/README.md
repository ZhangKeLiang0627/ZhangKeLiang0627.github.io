---
title: ESP32S3接入文心一言
excerpt: kkl | 这其实是一个连续剧的第二集！
tags: [ESP32, 文心一言]
# index_img: /img/post/3.jpg
# banner_img: /img/post/7.jpg
categories: Study Page
comment: 'twikoo'
date: 2024-3-25 00:37:00
---

# ESP32S3接入文心一言

## Author: kkl

---

## 一、概述
使用ESP32S3接入文心一言，其实是为我后面的某个小项目做铺垫啦！这里记录一下实现的过程。

### 环境
- 主控：ESP32S3N16R8
- 平台：Arduino + PlatformIO + VScode

## 二、步骤
1. 在百度智能云的云千帆控制台并创建应用获取`API Key`和`Secret Key`
2. 根据创建应用生成的`API Key`和`Secret Key`来获取`access_token`
3. 在ESP32S3中发送POST请求API
## 三、实现

### 1. 在百度智能云的云千帆控制台并创建应用获取`API Key`和`Secret Key`

首先要使用云账号登录百度智能云，然后进入千帆大模型平台，创建一个新应用。**（注意：分清楚百度账号还是云账号，这两个不一样的）**

百度智能云千帆控制台：https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application

创建新应用：
<!-- ![](images/ESP32S3接入文心一言/image.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image.png)

<!-- ![](images/ESP32S3接入文心一言/image-1.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image-1.png)

创建好应用以后就可以得到`API Key`和`Secret Key`！
<!-- ![](images/ESP32S3接入文心一言/image-2.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image-2.png)

### 2. 根据创建应用生成的`API Key`和`Secret Key`来获取`access_token`

进入API代码调试界面：
<!-- ![](images/ESP32S3接入文心一言/image-3.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image-3.png)

<!-- ![](images/ESP32S3接入文心一言/image-4.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image-4.png)

<!-- ![](images/ESP32S3接入文心一言/image-5.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image-5.png)

应用列表选择自己创建的ESP32S3智能语音助手
<!-- ![](images/ESP32S3接入文心一言/image-6.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image-6.png)

获取`access_token`
<!-- ![](images/ESP32S3接入文心一言/image-7.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image-7.png)

指令格式：`"role":"user","content":"介绍一下名侦探柯南这部动画"`
<!-- ![](images/ESP32S3接入文心一言/image-8.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image-8.png)

调试结果如下：
<!-- ![](images/ESP32S3接入文心一言/image-9.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入文心一言/image-9.png)

### 3. 在ESP32S3中发送POST请求API

代码如下：

```cpp
String apiERNIEbotUrl = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=xxxxxxxxx"; // 把申请的access_token填上去
String inputText = "你好！";

/* 文心一言 */
String getGPTResponse(String inputText)
{
  HTTPClient http_client;

  http_client.begin(apiERNIEbotUrl);
  http_client.addHeader("Content-Type", "application/json");

  http_client.setTimeout(20000); // 20s的超时时间

  String payload = "{\"messages\":[{\"role\": \"user\",\"content\": \"" + inputText + "\"}],\"disable_search\": false,\"enable_citation\": false}";

  int httpResponseCode = http_client.POST(payload);

  if (httpResponseCode == HTTP_CODE_OK)
  {
    String response = http_client.getString();

    http_client.end();
    _LOG("\r\n%s\r\n", response.c_str());

    // Parse JSON response
    DynamicJsonDocument doc(2048);
    deserializeJson(doc, response);

    String outPutText = doc["result"];
    return outPutText;
  }
  else
  {
    _LOG("[HTTP] GET... failed, error: %s\n", http_client.errorToString(httpResponseCode).c_str());
    http_client.end();

    return "[HTTP] GET... failed, error!";
  }
}
```

## 四、总结
意外的顺利耶！Yapi😘

- 要注意的是，文心一言的API新用户第一个月可以获得一张20元的优惠券有效期1个月，1个月以后就要付费使用文心一言啦！
- access_token默认有效期30天，单位是秒，生产环境注意及时刷新。刷新了旧的也能用（只要不超时）

## 鸣谢
项目教程：https://blog.csdn.net/vor234/article/details/135372118