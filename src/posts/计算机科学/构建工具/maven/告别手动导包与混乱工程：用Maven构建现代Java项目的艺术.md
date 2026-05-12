---
title: 告别手动导包与混乱工程：用`Maven`构建现代`Java`项目的艺术
cover: /assets/maven-package-cover.png
icon: file
author: 诚
date: 2026-05-10
category:
  - Maven
  - Java
tag:
  - Maven
  - Java
  - JAR
  - IDEA
  - 打包
  - GitHub Packages
sticky: false
star: false
footer: 
copyright: 无版权
---

### 告别手动导包与混乱工程：用`Maven`构建现代`Java`项目的艺术

想象一个场景：你正在开发项目 D，它依赖了两个外部库 B 和 C。偏偏 B 和 C 都依赖了同一个库 A——只是版本不同。这时候问题来了：B 需要 A 的 1.0 版，C 需要 A 的 2.0 版，而这两个版本互不兼容。传统的做法是手动把 JAR 包塞进 `WEB-INF/lib` 目录，你开始在各个官网之间奔波、下载、复制粘贴，项目体积成倍膨胀，最终被版本冲突搞得焦头烂额。

这就是经典的"依赖地狱"——随着项目规模增长，手动管理依赖的方式注定崩溃。正是为了解决这一痛点，`Apache Maven` 应运而生。

#### 一、`Maven`：不仅仅是构建工具，更是项目管理的范式革命

与传统的 `Java` 动态 `Web` 工程相比，`Maven` 引入了一套基于项目对象模型（`POM`）和"约定优于配置"的理念，从根源上解决了以下四个核心痛点：

**1. 工程结构清晰化与模块化**

当项目膨胀到包含几十个模块、代码量巨大时，仅用 `Package` 划分已力不从心。Maven 允许每个功能模块都成为一个独立的子工程，通过父 `POM` 进行统一管理。各个模块对应的工程之间可以互相通信。这种结构不仅物理分离了代码，更明确了模块间的依赖关系，使得大型项目的架构一目了然，维护和团队协作效率倍增。

**2. 统一的依赖管理，终结"`JAR` 包复制地狱"**

传统模式下，每个项目都需要一份完整的、手动放入 `/WEB-INF/lib` 的依赖库。这不仅浪费磁盘空间，更致命的是极易造成版本冲突。`Maven` 建立了**本地仓库**的概念——所有依赖只需下载一次，保存在仓库中，各个工程通过 `pom.xml` 中的坐标（`GAV`）声明引用，而不再真的将 `JAR` 包复制到工程中。从此，添加一个依赖只需一行配置，版本升级和统一管理变得轻而易举。

**3. 规范、可靠的依赖来源**

"这个 `JAR` 该去哪儿下载？"曾是每个 `Java` 开发者的入门难题。很多知名框架（如 `MyBatis`）的官网只提供 `Maven` 或 `SVN` 的下载方式，访问非官方站点又可能引入安全问题。`Maven` 通过配置**中央仓库**（及阿里云等镜像），为所有主流开源库提供了规范的、版本化的分发渠道。所有知名框架和第三方工具的 `JAR` 包已经按照统一规范存放在 `Maven` 仓库中，在 `pom.xml` 中声明坐标，`Maven` 便会自动下载，确保依赖来源的正统性与一致性。

**4. 自动化的依赖传递解析**

许多库本身又依赖于其他库（例如，`fileUpload` 依赖 `commons-io`）。传统方式要求开发者具备完整的依赖链知识，否则程序将在运行时崩溃。`Maven` 的依赖解析机制会自动将被依赖的包导入进来，将整个传递性依赖树引入项目。开发者只需关心直接依赖，极大地降低了心智负担。

#### 二、从源码到产品：使用 `Maven` 打包 `Java` 项目的两种姿势

理解了 `Maven` 为何强大，接下来便是实战：如何将代码变成可分发的、可独立运行的 `JAR` 包。这里以典型的包含主类的应用为例，介绍两种主流方式。

**方法一：使用 IDE 内置工具（快速但非标准）**

