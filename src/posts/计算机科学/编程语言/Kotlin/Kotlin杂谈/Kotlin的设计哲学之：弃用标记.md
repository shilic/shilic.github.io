---
title: `Kotlin`的设计哲学之：弃用标记
cover: /assets/kotlin-deprecated-cover.png
icon: file
author: 诚
date: 2026-07-01
category:
  - Kotlin
  - 设计哲学
tag:
  - Kotlin
  - 弃用标记
  - @Deprecated
  - API兼容
  - 代码演进
sticky: false
star: false
footer:
copyright: CC BY-SA 4.0
---

# `Kotlin`的设计哲学之：弃用标记

> `Jetbrains`的工程师们，是我见过最优雅，最具有工程师精神的一批工程师。

我先不说为什么，这句话先放在这里，我看谁要来反驳；别急，你接着往后看。

## 一、前言

不知道你们有没有接手过其他同事的屎山代码，整个项目只有一个类文件，代码行数多达一万多行，一堆全局变量，变量命名全靠猜，程序逻辑不清晰，`if - else`嵌套了18层，注释是一个没有的，注释掉的代码却多达几百行。

准备好你的小心脏，下边可以看一下：

**众多意义不明的全局变量们**：

![众多意义不明的全局变量们](./assets/image-20260701160115532.png)

**800行被注释的代码**：

![800行被注释的代码](./assets/image-20260701152103079.png)

**单文件一万行的项目：**

![单文件一万行的项目](./assets/image-20260701151004604.png)

我接手过这样的项目，所以我很清楚这里边的痛苦；我没有在原来的屎山之上继续增加，而是花了大概一周的时间详细看整个项目，了解了整个项目的功能和逻辑，给必要的地方加上注释；最后，我按照我的思路，把整个项目推翻重写了一遍。

我问同事这些被注释的代码是什么意思，是准备之后再来修改并重新启用吗，还是说可以删掉的无用代码。同事说，太久了，他也不知道什么意思，但是也不能删，因为有可能是有用的代码。

看吧，这就是写代码不规范造成的影响。

但是，前边的这么多缺陷，咱们今天不讲；本文只讲函数的弃用和注释，谈一谈代码规范的问题。

## 二、各类IDE如何处理这类问题

好，我们回到正题上边来，为什么说`Jetbrains`的设计师们，是我见过最优雅，最具有工程师精神的一批工程师。

先交代一个背景：`Kotlin` 这门语言本身就是 `JetBrains` 设计的。他们也是 `IntelliJ IDEA` 的创造者——所以你在 `Kotlin` 里看到的所有语言特性，和在 `IDEA` 里看到的 IDE 警告，全都出自同一批工程师之手。理解了这一点，你才能理解后面要讲的那些设计决策：他们既设计语言，又设计工具，所以他们能把语言和工具的配合做到天衣无缝。

使用`Visual Studio`写`C#`代码，写`C++`代码，如果你像上图那样，注释了大量的代码，IDE(集成开发环境)不会给你任何提示，只会给你一个绿绿的标，甚至还说"未找到相关问题"，如下图所示：

![VS提示未找到问题](./assets/image-20260701160856207.png)

使用`VSCODE`也是一样的，默认不会给你提示。

> 但是我感觉`VSCode`应该是有相关的代码风格检测的插件。

![VSCode同样提示未找到问题](./assets/image-20260701161306165.png)

我用过的这么多`IDE`中, 只有`Intellij IDEA`一家，会在代码被注释掉时，直接黄标警告你，如下图所示。

![IDEA提示被注释的代码](./assets/image-20260701145924631.png)

你说这群`Jetbrains`的工程师是不是事多？多大一点事，我就把代码注释掉了而已，还警告我。是啊，我一开始也不懂；可是随着我知识越来越丰富，更能写出高内聚低耦合的代码，更能写出易于修改和维护的代码时；我越来越明白代码的规范是多么重要，我终于理解了这群`Jetbrains`的工程师。

是的，他们用心良苦，为了防止你们写出不规范的代码，他们甚至想要手把手教你。**被注释掉的代码**，一开始没什么大不了；可是随着项目逐渐变大，人员流动，这一段代码是要准备之后再解封吗，还是可以直接删了，就变得不明确了。**被注释掉的代码**会给之后维护的工程师造成非常大的困扰，让项目变得难以维护。

