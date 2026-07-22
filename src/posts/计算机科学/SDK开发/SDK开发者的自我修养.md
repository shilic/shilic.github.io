# SDK开发者的自我修养

> [!IMPORTANT]
>
> 随着软件项目的庞大，模块化开发成为必然，`高内聚低耦合`成为评价一个系统的重要标准。一个模块只做一件事，我们会把一些通用的代码分离出来，到其他项目中进行单独的维护，别人再通过依赖的方式使用。这就是SDK的作用。



**易用性与一致性**

- 遵循**最小惊奇原则**：接口行为应直观，符合开发者预期。使用者不需要去猜这个函数应该怎么用，如何传参，而是一眼就能看明白怎么用。
- 保持**命名风格统一**：类、方法、变量命名遵循平台惯例（如Java用CamelCase，Python用snake_case）。
- 提供**完整的错误处理机制**：定义清晰的异常/错误码体系，附带可读的错误消息。







**测试与质量保障**

- **单元测试覆盖率 ≥ 80%**，重点覆盖边界条件和异常路径。
- **集成测试**：模拟真实网络环境，测试端到端流程。
- **压力测试**：评估高并发下的性能和资源消耗。
- **持续集成（CI）**：每次提交自动运行测试、静态代码分析、构建检查。



## 一、 🔌 接口契约与向后兼容(最重要规范)

> [!NOTE]
>
> **一句话定义**：SDK 必须使用语义化版本号，并在同一主版本内严格遵守向后兼容承诺。

### 🌓 版本号即契约

> [!TIP]
>
> 所有对外暴露的接口（包括构造函数、方法签名、URL 路径、配置项）都必须在首次发布时确定版本号。

比如说针对 `Web API`，你可以用`/api/v2/users`方式定义`API`，这样不同版本可以共存，使用者可以逐步迁移，而不是被迫一次性全改。

#### ✍ 立刻上手: 使用`@since`文档注释

再比如说，我们的很多编程语言都有文档注释来标注函数或 API 的引入版本。以下是几个常见例子：

| 语言 / 工具                                  | 标签 / 写法                                 | 示例                                                         |
| -------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------ |
| **`Java` (`JavaDoc`)**                       | `@since`                                    | `/** @since 1.8 */`                                          |
| **`Python` (`Sphinx` / `reStructuredText`)** | `.. versionadded::`                         | `.. versionadded:: 3.6`                                      |
| **`C#` (`XML `文档注释)**                    | `<since>`                                   | `/// <since>4.0</since>`（非标准，常用 `<remarks>` 或自定义标签） |
| **`TypeScript` / `JavaScript` (`JSDoc`)**    | `@since`                                    | `/** @since 2.0.0 */`                                        |
| **`Rust` (`rustdoc`)**                       | `#![doc(html_root_url = "...")]` + 文本说明 | 通常写在注释中，例如 `/// Available since Rust 1.30.0.`      |
| **`Go` (`godoc`)**                           | 无专用标签，直接在注释中写明                | `// Since Go 1.12, this function does ...`                   |

**核心思路**：无论哪种语言，都推荐在文档注释中使用明确的标签或自然语言注明“**此功能从哪个版本开始可用**”。这有助于使用者快速判断兼容性。

拿我最熟悉的`kotlin`代码来举一个例子

在 `Kotlin` 的文档注释（`KDoc`）中，推荐使用 `@since` 标签来标明函数从哪个版本开始支持。这是从 `JavaDoc` 继承而来的标准做法，`Kotlin` 官方也遵循这一惯例。

**示例:**

```kotlin
/**
 * 对字符串进行某种处理。
 *
 * @param input 待处理的字符串
 * @return 处理后的结果
 * @since xxx组件名称 1.2.0
 */
fun processString(input: String): String {
    // ...
}
```

如果你编写的是 `Kotlin` 标准库级别的代码，也可以使用 `@SinceKotlin` 注解（如 `@SinceKotlin("1.2")`），标注这个API从什么`kotlin`版本开始支持，但这属于注解而非文档注释。文档注释中仍建议使用 `@since` 标签。

