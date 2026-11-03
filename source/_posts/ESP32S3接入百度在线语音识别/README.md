---
title: ESP32S3接入百度在线语音识别
excerpt: kkl | 这其实是一个连续剧的第一集！
tags: [ESP32, 语音识别, Mic]
# index_img: /img/post/3.jpg
# banner_img: /img/post/7.jpg
categories: Study Page
comment: 'twikoo'
date: 2024-3-24 20:05:00
---

# ESP32S3接入百度在线语音识别

## Author: kkl

---

## 一、概述
使用ESP32S3接入百度智能云实现在线语音识别，记录中间遇到的问题和实现流程。

### 环境
- 主控：ESP32S3N16R8
- 平台：Arduino + PlatformIO + VScode

## 二、步骤
1. 在百度智能云控制端选择`语音识别`并创建应用获取`API Key`和`Secret Key`
2. 根据创建应用生成的`API Key`和`Secret Key`来获取`access_token`
3. 采集音频数据，打包数据，通过http协议将打包的数据（payload）POST请求发送语音识别的API上
4. 接收返回的数据（response）

## 三、实现

### 1. 创建语音识别应用
登录百度智能云的云账号，选择语音识别，创建一个新应用。**（注意：分清楚百度账号还是云账号，这两个不一样的）**
百度智能云：https://login.bce.baidu.com/?redirect=https%3A%2F%2Fconsole.bce.baidu.com%2Fai%2F#/ai/speech/app/list

<!-- ![](images/ESP32S3接入百度在线语音识别/image.png) -->
<!-- ![](images/ESP32S3接入百度在线语音识别/image-1.png) -->
<!-- ![](images/ESP32S3接入百度在线语音识别/image-2.png) -->

![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入百度在线语音识别/image.png)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入百度在线语音识别/image-1.png)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入百度在线语音识别/image-2.png)

### 2. 根据创建应用生成的API Key和Secret Key来获取access_token

创建好应用，在应用列表里会出现你刚刚创建的应用，当然`API Key`和`Secret Key`也有啦

<!-- ![](images/ESP32S3接入百度在线语音识别/image-3.png) -->

![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入百度在线语音识别/image-3.png)


有了`API Key`和`Secret Key`，下面我们可以在ESP32S3上进行GET请求得到access_token的代码！

```cpp
/* 获取token */
void gainToken(void)   
{
    HTTPClient http_client; // #include <HTTPClient.h>
    //注意，要把下面网址中的your_apikey和your_secretkey替换成自己的API Key和Secret Key
    http_client.begin("https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=your_apikey&client_secret=your_secretkey");
    int httpResponseCode = http_client.GET();

    if(httpResponseCode == HTTP_CODE_OK)
    {
        String response = http_client.getString();
        Serial.println(response);
    }
    else
    {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http_client.errorToString(httpResponseCode).c_str());
    }
    http_client.end();
}
```

请求成功会返回如下数据，我们主要关注`access_token`：
```json
{
  "refresh_token": "25.b55fe1d287227ca97aab219bb249b8ab.315360000.1798284651.282335-8574074",
  "expires_in": 2592000,
  "scope": "public wise_adapt",
  "session_key": "9mzdDZXu3dENdFZQurfg0Vz8slgSgvvOAUebNFzyzcpQ5EnbxbF+hfG9DQkpUVQdh4p6HbQcAiz5RmuBAja1JJGgIdJI",
  "access_token": "24.6c5e1ff107f0e8bcef8c46d3424a0e78.2592000.1485516651.282335-8574074",
  "session_secret": "dfac94a3489fe9fca7c3221cbf7525ff"
}
```
- `access_token`对应的值就是可用的token，每次申请的`token`有效期限为30天，过期就需要重新申请。所以咱定时更新`access_token`就行，不用每次调用语音识别都申请一遍。

### 3. 采集数据，通过POST请求发送到语音识别API上
数据上传POST的方式有两种：JSON格式和RAW格式。这里我们使用JSON格式，下图为JSON格式上传的一些必要的参数说明：

| 字段名 | 类型 | 可需 | 描述 |
| :-: | :-: | :-: | :- |
| format | String | 必填 | 语音文件的格式，pcm/wav/amr/m4a。不区分大小写。推荐pcm文件！ |
| rate | int | 必填 | 采样率，16000、8000，固定值 |
| channel | int | 必填 | 声道数，仅支持单声道，请填固定值1 |
| cuid | String | 必填 | 用户唯一标识，用来区分用户，计算UV值。建议填写能区分用户的机器MAC地址或IMEI码，长度为60字符以内。 |
| token | String | 必填 | 开放平台获取到的开发者[access_token] |
| dev_pid | int | 选填 | 不填写lan参数生效，都不填写就默认1537（普通话，输入法模型） |
| lm_id | int |  选填  | 自训练平台模型id，填dev_id = 8001 或 8002 生效 |
| lan | String | 选填，废弃参数 | 历史兼容参数，已不再使用 |
| speech | String | 必填 | 本地语音文件的二进制语音数据，需要进行 base64 编码，与len参数一起使用 |
| len | int | 必填 | 本地语音文件的字节数，单位是字节（byte） |