以 `IntelliJ IDEA` 为例，可以通过 `File -> Project Structure -> Artifacts` 来配置并打包。这种方法虽然直观，但配置与项目构建生命周期（编译、测试）脱节，不利于持续集成和跨环境复现，通常仅作临时测试之用。

**方法二：配置 `Maven` 插件（推荐的标准做法）**

这是 `Maven` 式的标准解决方案。通过在项目核心文件 `pom.xml` 中声明打包插件，打包命令（`mvn package`）将自动执行所有前置步骤并生成 `JAR`。这种方式与 `Maven `生命周期完美集成，是团队协作和自动化构建的基石。

对于需要将所有依赖打包进单个 `JAR`（即"`胖 JAR`"或"`Uber JAR`"）的可执行应用，`maven-shade-plugin` 是首选方案。你需要在 `pom.xml` 中配置该插件，指定主入口类，然后执行 `mvn clean package` 即可一键完成编译、测试、打包。生成的 JAR 已包含所有依赖，可以独立运行在任何装有合规 `JRE` 的环境中。你也可以直接在`IntelliJ IDEA` 菜单栏右侧的`Maven`插件中鼠标点击 `package`即可立刻运行打包指令。

`pom.xm`示例如下：

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion>
<!--    组的名称必须命名为 io.github.你的github名称-->
<groupId>io.github.yourusername</groupId>
<!--    工件名称必须全部小写，单词使用连字符-链接-->
<artifactId>your-artifact</artifactId>
<version>1.0.0</version>
<packaging>jar</packaging>
<!--项目依赖 省略 ->
<dependencies>
</dependencies>

<!-- 定义编译生成的工件，例如：编译文档注释、编译class、以及源码-->
<build>
<!--        以下三个配置用于生成对应的三个JAR包：文档注释、class、以及源码-->
    <plugins>
        <!--  文档注释 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-javadoc-plugin</artifactId>
            <version>3.6.0</version>
            <configuration>
                <encoding>UTF-8</encoding>
                <aggregate>true</aggregate>
                <charset>UTF-8</charset>
                <docencoding>UTF-8</docencoding>
                <!-- 禁用严格语法检查 -->
                <additionalparam>-Xdoclint:none</additionalparam>
                <!-- 绕过路径检查 -->
                <argLine>-Djdk.net.URLClassPath.disableClassPathURLCheck=true</argLine>
            </configuration>
            <executions>
                <execution>
                    <id>attach-javadocs</id>
                    <goals>
                        <goal>jar</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
               <!--  以及源码 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-source-plugin</artifactId>
            <version>3.0.1</version>
            <executions>
                <execution>
                    <id>attach-sources</id>
                    <goals>
                        <goal>jar</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>2.22.2</version>
            <configuration>
                <skipTests>true</skipTests>
            </configuration>
        </plugin>
    </plugins>
</build>


</project>
```

#### 三、更进一步：将 `Maven `工件发布到 `GitHub Packages`

本地打包只是第一步。当你希望将工具库分享给团队或开源社区时，就需要将工件发布到远程仓库。`GitHub Packages` 是一个与 `GitHub `仓库深度集成的包管理服务，非常适合托管 `Maven `工件。

**3.1 核心配置：`groupId` 的命名规则**

发布到 `GitHub Packages` 时，`groupId` 必须遵循固定格式：`io.github.<你的GitHub用户名>`。同时需要配置项目基本信息、打包方式和 `Java `版本：

```xml
<!--    组的名称必须命名为 io.github.你的github名称-->
<groupId>io.github.yourusername</groupId>
<!--    工件名称必须全部小写，单词使用连字符-链接-->
<artifactId>your-artifact</artifactId>
<version>1.0.0</version>
<packaging>jar</packaging>

<!--    项目的基本信息-->
<name>your-artifact</name>
<description>your-artifact description</description>
<url>https://github.com/你的GitHub用户名/仓库名</url>
```

**3.2 添加开源协议**

开源项目的协议是法律文件，规定他人如何使用、修改和分发你的代码。在 `pom.xml` 中通过 `<licenses>` 节点声明，同时在项目根目录添加 `LICENSE` 文件：

```xml
<licenses>
    <license>
        <name>MIT License</name>
        <url>http://www.opensource.org/licenses/mit-license.php</url>
    </license>
