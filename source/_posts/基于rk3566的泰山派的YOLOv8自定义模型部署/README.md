---
title: 「基于rk3566的泰山派」的YOLOv8自定义模型部署
excerpt: 今天！一起来拯救你吃灰的泰山派2.0🙆！
tags: [rockchip, rk3566, Ubuntu, YOLO]
# index_img: /img/post/11.jpg
# banner_img: /img/post/12.jpg
index_img: /images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-0.jpg
banner_img: /images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-1.png
categories: Study Page
comment: 'twikoo'
# hide: true
date: 2026-2-22 2:16:00
---

### 关于「基于rk3566的泰山派」的YOLOv8自定义模型部署
### Author: kkl

{% note warning %}

该笔记已经完成施工！

{% endnote %}

{% note success %}
Damnnn!!! 我又来了哈，各位新年平安！

趁着这个新年假期，来捣鼓一下RK系列芯片上面的模型推理部署，然后刚好想要了解一下视觉类的模型YOLO，这个时候不得不搬出之前做过的[YOLOv8-loopy](https://github.com/ZhangKeLiang0627/YOLOv8-loopy)的内容（笑，这么看来，简直是手到擒来呀这期。

其实这里有一个故事：就是也算工作上的小插曲，最近工作性质偏向视觉端，刚好也是瑞芯微的芯片，于是顺其自然接触了很多“模型端侧推理”的内容。我和视觉组的同事开玩笑说，你们莫非只是用个YOLO而已？钱也太好赚了吧，w我也要干视觉（其实除了YOLO还有很多算法在里头。然后同事打趣摇摇头，给你一个月你也学不来哒...

我对此嗤之以鼻，哼，幽默（￣へ￣

**——from 2026.2.22**
{% endnote %}

{% note info %}
写完开头结尾，倒头就睡（经典开局。今日起床，充满活力，经过几天的假期休养，身体终于从苦不堪言的出差中恢复过来了。但是又想到今天就是初七，明天就是开工大吉，心情瞬间低落，damn啊！不过今天天气多云，确实适合宅家写写文档...

**——from 2026.2.23**
{% endnote %}

---

### 写在前面

tspi的玩家们可以去回顾一下我之前的文章，这里贴上跳转链接[关于「基于rk3566的泰山派」的一切](https://zhangkeliang0627.github.io/2025/11/03/关于基于rk3566的泰山派的一切/README/).

这篇文章受用并不仅限于tspi，其他瑞芯微带NPU的Soc都可以作为参考借鉴，比如：RK3588、RK3576、RK3568、RV1126/RV1126P...

- 先来聊聊我对**YOLOv8**粗浅理解，目前业界上最万金油视觉检测模型非YOLOv8莫属，大家都在用，也嘎嘎好用，多任务统一，做检测、分割、关键点检测都很不错，性价比高啊。

- 当然现在很多老旧项目里面还在跑**YOLOv5**，这模型也很棒很经典新手入门资料齐全踩坑少，但对比上后面的模型性价比有点低了，稍微有些吃力（没想到2020年才出，感觉很近啊。

- **YOLOv11**也不错，小目标检测效果最好，这几个模型可以根据实际检测场景穿插来使用ahh...

更深的就不说啦，再底层的咱们也不太懂大家自行了解。**本此我们主要围绕YOLOv8检测模型展开学习，其他的分割模型、姿态模型、OBB模型的部署都是换汤不换药大差不差的，知道怎么使用怎么部署就已经非常棒了，下面我们开始吧。**

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-3.png" alt="" width = "900" height = "350" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-2.png" alt="" width = "900" height = "350" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

**_本篇文章将简述如何「基于rk3566的泰山派」快速部署YOLOv8。_**

---

### 开始

#### 准备环境
{% note warning %}

_**测试环境：tspi的系统是Ubuntu20.04，PC是VMWare（Ubuntu20.04），rknn-Toolkit2是1.5.0及以上版本**_

{% endnote %}

##### 安装miniconda

按照下面指令，miniconda安装过程一路`Enter`、一路`yes`即可。

```bash
# 更新系统包列表
sudo apt update

# 下载最新版Miniconda（适配Ubuntu的x86_64架构）
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# 执行下载的脚本
bash Miniconda3-latest-Linux-x86_64.sh
# 接下来默认都是Enter、yes，直到安装完成

# 手动执行命令让conda生效
source ~/.bashrc

# 验证安装
conda --version
# 若出现 conda 24.3.0，类似输出即为安装成功

# 如果不想每次打开终端都激活base环境，可以手动关闭（默认是开启的
# 之后若需要激活 base 环境，手动执行：conda activate base
conda config --set auto_activate_base false
```

##### 创建rknn-toolkit2虚拟环境

1. 创建`Conda`环境：toolkit2_3.2

```bash
# 创建目录，统一路径
cd ~ && mkdir -p project-Toolkit2 && cd project-Toolkit2

# 创建虚拟环境，统一使用python 3.10版本
# 我们这里使用rknn-toolkit2_3.2的版本，截至（2026/2/22）最新
# 旧版本也无所谓，能跑起来就行
conda create -n toolkit2_3.2 python=3.10
# 遇到Proceed ([y]/n)?
# 输入y即可
```

2. 激活`Conda`环境

```bash
# 激活 Conda 环境
conda activate toolkit2_3.2
# 激活之后在命令行前面会出现：(toolkit2_3.2)
```

3. 安装环境依赖

``` bash
cd ~ && mkdir -p project-Toolkit2 && cd project-Toolkit2

# 克隆rknn-toolkit2仓库，并切换到 v2.3.2 标签
git clone https://github.com/airockchip/rknn-toolkit2.git && cd rknn-toolkit2 && git checkout tags/v2.3.2 -b v2.3.2

# 配置pip源
pip3 config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/

# 安装依赖库，https://github.com/airockchip/rknn-toolkit2/blob/v2.3.2/rknn-toolkit2/packages/x86_64/requirements_cp310-2.3.2.txt
pip3 install -r rknn-toolkit2/packages/x86_64/requirements_cp310-2.3.2.txt

# 安装rknn-toolkit2
# 根据系统的python版本和架构（最新版本支持arm64和x86）选择不同的whl文件安装：
pip3 install rknn-toolkit2/packages/x86_64/rknn_toolkit2-2.3.2-cp310-cp310-manylinux_2_17_x86_64.manylinux2014_x86_64.whl
```

更简易的环境搭建参考：[JLC-tspi-rk3576-env-rknntoolkit2](https://wiki.lckfb.com/zh-hans/tspi-3-rk3576/ai/yolov8/detection-model.html#创建rknn-toolkit2环境)；或者参考：[embedfire-lubancat-env-toolkit2](https://doc.embedfire.com/linux/rk356x/Ai/zh/latest/lubancat_ai/env/toolkit2.html#toolkit2)，(●'◡'●)


##### 创建YOLOv8环境

1. 创建`Conda`环境：yolov8-rknn

```bash
conda create -n yolov8-rknn python=3.10
conda activate yolov8-rknn
```

安装 ultralytics 时会自动安装 CPU 版本的 pytorch 和 torchvision，但我们一般需要安装 GPU 版本，因此我们可以先安装 pytorch 再安装 ultralytics 就可以避免这个问题。

PyTorch 官网：[PyTorch](https://pytorch.org/)，根据自己的系统和 CUDA 版本选择安装对应的 pytorch：


{% gi %}
<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-4.png" alt="" width = "600" height = "400" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>
<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-5.png" alt="" width = "600" height = "400" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>
<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-6.png" alt="" width = "600" height = "400" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>
{% endgi %}

2. 安装`pytorch`

```bash
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

3. 最后再来安装`ultralytics`

```bash
pip install ultralytics -i https://mirrors.aliyun.com/pypi/simple
```

{% note info %}
模型训练我是在windows上进行，虚拟机Ubuntu上其实也能练，但是就是要配置GPU驱动相关的东东，有点儿麻烦了，如果不配置单纯拿CPU来跑，又比乌龟爬还要慢（捂额...索性我在windows上有YOLOv8训练环境，我就直接就地取材了哈，就不演示训练过程啦！
{% endnote %}

#### 模型导出

瑞芯微`airockchip`官方权威README：[导出 RKNPU 适配模型说明](https://github.com/airockchip/ultralytics_yolov8/blob/main/RKOPT_README.zh-CN.md).

这里需要做的事情非常简单，首先你需要准备一个模型（自己练好的或者是官方的权重文件yolov8n.pt；接着我们需要使用rockchip优化过的yolov8项目导出onnx模型。

考虑到已经有很多第三方做过官方的yolov8n.pt的模型转换教程了，[JLC教程<-](ttps://wiki.lckfb.com/zh-hans/tspi-3-rk3576/ai/yolov8/detection-model.html#模型转换)、[野火教程<-](ttps://doc.embedfire.com/linux/rk356x/Ai/zh/latest/lubancat_ai/example/yolov8.html#airockchip-ultralytics-yolov8)。不过野火教程比较老旧了，转换自定义模型的时候，我弄的老是效果不好。所以推荐JLC教程，比较新，转换的是onnx模型，也对应最新的rknn-toolkit2库，赞哦！**它们写的够好够详细了，我就不多赘述，推荐大家可以先去跟着完整跑一遍，再回来继续哟！**

好的，下面继续，所以，我们这里直接拿自定义模型来做演示，那就是[YOLOv8-loopy](https://github.com/ZhangKeLiang0627/YOLOv8-loopy)!!!

切换虚拟环境为：`yolov8-rknn`
```bash
conda activate yolov8-rknn
```

拉取`airockchip/ultralytics_yolov8`项目：
```bash
cd ~ && mkdir -p project-Toolkit2 && cd project-Toolkit2

# 开始拉取
git clone https://github.com/airockchip/ultralytics_yolov8.git

# 拉取完毕后，进入目录
cd ultralytics_yolov8
```

下载训练好的loopy检测模型，到该目录下
```bash
wget https://raw.githubusercontent.com/ZhangKeLiang0627/YOLOv8-loopy/main/best.pt -O best.pt
```

然后修改./ultralytics/cfg/default.yaml文件，主要是设置下model，为自己训练的模型路径：
```yaml
# 然后修改./ultralytics/cfg/default.yaml文件，主要是设置下model，为自己训练的模型路径：
	# model: ./yolov8n.pt # (str, optional) path to model file, i.e. yolov8n.pt, yolov8n.yaml
	model: ./best.pt # (str, optional) path to model file, i.e. yolov8n.pt, yolov8n.yaml
	data:  # (str, optional) path to data file, i.e. coco128.yaml
	epochs: 100  # (int) number of epochs to train for
```

接着导出模型
```bash
# 设置导出路径
export PYTHONPATH=./

# 使用脚本开始导出 ONNX 模型
python ./ultralytics/engine/exporter.py
```

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-7.png" alt="" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

#### 模型转换

切换虚拟环境为：`toolkit2_3.2`
```bash
conda activate toolkit2_3.2
```

接下来我们将使用`rknn_model_zoo`中的`转换脚本`将 ONNX 转换为 RKNN 模型，拉取项目：
```bash
cd ~ && mkdir -p project-Toolkit2 && cd project-Toolkit2

git clone https://github.com/airockchip/rknn_model_zoo.git
```

进入`rknn_model_zoo/examples/yolov8/python`目录下：
```bash
cd rknn_model_zoo/examples/yolov8/python
```

***这里，很重要，要把`rknn_model_zoo/examples/yolov8/python/convert.py`中的量化关一下，先不做量化，因为很麻烦，可以下来自行去研究研究哈，想要量化的话也挺简单的，就是要多花点心思。**

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-9.png" alt="" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

运行`rknn_model_zoo/examples/yolov8/python/convert.py`脚本转化RKNN模型：
```bash
# 语法：python3 convert.py onnx_model_path [platform] [dtype] [output_rknn_path]
## platform：[rk3562, rk3566, rk3568, rk3576, rk3588, rv1126b, rv1109, rv1126, rk1808]
## dtype：[i8, fp] for [rk3562, rk3566, rk3568, rk3576, rk3588, rv1126b]
## dtype：[u8, fp] for [rv1109, rv1126, rk1808]

python convert.py ~/project-Toolkit2/ultralytics_yolov8/best.onnx rk3566
```

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-8.png" alt="" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

执行成功之后，会在`rknn_model_zoo/examples/yolov8/model`目录下生成一个`.rknn`模型文件

#### Demo编译

安装交叉编译器`aarch64`
```bash
sudo apt update && sudo apt install -y gcc-aarch64-linux-gnu g++-aarch64-linux-gnu
```

进入`rknn_model_zoo`项目目录：
```bash
cd ~/project-Toolkit2/rknn_model_zoo
```

给予`build-linux.sh`运行权限：
```bash
sudo chmod +x ./build-linux.sh
```

需要修改一下`~/project-Toolkit2/rknn_model_zoo/examples/yolov8/model/coco_80_labels_list.txt`的内容 和 `~/project-Toolkit2/rknn_model_zoo/examples/yolov8/cpp
/postprocess.h`中的 OBJ_CLASS_NUM 宏，按照你数据集的yaml来改，顺序保持不动，数量保持一致；

如，我的[loopy.yaml](https://github.com/ZhangKeLiang0627/YOLOv8-loopy/blob/main/dataset/loopy.yaml)就一个class，那么数量宏 OBJ_CLASS_NUM 就为1，然后`coco_80_labels_list.txt`就填loopy.
```yaml
# Train/val/test sets as 1) dir: path/to/imgs, 2) file: path/to/imgs.txt, or 3) list: [path/to/imgs1, path/to/imgs2, ..]
path: "C:\\Users\\hb2cpc\\Desktop\\loopy\\dataset\\images" # dataset root dir
train: "train" # train images (relative to 'path')
val: "val" # val images (relative to 'path')

# Classes
nc: 1 # number of classes
names: ["loopy"] # class names
```

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-11.png" alt="" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-12.png" alt="" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>


运行编译脚本：
```bash
./build-linux.sh -t <target> -a <arch> -d <build_demo_name> [-b <build_type>] [-m] [-r] [-j]
    -t : target (rk356x/rk3576/rk3588/rv1106/rv1126b/rv1126/rk1808)
    -a : arch (aarch64/armhf)
    -d : demo name
    -b : build_type(Debug/Release)
    -m : enable address sanitizer, build_type need set to Debug
	-r : disable rga, use cpu resize image
	-j : disable libjpeg to avoid conflicts between libjpeg and opencv

# 我们运行RK3566相关的YOLOv8命令即可。:
./build-linux.sh -t rk3566 -a aarch64 -d yolov8
```

最终生成`install/`文件目录.

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-13.png" alt="" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

#### 板卡上部署推理

把`rknn_model_zoo/install`传到板卡上：
```bash
scp -r ~/project-Toolkit2/rknn_model_zoo/install cat@192.168.124.43:/
```

然后在板卡上操作，进入该install文件夹，接着指定一下库的位置：
```bash
export LD_LIBRARY_PATH=./lib
```

最后，使用命令运行一下可执行文件：
```bash
./rknn_yolov8_demo ./model/yolov8.rknn ./model/loopy.jpg
```

<figure>
<img src="/images/基于rk3566的泰山派的YOLOv8自定义模型部署/image-10.png" alt="" style="border-radius: 15px;">
<figcaption></figcaption>
</figure>

---

### 写在后面

至此，你就又学会了一项新技能！快去创造无限可能吧（笑！

**鸣谢：**
- JLC：https://doc.embedfire.com/linux/rk356x/Ai/zh/latest/lubancat_ai/example/yolov8.html
- 野火：https://wiki.lckfb.com/zh-hans/tspi-3-rk3576/ai/yolov8/detection-model.html
- 很好很详细的教程：https://blog.csdn.net/c858845275/article/details/146274652
- loopy数据集：https://github.com/ZhangKeLiang0627/YOLOv8-loopy
- onnx模型导出：https://github.com/airockchip/ultralytics_yolov8
- rknn模型转换 & 推理Demo：https://github.com/airockchip/rknn_model_zoo
- https://github.com/airockchip/rknn-toolkit2
- https://github.com/LubanCat/lubancat_ai_manual_code

...

---