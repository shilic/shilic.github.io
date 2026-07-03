---
title: `Kotlin`的设计哲学之：四层访问修饰符与SDK边界控制
cover: /assets/kotlin-visibility-cover.png
icon: file
author: 诚
date: 2026-07-03
category:
  - Kotlin
  - 设计哲学
tag:
  - Kotlin
  - 访问修饰符
  - SDK开发
  - internal
  - public
  - private
sticky: false
star: false
footer:
copyright: CC BY-SA 4.0
---

# `Kotlin`的设计哲学之：四层访问修饰符与SDK边界控制

## 一、从前言说起

**SDK 设计的两个核心矛盾**

- 易用性 vs 封装性：用户想少写代码，但 SDK 必须隐藏实现细节。
- 扩展性 vs 稳定性：允许用户自定义行为，但不能破坏内部逻辑。

所以 SDK 开发本质上就一件事：**控制边界。** 暴露什么、隐藏什么、允许外部继承什么、允许模块间共享什么——这些决策决定了你的 SDK 是灵活还是脆弱，是易维护还是碰不得。

而 `Kotlin` 的四层访问修饰符——`public`、`internal`、`protected`、`private`——恰好是为这件事设计的。不是随便从 `Java` 搬过来的，而是根据 SDK 开发的真实需求重新设计了一遍。

下面从最基础的开始，每一层讲清楚：它是什么、它和 `Java` 有什么区别、它在 SDK 里用来干什么。

## 二、第一层：`public`——默认开放，不是拍脑袋定的

`Kotlin` 里，什么都不写就是 `public`：

```kotlin
// 这两行等价
class UserService {
    var a: Int = 0
}
public class UserService { 
    public int a = 0
}

// 函数也一样
fun calculate() { }
public fun calculate() { }
```

这个"默认 open"的选择，不是 `JetBrains` 的工程师坐在会议室里拍脑袋决定的。他们在设计 `Kotlin` 早期阶段，对大量的 `Java` 开源项目做了统计分析，发现 `public` 是使用频率最高的修饰符——绝大多数类和方法，本身的意图就是被外部调用的。如果默认是封闭的，开发者需要给每个 API 手动加一个修饰符，代码会变得非常啰嗦。

社区讨论中，社区成员也普遍倾向于"默认公共"——因为代码默认是写给外部看的，封装应该是主动选择而非被动接受。`JetBrains` 接受了这个建议，把 `public` 设为默认。

在 SDK 开发中，`public` 不是省事的义项。它是你需要有意识确认的承诺：**这个类、这个方法、这个属性，我确认它应该是公开 API 的一部分，我承担长期兼容的责任。**

## 三、第二层：`private`——隔离内部实现，降低心智负担

`private` 的语义简单：声明的东西只在本作用域可见。类里的 `private` 只在这个类里可见，文件顶层的 `private` 只在这个文件里可见。除此之外，没有人能看到，**包括子类也不行**。

`private` 适用于三类典型的内部细节：

1. **辅助函数**——对外暴露的 API 只是一个入口，内部拆成多个 `private` 函数各司其职
2. **可变状态**——`private var` 字段，外部不能直接改，只能通过你提供的公开方法操作
3. **不希望被覆写的实现细节**——`private` 的函数连子类都碰不到，不会被意外覆写

在 SDK 里，`private` 翻译成一句话：**"这个细节永远不会暴露给任何人，包括子类。"**

看一个网络请求 SDK 的例子：

```kotlin
class NetworkClient(private val config: Config) {
    // 可变状态——外部不可直接操作
    private var cache = mutableMapOf<String, Response>()

    // 对外暴露的唯一入口
    fun fetch(url: String): Response {
        evictExpiredEntries()         // 内部清理逻辑，外部不需要知道
        cache[url]?.let { return it }
        val response = performRequest(url)
        cache[url] = response
        return response
    }

    // 以下是纯内部实现——全部 private
    private fun evictExpiredEntries() {
        val now = System.currentTimeMillis()
        cache.entries.removeAll { (_, response) ->
            now - response.timestamp > config.cacheTimeout
        }
    }

    private fun performRequest(url: String): Response {
        // 实际的网络请求逻辑
    }
}
```

`evictExpiredEntries` 和 `performRequest` 是 `private` 的。意味着：

- 外部调用者看不到，不需要理解缓存是怎么清理的
- 子类无法覆写，你不会因为继承链上的一个意外覆写而调试到凌晨
- 你自己将来改这两个函数，不用担心影响任何调用方

