# 口 第3节、`Kotlin` 高阶特性

### 吕 `Kotlin`函数

####  品 函数和Lambda

#### 㗊 函数和Lambda代码示例

先来看以下代码

```kotlin
    /** 函数中可以有函数 */
    fun outFunction(){
        fun double(y:Int):Int{
            return y*2
        }
    }
    /** 普通的函数类型。 函数定义使用关键字 fun，参数格式为：参数 : 类型 */
    fun sum0(a: Int, b: Int): Int {   // Int 参数，返回值 Int // kotlin.Int，
        println("sum0 和是 ${(a+b)}" )
        return a + b
    }
    /** sum1 使用 Lambda 表达式来定义一个函数，也就是使用 fun 关键字和 = 来定义 。返回值类型自动推断 <br>
     * sum1 的返回值是一个 lambda 表达式 () → Int ，不是一个 Int 返回值。<br>
     * 使用 m.sum1(1,1).invoke() 来执行
     * */
    fun sum1(a: Int, b: Int) = { // () -> kotlin.Int，
        println("sum1 和是 ${(a+b)}" )
        //println("又做了一些操作")
        a + b
    }
    /** sum2 使用 Lambda 表达式来定义一个函数，也就是使用 fun 关键字和 = 来定义 。显式 定义返回值类型<br>
     * sum2的返回值是一个 lambda 表达式 () → Int ，不是一个 Int 返回值 <br>
     * 使用 m.sum2(1,1).invoke() 来执行
     * */
    fun sum2(a: Int, b: Int): () -> Int = { // () -> kotlin.Int，
        println("sum2 和是 ${(a+b)}" )
        a + b
    }
    /** 使用 run 函数，定义一个函数 ，返回值 kotlin.Int 。具体使用和普通函数 sum0 一致  */
    fun sum3(a: Int, b: Int) = run {
        println("run表达式 ，sum3 和是 ${(a+b)}" )
        a + b
    }
    /** 你也可以通过直接把参数定义到 lambda 中的方式实现。 <br> 返回值： (kotlin.Int, kotlin.Int) -> kotlin.Int 。<br>
     * 具体执行 由 invoke 去执行 。 m.sum4().invoke(2,2)  */
    fun sum4() : (Int, Int)-> Int = {
            a, b ->
        println("sum4 和是 ${(a+b)}" )
        a + b
    }
    /** sum5 的写法，虽然使用了等号，但是没有使用花括号，故用法和普通函数sum0一致，  */
    fun sum5(a: Int, b: Int) = a + b
    /**  sum6 写法和 sum4如出一辙 。返回值： (kotlin.Int, kotlin.Int) -> kotlin.Int。只不过把参数定义放里边了 */
    fun sum6() = {
            a:Int, b:Int ->
        println("sum4 和是 ${(a+b)}" )
        a + b
    }
    /*  sum4 的写法等价于 sumLambda1 的写法，返回值都是 (kotlin.Int, kotlin.Int) -> kotlin.Int  */
    /** 柯里化风格编程 */
    fun sum7(a:Int) = {
        b:Int -> {
            a + b
        }
    }

    /** 使用 lambda 表达式 定义一个 函数，使用 val 关键字 和  lambda 表达式 。<br>
     * 返回值 :(kotlin.Int, kotlin.Int) -> kotlin.Int <br>
     * 你可以直接运行，re7 = m.sumLambda1(1,6) ; 也可以通过 invoke 运行 m.sumLambda1.invoke(1,7) ;
     * */
    val sumLambda1: (Int, Int) -> Int = {
            x,y ->
        println("sumLambda(参数定义放外边) 和是 ${( x + y )}" )
        x+y
    }
    /** 和 sumLambda1 如出一辙。 */
    val sumLambda2 = {
            x:Int,y:Int ->
        println("sumLambda(参数定义放里边) 和是 ${( x + y )}" )
        x+y
    }
    /** 使用 lambda 表达式 定义一个 函数，使用 val 关键字 和  lambda 表达式 */
    val sumLambda3 : (Int, String) -> String  = {
            i: Int, str : String ->
        val re :String
        when(i){
            1 -> {
                re = "inter"
                re + str
            }
            0 -> {
                re = "motorola"
                re + str
            }
            else -> "未找到"
        }
    }



    fun reduce(a:Int ,b: Int) :Int {

        return a-b
    }



    /** 将函数作为一个参数 */
    fun useSum(a:Int , b:Int, sum : (Int,Int)->Int ) : Int {
        return sum.invoke(a,b)
    }

    /** 将函数作为一个返回值getOperation 是一个高阶函数，它接受一个 String 参数 operation，并返回一个函数类型 (Int, Int) -> Int。<br>
    在 getOperation 中，我们使用 when 表达式来根据 operation 的值返回不同的函数引用（::sum0 或 ::reduce）。 */
    fun getOperation(operation: String): (Int, Int) -> Int {
        return when (operation) {
            "sum" -> ::sum0
            "reduce" -> ::reduce
            else -> throw IllegalArgumentException("不支持的操作")
        }
    }
```

##### 𠾅 什么是`lambda` 表达式

​    `Kotlin` 中的 `lambda` 表达式是一种无需显式声明函数即可定义类函数构造的方法。它允许您创建可以作为**参数传递**或存储在变量中的代码块。 

```kotlin
// 1 . 使用花括号包裹整个函数体。
    val sumLambda1: (Int, Int) -> Int = { // 2. 可在外部使用 () -> 语法显示标注 `lambda` 表达式的返回值类型；标注参数类型。
        // 3. 使用箭头语法标注 “参数” 和 “语句” 。
            x,y -> // 4. 使用逗号分割参数
        println("sumLambda(参数定义放外边) 和是 ${( x + y )}" )
        x+y // 5. 最后一句是返回值
    }
    val sumLambda2 = {
            x:Int,y:Int ->  // 6. 也可在内部标注 ”参数“ 类型。
        println("sumLambda(参数定义放里边) 和是 ${( x + y )}" )
        x+y // 7. 如果声明了参数类型，并且返回值可以自动推导，那么可以省略返回值类型声明
    }
// 总的来说，使用 = { } 语句，像这样使用等号加花括号括起来的就是  `lambda` 表达式
```

