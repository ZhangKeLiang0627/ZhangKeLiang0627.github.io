---
title: 在ESP32-Arduino中使用低功耗蓝牙BLE
excerpt: 蓝牙蓝牙！Bluetooth🟦🦷！
tags: [ESP32, MCU, Arduino, BLE]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在ESP32-Arduino中使用低功耗蓝牙BLE/image.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在ESP32-Arduino中使用低功耗蓝牙BLE/image.jpg
categories: Study Page
comment: 'twikoo'
# hide: true
date: 2025-1-4 10:17:00
---

### 在ESP32-Arduino中使用低功耗蓝牙BLE
### 蓝牙蓝牙！Bluetooth🟦🦷！
### Author: kkl

---

### 写在前面

以往项目中使用的蓝牙相关的例程都是一些鸡毛蒜皮的拼接，终于有空闲的时间可以来专门学习一下ESP32-Arduino中低功耗蓝牙BLE的使用方法啦，同时了解了解BLE的工作原理。

**_本篇文章将简述如何迅速地学会在ESP32-Arduino中使用BLE的API。_**

#### 我的环境

- 开发板：ESP32S3N16R8
- 开发平台：Arduino + PlatformIO + Vscode

---

### 开始

#### 原理
![BLE服务框图](https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/images/在ESP32-Arduino中使用低功耗蓝牙BLE/image-0.png)

> BLE蓝牙服务端编程的流程：
> **蓝牙设备初始化 -> 创建Server -> 创建Service -> 创建Characteristic -> 创建广播对象 -> 将服务加入到广播中 -> 开始广播提供服务**

...

#### 使用
...

{% fold info @BLE服务端例程 - 最简 %}
```c++
/**
 *  例2 添加自动再次广播
 *  
 *  同时只能处理一个或多个客户端
 */


#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define SERVICE_UUID        "b0afd88d-5807-4533-b27b-a48cc3a32e30"   // 服务UUID
#define CHARACTERISTIC_UUID "7057310c-1e37-4a0a-9ae1-6ed8ccb995b1"   // 特征UUID

bool isAdvertising = true;  // 是否在广播
int clientCount = 0;        // 目前已有客户端数量

//服务器连接与断开连接回调类
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      Serial.println("client connected...");
      clientCount++;
      isAdvertising = false;  // 因为只要有客户端连上来，就会关闭广播
    };

    void onDisconnect(BLEServer* pServer) {
      Serial.println("client disconnected...");
      clientCount--;
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE work!");
  delay(500);
  BLEDevice::init("Fish Fish");                                         // 1.初始化蓝牙设备
  BLEServer *pServer = BLEDevice::createServer();                       // 2.创建一个服务器
  pServer->setCallbacks(new MyServerCallbacks());                       // 为服务器添加回调函数

  BLEService *pService = pServer->createService(SERVICE_UUID);          // 3.创建一个服务
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(  // 4.在服务里创建一个特征
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE                                         
                                       );
  pCharacteristic->setValue("Hello World.");                            // 给特征赋值


  pService->start();                                                    // 5.Service开始提供服务
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();           // 获取广播器
  pAdvertising->addServiceUUID(SERVICE_UUID);                           // 将Service加入广播
  pAdvertising->setScanResponse(true);                                  // 允许扫描回复
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();                                        // 6.开始广播

  Serial.println("Characteristic defined! Now you can read it in your phone!");

}

void loop() {
  if(BLEDevice::getInitialized() && !isAdvertising && clientCount<1)
  {
    delay(500);                     // 让蓝牙设备留一段处理的时间
    BLEDevice::startAdvertising();  // 重新开始广播
    isAdvertising = true;
    Serial.println("start advertising");
  }

  delay(50);
}
```
{% endfold %}

