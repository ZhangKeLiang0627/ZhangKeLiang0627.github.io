---
title: 极好用的C嘎嘎日志库spdlog快速上手指南✨
excerpt: 学生时期做项目的时候就看到大佬都在用，现在工作了，终于轮到我用，so，我=大佬（嘻嘻，不敢称兄道弟
tags: [C++, Linux, spdlog]
index_img: /images/极好用的C嘎嘎日志库spdlog快速上手指南/image-1.png
banner_img: /images/极好用的C嘎嘎日志库spdlog快速上手指南/image-0.png

categories: Study Page
comment: 'twikoo'
date: 2025-9-24 21:51:00

---

### 极好用的C嘎嘎日志库spdlog快速上手指南✨
### A Highly Efficient C++ Logging Library: spdlog Quick Start Guide ✨!!!
### Author：@kkl

<p class="note note-success">本文已经施工完毕🧑‍🌾🧑‍🌾!</p>

---

## 写在前面

以前在接触一些比较基础的嵌入式MCU项目的时候，写的都是纯C，基本上大家都是直接使用printf来做日志打印与调试，也没有见到哪个项目有将打印输出到log的规范操作，于是也就默认学习大家这么做，任何时候都是printf。

后面上玩起ESP32，发现乐鑫确实让MCU在封装抽象的路上大大地向前迈出重要的一步，借鉴了许多高级语言的思想，提供的SDK里面也带有分级log的接口，可以畅快地在程序里写C++，可是日志打印依然寒碜的可怜，尤其arduino下的ESP32部分SDK未兼容，日志打印还是printf用的最多。

后面接触linux的时候，看见很多标准规范的项目里头都有完备的日志系统，spdlog的字眼时常浮现眼前，当时也不以为然，估计是因为自己做的项目的体量实在是小，所以没有这方面的需求。

工作后，写代码时，我导总是提起日志的重要性，一旦程序出现了什么崩溃错误，几乎所有资深码农的第一反应就是：赶紧搂一眼日志。我与嵌入式作伴，如今也有三个年头啦，spdlog作为一个高性能的日志库在C++的地位还是无人能敌，基本上所能见的开源项目你都能在代码里发现它的身影...

_**所以，spdlog好啊，得学啊，因为真程序猿必会spdlog（笑！**_

...

## 开始

### spdlog有啥好

- **高效且迅速：**就是快，怎么解释，在大量日志记录场景下也能保持较低延迟和较高吞吐量。
- **编译移植友好：**header-only，spdlog是头文件库，所有的代码都是写在头文件(.h)，因此想要使用这个库，包含头文件即可，没有额外的编译或者依赖链接其他库文件。
- **支持异步模式：**spdlog提供可选的异步日志记录机制，我们都知道日志打印多少会消耗一些时间，如果日志打多了程序就变得卡卡的，而异步模式，能够将日志打印操作放入后台线程执行，从而避免阻塞主线程，保证主线程丝滑运行。
- **多目标输出：**支持将日志输出到控制台、文件，还支持日志轮转。
- **线程安全：**保证在多线程情况下打印日志不会打架，不会像printf一样，多线程下发会变成夹！心！饼！干！

### 如何移植

下载源代码，然后把整个源码目录拷贝到我们对应的项目工程下，然后在makefile或者cmake里面包含这个源码当中的include即可，然后一键编译，不可能会报错滴，这样就算是移植成功了，够不够友好！

```bash
# 下载源码
git clone https://github.com/gabime/spdlog

# 将源码移入项目当中
mv ./spdlog ./myProject/lib

# 最后在makefile或者CmakeList.txt里包含这个./lib/spdlog/include就ok啦
```

### 核心概念

