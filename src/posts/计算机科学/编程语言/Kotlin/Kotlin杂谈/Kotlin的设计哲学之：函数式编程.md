---
title: `Kotlin`的设计哲学之：函数式编程
cover: /assets/kotlin-fp-cover.png
icon: file
author: 诚
date: 2026-07-12
category:
  - Kotlin
  - 设计哲学
tag:
  - Kotlin
  - 函数式编程
  - Lambda
  - 高阶函数
  - 声明式
sticky: false
star: false
footer:
copyright: CC BY-SA 4.0
---

# `Kotlin`的设计哲学之：函数式编程

## 一、你真的理解函数式编程吗？

先问一个问题：你觉得函数式编程是什么？

函数可以独立于类存在？函数可以作为参数和返回值？Lambda 箭头语法糖？如果你这么想，那你写出来的代码该出 bug 还是出 bug，该难测试还是难测试。因为你只学了个皮。

真正的函数式编程，核心只有两条铁律：

1. **绝对的无副作用。** 一个函数，绝不修改外部变量。它的返回值只由参数决定，不依赖任何外部上下文。
2. **不可变性。** 数据一旦创建，永不修改。要改？创建新副本。`var` 和 `mutableListOf` 不是不能用——但它们是例外，不是默认。

《Kotlin 核心编程（DIVE INTO KOTLIN）》的作者团队有一句话，读到时直接醍醐灌顶：

> **如果说面向对象是归纳法，侧重于对事物特征的提取及概括；那么函数式中的组合实现更像是演绎法，近似于数学中的推导。**

这句话把 `OOP `和 FP `的`本质区别说透了。面向对象是自底向上的——你观察现实世界，抽象出类和接口，然后让对象之间互相协作。函数式是自顶向下的——你拿到输入，定义输出，然后把从输入到输出的变换过程拆成一系列纯函数的组合。前者是"提取共性"，后者是"推导结果"。

`Kotlin` 不是纯函数式语言——它不强迫你写 `Haskell `风格的代码。但如果你只把 `Lambda `当作"少写几行匿名内部类"的工具，那你从来没有真正理解函数式。

下面我会围绕四个核心展开：**函数即值、无副作用、表达式编程、声明式风格。** 每一个都不是孤立的概念——它们层层递进，最后汇聚成一件事：**用数学推导的方式写代码，而不是用操作步骤的方式写代码。**

## 二、无副作用的函数式 vs 有副作用的指令式

第一节讲了什么是函数式。这一节用代码接一个具体的例子，让概念落地。

```kotlin
// 纯函数 — 你给它参数，它给你结果，世界纹丝不动
fun add(a: Int, b: Int): Int = a + b

// 有副作用的函数 — 你猜它有什么问题？
var counter = 0
fun incrementAndGet(): Int {
    counter++
    return counter
}
```

`add` 是纯函数。同样的 `(1, 2)`，永远返回 `3`。不动任何外部的变量，你在任何时刻、任何线程调用它，结果都确定。

`incrementAndGet` 是典型的指令式写法。从签名上看，`incrementAndGet(): Int` 好像只是"返回一个整数"。但实际上它偷偷修改了外部的 `counter`，而且每次调用的返回值都不一样。你无法从函数签名推测它的行为，你必须在脑子里维护一个外部状态的模型——这就是 bug 的温床。

纯函数的好处不需要长篇论证：

- **测试不需要 mock。** 传参，看返回值。完事。
- **调试不需要还原现场。** 同样的输入永远是同样的输出，跑一次就定位了。
- **并发安全更简单。** 它不写共享状态，天然不存在竞态条件。

指令式代码不是不能写——现实中的程序必然有 IO、有状态变更、有副作用。问题是，指令式代码中的副作用往往是无意识的、不可追踪的。你声明一个 `var`，改一下，再改一下，十几次修改散落在几百行代码里——没人能理清这个变量的状态是怎么变的。

函数式编程不要求你消灭一切副作用（那是 `Haskell `的路线）。它要求的是：**让副作用变成有意识的、集中的、可追踪的。** 下面告诉你 `Kotlin `是怎么做到的。

## 三、`Kotlin` 为函数式编程做了什么

### 3.1 函数即值

`Java` 里函数是二等公民。你不能把方法直接赋给变量，不能把方法当参数传给另一个方法——你只能通过匿名内部类迂回实现。

