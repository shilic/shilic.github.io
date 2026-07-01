# 第2节、`Kotlin` 数组、集合、泛型

### {} `Kotlin` 数组

##### （）创建空数组

```kotlin
    //emptyArray() 函数用于创建一个空的数组。它的类型是 Array<T>
    val emptyArray : Array<Int> = emptyArray<Int>()  //EmptyArray: []
    //arrayOfNulls() 函数用于创建一个指定大小并包含 null 值的数组。
    val nullArray : Array<Int?> = arrayOfNulls<Int>(5)  // 创建一个包含 5 个 null 的数组 //NullArray: [null, null, null, null, null]
    //你可以将一个 List 转换为数组。
    val list  = listOf(1, 2, 3, 4, 5)
    val arrayFromList = list.toTypedArray()

    /* 使用数组的构建函数，其他举例 */
    //IntArray 构造函数允许你指定数组的大小，并且可以提供一个初始化器 lambda 表达式来设置每个元素的初始值。
    // 如果你不提供初始化器，所有元素的初始值将默认为 0。 Array则类似
    // 使用 IntArray 构造函数
    val intArray0  : IntArray = IntArray(5)  // 创建一个包含 5 个 0 的数组 相当于 java中的 int[] intArray = new int[5]
    // 使用 IntArray 构造函数并提供初始化器
    val intArray1 : IntArray = IntArray(5) { 0 }  // 创建一个包含 5 个 0 的数组
    // 使用 Array 构造函数（不推荐用于基本类型）
    val array0 : Array<Int> = Array(5) { 0 }  // 创建一个包含 5 个 0 的数组，但这是 Int 类型的对象数组
    // 下边的代码报错， Array类型必须在后边接 lambda 表达式给数组元素赋初始值，而 IntArray(5) 则不需要接 lambda 表达式赋初始值，kotlin自动帮你赋值了
    // val array0_2 = Array(6)

    /* 字符串数组的举例 */
    //arrayOf() 函数允许你直接创建一个包含指定字符串元素的数组。
    val stringArray1 :Array<String> = arrayOf("Apple", "Banana", "Cherry")
    //Array() 构造函数允许你创建一个指定大小并初始化每个元素的数组。你可以提供一个 lambda 表达式来设置每个元素的初始值。
    val stringArray2 :Array<String> = Array(3) { index -> "Fruit $index" }  // 创建一个包含 "Fruit 0", "Fruit 1", "Fruit 2" 的数组
    val strArray :Array<String> = Array(3) { " 初始值 " }
	val nullArray2 :Array<String?> = Array(3) { null }
    //emptyArray<String>() 函数用于创建一个空的字符串数组。
    val emptyStringArray : Array<String> = emptyArray<String>()
    //arrayOfNulls<String>() 函数用于创建一个指定大小并包含 null 值的字符串数组。
    val nullStringArray :Array<String?> = arrayOfNulls<String>(5)  // 创建一个包含 5 个 null 的数组
```



##### （）创建带值数组



```kotlin
	//arrayOf() 函数允许你直接创建一个包含指定元素的数组。
    val array1 : Array<Int> = arrayOf(1, 2, 3, 4, 5)
    //Array() 构造函数允许你创建一个指定大小并初始化每个元素的数组。
    val array2 :Array<Int> = Array(5) { i -> i * 2 }  // 创建一个包含 0, 2, 4, 6, 8 的数组

    //Kotlin 还提供了针对基本类型的数组创建函数，如 intArrayOf()、doubleArrayOf() 等，这些函数可以避免装箱操作，提高性能。优先使用基本类型的数组
    //IntArray 但不是 Array的子类。IntArray这些对应java中的 int[] ,char[]等
    val intArray : IntArray= intArrayOf(1, 2, 3, 4, 5)
    val doubleArray: DoubleArray = doubleArrayOf(1.0, 2.0, 3.0, 4.0, 5.0)
```













##### （）`java`为什么不可以创建泛型数组？

一句话：为了保证类型安全。

在`java`底层，数组是保留了元素的数据类型的，同时确定了元素的个数，所以就可以在堆中得到一个确定的内存空间分配给数组对象（不懂的还是滚去复习`JVM`）。因为类型是确定的，故数组是支持协变的，你可以像下边一样写代码。

```java
Apple[] appleArray = new Apple[10];
Fruit[] fruitArray = appleArray; // 允许，因为数组在方法区中保留了元素的类型，故类型确定，不会出现类型安全问题，故可以协变。
fruitArray[0] = new Banana(0.5); // 编译通过，运行报错 ArrayStoreException
```

`kotlin`的数组支持泛型，但是不支持协变。同样也是为了保证类型安全。

```kotlin
val appleArray = arrayOfNulls<Apple>(3)
val anyList : Array<Any?> = appleArray // 不允许
```