​    总的来说，使用 `= { x,y -> 语句+返回值 }` 语句，像这样使用”等号“加”花括号“括起来的就是  `lambda` 表达式。

##### 𠾅 使用`fun`关键字还是`val`来定义`lambda` 表达式？

无论是使用`fun`关键字还是`val`都可以用来定义一个`lambda` 表达式，他们是类似的。

**与普通函数的区别**：`lambda` 表达式风格的函数返回值是一个函数类型，而普通函数的返回值类型是一个值。如`sum0`、`sum3`和`sum5`的返回值是一个`Int`，而其他方式的返回值都是一个表达式。

- `fun`在没有等号，只有花括号下是普通函数。
- `fun`有等号，没有花括号，是单表达式函数体，也是普通函数，返回值`Int`，可省略`return`。
- 无论`val`还是`fun`，只要是等号加花括号语法，就一定是`lambda` 表达式,`lambda` 参数在花括号内部声明。`fun`定义的函数则需要使用`invoke`运行

##### () `kotlin`中`lambda` 表达式的原理

######  1. **基于匿名类的编译策略**

由于 `Kotlin` 需兼容 `Java 6`（不支持 `invokedynamic`），`Lambda` 表达式在字节码层面会被编译为 **匿名内部类**，实现特定的 `FunctionN` 接口。

- **`FunctionN` 接口定义**：
  `Kotlin` 标准库预定义了 0-22 个参数的函数类型接口：

  ```kotlin
  // 示例：Function0（无参数）, Function1（1个参数）等
  public interface Function1<in P1, out R> : Function<R> {
      operator fun invoke(p1: P1): R
  }
  ```

- **`Lambda` 编译示例**：

  ```kotlin
  val sum = { a: Int, b: Int -> a + b }
  ```

  编译后的字节码等价于：

  ```java
  Function2<Integer, Integer, Integer> sum = new Function2<Integer, Integer, Integer>() {
      @Override
      public Integer invoke(Integer a, Integer b) {
          return a + b;
      }
  };
  ```

###### 2. **内存与性能问题**

- **匿名类生成**：每个 Lambda 表达式会生成一个新的匿名类，可能导致 **类加载数量增加**。

- 优化手段：

  - 未捕获变量：若 Lambda 未捕获外部变量，编译器生成 单例实例，避免重复创建。

    ```kotlin
    val printer = { println("Hello") }  // 单例对象
    ```

  - 捕获变量：若 Lambda 捕获外部变量，每次调用生成新实例（因需持有变量副本）：

    ```kotlin
    fun createAdder(x: Int): (Int) -> Int {
        return { y -> x + y }  // 捕获 x，每次返回新实例
    }
    ```

###### 3. **`inline` 内联函数优化**

`Kotlin` 通过 `inline` 关键字将 `Lambda` **内联到调用处**，避免匿名类开销：

```kotlin
inline fun measureTime(block: () -> Unit) {
    val start = System.currentTimeMillis()
    block()
    println("Time: ${System.currentTimeMillis() - start}ms")
}
// 调用处代码被替换为：
val start = System.currentTimeMillis()
println("Hello")  // block 的内容直接内联
println("Time: ${System.currentTimeMillis() - start}ms")
```

###### 4. `lambda` 表达式总结

可以说`lambda` 表达式是`kotlin`实现高阶函数的精华，`java`中存在大量的只有一个方法的接口（函数式接口），而设计模式中的单一职责原则也推荐大家让一个接口只有一个行为。故`kotlin`将原来`java`中的函数式接口，直接简化成了`lambda` 表达式，你也可以把他理解为**函数类型**，因为**函数类型**，背后也是使用`Function`类型实现的，也就是`lambda`表达式。而函数类型就是`kotlin`实现函数式编程编程的关键。




##### () `Kotlin`闭包是什么？