那我们应该如何处理这类问题呢？这类临时需要被注释掉的代码，之后可能会在某一段时间又解封，我应该用什么方式去描述呢？有没有一种方法，可以准确的描述这个事情。有的，兄弟，有的有的，你要的都有。其实各类编程语言早就想到这个需求了，这个东西就叫**弃用标记**；各类编程语言实现的方式不同，有的语言直接在注释里语法高亮，有的用装饰器，有的用注解，有的用特性来表达这个函数被弃用了，下边我将来详细介绍这一用法。

## 三、使用弃用注解

**3.1 各语言弃用标记对比**

弃用标记不是 `Kotlin` 的专利。几乎所有主流语言都提供了这个机制，只是形态各不相同：

| 语言 | 语法形态 | 提示信息 | 替代方案 |
|------|---------|---------|---------|
| Java | `@Deprecated` 注解 | **可选** —— `@Deprecated` 可以什么都不填 | 无原生支持 |
| C# | `[Obsolete]` 特性 | **可选** —— `[Obsolete]` 无参也能用 | 无原生支持 |
| Python | `@deprecated` 装饰器（PEP 702 / `warnings` 模块） | **可选** | 无原生支持 |
| JavaScript / TypeScript | `/** @deprecated */` JSDoc 注释 | **可选** —— 纯注释，不写也不报错 | 无原生支持 |
| C++ | `[[deprecated]]` 特性（C++14） | **可选** —— `[[deprecated]]` 无参合法 | 无原生支持 |
| Rust | `#[deprecated]` 属性 | **可选** —— `#[deprecated]` 无参合法 | 有 `since` / `note` 字段，但均可选 |

看出规律了没有？家家都有，但**提示信息全是可选的**。这意味着什么？意味着任何一个偷懒的程序员，都可以写出这样的代码：

```java
// Java — 编译通过，一声不吭
@Deprecated
public void oldMethod() { }

// C# — 编译通过，什么提示都没有
[Obsolete]
public void OldMethod() { }

// C++ — 编译通过，没有任何说明
[[deprecated]]
void oldFunction();

// JavaScript / TypeScript — 编译通过，不写 JSDoc 也没人管
/** @deprecated */
function oldFunction() { }

```

调用者收到一个孤零零的弃用警告，但不知道**为什么被弃用**、**应该换成什么**。这和把代码注释掉留一句 `// 不要用` 没有本质区别——前一节的屎山，就是这样一铲一铲堆起来的。

**3.2 这就是 `JetBrains` 工程师的优雅**

来看看 `Kotlin` 的设计。它的 `@Deprecated` 注解定义：

```kotlin
// Kotlin 标准库中的实际定义
@Target(allowedTargets = [CLASS, FUNCTION, PROPERTY, ...])
public annotation class Deprecated(
    val message: String,                        // ← 注意：String，不是 String?
    val replaceWith: ReplaceWith = ReplaceWith(""),
    val level: DeprecationLevel = DeprecationLevel.WARNING
)
```

看到没？`message` 的类型是 **`String`**，不是 `String?`。这意味着你**必须**提供一段文字说明，不能留空，不能传 `null`。下面这样的代码，**直接编译不过**：

```kotlin
@Deprecated         // ❌ 编译错误：缺少必填参数 message
@Deprecated("")     // ❌ 编译警告：空字符串仍然不提供任何信息
@Deprecated("请使用 newFunction() 替代")  // ✅ 这才是正确做法
fun oldFunction() { }
```

对比太鲜明了：

| 语言 | 空参数 | 效果 |
|------|--------|------|
| Java | `@Deprecated` | ✅ 编译通过，没人知道原因 |
| C# | `[Obsolete]` | ✅ 编译通过，零信息 |
| C++ | `[[deprecated]]` | ✅ 编译通过，无任何说明 |
| **Kotlin** | `@Deprecated` | ❌ **编译失败，强迫你写原因** |

这不是语法糖，这是**设计哲学**。`JetBrains` 的工程师们直接在编译器层面堵死了这个漏洞——你想废弃一个函数？可以，但你**必须**告诉后来人为什么、换什么。他们宁可让你多敲一行 `message`，也不允许项目里出现一个"不知道为什么被弃用"的函数。

这就是工程师精神：**用编译器的强制力，把坏习惯从语法层面消灭掉。**