### 🌔 版本号语义化

版本号本身要传达含义，通常指遵循 `SemVer`（语义化版本） 规范，格式为 `主版本.次版本.补丁`：

- **主版本**递增：做了不向后兼容的改动（比如删了一个方法、改了参数类型）。使用者需要修改代码才能升级。
- **次版本**递增：新增了功能或接口，但旧代码依然能用。使用者可以放心升级。
- **补丁**递增：只修了 `bug`，没改任何外部行为。升级无风险。

#### 📃 举个例子说明版本语义化

假设你开发了一个短信发送 SDK，最初发布版本 `1.0.0`，有一个方法 `sendSms(phone, text)`。

- 后来你想增加一个 `sendVoiceCode(phone)` 的新功能，但不影响旧的 `sendSms` → 版本号升为 `1.1.0`（次版本+1）。使用者无需改代码就能享受新功能。
- 再后来你发现 `sendSms` 的参数顺序不合理，想改成 `sendSms(text, phone)` → 这是不兼容改动，版本号升为 `2.0.0`（主版本+1）。使用者必须手动调整调用代码。
- 如果只是修复了某个国际号码的编码 bug，没有任何接口变化 → 版本号升为 `1.1.1`（补丁+1）。使用者可以无缝升级。

### 🌕 主版本内的铁律

> [!IMPORTANT]
>
> 在同一个主版本下，不得以任何方式破坏调用方的现有代码。

这意味着：

- 所有对外暴露的接口都必须在首次发布时确定版本号(如使用`@since`文档注释)
- 不能删除或重命名已公开的类、方法、常量。
- 不能修改已有方法的参数列表、返回值类型或抛出的异常类型。
- 新增字段或方法时，必须确保旧代码不受影响（例如使用默认值、可选参数、重载方法而非修改签名），不能导致旧代码编译失败或运行出错。
- 返回结果只增不减（例如 `JSON` 响应中新增字段不影响旧解析器，除非对方严格校验 `schema`）。
- 废弃的接口必须保留至少一个次版本周期，并用 `@Deprecated` 等标注明确提示。
- 每次发布(`release`或发布到软件包仓库)必须更新版本号，并在变更日志中写明变更。

### 👩‍🔬 为什么接口契约如此重要

因为 `SDK` 是被无数下游项目依赖的“积木”，随意修改会导致下游崩溃。如果没有版本化和语义化，使用者无法知道升级会不会炸掉自己的代码，最终要么不敢升级，要么出问题后骂你。有了这套规则，双方都能轻松管理依赖关系。

一旦打破向后兼容，就必须提升主版本号。这是对使用者的基本尊重——让他们能够根据版本号判断升级风险，决定何时迁移。

### 🙅‍♀️ 反例

- 直接修改已有方法的参数类型而不升主版本；
- 将某个方法的返回值从 `String` 改为 `int`；
- 删除已公开的常量。删除了一个被大量引用的工具类。

#### 👉 举一个反例： `TSMaster API`的兼容性问题

- [ ] `TSMaster API` 的兼容性问题





## 二、 🚪 最小惊奇原则：设计层抹除心智负担

> [!NOTE]
>
> **一句话定义**：一个好的设计，从设计层面就把使用者的心智负担抹掉了——用户不需要猜、不需要试错、不需要读文档，看到的那一刻动作已经定了。

这句话源于唐纳德·诺曼的《设计心理学》：**好的设计让东西自己会说话，坏的设计逼用户读说明书。**

好设计的标志其实是：**用户用完觉得"这本来就该这样"，烂设计让用户觉得"我怎么连这都不会用"**——锅是设计师的，不是用户的。

### 惊奇感公式

> 💡 **惊奇感的来源 = 实际行为 − 用户预期**

- 差值为 0 → 零心智负担（**理想态**）
- 差值为正 → 意外之喜（但更多时候是"咦？怎么会这样"的困惑）
- 差值为负 → 踩坑、报错、反直觉（**最糟糕**）

