---
title: 我的FreeRTOS使用指南
excerpt: 努力学习FreeRTOS，学会了工资又高了三千（悲...
tags: [FreeRTOS, MCU]
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/3.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/4.jpg
categories: Study Page
date: 2023-12-9 1:10:00
---
# 我的FreeRTOS使用指南
# MyFreeRTOS-LearningGuide
## By @kkl
---

## 序言
> 本指南着重于FreeRTOS的API从入门到入土的所有用法（Maybe
> 不会太深究底层的内核实现，可能有一些相关性强的会Q一下
> 会讲一些我学习RTOS的时候卡关的地方，或者是觉得莫名其妙的、理解困难的点
> 主张一个，看着就能用，或者是看着看着就会用，而且用的还一溜一溜的FreeRTOS指南

---

## 环境
* MCU: STM32F405（现在是二三年十二月，最近才十元钱每片，以前单价十多元我还傻乎乎地买了好多...悲
* 工程: 标准库 + VScode + Keil（标准开局
* 版本: FreeRTOSv9.0.0

---

## 前提
* 讲讲我们提前必须要知道的一些知识点和概念，不然后面看到代码会直接懵圈。


> **1.堆栈**
> * 简单来说就是内存动态分配的问题，比方说你代码跑起来之后，会在某函数里面创建`临时变量`（也叫`局部变量`）的时候，就会用上堆栈。
> * **栈(Stack)** ：就是在某个函数创建的`临时变量`的内存是编译器自动给你分配的。当这个函数执行完毕，编译器自动帮你释放了这个`临时变量`的内存。
> * 栈也用在触发中断的时候，用于保护现场（当前函数地址啊寄存器值啊，方便从中断回来的时候还原现场哈。
> * 当然栈的使用还包括你函数参数`eg: void Func(int Temp[256])`这里的变量`Temp[256]`也是编译器自动帮你申请内存。所以为啥有时候移植一些大型库的时候你什么都配置好了函数也没有出错编译器却报错，原因可能是库当中的某些函数申请的`局部变量`太大，而你的栈分配的太小导致的。
> * **堆(Heap)** ：就是malloc或者new，简单说就是malloc，你自己分配内存，当然也要你自己去释放free，生命周期结束不释放内存，会造成内存泄漏。
> * **静态区(Static)** ：就是你放`全局变量`或者`static修饰的变量`的地方啦。
>  > * 那么在FreeRTOS中各个任务都有自己的堆栈，一般呢我们只管写这个任务需要多大的堆栈，FreeRTOS会自动帮我们从RAM中申请内存。包括信号量、队列这些都是。
>  > *  `configSUPPORT_STATIC_ALLOCATION`为0的时候，FreeRTOS会使用`heap_x.c(x为 1~5)`中的动态内存管理函数来自动申请RAM；当此宏定义为1的时候，用户可以给FreeRTOS指定一块静态RAM内存，你就可以执行类似`xTaskCreateStatic`的函数啦。一般咱们写0就行（默认也是写0的
>  > * `configTOTAL_HEAP_SIZE`
>  > * `#define XXX_STK_SIZE 256`意思是设置XXX任务的堆栈大小为256*4(字节/byte

> **2.位和字节**
> * **位(bit)**
> * **字节(Byte)** ：1 byte = 8 bit
> * 在单片机中可以简单的把`byte`理解成`char`类型或者`unsigned char`类型

> **3.钩子**
> * ChatGPT说，FreeRTOS的钩子函数(Hooks)是一组可由用户自定义的回调函数

> **4.优先级**
> * 使用FreeRTOS最好把优先级分组选择为`NVIC_PriorityGroup_4`，寄存器的4位bit都设置为抢占优先级，这样就有 0~15 共16个抢占优先级可供选择。因为FreeRTOS的中断配置里不能处理亚优先级（排队优先级）的这种情况。
> * 任务优先级
> * FreeRTOS的任务优先级是0最不优先，越大越优先，和中断优先级相反的哈！



---

## 开始

### 1.1 中断屏蔽
* `configLIBRARY_MAX_SYSCALL_INTERRUPT_PRIORITY`此宏用来设置FreeRTOS系统可以管理的最大优先级。可以自由设置，正点原子设置为5，我也设置为5。也就是说抢占优先级小于5的中断不归FreeRTOS管理。
* `configMAX_SYSCALL_INTERRUPT_PRIORITY`此宏用来设置FreeRTOS系统可以管理的最小优先级。可以自由设置，正点原子和我都设置成15。也就是说抢占优先级大于15的中断不归FreeRTOS管理，当然STM32的优先级只有 0~15 哈。
* 所以上述两个宏加起来的意思就是，**抢占优先级为 0-4 的中断不归FreeRTOS调度，抢占优先级 5-15 的中断服从FreeRTOS的调度。**
*  *Plus: 不归FreeRTOS调度的中断，不可以调用FreeRTOS的API哦，不可以哦！打咩！*

### 1.2 开关中断

### 1.3 临界段代码（临界区）
#### 1.3.1 任务级临界段代码保护

* 函数`taskENTER_CRITICAL()`进入临界区和`taskEXIT_CRITICAL()`退出临界区，是任务级的临界段代码保护。保护这两个函数包夹的区域不会受到中断的打扰。
* **Important1: 这两个函数是成对使用的哦！不可以只用其中一个，它们必须成双成对的出现！就是说，你调用了多少次进入临界段，你就要调用多少次退出临界段来抵消！否则中断会一直被屏蔽！**
*  **Important2: 临界区的代码一定要精简！因为进入了临界区意味着关闭了FreeRTOS可以调度的所有中断，你不精简一点，噼里啪啦一大长串，执行好几秒，可能会导致这些中断得不到及时的响应！**
* 使用场景：任务创建、硬件层初始化、重要的实时性高的代码段...
* 任务级临界段代码保护的使用方法如下:
```c
void testFunction(void)
{
    while(1)
    {
        taskENTER_CRITICAL(); // 进入临界区

        // 你的代码段...
        // 这里是临界区，代码不会受到中断的打断...

        taskEXIT_CRITICAL(); // 退出临界区
    }
}
```


#### 1.3.2 中断级临界段代码保护
* 函数`taskENTER_CRITICAL_FROM_ISR()`进入中断临界区和`taskEXIT_CRITICAL_FROM_ISR(x)`退出中断临界区，是中断级临界段代码保护。
* 和任务级临界段代码保护差不多，只不过这里呢，**进入中断临界区函数**会返回一个Value，执行**退出中断临界区函数**的时候要把得到的Value传给它。Value记录的就是你屏蔽的其他的中断的优先级。**反正你要记住进入中断临界段时接收这个Value，并在退出中断临界段的时候把这个Value放回去！**
* **Important: 也是讲究成双成对出现的！一定要注意！**
* 运用场景：实时性要求最高的代码段（你看，你在中断里打开临界区，屏蔽了自己以外的所有FreeRTOS管理的中断，防止了中断嵌套的情况发生，保护在中断临界区的代码不被打扰
* 中断级临界段代码保护的使用方法如下：
```c
// 定时器3中断服务函数 
// 假设定时器3的抢占优先级在FreeRTOS的调度范围内
void TIM3_IRQHandler(void)
{
    if(TIM_GetITStatus(TIM3, TIM_IT_Update) == SET)
    {
        uint32_t Status_Value = taskENTER_CRITICAL_FROM_ISR();

        // 你的代码段...
        // 这里是中断临界区，屏蔽所有可被FreeRTOS调度的中断...

        taskEXIT_CRITICAL_FROM_ISR(Status_Value);
    }
}
```

---

### 2.1 任务状态

* 运行态
* 就绪态
* 阻塞态
* 挂起态

---

### 2.2 任务的创建

#### 2.2.1 任务创建的API函数
> 函数 **`xTaskCreate()`** ，又名你会用的最多的函数。
> * 用于动态创建一个任务，RAM会自行从FreeRTOS的堆中分配出来。

* `xTaskCreate()`一览：

```c
// 返回值 pdPASS->任务创建成功 / errCOULD_NOT_ALLOCATE_REQUIRED_MEMORY->堆内存不足，创建任务失败
BaseType_t xTaskCreate( TaskFunction_t          pxTaskCode, // 任务函数
                        const char * const      pcName, // 任务名字
                        const uint16_t          usStackDepth, // 任务堆栈大小，实际申请到的堆栈是usStackDepth的4倍
                        void * const            pvParameters, // 传递给任务函数的参数
                        UBaseType_t             uxPriority, // 任务优先级
                        TaskHandle_t * const    pxCreatedTask // 任务句柄
                        )
```

#### 2.2.2 任务删除的API函数

> 函数 **`xTaskDelete()`**
> * 删除一个用`xTaskCreate()`或者`xTaskCreateStatic()`创建的任务。
> * 任务被删除之后，任务不复存在，关于被删除的任务的句柄不能再被使用，除非这个任务重新创建起来。
> * 如果任务是由`xTaskCreate()`创建的（由动态方法创建），那么任务被删除以后，任务的堆栈将在**空闲任务**中得到**释放**，所以删除动态方法创建的任务以后要给空闲任务一些时间来释放空间哦！

* `xTaskDelete()`一览：
  
```c
// 无返回值
void vTaskDelete( TaskHandle_t xTaskToDelete ) // xTaskToDelete是要被删除的任务的任务句柄
```

#### 2.2.3 任务创建与删除的程序示例（动态方法）
* 简单的总结分析一下此例程的流程，因为这是我们使用 FreeRTOS 写的第一个程序，很多习惯是我们后面要用到的。比如使用任务宏定义任务优先级，堆栈大小等，一般有关一个任务的东西我们的放到一起，比如任务堆栈、任务句柄、任务函数声明等，这样方便修改。这些东西可以放到一个.h 头文件里面去，只是例程里面任务数比较少，所以就直接放到 main.c 文件里面了，要是工程比较大的话最好做一个专用的头文件来管理。

#### 2.2.4 任务创建与删除的程序示例（静态方法）
* 和动态方法比较不同的是，想要使用静态方法，你必须自己实现两个接口函数`vApplicationGetIdleTaskMemory()`和`vApplicationGetTimerTaskMemory()`
  
```c
// 空闲任务任务堆栈 // 分配了静态的RAM啦
static StackType_t IdleTaskStack[configMINIMAL_STACK_SIZE];
// 空闲任务控制块
static StaticTask_t IdleTaskTCB;

// 定时器服务任务堆栈 // 分配了静态的RAM啦
static StackType_t TimerTaskStack[configTIMER_TASK_STACK_DEPTH];
// 定时器服务任务控制块
static StaticTask_t TimerTaskTCB;

// 获取空闲任务地任务堆栈和任务控制块内存，因为本例程使用的
// 静态内存，因此空闲任务的任务堆栈和任务控制块的内存就应该
// 有用户来提供，FreeRTOS提供了接口函数vApplicationGetIdleTaskMemory()
// 实现此函数即可。
// ppxIdleTaskTCBBuffer:任务控制块内存
// ppxIdleTaskStackBuffer:任务堆栈内存
// pulIdleTaskStackSize:任务堆栈大小
void vApplicationGetIdleTaskMemory( StaticTask_t **ppxIdleTaskTCBBuffer,
				    StackType_t **ppxIdleTaskStackBuffer,
				    uint32_t *pulIdleTaskStackSize)
{
	*ppxIdleTaskTCBBuffer = &IdleTaskTCB;
	*ppxIdleTaskStackBuffer = IdleTaskStack;
	*pulIdleTaskStackSize = configMINIMAL_STACK_SIZE;
}

// 获取定时器服务任务的任务堆栈和任务控制块内存
// ppxTimerTaskTCBBuffer:任务控制块内存
// ppxTimerTaskStackBuffer:任务堆栈内存
// pulTimerTaskStackSize:任务堆栈大小
void vApplicationGetTimerTaskMemory(StaticTask_t **ppxTimerTaskTCBBuffer,
				    StackType_t **ppxTimerTaskStackBuffer,
				    uint32_t *pulTimerTaskStackSize)
{
	*ppxTimerTaskTCBBuffer = &TimerTaskTCB;
	*ppxTimerTaskStackBuffer = TimerTaskStack;
	*pulTimerTaskStackSize = configTIMER_TASK_STACK_DEPTH;
}
```

#### 2.x.x 任务控制块

#### 2.x.x 任务堆栈

---

### 2.3 任务挂起和恢复

#### 2.3.1 任务挂起的API函数

> 函数 **`vTaskSuspend()`**
> * 该函数用于将某个任务设置为挂起态，任务挂起以后就不会被运行，直到使用`vTaskResume()`或者`xTaskResumeFromISR()`结束任务的挂起态。

* `vTaskSuspend()`一览：

```c
// 无返回值
void vTaskSuspend( TaskHandle_t xTaskToSuspend ) // xTaskToSuspend将要被挂起任务的任务句柄 
                                                 // 注意！如果参数为NULL，表示挂起任务自己。
```

#### 2.3.2 任务恢复的API函数

> 函数 **`vTaskResume()`** ，在主程序中调用
> * 该函数可以也只可以将先前使用`vTaskSuspend()`函数挂起的任务恢复到就绪态。

* `vTaskResume()`一览：

```c
// 无返回值
void vTaskResume( TaskHandle_t xTaskToResume ) // 将要被恢复任务的任务句柄
```

> 函数 **`xTaskResumeFromISR()`** ，在中断函数中调用
> * 该函数是`vTaskResume()`函数的中断版本，需要在中断里调用哈。
> * 该函数可以也只可以将先前使用`vTaskSuspend()`函数挂起的任务恢复到就绪态。

* `xTaskResumeFromISR()`一览：

```c
// 返回值：pdTRUE->恢复的任务优先级 >= 当前任务的优先级，所以在退出中断函数后要进行一次上下文切换
// 返回值：pdFALSE->恢复的任务优先级 < 当前任务的优先级，所以在退出中断函数后不需要进行一次上下文切换
BaseType_t xTaskResumeFromISR( TaskHandle_t xTaskToResume ) // 将要被恢复任务的任务句柄
```

#### 2.3.3 任务挂起和恢复程序示例

---

### 3.1 列表和列表项

#### 3.1.1 列表
为啥要有列表？不是已经可以创建任务运行任务了吗？我的理解是，在做一些大型项目的时候，往往要根据不同的场景执行不同的任务，有时任务比较多了，创建任务和删除任务这些操作就变得弯弯绕绕了。这个时候把任务们归类进不同的列表中，那我切换运用场景的时候，直接切换目前正在执行的列表就行啦！就不用一个一个对任务进行操作，避免了麻烦。

* 列表，是FreeRTOS中的一个数据结构，和链表有点像，是被用做跟踪FreeRTOS中的任务的
* 列表项就是存放在列表当中的项目
* 列表相当于链表，列表项相当于节点，FreeRTOS中的列表是一个双向环形链表
* 常见的列表包括：就绪列表、阻塞列表、挂起列表（目前自己做列表的情况比较少，都是RTOS自动帮我们做好的）


#### 3.1.2 列表项
* 列表项，就是存放在列表中的项目。
* FreeRTOS提供了两种列表项：列表项和迷你列表项。

---

### 4.1 调度器
> 函数 **`vTaskStartScheduler()`** ，开启任务调度器
> * 在`main()`函数里，创建好所需的任务后，即可调用`vTaskStartScheduler()`让任务开始运行吧。

> 函数 **`vTaskEndScheduler()`** ，关闭任务调度器

> 函数 **`vTaskSuspendAll()`** ，挂起任务调度器，就是挂起所有任务

> 函数 **`vTaskResumeAll()`** ，恢复任务调度器，就是恢复所有任务


### 4.2 空闲任务
> * 调用`vTaskStartScheduler()`时候，此函数会自动创建一个名为`IDLE`的任务，这个就是空闲任务！它是FreeRTOS系统自动创建的，不需要用户手动创建。而且任务调动器启动以后必须至少有一个任务在运行中，所以这也是空闲任务存在的意义之一。
> * 空闲任务的优先级最低，是0！任务函数为`prvIdleTask()`（是啥？
> * 空闲任务的作用如下：
> > * 如果系统有任务被删除，被删除的任务的堆栈和任务控制块的内存会在空闲任务中得到释放哦！
> > * 运行用户设置的空闲任务钩子函数（？啥是钩子
> > * 判断是否开启低功耗tickless模式，如果开启的话还需要做相应的处理（？

### 4.3 延时函数
> 函数 **`xTaskDelay()`** ，延时多少时间，用于固定延时（常用的普通的延时函数）

> 函数 **`xTaskDelayUntil()`** ，每隔多少时间执行一次函数，用于周期性执行

---

### 5.1 队列
* 队列是任务到任务、任务到中断、中断到任务数据交流的一种机制（消息传递
* 写队列和读队列的api函数都会自动进入临界区操作的
* 在队列中可以存储数量有限、大小固定的数据。队列中的每一个数据叫做“队列项目”，队列能够存储“队列项目”的最大数量成为队列的长度

### 5.2 二值信号量
* 二值信号量：其实就是一个只有一个队列项的队列，这个特殊的队列要么是满的，要么是空的，这正好是二值！

* 任务和中断使用这个特殊队列不用在乎队列中存的是什么消息，只需要知道这个队列是满的还是空的，就可以利用这个机制来完成任务与中断之间的同步！

#### 5.2.1 二值信号量创建的API函数

> 函数 **`xSemaphoreCreateBinary()`** ，在主程序中调用

* `xSemaphoreCreateBinary()`一览：

```c
// 返回值：NULL->信号量创建失败；其他->创建成功的信号量的句柄
SemaphoreHandle_t xSemaphoreCreateBinary(void) 
```

#### 5.2.2 二值信号量释放的API函数

> 函数 **`xSemaphoreGive()`** ，任务级信号量释放函数
> 函数 **`xSemaphoreGiveISR()`** ，中断级信号量释放函数


* `xSemaphoreGive()`一览：

```c
// 返回值：errQUEUE_FULL->信号量释放失败；pdPASS->信号量释放成功
// 参数： xSemaphore->要释放的信号量句柄
BaseType_t xSemaphoreGive( SemaphoreHandle_t xSemaphore ) 
```

* `xSemaphoreGiveISR()`一览：

```c
// 返回值：errQUEUE_FULL->信号量释放失败；pdPASS->信号量释放成功
// 参数：xSemaphore->要释放的信号量句柄
// 参数：pxHigherPriorityTaskWoken->标记退出此函数是否进行任务切换，用户要做的就是
// 提供一个变量来保存这个值，在退出中断函数前判断一下这个变量，当这个值为pdTRUE时
// 在退出中断函数之前一定要做一次任务切换taskYIELD()！
BaseType_t xSemaphoreGiveISR( SemaphoreHandle_t xSemaphore, BaseType_t* pxHigherPriorityTaskWoken ) 
```

#### 5.2.3 二值信号量获取的API函数

> 函数 **`xSemaphoreTake()`** ，任务级信号量释放函数
> 函数 **`xSemaphoreTakeISR()`** ，中断级信号量释放函数


* `xSemaphoreTake()`一览：

```c
// 返回值：pdFALSE->信号量获取失败；pdTRUE->信号量获取成功
// 参数： xSemaphore->要释放的信号量句柄
// 参数：xBlockTime->阻塞时间
BaseType_t xSemaphoreTake( SemaphoreHandle_t xSemaphore, TickType_t xBlockTime ) 
```

* `xSemaphoreTakeISR()`一览：

```c
// 返回值：pdFALSE->信号量获取失败；pdTRUE->信号量获取成功
// 参数：xSemaphore->要获取信号量句柄
// 参数：pxHigherPriorityTaskWoken->标记退出此函数是否进行任务切换，用户要做的就是
// 提供一个变量来保存这个值，在退出中断函数前判断一下这个变量，当这个值为pdTRUE时
// 在退出中断函数之前一定要做一次任务切换taskYIELD()！
BaseType_t xSemaphoreTakeISR( SemaphoreHandle_t xSemaphore, BaseType_t* pxHigherPriorityTaskWoken ) 
```

### 5.3 计数型信号量
* 计数型信号量就是读取这个队列项的数值，获取信号量的时候自减，释放信号量的时候自增，本质就是一个带值的二值信号量

#### 5.3.1 计数型信号量创建的API函数

> 函数 **`xSemaphoreCreateCounting()`** ，在主程序中调用

* `xSemaphoreCreateCounting()`一览：

```c
// 返回值：NULL->计数型信号量创建失败；其他->创建成功的计数型信号量的句柄
// 参数：uxMaxCount->计数信号量的最大值，当信号量值等于此值时，释放信号量会失败，因为已经满了
// 参数：uxInitialCount->计数信号量的初值
SemaphoreHandle_t xSemaphoreCreateCounting(UBaseType_t uxMaxCount, UBaseType_t uxInitialCount) 
```

#### 5.3.2 计数型信号量释放与获取的API函数
**计数型信号量的释放和获取与二值信号量相同！请看5.2.2和5.2.3！**


### 5.4 互斥信号量
* 但是呢，使用二值信号量可能会导致优先级反转的问题，这个时候我们可以使用！互斥信号量！
* 互斥信号量其实就是一个拥有优先级继承的二值信号量。
* 注意：创建互斥信号量时，会主动释放一次信号量！就是你可以直接获取到！而二值信号量和计数型信号量不行，它们需要手动释放第一次信号量。
* **互斥信号量有优先级继承机制，所以只能用在任务中，不能用于中断服务函数中！**

#### 5.4.1 互斥信号量创建的API函数

> 函数 **`xSemaphoreCreateMutex()`** ，在主程序中调用

* `xSemaphoreCreateMutex()`一览：

```c
// 返回值：NULL->信号量创建失败；其他->创建成功的信号量的句柄
SemaphoreHandle_t xSemaphoreCreateMutex(void) 
```

#### 5.4.2 互斥信号量释放与获取的API函数
**互斥信号量的释放和获取与二值信号量相同！请看5.2.2和5.2.3！**

### 5.5 递归互斥信号量
* 递归互斥信号量可以看作一个特殊的互斥信号量，已经获取了互斥信号量的任务就不能再次获取这个互斥信号量，但是递归互斥信号量不同，已经获取了递归互斥信号量的任务可以再次获取这个递归互斥任务而且次数不限！一个任务使用函数xSemaphoreTakeRecursive()成功的获取了多少次递归互斥信号量就得使用函数xSemaphoreGiveRecursive()释放多少次！
* 注意：要使用递归互斥信号量的话宏configUSE_RECURSIVE_MUTEXES必须为1！

#### 5.5.1 递归互斥信号量创建的API函数

> 函数 **`xSemaphoreCreateRecursiveMutex()`** ，在主程序中调用

* `xSemaphoreCreateRecursiveMutex()`一览：

```c
// 返回值：NULL->信号量创建失败；其他->创建成功的信号量的句柄
SemaphoreHandle_t xSemaphoreCreateRecursiveMutex(void) 
```

#### 5.5.2 递归互斥信号量释放的API函数

> 函数 **`xSemaphoreGiveRecursive()`** ，在主程序中调用

* `xSemaphoreGiveRecursive()`一览：

```c
// 返回值：pdFAIL->信号量释放失败；pdPASS->信号量释放成功
BaseType_t xSemaphoreGiveRecursive( QueueHandle_t xMutex ) 
```

#### 5.5.3 递归互斥信号量获取的API函数

> 函数 **`xSemaphoreTakeRecursive()`** ，在主程序中调用

* `xSemaphoreTakeRecursive()`一览：

```c
// 返回值：pdFAIL->信号量获取失败；pdPASS->信号量获取成功
BaseType_t xSemaphoreTakeRecursive( QueueHandle_t xMutex, TickType_t xTicksTowait ) 
```

---

### 6.1 任务通知
> 任务通知的优势

* **效率更高**！如果使用任务通知来模拟二值信号量，速度快45%（官方测试）！
* **使用内存更小**，使用其他方法时都要先创建对应的结构体，使用任务通知时无需额外创建结构体

> 任务通知的劣势

* **无法在中断服务函数中获得任务通知**，你只能在中断服务函数中发送任务通知
* **无法广播给多个任务（只能一个）**，任务通知只能是被指定的一个任务接收并处理
* **无法缓存多个数据（只能一个）**，任务通知是通过更新任务通知值来发送数据的，任务结构体中只有一个任务通知值，只能保持一个数据

#### 6.1.1 任务通知模拟二值信号量
```c
/* 任务发起通知 */
xTaskNotifyGive(yourTaskHandler);

/* 任务接收通知 */
void yourTask(void * pvPaeameters)
{
    while(1)
    {
        // 接收任务成功后pdTRUE->任务通知值清零，portMAX_DELAY->死等，没任务通知就阻塞
        if(ulTaskNotifyTake(pdTRUE, portMAX_DELAY))
        {
            // do your task
        }
    }
    xTaskDelete(NULL);
}
```

#### 6.1.2 任务通知模拟计数型信号量
```c
/* 任务发起通知 */
xTaskNotifyGive(yourTaskHandler);

/* 任务接收通知 */
void yourTask(void * pvPaeameters)
{
    while(1)
    {
        uint32_t rev = 0;
        // 接收任务成功后pdFALSE->任务通知值自减，portMAX_DELAY->死等，没任务通知就阻塞
        rev = ulTaskNotifyTake(pdFALSE, portMAX_DELAY);
        if(rev)
        {
            // do your task
        }
    }
    xTaskDelete(NULL);
}
```

#### 6.1.3 任务通知模拟消息邮箱（传值）
```c
/* 任务发起通知 */
// valForTransfer->你想要传送的变量值，eSetValueWithOverwrite->设置成可覆写模式
xTaskNotify(yourTaskHandler, valForTransfer, eSetValueWithOverwrite);

/* 任务接收通知 */
void yourTask(void * pvPaeameters)
{
    while(1)
    {
        uint32_t notifyVal = 0;
        // 接收任务成功后，portMAX_DELAY->死等，没任务通知就阻塞
        xTaskNotifyWait(0/*传入值不改变*/, 0xFFFFFFFF/*退出函数后传入值清零*/, &notifyVal, portMAX_DELAY);
        switch(notifyVal)
        {
            // do your task
        }
    }
    xTaskDelete(NULL);
}
```

#### 6.1.4 任务通知模拟事件标志组
```c
/* 任务发起通知 */
// EVENTBIT_X->你想要通知的第几个bit，eSetBits->设置成事件标志组模式
xTaskNotify(yourTaskHandler, EVENTBIT_0/* 通知bit0 */, eSetBits);

xTaskNotify(yourTaskHandler, EVENTBIT_1/* 通知bit1 */, eSetBits);

/* 任务接收通知 */
void yourTask(void * pvPaeameters)
{
    while(1)
    {
        uint32_t notifyVal = 0, eventBit = 0;
        // 接收任务成功后，portMAX_DELAY->死等，没任务通知就阻塞
        xTaskNotifyWait(0/*传入值不改变*/, 0xFFFFFFFF/*退出函数后传入值清零*/, &notifyVal, portMAX_DELAY);
        if(notifyVal & EVENTBIT_0)
        {
            eventBit |= EVENTBIT_0;
        }
        if(notifyVal & EVENTBIT_1)
        {
            eventBit |= EVENTBIT_1;
        }
        if(eventBit == (EVENTBIT_0 | EVENTBIT_1))
        {
            // do your task
        }
    }
    xTaskDelete(NULL);
}
```

### 内核控制函数
####  任务切换的API函数

> 函数 **`taskYIELD()`** ，此函数用于进行任务切换，用的最多的就是出中断的优先级切换时

#### 进入、退出临界区的API函数

> 函数 **`taskENTER_CRITICAL()`** ，进入临界区，用于任务级

> 函数 **`taskENTER_CRITICAL_FROM_ISR()`** ，进入临界区，用于中断级

> 函数 **`taskEXIT_CRITICAL()`** ，退出临界区，用于任务级

> 函数 **`taskEXIT_CRITICAL_FROM_ISR()`** ，退出临界区，用于中断级

#### 中断打开、关闭的API函数
> 函数 **`taskENABLE_INTERRUPTS()`** ，打开中断

> 函数 **`taskDISABLE_INTERRUPTS()`** ，关闭中断