**3.3 ReplaceWith：不仅告诉你"别用"，还告诉你"用这个"**

`message` 是强制你解释为什么，而 `ReplaceWith` 更进一步——直接给出迁移方案：

```kotlin
@Deprecated(
    message = "此方法已废弃，请使用 calculateV2()",
    replaceWith = ReplaceWith("calculateV2(a, b)"),
    level = DeprecationLevel.WARNING
)
fun calculateV1(a: Int, b: Int): Int {
    return calculateV2(a, b)
}
```

调用者通过 `Alt + Enter` → `Replace with calculateV2(a, b)` **一键自动重构**，IDE 帮你改代码，不是给你丢一句话自己琢磨。

**3.4 DeprecationLevel：渐进式删除的工业级方案**

`JetBrains` 的工程师显然经历过大型项目的 API 演进——光有 `message` 和 `ReplaceWith` 还不够，你需要控制"废弃到什么程度"：

| 等级 | 编译效果 | 调用者感受 | 适用阶段 |
|------|---------|-----------|---------|
| `WARNING` | 黄色警告，编译通过 | "这个旧了，但你还能用" | 刚刚废弃，给缓冲期 |
| `ERROR` | 红色错误，编译失败 | "必须换，除非你显式 `@Suppress`" | 限期迁移 |
| `HIDDEN` | 对外部**完全不可见** | "这个东西不存在了" | 最终移除 |

实战中一个完整的弃用生命周期：

```kotlin
class ApiClient {
    // v2.0：警告期，提醒调用方有新版
    @Deprecated(
        message = "fetchUsers() 已废弃，请迁移至 suspend 版的 fetchUsersAsync()",
        replaceWith = ReplaceWith("fetchUsersAsync()"),
        level = DeprecationLevel.WARNING
    )
    fun fetchUsers(): List<User> { ... }

    // 新的方法
    suspend fun fetchUsersAsync(): List<User> { ... }
}
```

v2.5 升 `ERROR`，v3.0 升 `HIDDEN`。整个过程调用者被逐步引导，不会被突然破坏——够不够工业？

> 仔细想想：`message` 强非空 → 强制你给理由；`ReplaceWith` → 给出迁移路径；`DeprecationLevel` 三级 → 分阶段执行。三件套环环相扣，没有一个步骤是多余的。这就是 `JetBrains` 工程师的优雅——不是给你一个工具，而是给你一套**完整的、工业级的解决方案**。

---

## 四、使用 `TODO` 标记

弃用注解解决了"旧东西怎么删"。反过来——新功能还没写完，怎么标记？

**4.1 各语言的 TODO 支持情况**

大部分语言把"未完成的代码"这件事完全交给了注释来办——语言层面什么都不提供：

| 语言 | TODO 机制 | 类型 |
|------|----------|------|
| Java | `// TODO` 注释约定 | 纯注释，编译器完全不管 |
| C# | `// TODO` 注释约定 | 纯注释，VS 会在任务列表中收集 |
| Python | `# TODO` 注释约定 | 纯注释 |
| JavaScript | `// TODO` 注释约定 | 纯注释 |
| C / C++ | `// TODO` 注释约定 | 纯注释 |
| Rust | `todo!()` 宏 | **语言级**，运行时 panic，和 Kotlin 思路接近 |

绝大多数语言，`TODO` 只是一行对人类无效的注释——同事不会天天翻你的注释看。`Rust` 有 `todo!()` 宏，可用，但它是宏，不是语言内置的关键字级支持。`C#` 的 `Visual Studio` 会在任务列表中收集 `// TODO`，但离开了 VS 就没人看得见。

**4.2 Kotlin 的答案：TODO()**

`Kotlin` 是怎么做的？它直接把 `TODO` 做成了**标准库函数**，返回值类型是 `Nothing`：

```kotlin
fun calculateDiscount(price: Double): Double {
    TODO("根据用户等级计算折扣，待业务方确认规则")
}
```

它的实现只有一行：

```kotlin
public inline fun TODO(reason: String): Nothing =
    throw NotImplementedError("An operation is not implemented: $reason")
```

注意这个 `reason: String` ——又是**非空 `String`**，不是 `String?`。你必须写清楚为什么这里还没完成，不能丢一个空的 `TODO()` 就跑。

**4.3 优雅在哪**

用注释标记未完成代码，有两个致命的坑：