优秀的设计师做的不是"创造惊喜"，而是**把这个差值压缩到趋近于零**——让用户的所有预测都命中，所有动作都有预期内的结果。这就是"好的设计是透明的"：你感受不到它，因为你从来不需要去思考它。

### 现实世界中的最小惊奇

#### 🚪 一扇门的设计哲学

**反面**：玻璃门装了把手，你伸手一拉，发现是"推"的，撞玻璃上。再看对面贴了个"推"，但你进门那一刻**还是得先用身体试错**。这就是心智负担——你要先解读"这个把手是装饰还是真的能拉"。

**正面**：诺曼的设计——"推"的门做成**平板**，"拉"的门装**明显能握的把手**。你看到那瞬间动作已经定了，**根本不需要贴"推/拉"两个字**。标签本身就是设计失败的补丁——当你需要写说明告诉用户怎么用，说明产品本身没说清楚。

或者直接做成双向可推拉的门——彻底消灭正确或错误的使用方式。

#### 🚗 汽车工业的三个教训

**被工信部枪毙的单踏板模式**：传统车有两个踏板——油门加速、刹车减速。这是物理世界几十年的肌肉记忆。单踏板模式把"松油门=刹车"做成默认行为，在紧急情况下驾驶员的本能是"猛踩刹车"，但肌肉记忆可能让他们误踩油门。**设计违背了全人类几十年的驾驶直觉。** 工信部直接叫停——这不是技术不行，是惊奇感差值太大。

**被枪毙的隐藏式门把手**：正常门把手是凸起的，你一拉就开。隐藏式门把手在发生碰撞后可能无法弹出，救援人员打不开车门。**把"紧急情况下必须能用"这个最基本的安全需求，牺牲给了"好看"。** 工信部同样叫停。

**雨刮 + 转向灯 → 雨量传感器 + 转向自动打灯**：下雨了，你不需要先看中控屏找"雨刮开关"，车自己刮。转弯时，方向盘转到一定角度灯自动亮，不需要你额外操作。**零思考——你只管开车，其他事车替你做了。**

#### 🔌 USB-C vs Lightning vs Micro-USB

**反面**：Micro-USB 有方向性，插反了怼不进去。Lightning 解决了正反盲插，但你得是 Apple 生态。两种线不能通用。

**正面**：USB-C 正反都能插，而且是跨品牌、跨设备的统一标准。**插的动作本身零思考——你不需要先看方向、不需要辨认"这头朝上还是朝下"。** 物理层的最小惊奇。

#### ☕ 星巴克的"杯型命名"

**反面**：用户点单时会在心里做一层转换："我要中杯……不对，中杯是 Grande 还是 Tall？"——**命名体系和用户心理模型错位**。所以才有了网上铺天盖地的"星巴克杯型梗"。

**正面（其他品牌的做法）**：直接叫"小杯 / 中杯 / 大杯"。不需要翻译，你脑子里想的就是你嘴上说的。

#### 🎨 图标设计：看得懂 vs 猜不透

- **VS Code**：图标风格统一，含义清晰——文件夹是文件夹，搜索是搜索，Git 分支是 Git 分支。看一眼就知道点哪里。
- **JetBrains IDEA**：图标同样清晰，且支持**附带文本标签**——图标 + 文字双重确认，消除歧义。
- **反面教材 —— TSMaster**：部分图标设计模凌两可，用户看到后不知道点下去会发生什么，只能一个一个试。下面是截图对比：（此处附图）

> 当图标设计本身无法传达含义时，文本标签就是设计失败的补丁——和那扇玻璃门上的"推"字一样。

### 软件 API 中的最小惊奇

上面都是物理世界的例子。回到 SDK 设计，最小惊奇原则落地为几条硬规范：

#### 1. 命名遵循行业惯例

**规范**：方法命名必须符合平台和行业通用的动词约定。使用者不需要查文档就能推断一个方法的行为。

