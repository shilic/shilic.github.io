---
title: SDK 边界控制：从Kotlin四层访问修饰符说起
cover: /assets/kotlin-visibility-cover.png
icon: file
author: 诚
date: 2026-07-03
category:
  - Kotlin
  - SDK开发
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

# SDK 边界控制：从 `Kotlin` 四层访问修饰符说起

## 一、SDK 开发的本质是控制边界

写 SDK 有两件事是永远矛盾的：

- **易用性 vs 封装性**：用户想少写代码，但 SDK 必须隐藏实现细节。
- **扩展性 vs 稳定性**：允许用户自定义行为，但不能破坏内部逻辑。

翻译成一句话就是：**什么该暴露，什么该隐藏，什么该允许子类碰，什么该在模块内共享但对外封死。** 这四个问题的答案，决定了你的 SDK 是灵活还是脆弱，是能放手重构还是碰一下都怕。

`Kotlin` 的四层访问修饰符——`public`、`internal`、`protected`、`private`——恰好为这四个问题提供了各自的答案。下面从最基础的开始，每一层讲清楚它在 SDK 里用来干什么。

## 二、`public`——默认开放，不是拍脑袋定的

`Kotlin` 里，什么都不写就是 `public`：

```kotlin
// 这两行等价
class UserService {
    var a: Int = 0
}
public class UserService {
    var a: Int = 0
}

// 函数也一样
fun calculate() { }
public fun calculate() { }
```

这个"默认公共"的选择，不是 `JetBrains` 的工程师坐在会议室里拍脑袋决定的。他们在设计 `Kotlin` 早期阶段，对大量 `Java` 开源项目做了统计分析，发现 `public` 是使用频率最高的修饰符——绝大多数类和方法，本身的意图就是被外部调用的。如果默认是封闭的，开发者需要给每个 API 手动加修饰符，代码会非常啰嗦。社区讨论中，社区成员也普遍倾向于"默认公共"，`JetBrains` 接受了这个建议。

**最极致的证明：接口方法必须是 `public`。**

`Kotlin` 规定，接口（`interface`）中定义的成员，默认并且**必须**是 `public`——你不能把它们标记为 `private` 或 `protected`：

```kotlin
interface DataSource {
    fun load(id: Int): Data          // 默认 public，不能改成别的
    fun save(data: Data): Boolean     // 同上
    // private fun helper() { }       // ❌ 编译错误：接口成员不能 private
    // protected fun hook() { }       // ❌ 编译错误：接口成员不能 protected
}
```

这不是语言设计者的独裁——这是"接口"这个词本身的含义决定的。**接口就是一个面向外部的 API 契约。** 你定义 `interface DataSource` 时，你在说"任何地方拿到这个对象，都可以这样调用它"。接口的所有方法生来就是给外部用的——`public` 不是修饰符，是接口的默认身份。

推到极致：SDK 的核心是什么？接口。你暴露给使用者的每一个类、每一个方法，本质上都是在签一份 API 契约——"这个签名我会长期支持"。所以 `public` 不是省事的义项，而是你需要有意识确认的承诺：**我确定这个 API 应该公开，我承担长期兼容的责任。**

## 三、`private`——隔离内部实现，降低心智负担

`private` 的语义简单：声明的东西只在本作用域可见。类里的 `private` 只在这个类里可见，文件顶层的 `private` 只在这个文件里可见。除此之外，没有人能看到，**包括子类也不行**。

`private` 适用于三类典型的内部细节：

1. **辅助函数**——对外暴露的 API 只是一个入口，内部拆成多个 `private` 函数各司其职
2. **可变状态**——`private var` 字段，外部不能直接改，只能通过你提供的公开方法操作
3. **不希望被覆写的实现细节**——`private` 的函数连子类都碰不到，不会被意外覆写

在 SDK 里，`private` 翻译成一句话：**"这个细节永远不会暴露给任何人，包括子类。"**

不用凭空编一个网络请求的例子。直接看 `Kotlin` 标准库——你每天都在用的 `Regex`，背后就是一部 `private` 的教科书：

