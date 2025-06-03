---
title: 为STM32添加Lua脚本
excerpt: 为STM32添加Lua脚本（跳针ヾ(≧▽≦*)o=
tags: [Lua, STM32, MCU]
# index_img: /img/post/1.jpg
# banner_img: /img/post/2.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/1.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/2.jpg
categories: Study Page
comment: 'twikoo'
date: 2023-11-14 19:21:00
---

## 为STM32添加Lua脚本🤗

## 软件：keil

## 所需库环境：Malloc, Fatfs

* 声明，这里使用的是正点原子家的源码，感谢开源！
* 上述库环境是为了实现Lua能够从外置存储介质读取文件所准备的，如果没有需求可以不用。

## 主控：STM32F401RET6

* 运行频率：84MHz
* ROM:512KB
* RAM:96KB

## 移植版本：[Lua-v5.3](https://github.com/lua/lua/tree/v5.3)

* 具体版本是Lua-v5.3.5

## 关于Lua

Lua 语言是由巴西里约热内卢天主教大学 (\[Pontifical Catholic University of Rio de janeiro ) 里的一个研究小组与 1993年开发的一种**轻量小巧**的**脚本（弱语言）语言**，用标准 C 语言编写，其设计目的是为了嵌入应用程序中，从而为应用程序提供灵活的扩展和定制功能。

作为一种扩展语言，Lua 没有“主”程序的概念：它嵌入在宿主客户端中运行，称为嵌入程序或简称为宿主。（通常这个宿主是单机lua程序） **宿主程序可以调用函数执行一段Lua代码，可以读写Lua变量，可以注册Lua代码调用的C函数**。通过使用 C 函数，可以增强 Lua 以应对广泛的不同领域，从而创建共享语法框架的定制编程语言。

* 简单来说，Lua是一种轻量级的基于C编写的运行高效的脚本语言（解释性语言like：Python、shell、Matlab等。
* 在单片机环境下移植Lua，因为Lua和C的超级无敌兼容性，相当于你同时拥有了两种语言加持（C和Lua），你可以直接用Lua内部提供的几个简单的API，使得C内运行Lua脚本，特别方便，避免了重复烧录的麻烦。
* **Lua解释器的移植，最小占用ROM: 70KB，占用RAM: 7.5KB(很小很小)**
* 简单的lua程序跟C程序效率比是1：100。而lua运算量越大。与C程序效率差距就越小。

## 准备工作

1. 在github上拉取Lua-v5.3的版本库: [lua/lua at v5.3](https://github.com/lua/lua/tree/v5.3)
2. 建立一个基于主控STM32F401RET6的Keil文件(已经有的话就不需要，直接哐哐移植)

## 开始移植

#### 移植Lua库文件

1. 将github上拉取的 lua-5.3 文件夹移入工程文件夹。
2. 打开Keil，点击魔术棒，将..\lua-5.3 相对路径添加到环境变量。
3. 点击三个盒子，创建一个文件夹命名为Lua，将..\lua-5.3 相对路径下的所有.c文件（除了Lua.c和Luac.c以外，如果有的话，没有就不管）添加到其中。
4. 更改 loslib.c 文件下部分内容：

> 1. 将 **os\_exit(lua\_State \* L)** 函数中 **if(L) exit(status)** 注释，并添加 **status=status** 语句。
> 2. 添加 **time(time\_t \*time)** 和 **system(const char \* string)** 。
> 3. 将魔术棒里的 **Use MicroLIB** 模式关闭（不打勾！）。
>
> ```c
> static int os_exit (lua_State *L) {
>   int status;
>   if (lua_isboolean(L, 1))
>     status = (lua_toboolean(L, 1) ? EXIT_SUCCESS : EXIT_FAILURE);
>   else
>     status = (int)luaL_optinteger(L, 1, EXIT_SUCCESS);
>   if (lua_toboolean(L, 2))
>     lua_close(L);
> /* 'if' to avoid warnings for unreachable 'return' */
>   //if (L) exit(status);  
>
>   status=status;
>   return 0;
> }
>  
> time_t time(time_t *time)
> {
>     return 0;
> }
>  
> int system(const char * string)
> {
>     return 0;
> }
> ```

* 最后可以去**linit.c**注释一些用不到的Lua库，当然，不注释也不会影响太大。

```c
/*
** these libs are loaded by lua.c and are readily available to any Lua
** program
*/
static const luaL_Reg loadedlibs[] = {
  {"_G", luaopen_base},
  {LUA_LOADLIBNAME, luaopen_package},
  {LUA_COLIBNAME, luaopen_coroutine},
  {LUA_TABLIBNAME, luaopen_table},
//  {LUA_IOLIBNAME, luaopen_io},
//  {LUA_OSLIBNAME, luaopen_os},
  {LUA_STRLIBNAME, luaopen_string},
  {LUA_MATHLIBNAME, luaopen_math},
  {LUA_UTF8LIBNAME, luaopen_utf8},
//  {LUA_DBLIBNAME, luaopen_debug},
#if defined(LUA_COMPAT_BITLIB)
  {LUA_BITLIBNAME, luaopen_bit32},
#endif
  {NULL, NULL}
};
```

#### 添加retarget.c

> * 放哪随意，我基于正点原子的工程放在了system的文件夹中
> * 引进这个库的目的是为了实现Lua从外置的存储介质中获取文件内容，我们需要用Fatfs的API去实现Lua所需的fopen、fclose、fread等函数（如果没有这个需求，可以跳过此步骤）
> * 声明本次移植使用的Fatfs，来自正点原子的Fatfs实验源码，好用爱用，给个好评。

{% fold info @retarget.c 源码内容 %}

```c
#include <ctype.h>
#include <rt_sys.h>
#include <stdint.h>
#include <time.h>
#include "usart.h"

// 是否将fopen与FatFS关联起来
#define FATFS_EN 1

#if FATFS_EN
#include <ff.h>
#include <stdlib.h>
#endif

// #pragma import(__use_no_semihosting) // 禁用半主机模式 //已经在usart.c中定义
#pragma import(__use_no_semihosting_swi) // 即不使用半主机模式，防止程序进入软件中断
// #pragma import(_main_redirection)

#define STDIN 0
#define STDOUT 1
#define STDERR 2
#define IS_STD(fh) ((fh) >= 0 && (fh) <= 2)

/*
 * These names are used during library initialization as the
 * file names opened for stdin, stdout, and stderr.
 * As we define _sys_open() to always return the same file handle,
 * these can be left as their default values.
 */
const char __stdin_name[] = ":kkl";
const char __stdout_name[] = "kkl";
const char __stderr_name[] = "kkl";

FILEHANDLE _sys_open(const char *name, int openmode)
{
#if FATFS_EN
    BYTE mode;
    FIL *fp;
    FRESULT fr;
#endif
    if (name == __stdin_name)
        return STDIN;
    else if (name == __stdout_name)
    {
        uart_init(115200); // 初始化串口 (在main函数执行前执行)
        return STDOUT;
    }
    else if (name == __stderr_name)
        return STDERR;
#if FATFS_EN
    if (sizeof(FILEHANDLE) < sizeof(void *))
    {
        USART1_SendBuf("sizeof(FILEHANDLE) should be no less than sizeof(void *)!\n");
        return -1;
    }
    fp = ff_memalloc(sizeof(FIL)); // 使用自己的malloc函数替换
    if (fp == NULL)
        return -1;

    /* http://elm-chan.org/fsw/ff/doc/open.html */
    if (openmode & OPEN_W)
    {
        mode = FA_CREATE_ALWAYS | FA_WRITE;
        if (openmode & OPEN_PLUS)
            mode |= FA_READ;
    }
    else if (openmode & OPEN_A)
    {
        mode = FA_OPEN_APPEND | FA_WRITE;
        if (openmode & OPEN_PLUS)
            mode |= FA_READ;
    }
    else
    {
        mode = FA_READ;
        if (openmode & OPEN_PLUS)
            mode |= FA_WRITE;
    }

    fr = f_open(fp, name, mode);
    if (fr == FR_OK)
        return (uintptr_t)fp;

    ff_memfree(fp); // 使用自己的free函数替换
#endif

    return -1;
}

int _sys_close(FILEHANDLE fh)
{
#if FATFS_EN
    FRESULT fr;
#endif

    if (IS_STD(fh))
    {
        if (fh == STDOUT)
            // usart_deinit();
            return 0;
    }

#if FATFS_EN
    fr = f_close((FIL *)fh);
    if (fr == FR_OK)
    {
        ff_memfree((void *)fh);// 使用自己的free函数替换
        return 0;
    }
#endif

    return -1;
}

int _sys_write(FILEHANDLE fh, const unsigned char *buf, unsigned len, int mode)
{
#if FATFS_EN
    FRESULT fr;
    UINT bw;
#endif

    if (fh == STDIN)
        return -1;

    if (fh == STDOUT || fh == STDERR)
    {
        USART1_SendBuf((unsigned char *)buf);
        return 0;
    }

#if FATFS_EN
    fr = f_write((FIL *)fh, buf, len, &bw);
    if (fr == FR_OK)
        return len - bw;
#endif

    return -1;
}

int _sys_read(FILEHANDLE fh, unsigned char *buf, unsigned len, int mode)
{
    // char ch;
    int i = 0;
#if FATFS_EN
    FRESULT fr;
    UINT br;
#endif

    if (fh == STDIN)
    {
        while (i < len)
        {
            //     ch = usart_receive(); // 这里需要实现串口收到字符串传入buf的功能
            //     if (isprint(ch))
            //     {
            //         buf[i++] = ch;
            //         usart_send(ch);
            //     }
            //     else if (ch == '\r')
            //     {
            //         buf[i++] = '\n';
            //         usart_send('\n');
            //         break;
            //     }
            //     else if (i > 0 && ch == '\b')
            //     {
            //         i--;
            //         usart_send_string("\b \b", 3);
            //     }
            i--;
        }

        return len - i;
    }
    else if (fh == STDOUT || fh == STDERR)
        return -1;

#if FATFS_EN
    fr = f_read((FIL *)fh, buf, len, &br);
    if (fr == FR_OK)
        return len - br;
#endif

    return -1;
}

// 检查句柄是否为终端
int _sys_istty(FILEHANDLE fh)
{
    return IS_STD(fh);
}

int _sys_seek(FILEHANDLE fh, long pos)
{
#if FATFS_EN
    FRESULT fr;

    if (!IS_STD(fh))
    {
        fr = f_lseek((FIL *)fh, pos);
        if (fr == FR_OK)
            return 0;
    }
#endif
    return -1;
}

// 刷星句柄关联的缓冲区
int _sys_ensure(FILEHANDLE fh)
{

    return 0;
}

// 返回文件当前长度
long _sys_flen(FILEHANDLE fh)
{
#if FATFS_EN
    if (!IS_STD(fh))
        return f_size((FIL *)fh);
#endif
    return -1;
}

// 在usart.c中定义了，注释防止重复定义
// void _sys_exit(int status)
//{
////while(1);
//}

int _sys_tmpnam(char *name, int fileno, unsigned maxlength)
{

    return 0;
}

// 将一个字符写入控制台
void _ttywrch(int ch)
{
    USART1_SendChar(ch);
}

int remove(const char *filename)
{

    return 0;
}

int rename(const char *oldname, const char *newname)
{

    return 0;
}

// 定义main函数argv的内容
char *_sys_command_string(char *cmd, int len)
{
    // 可以把命令行内容放入大小为len的cmd缓存区然后返回
    // 也可以直接返回一个字符串
    // return "./foo -f bar";
    return NULL;
}

// 在loslib.c中已有定义，防止重复定义，这里注释掉
// time_t time(time_t * time)
//{
//	return 0;
// }

clock_t clock(void)
{
    return 0;
}

```

{% endfold %}

## 排查错误

因为我用的是正点原子的USART的代码，它们家是没有勾**Use MicroLIB** 模式的，一些配置会重复，所以我们要自己改一些东西，不然编译没法通过。

* 打开usart.c，更改以下部分内容：

> 1. 注释**FILE \_\_stdout;**

因为移植了Lua解释器，所以我们的**堆栈分配**应该相应的分配更大一些。

* 打开启动文件（**startup\_stm32f40\_41xxx.s**），更改以下部分内容：

> 1. 修改栈：**Stack\_Size      EQU     0x00001000 //4k //不行就改成0x00004000**
> 2. 修改堆：**Heap\_Size       EQU     0x00002c00 //11k //不行就改成0x00004000**

* 打开**luaconf.h**

> 1. 添加 **#define LUA\_32BITS**

```c
/*
@@ LUA_32BITS enables Lua with 32-bit integers and 32-bit floats. You
** can also define LUA_32BITS in the make file, but changing here you
** ensure that all software connected to Lua will be compiled with the
** same configuration.
*/
/* #define LUA_32BITS */
 #define LUA_32BITS
```

OK！这时候再编译应该不会有报错，是可以通过的！

## 使用方法

```c
/* 将C函数注册成Lua可调用的函数 */
static int lua_led_on(lua_State * L)
{
	LED0 = 0;
	return 1;
}

/* 将C函数注册成Lua可调用的函数 */
static int lua_print_hello(lua_State * L)
{
	printf("Hello this is lua!\r\n");
	return 1;
}

/* 将C函数注册成Lua可调用的函数 */
static const struct luaL_Reg mylib[] =
{
	{"led_on",lua_led_on},
	{"print_hello",lua_print_hello},
	{NULL, NULL}
};

/* 编写Lua脚本 */
/* 这个程序中，我们点亮了led，同时打印了Hello this is lua!\r\n */
/* 接着，程序的主导权就会归还给c继续执行c程序 */
/* 当然你也可以直接在这里写个 while 循环，这样后面的c程序都不再执行，直至退出循环 */
const char LUA_SCRIPT_GLOBAL_ON[]="\
	led_on()\
	print_hello()\
";

/* 运行Lua脚本 */
/* 将这个函数丢到程序里面去，比方说main函数里头 */
static int do_file_script(void)
{
	lua_State *L;
	L = luaL_newstate();
	luaopen_base(L);
	luaL_setfuncs(L, mylib, 0); // 使我们注册的函数生效
	luaL_dostring(L, LUA_SCRIPT_GLOBAL_ON); // 执行我们写的Lua文本脚本程序

	return 0;
}
```

Lua还有更多的可玩性，上面的仅仅只是其中一种 - **luaL\_dostring**！

下面再介绍一种 - **luaL\_dofile**！

```c
static int lua_led_on(lua_State * L)
{
	LED0 = 0;
	return 1;
}

static int lua_print_hello(lua_State * L)
{
	printf("Hello this is lua!\r\n");
	return 1;
}

static const struct luaL_Reg mylib[] =
{
	{"led_on",lua_led_on},
	{"print_hello",lua_print_hello},
	{NULL, NULL}
};

static int do_file_script(void)
{
	uint8_t res;
	lua_State *L;
	L = luaL_newstate(); //创建Lua虚拟机
	luaopen_base(L); // 配置基本环境
	luaL_openlibs(L); // 注册所使用到的各种Lua库
	luaL_setfuncs(L, mylib, 0); // 注册函数

	res = luaL_dofile(L, "1:/test.lua"); // 这里我事先把test.lua存储到了外部flash里，所以这里可以写具体位置去读取并运行这个文件
	if(res) // 返回1，说明读取失败，返回0，为读取成功
	{
		printf("err\r\n");
	}
	else
	{
		printf("ok\r\n");
	}
	return 0;
}
```

> Lua调用C函数的注意事项：
> 对于可被Lua调用的C函数而言，其接口必须遵循Lua要求的形式，即
> **typedef int (lua\_CFunction)(lua\_State\* L);**
> 接收一个参数Lua\_State\*，即Lua的状态，返回值表示压入栈中的结果个数。

如果想要注册有传入参数且有返回值的函数，可以参考以下：

```c
static int Add(lua_State *L)
{
	int count;
	int x,y,res;

	x = lua_tointeger(L,1);		//获取Lua传递的参数
	y = lua_tointeger(L,2);

	res = x + y;	//计算x+y

	lua_pushnumber(L,res);		//结果压入栈中，供Lua提取

	return 1;	//返回参数个数！！这是通知LUA调用者有一个值返回
}

//Lua中调用
local res
res = Add(5,6)
print("Result = ",res)
```

## 写在后面

写完啦...

### Author: @kkl