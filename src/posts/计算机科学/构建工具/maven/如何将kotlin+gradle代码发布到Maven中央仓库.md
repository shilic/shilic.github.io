---
title: 如何将Kotlin+Gradle代码发布到Maven中央仓库
cover: /assets/maven-central-publish-cover.png
icon: file
author: 诚
date: 2026-07-19
category:
  - Gradle
  - Maven
  - 构建工具
tag:
  - Kotlin
  - Gradle
  - Maven
  - MavenCentral
  - GPG
  - 发布
  - 开源
sticky: false
star: true
footer:
copyright: CC BY-SA 4.0
---

# 如何将`kotlin`+`gradle`代码发布到`Maven`中央仓库

## 前言

> [!NOTE]
>
> 随着软件项目的庞大，模块化开发成为必然，高内聚低耦合是评价一个系统的重要标准，一个模块只做一件事。我们会把一些通用的代码分离出来，到其他项目中进行单独的维护，别人再通过依赖的方式使用。于是，各类包管理工具和构建工具就诞生了，这里就有我们的`maven`和`gradle`。

好吧，一样的废话，又在文章开头说一遍。 

我之前写了如何把`java + maven`的项目和`kotlin + gradle`的项目发布到`Github Packages`和自建的`Gitea`。可以参考我之前的博客：

