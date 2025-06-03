---
title: 【树莓派】树莓派使用HomeAssistant连接ESPHome
excerpt: 树莓派能否也烤出树莓的香气...
tags: [Linux, RaspberryPi, HomeAssistant, ESPHome]
index_img: images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-3.png
banner_img: images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-2.png
categories: Study Page
comment: 'twikoo'
date: 2025-1-14 23:35:00
---

### 【树莓派】树莓派使用HomeAssistant连接ESPHome
### 【Raspberry Raspberry Pi use HomeAssistant to connect ESPHome
### Author: @kkl

{% note warning %}
多图警告！请流量党抓紧连上WiFi，捂好钱包，我们，出发！
{% endnote %}

---
### 写在前面

{% gi 2 2 %}
![HomeAssistant logo](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image.png)
![ESPHome logo](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-3.png)
{% endgi %}

`HomeAssistant`是一个开源的智能家居自动化平台，它允许用户通过一个中心化的系统来控制和管理家中的各种智能设备。它的设计理念是为用户提供一个无需依赖特定制造商的解决方案，因此，它可以集成来自不同品牌的智能设备（如Xiaomi），为用户提供一个开放且可定制的智能家居体验。

`ESPHome` is a system to control your microcontrollers by simple yet powerful configuration files and control them remotely through Home Automation systems.

> HomeAssistant官网：https://www.home-assistant.io
> ESPHome官网：https://esphome.io

今天咱们使用`HomeAssistant`接入`ESPHome`，事不宜迟，趁热打铁，我们开始！

#### 环境
* 硬件：Raspberry Pi 4B
* 镜像版本：`HA-OS`版本 HomeAssistant

#### HomeAssistant 版本

![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-5.png)

`HomeAssistant`一共推出了4种版本：HA-OS, Docker, Core, Supervised.

优先推荐安装`HA-OS`版本[官方详细教程戳这里:)](https://www.home-assistant.io/installation/raspberrypi)，因为该版本安装简易，同时有`Add-on`和`Superviser`，拥有加载项商店，可以方便地下载插件！

**_本篇文章将简述使用树莓派 HomeAssistant 的`HA-OS`版本连接`ESPHome`。_**

---
### 开始

#### 下载ESPHome插件

So easy!!! Please just follow the pictures below:

{% gi 4 2-2 %}
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-4.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-21.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-6.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-7.png)
{% endgi %}


#### 添加新的Device

{% note info %}
这里以ESP32S3为例：
{% endnote %}

{% gi 4 2-2 %}
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-8.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-9.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-10.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-11.png)
{% endgi %}

#### 烧录ESPHome固件

1. 生成在线烧录的bin文件：

{% gi 4 2-2 %}
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-12.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-13.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-18.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-19.png)
{% endgi %}

以下为`YAML`文件的模板，此文件将用于设置所有板配置。
{% fold info @YAML文件的模板（ESP32S3 %}
```yaml
esphome:
  name: my-esp32s3
  friendly name: my-esp32s3
  platformio_options:
    build_flags: -DBOARD_HAS_PSRAM
    board_build.arduino.memory_type: qio_opi
    board_build.f_flash: 80000000L
    board_build.flash_mode: qio 

esp32:
  board: esp32-s3-devkitc-1
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "gbDi6S+wV/rr890ytxP1aD+lgdJOk/Wi52Q5RcK1BGc="
ota:
  - platform: esphome
  password: "1e7a2bdcdbcac1e989f1890679d09122"

wifi:
  ssid: "your wifi name"
  password: "your wifi password"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "My-Esp32s3 Fallback Hotspot"
    password: "MoLTqZUvHwWI"
```
{% endfold %}

2. 使用ESP32在线烧录工具：https://web.esphome.io/ ，将bin文件烧录到MCU当中：

{% gi 4 2-2 %}
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-14.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-15.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-16.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-17.png)
{% endgi %}

烧录成功页面如下：
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-20.png)

#### HomeAssistant连接Device

{% note warning %}
注意：Device连接的WiFi必须要与HomeAssistant在同一局域网之下！如果路由器WiFi分为2.4G和5G，最好都连接使用2.4G的（2.4G的WiFi对ESP32兼容，5G可能不行，不要一个使用2.4G，一个使用5G！
{% endnote %}

{% note warning %}
Plus：如果遇到以下错误，请检查：
1) HA和Device是否在同一局域网下，检查Device的ip地址是否填写正确；
2) 确保已经在同一局域网下，ip地址无误，可能是网络信号差，连续多点几次`提交`就能连接成功。

![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-22.png)

{% endnote %}

{% note success %}
提示：最好使用 2.4GHz Wi-Fi！
{% endnote %}

跟随以下图片分解步骤即可完成 HomeAssistant 连接新的 Device：

{% gi 4 2-2 %}
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-23.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-24.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-25.png)
![](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-26.png)
{% endgi %}

...

#### ESPHome的yaml文件编写（根据不同传感器需求

