---
title: 使用Gradle发布软件包到远程仓库
cover: /assets/gradle-publish-cover.png
icon: file
author: 诚
date: 2026-04-11
category:
  - Gradle
  - 构建工具
tag:
  - Gradle
  - Maven
  - 发布
  - GitHub Packages
  - maven-publish
sticky: false
star: false
footer:
copyright: CC BY-SA 4.0
---

# 使用`Gradle`发布软件包到远程仓库

上一篇文章讲了 `Maven` 如何发布 `JAR` 包：[用`Maven`构建现代`Java`项目的艺术](https://shilic.github.io/posts/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6/%E6%9E%84%E5%BB%BA%E5%B7%A5%E5%85%B7/maven/%E5%91%8A%E5%88%AB%E6%89%8B%E5%8A%A8%E5%AF%BC%E5%8C%85%E4%B8%8E%E6%B7%B7%E4%B9%B1%E5%B7%A5%E7%A8%8B%EF%BC%9A%E7%94%A8Maven%E6%9E%84%E5%BB%BA%E7%8E%B0%E4%BB%A3Java%E9%A1%B9%E7%9B%AE%E7%9A%84%E8%89%BA%E6%9C%AF.html)

本文继续聊 `Gradle` 的发布机制，以我的开源项目 [`smart-dbc`](https://github.com/shilic/smart-dbc) 为例。 

## 一、为什么需要发布到远程仓库

软件开发到一定规模，必然会走向解耦。一个项目膨胀到几万行之后，你会自然地想把一些通用功能拆出去，形成独立的模块。这就是"高内聚，低耦合"——每个模块管好自己的事，通过明确的接口和外界交互。

拆出去的模块要让别人用，就要解决一个最基本的问题：**怎么分发。** 把源码丢给对方自己编译？版本管理一团乱。把 `JAR` 拷贝到共享目录？更新一次通知一圈人。小团队靠 U 盘拷来拷去还能忍，人一多、模块一多，手动分发就成了效率黑洞。

`Gradle` 正是解决这个问题的工具——它既能管理复杂的项目依赖，也能轻松地把软件包发布到远程仓库（`GitHub Packages`、`Sonatype Nexus`、`JFrog Artifactory` 等），极大地促进了代码重用和团队协作。

## 二、核心概念：Who？What？Where？

在动手之前，先理清三个哲学问题：**你是谁？你要发布什么？你要发布到哪里？**

**坐标（Who）**——唯一标识你这个包：

```kotlin
group = "io.github.shilic"      // 组织/用户反写域名（发到 GitHub Packages 必须用 io.github.<用户名>）
version = "1.0.9"               // 语义化版本
// artifactId 默认取项目名，也可以手动指定
```

**发布内容（What）**——要发布哪些文件：

```kotlin
create<MavenPublication>("maven") {
    // 编译产物（JAR）
    from(components["java"])   
    // 可选：源码包 + Javadoc 包
}
```

**远程仓库（Where）**——发布到哪里：

```kotlin
maven {
    name = "GitHubPackages"
    url = uri("https://maven.pkg.github.com/shilic/smart-dbc")
    credentials { /* 认证信息 */ }
}
```

三件套配齐，一条 `./gradlew publish` 就搞定了。下面逐个拆开讲。

## 三、发布到 `GitHubPackages`

### 3.1 引入插件

`Gradle` 发布到 Maven 仓库，核心插件是 `maven-publish`。在 `build.gradle.kts` 中引入：

```kotlin
plugins {
    kotlin("jvm") version "2.1.0"  // 或 java
    `maven-publish`                 // 发布必备
}
```

> 注意：老版的 `maven` 插件已被废弃，统一用 `maven-publish`。不要同时引入两者。

### 3.2 配置项目坐标（GAV）

坐标就是包的唯一身份证，放在 `group` 和 `version` 中，`artifactId` 默认取项目名：

```kotlin
// build.gradle.kts 部分配置

group = "io.github.shilic"
version = "1.0.10"
```

发布到 `GitHub Packages` 时，`groupId` 必须遵守 `io.github.<用户名>` 格式，否则仓库 URL 和坐标对不上，拉取会 404。

### 3.3 配置发布内容（Publication）

以 [`smart-dbc`](https://github.com/shilic/smart-dbc) 为例

Publication 定义了**要发布哪些文件**。最基本的是编译产物（JAR），但强烈建议同时发布源码包和 Javadoc 包：

```kotlin
// build.gradle.kts 部分配置

// 源码包 —— 使用者可以点进源码看实现、打断点 DEBUG
tasks.register<Jar>("sourcesJar") {
    archiveClassifier.set("sources")
    from(sourceSets.main.get().allSource)
}

// Javadoc 包 —— 使用者写代码时 IDE 自动显示注释和文档
tasks.register<Jar>("javadocJar") {
    archiveClassifier.set("javadoc")
    from(tasks.javadoc.get().outputs)
}
```

然后在 `publications` 中声明：

```kotlin
// build.gradle.kts 部分配置

publishing {
    publications {
        create<MavenPublication>("maven") {
            from(components["java"])        // 编译产物（JAR）
            artifact(tasks["sourcesJar"])   // 源码包
            artifact(tasks["javadocJar"])   // Javadoc 包

            // POM 元数据 —— 使用者能在仓库页面看到这些信息
            pom {
                name.set("smart-dbc")
                description.set("CAN协议车载通信中间件")
                url.set("https://github.com/shilic/smart-dbc")
                licenses {
                    license {
                        name.set("Apache License, Version 2.0")
                        url.set("https://www.apache.org/licenses/LICENSE-2.0.txt")
                    }
                }
                developers {
                    developer {
                        id.set("诚")
                        name.set("诚")
                        email.set("985478238@qq.com")
                    }
                }
                scm {
                    connection.set("scm:git:git://github.com/shilic/smart-dbc.git")
                    developerConnection.set("scm:git:ssh://github.com/shilic/smart-dbc.git")
                    url.set("https://github.com/shilic/smart-dbc")
                }
            }
        }
    }
}
```

> **为什么源码包和 Javadoc 包很重要？** 没有源码包，使用者只能对着反编译的 `.class` 调试，变量名全变成 `var1`、`var2`。没有 Javadoc 包，IDE 不显示你的方法注释——写了一堆文档，别人看不见。这两个包单独不大，却是专业库和业余库的分界线。

### 3.4 配置远程仓库（Repository）

`Gradle` 的仓库分两种：

| 仓库类型 | 位置 | 用途 |
|----------|------|------|
| 本地仓库 | `~/.m2/repository` | 本机测试，不需要认证 |
| 远程仓库 | `GitHub Packages` / `Nexus` / `Artifactory` | 团队共享，需要认证 |

**本地仓库**——最简单的验证方式，先发本地确认没问题：

```kotlin
// build.gradle.kts 部分配置

publishing {
    repositories {
        mavenLocal()  // 发布到 ~/.m2/repository
    }
}
```

执行 `./gradlew publishToMavenLocal`，然后在本机另一个项目中通过 `mavenLocal()` 拉取验证。

**远程仓库**——验证通过后，配置远程地址，以 [`smart-dbc`](https://github.com/shilic/smart-dbc) 为例

```kotlin
// build.gradle.kts 部分配置

import java.util.Properties

// 从环境变量 GRADLE_USER_HOME 读取凭证（复用同一份）
val globalProps = Properties().apply {
    gradle.gradleUserHomeDir.resolve("gradle.properties").takeIf { it.exists() }?.reader()?.use { load(it) }
}

publishing {
    repositories {
        maven {
            // 仓库名称 (固定参数 GitHubPackages, 不可变动 ; 该存储库指向 GitHub Packages)
            name = "GitHubPackages" 
            url = uri("https://maven.pkg.github.com/shilic/smart-dbc")
            // 优先读 gradle.properties → 回退环境变量
            credentials {
                username = globalProps.getProperty("gpr.user") ?: System.getenv("GITHUB_ACTOR") ?: ""
                password = globalProps.getProperty("gpr.key") ?: System.getenv("GITHUB_TOKEN") ?: ""
            }
        }
    }
}
```

可以同时配置多个仓库——比如同时推到 `GitHub Packages` 和公司内部 `Nexus`。

### 3.5 配置`GitHub Packages`认证信息

仓库的 `credentials` 永远不要硬编码。推荐两层兜底：**先读本地属性文件，读不到再取环境变量**。

本地开发时，在 `~/.gradle/gradle.properties` 中配置：

```properties
gpr.user=shilic
gpr.key=ghp_xxxxxxxxxxxxxxxxxxxx
```

CI 环境（GitHub Actions）不需要手动设置——`GITHUB_ACTOR` 和 `GITHUB_TOKEN` 是 GitHub 自动注入的环境变量。

在 `build.gradle.kts` 中的读取方式：

```kotlin
// 优先读 gradle.properties → 回退环境变量
credentials {
    username = globalProps.getProperty("gpr.user") ?: System.getenv("GITHUB_ACTOR") ?: ""
    password = globalProps.getProperty("gpr.key") ?: System.getenv("GITHUB_TOKEN") ?: ""
}
```

> **令牌权限**：`GitHub` 个人访问令牌（classic token）需勾选 `write:packages`（发布）和 `read:packages`（拉取）。`GitHub Packages` 即使公开仓库也要求认证——这是 `GitHub` 的策略，不是 `Gradle` 的限制。

### 3.6 一条命令发布

配置全部完成后，发布就是一行命令：

```bash
./gradlew publish
```

或者用 `IDEA` 右侧 `Gradle` 面板，双击 `publish` 任务，一样的效果：

![`Gradle` 面板](./assets/image-20260709101410097.png)

### 3.7 使用方的依赖配置

发布完成后，任何人在自己的项目中这样配置就能拉取：

```kotlin
import java.util.Properties
// 从 GRADLE_USER_HOME 读取凭证（复用同一份）
val globalProps = Properties().apply {
    gradle.gradleUserHomeDir.resolve("gradle.properties").takeIf { it.exists() }?.reader()?.use { load(it) }
}
repositories {
    mavenCentral()
    /* 如果你想使用自己在github中的发布库，则必须在这里设置maven地址，同样需要从环境变量获取个人访问令牌。
  这样，gradle就能从该仓库查询该软件包了，然后就会自动下载 dependencies 中相关的依赖 */
    maven {
        name = "GitHubPackages"
        url = uri("https://maven.pkg.github.com/shilic/*")
        credentials {
            username = globalProps.getProperty("gpr.user") ?: System.getenv("GITHUB_ACTOR") ?: ""
            password = globalProps.getProperty("gpr.key") ?: System.getenv("GITHUB_TOKEN") ?: ""
            println("username=$username,password=$password")
        }
    }
}
dependencies {
    implementation("io.github.shilic:smart-dbc:1.0.10")
}
```

## 四、 发布到 `Gitea`

有的用户可能有私有化的需求，不想将软件包发布到外网上，只想发布到内网上，供内部团队使用。这里推荐使用`Gitea`，在公司内网上部署`Gitea`之后，使用体验基本和`Github`一致，同样具备发布和管理软件包的功能。关于如何部署`Gitea`，可以看我另外一篇博客：[使用`Gitea`搭建私有`Git`代码托管平台](https://shilic.github.io/posts/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6/%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6/Gitea/%E7%94%A8Gitea%E6%90%AD%E5%BB%BA%E7%A7%81%E6%9C%89Git%E4%BB%A3%E7%A0%81%E6%89%98%E7%AE%A1%E5%B9%B3%E5%8F%B0.html)。

下边讲解将`Gradle`软件包发布到`Gitea`的教程：

发布内容和`Github Packages`一致，这里不再赘述。

### 4.1 配置远程仓库（Repository）

以下配置，参考自`gitea`官方的教程：[https://docs.gitea.com/zh-cn/usage/packages/maven](https://docs.gitea.com/zh-cn/usage/packages/maven)，原本是`groovy`语法，我改成了`kotlin`版本

```kotlin
// build.gradle.kts 部分配置

import java.util.Properties

// 从环境变量 GRADLE_USER_HOME 读取凭证（复用同一份）
val globalProps = Properties().apply {
    gradle.gradleUserHomeDir.resolve("gradle.properties").takeIf { it.exists() }?.reader()?.use { load(it) }
}
publishing{
    repositories {
        // 发布到 Gitea; 执行 ./gradlew publishAllPublicationsToGiteaRepository
        maven {
            name = "Gitea"
            // {owner} 换成你的用户名或组织名
            url = uri("http://你的内网IP地址:你的内网端口号/api/packages/{owner}/maven")
            // http 链接需要单独加这么一句，才能允许访问
            isAllowInsecureProtocol = true

            credentials(HttpHeaderCredentials::class) {
                // Gitea 要求 Header 名称必须是固定的 Authorization，不是从属性文件动态读取的。
                name = "Authorization"
                // token是固定前缀，不是占位符, 不要自己删了; 推荐从 gradle.properties 或环境变量读，别写死
                value = "token ${globalProps.getProperty("gitea.token")}"
            }
            authentication {
                create("header", HttpHeaderAuthentication::class)
            }
        }
    }
}

```

### 4.2 配置`Gitea`认证信息

仓库的 `credentials` 永远不要硬编码。推荐两层兜底：**先读本地属性文件，读不到再取环境变量**。

本地开发时，在 `~/.gradle/gradle.properties` 中配置：

```properties
gitea.token=xxxxxxxxxxxxxxxxxxxxxxx
```

同样的，需要先在 `Gitea`中生成个人访问令牌，和`Github`类似，这里不再赘述。

### 4.3 发布

配置全部完成后，发布就是一行命令：

```bash
 ./gradlew publishAllPublicationsToGiteaRepository
```

或者用 `IDEA` 右侧 `Gradle` 面板，双击 `publish` 任务，一样的效果：

### 4.4 使用方的依赖配置

```kotlin
// build.gradle.kts 部分配置

import java.util.Properties

// 从环境变量 GRADLE_USER_HOME 读取凭证（复用同一份）
val globalProps = Properties().apply {
    gradle.gradleUserHomeDir.resolve("gradle.properties").takeIf { it.exists() }?.reader()?.use { load(it) }
}

// 仓库们, 构建脚本会在里边定义的仓库中寻找依赖
repositories {
    // 发布到 Gitea; 执行 ./gradlew publishAllPublicationsToGiteaRepository
    maven {
        name = "Gitea"
        // {owner} 换成你的用户名或组织名
        url = uri("http://你的内网IP地址:你的内网端口号/api/packages/{owner}/maven")
        // http 链接需要单独加这么一句，才能允许访问
        isAllowInsecureProtocol = true

        credentials(HttpHeaderCredentials::class) {
            // Gitea 要求 Header 名称必须是固定的 Authorization，不是从属性文件动态读取的。
            name = "Authorization"
            // token是固定前缀，不是占位符, 不要自己删了; 推荐从 gradle.properties 或环境变量读，别写死
            value = "token ${globalProps.getProperty("gitea.token")}"
        }
        authentication {
            create("header", HttpHeaderAuthentication::class)
        }
    }
}

dependencies{
    implementation("加你的依赖即可)
}
```

## 五、真实案例完整发布配置

 [`smart-dbc`](https://github.com/shilic/smart-dbc) 完整发布配置如下， 具体代码可查看我的开源项目[`smart-dbc`](https://github.com/shilic/smart-dbc) ： [https://github.com/shilic/smart-dbc]( https://github.com/shilic/smart-dbc)

```kotlin
import java.util.Properties

// 从环境变量 GRADLE_USER_HOME 读取凭证（复用同一份）
val globalProps = Properties().apply {
    gradle.gradleUserHomeDir.resolve("gradle.properties").takeIf { it.exists() }?.reader()?.use { load(it) }
}
// ===== 1. 引入插件 =====
plugins {
    kotlin("jvm") version "2.1.0"
    /* 应用 maven-publish 插件;
   * 将项目发布到 本地maven仓库、远程maven仓库、GitHub Packages仓库 都需要使用该插件 */
    `maven-publish`
}
// 项目组 ID。 组的名称必须命名为 io.github.你的github名称
group = "io.github.shilic"
// 项目版本
version = "1.0.10"

// 仓库们, 构建脚本会在里边定义的仓库中寻找依赖
repositories {
    mavenCentral()
    /* 使用在github中的发布库，则必须在这里设置maven地址，同样需要从环境变量获取个人访问令牌。
    这样，gradle就能从该仓库查询该软件包了，然后就会自动下载 dependencies 中相关的依赖 */
    maven {
        name = "GitHubPackages"
        url = uri("https://maven.pkg.github.com/shilic/*")
        credentials {
            username = globalProps.getProperty("gpr.user") ?: System.getenv("GITHUB_ACTOR") ?: ""
            password = globalProps.getProperty("gpr.key") ?: System.getenv("GITHUB_TOKEN") ?: ""
        }
    }
}

// 源码包 (可深入源码DEBUG)
tasks.register<Jar>("sourcesJar") {
    archiveClassifier.set("sources")
    from(sourceSets.main.get().allSource)
}

// Javadoc 包 (可查看注释)
tasks.register<Jar>("javadocJar") {
    archiveClassifier.set("javadoc")
    from(tasks.javadoc.get().outputs)
}

// 定义发布内容 (在添加 `maven-publish` 之后，需要同步一下gradle更改才不会语法报错)
publishing {
    // ===== 4. 配置远程仓库; 推到哪里 ? =====
    repositories {
        // 发布到 GitHubPackages
        maven {
            // 仓库名称 (固定参数 GitHubPackages, 不可变动 ; 该存储库指向 GitHub Packages)
            name = "GitHubPackages"
            // 仓库 github URL
            url = uri("https://maven.pkg.github.com/shilic/smart-dbc")
            // 设置仓库凭证
            credentials {
                // 使用推荐的写法，从 GRADLE_USER_HOME 读取全局 gradle.properties (存放 git 凭证)
                username = globalProps.getProperty("gpr.user") ?: System.getenv("GITHUB_ACTOR") ?: ""
                password = globalProps.getProperty("gpr.key") ?: System.getenv("GITHUB_TOKEN") ?: ""
            }
        }
        // 可以同时配置多个远程仓库
        /*
        maven {
            name = "MyNexus"
            url = uri("https://nexus.company.com/repository/maven-releases/")
            credentials {
                username = "your_username"
                password = "your_password"
            }
        }
        */
    }
    // ===== 3. 配置标准的发布内容 =====
    /*  一个项目可以定义多个发布内容 (Multiple Publications)，例如发布不同的构件或为不同的用途提供不同的元数据。
     * 例如: 基本的jar(可调用代码)、 源码(可深入源码DEBUG)、 java-docs(可查看文档)  */
    publications {
        // 定义名为 maven 的发布内容
        create<MavenPublication>("maven") {
            // artifactId = rootProject.name
            // kotlin("jvm") 插件内部会应用 java 插件，所以软件组件名统一叫 "java"，没有 "kotlin" 这个组件。
            // 这不是"不可变"，而是 JVM 类库的标准写法——Java 和 Kotlin 都是同一个 `components["java"]。
            from(components["java"])
            // 打包源码包
            artifact(tasks["sourcesJar"])
            // 打包注释包
            artifact(tasks["javadocJar"])
            // 可以在这里自定义 POM 内容
            pom {
                name = "smart-dbc"
                description = "更聪明的DBC，用于读写DBC，以及基于DBC做快速CAN报文编解码"
                url.set("https://github.com/shilic/smart-dbc")
                licenses {
                    license {
                        name.set("The Apache License, Version 2.0")
                        url.set("https://www.apache.org/licenses/LICENSE-2.0.txt")
                    }
                }
                developers {
                    developer {
                        id.set("诚")
                        name.set("诚")
                        email.set("985478238@qq.com")
                    }
                }
                scm {
                    connection.set("scm:git:git://github.com/shilic/smart-dbc.git")
                    developerConnection.set("scm:git:ssh://github.com/shilic/smart-dbc.git")
                    url.set("https://github.com/shilic/smart-dbc")
                }
            }
        }
    }
}

// 项目依赖
dependencies {
    // ========== 核心依赖 ==========
    implementation(kotlin("stdlib"))
    // ========== 测试依赖 ==========
    testImplementation(kotlin("test"))
    // ========== 引入自定义依赖 ==========
    // 使用该语句，调用自己在 GitHubPackages 上发布的软件包; smart-grid 用于从表格识别数据进来。
    implementation("io.github.shilic:smart-grid:1.0.2")
    // 使用该语句，调用自己在 GitHubPackages 上发布的软件包; numeric-converter 用于规范网络字节数据。
    implementation("io.github.shilic:numeric-converter:1.0.2")
    // ========== 引入excel依赖 ==========
    // 核心功能: 处理xlsx文件
    implementation("org.apache.poi:poi:5.3.0")
    // 处理xlsx文件（Office Open XML格式）
    implementation("org.apache.poi:poi-ooxml:5.4.0")
    // 识别文件编码
    implementation("com.github.albfernandez:juniversalchardet:2.4.0")
    // 序列化框架
    implementation("com.google.code.gson:gson:2.10.1")
    // ========== 反射 引入 kotlin-reflect ==========
    implementation("org.jetbrains.kotlin:kotlin-reflect:1.9.0")
    // =============== 测试项目引入 kotlin 协程 ==============
    // implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.0")
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(8)
}
```

执行 `./gradlew publish`，`JAR` + `源码包` + `Javadoc 包` + `POM` 全部上传。

## 六、常见踩坑

- **`groupId `未按规范命名**：发布到 `GitHub Packages` 时必须用 `io.github.<用户名>`，否则 404
- **`token `权限不足**：发布需要 `classic token` 勾选 `write:packages`，只读只需要 `read:packages`
- **老版 `maven` 插件冲突**：只用 `maven-publish`，不要和老版的 `maven` 插件共存
- **多模块项目**：每个需要发布的子模块都要单独应用 `maven-publish` 插件，父模块不需要
- **`GitHub Packages` 公开仓库也需认证**：这是 `GitHub` 的限制，即使你的仓库公开，拉取方也必须提供只读 `token`

## 七、总结

`Gradle` 发布软件包到远程仓库，浓缩成一句话：**谁（GAV）→ 发什么（Publication）→ 发到哪（Repository）→ 怎么认证（Credentials）**。按这个顺序一步步配置，`./gradlew publish` 回车，搞定。

[`smart-dbc`](https://github.com/shilic/smart-dbc) 的完整配置就在上面的章节里，直接拿去改 `groupId` 和仓库地址就能复用。有问题欢迎提 Issue，一起交流。

## 参考链接

[Gradle - 发布项目到Maven仓库 本地仓库与远程仓库配置](https://blog.csdn.net/qq_41187124/article/details/156274030)： CSDN[知远漫谈](https://alwaysinvictus.blog.csdn.net)的博客

[The Maven Publish Plugin](https://docs.gradle.org/current/userguide/publishing_maven.html) ：Gradle 官方关于发布到 Maven 仓库的详细指南

[使用 Gradle 发布Java包](https://docs.github.com/zh/actions/tutorials/publish-packages/publish-java-packages-with-gradle): [GitHub Actions](https://docs.github.com/zh/actions)中关于如何发布Gradle包的教程

[Maven 软件包注册表](https://docs.gitea.com/zh-cn/usage/packages/maven)： `Gitea`官方的软件包发布教程