**用 `private` 降低心智负担。** 读代码的时候，`private` 就是一块"不需要对外负责"的牌子——看到它，你就知道这个函数的改动不会波及外部。反过来，如果你在 SDK 里看到一个非 `private` 的函数，你的第一反应应该是"它有外部调用方，改之前要想清楚"。

`Kotlin` 的顶层 `private`（文件级）是另一个精髓用法：把和主函数相关的辅助函数分散写在同一个文件里，但外部完全不可见。不需要为了隐藏而强行塞进一个类，也不需要为了可见性而把包结构搞乱。**文件就是边界。**

## 四、第三层：`protected`——模板方法模式的基石

`protected` 的语义很窄：只在**本类和子类**中可见，外部任何人都不行。

看起来很简单，如果没有应用场景，我估计你想破头也不知道什么时候该用`protected`。 `protected` 有一个其他三个修饰符都做不到的精确用途：**模板方法模式** 。设计一个算法的骨架，将某些步骤留给子类实现，同时保证这些步骤**只有子类能调用，外部绕不过模板方法直接调**。

```kotlin
// 以上位机开发为例，我们定义一个CAN卡基类
abstract class CanDeviceBase {
    // 模板方法：启动一个CAN卡的流程
    fun launch(): _Result {
        if (isOpen()) { 
            return _Result._Success( $"CAN卡:{CanDeviceName}已经开启，请勿重复启动")
        }
        // 发起开启操作。(在发起开启操作前，必须手动设置CAN卡的几个关键参数)
        // 1. 预处理操作 (调用抽象方法，交给子类去实现)
        _Result preResult = preHandle()
        if (preResult !is _Result._Success) {
            return preResult;
        }
        // 2. 尝试打开设备; (同样调用抽象方法，交给子类去实现)
        _Result openResult = openDevice();
        if (openResult !is _Result._Success) {
            return openResult;
        }
        // 3. 打开成功, 尝试初始化设备 (设置波特率等步骤) (同样调用抽象方法，交给子类去实现)
        _Result iniResult = iniCan();
        if (iniResult !is _Result._Success) {
            return iniResult;
        }
        // 4. 尝试启动CAN
        return startCan();
    }

    // 抽象步骤——只让子类覆写，外部绝对不能直接调
    // 预处理阶段
    abstract fun preHandle() :_Result
    // 打开设备
    abstract fun openDevice(): _Result
    // 初始化CAN设备 (设置波特率等步骤)
    abstract fun  iniCan(): _Result
    // 启动CAN卡
    abstract fun  startCan(): _Result
}

class ZLGCan : CanDeviceBase() {
    override fun transform(data: Data): Data =
    data.copy(text = data.text.uppercase())
}
```

`transform` 为什么必须是 `protected`？

- **用 `public`**——外部可以直接调用 `transform()`，绕过 `read()` 和 `write()` 的校验逻辑，模板方法形同虚设。
- **用 `internal`**——跨模块的子类无法访问。SDK 往往是一个独立模块，使用方继承基类时如果 `transform` 是 `internal`，子类根本看不见它。
- **用 `private`**——子类无法覆写，模板方法模式直接不成立。

**三种修饰符都做不到，只有 `protected`。** 这就是它唯一且不可替代的用途。

另一个经典例子是 Android SDK 的 `Activity.onCreate()`——它是 `protected`，系统框架通过模板方法调用它，App 的 `Activity` 子类覆写它，但 App 里的其他类不应该、也不能直接调 `activity.onCreate()`。这就是 `protected` 的精确语义在真实世界的最佳实践。

总结：`protected` 不要滥用。它的最常见场景就是"模板方法模式中留给子类的扩展点"。如果你没有在用模板方法、没有在写可继承的基类，就不要碰 `protected`——它不该出现在业务代码的随便一个 `open fun` 上。

## 五、第四层：`internal`——Kotlin 送给 SDK 开发者最好的礼物

前三个 `Java` 都有（只是细节不同）。**`internal` 是 `Kotlin` 独有的。**

**5.1 它是什么**

`internal` 表示"同一个模块内可见"。模块是指一起编译的一组文件——在 `Gradle` 项目中，每个子工程就是一个模块，在 `Maven` 中同理。

```kotlin
// SDK 模块内部的工具类——外部消费者看不到
internal class InternalCache {
    fun store(key: String, value: Any) { ... }
    fun retrieve(key: String): Any? { ... }
}

// 对外暴露的 API
public class DataService {
    private val cache = InternalCache()  // 内部可以用
    fun getData(key: String): Data {
        cache.retrieve(key)?.let { return it as Data }
        // ...获取新数据
    }
}
```

