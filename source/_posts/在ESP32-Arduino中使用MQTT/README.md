---
title: 在ESP32-Arduino中使用MQTT
excerpt: 不会MQTT？不学？offer都没你份呐🤷‍♀️🤷‍♀️🤷‍♀️！
tags: [ESP32, Arduino, MQTT]
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/MQTT2.jpeg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/MQTT1.jpeg
categories: Study Page
comment: 'twikoo'
date: 2024-7-20 16:17:00

---

### 在ESP32-Arduino中使用MQTT
### The Usage of the MQTT protocol in ESP32-Arduino
### Author：@kkl

---

## MQTT协议概述

### 基本概念

> **MQTT的特点：**

- 开放消息协议，简单易实现
- 轻量级、占用带宽低（1字节固定报头，2字节心跳报文，最小化传输开销和协议交换，有效减少网络流量
- 发布/订阅模式，一对多消息发布，解除应用程序耦合
- 基于TCP/IP网络连接，提供有序，无损，双向连接
- 消息QoS（Quality of Service）支持，可靠传输保证（0-至多发一次、1-最少发一次、2-保证收一次）
- 可传输任意类型的数据
- 收发消息都是异步的，发送方不需要等待接收方应答

总的来说，MQTT（Message Queuing Telemetry Transport）是一种**轻量级、基于发布-订阅模式的消息传输协议**，**适用于资源受限的设备和低带宽、高延迟或不稳定的网络环境**。它在物联网应用中广受欢迎，能够实现传感器、执行器和其它设备之间的高效通信。

### 工作原理

#### 发布/订阅模式

相信这个`发布/订阅`的概念对于互联网大航海时代的我们来说应该都不陌生了。

玩过社交平台（如：公众号、微博、Bilibil、抖音等）的同学都知道，你想要接收某位博主的的推送，你首先要关注这位博主才可以，这就是**订阅**。

如果在某个时间点这个博主更新了新消息，社交平台就会将订阅的消息自动推送到你的设备当中，这就可以类比成**发布**。

而社交平台在这当中就是充当Broker的作用。

当然，你们之间的订阅和发布也不是单方面的，你们也可以互相订阅，互相发布！而这就是发布/订阅模式。

当你需要某个话题(Topic)的数据时，你就可以去订阅这个话题获取消息。同时你自身也可以成为话题的发布者，发布消息。

#### MQTT客户端(MQTT Client)

任何运行MQTT客户端库的应用或设备都是MQTT客户端。例如，使用MQTT的即时通讯应用是客户端，使用MQTT上报数据的各种传感器是客户端，各种MQTT测试工具也是客户端。

我们以社交平台为例，可以把每一位用户都看做是一个客户端(Client)，用户彼此之间可以互相订阅。

#### MQTT代理(MQTT Broker)

MQTT Broker是负责处理客户端请求的关键组件，包括建立连接、断开连接、订阅和取消订阅等操作，同时还负责消息的转发。一个高效强大的MQTT Broker能够轻松应对海量连接和百万级消息吞吐量，从而帮助物联网服务提供商专注于业务发展，快速构建可靠的MQTT应用。

可以把Broker类比成社交平台，例如：你发布消息到微博上，微博这个社交平台就作为中转站把你的消息转发给已经订阅了你的用户。

### 报文内容（请求连接与确认）

下面，我会简明扼要地解释MQTT连接时的报文的每一个参数的含义与作用：

#### CONNECT - 连接服务端

下图是CONNECT报文所包含的信息内容：
<!-- ![CONNECT数据包报文内容](images/在ESP32-Arduino中使用MQTT/image.png) -->

![CONNECT数据包报文内容](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在ESP32-Arduino中使用MQTT/image.png)

- **clientId（客户端ID）**

ClientId是MQTT客户端的标识。MQTT服务端用该标识来识别客户端。因此ClientId必须是**独立的、独有的**。通常ClientId是**由一串字符所构成的**。

 <p class="note note-warning">注：如果两个MQTT客户端使用相同ClientId标识，服务端会把它们当成同一个客户端来处理。</p>

- **cleanSession（清除会话）**

cleanSession设置为`true`时，MQTT Broker（服务器端）不会记忆以及缓存任何报文信息，实时转发报文后即刻清除会话。

cleanSession设置为`false`时，MQTT Broker（服务器端）会记忆保存那些没有得到客户端接收确认的信息。


 <p class="note note-warning">注：如果需要服务端保存重要报文，光设置cleanSession为false是不够的，还需要传递的MQTT信息QoS级别大于0！</p>

- **keepAlive（心跳时间间隔）**