| 前缀 | 预期行为 | 示例 |
|---|---|---|
| `get` | 返回对象，不修改状态 | `getUser(id)` |
| `find` | 查询，可能返回空 | `findUsers(filter)` |
| `create` / `build` | 新建资源 | `createClient(config)` |
| `delete` / `remove` | 删除资源 | `deleteFile(path)` |
| `update` / `set` | 修改已有资源 | `updateProfile(user)` |
| `is` / `has` / `can` | 返回布尔值 | `isConnected()`、`hasPermission()` |

**反例**：`getUser` 在内部偷偷创建了一个新用户并写入数据库；`processData` 既不返回数据也不修改数据，而是发了封邮件——没人能从名字猜出它干了什么。

#### 2. 参数顺序符合常识

**规范**：参数排列应遵循"先主要后次要、先输入后输出、先目标后内容"的自然语序。

```kotlin
// ✅ 符合自然语序："给某人发某条消息"
fun sendMessage(to: String, content: String)

// ❌ 反直觉："把消息内容发给某个人"——参数和自然语言顺序相反
fun sendMessage(content: String, to: String)
```

同样：`copyFile(source, target)` 不是 `copyFile(target, source)`；`move(from, to)` 不是 `move(to, from)`。这些是几十年编程史沉淀下来的肌肉记忆，不要挑战。

#### 3. 返回值一致且可预测

**规范**：同一个模块中，相似场景的返回值类型必须一致。查询"找不到"时统一返回空值，不混用 `null` 和空集合。

```kotlin
// ✅ 一致：找不到时都返回空列表
fun findUsersByAge(age: Int): List<User>   // 可能返回 emptyList()
fun findUsersByTag(tag: String): List<User> // 同样返回空列表

// ❌ 不一致：一个返回 null，一个返回空列表，一个抛异常
fun findUsersByAge(age: Int): List<User>?   // 可能返回 null
fun findUsersByTag(tag: String): List<User>  // 返回空列表
fun findUsersByCity(city: String): List<User> // 找不到就抛 NoSuchElementException
```

调用方要写三套不同的判空逻辑。这就是心智负担——不是在用你的 API，是在**防御你的 API**。

#### 4. 副作用最小化

**规范**：查询方法不修改状态。有副作用的方法必须用动词明确标注。

```kotlin
// ✅ getXxx 只读，updateXxx 有副作用——从名字就能判断
fun getTemperature(): Double                       // 纯查询
fun updateInterval(newInterval: Long)              // 有副作用，名字已说明

// ❌ 查询方法偷偷干了别的事
fun getTemperature(): Double {
    lastAccessTime = System.currentTimeMillis()    // 偷偷修改了内部状态
    httpClient.connect()                           // 偷偷发了个网络请求
    return currentTemp
}
```

你在 `getTemperature()` 里更新了 `lastAccessTime`——这个字段下次查询时的值变了。调用方完全不知道，测试也很难 mock。**副作用一旦不可见，调试就变成了猜谜。**

#### 5. 避免隐式魔法行为

**规范**：任何"自动帮你做的事"都需要在文档或方法名中明确声明。隐式重试、自动序列化、静默降级——这些看起来贴心的行为，在出错时会变成排查黑洞。

```kotlin
// ✅ 显式：参数名已经说明会重试
fun fetchWithRetry(url: String, maxRetries: Int = 3): Response

// ❌ 隐式：名字是 "fetch"，实际上内部重试了 5 次、延迟了 30 秒
fun fetch(url: String): Response {
    for (i in 1..5) {
        try { return httpClient.get(url) }
        catch (e: IOException) { Thread.sleep(6000) }
    }
}
```

使用者在 `fetch()` 超时 30 秒后找到你，你告诉他"是自动重试了 5 次"——他的反应不会是"谢谢你的贴心"，而是"你为什么不提前告诉我？"

### 最小惊奇在 SDK 设计中的精炼

> 💡 使用者拿起你的 SDK，三分钟能跑通第一个 Demo，十分钟能写出第一个可用功能——不是因为他聪明，是因为你的设计没给他设置障碍。