##### （）Kotlin 中列表和数组有什么区别？

在 Kotlin 中，列表是一个有序集合，可以存储任何类型的元素，而数组是一个固定大小的集合，可以存储特定类型的元素。以下是主要区别：

- 大小：列表的大小可以动态增长或缩小，而数组的大小是在创建时确定的固定大小。
- 类型灵活性：列表可以使用泛型存储不同类型的元素，从而实现异构性。另一方面，数组是同构的，可以存储单一类型的元素。
- 修改：列表提供了添加、删除或修改元素的便捷方法。数组具有固定大小，因此添加或删除元素需要创建新数组或覆盖现有元素。
- 性能：数组通常为直接元素访问和修改提供更好的性能，因为它们使用连续的内存位置。列表是动态的，需要一定程度的调整大小和维护其内部结构的开销。





### {} `Kotlin` 集合

##### （）创建空集合

```kotlin
/* 你可以创建空集合，然后根据需要添加元素。*/
// 创建一个空的不可变 List
val emptyList : List<String> = emptyList<String>()
// 创建一个空的不可变 Set
val emptySet : Set<String> = emptySet<String>()
// 创建一个空的不可变 Map
val emptyMap : Map<String ,Int> = emptyMap<String, Int>()

// 创建一个空的可变集合
val emptyMutableList : MutableList<String> = mutableListOf()
// 创建一个空的 ArrayList
val emptyArrayList : ArrayList<String> = arrayListOf()
// 使用构造函数创建一个空的 ArrayList
val emptyArrayList2 : ArrayList<String> = ArrayList()
// 要创建一个空的可变 MutableMap，可以使用 mutableMapOf() 函数：
val emptyMutableMap: MutableMap<String, String> = mutableMapOf()
// 你也可以通过构造函数来创建一个空的 HashMap，它是 MutableMap 的一个具体实现：
val emptyHashMap: HashMap<String, String> = HashMap()
```



##### （）创建带值集合



##### （）为什么`kotlin`要设计不可变集合？

​    一句话：那就是为了保证类型安全。兼容`JAVA`。

​    前边的章节我们提到了`kotlin`推荐使用`val`来定义一个变量，但是如果是一个引用类型，那么它的地址不可变，但是集合元素依旧是可变的。这对于函数式编程来说，十分不安全，故又增加了不可变集合的概念，全面保证函数式编程的类型安全（输入输出的类型确定，这里不再赘述什么是副作用了，去复习第一章，里边有详细讲述副作用）。

​    这里不得不说`kotlin`设计的精妙之处，和`java`相比，`java`没有不可变集合，`kotlin`增加了之后，能够使后边的程序能够清晰、确定、容易的知道这个值是不可变的，让后边的代码执行起来更安全，。这相当于数学表达式中函数的值，所以说为什么说`kotlin`是函数式编程。

​    在 `Kotlin` 中，使用该函数创建一个不可变列表（只读列表）`listOf()`，一旦创建列表，其元素就无法修改。另一方面，可以通过使用特定函数添加、删除或修改其元素来修改可变列表。

​    例子：

```kotlin
val immutableList: List< Int > = listOf( 1 , 2 , 3 ) // 不可变列表
val mutableList: MutableList< Int > = mutableListOf( 4 , 5 , 6 ) // 可变列表

immutableList[ 0 ] = 10  // 错误：不可变列表无法修改

mutableList[ 0 ] = 10  // 可变列表可以修改
mutableList.add( 7 ) // 将一个元素添加到可变列表
mutableList.removeAt( 1 ) // 从可变列表中删除一个元素
```

​    在示例中，`immutableList`是一个不可变列表，尝试修改其元素会导致错误。然而，`mutableList`是一个可变列表，允许我们通过分配新值、添加元素或使用特定函数（如`add()`和 ）删除元素来修改其元素`removeAt()`。













### {} `Kotlin` 泛型

#### [] 泛型基础

`Kotlin` 泛型允许在 **编译时** 确保类型安全，避免运行时类型转换错误。

##### 一、泛型基础

###### 1. **泛型类与函数**

```kotlin
// 泛型类
class Box<T>(private val value: T) {
    fun getValue(): T = value
}

// 泛型函数
fun <T> printItem(item: T) {
    println(item)
}

// 使用
val intBox = Box(42)
val strBox = Box("Kotlin")
printItem(100) // 输出 100
```

###### 2. **类型约束（Type Bounds）**

通过 `where` 或 `:` 指定泛型类型的约束条件：

```kotlin
// T 必须同时实现 Comparable 和 Serializable
fun <T> sortAndSave(list: List<T>) where T : Comparable<T>, T : Serializable {
    list.sorted().forEach { /* 保存到文件 */ }
}
```

