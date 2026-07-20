---
title: 告别命令行启动：用`exe4j`将`Java`项目打包为`EXE`可执行文件
cover: /assets/exe4j-cover.png
icon: file
author: 诚
date: 2024-04-28
category:
  - Java
  - exe4j
  - 打包
tag:
  - Java
  - exe4j
  - EXE
  - JAR
  - Maven
  - 打包部署
sticky: false
star: false
footer:
copyright: CC BY-SA 4.0
---

# 告别命令行启动：用`exe4j`将`Java`项目打包为`EXE`可执行文件

你的 `Java` 程序写好了，发给同事——对方双击 `jar` 发现打不开，命令行启动又嫌麻烦，电脑上还得先装 `JDK`。对于 Windows 普通用户来说，他们只认一种文件：双击就能跑的 `exe`。

`exe4j` 就是干这个的——把 `JAR` 包封装成原生的 Windows 可执行文件，支持自定义图标、捆绑 `JRE`，用户双击即用，完全感知不到背后是 `Java`。

## 一、整体流程

分三步走：

1. **打好胖 JAR**：把主程序 + 所有第三方依赖打进一个 `jar`（两种方式：`IDEA` 构建工件 或 `Maven` 插件）
2. **exe4j 封装**：把 `jar` 包转成 `exe`，指定图标、JRE 版本
3. **捆绑 JRE**：把 `JRE` 目录放在 `exe` 旁边，换台电脑也能跑

下面逐个展开。先介绍两种打包 JAR 的方式。

## 二、方式一：IDEA 构建工件打包 JAR

`IntelliJ IDEA` 自带工件（`Artifact`）功能，不用写一行配置就能把项目及其依赖打成 `jar`，适合小项目或不想碰 `Maven` 配置的情况。

### **2.1 配置工件**

`File` → `Project Structure`（快捷键 `Ctrl + Alt + Shift + S`）

![配置工件](./assets/ScreenShot_2026-06-28_135941_783.png)



左侧选择 `Artifacts` → 点击 `+` → `JAR` → `From modules with dependencies`

![配置工件](./assets/ScreenShot_2026-06-28_140159_584.png)

![配置工件](./assets/ScreenShot_2026-06-28_140124_041.png)



弹出配置对话框：

| 配置项 | 设置值 | 说明 |
|--------|--------|------|
| Module | 选择你的主模块 | 通常就是你的项目名 |
| Main Class | 选择带 `main` 方法的启动类 | 必填，否则 jar 无法双击执行 |
| JAR files from libraries | 选 `extract to the target JAR` | 将依赖解压后打入同一个 jar（即胖 JAR） |
| Directory for META-INF/MANIFEST.MF | 保持默认 `src/main/java` 或改为 `src/main/resources` | 若与已有文件冲突需调整 |

![配置工件](./assets/ScreenShot_2026-06-28_140332_310.png)

如图所示，`AppFrame`类就包含我的`main`方法，我在里边写了一个带GUI的程序。



点击 `OK`

`extract to the target JAR` 的含义：将所有第三方 `jar` 包解压为 `class` 文件，再一起打进目标 `jar`。这样做的好处是最终只有一个 `jar` 文件，不会出现依赖路径问题。`copy to the output directory and link via manifest` 则保持依赖为独立 `jar`，运行时需要携带整个 `lib/` 目录。

### **2.2 构建 JAR**

顶部菜单 `Build` → `Build Artifacts`

![构建 JAR](./assets/ScreenShot_2026-06-28_140540_088.png)

在弹出的菜单中选择刚创建的工件 → `Build`

![构建 JAR](./assets/ScreenShot_2026-06-28_140621_813.png)

等待构建完成，输出目录在 `out/artifacts/YourProject_jar/` 下

![输出](./assets/ScreenShot_2026-06-28_140652_847.png)

该目录中的 `YourProject.jar` 即包含所有依赖的可执行 JAR

### **2.3 验证 JAR 能否运行**

构建完成后，打开终端进入输出目录，执行：

```bash
java -jar YourProject.jar
```