## 三、 🪶 最小依赖原则：零冗余，不绑架

> [!NOTE]
>
> **一句话定义**：SDK 只能依赖绝对必要的库。每多一个依赖，就是使用者多一个潜在的冲突点。

### 为什么依赖要最小化

你引入一个第三方库，表面上只是加了一行 `implementation`。实际上你替所有使用者做了以下决定：

- **版本冲突**：使用者的项目里已经有 `okhttp 4.9`，你的 SDK 硬编码依赖 `okhttp 4.12`——编译不过。
- **包体积膨胀**：一个轻量的工具 SDK，因为引入了 Guava 全家桶，jar 从 50KB 变成 3MB。
- **安全漏洞传播**：你依赖的库爆了 CVE，所有依赖你的项目全部要紧急升级。
- **许可证污染**：你引入了一个 GPL 协议的库，使用者的商业项目被迫开源。

**每引入一个依赖，你都是在替使用者做决定——而他们没有否决权。**

### 怎么做

**硬性标准**：

- 运行时依赖只能包含：JSON 解析、HTTP 客户端、加密库——这些你不可能自己写的底层设施
- 优先选择标准库。能用 `java.net.http` 就不用 OkHttp，能用 `kotlinx.serialization` 就不引入 Gson
- 每次新增依赖前问自己："我能不能用 20 行代码代替这个库？"如果能，自己写
- 定期审查依赖树，看哪些依赖实际上只用了其中一两个方法

**可选依赖（Optional Dependency）**：

```kotlin
// ✅ 将特定序列化格式做成可选依赖
// build.gradle.kts
dependencies {
    // 核心库：零外部依赖
    implementation(kotlin("stdlib"))
    
    // 可选：使用者需要 Gson 支持时才引入
    compileOnly("com.google.code.gson:gson:2.10.0")
}
```

使用者在 `pom.xml` 或 `build.gradle` 里按需选择是否引入 Gson。他不会因为你的设计被迫拉一个不用的库。

### 反面例子

```kotlin
// ❌ 一个简单的 REST SDK 的依赖
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web:3.0.0")  // 整个 Spring Boot
    implementation("com.google.guava:guava:32.0.0-jre")  // 只用了 Preconditions.checkNotNull
    implementation("org.apache.commons:commons-lang3:3.12.0")  // 只用了 StringUtils.isBlank
}
```

这不是 SDK，这是一个"依赖全家桶"。使用者的项目可能用的是 Vert.x 或 Ktor，你的 SDK 强行拉了一个 Spring Boot 进来——**他在引入你的 SDK 那一刻，构建系统就炸了。**

```kotlin
// ✅ 同一个 SDK，遵循最小依赖
dependencies {
    implementation(kotlin("stdlib"))                     // 标准库，无争议
    implementation("com.squareup.okhttp3:okhttp:4.12.0") // HTTP，必需的底层设施
    // Guava? 自己写 checkNotNull —— 3行代码
    // commons-lang3? 自己写 isBlank —— 1行代码
    // Spring Boot? 完全不依赖框架，用标准 HTTP 接口
}
```

> 💡 **一句话**：你的 SDK 是使用者项目的客人，不是主人。客人不带一车行李进主人家门。

## 四、 ❌ 错误即信息：统一异常/错误码体系

> [!NOTE]
>
> **一句话定义**：SDK 的每一个错误都应该让调用方能**程序化地判断”下一步该做什么”**——重试、换参数、还是联系管理员。

### 为什么错误处理需要体系化

看一段调用方被迫写的代码：

```kotlin
// ❌ 调用方被迫用字符串匹配异常消息
try {
    sdk.uploadFile(file)
} catch (e: Exception) {
    when {
        e.message?.contains(“timeout”) == true -> retry()
        e.message?.contains(“auth”) == true -> refreshToken()
        e.message?.contains(“disk full”) == true -> cleanUp()
        else -> throw e
    }
}
```

用**字符串匹配异常消息**来决定后续行为——这是把”接口契约”退化成了”猜谜游戏”。一旦你更新 SDK 改了错误消息的文字，这段代码就静默失效。