```kotlin
// kotlin/text/Regex.kt —— Kotlin stdlib 真实源码（简化）
public class Regex internal constructor(
    // 核心引擎 nativePattern —— private，外部完全看不到
    private val nativePattern: Pattern
) : Serializable {
    // 外部公共构造函数
    public actual constructor(pattern: String) : this(Pattern.compile(pattern))
    public actual constructor(pattern: String, option: RegexOption) : this(Pattern.compile(pattern, ensureUnicodeCase(option.value)))
    // ---- 以下是公开 API，外部只通过这些门进来 ----
    public fun find(input: CharSequence, startIndex: Int = 0): MatchResult? {
        // 使用私有变量来完成
        return nativePattern.matcher(input).findNext(startIndex, input)
    }
    public actual fun replace(input: CharSequence, replacement: String): String{
        return nativePattern.matcher(input).replaceAll(replacement)
    }
    // ---- 以下是纯内部实现，全部 private ----
    private fun MutableMatchResult.replaceGroups(
        replacement: CharSequence, input: CharSequence
    ) { /* 转义正则表达式特殊字符的内部逻辑 */ }
    private fun resolveGroupValues(
        matcher: Matcher, groupValues: MutableList<String?>
    ) { /* 解析捕获组的辅助逻辑 */ }
}
```

你写 `Regex("\\d+").findAll("123abc")` 的时候，完全不知道（也不需要知道）底层有个 `java.util.regex.Pattern`，有一堆 `replaceGroups`、`resolveGroupValues` 辅助函数。`JetBrains` 随时可以把内部实现从 `java.util.regex` 换成自己的正则引擎——只要 `findAll` 的签名不变，你的代码一行不用改。

这就是 `private` 的价值：

- **外部调用者看不到细节**——你不需要理解 `nativePattern` 和捕获组解析，只管用公开 API
- **子类无法覆写**——这些辅助函数连 `open` 的机会都没有，不会被继承链上的意外覆写搞乱
- **自己改起来没压力**——改 `resolveGroupValues` 的实现时，你知道它只有这一个类在用

**`private` 降低心智负担。** 读源码时看到 `private`，就等于看到一块"不需要对外负责"的牌子——这个函数的改动不会波及外部。反过来，看到一个非 `private` 的函数，第一反应应该是"它有外部调用方，改之前要想清楚"。

`Kotlin` 的顶层 `private` 还有一个编译层面的精妙之处。你在 `Calculator.kt` 文件里写的顶层函数，编译以后会被放进一个名为 `CalculatorKt` 的类中。普通顶层函数在 `CalculatorKt` 里是 `public static` 方法，外部可以直接引用。但 `private` 的顶层函数在 `CalculatorKt` 里也是 `private static` 的——连这个自动生成的类都不对外开放。**真正的"文件就是边界"——编译器在字节码层面帮你锁死了这道门。**

## 四、`protected`——模板方法模式的基石

`protected` 的语义很窄：只在**本类和子类**中可见，外部任何人都不行。

看起来很简单，如果没有应用场景，我估计你想破头也不知道什么时候该用`protected`。 `protected` 有一个其他三个修饰符都做不到的精确用途：**模板方法模式** 。设计一个算法的骨架，将某些步骤留给子类实现，同时保证这些步骤**只有子类能调用，外部绕不过模板方法直接调**。