{% fold info @BLE服务端例程 - 类对象 %}
```c++
#include <BLEDevice.h> // 包含BLEDevice库，用于蓝牙低功耗设备的控制
#include <BLEServer.h> // 包含BLEServer库，用于创建和管理蓝牙服务器
#include <BLEUtils.h>  // 包含BLEUtils库，提供蓝牙相关的实用工具函数
#include <BLE2902.h>   // 包含BLE2902库，用于处理蓝牙特性描述符

// 定义收发服务的UUID（唯一标识）
#define SERVICE_UUID "7F7C610C-7A86-4892-94BA-88B70DC790F5"
// RX串口标识
#define CHARACTERISTIC_UUID_RX "C02E69C2-E503-43F8-A74D-B95C1F5AF088"
// TX串口标识
#define CHARACTERISTIC_UUID_TX "D914E6B6-509C-4803-9FB5-9454782478A6"

/**
 * @brief Define the way to format logout
 *
 */
#define _LOG(format, args...) printf(format, ##args)

class HugoBLE : public BLEServerCallbacks, public BLECharacteristicCallbacks
{
private:
    bool _isConnected = false;                      // 标记蓝牙设备是否已连接
    bool _isInitialized = false;                    // 标记蓝牙设备是否已初始化
    BLEServer *pServer = nullptr;                   // 创建全局BLE服务器指针
    BLECharacteristic *pTxCharacteristic = nullptr; // 创建全局传输特性指针，用于数据传输
    std::string deviceName = "HugoBLE";             // 蓝牙设备的名称
    std::string rxBle;                              // 接收到的蓝牙数据
    std::string txBle;                              // 要发送的蓝牙数据
    std::queue<std::string> dataQueue;              // 字符串队列，用于存储接收到的数据

    // ...

public:
    HugoBLE(std::string deviceName = "hugoBleDevice");
    ~HugoBLE() {}

    void begin(void);
    void end(void);
    void loop(void);
    void process(void);
    void setName(std::string deviceName) { this->deviceName = deviceName; }

    void onConnect(BLEServer *pServer);
    void onDisconnect(BLEServer *pServer);
    void onWrite(BLECharacteristic *pCharacteristic);

    // ...
};

HugoBLE::HugoBLE(std::string deviceName) : deviceName(std::string(deviceName).substr(0, 15))
{
}

void HugoBLE::begin(void)
{
    if (!_isInitialized)
    {
        _LOG("[BLE] BLE init begin!\n");

        // 初始化BLE设备，设置设备名称为"HugoBLE"
        BLEDevice::init("HugoBLE");
        // 创建BLE服务实例
        pServer = BLEDevice::createServer();
        // 设置服务器的回调函数（onConnect(), onDisconnect()）
        pServer->setCallbacks(this);
        // 创建指定UUID的服务
        BLEService *pService = pServer->createService(SERVICE_UUID);
        // 创建具有通知属性的传输特征
        pTxCharacteristic = pService->createCharacteristic(CHARACTERISTIC_UUID_TX, BLECharacteristic::PROPERTY_NOTIFY);
        // 为传输特征添加2902描述符，告诉客户端启用Notify服务
        pTxCharacteristic->addDescriptor(new BLE2902());
        // 创建具有写属性的接收特征
        BLECharacteristic *pRxCharacteristic = pService->createCharacteristic(CHARACTERISTIC_UUID_RX, BLECharacteristic::PROPERTY_WRITE);
        // 设置接收特征的回调函数（onWrite()）
        pRxCharacteristic->setCallbacks(this);

        pService->start();                  // 启动服务
        pServer->getAdvertising()->start(); // 开始广播

        _isInitialized = true;

        _LOG("[BLE] BLE init successed!\n");
    }
    else
    {
        _LOG("[BLE] BLE has been init!\n");
    }
}

void HugoBLE::end(void)
{
}

void HugoBLE::loop(void)
{
    // 检查队列是否有数据
    while (!dataQueue.empty())
    {
        // 获取队列中的数据
        std::string data = dataQueue.front();
        // 移除队列中的数据
        dataQueue.pop();
        // 将写入的值赋给私有变量rxBle
        rxBle = data;
        // 对数据进行处理
        process();
    }
}

// 蓝牙事件处理
void HugoBLE::process(void)
{
    // ...
}

// 当设备与服务器连接时调用的回调函数
void HugoBLE::onConnect(BLEServer *pServer)
{
    this->_isConnected = true; // 设置蓝牙设备连接状态为已连接
}

// 当设备与服务器断开连接时调用的回调函数
void HugoBLE::onDisconnect(BLEServer *pServer)
{
    this->_isConnected = false;  // 设置蓝牙设备连接状态为断开连接
    delay(300);                  // 延迟一段时间，以便蓝牙控制器处理缓冲区
    pServer->startAdvertising(); // 启动蓝牙广播，以便其他设备可以重新发现并连接
}

// 当接收到蓝牙写入请求时调用的回调函数
void HugoBLE::onWrite(BLECharacteristic *pCharacteristic)
{
    std::string rxStr = pCharacteristic->getValue(); // 获取写入的值

    // 如果写入的值不为空且长度小于 rxValue 的大小
    if (!rxStr.empty() && rxStr.length() < rxBle.max_size())
    {
        // 将数据加入队列
        dataQueue.push(rxStr);
        // 打印接收到的数据
        _LOG("[BLE] RX: %s\n", rxStr.c_str());
    }
}

```
{% endfold %}