- [https://shilic.github.io/posts/计算机科学/版本控制/Gitea/用Gitea搭建私有Git代码托管平台.html](https://shilic.github.io/posts/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6/%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6/Gitea/%E7%94%A8Gitea%E6%90%AD%E5%BB%BA%E7%A7%81%E6%9C%89Git%E4%BB%A3%E7%A0%81%E6%89%98%E7%AE%A1%E5%B9%B3%E5%8F%B0.html)
- [https://shilic.github.io/posts/计算机科学/构建工具/gradle/使用Gradle发布软件包到远程仓库.html](https://shilic.github.io/posts/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6/%E6%9E%84%E5%BB%BA%E5%B7%A5%E5%85%B7/gradle/%E4%BD%BF%E7%94%A8Gradle%E5%8F%91%E5%B8%83%E8%BD%AF%E4%BB%B6%E5%8C%85%E5%88%B0%E8%BF%9C%E7%A8%8B%E4%BB%93%E5%BA%93.html)
- [https://shilic.github.io/posts/计算机科学/构建工具/maven/告别手动导包与混乱工程：用Maven构建现代Java项目的艺术.html](https://shilic.github.io/posts/计算机科学/构建工具/maven/告别手动导包与混乱工程：用Maven构建现代Java项目的艺术.html)

`Github Packages`的配置还是太复杂了，别人要想使用的时候，他自己还得再配置一遍`github`，非常不方便。这次我们要把软件包发布到`Maven`中央仓库，使用的时候，别人只需要一行代码，比`Github Packages`方便太多了，所以就有了本博客。

我在网上找遍了教程，基本上把能踩的坑，全部踩了一遍，你只要照着我的教程来，基本就不会再踩坑了。

网上也有其他的教程：

CSDN用户[掉头发的王富贵](https://masiyi.blog.csdn.net)写的教程：[https://blog.csdn.net/csdnerM/article/details/136784455#jar_343](https://blog.csdn.net/csdnerM/article/details/136784455#jar_343)

但是基本没什么参考价值，主要原因是我没CSDN会员，看不到后边内容（大实话）；其次，我们是`kotlin + gradle`项目，这篇教程是`java + maven`，语法差异太大了，参考价值不大。

话不多说，直接开始往下看：

## 一、前期准备（一次性）

### 1. 账号准备

#### 注册 [Central Portal (Maven 中央仓库)](https://central.sonatype.com/) 账号

官网如下图所示：

![Central Portal (Maven 中央仓库)官网](./assets/image-20260717152654869.png)

> [!TIP]
>
> 打开 [https://central.sonatype.com/](https://central.sonatype.com/)，**用 GitHub 登录**（推荐）

点击下方的使用`github`登陆。（本教程以这个为准）



![建议使用github登陆](./assets/image-20260717152715267.png)

授权给`Sonatype`，可以使用`github`登陆他。最后登陆成功

![授权登陆](./assets/image-20260717152801771.png)

#### 新建命名空间

点击 头像 --> `View Namespaces` 即可查看你账号下的命名空间。

![查看命名空间](./assets/image-20260717153936663.png)

可以看到账号下边自动出现了一个已经验证过的命名空间。

![命名空间](./assets/image-20260717154105212.png)

如果使用`github`登陆，登录后自动送你一个已经验证通过的 namespace：`io.github.<你的github用户名>`，免去域名验证。所以建议大家都使用`github`登陆，非常的方便。

##### `maven`中央仓库的命名空间是什么意思？(可选阅读)

Maven 中央仓库中的“命名空间”通常指的是 **`groupId`**，它是 Maven 项目坐标（GAV）的核心组成部分之一，用于唯一标识一个组织或项目所属的组。

> Maven 使用三要素来定位一个构件（jar、war 等）：
>
> | 元素         | 含义                                      | 类比                                    |
> | ------------ | ----------------------------------------- | --------------------------------------- |
> | `groupId`    | 组织/项目的唯一标识符，常采用反向域名风格 | 相当于 Java 包名，如 `com.google.guava` |
> | `artifactId` | 项目内部的模块名称                        | 相当于类名或模块名，如 `guava`          |
> | `version`    | 版本号                                    | 如 `31.1-jre`                           |

**命名空间（namespace）** 主要指 `groupId`，它解决了不同组织之间可能出现的同名冲突问题。例如：

- `org.apache.commons` 和 `com.google.common` 是两个不同的命名空间，即使它们都有名为 `commons-lang3` 的 `artifactId`，也不会冲突。

🎈 **为什么叫“命名空间”？**

- 在编程语言（如 Java、C#）中，命名空间用于避免类名冲突，Maven 借用了这一概念。
- `groupId` 形成了树状层次结构，例如 `com.example.app` 下可以有多个子模块 `module-a`、`module-b`，这些模块共享同一个命名空间。

📦 **`maven`实际例子**

```xml
<dependency>
    <groupId>io.github.shilic</groupId>
    <artifactId>smart-dbc</artifactId>
    <version>1.0.10</version>
</dependency>
```

📦 **`gradle`的实际例子**

```kotlin
dependencies {
    implementation("io.github.shilic:smart-dbc:1.0.10")
}
```

这里的 `io.github.shilic` 就是命名空间，表示这是 `io.github.shilic`个人的组件。

#### 验证命名空间

如果你有自己的域名，也可以在 `Namespaces `页面加 `com.xxx` 走 `DNS TXT` 验证。我这里没有自己的域名，就不写这方面的教程了。

> [!TIP]
>
> 如果使用`github`登陆 `Maven` 中央仓库，则会直接送一个已经验证通过的命名空间，非常方便。

如果没有自动生成`github`的命名空间, `jetbrains`写了如下教程，链接：[https://www.jetbrains.com.cn/en-us/help/kotlin-multiplatform-dev/multiplatform-publish-libraries-to-maven.html#choose-and-verify-a-namespace](https://www.jetbrains.com.cn/en-us/help/kotlin-multiplatform-dev/multiplatform-publish-libraries-to-maven.html#choose-and-verify-a-namespace)

> 1. 以`io.github.<your username>`为例, 作为你的命名空间，Submit然后点击提交。
> 2. `Verification Key` 复制新创建的命名空间下显示的验证密钥。
> 3. 在 `GitHub` 上,使用你使用的用户名登录,并创建一个新的公有仓库,并将验证密钥作为仓库名称,例如`http://github.com/kotlin-hands-on/ex4mpl3c0d`。
> 4. 返回 `Maven Central`, `Verify Namespace` 然后单击“验证名称空间”按钮。验证成功后,您可以删除已创建的仓库。

### 2. 创建推送时的账号和个人访问令牌

在 Portal 里生成 User Token，这一步和在 `Github Packages`上发布软件包时的步骤一致，要先获取个人访问令牌。

登录 [Portal (Maven中央仓库)](https://central.sonatype.com/) → 右上角头像 → **`View User Tokens`**(查看个人访问令牌) → `Generate User Token`(生成一个用户令牌)

![查看个人访问令牌](./assets/image-20260717163247988.png)

点击按钮生成一个令牌

![点击按钮生成一个令牌](./assets/image-20260717163431641.png)

生成个人访问令牌

![生成个人访问令牌](./assets/image-20260717163753004.png)

> [!WARNING]
>
> 拿到 `username / password` 各一串，**只显示一次，赶紧存**

![image-20260717164100995](./assets/image-20260717164100995.png)

生成的访问令牌如下图所示，因为只显示一次，所以这里只显示名称，你可以随时移除这个令牌。

![生成的访问令牌](./assets/image-20260717164505108.png)

### 3. GPG 准备

这一步就是和之前`Github Packages`不一样的地方，**多了 GPG 签名 ✅**。

`GithubPackages`不强制签名，而`maven`中央仓库是**全网可拉**的公共仓，所以必须签名防篡改/防冒充；`GitHub Packages` 走 `HTTPS + token` 鉴权，本身就是"谁能拉我管着"，所以不强制。

#### 下载 GPG

下载连接：[https://gnupg.org/download/index.html](https://gnupg.org/download/index.html)

![image-20260717172220976](./assets/image-20260717172220976.png)



#### 使用命令行生成`GPG`密钥对

以下教程来源于 `jetbrains`官方的教程  [https://www.jetbrains.com.cn/en-us/help/kotlin-multiplatform-dev/multiplatform-publish-libraries-to-maven.html#-z7k49h_121](https://www.jetbrains.com.cn/en-us/help/kotlin-multiplatform-dev/multiplatform-publish-libraries-to-maven.html#-z7k49h_121)

##### 1.使用以下命令开始生成密钥对,并在提示时提供所需详细信息:

```bash
gpg --full-generate-key
```

##### 2.为要创建的键类型选择推荐的默认值。可以将选择置换空置并按压 Enter 接受默认值。

```none
Please select what kind of key you want:
    (1) RSA and RSA
    (2) DSA and Elgamal
    (3) DSA (sign only)
    (4) RSA (sign only)
    (9) ECC (sign and encrypt) *default*
    (10) ECC (sign only)
    (14) Existing key from card
Your selection? 9

Please select which elliptic curve you want:
    (1) Curve 25519 *default*
    (4) NIST P-384
    (6) Brainpool P-256
Your selection? 1
```

> ### 注意
>
> 撰写本文时`ECC (sign and encrypt)`与`Curve 25519`。旧版本`gpg`可能默认`RSA`与`3072`小巧键大小。

##### 3.当提示指定密钥有效期时,您可以选择无有效期的默认选项。

如果选择在设定时间结束后自动过期的密钥,[extend its validity](https://central.sonatype.org/publish/requirements/gpg/#dealing-with-expired-keys)则需要在密钥过期时延长其有效期。

```none
Please specify how long the key should be valid.
    0 = key does not expire
    <n>  = key expires in n days
    <n>w = key expires in n weeks
    <n>m = key expires in n months
    <n>y = key expires in n years
Key is valid for? (0) 0
Key does not expire at all

Is this correct? (y/N) y
```

##### 4.输入您的姓名、电子邮件和可选评论,将密钥与身份关联(您可以将评论字段保留为空):

```none
GnuPG needs to construct a user ID to identify your key.

Real name: Jane Doe
Email address: janedoe@example.com
Comment:
You selected this USER-ID:
    "Jane Doe <janedoe@example.com>"
```

##### 5.输入密码以加密密钥,并在提示时重复此密码。

将此密码安全且私密地保存。以后需要在签名时访问私钥。

##### 6.使用以下命令查看您创建的密钥:

```bash
gpg --list-keys
```

输出看起来是这样的:

```none
pub   ed25519 2024-10-06 [SC]
      F175sssssssssssssssssssssEE6B5F76620B385CE
uid   [ultimate] Jane Doe <janedoe@example.com>
      sub   cv25519 2024-10-06 [E]
```

在接下来的步骤中, 你需要使用输出中显示的密钥的长字母数字标识符。例如上边的`F175482952A225BFD4A07A713EE6B5F76620B385CE`

------

#### 使用客户端来生成`GPG`密钥对

如果你觉得用命令行太麻烦，安装完成`GPG`后，会附带一个客户端，在 `你的安装目录/Gpg4win/bin`下的`kleopatra.exe`，双击它，即可运行这个客户端，如下图所示：

![GPG的客户端](./assets/image-20260717191311646.png)

##### 设置密钥基本信息

输入名称和邮箱，和前边一个步骤一致。以及，是否设置密码短语 `passphrase`。设置密钥的生成算法。

![输入名称和邮箱](./assets/image-20260717191446102.png)

##### 设置你的密码短语 `passphrase`

设置你的密码短语 `passphrase`，会要你重复输入第二次。

![设置你的密码短语](./assets/image-20260717191516875.png)

片刻后，密钥生成，会给你这个密钥的指纹（或者说ID）。**不是你的真实密钥，只是ID。**

![密钥生成成功](./assets/image-20260717191940552.png)

##### 在列表中查看密钥

![在列表中查看密钥](./assets/image-20260717192034774.png)

#### 私钥在哪？(可选阅读)

你的私钥并没有丢，只是默认被 `GPG` 藏在了一个**受保护的目录**里，平常 `gpg --list-keys` 只列公钥，想看私钥要多加一个参数。

##### 1️⃣ 物理位置（文件系统）

所有密钥数据都存在 `~/.gnupg/` 目录下（`Windows` 一般在 `%APPDATA%\gnupg`）：

- `pubring.kbx` — 公钥环
- `private-keys-v1.d/` — 私钥文件（每个私钥一个 `.key` 文件，文件名是一串 hash，没有扩展名）
- `openpgp-revocs.d/` — 吊销证书（重要！私钥丢了用它声明作废）

##### 2️⃣ 命令行查看私钥

```bash
gpg --list-secret-keys
```

输出类似：

```
sec   ed25519 2024-10-06 [SC]
      F1754sssssssssssssssss4A07A713EE6B5F76620B385CE
uid           [ultimate] Jane Doe <janedoe@example.com>
ssb   cv25519 2024-10-06 [E]
```

注意第一行是 `sec`（secret），而 `gpg --list-keys` 第一行是 `pub`（public）。只要 `sec` 出现了，就说明私钥在你的密钥环里。

GPG 输出里四个前缀是一套对称命名：

| 前缀  | 全称          | 含义               |
| ----- | ------------- | ------------------ |
| `pub` | public key    | 主钥的**公钥**部分 |
| `sec` | secret key    | 主钥的**私钥**部分 |
| `sub` | public subkey | 子钥的**公钥**部分 |
| `ssb` | secret subkey | 子钥的**私钥**部分 |

**主钥（Primary Key）**：`[SC]` = **S**ign（签名） + **C**ertify（认证子钥）。主钥本身可以用来签名，也负责签发子钥（"这个子钥是我授权的"）。

**子钥（Subkey）**：`[E]` = **E**ncrypt（加密）。日常加解密用子钥，主钥可以冷存离线，丢了子钥直接吊销换一对，不影响主身份。

##### 私钥为什么看不到？

GPG 设计理念：**私钥默认不暴露给用户直接浏览**，因为它是一个二进制文件，你也不应该随便复制粘贴。日常签名操作（比如 `Gradle signing` 插件）会自动调用 `GPG` 后台进程，通过 `gpg-agent` 读取私钥，你只需要输入 `passphrase`（或提前缓存好）。

#### 上传公钥

[您需要将公钥上传到密钥服务器](https://central.sonatype.org/publish/requirements/gpg/#distributing-your-public-key),以便被 `Maven Central` 接受。有多个可用的密钥服务器,让我们来使用`keyserver.ubuntu.com`作为默认选择。

##### 使用命令行上传公钥

运行以下命令以使用公共密钥上传`gpg`, 在参数中替换您自己的**密钥ID**:

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F175482sssssssssssssssssss6B5F76620B385CE
```

##### 使用客户端来上传公钥

直接在首页设置密钥服务器：

![设置密钥服务器](./assets/image-20260717202918879.png)

也可以在二级菜单设置：

打开刚才提到的客户端： 设置 --> 配置`Kleopatra`--> `GnuPG`系统

![image-20260717195739828](./assets/image-20260717195739828.png)

在 **Network** 选项卡下，找到 `Configuration for OpenPGP servers` 区域：

- 将 **`use keyserver at URL`** 这一栏的内容清空。
- 将其修改为：`hkps://keyserver.ubuntu.com`

> [!NOTE]
>
> *(注：前缀必须是 `hkps://`，这是加密传输协议，比普通的 `hkp://` 更安全)*

修改完成后，点击右下角的 **确定(O)** 或 **应用(A)** 保存设置。

![配置密钥服务器](./assets/image-20260717195930880.png)

然后，这个时候我们就可以在密钥服务器上发布我们的密钥了。右键你的密钥，点击`在服务器上发布`即可。如果你没有设置密钥服务器，这一步将会报错。

这和上边的操作和命令行的效果一致，这等效于：

```bash
gpg --keyserver keyserver.ubuntu.com --send-keys F1754sssssssssssssssssssssEE6B5F76620B385CE
```

![在服务器上发布密钥](./assets/image-20260717200220147.png)

> [!CAUTION]
>
> 客户端会提示你，一旦发布，将无法删除。

![警告](./assets/image-20260717200455006.png)

直接忽略警告，将公钥发布。

![image-20260717201943599](./assets/image-20260717201943599.png)

##### 如何验证你刚才的公钥已经上传成功了

###### 使用命令行验证

执行以下命令：

```bash
gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys 你的长密钥ID
```

出现以下就是成功了：

![image-20260717203153997](./assets/image-20260717203153997.png)

如果是下边这样：

![image-20260717201452165](./assets/image-20260717201452165.png)

这有可能是服务器还没上传成功，多等一会，或者再传一遍。

###### 使用客户端验证

直接在客户端上点击`在服务器上搜查找`，使用你的8位密钥ID，或者长密钥ID搜索（都是可以的），等一会就出现了，如下图所示。

![image-20260717202821569](./assets/image-20260717202821569.png)

##### 上传公钥到`github`

**导出公钥**：在客户端中，对着你的密钥，点击导出，即可将公钥导出到文件中。

如图所示，登陆你的`githugb`，在个人设置中，找到`GPG`的设置，将刚才公钥文件的内容粘贴进来，文件会以`-----BEGIN PGP PUBLIC KEY BLOCK-----`作为开头。

![image-20260717213204174](./assets/image-20260717213204174.png)

![image-20260717213603063](./assets/image-20260717213603063.png)

#### 导出私钥

我们有导出私钥的需求（比如 CI 里用 `useInMemoryPgpKeys`）。要让您的`Gradle`项目访问您的私钥,您需要将其导出到文件中。系统会提示您输入创建密钥时所使用的密码。

##### 使用命令行导出私钥

使用以下命令,以您自己的密钥 ID 为参数:

```bash
gpg --armor --export-secret-keys F1754829sssssssssssssss15EE6B5F76620B385CE > key.gpg
```

此命令将创建一个`key.gpg`包含私钥的文本文件。包含 `-----BEGIN PGP PRIVATE KEY BLOCK-----` 开头的内容，那就是你的私钥 ASCII 文本格式。

或者，使用下边的命令直接在命令行导出

```bash
gpg --armor --export-secret-keys 你的8位短密钥
```

##### 使用客户端导出私钥

![image-20260717210037057](./assets/image-20260717210037057.png)

##### 一个小提醒

> [!WARNING]
>
> 切勿将私钥文件与任何人共享——只有您才能访问该文件,因为该私钥能够使用您的凭据进行签名。

如果你刚才 `gpg --full-generate-key` 时设置了 `passphrase`，那私钥文件本身是被加密的（`AES256`），即使有人拿到了 `private-keys-v1.d/` 下的文件，没有 `passphrase` 也无法使用。所以请确保 `passphrase` 记住，或者用密码管理器保存。



------



### 4. 配置环境变量

别急，距离成功还差最后一步，坚持。配置环境变量有两种我比较推荐的方式：配置`~/.gradle/gradle.properties` 文件、配置系统环境变量。

#### 配置`~/.gradle/gradle.properties` 文件(推荐)

这里以配置`~/.gradle/gradle.properties` 文件为例来说明，如果是配置系统环境变量，和这里类似，步骤一样的。

如果你没有设置 `GRADLE_USER_HOME` 环境变量，那么你的 `gradle.properties` 文件就保存在`C:\Users\你的用户名\.gradle`目录下；如果你设置了`GRADLE_USER_HOME` 环境变量，那么就对应的是环境变量下的目录，例如我的就如下图所示：

我的`GRADLE_USER_HOME`环境变量：

![我的GRADLE_USER_HOME环境变量](./assets/image-20260717193528429.png)

如图所示，我把`gradle.properties`文件从C盘改到了D盘，到我对应目录中，我们编辑`gradle.properties`文件，如果没有，就创建一个，下边粘一个我的示例：

```properties
# github的用户名
gpr.user=xxxxxxxx
# github的个人访问令牌
gpr.key=ghp_xxxxxxxxxxxxxxxxxxxxxx

# 因为我们需要使用 com.vanniktech.maven.publish 插件，所以必须按他的格式来写配置
# com.vanniktech.maven.publish 插件 需求变量 ：
# Maven中央仓库门户网站 Portal  https://central.sonatype.com/ 生成的用户名
mavenCentralUsername=xxxxx
# Maven中央仓库门户网站 Portal  https://central.sonatype.com/ 生成的个人访问令牌
mavenCentralPassword=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# signingInMemoryKeyPassword=私钥的密码 密码短语 passphrase
signingInMemoryKeyPassword=xxxxxx
# CI 用的私钥(上一步使用命令行和客户端的方式导出的)（私钥整串导出：gpg --armor --export-secret-keys ABCDEF12） 
# properties 不允许换行，所以我们必须使用 \n\ 来换行
# signingInMemoryKey=你的GPG私钥（ASCII-armored格式，包含 -----BEGIN PGP PRIVATE KEY BLOCK----- 等）
signingInMemoryKey=\
-----BEGIN PGP PRIVATE KEY BLOCK-----\n\
\n\
xxxxxxxxxxxx\n\
xxxxxxxxxxxx\n\
-----END PGP PRIVATE KEY BLOCK-----\n\
```

易错点：

> [!IMPORTANT]
>
> `signingInMemoryKey`需要注意：私钥在定义时因为很长，所以原始文件存在换行，但是我们的`gradle.properties`文件不支持换行，但是存在换行语法，也就是使用一个`\`来表示换行拼接，然后在前边手动加回车`\n`，如上边代码所示。
>
> 

##### `gradle`语法

配置`~/.gradle/gradle.properties` 文件的话，在`gradle`中使用以下语法获取配置值：

```kotlin
import java.util.Properties
import kotlin.apply

// 1. 从 GRADLE_USER_HOME 读取全局 gradle.properties (存放 git 凭证) !!! 不要把密钥放到仓库里上传到 github
val globalProps = Properties().apply {
    gradle.gradleUserHomeDir.resolve("gradle.properties").takeIf(File::exists)?.reader()?.use(::load)
}

username = globalProps.getProperty("gpr.user") ?: ""
password = globalProps.getProperty("gpr.key") ?: ""
```

#### 配置系统环境变量

这一步没什么好说的，很简单，在窗口中配置即可，如下图所示

![配置系统环境变量](./assets/image-20260717193528429.png)

我这里配置了`GITHUB_TOKEN`这个环境变量，也就是`github`的个人访问令牌。其他几个变量类似设置。

或者，我们使用`powershell`来生成环境变量：

```powershell
# Windows PowerShell
$env:GPG_PRIVATE_KEY = (gpg --armor --export-secret-keys 你的8位短密钥ID)
$env:GPG_PASSPHRASE = "你的密码"
```

##### `gradle`语法

如果是系统环境变量的话，在`gradle`中使用以下语法获取配置值：

```kotlin
username = System.getenv("GITHUB_ACTOR") ?: ""
password = System.getenv("GITHUB_TOKEN") ?: ""
```

------



## 二、Gradle 项目配置

### 插件选择

```kotlin
// <module directory>/build.gradle.kts

plugins {
    kotlin("jvm") version "2.2.0"
    /* 对应 publishing 节点; 使用传统方式发布软件包 */
    `maven-publish`
    // 添加原生签名插件，用于GPG签名
    signing
    /* 使用社区插件 com.vanniktech.maven.publish 发布软件包:
    * JVM : 必须 17 以上 (在项目结构中修改SDK级别, 不是修改语言级别)，
    * Kotlin : 2.2.0以上；
    * gradle : com.vanniktech.maven.publish 插件 0.36.0 调用了 ProjectLayout.getSettingsDirectory() 方法，该方法在 Gradle 8.12 才引入;
    * 我TM服了。*/
    id("com.vanniktech.maven.publish") version "0.36.0"
}
```

> [!CAUTION]
>
> 这里有个大坑！！！我踩了好几次才爬出来！！！自己慢慢摸索的。
>
> - 使用原生的插件`maven-publish`配置的发布链接，无论你配置哪一个，都无法发布到`maven`中央仓库，别试了。无论是：`https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/`还是`https://ossrh-staging-api.central.sonatype.com/service/local/staging/deploy/maven2/`，还是`https://central.sonatype.com/api/v1/publisher/bundle`；别试了，一个都发布不了，里边兼容性的坑无数，你慢慢去研究吧。
> - 最好的办法就是别用原生的`maven-publish`插件发布到`maven中央仓库`，你可以继续用这个插件发布到`GitHubPackages`和其他的仓库，但是别发布到中央仓库，兼容性的坑我已经替你拆过了，别去再踩一遍了。
> - 要想发布到`Maven中央仓库`，目前有且仅能使用`com.vanniktech.maven.publish`插件，这是 `jetbrains`官方最推荐的做法，请务必使用这个插件。我基本上遵循下边这个官方教程来操作的：[https://www.jetbrains.com.cn/en-us/help/kotlin-multiplatform-dev/multiplatform-publish-libraries-to-maven.html#set-up-the-publishing-plugin](https://www.jetbrains.com.cn/en-us/help/kotlin-multiplatform-dev/multiplatform-publish-libraries-to-maven.html#set-up-the-publishing-plugin)
> - 即便是照着`jetbrains`官方教程来操作，仍然踩了一万个大坑，我TM服了！！！`com.vanniktech.maven.publish`插件仍然有很多问题：
>   - JVM : 必须 17 以上 (在项目结构中修改SDK级别, 不是修改语言级别)
>   - Kotlin : 必须  2.2.0 以上
>   - gradle : 必须 8.12 以上
>   - 请不要定义额外定义名为`maven`的发布内容，插件会默认按这个名字来。否则冲突。
>   - 请不要定义额外的源码包和文档包发布内容，插件已经帮你做了。否则冲突。
> - 因为我们是要同时发布`Maven中央仓库`和`GitHubPackages`，所以这里应用了两种插件。

走到这一步，点同步，不报bug，你基本解决90%的问题了。坚持住，我们再执行下一步。

### 定义组织机构和元数据

没什么好说的，你照着改成自己的就行了，所有元数据必须齐全！！！否则中央仓库拒收。

```kotlin
/* ======================= 填写个人信息 ============================= */
/** 从 settings.gradle.kts 文件取值过来 */
val artifactId: String = rootProject.name
/* 组织机构的名称必须是 io.github.<你的github名称>，除非你有你自己的域名; maven中心会校验你是否拥有这个域名，否则一律挂到 github 下 */
group = "io.github.你的github名称"
/* 版本号  !!! 严禁 -SNAPSHOT */
version = "1.0.0"
/** 提取个人的链接，方便统一修改 */
val myGit: String = "github.com/你的github名称/你的仓库名"
/** 复用我的POM */
val myPom: MavenPom.() -> Unit = {
    name = artifactId
    description = "更聪明的网络字节转换器"
    url = "https://$myGit"
    licenses {
        license {
            name = "The Apache License, Version 2.0"
            url = "https://www.apache.org/licenses/LICENSE-2.0.txt"
        }
    }
    developers {
        developer {
            id = "xxx"
            name = "xxxx"
            email = "xxxxxxxxxxxx@xxxxxx.com"
        }
    }
    scm {
        url = "https://$myGit"
        connection = "scm:git:git://$myGit.git"
        developerConnection = "scm:git:ssh://$myGit.git"
    }
}
```

### 定义源码包和文档注释发布

`Maven Central` 要求的是“发布的制品里必须包含 `sources` 和 `javadoc`”，不管你用什么方式生成，只要最终上传的包里有 `.jar`、`-sources.jar`、`-javadoc.jar` 这三个文件就行。

#### 方式一：手动定义(不推荐)：

老款的方式定义源码包和文档注释发布内容，看看得了。这里使用了下边的语句定义两个发布任务：

```kotlin
// 5. 源码包 (可深入源码DEBUG)
tasks.register<Jar>("sourcesJar") {
    description = "源码包 (可深入源码DEBUG)"
    archiveClassifier.set("sources")
    from(sourceSets.main.get().allSource)
}
// 6. Javadoc 包 (可查看文档注释)
tasks.register<Jar>("javadocJar") {
    description = "Javadoc 包 (可查看文档注释)"
    archiveClassifier.set("javadoc")
    from(tasks.javadoc.get().outputs)
}
```

然后在 `publication` 里：

```kotlin
publications {
    create<MavenPublication>("maven") {
        from(components["java"])
        // 源码包 (可深入源码DEBUG)
        artifact(tasks["sourcesJar"])
        // Javadoc 包 (可查看文档注释)
        artifact(tasks["javadocJar"])
        // 可以在这里自定义 POM 内容
        pom {
            /* */
            licenses {
                license {/* */}
                scm {/* */}
            }
        }
    }
}
```

#### 方式二: 一行代码创建(仍然不推荐)

更快，但是我还是不推荐

```kotlin
// <module directory>/build.gradle.kts
java {
    withSourcesJar()
    withJavadocJar()
}
```

#### 方式三： 使用`com.vanniktech.maven.publish`插件(强烈推荐)



```kotlin
/* 是的, build.gradle.kts 文件里边没有一行关于发布物的代码。
* 你什么都不需要定义。
* 我觉得这才是真正的开箱即用, 真正意义上的解耦，非常省心！！！
* 好的软件就应该这么设计，简单，使用者无心里负担。
* /
```

你TM怎么前边写了这么多代码，然后现在告诉我不用写一行代码。对，凡事都是有个过程。

### 定义发布内容

这里我们需要同时发布到`Maven Central`和`GitHubPackages`，所以使用了后边的语法来追加发布内容。

> [!CAUTION]
>
> 注意！！由于`com.vanniktech.maven.publish` 插件 已经打包了发布内容，所以这里只需要追加远程仓库即可。使用`afterEvaluate`往后边追加远程仓库的地址即可，包括你的自建`maven`仓库也是可以的，我这里举例的是自建的 `gitea`仓库。

```kotlin
// <module directory>/build.gradle.kts
/* 使用 mavenPublishing 发布到 Maven Central，签名、源码包、文档包均由插件自动处理 */
mavenPublishing {
    /* 这里再强调一遍，com.vanniktech.maven.publish 插件 0.36.0 调用了 ProjectLayout.getSettingsDirectory() 方法，该方法在 Gradle 8.12 才引入；所以版本一定要对 */
    publishToMavenCentral()
    /* 这里的语法会到 `~/.gradle/gradle.properties` 文件中吃 mavenCentralUsername mavenCentralPassword signingInMemoryKeyPassword 以及 signingInMemoryKey 这4个配置，所以前一步的环境变量一定要配置好。*/
    signAllPublications()
    /* 这一步会读取前边定义好的元数据 */
    coordinates(group.toString(), artifactId, version.toString())
    /* 这一步会读取前边定义好的元数据 */
    pom(myPom)
}
/* 追加 GitHubPackages 发布目标; com.vanniktech.maven.publish 插件 已经打包了发布内容，所以这里只需要追加远程仓库。 */
afterEvaluate {
    /* 从 GRADLE_USER_HOME 读取全局 gradle.properties (存放 git 凭证) !!! 不要把密钥放到仓库里上传到 github */
    val globalProps: Properties = Properties().apply {
        gradle.gradleUserHomeDir.resolve("gradle.properties")
            .takeIf(File::exists)?.reader()?.use(::load)
    }
    publishing {
        repositories {
            maven {
                name = "GitHubPackages"
                url = uri("https://maven.pkg.github.com/xxxxxxxxxxx/${artifactId}")
                credentials {
                    username = globalProps.getProperty("gpr.user") ?: System.getenv("GITHUB_ACTOR") ?: ""
                    password = globalProps.getProperty("gpr.key") ?: System.getenv("GITHUB_TOKEN") ?: ""
                }
            }
            /*  // 使用 Gitea 自建的远程仓库
             maven {
                 // 使用 Gitea 自建的远程仓库，名称强制指定为 Gitea
                 name = "Gitea"
                 url = uri("http://你的内网IP地址:你的端口号/api/packages/你的gitea名/maven")
                 // http 链接需要强制使用 isAllowInsecureProtocol = true
                 isAllowInsecureProtocol = true
                 // 设置仓库凭证
                 credentials(HttpHeaderCredentials::class) {
                     // Gitea 规定，名称强制为 Authorization
                     name = "Authorization"
                     // Gitea 的个人访问令牌和 github 类似，到网站上自己去生成一个。
                     value = "token ${globalProps.getProperty("gitea.token")}"
                 }
                 // 以下代码为固定的
                 authentication {create("header", HttpHeaderAuthentication::class)}
             }
             */
        }
    }
}
```

### 完整 `build.gradle.kts`：

```kotlin
import java.util.Properties
import kotlin.apply

plugins {
    kotlin("jvm") version "2.2.0"
    /* 对应 publishing 节点; 使用传统方式发布软件包 */
    `maven-publish`
    // 添加原生签名插件，用于GPG签名
    signing
    /* 使用社区插件 com.vanniktech.maven.publish 发布软件包:
    * JVM : 必须 17 以上 (在项目结构中修改SDK级别, 不是修改语言级别)，
    * Kotlin : 2.2.0以上；
    * gradle : com.vanniktech.maven.publish 插件 0.36.0 调用了 ProjectLayout.getSettingsDirectory() 方法，该方法在 Gradle 8.12 才引入;
    * 我TM服了。*/
    id("com.vanniktech.maven.publish") version "0.36.0"
}
/* ======================= 填写个人信息 ============================= */
/** 从 settings.gradle.kts 文件取值过来 */
val artifactId: String = rootProject.name
/* 组织机构的名称必须是 io.github.<你的github名称>，除非你有你自己的域名; maven中心会校验你是否拥有这个域名，否则一律挂到 github 下 */
group = "io.github.xxxxxxx"
/* 版本号  !!! 严禁 -SNAPSHOT */
version = "1.0.0"
/** 提取个人的链接，方便统一修改 */
val myGit: String = "github.com/xxxxxxxxx/xxxxxxxxxxxx"
/** 复用我的POM */
val myPom: MavenPom.() -> Unit = {
    name = artifactId
    description = "xxxxxxxxxxxxx"
    url = "https://$myGit"
    licenses {
        license {
            name = "The Apache License, Version 2.0"
            url = "https://www.apache.org/licenses/LICENSE-2.0.txt"
        }
    }
    developers {
        developer {
            id = "xxx"
            name = "xxx"
            email = "xxxxxxxxxxx@xxxxxx.com"
        }
    }
    scm {
        url = "https://$myGit"
        connection = "scm:git:git://$myGit.git"
        developerConnection = "scm:git:ssh://$myGit.git"
    }
}
// 定义仓库，构建脚本会从这里拉取依赖
repositories {
    mavenCentral()
}
/* 使用 mavenPublishing 发布到 Maven Central，签名、源码包、文档包均由插件自动处理 */
mavenPublishing {
    publishToMavenCentral()
    signAllPublications()
    coordinates(group.toString(), artifactId, version.toString())
    pom(myPom)
}
/* 追加 GitHubPackages 发布目标; com.vanniktech.maven.publish 插件 已经打包了发布内容，所以这里只需要追加远程仓库。 */
afterEvaluate {
    /* 从 GRADLE_USER_HOME 读取全局 gradle.properties (存放 git 凭证) !!! 不要把密钥放到仓库里上传到 github */
    val globalProps: Properties = Properties().apply {
        gradle.gradleUserHomeDir.resolve("gradle.properties")
            .takeIf(File::exists)?.reader()?.use(::load)
    }
    publishing {
        repositories {
            maven {
                name = "GitHubPackages"
                url = uri("https://maven.pkg.github.com/xxxxxxxxxxxxxx/${artifactId}")
                credentials {
                    username = globalProps.getProperty("gpr.user") ?: System.getenv("GITHUB_ACTOR") ?: ""
                    password = globalProps.getProperty("gpr.key") ?: System.getenv("GITHUB_TOKEN") ?: ""
                }
            }
            /*  // 使用 Gitea 自建的远程仓库
             maven {
                 // 使用 Gitea 自建的远程仓库，名称强制指定为 Gitea
                 name = "Gitea"
                 url = uri("http://你的内网网址:你的端口号/api/packages/你的gitea名/maven")
                 // http 链接需要强制使用 isAllowInsecureProtocol = true
                 isAllowInsecureProtocol = true
                 // 设置仓库凭证
                 credentials(HttpHeaderCredentials::class) {
                     // Gitea 规定，名称强制为 Authorization
                     name = "Authorization"
                     // Gitea 的个人访问令牌和 github 类似，到网站上自己去生成一个。
                     value = "token ${globalProps.getProperty("gitea.token")}"
                 }
                 // 以下代码为固定的
                 authentication {create("header", HttpHeaderAuthentication::class)}
             }
             */
        }
    }
}
// 项目依赖
dependencies {
    testImplementation(kotlin("test"))
}
// 测试任务，脚本构建的时候，会自动跑一遍所有的测试项；保证单元测试不出bug
tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(8)
}
```

------

## 三、发布

最后，我们执行发布即可，使用`gradle`命令：

```bash
./gradlew publish
```

或者直接使用`IDEA`插件：

![`IDEA`插件](./assets/image-20260717215640858.png)

发布成功：

![image-20260719175525565](./assets/image-20260719175525565.png)

> [!IMPORTANT]
>
> 历经千山万水，终于发布成功了。全都是泪啊。
>

## 四、验证发布状态

### 验证`Github Packages`的发布状态

以我的项目[https://github.com/shilic/smart-network-byte](https://github.com/shilic/smart-network-byte)为例：

![image-20260717215919032](./assets/image-20260717215919032.png)

### 验证 `Maven`中央仓库

打开 [https://central.sonatype.com/](https://central.sonatype.com/)，**用 GitHub 登录**。终于看得到发布物了。

![待发布物](./assets/image-20260719175716198.png)

最终确认页面，要你最后再确认一遍。提醒你，一旦发布，将无法删除。

![最后确认](./assets/image-20260719175751911.png)

发布之后

![image-20260719180126191](./assets/image-20260719180126191.png)

可见，丢弃按键和发布按键被锁定了，已经无法删除了。所以代码要慎重，不能给别人留BUG，不然就是一辈子的黑点。别人要用，你不能随时给别人撤销了。

可见，状态为 `PUBLISHING`（发布中），你只需要等几分钟，等发布完成即可。

![image-20260719180429133](./assets/image-20260719180429133.png)

最后，在搜索框中，我们可以搜索到自己的发布物了：

![image-20260719180621502](./assets/image-20260719180621502.png)



## 五、易错点汇总

以下是前面章节里分散提到的所有坑，集中整理在这里，供发布前逐条核对。

### 插件与版本

| 易错点 | 说明 |
|---|---|
| **不能用原生 `maven-publish` 发 `Maven Central`** | 不管你把 URL 配成 `s01.oss.sonatype.org` 还是 `central.sonatype.com`，原生插件都发不上去。必须用 `com.vanniktech.maven.publish`，这是 `JetBrains` 官方推荐的做法 |
| **版本三件套要对齐** | `com.vanniktech.maven.publish` 0.36.0 要求：`JVM` ≥ 17（项目结构里改 `SDK`，不是改语言级别）、`Kotlin` ≥ 2.2.0、`Gradle` ≥ 8.12。缺一个就报错 |
| **不要额外定义叫 `maven` 的 `publication`** | 插件内部已注册名为 `maven` 的发布内容，你再定义一个同名的一定冲突 |
| **不要额外定义源码包和文档包任务** | 插件已经自动打包 `-sources.jar` 和 `-javadoc.jar`，再手动定义 `sourcesJar` / `javadocJar` 任务会导致重复 |

### `GPG` 签名

| 易错点 | 说明 |
|---|---|
| **公钥必须上传到 `keyserver`** | `Portal` 验签名时去 `keyserver` 上查你的公钥，没传就验不过。用 `gpg --keyserver keyserver.ubuntu.com --send-keys <你的密钥ID>` 上传；上传后可能有延迟，等几分钟再试 |
| **`keyserver URL` 前缀必须是 `hkps://`** | 如果用客户端上传，先在设置里把 `keyserver` 地址清空，改成 `hkps://keyserver.ubuntu.com`，不是 `hkp://`（明文），否则连接失败 |
| **私钥导出后妥善保管** | `gpg --armor --export-secret-keys` 导出的文件包含 `-----BEGIN PGP PRIVATE KEY BLOCK-----`，这个文件**绝对不能**提交到 Git 仓库或分享给任何人 |
| **`passphrase` 忘了等于私钥作废** | 生成密钥时设的密码短语（`passphrase`）是私钥的最后一道锁。忘了就只能重新生成密钥对、重新上传公钥、重新发布 |

### 环境变量与 `gradle.properties`

| 易错点 | 说明 |
|---|---|
| **`Token` 只显示一次** | `Portal` 生成的 `mavenCentralUsername` / `mavenCentralPassword` 和 `GitHub` 的 `Personal Access Token` 一样，生成后只展示一次。关闭页面前必须存好 |
| **`signingInMemoryKey` 的换行格式** | `gradle.properties` 不支持多行字符串，私钥的每一行末尾加 `\n\`，上一行用 `\` 续到下一行。格式不对 → 签名失败 |
| **四个配置一个不能少** | `mavenCentralUsername`、`mavenCentralPassword`、`signingInMemoryKeyPassword`、`signingInMemoryKey`——少任何一个，插件都签不了名 |
| **不要把密钥写进项目里的 `gradle.properties`** | 项目的 `gradle.properties` 会被 Git 跟踪。密钥只能放在 `~/.gradle/gradle.properties`（全局）或系统环境变量里 |

### `POM` 与元数据

| 易错点 | 说明 |
|---|---|
| **版本号禁止 `-SNAPSHOT`** | `Maven Central` 不收快照版本。版本号只能是 `1.0.0` 这种正式格式 |
| **`POM` 六个字段缺一不可** | `name`、`description`、`url`、`license`、`developer`、`scm`——`Portal` 会逐字段校验，任何一个缺失都拒收。`checkPomFileForMavenPublication` 任务可在本地提前自查 |
| **`groupId` 必须是你的命名空间** | 用 `GitHub` 登录则 `io.github.<你的用户名>` 自动验证通过。如果填了别的域名（如 `com.example`），`Portal` 会要求你证明你拥有该域名 |

### 发布后

| 易错点 | 说明 |
|---|---|
| **一旦发布，永久无法删除** | `Portal` 确认发布后，"丢弃"和"发布"按钮同时锁定，无法撤回。所以发布前务必确认代码经过了充分的测试 |
| **发布有延迟** | 点击 `Publish` 后状态变为 `PUBLISHING`，几分钟后才能在搜索框中搜到。不是卡住了，是正常流程 |
| **中央仓库 ≠ 即时可用** | 即使 `Portal` 显示发布成功，下游用户通过 `mavenCentral()` 拉到你的包可能还需要几小时（`CDN` 同步）。急着用的话手动刷新一下依赖缓存 |

------

## 六、关于 `smart-network-byte`

本文的完整示例来自我的开源项目 [**`smart-network-byte`**](https://github.com/shilic/smart-network-byte)——一个更聪明的网络字节转换器（Kotlin/JVM 库）。如果你在做车载通信、IoT 协议、或者任何需要处理大端小端字节序的场景，可以关注一下。

已发布到 Maven Central，一行依赖即可使用：

```kotlin
implementation("io.github.shilic:smart-network-byte:1.0.0")
```

[GitHub: github.com/shilic/smart-network-byte](https://github.com/shilic/smart-network-byte)　|　欢迎 Star ⭐

## 参考链接

- `jetbrains`写的教程: [https://www.jetbrains.com.cn/en-us/help/kotlin-multiplatform-dev/multiplatform-publish-libraries-to-maven.html](https://www.jetbrains.com.cn/en-us/help/kotlin-multiplatform-dev/multiplatform-publish-libraries-to-maven.html)(主要参考链接, 照着这个操作仍然有无数个坑)
- `Maven中央仓库`官方写的教程: [https://central.sonatype.org/register/central-portal/](https://central.sonatype.org/register/central-portal/)(次要参考链接)
- CSDN用户[掉头发的王富贵](https://masiyi.blog.csdn.net)写的教程：[https://blog.csdn.net/csdnerM/article/details/136784455#jar_343](https://blog.csdn.net/csdnerM/article/details/136784455#jar_343)(基本没什么参考价值，主要原因是我没会员，看不到后边内容；其次，我们是`kotlin + gradle`，这篇教程是`java + maven`，参考价值不大)
