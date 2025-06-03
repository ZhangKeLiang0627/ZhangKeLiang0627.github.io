---
title: Git与VScode联合使用的源代码管理指南
excerpt: GitxVScode-CodeManageGuide | 建议有一点Git管理基础的人使用！至少你得Github有号吧，是吧（玩笑！
tags: [Git]
# index_img: /img/post/11.jpg
# banner_img: /img/post/7.jpg
index_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/18.jpg
banner_img: https://hugokkl.oss-cn-shenzhen.aliyuncs.com/blog/post/18.jpg
categories: Study Page
# hide: true
date: 2023-12-9 0:11:00
---

## GitxVScode-CodeManageGuide
### Git与VScode联合使用的源代码管理指南
### Author: @kkl

---

## 前言
* ~~建议有一点Git管理基础的人使用！至少你得Github有号吧，是吧（玩笑！~~
* 这些指令其实并不常用，我们只是稍作理解，剩下的交给Vscode点点点吧！

---

## 相关插件

1. Git Graph

可以清晰地看到存储仓库的每一次提交(Commit)，每一个分支(Branch)，和每一次合并的记录，非常nice！
同时可以很方便的查询每一次的记录，进行文件代码比对。
  
2. GitLens

可以直接在源代码里看到每一行代码的更改时间！

3. GitHistory

和Git Graph功能类似，细节注重点不太一样。
  

## 常用操作
### 提交 (Commit)

这个操作我们使用VScode自带的源代码管理来完成。
暂存我们所需的修改之后点击提交，接着会跳转到`COMMIT_EDITMSG`文件页面，顾名思义就是提交编辑信息。
你可以在这个文件最顶部写一些你这次提交的一些消息备注。写完保存，关掉这个文件页面，即可完成一次提交！

>  `git add .`添加所有被修改文件到暂存更改区
> `git commit -m "massage"` 提交暂存更改区的内容作为一个新版本，`massage`为该版本的关键字
> `-m`的作用就是可以不弹窗直接写关键字，如果你只输入`git commit`就会弹出一个窗口让你填写该版本的关键字。



### 推送 (Push)

> 这个操作需要我们的VScode关联自己的Github仓库后才可以使用。

提交之后，提交记录会暂存在我们本地的仓库内，如果想要把提交记录推送至Github，我们只需要在VScode的源代码管理里选择推送即可。

如果你Github没有创建相关的仓库，VScode也会弹窗让你创建的！

### 签出到 (Checkout)

> `git checkout branch_name`切换分支。 
> 切换分支的时候要保证当前暂存区没有需要修改的文件哦！可以用`git status`确保现在的状态是`clean`，否则就会切换分支失败了。

### 版本回退 (Reset)

有3种常用的回退方式，分别是`soft`, `mixed`, `hard`


第一种：

`soft`回退方式只会把Head指针往回指到你回退的版本，然后你仓库里的文件不会发生任何的增删，状态大概就是你已经commit了，但是没有push的状态。（？不知道理解的对不对

> `git reset --soft <Hash>`（这里`<Hash>`是你的版本号哈！

第二种：

`mixed`回退方式，会把Head指针往回指到我们希望回退到的版本，然后仓库里的文件也不会发生任何的增删（暂时），为什么说是暂时呢？因为它把你这个回退版本之后所有的commit都放回了暂存更改区，你就可以在暂存更改区里决定要恢复什么文件，恢复什么代码啦！

> `git reset --mixed <Hash>`

第三种：

`hard`回退方式，会把Head指针往回指到我们希望回退到的版本，然后该版本号以后的版本统统都会不见使用`git log`时就看不见当前回退版本以后的版本号了（所以要谨慎！

> `git reset --hard <Hash>`

这种回退方式会简单粗暴的把你本地仓库回退版本的什么文件啊什么代码原封不动地一字不拉地归还它的原样！
当然，你仍然可以通过`git reflog`找回从前的版本号，然后使用`git reset --hard <Hash>`跳回去，**理论上，你的代码不会丢，** nice！

> `git reset --hard HEAD^`表示硬回退到**上一个**版本
> 同理`HEAD^^`表示**上上个**版本，`HEAD^^^`表示**上上上个**版本，而且你也可以用`HEAD~3`表示**上上上个**版本噢！

## 辅助操作

### 记录查看 (log)
* `git log`

> `git log`用来查看commit提交历史记录。
> `git log --graph`这条命令使用了就会有优雅的树状图可以看啦（也不算是树状图，反正就是图形化显示
> 在终端按`Q`键退出日志哦！

* `git reflog`

> 用来查看Git仓库的所有git命令操作的历史记录，比如你用过的`reset`, `checkout`, `commit`, `push` 的记录都能在这里看到。

* `git status`

> 用来查看本地仓库状态。

### 清除已经被跟踪的文件