如果能正常启动，说明工件配置正确，可以进入下一步 exe4j 封装。

> 如果 IDEA 生成的 `MANIFEST.MF` 文件路径在 `src/main/java` 下，后续项目编译可能会报"已存在"的冲突。遇到这种情况，在工件配置中将 `Directory for META-INF/MANIFEST.MF` 改为 `src/main/resources` 即可。

## 三、方式二：Maven 打包胖 JAR

默认 `mvn package` 生成的 `jar` **不含第三方依赖**——发给别人就报 `ClassNotFoundException`。需要用 `maven-assembly-plugin` 打出带依赖的胖 JAR。

`pom.xml` 配置：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-assembly-plugin</artifactId>
            <version>3.6.0</version>
            <configuration>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
                <archive>
                    <manifest>
                        <!-- 替换为你的主启动类 -->
                        <mainClass>com.example.MainForm</mainClass>
                    </manifest>
                </archive>
            </configuration>
            <executions>
                <execution>
                    <id>make-assembly</id>
                    <phase>package</phase>
                    <goals>
                        <goal>single</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

然后在 IDEA 右侧 `Maven` 面板中双击 `package`，或在终端执行：

```bash
mvn clean package
```

![Maven 打包胖 JAR](./assets/be8a80f6623757eca09433dd4a13e255.png)

生成后 `target` 目录下会有两个 `jar`：

- `YourApp.jar` — 不含依赖（忽略）
- `YourApp-jar-with-dependencies.jar` — **带依赖的胖 JAR，用这个**

## 四、exe4j 下载与注册