</licenses>
```

MIT 协议允许任何人自由使用、修改和分发代码，只需保留原始协议和版权声明。也可以选择 `Apache 2.0、GPL` 等协议（详见 `opensource.org`）。

**3.3 配置发布地址**

在 `pom.xml` 中添加 `<distributionManagement>` 节点：

```xml
<distributionManagement>
    <repository>
         <!--    id：固定设为 github -->
        <id>github</id>
          <!--    name：仓库所有者（个人或组织名称）-->
        <name>yourusername</name>
        <url>https://maven.pkg.github.com/yourusername/your-repo</url>
    </repository>
</distributionManagement>
```

三个关键属性：`id` 固定设为 `github`；`name` 为仓库所有者；`url` 为发布地址，格式为 `https://maven.pkg.github.com/{owner}/{repository}`。

**3.4 配置 `GitHub `认证**

首先在 `GitHub` 生成个人访问令牌（`Personal Access Token`）：进入 `Settings -> Developer settings -> Personal access tokens`，生成新令牌并配置合适的权限范围和过期时间。

然后在 `~/.m2/settings.xml`(例如`C:/Users/Administrator/.m2/settings.xml`) 中添加认证信息和仓库配置：

```xml
<settings>
    <servers>
        <server>
               <!--    id：固定设为 github -->
            <id>github</id>
            <username>yourusername</username>
            <password>你的访问令牌</password>
        </server>
    </servers>
</settings>
```

> [!NOTE]
>
> 令牌不要提交到仓库中，请确保只在本地。

然后在`pom.xml`中同时配置仓库地址（在 `<profiles>` 节点）

```xml
<!--    同时配置仓库地址（在 <profiles> 节点）-->
<profiles>
<profile>
    <id>github</id>
    <!--  可以同时配置多个仓库  -->
    <repositories>
        <!--                maven 我访问困难，被墙了，故暂时不启用-->
        <!--                <repository>-->
        <!--                    <id>central</id>-->
        <!--                    <url>https://repo1.maven.org/maven2</url>-->
        <!--                </repository>-->

        <!--  这里仅以 GitHub Packages 作为参考  -->
        <repository>
            <id>github</id>
            <url>https://maven.pkg.github.com/yourusername/your-repo</url>
            <snapshots>
                <enabled>true</enabled>
            </snapshots>
        </repository>
    </repositories>
</profile>
</profiles>
```



配置完成后，执行 `mvn deploy` 即可将工件发布到 `GitHub Packages`。发布成功后，在 `GitHub` 仓库页面即可看到已上传的包。你也可以直接在`IDEA`右侧的`MAVEN`工具栏直接鼠标运行`deploy`命令，不需要命令行操作。

**3.5 作为依赖安装使用**

即使工件仓库是公开的，`GitHub` 仍要求客户端使用个人访问令牌认证（只读权限即可）。在客户端项目的 `~/.m2/settings.xml` 或 `pom.xml` 中配置仓库地址，然后添加依赖即可：

```xml
<dependency>
    <groupId>io.github.yourusername</groupId>
    <artifactId>your-artifact</artifactId>
    <version>1.0.0</version>
</dependency>
```

**踩坑提醒：**
- 确保 `groupId` 符合 `io.github.<username>` 格式
- 个人访问令牌权限要配置正确（发布需要写权限，安装只需读权限），令牌不要提交到仓库中，请确保只在本地。
- 发布前先在本地 `mvn clean install` 验证构建成功

#### 总结

`Maven` 的诞生源于对"依赖地狱"的破解——它通过 `POM `模型、仓库体系和标准的构建生命周期，为 `Java `项目带来了工业级的依赖管理、项目结构和构建流程规范。再加上 `GitHub Packages` 这样的远程发布渠道，开发者可以轻松地将自己的工具库分享给团队乃至全球社区。

从手动管理的泥潭中解脱出来，拥抱 `Maven `的自动化与约定，是现代 `Java` 开发者提升工程效率、保障项目质量的关键一步。