```kotlin
// 以上位机开发为例，我们定义一个CAN卡基类
abstract class CanDeviceBase {
    private var isOpened = false  // 内部状态，外部不可见

    // 模板方法：启动一个CAN卡的完整流程 —— public，外部调这个入口
    fun launch(): Result {
        if (isOpened) {
            return Result.failure("CAN卡: $deviceName 已经开启，请勿重复启动")
        }
        // 1. 预处理操作 —— 交给子类实现
        preHandle().onFailure { return it }
        // 2. 尝试打开设备 —— 交给子类实现
        openDevice().onFailure { return it }
        // 3. 初始化CAN设备（设置波特率等）—— 交给子类实现
        initCan().onFailure { return it }
        // 4. 启动CAN —— 交给子类实现
        val result = startCan()
        if (result.isSuccess) { isOpened = true }
        return result
    }

    // 以下是模板方法的四个扩展点 —— 全部 protected abstract
    // 只有子类能覆写，外部不能直接调用某个步骤
    protected abstract fun preHandle(): Result
    protected abstract fun openDevice(): Result
    protected abstract fun initCan(): Result
    protected abstract fun startCan(): Result
}

// 周立功CAN卡的子类实现(伪代码)
class ZLGCan : CanDeviceBase() {
    override fun preHandle(): Result {
        // 周立功CAN卡的预处理：设置设备索引、通道号等
        return openDevice(deviceIndex = 0, channel = 0)
    }
    override fun openDevice(): Result {
        // 调用周立功SDK打开CAN设备
        val status = ZLGCAN.OpenDevice(deviceIndex, channel)
        return if (status == 0) Result.success()
               else Result.failure("周立功CAN打开失败, 错误码: $status")
    }
    override fun initCan(): Result {
        // 周立功CAN的初始化：配置波特率、滤波等
        val config = ZLGCAN.InitConfig().apply {
            baudRate = BaudRate.BAUD_500K
            workMode = WorkMode.NORMAL
        }
        val status = ZLGCAN.InitCAN(deviceIndex, channel, config)
        return if (status == 0) Result.success()
               else Result.failure("周立功CAN初始化失败, 错误码: $status")
    }
    override fun startCan(): Result {
        val status = ZLGCAN.StartCAN(deviceIndex, channel)
        return if (status == 0) Result.success()
               else Result.failure("周立功CAN启动失败, 错误码: $status")
    }
}

// 同星CAN卡(伪代码) —— 同一个模板，不同的实现
class TSMasterCan : CanDeviceBase() {
    override fun preHandle(): Result {
        // 同星的预处理：初始化TSMaster运行库环境
        return TSMasterSDK.initialize()
    }
    override fun openDevice(): Result {
        // 同星打开设备的方式和周立功完全不同
        return TSMasterSDK.connect(appName = "MyApp")
    }
    override fun initCan(): Result {
        // 同星通过 TSMaster 总线配置来设置波特率
        return TSMasterSDK.configureBus(channel = 0, baudRate = 500000)
    }
    override fun startCan(): Result {
        return TSMasterSDK.start(channel = 0)
    }
}
```

`preHandle`、`openDevice`、`initCan`、`startCan` 为什么必须是 `protected`？

- **用 `public`**——外部可以直接调用 `openDevice()`，跳过 `launch()` 中"检查是否已开启"的保护逻辑，模板方法形同虚设。
- **用 `internal`**——跨模块的子类无法访问。SDK 往往是一个独立模块，使用方继承基类时如果这些方法是 `internal`，子类根本看不见它们。
- **用 `private`**——子类无法覆写，模板方法模式直接不成立。

**三种修饰符都做不到，只有 `protected`。** 这就是它唯一且不可替代的用途。

> 另一个经典例子是 Android SDK 的 `Activity.onCreate()`——它是 `protected`，系统框架通过模板方法调用它，App 的 `Activity` 子类覆写它，但 App 里的其他类不应该、也不能直接调 `activity.onCreate()`。

**总结：`protected` 不要滥用。它的最常见场景就是"模板方法模式中留给子类的扩展点"。如果你没有在用模板方法、没有在写可继承的基类，就不要碰 `protected`——它不该出现在业务代码的随便一个 `open fun` 上。**

## 五、`internal`——`Kotlin` 送给 SDK 开发者最好的礼物

前三个 `Java` 都有（只是细节不同）。**`internal` 是 `Kotlin` 独有的。** 它表示"同一个模块内可见"——在 `Gradle` 项目中，每个子工程就是一个模块。

`internal` 到底解决了什么问题？不用凭空举例，直接看 `Kotlin` 标准库的源码。你每天都在用的 `emptyList()`，背后藏着一个教科书级的 `internal` 用法。

**5.1 从 `emptyList()` 看 internal**

```kotlin
// 你每天写的是这样的代码：
val list = emptyList<String>()
// list 的类型是 List<String>，它没有元素，行为正确，你从不关心内部是怎么实现的
```

现在翻开 Kotlin 标准库的源码，看看 `emptyList()` 到底返回了什么：

```kotlin
// kotlin/collections/Collections.kt —— Kotlin stdlib 真实源码（简化）

// 空列表的单例实现 —— internal，使用者永远看不到
internal object EmptyList : List<Nothing>, RandomAccess {
    override val size: Int get() = 0
    override fun get(index: Int): Nothing =
        throw IndexOutOfBoundsException("列表为空，索引 $index 越界")
    override fun isEmpty(): Boolean = true
    override fun iterator(): Iterator<Nothing> = EmptyIterator
    override fun contains(element: Nothing): Boolean = false
    // ... 所有方法都基于"空"来实现，高效且正确
}

// 空迭代器 —— 同样 internal
internal object EmptyIterator : ListIterator<Nothing> {
    override fun hasNext(): Boolean = false
    override fun hasPrevious(): Boolean = false
    override fun next(): Nothing = throw NoSuchElementException()
    override fun previous(): Nothing = throw NoSuchElementException()
    // ...
}

// 对外暴露的只是一个工厂函数 —— 返回类型是 List<T>，不是 EmptyList
public fun <T> emptyList(): List<T> = EmptyList
```