```java
// Java — 传递一段行为，必须先包装成对象
button.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        System.out.println("clicked");
    }
});
```

这不仅仅是啰嗦的问题。深层的问题是：**当函数不能被自由传递时，行为就是死的。** 你只能在定义它的地方调用它，没法把它像一个值一样传来传去、组合拼装。

`Kotlin` 把这道锁拆了。函数和 `Int`、`String` 等价——可以赋值、可以传参、可以作为返回值：

```kotlin
// 赋值给变量
val onClick: (View) -> Unit = { println("clicked") }

// 作为参数 — 高阶函数
fun <T> List<T>.customFilter(predicate: (T) -> Boolean): List<T> {
    val result = mutableListOf<T>()
    for (item in this) if (predicate(item)) result.add(item)
    return result
}

// 作为返回值 — 函数生成函数
fun createMultiplier(factor: Int): (Int) -> Int = { x -> x * factor }
val triple = createMultiplier(3)
triple(5)  // 15
```

> **函数是值。** 这只是函数式编程的入场券。但入场券不等于你已经在会场里了——接下来才是真功夫。

### 3.2 `var` vs `val`：不可变是默认，可变是你主动选的

`Kotlin` 把"不可变性"刻在了变量声明的最底层。声明变量时，你必须立刻在 `var` 和 `val` 之间做选择：

```kotlin
val name = "张三"       // 不可变 — 一旦赋值，永远是这个值
var count = 0           // 可变 — 可以重新赋值，但你知道你在冒险
```

用 `val` 不需要理由，用 `var` 需要理由。这不是规范建议——如果你声明了 `var` 但从未对它重新赋值，IDEA 会直接给你一个黄色警告："`var` 从未被修改，可以改为 `val`。" IDEA 在替你的每一行代码做副作用审计：这个变量你真的改了它吗？没改过？那就应该是个 `val`。

### 3.3 属性必须显式初始化

局部变量必须初始化，这不是 `Kotlin` 的专利——`Java` 也要求局部变量使用前必须赋值。真正的分野在**属性**。

```java
// Java — 类的属性有隐式默认值，不需要你写
public class Demo {
    String name;          // 隐式初始化为 null
    int count;            // 隐式初始化为 0
    boolean active;       // 隐式初始化为 false
}
```

`Java` 对属性有一个"体贴"的设计：你不需要显式初始化——JVM 会替你填上默认值。引用类型给 `null`，数值类型给 `0`，布尔类型给 `false`。看起来省事，但省掉的不是一个赋值语句，省掉的是**你在声明属性的那一刻必须思考"这个属性的初始状态应该是什么"的机会。**

```kotlin
// Kotlin — 属性没有隐式默认值，你必须显式给
class Demo {
    var name: String = ""           // 你必须主动决定：初始值是空字符串
    var count: Int = 0               // 你必须主动决定：初始值是 0
    var active: Boolean = false      // 你必须主动决定：初始值是 false
    // var result: String            // ❌ 编译错误：属性必须初始化或被 abstract 修饰
}
```

`Kotlin` 取消了属性隐式默认值。你想声明一个属性？可以，但你必须回答一个问题：**它的初始值是什么？** 编译器不会替你做这个决定——`null`、`0`、`false`，哪个都不替你填。你给什么就是什么。

这和"无副作用"的关系是什么？`Java` 的隐式默认值本质上是一个隐式副作用——JVM 在你不知情的情况下，给属性塞了一个值。你写 `String name;` 的语义是"我还没想好它是什么"，但 JVM 替你翻译成了 `String name = null;`。从"不确定"到"null"，这中间发生了一次你不知情的状态变更。而 Kotlin 的做法是：**不确定就是不确定——没有默认值，编译器让你回去想清楚。** 这也是对前面小节 中 `val` / `var` 思想的延续：迫使你显式地、有意识地对每一个可变状态做出选择。

### 3.4 为什么 `Kotlin` 全面封杀 `for(;;)`

`Kotlin` 直接不允许写 C 风格的 `for(initialization; condition; increment)` 循环：

```java
// Java — C 风格 for 循环，i++ 是纯粹的副作用
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```
再来看看`kotlin`怎么做的：