keepAlive用于服务端实时了解客户端是否与其保持连接的情况。

例如：keepAlive设置为60，即为客户端与服务器端约定：每60秒客户端必须要向服务器端发送一次心跳(PINGREQ)。

心跳可以是需要传输的数据，如果60秒内客户端都处于空闲状态没有发送数据，则会自动发送一个心跳数据包，证明自己还在线。

 <p class="note note-warning">另外，在实际运行中，如果服务端没有在1.5倍心跳时间间隔内收到客户端发布消息(PUBLISH)或发来心跳请求(PINGREQ)，那么服务端就会认为这个客户端已经掉线。</p>

- **lastWill（遗嘱）**

 <p class="note note-success">客户端确认意外掉线时，服务器端会根据客户端发送的CONNECT数据包中的遗嘱设置，往遗嘱主题中发送遗嘱消息。</p>

> - **lastWillTopic（遗嘱主题）**
> - **lastWillMessage（遗嘱消息）**
> - **lastWillQos（遗嘱QoS）**
> - **lastWillRetain（遗嘱保留）**：
> 遗嘱消息也可以设置为保留消息。

- **客户端用户密码认证**
  
 <p class="note note-success">有些服务端开启了客户端用户密码认证，这种服务端需要客户端在连接时正确提供认证信息才能连接。<br>当然，那些没有开启用户密码认证的服务端无需客户端提供用户名和密码认证信息。</p>

> - **username（用户名）**
> - **password（用户密码）**

#### CONNACK – 确认连接请求

下图是CONNACK报文所包含的信息内容：
<!-- ![CONNACK数据包报文内容](images/在ESP32-Arduino中使用MQTT/image-1.png) -->

![CONNACK数据包报文内容](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在ESP32-Arduino中使用MQTT/image-1.png)


- **sessionPresent（当前会话）**

sessionPresent返回为`true`时，说明MQTT Broker（服务器端）记忆了未被确认的会话信息。

sessionPresent返回为`false`时，MQTT Broker（服务器端）不会记忆以及缓存任何报文信息，实时转发报文后即刻清除会话。

- **returnCode（连接返回码）**

| **返回码** | **返回码描述** | 
| :-: | :- |
| 0 | 成功连接 |
| 1 | 连接被服务端拒绝，原因是**不支持客户端的MQTT协议版本**。 |
| 2 | 连接被服务端拒绝，原因是**不支持客户端标识符的编码**。 |
| 3 | 连接被服务端拒绝，原因是**服务端不可用**。 |
| 4 | 连接被服务端拒绝，原因是**用户名或密码无效**。 |
| 5 | 连接被服务端拒绝，原因是**客户端未被授权连接到此服务端**。 |

### 报文内容（发布、订阅和取消订阅）

#### PUBLISH – 发布消息
MQTT客户端发布消息时，会向服务端发送PUBLISH报文。以下是PUBLISH报文的详细信息：
<!-- ![PUBLISH数据包报文内容](images/在ESP32-Arduino中使用MQTT/image-3.png) -->

![PUBLISH数据包报文内容](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在ESP32-Arduino中使用MQTT/image-3.png)

> - **topicName（主题名）**：
> 主题名用于识别此信息应发布到哪一个主题。例如：`topic/1`
> - **QoS（服务质量等级）**：
> QoS有三个级别：0、1和2。QoS决定MQTT通讯有什么样的服务保证。
> - **packetId（报文标识符）**：
> 报文标识符可用于对MQTT报文进行标识。如果QoS等于0，报文标识符为0；只有QoS级别大于0时，报文标识符才是非零数值。
> - **retainFlag（保留标志）**：
> 为`false`时客户端订阅了某一主题后，并不会马上接收到该主题的信息。为`true`时，客户端在订阅了某一主题后，马上接收到一条该主题的保留信息。
> - **Payload（有效载荷）**：
> 有效載荷是我们希望通过MQTT所发送的实际内容。我们可以使用MQTT协议发送文本，图像等格式的内容。
> - **dupFlag（重发标志）**：
> 当MQTT报文的接收方没有及时确认收到报文时，发送方会重复发送MQTT报文。在重复发送MQTT报文时，发送方会将此“重发标志”设置为true。请注意，重发标志只在QoS级别大于0时使用。


#### SUBSCRIBE – 订阅主题
客户端要想订阅主题，首先要向服务端发送主题订阅请求。客户端是通过向服务端发送SUBSCRIBE报文来实现这一请求的。

> - **topicName（主题名）**
> - **QoS（服务质量等级）**
> - **packetId（报文标识符）**

#### SUBACK – 订阅确认
服务端接收到客户端的订阅报文后，会向客户端发送SUBACK报文确认订阅。