闭包是 **函数** 与其 **外部环境**（变量、上下文）的组合。即使外部函数执行完毕，闭包仍能访问和修改其捕获的变量。这与 `Java` 的 `final` 变量限制不同，`Kotlin` 允许闭包修改外部变量。[原文地址：掘金社区：Kotlin函数声明与闭包 作者：浅忆Any](https://juejin.cn/post/7126045250560196645)

###### 前言

本文介绍闭包。闭包其实不算是新东西了，`Kotlin` 就基本没有多少新东西，甚至可以说新型编程语言基本都没有新东西。是把先前编程语言好用的特性组装起来，再加一部分拓展。

###### 大纲

![Kotlin 函数声明与闭包.png](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/67e1d1164b954952ac69c11dbd8b5baf%7Etplv-k3u1fbpfcp-zoom-in-crop-mark%3A1512%3A0%3A0%3A0.awebp)

###### 1. 闭包介绍

首次接触 **闭包** 应该是在 `JavaScript` 上，有函数为“一等公民”特性的编程语言都有这个概念。 **函数是“一等公民”的意思是，函数跟变量一样，是某种类型的实例，可以被赋值，可以被引用**。函数还可以被调用。变量类型是某个声明的类，函数类型就是规定了入参个数，类型和返回值类型（不规定名字。函数名就和变量名一样，任意定义但要符合规则）。

如要声明 `Kotlin` 一个函数类型，入参是两个整数，出参是一个整数，那应该这样写： `val add: (Int, Int) -> Int`。箭头左边括号内表示入参，括号不可省略。箭头右边表示返回值。

`wiki`上闭包的概念是：**引用了自由变量的函数**，这个被引用的自由变量将和这个函数一同存在。从定义来说，对闭包的理解，是基于普通函数之上的。一般的函数，能处理的只有入参和全局变量，然后返回一个结果。闭包比普通函数功能更强，**可以获取当前上下文的局部变量**。当然了，捕获局部变量的前提是可以在局部环境里声明一个函数，这只有把函数当作“一等公民”才可以做到。**所有捕获外部变量的 Lambda 都是闭包，对象表达式（匿名内部类）也可形成闭包。**

###### 2. `kotlin`闭包与`java`匿名类比较

在 `Java` 中，匿名类其实就是代替闭包而存在的。不过 `Java` 严格要求所有函数都需要在类里面，所以巧妙的把“声明一个函数”这样的行为变成了“声明一个接口”或“重写一个方法”。匿名类也可以获取当前上下文的 `final` 局部变量。（**PS：不是也可以，是只能获取外部final类型的局部变量**）和闭包不一样的是，**匿名类 获取的final类型局部变量 无法修改**

匿名类能引用 `final` 局部变量，是因为在编译阶段，会把该局部变量作为匿名类的构造参数传入。

> Java8 `lambda` 是进一步接近闭包的特性，`lambda` 的 JVM 实现是类似函数指针的东西。 但 Java7 中的 `lambda` 语法糖兼容不算是真正的 `lambda`，只是简化了匿名类的书写。

###### 3. 闭包使用

来看一个闭包的例子：

```kotlin
fun returnFun(): () -> Int {
    var count = 0
    return { count++ } // 这里 { count++ } 就是一个闭包
}

fun main() {
    val function = returnFun()
    val function2 = returnFun()
    println(function()) // 0
    println(function()) // 1
    println(function()) // 2
    
    println(function2()) // 0
    println(function2()) // 1
    println(function2()) // 2
}
// 其他示例

fun fun0() {
    var sum = 0
    listOf(1, 2, 3, 4).forEach { sum += it }
    println(sum) // 输出 10
    // Lambda 表达式捕获并修改了外部变量 `sum`，这在 Java 中会因变量非 `final` 而报错，但 `Kotlin` 允许。
}
fun fun1() {
    var message = "Hello"
    val printMessage = { println(message) }
    message = "Bye"
    printMessage() // 输出 "Bye"
    // 引用实时更新:闭包捕获的是变量引用，而非值的快照，因此外部修改会反映到闭包中。
}

```

分析上面的代码，`returnFun`返回了一个函数，这个函数没有入参，返回值是`Int`。可以用变量接收它，还可以调用它。`function`和`function2`分别是创建的两个函数实例。 

可以看到，每调用一次`function()`，`count`都会加一，说明`count` 被`function`持有了而且可以被修改。而`function2`和`function`的`count`是独立的，不是共享的。

而通过 `jadx` 反编译可以看到：

```java
public final class ClosureKt {
    @NotNull
    public static final Function0<Integer> returnFun() {
        IntRef intRef = new IntRef();
        intRef.element = 0;
        return (Function0) new 1<>(intRef);
    }

    public static final void main() {
        Function0 function = returnFun();
        Function0 function2 = returnFun();
        System.out.println(((Number) function.invoke()).intValue());
        System.out.println(((Number) function.invoke()).intValue());
        System.out.println(((Number) function2.invoke()).intValue());
        System.out.println(((Number) function2.invoke()).intValue());
    }
}
```

被闭包引用的 `int` 局部变量，会被封装成 `IntRef` 这个类。 `IntRef` 里面保存着 `int` 变量，原函数和闭包都可以通过 `intRef` 来读写 `int` 变量。`Kotlin` 正是通过这种办法使得局部变量可修改。除了 `IntRef`，还有 `LongRef`，`FloatRef` 等，如果是非基础类型，就统一用 `ObjectRef` 即可。`Ref` 家族源码：[Ref.java](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FJetBrains%2Fkotlin%2Fblob%2Fmaster%2Flibraries%2Fstdlib%2Fjvm%2Fruntime%2Fkotlin%2Fjvm%2Finternal%2FRef.java)

> 在 `Java` 中，如果想要匿名类来操作外部变量，一般做法是把这个变量放入一个 `final` 数组中。这和 `Kotlin` 的做法本质上是一样的，即通过持有该变量的引用来使得两个类可以修改同一个变量。

###### 4. 总结

根据上面示例分析，可以总结出：

- 闭包不算是新东西，是把函数作为“一等公民”的编程语言的特性；
- `java`匿名类是 `Java` 世界里的闭包，但有局限性，即**只能读 `final` 变量**，不能写任何变量(可以通过`final`包装数组修改变量)；
- `Kotlin` 的闭包可以获取上下文的局部变量，并可以修改它。实现办法是 `Kotlin` 编译器给引用的局部变量封装了一层引用。

在[掘金(juejin)](https://juejin.cn/user/3051900007626103)一起分享知识，Keep Learning!

作者：浅忆Any
链接：https://juejin.cn/post/7126045250560196645
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

#### [] `inline`内联函数

##### () `kotlin`内联函数的作用

内联函数通过 **将函数体代码直接插入调用处** 来优化高阶函数（接收 Lambda 参数的函数）的性能，主要解决两个问题：

1. **减少匿名类生成**：普通高阶函数的 Lambda 会生成 `Function` 对象，内联后消除额外内存开销。
2. **支持 `reified` 类型参数**：允许在泛型函数中访问具体化的类型信息（常规泛型因类型擦除无法实现）。

##### () `inline`内联函数原理

###### 1. **普通高阶函数的开销**

```kotlin
fun nonInlineFunc(block: () -> Unit) {
    block()
}

// 调用时编译为：
nonInlineFunc(object : Function0<Unit> {
    override fun invoke() { ... }
})
```

每次调用生成一个匿名类实例，频繁调用可能导致内存压力。

###### 2. **内联函数的编译优化**

使用 `inline` 关键字声明函数，编译器将函数体及 Lambda 参数代码直接复制到调用处：

```kotlin
inline fun inlineFunc(block: () -> Unit) {
    block()
}

// 调用处代码被替换为：
block() // 直接插入函数体，无对象创建
```

##### () `noinline`、`crossinline` 控制内联范围

###### 一、`noinline`：禁止内联 Lambda 参数

- **禁止内联**：标记某个 Lambda 参数 **不参与内联**，保持普通函数对象形式。
- **使用场景**：**当 Lambda 需要被传递给其他非内联函数、存储为变量或作为返回值时。**

```kotlin
inline fun processData(
    data: String,
    noinline onSuccess: (String) -> Unit, // 禁止内联
    onError: (Exception) -> Unit          // 默认内联
) {
    try {
        // 将 onSuccess 传递给其他函数（非内联调用）
        handleResult(data, onSuccess)
    } catch (e: Exception) {
        onError(e) // 内联优化
    }
}

fun handleResult(result: String, callback: (String) -> Unit) {
    callback(result)
}
```

- **与非局部返回的关系**：`noinline` 修饰的 Lambda **不支持非局部返回**，因为它未被内联，无法直接返回到外层函数。

###### 二、非局部返回（`Non-local Return`）

在内联函数的 `Lambda` 中直接使用 `return`，会 **直接返回到外层函数**：

```kotlin
inline fun execute(block: () -> Unit) {
    block()
}

fun main() {
    execute {
        println("Before return")
        return // 非局部返回，直接退出 main 函数
    }
    println("Never reached") // 不会执行
}
```



###### 三、`crossinline`：限制非局部返回

- **限制非局部返回**：确保 `Lambda` 参数不会在跨上下文（如嵌套 `Lambda` 或新线程）中使用 `return` 导致外层函数返回。
- **使用场景**：当 `Lambda` 会被 **延迟执行** 或 **跨作用域调用** 时（如异步回调）。

```kotlin
inline fun runAsync(crossinline block: () -> Unit) {
    // 在子线程执行 Lambda（跨上下文）
    thread {
        block() // 若允许非局部返回，会导致外层函数意外退出
    }
}

fun main() {
    runAsync {
        println("Task started")
        // return ❌ 编译错误：此处不允许非局部返回
    }
}
```

- **与非局部返回的关系**：`crossinline` 允许 Lambda 被内联，但 **禁止非局部返回**，只能在 Lambda 内部使用 `return@label` 显式返回。

###### 四、对比总结

|     **特性**     | `inline` 普通内联 `Lambda`             | `noinline` 非内联（普通`Lambda`）       | `crossinline`                         |      |
| :--------------: | :------------------------------------- | :-------------------------------------- | :------------------------------------ | :--- |
|   **内联优化**   | ✅ 内联                                 | ❌ 不内联，生成 `Function` 对象          | ✅ 内联                                |      |
|  **非局部返回**  | ✅ 允许，只有普通`inline`支持非局部返回 | ❌ 不支持                                | ❌ 禁止                                |      |
| **跨上下文调用** | ❌ 可能导致控制流混乱                   | ✅ 允许（作为参数传递）                  | ✅ 允许（但限制返回）                  |      |
|   **典型场景**   | 简单内联逻辑                           | **`Lambda` 需要存储或传递到非内联函数** | `Lambda` 在嵌套作用域或异步代码中执行 |      |



##### () reified修饰符有什么用？

Kotlin 中的“reified”修饰符与“inline”修饰符结合使用，**可以在运行时保留类型参数**。通常，由于类型擦除，通用类型信息在运行时不可用。

通过使用“reified”修饰符标记泛型类型参数，您可以在内联函数体内访问运行时的实际类型。这允许您对类型执行操作，例如检查其属性或调用其函数。

当处理需要基于泛型参数的运行时类型（例如反射或特定于类型的行为）执行操作的函数时，通常会使用“reified”修饰符。

```kotlin
inline fun <reified T> getTypeName(): String {
    return T::class.simpleName ?: "Unknown"
}

val typeName = getTypeName<Int>()
println(typeName) // 打印 "Int"
```

在示例中，“getTypeName”函数在泛型类型参数“T”上使用“reified”修饰符。在函数内部，我们可以使用`T::class`来访问`T`的运行时类对象。然后，我们使用“simpleName”属性来获取字符串形式的类型名称。

`reified` 修饰符是 Kotlin 中的一个强大功能，可以根据泛型参数的运行时类型实现更高级的操作。

##### () 内联函数存在的问题

- 无法内联的情况：
  - 函数参数被存储（如赋值给变量）。
  - 函数参数在非内联 Lambda 中使用。
- **代码膨胀风险**：大型函数或频繁调用的内联函数可能导致字节码体积增大。









#### [] 操作符重载

















#### [] `infix`中缀表达式





















#### [] `kotlin`扩展函数

##### () `kotlin`扩展函数（`Extension Function`）的定义

**扩展函数** 允许在不修改类定义的情况下，为已有类添加新方法。语法格式为：

```kotlin
fun 目标类.函数名(参数列表): 返回类型 {
    // 函数体
}
```

**示例**：为 `String` 添加统计单词数的扩展函数

```kotlin
fun String.countWords(): Int {
    return split("\\s+".toRegex()).size // 按空格分割并统计数量
}
// 使用
val text = "Hello Kotlin World"
println(text.countWords()) // 输出 3
```

**在 Kotlin 的扩展函数内部，确实隐式包含了一个 `this` 引用**，它指向 **调用该扩展函数的接收者对象**（即被扩展的类的实例）。但这个 `this` 的访问规则和普通成员函数中的 `this` 有所不同。

##### () `kotlin` 扩展函数的原理

- 扩展函数在编译后会转换为 **静态工具方法**，接收者对象作为第一个参数：

```java
// 对应 Java 代码
public final class StringUtilKt {
    public static int countWords(String $this$countWords) {
        return $this$countWords.split("\\s+").length;
    }
}
// 调用
String text = "Hello Kotlin World";
int count = StringUtilKt.countWords(text); // 在java中直接通过工具类调用，接收着作为第一个参数
```



- **编译时绑定**：扩展函数的调用在编译时根据接收者的 **声明类型** 确定，而非运行时实际类型。
- **无多态性**：若子类重写了扩展函数，父类引用调用时仍执行父类扩展函数。

##### () `kotlin`扩展函数的核心特性与限制

###### 1. **访问权限**

- **仅能访问 public 成员**：扩展函数不能访问目标类的 `private` 或 `protected` 成员。

  ```kotlin
  class MyClass(private val secret: Int)
  
  fun MyClass.exposeSecret(): Int {
      return secret // ❌ 编译错误：无法访问 private 成员
  }
  ```

###### 2. **与成员函数优先级**

- **成员优先 **：若扩展函数与类成员函数同名同参数，调用时优先选择成员函数。

  ```kotlin
  class Printer {
      fun print() { println("成员函数") }
  }
  
  fun Printer.print() { println("扩展函数") }
  
  Printer().print() // 输出 "成员函数"
  ```

###### 3. **可空接收者**

- **支持可空类型 **：可为可空类型定义扩展函数，函数体内需处理 null 情况。

  ```kotlin
  fun String?.safeLength(): Int {
      return this?.length ?: 0
  }
  
  val s: String? = null
  println(s.safeLength()) // 输出 0
  ```

###### 4. 扩展属性（`Extension Property`）

- 类似扩展函数，可为类添加属性（但无后端字段，必须自定义 `getter/setter`）：

```kotlin
val String.lastChar: Char
    get() = this.lastOrNull() ?: throw NoSuchElementException()

var StringBuilder.lastChar: Char
    get() = get(length - 1)
    set(value) = setCharAt(length - 1, value)

// 使用
val str = "Kotlin"
println(str.lastChar) // 输出 'n'

val sb = StringBuilder("Hello")
sb.lastChar = '!'
println(sb) // 输出 "Hell!"
```

- **扩展属性无法定义初始值**：因为扩展属性本质还是`java`中的静态方法，静态提供了`get()`和`set()`方法。我们并没有对原有的类做任何修改，所以不能有初始值。

```kotlin
var String.isDouble : Boolean = false // 编译错误，因为扩展函数实际上不在类中，无法对类做修改。
    get() = this.length() % 2 == 0 ? true : false 
```

###### 5. 静态解析特性

- **编译时绑定**：扩展函数的调用在编译时根据接收者的 **声明类型** 确定，而非运行时实际类型。
- **无多态性**：若子类重写了扩展函数，**父类引用调用**时仍执行父类扩展函数。

```kotlin
open class Animal
class Dog : Animal()

// 为 Animal 定义扩展函数
fun Animal.speak() = println("Animal sound")

// 为 Dog 定义扩展函数 子类重写了扩展函数
fun Dog.speak() = println("Bark")

fun main() {
    val animal: Animal = Dog() // 声明类型为 Animal，实际类型为 Dog（一个简单的多态）
    animal.speak() // 输出 "Animal sound" 
    // 扩展函数的调用在编译时根据接收者的 **声明类型** 确定，而非运行时实际类型。这里的声明类型是 Animal 
}
```

- **总结**：调用 `animal.speak()` 时，编译器根据 `animal` 的 **声明类型（`Animal`）** 选择扩展函数 `Animal.speak()`，而非实际类型 `Dog` 的扩展函数。扩展函数的绑定在编译时完成，与对象实际类型无关。

###### 6. **伴生对象内的扩展函数**

- **通过伴生对象调用**：将扩展函数定义在 `companion object` 中，使其可通过类名直接调用。

  ```kotlin
  class MathUtils {
      companion object {
          // 定义在伴生对象中的扩展函数
          fun Int.square(): Int = this * this
      }
  }
  
  fun main() {
      println(5.square()) // ❌ 错误：无法直接调用
      // 正确调用方式：
      with(MathUtils.Companion) {
          println(5.square()) // ✅ 输出 25
      }
  }
  ```

###### 7.扩展伴生对象/扩展静态方法

**扩展伴生对象** 允许通过扩展函数或扩展属性，为类的伴生对象添加新功能，而无需修改原始类的定义。假设有一个 `User` 类，其伴生对象负责创建用户实例。我们希望为伴生对象添加一个从 JSON 字符串解析用户的方法。

1. 定义原始类与伴生对象

```kotlin
class User(val name: String, val age: Int) {
    companion object {
        // 基础工厂方法
        fun createDefault() = User("Guest", 0)
    }
}
```

2. 扩展伴生对象

```kotlin
// 为 User 的伴生对象添加扩展函数
fun User.Companion.parseFromJson(json: String): User {
    // 假设解析逻辑（简化示例）
    val name = json.substringAfter("name:").substringBefore(",").trim()
    val age = json.substringAfter("age:").substringBefore("}").trim().toInt()
    return User(name, age)
}
```

3. 调用扩展函数

```kotlin
fun main() {
    // 通过伴生对象调用扩展函数
    val json = "{name: Alice, age: 30}"
    val user = User.parseFromJson(json)
    println("${user.name}, ${user.age}") // 输出 "Alice, 30"
}
```



##### () 扩展函数作用域

在 Kotlin 中，扩展函数通常定义在文件顶层，但也可以定义在类内部。当扩展函数定义在类中时，其行为和可见性会发生变化。

###### 1.类内部定义扩展函数的特点

- **仅在类内部或实例中可见**：类内部定义的扩展函数，默认属于该类的成员，需通过 ​**类的实例** 或 ​**伴生对象** 调用。

- **访问成员**：类内部的扩展函数可以访问所在类的 `this`（即类实例的属性和方法）。

  ```kotlin
  class Logger(private val tag: String) {
      // 扩展函数访问 Logger 的 tag 属性
      fun String.log() {
          println("[$tag] $this") // 访问外部类的 tag
      }
  
      fun debug(message: String) {
          message.log() // 调用扩展函数
      }
  }
  
  fun main() {
      val logger = Logger("App")
       // logger."Test".log() // ❌ 错误：无法直接通过实例调用，类内部定义的扩展函数无法在外部使用
      logger.debug("Start") // 输出 "[App] Start"
  }
  ```

- **同时持有**：扩展函数属于类的实例方法，调用时需要同时持有 ​**类实例** 和 ​**扩展接收者对象**。

  ```kotlin
  class Formatter {
      // 为 Int 定义扩展函数，依赖 Formatter 实例的配置
      fun Int.formatAsCurrency(): String {
          return "$$this" // 假设 Formatter 有其他配置逻辑
      }
  }
  
  fun main() {
      val formatter = Formatter()
      val amount = 100
      println(formatter.amount.formatAsCurrency()) // ❌ 错误语法 ： 无法通过 formatter 实例调用扩展函数
      println(formatter.formatAsCurrency(amount)) // ❌ 错误：接收者错误
      // 注意：Kotlin 不支持直接通过类实例调用成员扩展函数，需借助作用域函数,如`with`。
      with(formatter) {
      	println(100.formatAsCurrency()) // ✅ 正确：在作用域内隐式传递 Formatter 实例
  	}
  }
  ```

###### 2.适用场景

- **封装工具逻辑**：将特定于类的扩展函数限制在类内部，避免污染全局命名空间。
  ​**示例**：一个 `User` 类内部定义 `String` 的扩展函数用于校验用户名格式。

  ```kotlin
  class User {
      private fun String.isValidUsername(): Boolean = length >= 5
  
      fun create(username: String) {
          require(username.isValidUsername()) { "用户名无效" }
          // 创建用户逻辑
      }
  }
  ```

- **依赖类状态**：扩展函数需要访问类的属性或方法。
  ​**示例**：日志工具类根据配置级别决定是否记录消息。

  ```kotlin
  class Logger(private val level: LogLevel) {
      fun String.log(priority: LogLevel) {
          if (priority >= level) println(this)
      }
  }
  ```

###### 3. **注意事项**

- **调用方式复杂**：需通过作用域函数（如 `with`）或间接调用。
- **慎用成员扩展函数**：优先使用顶层扩展函数，除非明确需要访问类成员。
- **命名冲突**：类内部的扩展函数可能与顶层或其他类的扩展函数同名，需注意作用域优先级。

##### () 扩展函数的使用场景与最佳实践

###### 1. **增强第三方库**

为无法修改的类（如 Android SDK 或 Java 库）添加实用方法：

```kotlin
// 为 View 添加显示/隐藏的扩展函数
fun View.show() {
    visibility = View.VISIBLE
}
fun View.hide() {
    visibility = View.GONE
}
// 使用
myButton.show()
```

###### 2. **领域特定语言（DSL）**

通过扩展函数构建更直观的 API：

```kotlin
// 定义 HTML DSL
fun Tag.link(href: String, init: A.() -> Unit) {
    val a = A(href).apply(init)
    addChild(a)
}
// 使用
html {
    body {
        link("https://kotlinlang.org") {
            +"Visit Kotlin"
        }
    }
}
```

**PS**：`jetpack compose`语法就是通过`kotlin`扩展函数特性实现的。

###### 3. **工具函数集中管理**

将通用操作封装为扩展函数，提升代码复用：

```kotlin
// 集合扩展函数
fun <T> List<T>.swap(index1: Int, index2: Int): List<T> {
    val result = toMutableList()
    Collections.swap(result, index1, index2)
    return result
}

val list = listOf(1, 2, 3)
println(list.swap(0, 2)) // 输出 [3, 2, 1]
```

##### () 扩展函数 与 Java 互操作

###### 1. **Java 中调用扩展函数**

扩展函数在 Java 中表现为静态方法，需通过工具类调用：

java

复制

```java
// Kotlin 扩展函数
fun String.addExclamation() = "$this!"

// Java 调用
String text = "Hello";
String result = StringUtilKt.addExclamation(text); // Hello!
```

###### 2. **限制**

- **不可覆盖现有方法**：无法通过扩展函数覆盖已有成员方法。
- **作用域需显式导入**：使用扩展函数前需导入其所在包或类。



##### () 扩展函数的内存泄漏

在 `Kotlin` 中，使用扩展函数（`Extension Functions`）为 `Activity` 或其他 `Android` 组件添加功能时，若处理不当确实可能导致 **内存泄漏（`Memory Leak`）**。以下详细分析原因、典型场景及解决方案：

###### 一、内存泄漏的根本原因

当扩展函数内部 **隐式持有 `Activity` 的引用** 且未被及时释放时，会导致 `Activity` 无法被垃圾回收（GC），从而引发内存泄漏。常见于以下场景：

###### 二、典型泄漏场景与示例

1. **异步任务未取消**

**错误示例**：在扩展函数中启动协程或线程，未在 `Activity` 销毁时取消。

```kotlin
// 为 Activity 扩展一个显示 Toast 的函数
fun Activity.showDelayedToast(message: String, delayMillis: Long) {
    lifecycleScope.launch {
        delay(delayMillis)
        Toast.makeText(this@showDelayedToast, message, Toast.LENGTH_SHORT).show()
    }
}

// 在 Activity 中使用
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        showDelayedToast("Hello", 10_000) // 如果 Activity 在 10 秒内销毁，协程仍持有引用
    }
}
```

**问题**：若 `Activity` 在 `delay` 期间销毁，`lifecycleScope` 的协程会隐式持有 `Activity` 的引用，导致泄漏。



###### 三、解决方案与最佳实践

1. **使用生命周期感知组件**

通过 `lifecycleScope` 或 `viewModelScope` 自动取消协程：

```kotlin
// 正确示例：协程自动绑定 Activity 生命周期
fun Activity.showDelayedToast(message: String, delayMillis: Long) {
    lifecycleScope.launch {
        delay(delayMillis)
        if (isActive) { // 检查协程是否已取消
            Toast.makeText(this@showDelayedToast, message, Toast.LENGTH_SHORT).show()
        }
    }
}
```

2. **限制扩展函数的生命周期绑定**

将扩展函数与 `LifecycleOwner` 绑定：

```kotlin
// 定义生命周期感知的扩展函数
inline fun <T : LifecycleOwner> T.runWhenActive(crossinline block: T.() -> Unit) {
    lifecycle.addObserver(object : LifecycleEventObserver {
        override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
            if (event == Lifecycle.Event.ON_RESUME) {
                block()
                lifecycle.removeObserver(this) // 执行后自动解绑
            }
        }
    })
}

// 使用示例
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        runWhenActive { updateUI() } // 仅在活跃时执行
    }
}
```

**核心原则**：扩展函数中涉及 `Activity` 引用的操作，必须 **与生命周期绑定** 或 **使用弱引用**，避免隐式持有导致泄漏。



#### []  `Kotlin`高阶函数

##### () 高阶函数的定义（参数或返回值为函数）

在 `Kotlin` 中，高阶函数是可以接受其他函数作为参数或返回函数作为结果的函数。他们将函数视为一等公民，允许函数式编程范例。

```kotlin
// 接收函数作为参数,这里传入一个 类型为 (Int, Int) -> Int 的函数
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}
fun test1(){
    // 使用`lambda`传入一个函数
    // 这里使用了柯里化风格的表达式，如果函数最后一个参数是一个函数，则可以通过lambda的方式将花括号移出来。
	val result = calculate(5, 3) { a, b -> a + b } 
	println(result) // 输出: 8
    // 在示例中，该`calculate`函数是一个高阶函数，它采用两个`Int`参数和一个作为其第三个参数调用的函数`operation`。该`operation`参数是一个 lambda 表达式，它对输入参数（`a + b`在本例中）执行特定操作。然后，高阶函数使用`operation`提供的参数`5`和调用该函数`3`，产生值`8`。
}
// 返回函数的函数
fun getMultiplier(factor: Int): (Int) -> Int { // 这个函数的返回值类型是 (Int) -> Int 的一个函数
    return { num -> num * factor } // 返回一个乘法函数，乘法的乘数是参数
}
```



##### () 函数类型的声明方式

kotlin 用特殊语法声明函数类型：

```kotlin
(参数类型列表) -> 返回类型
```

```kotlin
// 使用括号包裹参数，多个参数用逗号隔开，箭头指向返回值，
val sum: (Int, Int) -> Int = { a, b -> a + b } 
// void 类型返回值使用 Unit 
val printMsg: () -> Unit = { println("Hello") }

// 声明一个返回函数的函数
// 显式声明一个函数类型的变量，接收 Int 返回 (Int) -> Int
val createMultiplier: (Int) -> (Int) -> Int = { factor ->
    // 显式声明返回的 lambda 类型 (Int) -> Int
    val multiplier: (Int) -> Int = { number ->
        number * factor
    }
    multiplier
}

fun main() {
    val double = createMultiplier(2)
    val triple = createMultiplier(3)

    println(double(5)) // 输出 10
    println(triple(5)) // 输出 15
}
```

##### () 函数参数传递方式

###### lambda 表达式

```kotlin
fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    return operation(a, b)
}
calculate(5, 3) { a, b -> a * b } // 最后一个 lambda 可移出括号外
```

###### 函数引用 (::)

```kotlin
fun add(a: Int, b: Int) = a + b
calculate(5, 3, ::add) // 传递已有函数的引用
```

##### () 标准库中的高阶函数（`let`、`with`等）

###### 1. `Kotlin` 标准库高阶函数对比表

|     函数     |     参数类型     |       返回值       | 作用域内对象引用方式 |         典型场景         | 示例                                                         | 是否扩展函数 |
| :----------: | :--------------: | :----------------: | :------------------: | :----------------------: | ------------------------------------------------------------ | :----------: |
|    `let`     |    `(T) -> R`    |   `R`表达式结果    |     `it`（显式）     |    非空处理、数据转换    | `val len = "Hi"?.let { it.length }` → `2`                    |      ✅       |
|    `with`    |  `T, T.() -> R`  |   `R`表达式结果    |    `this`（隐式）    |       多操作上下文       | `with(view) { visibility = View.GONE }`                      |      ❌       |
|    `run`     |   `T.() -> R`    |   `R`表达式结果    |    `this`（隐式）    |   作用域操作、对象配置   | `val len = "Hi".run { length }` → `2`                        |      ✅       |
|   `apply`    |  `T.() -> Unit`  |    `T`对象本身     |    `this`（隐式）    |        对象初始化        | `val person = Person().apply {name = "Alice" age = 25}`->对象本身 |      ✅       |
|    `also`    |  `(T) -> Unit`   |    `T`对象本身     |     `it`（显式）     | 附加操作（日志、副作用） | `val sb = "Hi".also { println(it) }` → 输出 "Hi"             |      ✅       |
|   `takeIf`   | `(T) -> Boolean` | `T?`对象本身或null |     `it`（显式）     |         条件过滤         | `val s = "Hi".takeIf { it.length > 1 }` → "Hi"               |      ✅       |
| `takeUnless` | `(T) -> Boolean` | `T?`对象本身或null |     `it`（显式）     |       反向条件过滤       | `val s = "Hi".takeUnless { it.isEmpty() }` → "Hi"            |      ✅       |

###### 2. 这些高阶函数的区别

**返回值差异**

- **`let`/`with`/`run`**：返回操作结果（如 `Int`、`String`）；`with`和`run`类似，内部都是`this`引用，不同的是`with`用了柯里化风格，但是`run`是扩展函数。
- **`apply`/`also`**：返回对象本身（如 `StringBuilder`、原字符串）；因为`apply`用于附加操作，使用`this`更方便；而`also`用于日志，在`println`中使用`it`更方便。
- **`takeIf`/`takeUnless`**：返回对象或 `null`。



###### 3.`kotlin`标准库高阶函数的示例代码

- `let`

```kotlin
val name: String? = "John"

name?.let {  // 仅当 name 不为 null 时才执行块
    val formattedName = it.capitalize()
    println("Formatted name: $formattedName")
}
```

- `with`

```kotlin
with(view) { 
    visibility = View.GONE 
}
```

- `run`

```kotlin
val len = "Hi".run { length }
```

- `apply`

```kotlin
class Person {
    var name: String = ""
    var age: Int = 0
}
val person = Person().apply { // 初始化操作
    name = "John"
}.apply { // 链式调用
    age = 25
}
```



- `also`

```kotlin
// event为自定义的一个类
val sb = event.also { // 打印日志
    println(it.message()) 
}.also{ // 链式调用
    println(it.error) 
} 

```

###### 4.`kotlin`标准库高阶函数的源码

这些函数均定义在 Kotlin 标准库的 **`Standard.kt`** 文件中，属于顶层函数或扩展函数。

```kotlin
// let
public inline fun <T, R> T.let(block: (T) -> R): R {
    return block(this)
}

// with
public inline fun <T, R> with(receiver: T, block: T.() -> R): R { // 柯里化风格调用
    return receiver.block()
}

// run
// run 扩展函数版本
public inline fun <T, R> T.run(block: T.() -> R): R {
    return block()
}
// run 非扩展函数版本（无接收者）
public inline fun <R> run(block: () -> R): R { // 同样可以柯里化调用，将外部的小括号改为花括号
    return block()
}

// apply
public inline fun <T> T.apply(block: T.() -> Unit): T {
    block()
    return this
}

// also
public inline fun <T> T.also(block: (T) -> Unit): T {
    block(this)
    return this
}

```







##### () 高阶函数的优势和使用场景

1. **代码简化**：用 lambda 替代匿名类

   ```kotlin
   // Java 风格回调
   button.setOnClickListener(object : View.OnClickListener {
       override fun onClick(v: View) {
           // ...
       }
   })
   // Kotlin 高阶函数写法
   button.setOnClickListener { /* ... */ }
   ```
   
2. **行为参数化**：动态改变函数逻辑

   ```kotlin
   fun processData(data: List<Int>, processor: (Int) -> Boolean) {
       data.filter(processor)
   }
   ```

3. **DSL 构建**：通过高阶函数创建领域特定语言,如`jetpack compose`使用`kotlin`高阶函数构建页面



##### () 注意事项

1. **性能影响**：每个 lambda 会生成匿名类对象（jvm 平台），频繁调用时可改用 `inline` 修饰符优化

   kotlin

   ```kotlin
   inline fun measureTime(block: () -> Unit) {
       val start = System.currentTimeMillis()
       block()
       println("耗时: ${System.currentTimeMillis() - start}ms")
   }
   ```

2. **可读性**：避免过度嵌套多层高阶函数

3. **类型安全**：注意函数类型的参数匹配

   kotlin

   ```kotlin
   // 错误示例：参数数量不匹配
   val func: (Int) -> Int = { a, b -> a + b } // 编译错误
   ```

##### () 与 java 的互操作

1. java 单抽象方法（SAM）接口自动转换：

   kotlin

   ```kotlin
   // Java 接口
   interface OnClickListener {
       void onClick(View v);
   }
   
   // Kotlin 使用
   view.setOnClickListener { /* 自动转换为 SAM */ }
   ```

2. 函数类型在 java 中表现为 `FunctionN` 接口（如 `Function1`, `Function2`）







### {} 空安全

##### () 可空类型的定义与语法

`Kotlin` 通过 **类型系统** 在编译期强制区分可空与非空类型，避免 `NullPointerException`（NPE）。

###### 1. **基本语法**

- **非空类型**：默认类型不允许 `null` 赋值。
- **可空类型**：在类型后添加 `?` 表示允许 `null`。

```kotlin
var nonNullable: String = "Hello" // 非空
nonNullable = null // ❌ 编译错误

var nullable: String? = "Kotlin" // 可空
nullable = null // ✅ 允许
```

###### 2. **设计哲学**

- **显式标记**：开发者必须明确标识可能为 `null` 的变量。
- **编译期检查**：编译器阻止可能引发 NPE 的代码通过。

##### () 空安全操作符与机制

`Kotlin` 提供多种操作符和语法，安全处理可空类型。

###### 1. **安全调用操作符（`Safe Call Operator`）`?.`**

在链式调用中避免 `NPE`

```kotlin
val length: Int? = nullable?.length // 若 nullable 为 null，返回 null
```

###### 2. **Elvis 操作符 `?:`**

提供默认值替代 `null`：

```kotlin
val name: String = nullable ?: "Unknown" // 若 nullable 为 null，使用 "Unknown"
```

###### 3. **非空断言操作符 `!!`**

强制解包可空类型（慎用）：

```kotlin
val length: Int = nullable!!.length // 若 nullable 为 null，抛出 NPE
```

###### 4. **安全转换 `as?`**

安全类型转换，失败返回 `null`：

```kotlin
val num: Int? = obj as? Int // 若 obj 不是 Int，返回 null
```

###### 5. **智能转换（Smart Cast）**

编译器自动推断非空状态：

```kotlin
fun printLength(str: String?) {
    if (str != null) {
        println(str.length) // 此处 str 被智能转换为非空类型
    }
}
```



##### () 进阶技巧与原理

###### 1. **可空类型的底层实现**

- **编译后代码**：可空类型会被编译为 `@Nullable` 注解标记的 Java 类型。
- **字节码差异**：非空类型在字节码中无特殊标记，但编译器会插入空检查。





















### {} `Kotlin`函数式编程

前边的章节或多或少的讲了`Kotlin`的函数式编程，这里会来一个总结，全面总结`Kotlin`的这一特性。

> [!NOTE]
>
> what：函数值编程是什么？how：如何设计的？why：以及为什么要这么设计？





函数式编程是一种强调使用纯函数、不变性和函数组合的编程范式。它将计算视为数学函数的评估，并避免可变状态和副作用。

在 Kotlin 中，函数式编程作为一等公民受到支持。它允许您利用高阶函数、lambda 表达式和不变性等功能，以声明性且简洁的方式编写代码。

Kotlin 中的函数式编程鼓励遵循以下原则：

1. 不可变数据：强调使用不可变数据结构，对象在创建后无法修改。这有助于编写更具可预测性的代码，并避免与可变状态相关的问题。
2. 纯函数：对于相同的输入产生相同的输出，而不修改任何外部状态或引起副作用的函数。纯函数更容易推理和测试，因为它们仅依赖于其输入参数。
3. 高阶函数：可以接受其他函数作为参数或返回函数作为结果的函数。高阶函数可以实现代码重用、抽象以及以更简洁的方式表达复杂行为的能力。

```kotlin
val numbers = listOf(1, 2, 3, 4, 5)

val evenNumbers = numbers.filter { it % 2 == 0 }
val doubledNumbers = evenNumbers.map { it * 2 }
val sum = doubledNumbers.reduce { acc, value -> acc + value }

println(sum) // 打印双倍偶数的总和：12
```

在该示例中，演示了函数式编程原理。我们使用“filter”、“map”和“reduce”等高阶函数来对数字列表进行操作。每个操作都对不可变数据执行并产生新结果，而不修改原始列表。

Kotlin 中的函数式编程提供了一种强大且富有表现力的方式来编写更易于阅读、测试和推理的代码。





