这个设计有三层精妙：

1. **封装实现细节。** 你拿到的是 `List<T>` 类型，你永远不知道底层是 `EmptyList` 这个 `object`。`JetBrains` 将来把 `EmptyList` 换成其他实现、甚至删掉重写，你一行代码都不用改。

2. **模块内共享，模块外隐藏。** 标准库内部有很多地方需要"空列表"——`listOf()` 传零个参数时返回 `EmptyList`，`emptySet()` 也可能复用 `EmptyIterator`。它们都在 `kotlin-stdlib` 同一个模块里，`internal` 让它们可以自由共享，同时外部完全看不到。

3. **如果它们是 `public` 的，会怎样？** 一定会有人写 `val list = EmptyList`。然后某天 stdlib 更新了 `EmptyList` 的签名，这些代码全部炸。但因为 `EmptyList` 是 `internal`，`JetBrains` 保住了修改内部实现的自由——这正是 SDK 开发者最需要的东西。

不止 `EmptyList`——翻翻 `Kotlin `标准库，`_Assertions`、`Unsafe` 工具类、`builders` 包、`AbstractMutableList` 的各种实现细节……大量 `internal`。整个 `kotlin-stdlib` 本身就是一堂用 `internal` 精确控制模块边界的教学课。

**5.2 `internal `的本质：用模块边界替代物理位置**

上面的例子已经说明了一切。再对比一下 `Java` 的困境：`Java` 想实现类似的效果，只能靠 `package-private`——所有内部类必须塞进同一个包。

```java
// Java 中，你必须这样组织包来模拟"模块内可见"
// com.yoursdk.internal 包下的任何类都能访问"隐藏"的工具
// 这也意味着包结构被访问控制绑架
```

`internal` 把可见性从"你放在哪个包"提升为"你和谁一起编译"。**代码组织不再受访问控制的限制——你可以按功能自由安排目录结构，编译器用模块边界来保证封装。**

**5.3 一条实用的 SDK 铁律**

如果你写了一个 `public` 的 API，你承诺长期兼容。如果一个 API 还没稳定、实现细节你还想随时改——**先用 `internal`。** 等接口稳定、经过验证、确实需要公开了，再提升为 `public`。

反过来也成立：如果一个 `internal` 类被外部使用者通过反射或 `$` 前缀方法调用了——那是使用者的责任，不是你的 breaking change。`internal` 给了你随意修改的底气。

## 六、总结

回到最初的问题：SDK 开发怎么控制边界？`Kotlin` 的四层修饰符给出了四个答案：

| 边界 | 修饰符 | SDK 中的含义 |
|------|--------|------------|
| 最外圈 | `public` | API 契约——我承诺长期支持，用户可直接使用。 |
| 模块圈 | `internal` | 团队内部共享——外部不要碰。 |
| 继承圈 | `protected` | 模板方法的扩展点——只有子类能用。唯一的合法场景就是作为继承钩子。 |
| 最里圈 | `private` | 实现细节——隔离内部，降低心智负担。改了不影响任何人。 |

当你面对一个新写的类或函数，不确定该用什么修饰符时，走一遍这个决策树：

```
这个元素是否必须由外部用户直接使用？
├── 是 → public（但要慎重：一旦发布，就是长期契约）
└── 否 → 它是否为子类预留的扩展点（模板方法模式）？
    ├── 是 → protected（只有且仅有这一种理由用它）
    └── 否 → 它是否需要被同一模块内的其他类共享？
        ├── 是 → internal（模块内公开，模块外隐藏）
        └── 否 → private（最小可见性，最大自由度）
```

决策树给出的是一个**从窄到宽的渐进式原则**：默认从 `private` 开始——能用 `private` 就用 `private`。当你确实需要跨类共享时，提升到 `internal`。当你明确在为继承设计扩展点时，用 `protected`。只有当你确定这个 API 要对外承诺长期兼容时，才设为 `public`。

SDK 的使用者不需要知道你的内部零件长什么样——他们只需要一个干净的入口和一份可靠的承诺。