### 怎么做

**定义异常层级**：

```kotlin
// ✅ 结构化的异常体系
open class SdkException(message: String, cause: Throwable? = null) 
    : RuntimeException(message, cause)

class AuthException(message: String) : SdkException(message)       // 认证失败 → 刷新 Token
class NetworkException(message: String) : SdkException(message)    // 网络超时 → 重试
class ValidationException(message: String) : SdkException(message) // 参数非法 → 修正参数
class ServerException(val statusCode: Int, message: String) : SdkException(message) // 服务端错误
```

**调用方的代码从猜谜变成了类型匹配**：

```kotlin
// ✅ 调用方可以程序化地处理不同错误
try {
    sdk.uploadFile(file)
} catch (e: AuthException) {
    refreshToken()
} catch (e: NetworkException) {
    retry()
} catch (e: ValidationException) {
    log.error(“参数错误: ${e.message}”)
    throw e  // 参数错误不需要重试
}
```

**错误码三段式**：格式 `[服务前缀]-[错误级别]-[序号]`。`SDB-ERR-1001` → 使用者在日志里看到它，不需要翻 SDK 源码就知道是 smart-dbc 的文件解析错误。

### 反面例子

```kotlin
// ❌ 全部返回 -1 或抛出 RuntimeException
fun sendSms(phone: String, text: String): Int {
    if (phone.isEmpty()) return -1       // 参数错误 → -1
    if (networkDown()) return -1         // 网络错误 → 还是 -1
    if (quotaExceeded()) return -1       // 配额超限 → 仍然是 -1
    return 0
}
```

调用方拿到了 `-1`，然后呢？重试？还是提示用户”手机号格式错误”？还是联系管理员充值？**一个 `-1` 告诉不了任何人任何事。**

> 💡 **错误处理的本质不是”告诉用户出错了”，而是”告诉用户接下来该怎么办”。**

## 五、 ⚙️ 配置集中且线程安全

> [!NOTE]
>
> **一句话定义**：所有可配置项通过一个不可变的配置对象传入，构造完成后冻结。不要让使用者猜"这个 SDK 运行时到底用了什么配置"。

### 为什么配置要集中且不可变

你在初始化时设了 `timeout = 30`，结果某个后台线程把超时改成了 `5`——所有请求开始大面积超时。你在日志里找了两个小时，最后发现是一个配置文件热加载器动了全局静态变量。

**可变配置 = 可调试性灾难。** 多线程环境下，一个被意外修改的配置值会让 bug 变成幽灵——时而出现、时而消失、无法稳定复现。

### 怎么做

**Builder 模式 + 构造后冻结**：

```kotlin
// ✅ 配置对象：构造完成后不可变
class SdkConfig private constructor(
    val baseUrl: String,
    val connectTimeout: Long,
    val readTimeout: Long,
    val maxRetries: Int
) {
    class Builder {
        private var baseUrl: String = ""
        private var connectTimeout: Long = 30_000
        private var readTimeout: Long = 30_000
        private var maxRetries: Int = 3

        fun baseUrl(url: String) = apply { this.baseUrl = url }
        fun connectTimeout(ms: Long) = apply { this.connectTimeout = ms }
        fun readTimeout(ms: Long) = apply { this.readTimeout = ms }
        fun maxRetries(n: Int) = apply { this.maxRetries = n }

        fun build(): SdkConfig {
            require(baseUrl.isNotBlank()) { "baseUrl 不能为空" }
            require(connectTimeout > 0) { "connectTimeout 必须大于 0" }
            return SdkConfig(baseUrl, connectTimeout, readTimeout, maxRetries)
        }
    }
}

val config = SdkConfig.Builder()
    .baseUrl("https://api.example.com")
    .connectTimeout(10_000)
    .build()
// config.connectTimeout = 5000  // ❌ 编译错误：val 不能重新赋值
```

**提供合理默认值**：覆盖 80% 场景（连接超时 30 秒、重试 3 次），使用者只改自己关心的那几项。不需要看完整个配置文档才能写第一行代码。