去官网下载安装：[https://www.ej-technologies.com/download/exe4j/files](https://www.ej-technologies.com/download/exe4j/files)

![exe4j 下载](./assets/ScreenShot_2026-06-28_143721_091.png)

安装就是一路 `Next`。首次打开会提示输入 `License key`，没有的话可以用试用版（功能完整，生成的 exe 会弹试用提示框）。或者另外在网上搜一个激活码，名字和公司随便写，`License key`随便搜一下都能用。

> exe4j 6.0 及以上版本需要 JDK 1.8 及以上。

![exe4j 注册](./assets/ScreenShot_2026-06-28_144900_814.png)

这里可以用我在网上找到的：`A-XVK258563F-1p41v7mg7sav`, 或者下边这一个：`L-g782dn2d-1f1yqxx1rv1sqd` ;

激活码这一步只需要设置一次，之后系统会自动记忆上次的激活码。

## 五、exe4j 打包步骤

打开 exe4j，核心步骤就这些（其他页面直接 Next 跳过）：

| 步骤 | 操作 |
|------|------|
| **1. 选择模式** | 选 `"JAR in EXE" mode` |
| **2. 命名输出** | 应用短名 + 输出目录 |
| **3. 配置 EXE** | 可执行文件名 + 图标（`.ico` 文件，可选） |
| **4. 添加 JAR** | 点击 `+`，加载上一步打的胖 JAR |
| **5. 指定主类** | 在 `Main class` 下拉中选择带 `main` 方法的启动类 |
| **6. 设置 JRE** | 最低版本一般填 `1.8`，最高可留空 |
| **7. 捆绑 JRE** | 添加 JRE 搜索序列（见下一节） |
| **8. 64 位模式** | 勾选 `Generate 64-bit executable`（避免在 64 位系统报错） |
| **9. 完成** | 点击完成，生成 `exe` |

> 第 8 步勾选 64 位后，第 6 步的 JRE 配置页中 `Advanced Options` 里也要选对应的 64 位 JVM 配置项，否则打包可能失败。

下边是详细讲解 `exe4j `的配置步骤



### 5.1 选择模式(project type)

因为我们是通过`jar`的方式打包，所以我们选择 选 `"JAR in EXE" mode` 模式

![选择模式](./assets/a74d2b1b771a59c166e29fe22f202554.png)



### 5.2 命名输出(Application Info)

![命名输出](./assets/e6b4fb21523266a7e9e3d540f8f452e0.png)



![配置](./assets/ScreenShot_2026-06-28_153818_727.png)

设置文件名称和输出目录。

Distribution source directory (分发源目录)

- **含义**：这是你**源代码编译后的文件夹**（也就是包含 `.class`文件或依赖 jar 包的目录）。
- **作用**：它是整个打包过程的“基准点”。exe4j 会根据这个目录来找你要打包的文件。

### 5.3 配置 EXE

这里可以配置你的应用程序是GUI还是控制台程序，还是服务器程序，设置应用程序名称，设置图标，以及是否是单例模式(避免重复启动)

![配置 EXE](./assets/d554cd12beb59aa2219d89349e0befb7.png)

这里可以设置自动保存错误日志，可以设置以覆写的方式保存，还是追加的方式保存日志。插件会自动检测你`try - catch` 语句中的`println`语句，然后保存到文件中。

![配置日志](./assets/ScreenShot_2026-06-28_161210_836.png)

![配置](./assets/ScreenShot_2026-06-28_160821_093.png)



![配置](./assets/b2c05d5f952eddc55fcf1025c9e40128.png)



### 5.4 添加 JAR & 指定主类

![添加 JAR](./assets/a10eacf414e5b8b628a82b33a8f7c2f8.png)

> 选择带第三方依赖的jar包进行加载

![添加 JAR](./assets/4e0b021c61d5b5a171290042a50132e3.png)

> 选择对应的jar

![添加 JAR](./assets/6210e8942b92ffd60707a12815818a71.png)

> 选择主函数所在启动类

![指定主类](./assets/f9d39be7f9247aa61be4e3b9679f550e.png)

### 5.5 设置 JRE

![设置 JRE](./assets/9c2943f0e8042ccf955a2828f73f2b4e.png)

捆绑`JRE`见下一节。

## 六、捆绑 JRE，实现跨机器运行

这是最关键的一步——如果只生成 `exe` 而不配置 `JRE`，换台没装 `JDK` 的电脑就启动不了。

**操作：**

1. 在 `exe4j` 的 `JRE` 配置步骤，点击 `+` 添加一条搜索序列
2. 条目类型选 `Directory`，路径填相对路径 `.\jre`。**这里只是告诉它`jre`环境会在哪个目录下，后面不会自动生成`jre`环境，还需要手动拷贝`jre`，放到相应目录下**
3. 把新加的条目**上移到最顶部**——`exe` 启动时按列表顺序搜索 `JRE`，优先找自带的。
4. 生成 `exe` 后，手动从你的 `JDK` 安装目录中复制 `jre` 文件夹，放到 `exe` 同级目录下

最终分发的文件夹结构：

```
MyApp/
├── MyApp.exe          ← exe4j 生成
└── jre/               ← 从 JDK 目录复制的 JRE 目录
    ├── bin/
    ├── lib/
    └── ...
```

把整个 `MyApp/` 文件夹压缩发给用户，解压后双击 `exe` 即可运行，无需安装任何东西。

找 `JDK` 路径：终端执行 `where java`（`Windows`），输出的路径中 `bin/java` 的上级就是 `JDK` 根目录，里面就有 `jre` 文件夹。

![捆绑 JRE](./assets/4947110fd4474b19ce87217ff09d26d1.png)



![捆绑 JRE](./assets/c76cb8f4506eb4f253233d9ec27ff506-1782633128099-25.png)

![捆绑 JRE](./assets/a7bbccaf7e47e393eba5070e39b024eb.png)

![捆绑 JRE](./assets/ScreenShot_2026-06-28_155449_401.png)

> 设置 `jre `的时候, 我们把从`JDK`文件夹中的`jre`文件夹复制过来，放到和exe4j的项目输出一个文件夹，让他们平级。如下图所示。这样，我们刚才设置了相对路径 `./jre`，exe在启动的时候，就会自动寻找到该`jre`目录。这里只是告诉它jre环境会在哪个目录下，后面不会自动生成jre环境，还需要手动拷贝jre，放到相应目录下

![捆绑 JRE](./assets/ScreenShot_2026-06-28_155727_866.png)



> **之后一路点击下一步即可。**

## 七、常见问题

### **7.1 打包时报 `com.sun.*` 包不存在**

程序在 IDEA 里跑得好好的，一打包就报 `com.sun.xxx` 找不到。原因是 `com.sun.*` 是 JDK 内部 API，编译时默认不开放。解决方案：检查代码中是否引用了 `com.sun.*` 下的类，替换为等价的公开 API（如 `com.sun.image.codec.jpeg` → `javax.imageio`）。

![常见问题](./assets/a634b9655d13d6c0a4277538efdeebba.png)

![常见问题](./assets/1878a72b97638ba7036cdc05d60d9ff7.png)

### **7.2 外部文件（字典、配置）路径找不到**

IDEA 中运行和 `exe` 运行时，相对路径的基准目录不同。

> 如何应对？

写代码时，不要以IDEA工程的相对路径来写文件路径，例如`src/main`等写法。更不要使用绝对路径的方式来写文件路径，例如`C:/xxxx/xxxx`。路径全部以exe的相对路径的方式来写, 例如 `./appData/xxxxx.json`，这是最标准的写法，程序会自动到exe平级的`appData`文件夹下边去找文件。



另外，在 exe4j 内置测试环境中点击运行找不到文件也别慌——直接从文件夹里双击 `exe` 启动就正常了。

### **7.3 找不到第三方库依赖**

> [!CAUTION]
>
> 默认生成的`jar`是不含有第三方依赖的, 需要使用IDEA构建工件，或者配置`pom.xml`导出胖jar，又或者需要在exe4j中手动添加依赖（上面有指定步骤位置）。
>
> 添加代码之后会`生成两个jar包`，注意使用工具加载时的选择。


 ![用胖JAR](./assets/6210e8942b92ffd60707a12815818a71-1782635075769-34.png)



### **7.4 exe4j 生成的 exe 在自己电脑能跑，换电脑就挂**

检查两点：① JRE 文件夹是否正确放在了 `exe` 同级目录；② 64 位 exe 搭配了 64 位 JRE（32 位同理，位数不一致会启动失败）。

### **7.5 编译使用的 JDK 版本高于目标用户的 JRE 版本**

如果你用 JDK 21 编译，但捆绑的 JRE 是 1.8，程序可能因 class 版本不兼容而无法启动。捆绑的 JRE 版本必须 ≥ 编译时使用的 JDK 版本。

## 八、exe4j vs 其他方案

| 方案 | 适用场景 | 包体积 | 用户前提 |
|------|---------|--------|---------|
| `exe4j` + 捆绑 `JRE` | 需要原生 `exe`，给普通 `Windows `用户 | 含 `JRE `约 150MB+ | 零前提 |
| 直接发胖 `JAR` | 给开发/运维，对方有 `JDK` | ~20MB | 需` JDK/JRE` |
| `jpackage (JDK 14+)` | 自动生成 `msi`/`exe `安装包 | 含 `JRE `约 100MB+ | 零前提 |
| `Launch4j` | 轻量级开源替代 | 取决于是否捆绑 JRE | 零前提 |

`exe4j` 的优势在于自定义程度高（进程名、启动画面、JRE 搜索策略），对老旧 Java 项目兼容性好。`jpackage` 是 JDK 自带，更现代但要求 JDK 14+。

## 总结

把 Java 项目变成 Windows 用户双击即用的 `exe`，核心就三件事：**打胖 JAR → exe4j 封装 → 捆绑 JRE**。

打胖 JAR 有两种路子：**IDEA 构建工件**（鼠标点点，适合小项目）、**Maven assembly-plugin**（写配置，适合团队和自动化）。选哪个取决于你的工程规模和对可复现性的要求。

但无论哪种，最终交付形态都是一个文件夹，拷到 U 盘里插哪台电脑都能跑。对于面向非技术用户分发 Java GUI 工具的场景，`exe4j` 是经历过时间考验的实用选择。

------

部分内容转载自[https://blog.csdn.net/m0_45057216/article/details/126563598](https://blog.csdn.net/m0_45057216/article/details/126563598)，作者：[叼着零食打架](https://blog.csdn.net/m0_45057216)