{% fold info @BLE服务端例程 - 特征回调例子 %}
```c++
/**
 *  例5 特征回调例子
 *  
 */

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <AsyncTimer.h>
#include <BLE2902.h>
#include <BLEUUID.h>

#define SERVICE_UUID        "b0afd88d-5807-4533-b27b-a48cc3a32e30"   //服务UUID
#define CHARACTERISTIC_UUID "7057310c-1e37-4a0a-9ae1-6ed8ccb995b1"   //特征UUID
#define COUNT_CHARACTERISTIC_UUID "37582929-48c3-4dd0-8e4f-0b29c5640489" //计数器特征

uint32_t value = 0;
BLECharacteristic *countCharacteristic = NULL;
AsyncTimer t;

bool isAdvertising = true;  //是否在广播
int clientCount = 0;    //目前已有客户端数量

class MyCharacteristicCallbacks: public BLECharacteristicCallbacks{

	virtual void onRead(BLECharacteristic* pCharacteristic, esp_ble_gatts_cb_param_t* param)
  {
    auto p = param->read;
    auto conn_id = p.conn_id;
    BLEAddress address(p.bda);
    Serial.printf("Read.. %d, %s\r\n", conn_id, address.toString().c_str());
  }

	virtual void onWrite(BLECharacteristic* pCharacteristic, esp_ble_gatts_cb_param_t* param)
  {
    auto p = param->read;
    auto conn_id = p.conn_id;
    BLEAddress address(p.bda);
    Serial.printf("Write.. %d, %s\r\n", conn_id, address.toString().c_str());
  }

	virtual void onNotify(BLECharacteristic* pCharacteristic)
  {
    Serial.println("notify...");
  }
};

class MySecurity : public BLESecurityCallbacks {
  uint32_t onPassKeyRequest(){
    Serial.println("PassKeyRequest!");
    return 334455;
  }

  //显示本机要求的静态码
  void onPassKeyNotify(uint32_t pass_key){
    Serial.printf("On passkey Notify number:%d", pass_key);
  }

  bool onSecurityRequest(){
    Serial.println("On Security Request!");
    return true;
  }

  //认证结果
  void onAuthenticationComplete(esp_ble_auth_cmpl_t cmpl){
    if(cmpl.success){
      Serial.println("onAuthenticationComplete!");
    } else {
      Serial.println("onAuthentication not Complete!");
    }
  }

  //显示动态码并确定是否同意配对
  bool onConfirmPIN(uint32_t pin){
    Serial.printf("onConfirmPIN %d !", pin);
    //return false;
    return true;  //返回true同意配对，返回false拒绝配对
  }
};

//服务器连接与断开连接回调类
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      Serial.println("client connected...");
      clientCount++;
      isAdvertising = false;  //因为只要有客户端连上来，就会关闭广播
    };

    void onDisconnect(BLEServer* pServer) {
      Serial.println("client disconnected...");
      clientCount--;
    }
};

void setup() {
  Serial.begin(115200);
  Serial.println("Starting BLE work!");
  delay(500);
  BLEDevice::init("Fish Fish");                    //初始化蓝牙设备
  BLEDevice::setEncryptionLevel(ESP_BLE_SEC_ENCRYPT_MITM);
  BLEDevice::setSecurityCallbacks(new MySecurity());

  BLESecurity *pSecurity = new BLESecurity();
  pSecurity->setStaticPIN(112233);  //这个是设置静态密码
  
  auto local_address = BLEDevice::getAddress();    //获取本机地址
  Serial.println(local_address.toString().c_str());
  BLEServer *pServer = BLEDevice::createServer();  //创建一个服务器
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);   //创建一个服务
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(    //在服务里创建一个特征
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE                                         
                                       );
  pCharacteristic->setAccessPermissions(ESP_GATT_PERM_READ_ENCRYPTED | ESP_GATT_PERM_WRITE_ENCRYPTED);
  pCharacteristic->setValue("Hello World.");        //给特征赋值
  pCharacteristic->setCallbacks(new MyCharacteristicCallbacks());

  countCharacteristic = pService->createCharacteristic(
                                         COUNT_CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_NOTIFY |
                                         BLECharacteristic::PROPERTY_INDICATE
                                       );
  countCharacteristic->setValue(value);
  countCharacteristic->addDescriptor(new BLE2902());  //要启用notify和indicate的都要添加这个描述符
// 上下两种添加描述符的写法都可以
//   BLEDescriptor *pDescriptor = new BLEDescriptor(BLEUUID((uint16_t)0x2902)); 
//   countCharacteristic->addDescriptor(pDescriptor);  

  BLEDescriptor *pCountName = new BLEDescriptor(BLEUUID((uint16_t)0x2901));
  pCountName->setValue("My Counter");
  countCharacteristic->addDescriptor(pCountName);
  countCharacteristic->setCallbacks(new MyCharacteristicCallbacks());

  pService->start();    //Service开始提供服务
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();      //获取广播器
  pAdvertising->addServiceUUID(SERVICE_UUID);                      //将Service加入广播
  pAdvertising->setScanResponse(true);                             //允许扫描回复
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();                                   //开始广播

  Serial.println("Characteristic defined! Now you can read it in your phone!");

  //每3秒计数器加1，并发通知
  t.setInterval([]{
    value++;
    if(countCharacteristic && clientCount>0)
    {
      countCharacteristic->setValue(value);
      countCharacteristic->notify();  //发通知
      //countCharacteristic->indicate();
    }
  }, 3000);

  //处理自动广播问题
  t.setInterval([]{
    if(BLEDevice::getInitialized() && !isAdvertising && clientCount<1)
    {
      delay(500);  //让蓝牙设备留一段处理的时间
      BLEDevice::startAdvertising();  //重新开始广播
      isAdvertising = true;
      Serial.println("start advertising");
    }
  }, 50);
}

void loop() {
  t.handle();
}
```
{% endfold %}


{% note success %}
未完待续...
{% endnote %}

### 写在后面

鸣谢以下教程：

小鱼的教程涵盖了编写BLE蓝牙服务端时的大部分情况，豁然开朗。
koolins对小鱼的教程做了大致的总结，快速写出代码。

- @小鱼创意：https://www.bilibili.com/video/BV1XD4y1K7xW
- @koolins：https://www.bilibili.com/video/BV1iPs6efEu1

---