图中对数据类型和内容说的很明确了，只需要按照这个格式打包好数据然后发送就行，下面是ESP32S3的具体实现代码。

```cpp
char payload[160000];

/* 在线语音识别 */
String speechRecognition(void)
{
  HTTPClient http_client; // #include <HTTPClient.h>

  _LOG("[Recognition] Start recognition!\r\n");

  result = Mic.record(_rawData, _samples); // 录制声音
  _LOG("[Mic] record:%s\r\n", (result == true ? "true" : "false"));
  while (Mic.isRecording()); // 当录制完成时
  _LOG("[Mic] record is done!\r\n");

  memset(payload, '\0', strlen(payload)); // 将数组清空
  strcat(payload, "{");
  strcat(payload, "\"format\":\"pcm\",");
  strcat(payload, "\"rate\":16000,"); // 采样率，如果采样率改变了，记得修改该值，只有16000、8000两个固定采样率
  strcat(payload, "\"dev_pid\":1537,"); // 中文普通话
  strcat(payload, "\"channel\":1,"); // 单声道
  strcat(payload, "\"cuid\":\"hugozkl\","); // 识别码，随便打几个字符，但最好唯一
  strcat(payload, "\"token\":\"24.ba06cf95edb0b0aee7bfb016209e5948.2592000.1713715897.282335-57684431\","); // token，这里需要修改成自己申请到的token
  strcat(payload, "\"len\":65536,"); // 数据长度，如果传输的数据长度改变了，记得修改该值，该值是ADC采集的数据字节数，不是base64编码后的长度
  strcat(payload, "\"speech\":\"");
  strcat(payload, base64::encode((uint8_t *)_rawData, 65536).c_str()); // base64编码数据 // #include "base64.h"
  strcat(payload, "\"");
  strcat(payload, "}");

  // HTTP POST
  int httpResponseCode;
  http_client.begin("http://vop.baidu.com/server_api");
  http_client.addHeader("Content-Type", "application/json");
  http_client.setTimeout(5000); // 5s超时时间
  httpResponseCode = http_client.POST(payload);

  if (httpResponseCode == HTTP_CODE_OK)
  {
    String response = http_client.getString();

    http_client.end();
    _LOG("\r\n%s\r\n", response.c_str());

    // Parse JSON response
    DynamicJsonDocument doc(2048); // #include <ArduinoJson.h>
    deserializeJson(doc, response);

    String outPutText = doc["result"];
    // 去掉首尾的[""]
    outPutText = outPutText.substring(2);
    outPutText = outPutText.substring(0, outPutText.length() - 2);
    return outPutText;
  }
  else
  {
    _LOG("[HTTP] GET... failed, error: %s\n", http_client.errorToString(httpResponseCode).c_str());
    http_client.end();
    return "<error>";
  }
}
```

POST发送数据有一个固定头部：`Content-Type:application/json`，POST前需要设置一下，代码中已经有展示。

### 4. 接收数据

在上一步代码中实现了接收数据，这里列一下返回的数据：

```json
{"corpus_no":"7349831540333925029","err_msg":"success.","err_no":0,"result":["你好，你是谁？"],"sn":"593363272001711266008"}

{"corpus_no":"7349831596084473860","err_msg":"success.","err_no":0,"result":["现在多少点？"],"sn":"671001951581711266021"}

{"corpus_no":"7349831639168589351","err_msg":"success.","err_no":0,"result":["深圳天气如何？"],"sn":"13152229661711266031"}
```

- 数据发送成功则会返回正确的识别数据，当然声音信号不好时返回的语音识别也会不准确。
- 谨记，返回的语音识别结果是`UTF-8`方式编码，所以代码的编码最好也改为`UTF-8`编码格式。

## 四、总结
- 百度智能云的语音识别服务是可以免费领取到一定使用次数的，15万次，足够我们测试使用，记得开始测试前先领取一下，不然会出现返回`报错：{'err_msg': 'request pv too much', 'err_no': 3305, 'sn': '876137091191590632079'
}`，报错原因多半是免费次数没领取或者用完了要开通付费功能。

## 鸣谢
项目教程：https://blog.csdn.net/wojueburenshu/article/details/119244390