SUBACK报文包含有“订阅返回码”和“报文标识符”这两个信息。

- **returnCode（订阅返回码）**

客户端向服务端发送订阅请求后，服务端会给客户端返回一个订阅返回码。

这个返回码的作用是告知客户端是否成功订阅了主题。以下是返回码的详细说明：
| **返回码** | **返回码描述** | 
| :-: | :- |
| 0 | 订阅成功 – QoS 0 |
| 1 | 订阅成功- QoS 1 |
| 2 | 订阅成功- QoS 2 |
| 3 | 订阅失败 |

#### UNSUBSCRIBE – 取消订阅
顾名思义，当客户端要取消订阅某主题时，可通过向服务端发送UNSUBSCRIBE – 取消订阅报文来实现。
<!-- ![PUBLISH数据包报文内容](images/在ESP32-Arduino中使用MQTT/image-4.png) -->

![PUBLISH数据包报文内容](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在ESP32-Arduino中使用MQTT/image-4.png)

报文内容详细的解读和理解可能会导致本篇文章的篇幅过长，这里指路太极创客关于MQTT报文内容的详细介绍：[戳我看:D](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-tuttorial/mqtt-tutorial/)


## 准备

### 本地环境

> PC端：Windows11
> 主控：ESP32S3-R8（常见的模组和开发板都可以）
> 框架：Arduino

> MQTT库：PubSubClient
> 作者名：Nick O’Leary
> 官网地址：https://pubsubclient.knolleary.net/
> GitHub：https://github.com/knolleary/pubsubclient/


### 软件安装

在PC端安装相关的软件可以更加方便测试单片机的程序运行情况，因此我们需要安装一个MQTT协议软件，方便我们扮演发布端/订阅端，来接收或者发布消息。这里推荐下载`MQTT.fx`！