### 反面例子

```kotlin
// ❌ 全局静态变量，谁都能改
object GlobalConfig {
    var timeout: Long = 30_000
}

// ❌ 允许构造后修改
class SdkClient(config: SdkConfig) {
    var config = config  // var！随时可以被改掉
}
```

> 💡 **配置的本质是"承诺"——你承诺使用者在 SDK 生命周期内配置不变。承诺一旦可被外部打破，信任就没了。**

## 六、 📋 日志可插拔：绝不强制绑定日志框架

> [!NOTE]
>
> **一句话定义**：SDK 通过日志门面输出，让使用者用自己的日志框架接管。不要在 SDK 里写死 `println` 或绑定特定日志实现。

### 为什么日志不能写死

使用者的项目用的是 SLF4J + Logback，你的 SDK 直接 `System.out.println`。结果：SDK 日志出现在控制台而非日志文件，运维看不到；无法按级别过滤；格式和项目统一格式不一致，ELK 解析不了。

**你写了 `println`，等于替他决定了"这个信息不重要，丢控制台就行"。**

### 怎么做

```kotlin
// ✅ 使用 SLF4J 门面
import org.slf4j.LoggerFactory

class SdkClient(private val config: SdkConfig) {
    private val logger = LoggerFactory.getLogger(SdkClient::class.java)

    fun sendRequest(data: ByteArray) {
        logger.debug("发送请求: {} bytes", data.size)
        // ...
        logger.info("请求完成: {} ms", elapsed)
    }
}
```

使用者自己决定日志去哪、什么级别、什么格式。SDK 的日志和他项目的日志融为一体。同时提供关闭日志的选项（如 `logLevel = OFF`）。

### 反面例子

```kotlin
// ❌ 直接 println——控制台污染，无法统一管理
fun fetchData(): Data {
    println("开始请求...")            // 格式无法统一
    val result = httpClient.get()
    println("请求完成: $result")      // 级别无法控制
    return result
}

// ❌ 硬编码依赖 Logback
import ch.qos.logback.classic.Logger  // 直接依赖实现，而非门面
```

> 💡 **SDK 是客人，客人不应该擅自决定客厅的装修风格。**

##  测试与质量保障

> [!NOTE]
>
> **一句话定义**：没有测试的 SDK 不是给使用者用的，是用来折磨使用者的。最低标准：单元测试覆盖率 ≥ 80%，CI 自动化。

### 为什么测试在 SDK 开发中是铁律

SDK 和普通业务代码不一样——你的一个 bug，会出现在所有使用者的项目中。业务代码的 bug 只影响一个功能，SDK 的 bug 影响一整个生态。

### 三层测试体系

```kotlin
// 1. 单元测试：覆盖率 ≥ 80%，重点覆盖边界条件
@Test
fun `解析空 byte 数组应返回空列表而非 null`() {
    val result = decoder.decode(byteArrayOf())
    assertEquals(emptyList<Signal>(), result)  // 空输入 → 空列表，不是 null
}

@Test
fun `因子为 0 时应抛出明确异常`() {
    val ex = assertThrows<ValidationException> {
        Signal(factor = 0.0, offset = 1.0)
    }
    assertTrue(ex.message!!.contains(“factor”))
}
```

```kotlin
// 2. 集成测试：SDK 内置 Mock Server
class MockServer(private val port: Int) {
    fun expectResponse(path: String, body: String, status: Int = 200) { /* ... */ }
    fun start() { /* ... */ }
    fun stop() { /* ... */ }
}

@Test
fun `使用内置 MockServer 测试完整请求链路`() {
    val mock = MockServer(8080).apply {
        expectResponse(“/api/v1/user”, “””{“name”:”张三”}”””)
        start()
    }
    val sdk = SdkClient(SdkConfig.Builder().baseUrl(“http://localhost:8080”).build())
    assertEquals(“张三”, sdk.getUser().name)
    mock.stop()
}
```