- Binary LED + SPG30 + DHT11 (ESP32S3)
  
{% fold info @YAML文件的模板（ESP32S3 %}
```yaml
esphome:
  name: my-esp32s3
  friendly_name: my-esp32s3


esp32:
  board: esp32-s3-devkitc-1
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "gbDi6S+wV/rr890ytxP1aD+lgdJOk/Wi52Q5RcK1BGc="

ota:
  - platform: esphome
    password: "1e7a2bdcdbcac1e989f1890679d09122"

wifi:
  ssid: "HUGO"
  password: "12345678"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "My-Esp32S3 Fallback Hotspot"
    password: "LakYDi3jZIKg"

# I2C configuration for i2c sensor
i2c:
  sda: GPIO5
  scl: GPIO6
  scan: True
  id: bus_a
  frequency: 400kHz

# Example configuration entry
switch:
  - platform: gpio
    pin: GPIO1
    name: "Living Room light"

captive_portal:

sensor:       
  # Sensor configuration for dht11
  - platform: dht
    pin: GPIO44
    temperature:
      name: "Temperature"
    humidity:
      name: "Humidity"
    update_interval: 5s # 数据每5s监测一次
    model: "DHT11"  

  # Sensor configuration for SGP30
  - platform: sgp30
    eco2:
      name: "Workshop eCO2"
      accuracy_decimals: 1 # 数据精确到小数点后1位
    tvoc:
      name: "Workshop TVOC"
      accuracy_decimals: 1 # 数据精确到小数点后1位
    store_baseline: yes
    address: 0x58
    update_interval: 5s # 数据每5s监测一次
```
{% endfold %}

![Binary LED + SPG30 + DHT11](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-27.png)

- ESP-Camera (XIAO-ESP32S3)

{% fold info @YAML文件的模板（XIAO-ESP32S3 %}
```yaml
esphome:
  name: my-esp32s3-camera
  friendly_name: my-esp32s3-camera

  # PlatformIO build options
  platformio_options:
    build_flags: -DBOARD_HAS_PSRAM
    board_build.arduino.memory_type: qio_opi
    board_build.f_flash: 80000000L
    board_build.flash_mode: qio 

# Configuration for ESP32
esp32:
  board: esp32-s3-devkitc-1
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "0VVmbx1JdrIWI8sw+TneEf0oEi0vkQnNLuP3Vl6EvMQ="

ota:
  - platform: esphome
    password: "0237fcf68dea46990481fb72466c2cdc"

wifi:
  ssid: "HUGO"
  password: "12345678"

  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "My-Esp32S3-Camera"
    password: "gqgYC1lZTiFD"

captive_portal:

# Configuration for the ESP32 Camera
esp32_camera:
  id: espcam
  name: My Camera
  external_clock:
    pin: GPIO10
    frequency: 20MHz
  i2c_pins:
    sda: GPIO40
    scl: GPIO39
  data_pins: [GPIO15, GPIO17, GPIO18, GPIO16, GPIO14, GPIO12, GPIO11, GPIO48]
  vsync_pin: GPIO38
  href_pin: GPIO47
  pixel_clock_pin: GPIO13
  resolution: 800x600
  
# Configuration for the ESP32 Camera Web Server
esp32_camera_web_server:
  - port: 8080
    mode: stream
  - port: 8081
    mode: snapshot
```
{% endfold %}

![esp-camera](images/MyRaspberryPiLearningGuide/树莓派使用HomeAssistant连接ESPHome/image-28.png)

- WS2812 (ESP32C3)
  
{% fold info @YAML文件的模板（ESP32C3 %}
```yaml
esphome:
  name: my-esp32c3
  friendly_name: my-esp32c3

esp32:
  board: esp32-c3-devkitm-1
  framework:
    type: arduino

# Enable logging
logger:

# Enable Home Assistant API
api:
  encryption:
    key: "giFi9MI6pdcoc+WdXm84dSaRFIbc8cn/TifIG6/V/Js="

ota:
  - platform: esphome
    password: "c73e533495a8ca7f3fcc39fd47a3182b"

wifi:
  ssid: "HUGO"
  password: "12345678"
  # Enable fallback hotspot (captive portal) in case wifi connection fails
  ap:
    ssid: "My-Esp32C3 Fallback Hotspot"
    password: "uV72qROO5gCX"

captive_portal:
    
light:
#WS2812_RGB
  - platform: neopixelbus
    type: GRB
    variant: WS2812
    pin: GPIO2
    num_leds: 60
    name: "RGB_LED"
```
{% endfold %}



### 写在后面

![HomeAssistant logo](images/MyRaspberryPiLearningGuide/树莓派部署HomeAssistant/image-4.png)

鸣谢：

- https://blog.csdn.net/vor234/article/details/135843695
- https://blog.csdn.net/m0_57530281/article/details/125693037
- https://blog.csdn.net/nowboy4/article/details/123804170
- https://blog.csdn.net/qq_42250136/article/details/137674700