编译为 JAR 后，`InternalCache` 对外部消费者是完全不可见的。**它在字节码层面仍然是 `public` 的**（JVM 没有 `internal` 这个概念），但 `Kotlin` 编译器会在编译期阻止模块外的代码访问它。

**5.2 它解决了什么**

`Java` 有一个很尴尬的问题：如果你想在一个 SDK 内部共享一些工具类，但不想对外部使用者暴露，你只有一个选择——把它们塞进同一个包，利用 `package-private`。但 `package-private` 有致命缺陷：

```java
// Java SDK —— 内部工具类
// 你必须把类放在同一个包下，并且不加任何修饰符（package-private）
class InternalHelper {  // 无 public，同一包内可见
    static void doInternalWork() { }
}

// 外部调用者只要在同一个包名下就能访问
// com.yoursdk.internal 包下的任何类都能用这个"隐藏"的工具
```

这意味着你的包结构被 `package-private` 绑架了——你想隐藏一个类，就必须把它放进特定的包，而不是按照功能来组织代码。

`internal` 打破了这种束缚，把可见性从"物理位置"（同一个包）提升为"逻辑组织"（同一个模块）。**代码的组织方式不再受限于访问控制的粒度。**

**5.3 实战：SDK 的经典三层结构**

```kotlin
// 项目结构：
//   sdk/src/main/kotlin/com/example/sdk/
//     |- api/         ← 对外暴露
//     |- internal/    ← 模块内共享
//     |- impl/        ← 纯粹实现细节

// --- api/DataService.kt ---
public class DataService {
    private val processor = InternalProcessor()
    public fun fetchData(): Data {
        return processor.process()
    }
}

// --- internal/InternalProcessor.kt ---
internal class InternalProcessor {
    fun process(): Data {
        val raw = RawFetcher.fetch()  // impl 层的类，同一个模块，可以访问
        return transform(raw)
    }
    private fun transform(raw: RawData): Data { ... }
}

// --- impl/RawFetcher.kt ---
internal object RawFetcher {
    fun fetch(): RawData { ... }
}
```

这个分层在 `Java` 中很难做到——如果你想让 `api` 层引用 `internal` 层的类，要么全部 `public`（外部也能看到），要么全部放进同一个包（代码组织混乱）。`Kotlin` 的 `internal` 让 SDK 的目录结构可以自由地反映架构意图，而不是被访问控制的限制拖着走。

**5.4 反编译后长什么样**

`internal` 编译到 JVM 字节码后，类和方法被标记为 `public`，但额外打了 `@kotlin.jvm.internal` 注解，并且方法名被 `$` 前缀修饰。`Kotlin` 编译器在编译期拦截模块外的访问，产生一个 `Cannot access 'xxx': it is internal in 'com.example.sdk'` 的编译错误。

如果你想在 `Java` 中调用 `Kotlin` 写的 `internal` 代码——可以，但得到的是 `$` 前缀的丑陋方法名。**这是一种隐形的警告：你在用不该用的东西。**

## 六、总结

回过头再看这四层修饰符，它们在 SDK 架构中划出了四条清晰的边界：

| 边界 | 修饰符 | SDK 中的含义 |
|------|--------|------------|
| 最外圈 | `public` | API 契约——我承诺长期支持。默认是社区统计的结果，不是拍脑袋 |
| 模块圈 | `internal` | 团队内部共享——外部不要碰。Kotlin 独有的礼物 |
| 继承圈 | `protected` | 模板方法的扩展点——只有子类能用。唯一的合法场景就是作为继承钩子 |
| 最里圈 | `private` | 实现细节——隔离内部，降低心智负担。改了不影响任何人 |

四条规则，一条铁律：**能用 `private` 就用 `private`，需要跨类共享时升为 `internal`，模板方法的扩展点才用 `protected`，只有真正对外承诺的 API 才设为 `public`。**

`Kotlin` 的设计师们在四层修饰符上的核心贡献不是多了 `internal` 关键字——而是把边界划清楚了。每一层的语义精确、互不重叠、责权分明。用对了这四把锁，你的 SDK 就是一座边界清晰的城市，而不是一栋门都找不着在哪的危楼。

这就是 `JetBrains` 的工程师最擅长的事：**不是发明新概念，而是把已经存在的痛苦翻译成语言特性。**02