```yaml
# 3. CI 自动化：每次提交触发
# .github/workflows/test.yml
# - 单元测试
# - 静态代码扫描（detekt / ktlint）
# - 构建检查
# - 兼容性检查（用上一个版本的调用方代码跑一遍当前 SDK）
```

### 反面例子

- 给别人用的网络 SDK，没有任何 Mock 工具，要求使用者自己 mock 整个 HTTP 层
- 测了正常路径，没有测”传 null 会怎样””网络断了会怎样””并发调用会怎样”
- 依赖”本地能跑”来判断质量，没有 CI

> 💡 **你能想到的边界条件不去测试，使用者在生产环境就会替你测。**

## 八、 📖 良好的文档和示例

> [!NOTE]
>
> **一句话定义**：使用者的第一行代码是在 README 里复制的，不是自己写的。文档就是 SDK 的产品界面。

### 文档的最低构成

```
📁 sdk-project/
├── README.md          ← 安装步骤 + 30 秒快速开始
├── examples/           ← 完整可运行的示例代码，每次发布前必须编译通过
├── docs/
│   ├── api-reference/  ← 每个接口的参数、返回值、异常说明
│   └── migration/      ← 版本升级时的变更说明
└── CHANGELOG.md        ← 每个版本的改动记录
```

### 快速开始：30 秒原则

README 的开头必须有一段”复制 → 粘贴 → 运行”就能看到效果的最小代码：

```kotlin
// ✅ 30 秒能跑起来的最简示例
// 1. 添加依赖
implementation(“io.github.shilic:smart-dbc:1.0.0”)

// 2. 三行代码看到结果
val dbc = Dbc.read(File(“example.dbc”))
val speedSignals = dbc.messages.flatMap { it.signals }.filter { it.name.contains(“speed”) }
println(“找到 ${speedSignals.size} 个速度相关信号”)
```

不是”写一个示例让用户看完觉得牛逼”，而是”**用户复制完 30 秒内看到正确结果，然后觉得这个东西可以接着用。**”

### FAQ 和排错指南

README 里至少回答：依赖冲突了怎么办？超时时间怎么调？怎么在 Android 上使用？错误码在哪查？**每一个你回答过的 GitHub Issue，都应该成为 FAQ 里的一条。**

### 反面例子

- 只有一个空 README，写”请参考源码”
- README 上的示例是 1.0 的 API，实际已经 2.0——复制的第一行就编译不过
- `examples/` 目录里的代码从来没编译过

> 💡 **好的文档不教用户怎么”用”你的 SDK——而是帮他解决”用你的 SDK 时遇到的问题”。**

## 九、 🔄 持续交付与发布流程

> [!NOTE]
>
> **一句话定义**：发布不是最后一刻的事，是从第一行代码就开始的自动化流水线。

### 发布前的门禁

每次合并到主分支前，CI 必须跑过全部检查：

| 门禁 | 说明 |
|---|---|
| **单元测试 ≥ 80%** | 低于 80% 直接拒绝合并 |
| **静态代码扫描** | 依赖冲突检查、安全漏洞扫描、代码风格检查 |
| **兼容性测试** | 用上一个版本的调用方代码跑一遍当前 SDK——跑不通说明有不兼容改动 |
| **示例代码编译** | `examples/` 下的所有代码必须能编译并运行通过 |

### 版本号和 CHANGELOG

版本号在 CI 流水线中根据 commit 类型自动生成：`fix:` → 补丁+1，`feat:` → 次版本+1，`BREAKING CHANGE:` → 主版本+1。CHANGELOG 从 commit message 自动生成，**不允许”发布完了再补”。**

### 反面例子

- 手动发布，忘了改版本号，线上存在两个版本号一样的 jar
- 没有兼容性测试，靠”感觉”判断是否兼容——你的感觉在几百个使用者的生产环境面前一文不值
- 发布后才发现 `examples/` 里的代码已经跑不通了

> 💡 **发布的本质不是”让包出现在仓库里”，而是”让使用者拿到一个经过验证、拿过去就能用的制品”。**