- 可以前往 MQTT.fx 的[官网](http://www.mqttfx.org/)进行下载。
- 或者前往 太极创客 官网的下载页面进行下载[戳这里:P](http://www.taichi-maker.com/homepage/download/#mqtt)（阿里嘎多太极创客！

- **注：**最新版本的`MQTT.fx`可能需要收费，学生党可以使用`MQTT.fx 1.7.1`版本，免费但是功能稍有阉割。

- 附：公用MQTT服务器列表（2024/7/21

<!-- ![热门的公用MQTT服务器列表](images/在ESP32-Arduino中使用MQTT/image-2.png) -->

![热门的公用MQTT服务器列表](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在ESP32-Arduino中使用MQTT/image-2.png)

## 实践

### 发布话题&传输字符串

```c++
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <Ticker.h>

const char *id = "HUGO";    // WIFI名称
const char *pswd = "xxxxxxxx"; // WIFI密码

// broker-cn.emqx.io
const char *mqttServer = "broker-cn.emqx.io";

// Ticker的计数变量
int count;

Ticker ticker;
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void connectMQTTServer()
{
  // 根据ESP32的MAC地址生成客户端ID（避免与其它ESP32的客户端ID重名）
  String clientId = "esp32s3-" + WiFi.macAddress();

  // 连接MQTT服务器
  if (mqttClient.connect(clientId.c_str()))
  {
    printf("MQTT Server Connected.");
    printf("Server Address: ");
    printf(mqttServer);
    printf("ClientId:");
    printf("%s\n", clientId.c_str());
  }
  else
  {
    Serial.print("MQTT Server Connect Failed. Client State:");
    printf("%d\n", mqttClient.state());
    delay(3000);
  }
}

// 发布信息
void pubMQTTmsg()
{
  static int value; // 客户端发布信息用数字

  // 建立发布主题。主题名称以Taichi-Maker-为前缀，后面添加设备的MAC地址。
  // 这么做是为确保不同用户进行MQTT信息发布时，ESP8266客户端名称各不相同，
  String topicString = "Taichi-Maker-Pub-" + WiFi.macAddress();
  char publishTopic[topicString.length() + 1];
  strcpy(publishTopic, topicString.c_str());

  // 建立发布信息。信息内容以Hello World为起始，后面添加发布次数。
  String messageString = "Hello World " + String(value++);
  char publishMsg[messageString.length() + 1];
  strcpy(publishMsg, messageString.c_str());

  // 实现ESP8266向主题发布信息
  if (mqttClient.publish(publishTopic, publishMsg))
  {
    printf("Publish Topic: %s\n", publishTopic);
    // printf(publishTopic);
    printf("Publish message: %s\n", publishMsg);
    // printf(publishMsg);
  }
  else
  {
    printf("Message Publish Failed.\n");
  }
}

void setup()
{
  // 初始化串口
  Serial.begin(115200);
  // 初始化WIFI
  WiFi.begin(id, pswd);
  // 判断wifi是否连接成功
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    printf("正在连接...\n");
  }
  printf("连接成功！\n");
  printf("IP address: %s\n", WiFi.localIP().toString().c_str()); // 打印本地IP地址
  printf("dns: %s\n", WiFi.dnsIP().toString().c_str());          // 打印dns地址

  // 设置MQTT服务器和端口号
  mqttClient.setServer(mqttServer, 1883);

  // 连接MQTT服务器
  connectMQTTServer();

  // Ticker定时对象
  ticker.attach(1, []()
                { count++; });
}

void loop()
{
  // 判断开发板是否成功连接服务器
  if (mqttClient.connected())
  {
    // 每隔三秒发布一次信息
    if (count >= 3)
    {
      pubMQTTmsg();
      count = 0;
    }

    // 保持客户端心跳
    mqttClient.loop();
    // printf("Okk\n");
  }
  else
  {
    // 重新尝试连接服务器
    connectMQTTServer();
    printf("Err\n");
  }
}
```

### 订阅单个话题

```c++
#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

const char *id = "MagicEyes";    // WIFI名称
const char *pswd = "Zkl2002627"; // WIFI密码

// broker-cn.emqx.io
const char *mqttServer = "broker-cn.emqx.io";

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

// 订阅指定主题
void subscribeTopic()
{
  // 建立订阅主题。主题名称以Taichi-Maker-Sub为前缀，后面添加设备的MAC地址。
  // 这么做是为确保不同设备使用同一个MQTT服务器测试消息订阅时，所订阅的主题名称不同
  String topicString = "Taichi-Maker-Sub-" + WiFi.macAddress();
  char subTopic[topicString.length() + 1];
  strcpy(subTopic, topicString.c_str());

  // 通过串口监视器输出是否成功订阅主题以及订阅的主题名称
  if (mqttClient.subscribe(subTopic))
  {
    printf("Subscrib Topic: %s\n", subTopic);
  }
  else
  {
    printf("Subscribe Fail...\n");
  }
}

void connectMQTTServer()
{
  // 根据ESP32的MAC地址生成客户端ID（避免与其它ESP32的客户端ID重名）
  String clientId = "esp32s3-" + WiFi.macAddress();

  // 连接MQTT服务器
  if (mqttClient.connect(clientId.c_str()))
  {
    printf("MQTT Server Connected.");
    printf("Server Address: ");
    printf(mqttServer);
    printf("ClientId:");
    printf("%s\n", clientId.c_str());
    subscribeTopic(); // 订阅指定主题
  }
  else
  {
    printf("MQTT Server Connect Failed. Client State:");
    printf("%d\n", mqttClient.state());
    delay(3000);
  }
}

// 收到信息后的回调函数
void receiveCallback(char *topic, byte *payload, unsigned int length)
{
  printf("Message Received [%d]", topic);

  for (int i = 0; i < length; i++)
  {
    printf("%c", (char)payload[i]);
  }

  printf("\n");

  printf("Message Length(Bytes) %d\n", length);

  if ((char)payload[0] == '1')
  { // 如果收到的信息以“1”为开始
    // digitalWrite(BUILTIN_LED, LOW); // 则点亮LED。
    printf("LED ON\n");
  }
  else
  {
    // digitalWrite(BUILTIN_LED, HIGH); // 否则熄灭LED。
    printf("LED OFF\n");
  }
}

void setup()
{
  // 初始化串口
  Serial.begin(115200);
  // 初始化WIFI
  WiFi.begin(id, pswd);
  // 判断wifi是否连接成功
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    printf("正在连接...\n");
  }
  printf("连接成功！\n");
  printf("IP address: %s\n", WiFi.localIP().toString().c_str()); // 打印本地IP地址
  printf("dns: %s\n", WiFi.dnsIP().toString().c_str());          // 打印dns地址

  // 设置MQTT服务器和端口号
  mqttClient.setServer(mqttServer, 1883);
  // 设置MQTT订阅回调函数
  mqttClient.setCallback(receiveCallback);
  // 连接MQTT服务器
  connectMQTTServer();
}

void loop()
{
  // 判断开发板是否成功连接服务器
  if (mqttClient.connected())
  {
    // 保持客户端心跳
    mqttClient.loop();
    // printf("Okk\n");
  }
  else
  {
    // 重新尝试连接服务器
    connectMQTTServer();
    printf("Err\n");
  }
}
```

## 后记
- 再次感谢太极创客团队的开源教程！