```kotlin
// Kotlin — 这个语法根本不存在，编译不过
// for (i = 0; i < 10; i++)  // ❌ Kotlin 不允许

// 用这个来替代
for (i in 0 until 10) {
    println(i)
}
```

`JetBrains` 的设计师们把这个语法**直接删了**。不是因为 C 风格 `for` 不够简洁——是因为它整个设计核心就是一个副作用循环：声明一个可变计数器 `i` → 每次迭代 `i++` 修改它 → 用 `i < 10` 判断边界。一个循环语句，同时干了三件副作用的事：**声明可变状态、修改可变状态、依赖可变状态做判断。**

`Kotlin` 的 `for-in` 替代方案把这三件事全拆了：范围 `0 until 10` 是一个不可变的声明，`i` 在每次迭代中是 `val`，循环体内不能修改 `i`。**副作用从三个降到零个。**

这是最激进、最决绝的一次设计选择——别的语言都在给 `for(;;)` 打补丁（`const`、`let`），`Kotlin` 直接不给这个语法。你写不了，就永远不会用错。

不只是删了 `for(;;)` 语法——`Kotlin` 更推荐你使用 `for-in` 循环，每次迭代递给你的是一个 `val`：

```kotlin
// 没有索引，只有值。item 是 val，你改不了
for (item in list) {
    // item = "new value"  // ❌ 编译错误
    println(item)
}
```

即使用了 `withIndex()`，值依然是 `val`：

```kotlin
for ((index, value) in list.withIndex()) {
    // index = index + 1  // ❌ 同样编译不过
    println("$index -> $value")
}
```



### 3.5 函数参数是 `val`

在 `Java` 里你可以对参数重新赋值：

```java
// Java — 参数可以重新赋值，改了之后下面的逻辑全受影响
public void process(int value) {
    value = value * 2;  // 合法，但隐藏了你篡改了输入的事实
    // ...
}
```

`Kotlin` 直接堵死这条路：

```kotlin
// Kotlin — 所有函数参数默认都是 val，重新赋值直接编译报错
fun process(value: Int) {
    // value = value * 2  // ❌ 编译错误：val 不能被重新赋值
}
```



### 3.6 `val` / 不可变集合 / `copy()` 三件套

```kotlin
val list = listOf(1, 2, 3)                // 不可变集合 — 默认
val mutableList = mutableListOf(1, 2, 3)   // 可变集合 — 你主动选的

data class User(val name: String, val age: Int)
val user = User("张三", 25)
val older = user.copy(age = 26)             // 不修改原对象，生成新副本
```

从变量声明必须初始化，到 `for(;;)` 被连根拔起，到函数参数默认 `val`，到 `for-in` 不给索引，到集合和数据的默认不可变——`val` 不是某个局部特性，是 Kotlin 从语法层面到标准库层面统一的默认值。你在写代码的时候**默认就在做不修改的事**。不是不能改——用 `var` 和 `mutableListOf` 显式声明。关键是"改"变成了一种需要你主动做的选择，而不是一种你不小心就会发生的副作用。

> **消灭副作用不是目标——让副作用有意识、可追踪、躲不掉，才是。**

### 3.7 表达式编程——控制流必须产生值

`Java` 里你经常看到这种代码：

```java
String result;
if (score >= 60) {
    result = "pass";
} else {
    result = "fail";
}
```

声明一个空的 `result`，然后在 `if-else` 的两个分支里分别赋值。`result` 在声明时是未初始化的，在 `if` 之后才被赋值——从声明到有效值之间，有一个"裸奔"的窗口期。如果你忘了 `else` 分支，`result` 可能永远不被赋值，编译器也救不了你。

Kotlin 的答案：**一切控制流都是表达式，表达式必须有值。**

```kotlin
// if 是表达式 — 每个分支必须产生值
val result = if (score >= 60) "pass" else "fail"

// when 是表达式 — 缺少 else 编译器直接报错
val grade = when {
    score >= 90 -> "A"
    score >= 80 -> "B"
    score >= 60 -> "C"
    else -> "F"             // 少这一行，编译不过
}

// try 也是表达式
val content = try {
    File("data.txt").readText()
} catch (e: IOException) {
    //  
    ""
}
```

表达式编程的本质是什么？**消除"声明"和"赋值"之间的缝隙。** 变量从诞生的那一刻就被赋予了一个确定的值，不存在"先声明、再赋值、中间可能漏掉"的窗口。这是对"无副作用"原则的贯彻——一个值，要么有，要么没有，不存在一个"暂时还不好说"的中间态。