1. **编译期完全静默**：`// TODO` 和普通注释没有任何区别，编译器一视同仁地忽略
2. **运行时悄悄跳过**：你如果注释掉了一整段逻辑，代码路径直接消失——可能返回一个默认值、一个 `null`，鬼知道上线后会发生什么

`Kotlin` 的 `TODO()` 是反向思路：

| 做法 | 编译 | 运行时表现 |
|------|------|-----------|
| `// TODO` 注释掉 | ✅ 通过 | 静默跳过逻辑，返回值不确定 |
| `TODO("原因")` | ✅ 通过 | **直接崩溃**，栈回溯精确指向未完成的代码位置 |

崩溃不是 bug——崩溃是**你故意埋的保险丝**。它强迫你在上线前面对那段没写完的代码，而不是假装它已经完成了。你在开发环境忘了，`TODO()` 会在你第一次点到这里时用 `NotImplementedError` 把你喊回去。

反过来想想：一个不崩溃、悄悄返回默认值的半成品函数，和一个一调用就崩溃、带着明确错误信息和栈回溯的函数——**哪个更容易在代码审查中被发现？哪个更容易在生产环境漏过去？**

`JetBrains` 的工程师把"未完成"从注释提升到了语言特性。其他语言里 `TODO` 是一个团队规范，记不记、写不写全靠自觉；`Kotlin` 里，`TODO()` 是一个保证——编译通过，但运行就跑不掉的保证。

**4.4 // TODO 注释 + IDEA TODO 面板**

除了函数级的 `TODO()`，`Kotlin` 也兼容传统的 `// TODO` 注释。但 `JetBrains` 的工具链没有停留在"把注释高亮一下"——IDEA 有一个全局的 **TODO 工具窗口**（`View → Tool Windows → TODO`），所有 `// TODO`、`// FIXME` 自动被收入一张统一清单。

```
// TODO: 改用协程替换 Thread.sleep
// FIXME: 此处数据库连接的线程安全问题
// TODO(user): 确认国际化的语言列表，目前只有中英文
```

可以按关键词、文件范围、作者标签筛选。同事离职交接时，打开这个窗口，所有遗留问题一目了然——不需要翻遍文件去回忆"好像哪里没写完"。

**4.5 组合使用**

`@Deprecated` 和 `TODO()` 刚好互补，覆盖代码从生到死的全过程：

```kotlin
// 旧函数：告诉后来人这个要删了
@Deprecated(
    message = "v2.0 起废弃，请迁移至 processOrderV2()",
    replaceWith = ReplaceWith("processOrderV2(order)"),
    level = DeprecationLevel.WARNING
)
fun processOrder(order: Order) { ... }

// 新函数：未完成的步骤用 TODO() 占位
fun processOrderV2(order: Order) {
    // ...
    TODO("待对接支付接口后完成")
}
```

一个管"旧的怎么退场"，一个管"新的怎么占位"——都带强制的、非空的说明文字。

---

## 总结

回到开头那句话：`JetBrains` 的工程师们，是我见过最优雅、最具有工程师精神的一批工程师。

他们设计的弃用标记体系，从头到尾只在做一件事：**让代码的意图被准确表达，并且用编译器强制你做到**。

两个设计决策贯穿全文：

1. **`@Deprecated` 的 `message` 是强制的、非空的。** 其他语言让你随意——想写就写，不想写留空也行。`Kotlin` 直接堵死这个洞：你不写？编译不过。你必须给后来人一个交代。这和把代码注释掉留一句模糊的话相比，是"确定性"对"不确定性"的碾压。

2. **`TODO()` 是一个会崩溃的函数，不是一行注释。** 其他语言用 `// TODO` 注释来标记"未完成"，编译器不理它，运行时也默默跳过。`Kotlin` 把 TODO 做成了语言标准库的一等公民，返回值是 `Nothing`，原因参数必填非空。你不完成它？它就在运行时把你炸回去。

这就是我说的"工业级"。不是给你一个用不用都行的建议，而是用编译器和类型系统确保你**必须**这样做。

下次你想注释掉一段代码时，停一秒钟：旧的该废弃就用 `@Deprecated`（带上非空的理由），没写完的用 `TODO()`（带上非空的原因），而不是留下一地注释让后来人猜。

这就是工程精神：**不是写代码给别人看，而是设计语言本身来引导别人写出好代码。**