如果文件已经被 Git 跟踪（即已经提交到仓库），那么修改`.gitignore`文件将不会对这些文件产生任何效果。你需要先从 Git 的跟踪列表中移除这些文件。你可以使用：

> `git rm --cached <file>`，清除单个文件.
> `git rm -r --cached <file>`，清除文件夹以及文件夹内的所有内容.

### 分支查找 (branch)

* `git branch`

> `git branch`用来查看当前所在的分支。
> `git branch -v`用来查看当前所在分支最后一次提交的版本号和版本关键字。
> `git branch branch_name`用来创建名字为`branch_name`的新分支。

### 远程仓库克隆 (clone)

* `git clone`

> `git clone <address>`老熟人了，打开一个文件夹，打开它的命令行窗口，你就敲上面的命令，`<address>`是被克隆的远程仓库的地址。就这个命令可以完成目前所有开源项目90%的克隆。
> `git clone --recursive <address>`剩下的10%就比较专业一点，可能人家远程代码库里运用了别人的子项目，你直接克隆下来就是个空文件夹，所以你就需要用这个命令来**递归**克隆！把别人子项目的内容也可以克隆下来！

### 本地仓库初始化 (init)
* `git init`

> 在该文件夹下初始化git仓库.

### 给本地git仓库添加一个云端仓库地址 (remote)

- `git remote add origin + url`

- 通过以下命令来看到目前本地仓库的链接：`git remote -v` 

### 提交 PullRequest (PR)

#### 常规流程

- `fork` 原仓库为你的origin仓库；

- `clone` 你的origin仓库下来；

- `git checkout -b dev`或者`git branch dev + git checkout dev` 从主分支切换到dev分支（dev这个名字可以自定义的，爱写啥写啥；

- 在dev分支当中完成内容的增删改查；

- 检查没问题后，将内容提交到origin云仓库：

> 1. `git add .` 添加修改好的内容；
> 2. `git commit -m "你本次提交的描述"` 提交内容（双引号不可去掉哦；
> 3. `git push -u origin dev` 上传到云端仓库的dev分支.

- 做好内容修改，提交到origin仓库后，然后点击`Contribute`提交 Pull Request.

#### 原仓库超前origin仓库

> 直接在你fork下来的origin仓库里，点击`Sync fork`同步原仓库的内容，然后`fetch`同步到本地仓库，做好内容修改，然后提交到origin仓库，然后点击 Contribute 提交 Pull Request；

如果origin仓库领先本地仓库的话（如何fetch，本地仓库想要提交新的commit，需要执行以下命令：

- `git fetch origin`或者`git fetch` 拉取origin仓库最新的提交；

- 然后切换到对应dev分支，进行同步：`git merge origin/HEAD`；


### 本地仓库全局配置 (config)
* `git config`

在初始化完成Git本地仓库后，开始正式使用前，是需要有一些全局设置的，如用户名、邮箱等：

> `git config --global user.name "your name"`用于设置全局用户名
> `git config --global uer.email "your email"`用于设置全局邮箱
> 其中，`--global`指定全局配置，不使用该参数，则为当前所在仓库配置。

于是可以如下配置：

> `git config --global user.name "xxx"`
> `git config --global uer.email "xxx.example.com"`

可以输入以下两条指令，检查用户名和邮箱是否输入正确。

> `git config user.name`
> `git config user.email`

<!-- > 我的Github用户名和邮箱： -->
<script >
function checkPassword() {
  var password = document.getElementById("password").value;
  if (password === "0000") {
  document.getElementById("user").style.display = "block";
  } else {
  alert("不准偷看！！！");
  document.getElementById("user").style.display = "none";
  }
}
</script>

<body title="哒咩">
  口令是什么？
  <input type="password" id="password">
  <button onclick="checkPassword()" style="border-radius: 5px;">确认</button>
  <div id="user" style="display: none;">
    <p>俺滴Github用户名：ZhangKeLiang0627</p>
    <p>俺滴Github邮箱：1184665829@qq.com</p>
  </div>
</body>

<style>
  input[type="password"] {
    padding: 3px;
    margin: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  #user {
    display: none;
    background-color: #f4f4f4;
    padding: 5px;
    margin-top: 10px;
    border-radius: 5px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
</style>

## FAQ

{% note primary %}
今天遇到了一个问题：叫我反复添加用户名和邮箱才可以提交commit到origin仓库

起初我使用的命令是（双引号不可去：

- `git config --global user.name  "yourname"`
- `git config --global user.email "youremail"`

但是始终不太行，然后我通过ai得到解答：

以上的命令是对git的全局设置，可能有些仓库不适合这个命令，或者这个仓库已经有了设置，优先覆盖了全局设置，以下是解决办法。

先输入命令：

- `git config user.name`
- `git config user.email`

查看一下本地仓库是否已经有设置了，如果没有，局部只对这个仓库设置一下即可：

- `git config user.name  "Hugo Zhang"`
- `git config user.email "1184665829@qq.com"`
{% endnote %}
