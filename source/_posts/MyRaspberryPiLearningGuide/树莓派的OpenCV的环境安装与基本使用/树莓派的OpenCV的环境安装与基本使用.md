---
title: 【树莓派】OpenCV的环境安装与基本使用
excerpt: 久违地拿起了我那堆在阴暗小角落浮满灰尘的树莓...
tags: [Linux, RaspberryPi, OpenCV]
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/7.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/8.jpg
categories: Study Page
comment: 'twikoo'
date: 2024-6-17 22:35:00
---
### 【树莓派】OpenCV的环境安装与基本使用
### 【Raspberry PI】 OpenCV environment installation and basical usage
### Author: @kkl

---

## 环境
> * 硬件：Raspberry Pi 4B
> * 摄像头：中星微摄像头（型号：USB301PL）
> * 镜像版本：2022-09-22-raspios-bullseye-arm64.img
> * Python版本：`3.9.2`

---

## 摄像头安装
我这里使用的是某宝随便淘来的**linux免驱动USB摄像头**，下面讲解几个安装摄像头时的注意事项：
- 先将摄像头连接上树莓派，再将树莓派上电开机，不然树莓派无法识别设备。
- 输入`lsusb`命令查看当前的USB总线上面有没有挂载Camera字样的设备，如果有就说明摄像头连接成功了。
- 如果不是USB摄像头，可以输入`ls /dev/video*`命令，查看是否有`/dev/video0`设备。如果设备存在，则说明摄像头挂载成功。

## 环境安装
```bash
# 安装opencv
pip install opencv-python

# 由于opencv只支持 numpy v1.x 版本
# 这里进行numpy版本的统一
pip install numpy==1.19.3
```

## 环境验证
1. 使用命令行`python3`，打开Python交互模式。
2. 在Python交互模式中输入以下命令，对cv2模块进行验证，如果没有报错并显示出当前的cv2版本则环境已经安装成功。
```python
import cv2

cv2.__version__
```
3. 在路径 `/home/pi/Downloads` 创建一个`testCV2.py`文件，并填入下方代码。
```python
import cv2
cap = cv2.VideoCapture(0)  # 调用摄像头‘0’一般是打开电脑自带摄像头，‘1’是打开外部摄像头（只有一个摄像头的情况）
width = 1280
height = 960
cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)  # 设置图像宽度
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)  # 设置图像高度
# 显示图像
while True: 
    ret, frame = cap.read()  # 读取图像(frame就是读取的视频帧，对frame处理就是对整个视频的处理)
    # print(ret)
    # 例如将图像灰度化处理
    img=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY)  # 转灰度图
    
    cv2.imshow("img", img)
    # 图像不处理的情况
    cv2.imshow("frame", frame)    
 
    input_str = cv2.waitKey(20)
    if input_str == ord('q'):  # 如过输入的是q就break，结束图像显示，鼠标点击视频画面输入字符
        break
    
cap.release()  # 释放摄像头
cv2.destroyAllWindows()  # 销毁窗口
```

4. 最后在**VNC远程登录模式**或者在**树莓派图形界面操作系统**下，在命令行中输入指令`cd /home/pi/Downloads/`，接着执行指令`python3 testCV2.py`。幸运的话，你会看到摄像头捕捉到的原画面和经过处理的灰度画面两个窗口，按下`q`键即可退出代码程序。到这里OpenCV的环境安装和基本使用就完成啦！