`when` 缺少分支直接编译不过——这不是编译器的苛刻，是编译器在替你把运行时才能发现的 bug 提前消灭掉。

### 3.8 声明式风格——说你想要什么，别说怎么做

前三步走到这里，声明式风格就是水到渠成的结果。

```kotlin
// 命令式：你要一个结果容器，要遍历，要判断，要往里塞
val result = mutableListOf<String>()
for (user in users) {
    if (user.age > 18) {
        result.add(user.name.uppercase())
    }
}

// 声明式：筛选成年用户 → 取出名字 → 转大写。完。
val result = users
    .filter { it.age > 18 }
    .map { it.name.uppercase() }
```

命令式的每一行都在告你怎么做。声明式的每一行都在告诉你它要什么。

这个区别不是审美偏好——是两种完全不同的思维方式。命令式里，读者需要在脑子里模拟循环体、追踪临时变量的状态变化。声明式里，读者只需要从左到右读过去：**筛选、映射、结束。** 不需要追踪状态，因为根本没有可变状态。

以 `smart-dbc` 为例。DBC 文件里有几十个报文、几百个信号，要找所有名字中带 "speed" 的信号：

```kotlin
val speedSignals = dbc.sortedMessages
    .flatMap { it.signals }
    .filter { it.name.contains("speed", ignoreCase = true) }
    .sortedByDescending { it.startBit }
```

你把"从所有报文里拿出所有信号 → 筛出名字含 speed 的 → 按起始位降序排列"用三行链式调用表达完了。不需要临时 List，不需要 `for` 嵌套，不需要 `if` 判断——你只描述了变换的逻辑，编译器去执行。

`map`、`filter`、`flatMap`、`reduce`、`fold`、`groupBy`、`sortedBy`、`take`——这些不是 API 列表，它们是**将数据从一个形态推导到另一个形态的运算符**。每一个操作符都是纯函数：输入集合 → 输出新集合或聚合值，中间不留下任何副作用。

### 3.9 函数组合：五个作用域函数，一张表讲清

`let`、`run`、`apply`、`also`、`with`——本质是把对象传给 Lambda，让后续操作可以链式表达。五个函数只分两个维度：

| | `this` 接收者 | `it` 参数 |
|------|------|------|
| **返回自身** | `apply` | `also` |
| **返回 Lambda 结果** | `run` / `with` | `let` |

```kotlin
// apply — 配置对象，返回对象本身
val user = User().apply { name = "张三"; age = 25 }

// let — 变换，常配合 ?. 做空安全链
val upper = user?.let { it.name.uppercase() }

// also — 副作用操作，不改变数据流
val result = users.filter { it.age > 18 }
    .also { println("共 ${it.size} 人") }
    .map { it.name }
```

它们存在的意义不是让你炫技——是让你在链式调用中处理"临时需要引用对象本身"的场景，而不需要打散链式结构、引入临时变量。**保持推导的连续性是它们的唯一使命。**

## 四、总结

回头想一下开篇那句话——面向对象是归纳法，函数式是演绎法。

用归纳法写代码，你先看到需求中的实体，提取共同特征，定义接口，然后让实现类去填充细节。用演绎法写代码，你拿到数据，定义输入输出，然后一步步推导出中间变换，最后组合成完整的计算链。

Kotlin 同时给了你这两套工具。但函数式那一套不是让你把 `for` 循环换成 `forEach` 就算完事了——**真正的函数式，是把每一个函数都当作数学推导中的一步，每一个步骤都确定、无副作用、可预测。**

四个核心的递进关系是这样的：

- **函数是值**让你能自由传递行为——这是基础设施
- **无副作用**让你信任每一个函数——这是安全保证
- **表达式编程**消除声明和赋值之间的缝隙——这是完整性保证
- **声明式风格**让你用推导代替操作——这才是终点

Kotlin 没有把范畴论塞进语法，没有让你先读完《Haskell 入门》才能写代码。它把 FP 里最有用的那部分提纯了出来，放在了 JVM 上，放在了 Java 开发者触手可及的地方。你可以从一行 `filter{}` 开始，慢慢理解"推导"比"操作"更接近程序的本质。
