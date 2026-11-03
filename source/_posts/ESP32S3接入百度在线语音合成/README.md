---
title: ESP32S3接入百度在线语音合成
excerpt: kkl | 这其实是一个连续剧的第三集！
tags: [ESP32, 语音合成, Speaker]
# index_img: /img/post/3.jpg
# banner_img: /img/post/7.jpg
categories: Study Page
comment: 'twikoo'
# hide: true
date: 2024-3-26 23:08:00
---

# ESP32S3接入百度在线语音合成

## Author: kkl

---

## 一、概述
使用ESP32S3接入百度在线语音合成，其实是为我后面的某个小项目做铺垫啦！这里记录一下实现的过程。

### 环境
- 主控：ESP32S3N16R8
- 平台：Arduino + PlatformIO + VScode

## 二、步骤

> 大部分内容都和语音识别那趴差不多，百度的语音识别和语音合成是共用同一个应用的，如果创建过了就直接使用相同的就行，密钥和token都是共用的，我就直接搬过来了，只有在POST的时候稍微有些区别，我也贴出了具体的代码和示例。

1. 在百度智能云控制端选择`语音技术`并创建应用获取`API Key`和`Secret Key`
2. 根据创建应用生成的`API Key`和`Secret Key`来获取`access_token`
3. 在ESP32S3中发送POST请求API


## 三、实现

### 1. 创建语音合成应用
登录百度智能云的云账号，选择语音识别，创建一个新应用。**（注意：分清楚百度账号还是云账号，这两个不一样的）**
百度智能云：https://login.bce.baidu.com/?redirect=https%3A%2F%2Fconsole.bce.baidu.com%2Fai%2F#/ai/speech/app/list

<!-- ![](images/ESP32S3接入百度在线语音合成/image.png) -->
<!-- ![](images/ESP32S3接入百度在线语音合成/image-1.png) -->
<!-- ![](images/ESP32S3接入百度在线语音合成/image-2.png) -->

![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入百度在线语音合成/image.png)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入百度在线语音合成/image-1.png)
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入百度在线语音合成/image-2.png)

### 2. 根据创建应用生成的API Key和Secret Key来获取access_token

创建好应用，在应用列表里会出现你刚刚创建的应用，当然`API Key`和`Secret Key`也有啦

<!-- ![](images/ESP32S3接入百度在线语音合成/image-3.png) -->

![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入百度在线语音合成/image-3.png)


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
- `access_token`对应的值就是可用的token，每次申请的`token`有效期限为30天，过期就需要重新申请。所以咱定时更新`access_token`就行，不用每次调用语音识别或合成都申请一遍。

### 3. 发送文本数据，通过POST请求发送到语音合成API上
下面是数据上传的格式说明：
<!-- ![](images/ESP32S3接入百度在线语音合成/image-4.png) -->
![](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/ESP32S3接入百度在线语音合成/image-4.png)

下面是ESP32S3的具体实现代码：

```cpp
char payload[8000] = {0};
/* 在线语音合成 */
void speechSynthesis(String inputText)
{
  HTTPClient http_client;

  _LOG("[Synthesis] Start Synthesis!\r\n");

  memset(payload, '\0', strlen(payload)); // 将数组清空

  strcat(payload, "tex="); // 合成的文本，UTF-8编码格式
  strcat(payload, inputText.c_str()); // 合成的文本，UTF-8编码格式
  strcat(payload, "&lan=zh"); // 语言选择，目前只有中英文混合模式，填写固定值zh
  strcat(payload, "&cuid=hugokkl"); // 识别码，随便几个字符，但最好唯一
  strcat(payload, "&ctp=1"); // 客户端类型选择，web端填写固定值1
  strcat(payload, "&spd=7"); // 语速，取值0-15，默认为5中语速
  strcat(payload, "&pit=5"); // 音调，取值0-15，默认为5中语调
  strcat(payload, "&vol=15"); // 音量，基础音库取值0-9，精品音库取值0-15，默认为5中音量
  strcat(payload, "&per=5118"); // 基础音库，度丫丫=4，精品音库，度小鹿=5118
  strcat(payload, "&aue=5"); // 3为mp3格式(默认)；4为pcm-16k；5为pcm-8k；6为wav（内容同pcm-16k）
  strcat(payload, "&tok=24.fc3481a177dfe90487fa0c3ce0892530.2592000.1713939400.282335-57684431"); // access_token

  http_client.begin("http://tsn.baidu.com/text2audio");

  http_client.setTimeout(5000); // 5s超时时间
  int httpResponseCode = http_client.POST(payload);

  if (httpResponseCode == HTTP_CODE_OK)
  {
    WiFiClient response;
    uint32_t streamLength = http_client.getSize();
    _LOG("streamSize:%d\r\n", streamLength);

    response = http_client.getStream();

    while (!response.available()) // 等待数据流可获取
    {
    }

    streamLength = min(streamLength, _samples * 2);

    response.readBytes((char *)_rawData, streamLength);

    Speaker.playRaw((int16_t *)_rawData, streamLength / 2, 8000);

    _LOG("[Synthesis] All done!\r\n");
  }
  else
  {
    _LOG("[HTTP] GET... failed, error: %s\n", http_client.errorToString(httpResponseCode).c_str());
  }
  http_client.end();

  _LOG("[Synthesis] Synthesis complete!\r\n");
}
```

## 四、总结

- access_token默认有效期30天，单位是秒，生产环境注意及时刷新。刷新了旧的也能用（只要不超时）

## 鸣谢
这次没看教程（主要是搞语音合成的教程比较少）。所以！感谢我自己辛勤的劳作😋