这是[【官方的wiki点我】](https://github.com/gabime/spdlog/wiki)请拿好！！！

![spdlog - 核心概念图](images/极好用的C嘎嘎日志库spdlog快速上手指南/image-2.png)

- **logger：**日志对象，每个logger内包含一个sink组成的vector容器，每个sink可以分别设置优先级，logger本身也可以设置优先级。
- **sink：**直译是水槽，实际上是引流的对象或者可以认为sink就是日志输出目标，可以在控制台输出、也可在文件中输出。
- **formatter：**格式化对象，spdlog有默认的格式，你也可以个性化自定义格式，如[日期时间]、[代码路径]、[函数名]、[行数]、[线程tid]、[logger名称]、[log级别]、[log内容]...
- **level：**日志级别，spdlog提供了几个日志级别，分别是<span class="label label-success">trace</span>, <span class="label label-default">debug</span>, <span class="label label-info">info</span>, <span class="label label-warning ">warn</span>, <span class="label label-danger">error</span>, <span class="label label-primary">critical</span>等...

{% note info %}
逻辑关系：每个logger包含一个vector，该vector由一个或多个std::shared_ptr<sink>组成，logger的每条日志都会调用sink对象，由sink对象按照formatter的格式输出到sink指定的地方（有可能是控制台、文件等），这里呢，不再详细的讲解各个组件怎么使用，ai时代，随处可得；我们马上来看快速使用的方法，ai时代，就是要快（如此单押！
{% endnote %}

### 使用方法

请你来[戳这里:)](https://github.com/gabime/spdlog?tab=readme-ov-file#usage-samples)看最最最权威的使用方法介绍说明吧！

#### 快速入门

spdlog提供了最为便捷的默认logger，输出到控制台，多线程的，彩色的。无需创建便可使用。

```cpp
// Use the default logger (stdout, multi-threaded, colored)
spdlog::info("Hello, {}!", "World");
```

##### 将日志输出到控制台

```cpp
#include <iostream>
#include "spdlog/spdlog.h"
#include "spdlog/sinks/stdout_color_sinks.h"

int main(int argc, char *argv[])
{
    // 直接创建控制台日志logger（带颜色输出）
    auto consoleLogger = spdlog::stdout_color_mt("console");
    
    // 可以使用对象直接输出
    consoleLogger->info("hello world");

    // 也可以使用函数获取对象，再输出
    spdlog::get("console")->info("hello world");

    return 0;
}
```

##### 将日志保存到文件

###### 基本日志

直接把日志写到指定文件当中，注意：文件会随着日志的写入越来越大。
```cpp
#include "spdlog/sinks/basic_file_sink.h"
// 直接创建基本文件日志logger
auto basicLogger = spdlog::basic_logger_mt("basic", "./log/basic.log");

basicLogger->debug("hello world");

spdlog::get("basic")->info("hello {}", "hugokkl");
```

###### 轮转日志
直接把日志写到指定文件当中，你可以设置文件大小和数量，当一个文件大小满了，就会新建一个文件继续轮转，当轮转数量超过设置的文件数量，就会把最初的日志文件覆盖掉，然后日志继续轮转。
```cpp
#include "spdlog/sinks/rotating_file_sink.h"
// Create a file rotating logger with 5 MB size max and 3 rotated files
auto max_size = 1048576 * 5;
auto max_files = 3;
// 直接创建轮转文件日志logger
auto logger = spdlog::rotating_logger_mt("rotate", "./log/rotate.log", max_size, max_files);

logger->debug("hello world");

spdlog::get("rotate")->info("hello {}", "hugokkl");
```
###### 定时日志

每天的指定时间会新建一个日志文件继续存储日志，并把原来的日志文件以日期命名归档。
```cpp
#include "spdlog/sinks/daily_file_sink.h"
// 直接创建定时文件日志logger
// Create a daily logger - a new file is created every day at 2:30 am
auto logger = spdlog::daily_logger_mt("daily", "./log/daily.log", 2, 30);

logger->debug("hello world");

spdlog::get("daily")->info("hello {}", "hugokkl");
```

#### 更多玩法

大多数时候，我们可能不止在一个地方输出日志，我们可能既要在控制台上打印日志、又要将日志保存入文件当中，此时要怎么办呢，spdlog早已为你想到了解决办法，只要你在一个logger里面创建一个vector，里面既包含控制台sink又包含文件sink，即可一石二鸟🤩

话不多说，我这里编写了一个自用的logger文件对，实现了上述的需求，来一起看看吧！

{% fold info @logger.cpp %}
```cpp
#include <iostream>
#include "spdlog/async.h"
#include "spdlog/sinks/daily_file_sink.h"
#include "spdlog/sinks/rotating_file_sink.h"
#include "spdlog/sinks/stdout_color_sinks.h"

#include "logger.h"

#if __cplusplus >= 201703L
#include <filesystem>
namespace fs = std::filesystem;
#else
#include <experimental/filesystem>
namespace fs = std::experimental::filesystem;
#endif

std::shared_ptr<spdlog::logger> Logger::g_logger = nullptr;

void Logger::init(const std::string logDir, const std::string logName, bool isLograteDay, size_t maxSize, int logFileNum) 
{
    std::string log_path;

    try
    {
        if (!fs::exists(logDir))
        {
            fs::create_directories(logDir);
        }

        log_path = logDir + "/" + logName;

        // 初始化异步线程池
        spdlog::init_thread_pool(8192, 1);

        // 创建文件日志接收器（根据轮转方式选择）
        std::shared_ptr<spdlog::sinks::sink> file_sink;
        if (isLograteDay)
        {
            file_sink = std::make_shared<spdlog::sinks::daily_file_sink_mt>(log_path, 0, 0);
        }
        else
        {
            file_sink = std::make_shared<spdlog::sinks::rotating_file_sink_mt>(log_path, maxSize, logFileNum, false);
        }

        // 创建控制台日志接收器（带颜色输出）
        auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();

        // 组合文件和控制台接收器（多接收器）
        std::vector<std::shared_ptr<spdlog::sinks::sink>> sinks;
        sinks.push_back(file_sink);    // 添加文件接收器
        sinks.push_back(console_sink); // 添加控制台接收器

        // 使用多接收器创建异步日志器
        g_logger = std::make_shared<spdlog::async_logger>(
            logName,
            sinks.begin(), 
            sinks.end(),   
            spdlog::thread_pool(),
            spdlog::async_overflow_policy::block);

        // 设置日志格式（同时作用于文件和控制台）
        g_logger->set_pattern("[%Y-%m-%d %H:%M:%S.%e] [tid %t] [%^%l%$] %v");
        // 设置日志打印等级
        g_logger->set_level(spdlog::level::debug);

        spdlog::set_default_logger(g_logger);
        g_logger->info("start log (output to file and console)");
    }
    catch (const spdlog::spdlog_ex &ex)
    {
        std::cerr << "Logger init failed: " << ex.what() << "\n";
        std::cerr << "Fallback to /tmp" << std::endl;

        // 降级方案同样支持控制台输出
        log_path = "/tmp/" + logName;
        auto file_sink = std::make_shared<spdlog::sinks::rotating_file_sink_mt>(log_path, maxSize, logFileNum);
        auto console_sink = std::make_shared<spdlog::sinks::stdout_color_sink_mt>();

        std::vector<std::shared_ptr<spdlog::sinks::sink>> sinks;
        sinks.push_back(file_sink);
        sinks.push_back(console_sink);

        g_logger = std::make_shared<spdlog::async_logger>(
            logName,
            sinks.begin(),
            sinks.end(),
            spdlog::thread_pool(),
            spdlog::async_overflow_policy::block);
        g_logger->set_pattern("[%Y-%m-%d %H:%M:%S] [%^%l%$] %v");
        g_logger->set_level(spdlog::level::debug);
        spdlog::set_default_logger(g_logger);
    }
}

std::shared_ptr<spdlog::logger> Logger::get() { return g_logger; }

void Logger::shutdown()
{
    if (g_logger)
    {
        spdlog::drop_all();
        g_logger = nullptr;
    }
}
```
{% endfold %}

{% fold info @logger.h %}
```cpp
#pragma once

#include <stdio.h>
#include <stdarg.h>
#include <stdbool.h>
#include <time.h>
#include <string>
#include <memory>

#include "spdlog/spdlog.h"

class Logger
{
public:
    static void init(const std::string logDir, const std::string logName, bool isLograteDay, size_t maxSize, int logFileNum);

    static std::shared_ptr<spdlog::logger> get();

    static void shutdown();

protected:
private:
    Logger() = default;
    static std::shared_ptr<spdlog::logger> g_logger;
};
```
{% endfold %}

### 其他函数

#### 日志打印等级level设置

低于设置level的等级将不会被打印.

```cpp
// 全局level设置
spdlog::set_level(spdlog::level::debug);

// 对某个logger单独level设置
logger->set_level(spdlog::level::debug);

// 对某个sink单独level设置
sink->set_level(spdlog::level::debug);
```

#### 日志打印格式formatter设置

更全面的格式设置请你[看这儿:D](https://github.com/gabime/spdlog/wiki/Custom-formatting).

```cpp
// 全局formatter设置
spdlog::set_pattern(" [%H:%M:%S %z] [thread %t] %v ");

// 对某个logger单独formatter设置
logger->set_pattern(" [%H:%M:%S %z] [thread %t] %v ");

// 对某个sink单独formatter设置
sink->set_pattern(" [%H:%M:%S %z] [thread %t] %v ");
```

...

### FAQ

#### st/mt的区别
函数的结尾st/mt，是用于区分对象是单线程使用还是多线程使用：
- st：单线程版本，不加锁，效率更高。
- mt：多线程版本，用于多线程程序，保证线程安全。

#### 手动创建和自动创建logger的区别
通过手动创建的logger要手动通过函数`spdlog::register_logger()`手动注册到全局注册表中才能使用`spdlog::get()`来获取logger对象，而自动创建会自动注册，可以直接使用`spdlog::get()`获取logger对象。

因此，必须先创建注册才能获取噢。

## 写在后面

~先挖个坑，开个头，不然我怕啥时候又因为忙呀忙呀就忘记了，扯远了，先去干活去，等待填坑...~

_**spdlog一用一个不吱声，恭喜你又习得一项名为spdlog的史诗级技能！**_

### 鸣谢
- https://www.cnblogs.com/jinyunshaobing/p/16797330.html
- https://blog.csdn.net/a12jggfdd/article/details/138808399

感谢上述开源教程，学习了很多，抄了很多（笑。