##### 二、协变（Covariance）与逆变（Contravariance）

###### 1. **型变（Variance）的概念**

- **不变（Invariant）**：泛型类型参数严格匹配，默认行为（如 `Box<T>`）。
- **协变（Covariant）**：允许子类替换父类（`Box<Child>` 视为 `Box<Parent>`）。
- **逆变（Contravariant）**：允许父类替换子类（`Box<Parent>` 视为 `Box<Child>`）。

###### 2. **Kotlin 的声明处型变**

通过 `out`（协变）和 `in`（逆变）修饰泛型参数。

a. **协变（`out`）**

- **用途**：泛型类型仅作为 **生产者**（返回 `T`），不能作为消费者（接收 `T`）。
- **示例**：只读集合接口

```kotlin
interface Producer<out T> {
    fun produce(): T // 允许返回 T
    // fun consume(item: T) ❌ 错误：协变类型 T 不能作为参数
}

// 使用
val stringProducer: Producer<String> = ...
val anyProducer: Producer<Any> = stringProducer // 协变安全
```

b. **逆变（`in`）**

- **用途**：泛型类型仅作为 **消费者**（接收 `T`），不能作为生产者（返回 `T`）。
- **示例**：只写集合接口

```kotlin
interface Consumer<in T> {
    fun consume(item: T) // 允许接收 T
    // fun produce(): T ❌ 错误：逆变类型 T 不能作为返回值
}

// 使用
val anyConsumer: Consumer<Any> = ...
val stringConsumer: Consumer<String> = anyConsumer // 逆变安全
```

##### 三、使用处型变（Type Projection）

在无法修改泛型类声明时，通过 **类型投影** 临时放宽型变规则。

###### 1. **协变投影（`out`）**

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) {
    for (i in from.indices) {
        to[i] = from[i] // 允许读取 from 的元素（协变）
    }
}

// 使用
val intArray: Array<Int> = arrayOf(1, 2, 3)
val anyArray = Array<Any>(3) { "" }
copy(intArray, anyArray) // 允许协变
```

###### 2. **逆变投影（`in`）**

```kotlin
fun fill(dest: Array<in String>, value: String) {
    dest[0] = value // 允许写入（逆变）
}

// 使用
val anyArray: Array<Any> = arrayOf("", 1, false)
fill(anyArray, "Kotlin") // 允许逆变
```

##### 四、星投影（Star Projection）

在类型参数未知时使用 `*`，表示 **存在某种类型**，但具体类型不关心。

```kotlin
fun printItems(list: List<*>) {
    for (item in list) {
        println(item)
    }
}
```

- **协变类型**（如 `Producer<*> ≈ Producer<out Any?>`）可安全读取。
- **逆变类型**（如 `Consumer<*> ≈ Consumer<in Nothing>`）无法调用消费方法。

##### 五、与 Java 泛型的对比

|    **特性**    |              **Kotlin**               |                  **Java**                  |
| :------------: | :-----------------------------------: | :----------------------------------------: |
|    型变控制    | 声明处型变（`out`/`in`） + 使用处型变 | 使用处型变（通配符 `? extends`/`? super`） |
|     通配符     |              星投影 `*`               |                    `?`                     |
|    类型擦除    |         存在（与 Java 相同）          |                    存在                    |
| 具体化类型参数 |     支持（`reified` + `inline`）      |                   不支持                   |

##### 六、实际应用场景

###### 1. **协变：只读集合**

Kotlin 标准库中的 `List<out T>` 是协变的：

```kotlin
val strings: List<String> = listOf("A", "B")
val anys: List<Any> = strings // 安全协变
```

###### 2. **逆变：比较器**

```kotlin
interface Comparator<in T> {
    fun compare(a: T, b: T): Int
}

// Comparator<Any> 可以比较 String（逆变）
val anyComparator = Comparator<Any> { a, b -> a.hashCode() - b.hashCode() }
val stringComparator: Comparator<String> = anyComparator
```

##### 七、总结

| **型变类型** | 关键字 |        适用场景        |   类型安全规则   |
| :----------: | :----: | :--------------------: | :--------------: |
|     协变     | `out`  | 生产者（返回泛型类型） |  子类可替代父类  |
|     逆变     |  `in`  | 消费者（接收泛型类型） |  父类可替代子类  |
|     不变     |   无   |      读写泛型类型      | 严格匹配类型参数 |

**设计原则**：

- **PECS**（Producer-Extends, Consumer-Super）：协变用于生产者，逆变用于消费者。
- **优先使用声明处型变**：减少使用处型变的模板代码。
- **避免滥用星投影**：明确泛型类型可提升代码可读性。

通过合理应用协变和逆变，可以构建更灵活且类型安全的泛型 API。