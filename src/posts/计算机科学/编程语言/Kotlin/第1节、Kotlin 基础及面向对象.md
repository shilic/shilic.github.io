# 第1节、`Kotlin` 基础及面向对象





### {} `Kotlin` 与 `Java` 

#### [] `Kotlin` 与 `Java`区别

##### () **什么是`Kotlin`？**

`Kotlin` 是由 `JetBrains` 开发的一种现代编程语言。它是静态类型的并在 `Java` 虚拟机 (`JVM`) 上运行。 `Kotlin` 语言设计为可与 `Java` 互操作，因此您可以将 `Kotlin` 代码与 `Java` 代码无缝结合使用。除了 `Android` 应用程序开发之外，它还用于服务器端和 `Web` 开发。

但 `Kotlin` 的设计更加简洁和富有表现力，减少了不必要的代码。一项值得注意的功能是其内置的空安全性，有助于避免与空值相关的常见编程错误。 `Kotlin` 还引入了扩展函数和协程等现代语言功能，与 `Java` 相比，为开发人员提供了更大的灵活性和更高的生产力。

##### () **对比`java`,使用 `Kotlin` 的优点。**

|    **特性**     |          **`Kotlin`**           |                      **`Java`**                      |
| :-----------: | :-----------------------------: | :--------------------------------------------------: |
|   **语法简洁性**   | 更简洁,减少了样板代码（如类型推断、`data class`） |                     冗长（需要更多样板代码）                     |
|    **空安全**    |          原生支持（可空与非空类型）          |              需手动检查或依赖注解（如 `@Nullable`）               |
|   **函数式编程**   |      原生支持高阶函数、Lambda、扩展函数       |           需 `Java 8+`（`Lambda、Stream API`）           |
|    **协程**     |         原生支持协程（轻量级异步编程）         |            依赖线程、`CompletableFuture` 或第三方库            |
|   **扩展函数**    |         支持（无需继承即可扩展类功能）         |                         不支持                          |
|    **数据类**    |       单行定义（`data class`）        | 需手动实现 `equals()`、`hashCode()` `getter()`/`setter()`等 |
| **默认参数与命名参数** |               支持                |                         不支持                          |
|   **类型系统**    |         更严格的类型推断（如智能转换）         |                       显式类型声明为主                       |
|   **互操作性**    |       完全兼容 `Java`（可混合编程）        |                  不直接支持 `Kotlin` 特性                   |
| **`DSL` 构建**  |      更灵活（通过扩展函数和 `Lambda`）      |                       需复杂设计模式                        |

#### [] `kotlin`与`java`互操作

##### () `kotlin`操作`java`

通常情况下，一般的`java`类，`kotlin`都可以直接调用，而不需要做任何其他处理。以下是一些值得注意的地方。

###### 1.**平台类型（Platform Types）**：

`Java` 类型在 `Kotlin` 中会被视为 `T!`（如 `String!`），需显式处理可空性。如`T!` 表示`T` 或者 `T?` 。也就是说，平台类型的变量可以非空也可以可空，就是说怎么样都可以。

- `java`代码

```java
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
/** 一个普通的java类  */
public class JavaUser {
    /** 非空类型：不可能为 null 的值 */
    private final int id ;
    /** 非空类型：不可能为 null 的值。使用 @NotNull 注解，显示指定一个不为空的值 */
    @NotNull
    private final String name ;
    /** 平台类型：一个可能为 null 的值 */
    private String info ;
    /** 可空类型：显示指定有可能为 null 的值 */
    @Nullable
    private String nullValue = null;
    /** 没有设置 get 和set 的值 */
    private String value = null;
    private Boolean boolValue = false;

    public Boolean isBoolValue() {
        return boolValue;
    }
    public void setBoolValue(Boolean boolValue) {
        this.boolValue = boolValue;
    }
    public void setNullValue(@Nullable String nullValue) {
        this.nullValue = nullValue;
    }
    @Nullable
    public String getNullValue() {
        return nullValue;
    }
    public String getInfo() {
        return info;
    }
    public void setInfo(String info) {
        this.info = info;
    }
    public JavaUser(int id, @NotNull String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }
    @NotNull
    public String getName() {
        return name;
    }
}

```

- 以下是一个平台类型的示例：

```java
public class JavaUserDao {
    Map<Integer,JavaUser> userMap = new HashMap<>();
    public void addUser(JavaUser user) {
        userMap.put(user.getId(), user);
    }
    /** 平台类型，有可能返回一个空值，也有可能不为空 */
    public JavaUser findUserById(int id) {
        return userMap.get(id);
    }
}
```

- 在`kotlin`中使用平台类型

```kotlin
	// 0. 初始化数据
    val javaUser1 :JavaUser = JavaUser(123456,"蝴蝶")
    val javaUserDao : JavaUserDao = JavaUserDao()
    javaUserDao.addUser(javaUser1)

    // 以下函数有可能返回一个空值，导致空指针异常，因为使用了非空类型来接收，而java代码有可能没有查询到就返回一个空值
    val javaUser : JavaUser = javaUserDao.findUserById(123456) // 平台类型，有可能返回一个空值，也有可能不为空
    // 推荐使用可空类型来处理java的平台类型数据；显示声明可空
    val javaUser2 : JavaUser? = javaUserDao.findUserById(111)
    // 使用可空类型接收的数据，使用上和kotlin一样，需要加? 来引用对象的属性。
    val info1 : String? = javaUser2?.info

    // 1.平台类型的接收(普通java值)。平台类型，有可能为 null ，也有可能不为 null ，kotlin无法确定。以下几种方式都可以，编译器不会有任何报警 。
    // 使用非空类型接收 （不加默认值，还是有可能出现空） （不推荐，可能出现空指针异常）
    val javaUserInfo1 : String = javaUser.info
    // 使用可空类型接收，允许可空 （推荐）
    val javaUserInfo2 : String? = javaUser.info
    // 使用非空类型接收，使用默认值保证绝对非空 （推荐）
    val javaUserInfo3 : String = javaUser.info ?: "default_value"
```

###### 2.`java`非空类型

而对于`java`中那些非空类型的数据，类比`kotlin`中的非空类型，可以直接采用非空类型来接收。

- `java`代码

```java
public class JavaUser {
	/** 非空类型：不可能为 null 的值 */
    private final int id ;
    /** 非空类型：不可能为 null 的值。使用 @NotNull 注解，显示指定一个不为空的值 */
    @NotNull
    private final String name ;
    public JavaUser(int id, @NotNull String name) {
        this.id = id;
        this.name = name;
    }
    public int getId() {
        return id;
    }
    @NotNull
    public String getName() {
        return name;
    }
}
```

在`java`代码中，使用`@NotNull`注解非空，可以达到`kotlin`中的非空类型类似的效果。

- 在`kotlin`中使用

```kotlin
// 2.非空类型的接收，使用了 @NotNull 注解(模仿kotlin语法，强制指定变量非空)
    /** 一个 java 的非空类型，如果使用 T? 来接收，那么编译器会警告 */
    val javaUserId1 : Int? = javaUser.id
    /** 对于确认非空的java值，例如使用了 @NotNull 注解，推荐直接使用 非空类型 来接收 */
    val javaUserId2 : Int = javaUser.id
    /** 一个 java 的非空类型，如果使用 T? 来接收，那么编译器会警告 */
    val javaUserName1 : String? = javaUser.name
    /** 对于确认非空的java值，例如使用了 @NotNull 注解，推荐直接使用 非空类型 来接收 */
    val javaUserName2 : String = javaUser.name
```

###### 3.`java`可空类型

而对于那些，既不是平台类型，也不是强制非空的变量，需要使用可空注解标注。

- `java`代码

```java
/** 一个普通的java类  */
public class JavaUser {
/** 可空类型：显示指定有可能为 null 的值 */
    @Nullable
    private String nullValue = null;
    public void setNullValue(@Nullable String nullValue) {
        this.nullValue = nullValue;
    }
    @Nullable
    public String getNullValue() {
        return nullValue;
    }
}
```

- `kotlin`使用

```kotlin
// 3. 可空类型的接收，使用了 @Nullable 注解
    /** 可空类型的接收 ，显式声明可空 ，需要强制使用 T? 来接收 */
    val javaUserNullValue1 : String? = javaUser.nullValue
    /** 可空类型的接收 ， 或者使用 ?: 语法，显式处理可空 */
    val javaUserNullValue2 : String = javaUser.nullValue ?: "default_value"
    /* 可空类型的接收 ， 如果使用了非空类型来接收，并且不显示处理可空性，则报错。下边代码报错 */
    // val javaUserNullValue3 : String = javaUser.nullValue
```

###### 4.`getter和setter`方法

遵循 `Java` 约定的 `getter` 与 `setter` 的方法（名称以 `get` 开头的无参数方法及以 `set` 开头的单参数方法）在 `Kotlin` 中表示为属性。  `Boolean` 访问器方法（其中 `getter` 的名称以 `is` 开头而 `setter` 的名称以 `set` 开头）会表示为与 `getter` 方法具有相同名称的属性。

- `java`代码

```java
public class JavaUser {
    /** 平台类型：一个可能为 null 的值 */
    private String info ;
    private Boolean boolValue = false;

    public Boolean isBoolValue() {
        return boolValue;
    }
    public void setBoolValue(Boolean boolValue) {
        this.boolValue = boolValue;
    }
    public String getInfo() {
        return info;
    }
    public void setInfo(String info) {
        this.info = info;
    }
}

```

- `kotlin`使用

```kotlin
  // 4.get和set 。 如果java代码正确定义了get和set，那么程序会自动识别
    val info3 = javaUser.info // get
    javaUser.info = "new" // set
    // 以下代码报错，没有设置 get和set
    // val value1 = javaUser.value
    val boolValue = javaUser.isBoolValue // get 
    javaUser.isBoolValue = true // set 方法
```

###### 5.关键字（`keywords`）重复

`kotlin`中有很多系统定义的关键字如 `fun is in objects、typeof、val、var、when、typeali as` 等。

这些关键字在`java`是可以被使用的，但是在`kotlin`却是不行的。

函数或者参数使用了这些关键字，那么`kotlin`在调用的时候会出现一些问题，比如`Java`中定义了一个方法名叫 `is` 的方法。那么在`Kotlin`中直接调用就会报错。

那么最简单的方法就是重命名`Java`方法，但如果调用的是[三方库](https://zhida.zhihu.com/search?content_id=109253758&content_type=Article&match_order=1&q=三方库&zhida_source=entity)的方法，就很难去重命名了。 所以我们另一种解决方式是在`Kotlin`调用`java`方法的时候加上 `` 反引号来使用。

- `java`代码

```java
 /** 一个普通的方法 ，但是方法名称使用了kotlin的关键字 */
    public void fun (String str){
        System.out.println("关键字重名 fun() 方法，使用引号将方法名称引用起来，打印一个string = "+str);
    }
```

- `kotlin`使用

```kotlin
// java方法使用了kotlin的关键字，使用引号将方法名称引用起来
    javaTool.`fun`("hello")
```

###### 6.`java`集合转`kotlin`集合

`kotlin`可以将`java`的集合视为传统的可变集合，也可以手动定义为不可变集合。

- `java`集合如下

```java
public List<JavaUser> getUsers(){
        List<JavaUser> users= new ArrayList<>();
        users.add(new JavaUser(123456,"苹果"));
        return users;
}
```

- `kotlin`使用的代码如下

```kotlin
// 6. 集合
    val ktList1 : List<JavaUser> = javaTool.users
    //ktList1.add() // 只读，没有add 方法
    val ktList2 = javaTool.users // 自动类型识别，识别成了 MutableList<JavaUser!> 类型
    ktList2.add(JavaUser(10,"梨子"))
```

###### 7.**`SAM`（单一抽象方法）接口**

**`Java` 函数式接口**：自动转换为 `Lambda`。

- `java`代码如下

```java
public interface OnClickListener {
    void onClick(View v);
}
```

- `kotlin`调用

```kotlin
class MyButton  {
    lateinit var event : OnClickListener

    fun setOnClickListener(event : OnClickListener){
        this.event = event
    }
    @Test
    fun test(){
        val button : MyButton = MyButton()
        // 单一抽象方法 直接转换成Lambda
        button.setOnClickListener{ 
                view -> println("Clicked")
        }
    }
}
```

###### 8.**异常处理**

 java的异常， 无论是受检查异常 还是 运行时异常，kotlin都不要求强制捕获

- `java`代码

```java
    public void exceptionFun() throws Exception {
        throw new Exception("抛出受检查异常");
    }

    public void runtimeExceptionFun()  {
        throw new RuntimeException("抛出运行时异常");
    }
```

- `kotlin`代码

```kotlin
 // 7. 异常
    // java的异常， 无论是受检查异常 还是 运行时异常，kotlin都不要求强制捕获
    javaTool.exceptionFun()
    javaTool.runtimeExceptionFun()

```

##### () `java`操作`kotlin`

###### 1.调用`kotlin`顶层函数。注解： `JvmName & JvmMultifileClass`

`java`中是没有顶层函数的，编译器会将当前的`kotlin`类文件编译成一个后缀为`Kt`的`java`工具类文件，或者你可以手动指定编译后的`JVM`类文件名称。

- **自动生成工具类**：顶层函数位于 `<文件名>Kt` 类。

`kotlin`代码

```kotlin
// File: StringUtils.kt
fun capitalize(str: String) = str.capitalize()
```

`java`使用

```java
String text = StringUtilsKt.capitalize("hello");
```

- **自定义`JVM`类名称：**

我们可以注解 `@file:JvmName(“文件名称”)`，来指定一个`kotlin`文件编译后的`java`类名称：

`Ext.kt`文件

```kotlin
@file:JvmName("ExtUtils")
package com.demo.javaAndKotlin

fun a(): String {
    ...
}

fun b(): String {
    ...
}
```

这里我们将名称命名为`ExtUtils`。此外，我们可能还有其他的顶层函数或者**扩展函数**。按照上面这种方式我们也可以指定一个其他的名称，但是如果我们也想使用`ExtUtils`这个名称的时候会报错：

```text
Duplicate JVM class name
```

此时我们需要在不同的文件中加入新的注解` @file:JvmMultifileClass` 。意思是将所有的文件合并到一个新的名称为`ExtUtils`文件中。

`ExtOther.kt`文件

```kotlin
@file:JvmMultifileClass
@file:JvmName("ExtUtils")
package com.demo.javaAndKotlin

fun c(str: Any): String {
   ...
}
```

我们在`Ext.kt`文件中也加入`@file:JvmMultifileClass`注解，我们就可以在`Java`文件中直接使用`ExtUtils`来调用 `a()，b()，c()`方法了。

###### 2.调用`data`数据类。 注解：`JvmField`

在 `kotlin`中我们使用的数据类即 `data class` 是不需要指定`getter`和`setter`的，可以直接通过字段名来访问它们。但是如果是在`Java`文件中调用`data class`依旧是需要使用`getter`和`setter`方法进行调用的。这里我们是可以修改他们的，那就是使用 `@JvmField` 注解，通过注解，可以直接将字段暴露出去进行访问。

```kotlin
data class Person(
    @JvmField var name: String,
    @JvmField var age: Int
)

//java中调用
Person person = new Person("",1);
person.name = "";
person.age = 10;
```

但是也有例外就是`lateinit`修饰的字段会自动暴露，无需指定`@JvmField`注解。还有`const`修饰的字段也是一样会自动暴露。

另外，如果我们想在`Java`中调用`setName`的时候修改这个属性名称不叫`setName`，这里我们需要使用`@set:JvmName` 注解。同理修改`getName`使用`@get:JvmName` 。需要注意的是，指定了`@set:JvmName`或者`@get:JvmName`注解后不需要在指定`@JvmField`了。

```kotlin
data class Person(
    @set:JvmName("changeName")
    var name: String,
    @JvmField var age: Int,
    @get:JvmName("likesPink")
    var likesPink: Boolean
){
    lateinit var address:String
}
```

###### 3.调用`companion `伴生对象。 注解：`JvmStatic`

- **默认访问**：通过 `Companion` 字段。

  `kotlin`

  ```kotlin
  class Logger {
      companion object {
          fun log(message: String) { ... }
      }
  }
  ```

  `java`

  ```java
  // Java 调用
  Logger.Companion.log("Hello");
  ```

- **优化为静态方法**：使用 `@JvmStatic`。

  `kotlin`:

  ```kotlin
  companion object {
      @JvmStatic fun log(message: String) { ... }
  }
  ```

  `java`:

  ```java
  Logger.log("Hello"); // 直接调用静态方法
  ```

###### 4.使用`kotlin`的默认参数重载。 注解：`JvmOverloads`

在`Kotlin`中我们可以给函数的参数设置默认值，即默认参数。但是这个功能在`Java`中是没有的。如果不做任何处理，那么在`Java`中调用函数的时候，就必须每个参数都要传入。那么我们设置的默认参数就没有任何意义了。

所以，`Kotlin`给我们提供了 `@JvmOverloads`注解，使用这个注解后，会让`Kotlin`编译器按照从左向右的顺序依次为每一个可选参数生成重载。

```kotlin
@JvmOverloads
fun Bitmap.resize(width: Int, height: Int = 200) {

}
// Java 调用（生成多个重载方法）
ExtUtils.resize(200);          // height=100
ExtUtils.resize(200, 300);    // height=300
```

这里我们在`Kotlin`中很容易就理解了`Bitmap.resize`方法的含义，但是`ExtUtils.resize`这样调用的时候，方法名不够明确。所以我们可以使用`@JvmName`注解来指定名称。

```kotlin
@JvmName("resizeBitmap")
@JvmOverloads
fun Bitmap.resize(width: Int, height: Int = 200) {

}
//java调用
ExtUtils.resizeBitmap(bitmap,100);
```

###### 5.调用`kotlin`非空类型。注解：`@NotNull`

**非空类型**：通过 `@NotNull` 注解标记。

`kotlin`

```kotlin
// Kotlin 代码
fun getNonNUllText(): String = "Hello"
```

`java`使用：

```java
// Java 调用（编译器警告）
@NotNull String text = SampleKt.getNonNUllText();
```



###### 6.调用扩展函数

**静态方法调用**：扩展函数编译为静态方法，接收者作为第一个参数。

`kotlin`:

```kotlin
// Kotlin 扩展函数
fun String.addExclamation() = "$this!"
```

`java`使用:

```java
// Java 调用
String text = ExtensionKt.addExclamation("Hello");
```

###### 7.**`kotlin`属性与字段**

**属性访问**：生成 getter/setter。

`kotlin`

```kotlin
class User(var name: String)
```

`java`使用：

```java
User user = new User();
user.setName("Alice");
String name = user.getName();
```

###### 8.`kotlin`不可变集合转`java`

在 `Kotlin` 中，`List`、`Set`、`Map` 等不可变集合会被编译为 `Java`的 `java.util.List`、`java.util.Set` 等接口，但其底层实现可能是 **只读包装类**（如 `Collections.unmodifiableList`）。`Java` 调用时需注意：`kotlin`中存在不可变集合

 **`Java` 操作不可变集合的陷阱**

- 尝试修改不可变集合会抛出异常：

  `kotlin`

  ```kotlin
  // Kotlin 代码：返回不可变集合
  fun getImmutableList(): List<String> = listOf("A", "B")
  ```

  `java`

  ```java
  // Java 调用（尝试修改）
  List<String> list = KotlinClass.getImmutableList();
  list.add("C"); // 抛出 UnsupportedOperationException
  ```

**解决方案**

- **转换为可变集合**：
  在 `Kotlin` 中提供显式方法返回可变集合：

  ```kotlin
  fun getMutableList(): MutableList<String> = mutableListOf("A", "B")
  ```

  `java`使用

  ```java
  List<String> list = KotlinClass.getMutableList();
  list.add("C"); // 正常操作
  ```

- **通过 `Java` 工具类转换**：

  `java`

  ```java
  List<String> mutableList = new ArrayList<>(KotlinClass.getImmutableList());
  mutableList.add("C");
  ```

###### 9.`kotlin`内联函数在

**内联函数的特性**:`Kotlin` 的 `inline` 函数会在编译时展开到调用处，主要用于优化高阶函数性能。但 Java 调用时有特殊限制：

- **无法内联**：
  `Java` 无法直接使用 `Kotlin` 的内联优化，内联函数会被当作普通方法调用。

  `kotlin`

  ```kotlin
  inline fun logTime(block: () -> Unit) {
      val start = System.currentTimeMillis()
      block()
      println("Time: ${System.currentTimeMillis() - start}ms")
  }
  ```

  `java`

  ```java
  // Java 调用（无法内联）
  KotlinClass.logTime(() -> System.out.println("Hello")); 
  // 实际生成匿名内部类，性能无优化
  ```

  **避免在 `Java` 中调用内联函数**：内联函数设计初衷是优化 `Kotlin` 的高阶函数，`Java` 调用时无性能优势。

- **`reified` 类型参数无法使用**：
  `Java` 的泛型类型擦除会导致 `reified` 失效。

  `kotlin`

  ```kotlin
  inline fun <reified T> checkType(obj: Any) {
      if (obj is T) println("Match")
  }
  ```

  `java`

  ```java
  // Java 调用（无法传递具体类型）
  KotlinClass.checkType("Hello"); // 编译错误：需要显式传递类型参数
  ```

**`reified` 类型参数的限制**：`Java` 无法支持 `reified`，需避免在跨语言代码中使用。





### {} `Kotlin` 基本语法

##### () 基本数据类型

|  **类型**  | **位宽** |          **范围**          |        **示例**         |
| :------: | :----: | :----------------------: | :-------------------: |
|  `Byte`  |  8 位   |       `-128 ~ 127`       |  `val a: Byte = 100`  |
| `Short`  |  16 位  |     `-32768 ~ 32767`     | `val b: Short = 1000` |
|  `Int`   |  32 位  |      `-2³¹ ~ 2³¹-1`      |   `val c = 100_000`   |
|  `Long`  |  64 位  |      `-2⁶³ ~ 2⁶³-1`      |    `val d = 100L`     |
| `Float`  |  32 位  |  约 `±1.4E-45 ~ ±3.4E38`  |    `val e = 3.14F`    |
| `Double` |  64 位  | 约 `±4.9E-324 ~ ±1.7E308` |    `val f = 3.14`     |

##### () `Kotlin` 类型声明

`kotlin`可以显示声明类型

```kotlin
val name:String = "John" 
val age:Int = 25 
val balance:Double = 1000.0 
val isActive:Boolean = true 
```

##### () `Kotlin` 中的类型推断

`Kotlin` 中的类型推断允许编译器根据变量的初始化值自动确定变量的类型。每次使用变量时，不必显式指定其类型。

```kotlin
val name = "John" // 类型推断推断'name' 的类型为String
val age = 25 // 类型推断推断'age'的类型为Int 
val balance = 1000.0 // /类型推断推断'balance'的类型为Double
val isActive = true // 类型推断推断'isActive'的类型为Boolean 
```

在上面的示例中，`Kotlin` 根据分配给变量的值推断变量的类型。这减少了代码的冗长并提高了可读性。但是，需要注意的是，一旦推断出类型，它就变得固定并且无法更改。如果您需要不同的类型，则必须显式声明它。

##### () 类型检查与转换





##### () `Kotlin` 中 val 和 var 有什么区别？

在 `Kotlin` 中，`val` 和 `var` 用于声明变量，但它们有不同的特点：

- `val` 用于声明只读（不可变）变量。一旦分配，“`val`”的值就不能更改。相当于`java`中的`final`关键字，`kotlin`代码编译成`java`代码后，可以看到最终就是由`final`实现的。
- 引用类型的`val`变量。这一点的特性和`final`一致，如果是数组、集合和对象等引用类型，不可变的是引用类型的地址，数组或集合元素和对象字段依旧是可变的。（不懂的，可以去看我的`JVM`那一章节去复习一下）
- `var` 用于声明可变变量。 `var` 的值可以多次重新分配。

`var`相当于单词“`varible`：变量”; 而`val`则相当于“`varible+final`”更合适,而不是“`value`”。

```kotlin
val  pi  =  3.14  // 声明一个只读变量
pi = 3.1415 // 错误：Val 无法重新赋值
var  count  =  0  // 声明一个可变变量
count = 1  // 重新赋值
val  name  =  "John"  // 不可变变量
name = "Alex"  // 错误：无法为不可变变量重新赋值
val intArray  : IntArray = IntArray(5) 
intArray[0] = 5 // val 修饰引用类型的变量，则是地址不可变，但是值却是可变的。
```

##### () 优先使用`val`而不是`var`（`kotlin`表达式编程）

###### 1.`kotlin`推崇函数式编程（表达式编程）

`    kotlin`推崇函数式编程（表达式编程），程序由一个一个的表达式组成（前后有等号的表达式），而不是一条条的函数。表达式就是可以返回值的语句，值、常量、函数都可以是有返回值的表达式。

​    举一个`java`例子

```java
void ifStatement(Boolean flag){
    String a = null; // 这里相当于 kotlin 的 var
    if (flag) {
        a = "nello"
    }
    System.out.println(a.toUpperCase()); // a可能为null
}
```

​    可见，如果采用语句式的编程，有可能出现`null`值，和没写`else`语句的情况，存在潜在问题，也就是副作用，a可能并没有赋值。

我们再来看一个`kotlin`的表达式编程的例子。

```kotlin
fun ifStatement(flag : Boolean){
    val a = if(flag)"hello" else "" // 这里可以进一步把函数语句提出来
    println(a.toUpperCase())
}
```

​    如果采用了表达式编程的方案，会带一个优势，编译器强制进行类型检查，一是检查`if-else`语句是否完整，二是强制检查是否存在`null`值，这种方式保证了`a`变量一定会得到赋值，而不会出现没有赋值的情况，彻底消除了副作用。在函数式编程中，原则上表达式不允许出现副作用。

​    副作用：也就是反复赋值，或没有赋值的情况，导致一个表达式的输入和输出类型不确定。总的来说，就是`kotlin`为了保证类型安全做出的手段。

​    扩展一下，`switch`语句和`when`语句也强制进行类型检查。

###### 2.优先使用`val`而不是`var`

​    好了，现在我们再来回过头来解释一下，为什么优先使用`val`而不是`var`。一个表达式，只要输入确定了之后，相同的输入进来，输出一定是一致的。你可以把表达式编程理解为数学中的方程和算术表达式，因为这就是函数式编程的最初理念。使用val来接收表达式的值，可以确保值一定有，并且不会变动，这对于数学算式来说十分有用，因为这样就可以保证接下来的运算一定不会出错，这就是函数式编程的初衷。越是复杂的逻辑，优势越大。

​    而`var`则可以用于传统`java`中的共享变量。

##### () `kotlin`尾递归优化

`Kotlin` 中的尾递归是一种递归函数调用自身作为其最后一个操作的技术。**它允许编译器将递归优化为有效的循环**，防止堆栈溢出错误。要启用尾递归优化，必须使用修饰符声明递归函数`tailrec`。这是一个例子：

```kotlin
tailrec fun factorial(n: Int, acc: Int = 1): Int {
    return if (n == 0) {
        acc
    } else {
        factorial(n - 1, acc * n)
    }
}

fun main() {
    val result = factorial(5)
    println(result) // 输出: 120
}
```













### {} `Kotlin` 表达式和控制流程

##### () 操作符重载

###### 一、运算符重载的核心概念

`Kotlin` 允许通过 **预定义函数名** 为类重载运算符（如 `+`, `-`, `==` 等），使对象支持类似基本类型的运算操作。运算符重载通过 `operator` 关键字声明。

###### 二、可重载的运算符及对应函数

以下是 `Kotlin` 支持的主要运算符及其对应的函数签名：

1. **算术运算符**

| 运算符 | 函数名  | 示例表达式 |   等效调用   |
| :----: | :-----: | :--------: | :----------: |
|  `+`   | `plus`  |  `a + b`   | `a.plus(b)`  |
|  `-`   | `minus` |  `a - b`   | `a.minus(b)` |
|  `*`   | `times` |  `a * b`   | `a.times(b)` |
|  `/`   |  `div`  |  `a / b`   |  `a.div(b)`  |
|  `%`   |  `rem`  |  `a % b`   |  `a.rem(b)`  |
|  `++`  |  `inc`  |   `a++`    |  `a.inc()`   |
|  `--`  |  `dec`  |   `a--`    |  `a.dec()`   |

**示例**：为 `Point` 类实现坐标相加

```kotlin
data class Point(val x: Int, val y: Int) {
    operator fun plus(other: Point): Point {
        return Point(x + other.x, y + other.y)
    }
}

fun main() {
    val p1 = Point(1, 2)
    val p2 = Point(3, 4)
    println(p1 + p2) // 输出：Point(x=4, y=6)
}
```

2. **比较运算符**

| 运算符 |   函数名    | 示例表达式 |            等效调用            |
| :----: | :---------: | :--------: | :----------------------------: |
|  `==`  |  `equals`   |  `a == b`  | `a?.equals(b) ?: (b === null)` |
|  `!=`  |  `equals`   |  `a != b`  |          `!(a == b)`           |
|  `>`   | `compareTo` |  `a > b`   |      `a.compareTo(b) > 0`      |
|  `<`   | `compareTo` |  `a < b`   |      `a.compareTo(b) < 0`      |
|  `>=`  | `compareTo` |  `a >= b`  |     `a.compareTo(b) >= 0`      |
|  `<=`  | `compareTo` |  `a <= b`  |     `a.compareTo(b) <= 0`      |

**示例**：实现 `Money` 类的比较

```kotlin
data class Money(val amount: Int) : Comparable<Money> {
    override operator fun compareTo(other: Money): Int {
        return amount.compareTo(other.amount)
    }
}

fun main() {
    val m1 = Money(100)
    val m2 = Money(200)
    println(m1 < m2) // 输出：true
}
```

3. **集合与索引操作**

| 运算符 |   函数名   |   示例表达式   |     等效调用      |
| :----: | :--------: | :------------: | :---------------: |
|  `[]`  |   `get`    |     `a[i]`     |    `a.get(i)`     |
| `[]=`  |   `set`    | `a[i] = value` | `a.set(i, value)` |
|  `in`  | `contains` |    `a in b`    |  `b.contains(a)`  |

**示例**：自定义矩阵访问

```kotlin
class Matrix(private val data: Array<IntArray>) {
    operator fun get(row: Int, col: Int): Int {
        return data[row][col]
    }

    operator fun set(row: Int, col: Int, value: Int) {
        data[row][col] = value
    }
}

fun main() {
    val matrix = Matrix(arrayOf(intArrayOf(1, 2), intArrayOf(3, 4)))
    println(matrix[1, 1]) // 输出：4
    matrix[0, 1] = 5
    println(matrix[0, 1]) // 输出：5
}
```

4. **其他运算符**

|    运算符    |    函数名    | 示例表达式 |     等效调用     |
| :----------: | :----------: | :--------: | :--------------: |
|     `..`     |  `rangeTo`   |   `a..b`   |  `a.rangeTo(b)`  |
| `unaryMinus` | `unaryMinus` |    `-a`    | `a.unaryMinus()` |
|    `inv`     |    `inv`     |    `~a`    |    `a.inv()`     |

###### 三、运算符重载的限制与注意事项

1. **不可自定义新运算符**

`Kotlin` 仅支持重载预定义的运算符，无法创建新符号（如 `**` 或 `<>`）。

2. **参数类型与数量**

- 必须严格遵循函数签名中的参数数量和类型。
- 示例：`plus` 函数只能有一个参数。

3. **结合性优先级**

运算符的优先级由 `Kotlin` 语法规则固定，无法通过重载改变。

###### 四、结合扩展函数的运算符重载

可以为现有类通过扩展函数添加运算符支持。

**示例**：为 `String` 添加重复操作符 `*`

```kotlin
operator fun String.times(n: Int): String {
    return repeat(n)
}

fun main() {
    val s = "Hi" * 3
    println(s) // 输出：HiHiHi
}
```

###### 五、应用场景与最佳实践

1. **适用场景**

- **数学计算类**：如向量、矩阵、复数运算。
- **集合操作**：自定义集合的索引或范围操作。
- **`DSL` 设计**：创建领域特定语言（如 `HTML` 构建器）。

2. **避免滥用**

- 确保运算符行为符合直觉（如 `+` 应表示加法而非其他操作）。
- 过度使用会降低代码可读性。

###### 六、总结

通过合理使用运算符重载，可以让自定义类型具备更自然的语法表达力，但需遵循以下原则：

1. **语义明确**：确保运算符行为符合直觉。
2. **适度使用**：优先在数学或容器类场景中使用。
3. **性能考量**：避免在高频调用路径中使用复杂运算逻辑。

掌握运算符重载技巧，能显著提升 `Kotlin` 代码的简洁性和表现力。

##### () `when` 表达式

###### 一、`when` 表达式基础

`when` 是 `Kotlin` 中强大的条件控制结构，可以替代 `Java` 的 `switch`，但功能更强大：

```kotlin
fun describe(obj: Any): String = when (obj) {
    1          -> "One"          // 常量匹配
    in 2..10   -> "Between 2-10" // 范围检测
    is String  -> "String length: ${obj.length}" // 类型检测 + 智能转换
    else       -> "Unknown"      // 默认分支（必须覆盖所有情况）
}
```

###### 二、密封类（`Sealed Class`）的作用

密封类用于定义 **受限的类继承结构**，所有子类必须在同一文件中声明，常用于表示有限的状态或指令类型（类似于枚举）：

```kotlin
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
    object Loading : Result<Nothing>()
}
```

###### 三、`when` + 密封类：类型安全的模式匹配

1. **结合优势**

- **穷尽性检查（编译器强制）**：当 `when` 处理密封类时，若未覆盖所有子类分支，编译器会 **报错**，避免遗漏逻辑。
- **智能类型转换**：进入分支后自动转换为对应子类，无需手动类型检查。

2. **处理网络请求结果示例**

```kotlin
fun handleResult(result: Result<String>) {
    when (result) {
        is Result.Success -> println("Data: ${result.data}") // 直接访问 data 属性
        is Result.Error -> println("Error: ${result.exception.message}")
        Result.Loading -> println("Loading...")
        // 无需 else，因为密封类已覆盖所有情况
    }
}
```

3. **优势对比（vs Java `switch`）**

|   **特性**   |   **`Kotlin`  `when` + 密封类**    |   **Java `switch`**    |
| :----------: | :--------------------------------: | :--------------------: |
|   类型安全   |        ✅ 编译器检查所有分支        |    ❌ 可能遗漏枚举项    |
|   模式匹配   | ✅ 支持类型、范围、条件等任意表达式 |    ❌ 仅支持常量匹配    |
| 自动类型转换 |      ✅ 分支内直接访问子类属性      | ❌ 需手动类型转换和检查 |

###### 四、进阶用法

1. **嵌套密封类**

多层密封类结构可细化状态类型：

```kotlin
sealed class UIState {
    data class Content(val items: List<Item>) : UIState()
    sealed class Error : UIState() {
        object NetworkError : Error()
        data class ServerError(val code: Int) : Error()
    }
    object Loading : UIState()
}

fun updateUI(state: UIState) = when (state) {
    is UIState.Content -> showList(state.items)
    is UIState.Error.NetworkError -> showNetworkError()
    is UIState.Error.ServerError -> showErrorCode(state.code)
    UIState.Loading -> showLoading()
}
```

2. **结合 `when` 表达式返回值**

```kotlin
fun getStatusColor(result: Result<*>): Int = when (result) {
    Result.Success -> Color.GREEN
    Result.Error -> Color.RED
    Result.Loading -> Color.GRAY
}
```

###### 五、实际应用场景

1. **状态管理**：处理 `UI` 状态（加载、成功、失败）、网络请求结果。
2. **事件处理**：用户操作指令（点击、滑动、长按）。
3. **数据解析**：解析不同格式的 `API` 响应。

###### 六、总结

|    **设计模式**    |       **代码示例**       |               **优势**               |
| :----------------: | :----------------------: | :----------------------------------: |
|       状态机       |    密封类表示有限状态    |      明确状态流转，避免非法状态      |
|      策略模式      | `when` 分支处理不同策略  |      简化条件逻辑，提高可维护性      |
| 类型安全的模式匹配 | 密封类 + `when` 穷尽检查 | 编译时保障逻辑完整性，减少运行时错误 |

通过结合 `when` 表达式和密封类，可以写出 **类型安全、可读性强、易于维护** 的 `Kotlin` 代码，特别适合处理复杂的状态逻辑。





### {} `Kotlin`类与对象

#### [] `kotlin`类

##### () `kotlin`类与`java`类对比

`Kotlin` 和 `Java` 在类的设计上有许多相似之处，但由于 `Kotlin` 的现代化特性，两者在语法、功能和设计哲学上存在显著差异。以下是详细的对比：

###### 1、类声明与结构

|    **特性**    |                    **`Kotlin`**                    |                 **`Java`**                  |
| :------------: | :------------------------------------------------: | :-----------------------------------------: |
|   **类声明**   |                  `class MyClass`                   |          `public class MyClass {}`          |
|  **构造函数**  | 主构造函数直接写在类头，次构造函数用 `constructor` |     构造函数名必须与类名相同，支持重载      |
|  **属性声明**  |    可在主构造函数中直接声明属性（`val`/`var`）     | 需显式声明字段，并手动编写 `getter/setter`  |
| **默认修饰符** |          默认 `public final`（不可继承）           |           默认包级可见，非 final            |
|  **文件级类**  |           一个文件可包含多个类，无需同名           |    文件名必须与唯一的 `public` 类名相同     |
|  **初始化块**  |        `init` 代码块，在主构造函数之后执行         |            实例初始化块（`{}`）             |
|   **默认值**   |              ***强制显示指定默认值***              | ***可不写默认值，默认值隐式为`0`或`null`*** |
| **属性初始化** |          可直接在主构造函数或类体内初始化          |      需在构造函数或初始化块中手动赋值       |

###### 2、继承与多态

|     **特性**      |                      **`Kotlin`**                       |                    **Java**                     |
| :---------------: | :-----------------------------------------------------: | :---------------------------------------------: |
|   **继承语法**    |          使用 `:`，如 `class Child : Parent()`          | 使用 `extends`，如 `class Child extends Parent` |
|   **方法重写**    |            需**显式**标注 `override` 关键字             |                仅需方法签名一致                 |
| ***open 关键字*** | ***类和方法默认 `final`，需标记 `open` 允许继承/重写*** |      ***默认非 `final`，可自由继承/重写***      |
|    **抽象类**     |             类似 `Java`，用 `abstract` 声明             |                      相同                       |

###### 3、数据类与工具类

|  **特性**  |                        **`Kotlin`**                         |                  **`Java`**                  |
| :--------: | :---------------------------------------------------------: | :------------------------------------------: |
| **数据类** | `data class` 自动生成 `equals`/`hashCode`/`toString`/`copy` | 需手动实现或使用 `Lombok` 注解（如 `@Data`） |
| **工具类** |               使用 `object` 声明单例或工具类                |        静态方法（`static`）或单例模式        |

###### 4、伴生对象与静态成员

|     **特性**     |            **`Kotlin`**             |        **`Java`**        |
| :--------------: | :---------------------------------: | :----------------------: |
|   **静态成员**   |    通过 `companion object` 实现     | 直接使用 `static` 关键字 |
| **静态初始化块** | `companion object { init { ... } }` |     `static { ... }`     |

###### 5、其他特性对比

|    **特性**    |                 **`Kotlin`**                  |               **`Java`**                |
| :------------: | :-------------------------------------------: | :-------------------------------------: |
|  **扩展函数**  | 支持（如 `fun String.myExtension() { ... }`） |        不支持，需通过工具类实现         |
|   **密封类**   |          `sealed class` 限制继承层级          | 无直接支持，可通过包级私有构造函数模拟  |
| **对象表达式** |   匿名对象（`object : Interface { ... }`）    | 匿名内部类（`new Interface() { ... }`） |
|  **属性委托**  |       支持（如 `by lazy`/`observable`）       |               需手动实现                |

###### 6、互操作性

- **`Kotlin` 调用 `Java` 类**：无缝兼容，但需注意空安全（`@Nullable`/`@NotNull` 注解）。
- `Java` 调用 `Kotlin` 类
  - 伴生对象通过 `Companion` 访问（如 `MyClass.Companion.staticMethod()`）。
  - 扩展函数编译为静态方法。

###### 总结

1. **简洁性**：`Kotlin` 通过主构造函数、数据类、默认参数等大幅减少样板代码。
2. **安全性**：`Kotlin` 强制显式继承（`open`）和空安全机制，减少运行时错误。
3. **功能性**：扩展函数、密封类、属性委托等特性提供更强大的表达能力。
4. **兼容性**：`Kotlin` 与 `Java` 完全互操作，适合渐进式迁移。

通过对比可以看出，`Kotlin` 在保留 `Java` 核心特性的基础上，通过现代化语法和功能改进，显著提升了开发效率和代码质量。



#### [] `kotlin`中类的属性访问

`Kotlin` 中的属性访问语法允许您定义属性访问和分配的自定义行为。它提供了一种在获取或设置属性值时自定义逻辑的方法。在 `Kotlin` 中，属性访问和赋值被转换为对称为访问器的特殊函数的调用：`get()`用于属性访问和`set()`属性赋值。通过显式定义这些访问器，您可以向属性访问和分配添加自定义逻辑。

```kotlin
class Person {
    var name: String = "John"
    // 除非你需要定义额外的 get 和 set 逻辑，则需要显示定义他们。否则 kotlin 会帮你隐式的定义 get 和 set
        get() {
            println("Getting name")
            return field
        }
        set(value) {
            println("Setting name to $value")
            field = value
        }
}

fun main() {
    val person = Person()
    println(person.name) //  输出：获取姓名，John
    person.name = "Jane" // 输出：将 name 设置为 Jane
}
```

##### 

#### [] `kotlin`构造方法

##### () 主从构造函数

`Kotlin` 中的构造函数是其类定义的重要组成部分，与 `Java` 的构造函数机制有显著区别。以下是 `Kotlin` 构造函数的详细解释：

###### 一、构造函数的分类

`Kotlin` 构造函数分为两种：

1. **主构造函数（Primary Constructor）**
   类的核心初始化逻辑，直接声明在类头部。
2. **次构造函数（Secondary Constructor）**
   用于补充初始化逻辑，需显式委托给主构造函数。

###### 二、主构造函数

1. 基本语法

```kotlin
class Person constructor(firstName: String) { 
    // 类体
}
```

- `constructor` 关键字在类头部声明主构造函数。

- 若没有可见性修饰符（如`public`或`private`）或**注解**，可省略`constructor`

  ```kotlin
  class Person(firstName: String) { ... } // 不加val相当于只声明了构造函数参数
  ```

2. 主构造函数的作用

- 声明属性 ：直接在参数中定义类的属性：

  ```kotlin
  class Person(val name: String, var age: Int) {  // 加了val相当于同时声明了字段
      // 自动生成属性 name（只读）和 age（可变）
  }
  ```

- 初始化逻辑：通过`init`代码块实现：

  ```kotlin
  class Person(name: String) {
      val upperName: String
      init {
          upperName = name.uppercase()
      }
  }
  ```

  - `init` 块在主构造函数调用时执行。

3. 主构造函数参数的作用域

- 仅在`init`块和属性初始化表达式中可见：

  ```kotlin
  class Person(name: String) { // 不加val相当于只声明了构造函数参数，参数只能在init代码块使用
      val greeting = "Hello, $name!" // ✅ 允许使用 name
      fun printName() {
          println(name) // ❌ 错误：name 在此处不可见
      }
  }
  ```

###### 三、次构造函数

1. 基本语法

```kotlin
class Person {
    constructor(name: String) { 
        // 次构造函数逻辑
    }
}
```

- 必须通过 `constructor` 关键字显式声明。

  必须直接或间接委托给主构造函数（如果主构造函数存在）

  ```kotlin
  class Person(val name: String) {
      constructor(name: String, age: Int) : this(name) { // 类似于 java 当中构造函数使用 this 关键字调用其他构造函数。
          // 先调用主构造函数，再执行次构造函数逻辑
      }
  }
  ```

2. 无主构造函数的类

若类没有声明主构造函数，次构造函数无需委托：

```kotlin
class Car {
    constructor(brand: String) { ... }
    constructor(brand: String, price: Int) { ... }
}
```

###### 四、初始化顺序

1. 主构造函数参数初始化。
2. 类体中声明的属性初始化。
3. `init` 代码块执行。
4. 次构造函数体执行。

**示例**：

```kotlin
class Example(val a: String) {
    val b = "Property: $a".also(::println)

    init {
        println("Init block: $a")
    }

    constructor(a: String, b: Int) : this(a) {
        println("Secondary constructor")
    }
}
// 调用 Example("test", 123) 输出顺序：
// Property: test
// Init block: test
// Secondary constructor
```

###### 五、特殊场景

1. 默认构造函数

若未声明任何构造函数，`Kotlin` 会自动生成无参主构造函数：

```kotlin
class Empty // 等价于 class Empty()
```

2. 私有构造函数

通过可见性修饰符限制构造函数访问：

```kotlin
class Singleton private constructor() {
    companion object {
        val instance = Singleton()
    }
}
```

3. Data Class 的构造函数

数据类必须声明至少一个主构造函数参数：

```kotlin
data class User(val id: Int, val name: String)
```

###### 六、与 Java 的对比

|     特性      |            `Kotlin`            |        `Java`        |
| :-----------: | :----------------------------: | :------------------: |
| 主/次构造函数 |      明确区分主次构造函数      |  仅支持多个构造函数  |
|   属性声明    |   可直接在构造函数中声明属性   | 需手动声明字段并赋值 |
|   初始化块    |         `init` 代码块          | 实例初始化块（`{}`） |
|   委托机制    | 次构造函数必须委托给主构造函数 |      无强制要求      |

###### 七、最佳实践

1. **优先使用主构造函数**：在构造函数中声明属性。

2. **避免复杂的 `init` 块**：将初始化逻辑拆分到方法中。

3. 

   谨慎使用次构造函数：多数场景可通过默认参数替代：

   ```kotlin
   class Person(val name: String, val age: Int = 0) // 默认参数
   ```

###### 总结

`Kotlin` 的构造函数机制通过主次构造函数的分离、属性声明与初始化的简化和明确的初始化顺序，显著提升了代码的简洁性和安全性。理解主构造函数的核心地位和次构造函数的委托机制是掌握 `Kotlin` 类设计的关键。

##### () 构造函数重载与默认参数

`Kotlin` 推荐使用 **默认参数** 简化构造函数重载，减少代码冗余。例如：

```kotlin
class Person(
    val name: String,
    val age: Int = 0,       // 默认参数
    val email: String = ""  // 默认参数
) {
    // 无需次构造函数！
} 

// 调用示例 
val p1 = Person("Alice")                  // age=0, email=""
val p2 = Person("Bob", 25)                // email=""
val p3 = Person("Charlie", 30, "c@test.com")
// 由于默认参数的存在。使用这种方式重载，最好指定参数名称
val p4 = Person(age = 30, email = "c@test.com",name = "Charlie") 

```

##### () `lateinit`和`by lazy`延迟加载

在 `Kotlin` 中，**延迟加载（`Lazy Initialization`）** 是一种优化对象初始化的技术，允许将对象的创建或初始化推迟到首次使用时。这在需要避免不必要的资源消耗或解决循环依赖问题时非常有用。`Kotlin` 提供了两种主要方式实现延迟加载：`lateinit` 和 `by lazy`。

###### 一、`lateinit`：延迟初始化非空可变变量

`Kotlin` 中的 `Lateinit` 属性是一种声明非空属性的方法，该属性在声明时不会立即初始化。它允许您稍后在访问属性之前为其分配值。

1. **核心特性**

- 用于 **`var` 变量**（非 `val`）。
- 无需在声明时初始化，但必须在使用前初始化。
- 适用于需要明确初始化时机（如 `Android` 的 `onCreate` 中初始化视图）的场景。

2. **语法示例**

```kotlin
class MyClass {
    // 声明一个延迟初始化的非空字符串
    lateinit var name: String

    fun initializeName() {
        name = "Kotlin" // 必须在使用前初始化
    }

    fun printName() {
        if (::name.isInitialized) { // 检查是否已初始化
            println(name)
        }
    }
}
```

3. **注意事项**

- **不能用于基本类型**（如 `Int`、`Boolean`），只能用于对象类型。

- 未初始化时访问会抛出 `UninitializedPropertyAccessException`

  ```kotlin
  val obj = MyClass()
  println(obj.name) // ❌ 抛出异常
  ```

4. **为什么`lateint`不能用于基本类型**

 `lateinit` 的机制是通过 **“可空性（`Nullable`）”** 来跟踪变量是否已初始化：

1. 声明 `lateinit var` 时，编译器会生成一个隐藏的标记字段（如 `isInitialized`）来跟踪初始化状态。
2. 在访问未初始化的 `lateinit` 变量时，会检查标记字段并抛出 `UninitializedPropertyAccessException`。

3. 而 **基本类型（`Primitive Types`）** 在 `Kotlin/JVM` 中会被编译为 `JVM` 的原始类型（如 `int`、`boolean`），它们 **无法存储 `null` 值**，因此无法通过“可空性”机制实现初始化状态的跟踪。`java`中`int`初始值是`0`，故无法区分是有初始值`0`还是没有赋值。

```kotlin
lateinit var str: String // 底层实际为 String?，但编译器隐藏了可空性。相当于告诉编译器，他虽然没赋值，但是绝对是非空的。
```

**`kotlin`函数式编程的设计哲学**：`Kotlin` 通过严格的类型系统避免未初始化错误，而基本类型无法融入这一机制，确保类型安全。

###### 二、`by lazy`：惰性初始化不可变变量

1. **核心特性**

- 用于 **`val` 变量**（不可变）。
- 在首次访问时执行初始化代码，且后续访问直接返回缓存值。
- **线程安全**（默认使用 `LazyThreadSafetyMode.SYNCHRONIZED`）。
- **用处**：延迟初始化通常用于计算成本较高**或需要昂贵的资源分配的属性**，而无需立即初始化它们，特别是对于不经常访问或具有昂贵初始化逻辑的属性。

2. **语法示例**

```kotlin
class MyClass {
    // 惰性初始化一个不可变的资源
    val heavyResource: Resource by lazy {
        println("初始化 heavyResource")
        Resource() // 初始化逻辑，返回值也是它
    }
    val sex: String by lazy {
        if(color == MyColorEnum.Yellow)
            return@lazy "male"
        else
            return@lazy "female"
    }
}

// 使用示例
val obj = MyClass()
println(obj.heavyResource) // 首次访问触发初始化
println(obj.heavyResource) // 直接使用缓存值
```

输出：

``` output
初始化 heavyResource
Resource@1234
Resource@1234
```

3. **线程安全模式**

通过 `lazy` 的参数指定不同的线程安全策略：

```kotlin
val lazyValue: String by lazy(LazyThreadSafetyMode.NONE) {
    // 非线程安全，适用于单线程环境
    "Value"
}
```

###### 三、`lateinit` vs `by lazy` 对比

|      特性      |       `lateinit var`       |                  `by lazy`（`val`）                  |
| :------------: | :------------------------: | :--------------------------------------------------: |
|    变量类型    |       可变（`var`）        |                   不可变（`val`）                    |
|   初始化时机   |   手动初始化（明确调用）   |                 首次访问时自动初始化                 |
|  **适用场景**  | **需要灵活控制初始化时机** | **资源加载，不经常访问，或具有昂贵的资源分配的属性** |
|    线程安全    |         需自行保证         |                     默认线程安全                     |
|  支持基本类型  |      ❌只可以引用类型       |                          ✅                           |
| 检查是否初始化 | `::property.isInitialized` |                无需检查（自动初始化）                |

###### 四、使用场景示例

1. **`Android` 视图初始化**

```kotlin
class MyFragment : Fragment() {
    // 使用 lateinit 延迟初始化视图
    lateinit var recyclerView: RecyclerView
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        recyclerView = view.findViewById(R.id.recycler_view) // 在 onCreateView 后初始化
    }
}
```

2. **单例模式**

```kotlin
class Singleton {
    companion object {
        val instance: Singleton by lazy { Singleton() } // 只有在首次访问属性的时候才会初始化。
    }
}
```

3. **依赖注入**

```kotlin
class Service {
    val database: Database by lazy { 
        Database.connect() // 按需连接数据库
    }
}
```

###### 五、注意事项

1. **内存泄漏**：
   `by lazy` 或 `lateinit` 引用的对象可能因生命周期不一致导致内存泄漏（如 `Android` 的 `Activity` 被销毁后仍持有视图引用）。
   ​**解决方式**：使用弱引用（`WeakReference`）或在适当时机手动释放。

   - 潜在泄漏场景
     - `Lazy` 委托对象本身可能被意外引用（如通过 Lambda 表达式捕获外部上下文）。
     - 延迟初始化的值被其他长期存在的对象引用。

   `by lazy` 的初始化 Lambda 如果捕获了外部对象，可能导致意外引用：

   ```kotlin
   class MyClass {
       val lazyValue by lazy {
           someExternalObject.doSomething() // 捕获了 someExternalObject
           // PS：只要确保引用的对象得到正确的释放，就不会导致内存泄露
       }
   }
   ```

2. **性能开销**：
   `by lazy` 的同步锁可能带来轻微性能损耗，非线程安全场景可用 `LazyThreadSafetyMode.NONE` 优化。

3. **逻辑清晰性**：
   避免过度使用延迟加载，导致代码可读性下降。







#### [] `kotlin`可见性和访问修饰符

##### () `kotlin`访问修饰符和`java`做对比

|        特性        |              `Kotlin`               |          Java          |
| :----------------: | :---------------------------------: | :--------------------: |
|   **默认修饰符**   |          隐式默认`public`           |  包级私有（无修饰符）  |
|  **模块级可见性**  |     `internal`（`Kotlin` 特有）     | 无直接等效，需手动分包 |
| **protected 范围** |             仅子类可见              |    子类 + 同包可见     |
|    **包级私有**    | 无，用 `internal` 或 `private` 代替 |      默认无修饰符      |
|   **`private`**    |    仅在 **当前类或文件** 内可见     |       同`kotlin`       |

##### () `kotlin`函数式编程设计的哲学：可见性设计

**核心差异对比：**

|        **特性**         |             **`Kotlin`**             |                 **Java**                 |
| :---------------------: | :----------------------------------: | :--------------------------------------: |
|   **类的默认继承性**    |       默认 `final`（不可继承）       |       默认非 `final`（可直接继承）       |
|  **方法的默认重写性**   |       默认 `final`（不可重写）       |       默认非 `final`（可直接重写）       |
| **允许继承/重写的标记** |       需显式添加 `open` 关键字       |    默认允许，需显式添加 `final` 禁止     |
|      **设计哲学**       | **明确设计扩展点**，避免意外破坏封装 | **默认开放扩展**，依赖开发者自觉控制风险 |

##### () `kotlin`设计哲学：**默认`final`，防止脆弱的基类问题**

- **问题**：父类的方法被无意重写或继承，导致子类行为不可预测，破坏父类逻辑。

- **背景**：`Java` 默认开放的设计背景

  1. **历史原因**：`Java` 诞生于 1995 年，当时面向对象编程（`OOP`）强调继承和多态，**默认开放更符合早期设计思想**。
  2. **灵活性优先**：通过继承快速扩展功能，适合小型项目快速迭代。
  3. **代价**：大型项目中，无约束的继承易导致代码耦合度高，难以维护。

- **示例**：

  `java`:

  ```java
  // Java：父类方法默认可重写
  public class Cache {
      public void clear() { ... } // 子类可能重写此方法，导致缓存逻辑异常
  }
  ```

  `kotlin`(同样的效果，需要显示指定`open`):

  ```kotlin
  // Kotlin：父类方法默认不可重写
  open class Cache {
      open fun clear() { ... } // 只有明确标记为 open 的方法允许重写
  }
  ```

- **总结**：`java`当中默认类可继承，方法可覆写；子类按理来说只允许覆写父类的抽象方法，而不是所有方法，有可能会导致错误的继承，方法的调用出错（参数和返回值）。否则可能就出现里氏替换的问题。`kotlin`这种默认不可继承和覆写的特性，更符合里氏替换的特性，避免意外的继承。

- **里氏替换的重点**（宽进严出，和考大学相反）：

  1. 子类方法的参数：应当比父类的参数更加宽松。（因为实际调用的时候是传入父类接口进行使用，最后调用位置是子类方法；使用方已经在使用了，故必须兼容父类的参数。例如使用者传入了`10~25`的参数范围给父类方法（并且无法改变），子类就必须大于大于这个范围才不会越界;子类`15~20`的范围，使用者输入`10`，原本可以运行，使用子类后就参数越界了。）
  2. 子类方法的返回值：必须可以向上转型至父类方法的返回值。返回值需要比父类更加严格。











#### [] 继承和接口







#### [] `data` 数据类

在 `Kotlin` 中，数据类是一种特殊类型的类，主要用于保存数据/状态而不是行为。它旨在根据类中定义的属性自动生成常用方法，例如`equals()`、`hashCode()`、`toString()`、 和`copy()`。

##### () 数据类的定义

```kotlin
// 用 data class 声明
data  class  Person ( val name: String, val age : Int ) 

val person = Person( "John" , 25 ) 
println(person) // 输出：Person(name=John,age=25)
```

在示例中，该类被定义为具有属性的`Person`的数据类。该方法是自动生成的，并在打印实例时显示属性值。数据类对于对以数据为中心的结构进行建模并自动提供处理数据的有用方法非常有用。

##### () 自动生成的功能

|            功能             |                  作用                   |                示例                |
| :-------------------------: | :-------------------------------------: | :--------------------------------: |
|      **`toString()`**       |            输出可读的类信息             |     `User(name=Alice, age=30)`     |
| **`equals()`/`hashCode()`** |         按属性值比较对象相等性          | `user1 == user2`（比较所有属性值） |
|        **`copy()`**         |      创建对象的副本，支持部分修改       |       `user.copy(age = 31)`        |
|     **`componentN()`**      | 解构声明（如 `val (name, age) = user`） |      按属性顺序解构为独立变量      |

###### 1.`toString()`方法

如果你不想使用默认的方法，可手动覆写 `toString` 等方法：

```kotlin
data class Book(val title: String, val price: Int) {
    override fun toString(): String = "《$title》（价格：¥$price）"
}
```

> [!NOTE]
>
> 注意：在类体内定义的属性不会被包含在自动生成的方法中

```kotlin
data class Person(val id: String) {
    var address: String = "street-123" // 不影响 equals/toString 等逻辑
}
```

###### 2.`copy()`深度复制与修改

```kotlin
val original = User("Alice", 30)
val modified = original.copy(age = 31) // 创建新对象，仅修改 age 属性
```

###### 3.`componentN()`解构

```kotlin
val user = User("Alice", 30)
//  Data 类：data 类会自动生成 componentN() 函数。这些函数允许你通过解构声明（destructuring declarations）来访问对象的属性。
val (username, userAge) = user // 解构为变量 username 和 userAge  ; 必须按顺序填写
```

###### **4.`equals()`**方法

```kotlin
data class Person(val name: String, val age: Int)

val person1 = Person("John", 30)
val person2 = Person("John", 30)

println(person1 == person2)  // true, 因为它们的属性值相同
```



##### () 限制与注意事项

1. **继承限制**：数据类不能继承其他类（但可以实现接口）。

2. **主构造函数要求**：必须至少有一个用 `val`/`var` 声明的参数。

3. **成员变量**：在类体内定义的属性不会被包含在自动生成的方法中：

   ```kotlin
   data class Person(val id: String) {
       var address: String = "" // 不影响 equals/toString 等逻辑
   }
   ```

- **使用场景**：优先用于纯数据载体（如 `API` 响应模型、数据库实体）。
- **优势**：减少样板代码，提升代码可读性和维护性。
- **注意**：避免滥用，业务逻辑复杂的类应使用普通类(如需要继承某个类)。

##### () 使用场景(`Gson`和`Room`使用数据类)

以下是一个结合 **`Gson`**（`JSON` 解析）和 **`Room`**（数据库持久化）使用 `Kotlin` 数据类的完整示例，涵盖数据模型定义、数据库操作和 `JSON` 转换：

###### 1. 数据类定义（`User.kt`）

```kotlin
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.google.gson.annotations.SerializedName

// 定义 Room 实体，同时兼容 Gson 解析
@Entity(tableName = "users")
data class User(
    @PrimaryKey(autoGenerate = true) // Room 主键
    val id: Int = 0, // 默认值避免 Gson 反序列化时因空值报错

    @SerializedName("user_name") // Gson 字段映射（JSON 字段名 → 类属性名）
    val name: String,

    @SerializedName("user_age")
    val age: Int,

    @SerializedName("email")
    val email: String? = null // 可空字段，应对 JSON 中可能缺失的值
)
```

###### 2. Room 数据库配置（`AppDatabase.kt`）

```kotlin
import androidx.room.Database
import androidx.room.RoomDatabase

@Database(entities = [User::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}
```

###### 3. `Room DAO` 接口（`UserDao.kt`）

```kotlin
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface UserDao {
    @Insert
    suspend fun insert(user: User)

    @Query("SELECT * FROM users")
    suspend fun getAllUsers(): List<User>
}
```

###### 4. 使用 `Gson` 解析 `JSON`（示例代码）

```kotlin
import com.google.gson.Gson

fun main() {
    // 模拟网络请求返回的 JSON 数据
    val json = """
        {
            "user_name": "Alice",
            "user_age": 30,
            "email": "alice@example.com"
        }
    """.trimIndent()

    // 使用 Gson 解析 JSON 到 User 对象
    val user = Gson().fromJson(json, User::class.java)
    println("解析结果: $user") // 输出: User(id=0, name=Alice, age=30, email=alice@example.com)
}
```

###### 5. 完整使用流程（`Android` 示例）

```kotlin
// 在 ViewModel 或 Repository 中
class UserRepository(private val db: AppDatabase) {
    private val gson = Gson()

    // 从网络获取 JSON 并存入数据库
    suspend fun saveUserFromJson(json: String) {
        val user = gson.fromJson(json, User::class.java)
        db.userDao().insert(user)
    }

    // 从数据库读取数据并转换为 JSON
    suspend fun getUsersJson(): String {
        val users = db.userDao().getAllUsers()
        return gson.toJson(users)
    }
}
```

###### 关键配置与注意事项

1. **`Gson `与 `Room` 的兼容性**

- **默认值**：数据类属性需设置默认值（如 `id = 0`），避免 `Gson` 因 `JSON` 缺少字段导致构造失败。
- **可空类型**：`JSON` 可能缺失的字段声明为可空（如 `email: String?`）。

2. **`Gradle` 依赖**

确保添加必要的库：`groovy`:

```groovy
// build.gradle (Module)
dependencies {
    implementation "androidx.room:room-runtime:2.4.3"
    kapt "androidx.room:room-compiler:2.4.3"
    implementation "com.google.code.gson:gson:2.9.0"
}
```

3. **`ProGuard/R8` 规则**

若启用代码混淆，需保留数据类和无参构造函数：`proguard`:

```proguard
-keep class com.example.model.** { *; }
-keepclassmembers class * implements java.io.Serializable {
    <fields>;
}
```

通过上述示例，数据类 `User` 可同时用于 **`JSON` 解析** 和 **数据库存储**，实现数据层的高效统一管理。



#### [] `object` 关键字

##### () `object`单例

###### 一、`Kotlin` 单例的核心语法

`Kotlin` 通过 `object` 关键字 **原生支持线程安全的单例模式**，无需手动实现双重校验锁或静态内部类。

1. **基本声明**

```kotlin
object Singleton {
    init {
        println("Singleton initialized") // 初始化代码块
    }

    fun doWork() {
        println("Working...")
    }
}
```

2. **调用方式**

```kotlin
fun main() {
    Singleton.doWork() // 直接通过类名访问
    // 输出：
    // Singleton initialized
    // Working...
}
```

###### 二、实现原理剖析

1. **编译后的 Java 代码**

`Kotlin` 的 `object` 单例在 `JVM` 上会被编译为 **静态内部类模式** 的线程安全单例：

```java
public final class Singleton { //类用 `final` 标记，标识不可变性。
    // 静态实例
    public static final Singleton INSTANCE; //内部声明一个 `static final` 的当前类的对象 `INSATNCE`。

    // 饿汉式：静态代码块中完成实例化，在类加载时初始化到代码中。可以看到，在 `Kotlin` 的 `object` 中，是使用类的初始化锁来保证线程安全的。
    static { // 在静态代码块中，进行 `INSTANCE` 对象的初始化。
        Singleton temp = new Singleton();
        INSTANCE = temp;
        System.out.println("Singleton initialized");
    }

    private Singleton() {} // 私有构造器

    public final void doWork() {
        System.out.println("Working...");
    }
}
```

2. **关键特性**

- **线程安全**：静态初始化块在类加载时执行，由 `JVM` 保证线程安全。
- **饿汉式**：静态代码块中完成`INSTANCE`实例化，在类加载时初始化到代码中。。
- **无法传递参数**：单例对象 **不能有构造函数参数**。

###### 三、高级用法与场景

**1.实现接口或继承类**

```kotlin
interface Logger {
    fun log(message: String)
}

object FileLogger : Logger {
    override fun log(message: String) {
        println("Log to file: $message")
    }
}

// 使用
FileLogger.log("Error occurred")
```

**2.伴生对象（`Companion Object`）单例**

用于在类内部定义静态成员：

```kotlin
class DatabaseClient {
    companion object {
        val instance by lazy { DatabaseClient() } // 自定义懒加载
    }
}

// 调用
val db = DatabaseClient.instance
```



###### 四、对比 Java 单例实现

|     **特性**     |               **`Kotlin` `object`**               |            **`Java`  `DCL` 双重校验锁**             |                     **Java 静态内部类**                      |
| :--------------: | :-----------------------------------------------: | :-------------------------------------------------: | :----------------------------------------------------------: |
|  **代码简洁性**  |                  ✅ 无需手动实现                   |                  ❌ 需编写模板代码                   |                      ❌ 需定义静态内部类                      |
|   **线程安全**   | ✅ 由 `JVM` 保证<br>静态代码块使用**类的初始化锁** | ✅ 通过 `volatile` 和 `synchronized`<br>双重检查锁定 | ✅ 由类加载机制保证。<br>在加载外部类时不会创建静态内部类，<br>在静态内部类中的属性被调用时才会创建 |
|    **懒加载**    |           ✅ 首次访问时初始化（饿汉式）            |            ✅ 首次调用时初始化（懒汉式）             |            ✅ 首次访问静态内部类时初始化（懒汉式）            |
| **构造函数参数** |                     ❌ 不支持                      |                ✅ 支持（需自行处理）                 |                     ✅ 支持（需自行处理）                     |

###### 五、使用场景与最佳实践

1. **适用场景**

- 全局配置管理：如应用设置、环境变量。

  ```kotlin
  object AppConfig {
      val apiBaseUrl = "https://api.example.com"
      val timeout = 30_000
  }
  ```

- 工具类实例：如日志记录器、数据库连接池。

  ```kotlin
  object NetworkClient {
      private val client = OkHttpClient()
  
      fun fetch(url: String): Response {
          return client.newCall(Request.Builder().url(url).build()).execute()
      }
  }
  ```

- 状态管理：如用户会话、购物车。

  ```kotlin
  object UserSession {
      var currentUser: User? = null
      fun logout() { currentUser = null }
  }
  ```

2. **避免滥用**

- **依赖耦合**：单例可能导致代码紧耦合，建议结合依赖注入框架（如 `Koin`、`Dagger`）。
- **测试困难**：单例状态可能影响单元测试，优先使用接口抽象。

###### 六、性能与线程安全验证

1. **线程安全测试**

```kotlin
import kotlin.concurrent.thread

object Counter {
    var count = 0
    fun increment() { count++ }
}

fun main() {
    repeat(1000) {
        thread { Counter.increment() }
    }
    Thread.sleep(1000)
    println(Counter.count) // 输出可能 <1000（需加锁）
}
```

**结论**：`object` 单例的初始化线程安全，但成员变量的修改仍需同步控制（如使用 `@Volatile` 或 `AtomicInteger`）。

###### 七、总结

|            **优势**            |           **注意事项**           |
| :----------------------------: | :------------------------------: |
| 语法简洁，一键声明线程安全单例 |       无法传递构造函数参数       |
|     原生支持接口实现和继承     |       避免滥用导致代码耦合       |
|    适用于轻量级全局状态管理    | 修改单例内部状态时需考虑线程安全 |

`Kotlin` 的 `object` 单例是快速实现轻量级全局访问点的最佳选择，但在复杂场景中需结合其他设计模式确保扩展性和可维护性。



##### () `Kotlin`中对象表达式

`Kotlin` 中的对象表达式允许您创建具有自定义行为和属性的匿名对象。当您需要创建一次性对象而不显式声明新的命名类时，它们非常有用。

对象表达式类似于 `Java` 中的匿名内部类，但提供更简洁的语法并支持函数式编程功能。

```kotlin
interface OnClickListener {
    fun onClick()
}

fun setOnClickListener(listener: OnClickListener) {
    // Implementation
}

fun main() {
    setOnClickListener(object : OnClickListener {
        override fun onClick() {
            println("Button clicked")
        }
    })
}
```

在示例中，我们使用单个方法“`onClick()`”定义接口“`OnClickListener`”。 `setOnClickListener` 函数接受此接口的实例。使用对象表达式，我们创建一个匿名对象

实现“`OnClickListener`”接口并提供“`onClick()`”方法的实现。

对象表达式允许我们即时创建一次性对象，使代码更加简洁和富有表现力。

**总结：`kotlin`中的对象表达式，就是为了兼容`java`中的函数式接口（只有一个方法的接口），不然老子（`kotlin`）早就想直接传入一个函数类型了。**

##### () 静态代码块，`kotlin`伴生对象

在 `Kotlin` 中，**没有直接的 `static` 关键字**，但可以通过以下方式实现类似 `Java` 的静态代码块和实例初始化块的逻辑：

###### 1. **实例初始化块：`init`**（类似 `Java` 的 `{}` ）

`Kotlin` 使用 `init` 代码块定义实例初始化逻辑，每次创建对象时都会执行（类似 `Java` 的 `{}` 实例代码块）。

```kotlin
class MyClass {
    // 实例初始化块
    init {
        println("对象初始化时执行")
    }
}
```

- **执行顺序**：在类属性初始化之后，次构造函数体之前执行。
- **多个 `init` 块**：按代码顺序执行。

###### 2. **静态初始化逻辑：伴生对象（`companion object`）**

`Kotlin` 的静态逻辑通过 `companion object` 实现，其 `init` 块类似 `Java` 的 `static {}` 静态代码块：

```kotlin
class MyClass {
    companion object {
        val myStaticField = 10 // kotlin 静态成员
        fun myStaticMethod() {
            // kotlin 静态方法实现
        }
        //kotlin  静态初始化块（类加载时执行一次）
        init {
            println("静态初始化逻辑")
        }
    }
}
```

- **执行时机**：当类首次被加载到 `JVM` 时执行（且仅一次）。
- **直接访问**：无需实例化对象即可触发（例如调用 `MyClass.Companion` 或访问任何伴生对象成员）。

###### 3. **对比 Java**

|     类型     |      `Java`      |              `Kotlin`               |
| :----------: | :--------------: | :---------------------------------: |
| 实例初始化块 |    `{ ... }`     |           `init { ... }`            |
|  静态代码块  | `static { ... }` | `companion object { init { ... } }` |

###### 4. **示例代码**

实例初始化 + 静态初始化

```kotlin
class Demo {
    init {
        println("实例初始化块") // 每次创建对象时执行
    }
    companion object {
        val myStaticField = 10 // kotlin 静态成员
        fun myStaticMethod() {
            // kotlin 静态方法实现
        }
        init {
            println("静态初始化块") // 类加载时执行一次
        }
    }
}

fun main() {
    Demo() // 输出: 静态初始化块 -> 实例初始化块
    Demo() // 输出: 实例初始化块（静态块不再执行）
}
```











#### [] `sealed` 密封类

`sealed`密封类表示 **受限的类继承结构**，所有子类必须在 **同一模块** 的 **相同文件** 或 **密封类内部** 声明（`Kotlin 1.5` 后允许子类分布在同模块的不同文件）。它允许您限制继承层次结构并定义一组封闭的可能子类，类似于枚举。

当您想要表示受限制的类型层次结构时，密封类非常有用，其中所有可能的子类都是预先已知的，并且应该在when表达式中进行详尽的处理。

###### (1) `sealed`密封类示例代码：

```kotlin
sealed class Result {
    data class Success(val data: String) : Result()
    data class Error(val message: String) : Result()
    object Loading : Result()
}

fun processResult(result: Result) {
    when (result) {
        is Result.Success -> {
            println("Success: ${result.data}")
        }
        is Result.Error -> {
            println("Error: ${result.message}")
        }
        Result.Loading -> {
            println("Loading...")
        }
    }
}
```



###### (2) `sealed`密封类和枚举类的区别

 **`sealed`密封类和枚举类对比整理表格**：

|       **特性**        |                  **密封类（Sealed Class）**                  |                   **枚举类（Enum Class）**                   |
| :-------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|     **定义方式**      |       `sealed class 类名 { ... }` （子类继承自密封类）       | `enum class 类名 { 常量1, 常量2, ... }` （常量是枚举类的实例） |
|     **实例数量**      | 子类可创建多个实例（如 `Success(data1)` 和 `Success(data2)`） |                每个枚举常量是单例（唯一实例）                |
|   **数据携带能力**    |         ✅ 子类可携带独立数据（如 `data class` 属性）         | ❌ 常量不能携带数据（但可通过属性定义统一字段，如 `enum class Direction(val angle: Int)`）（单例共享同一个属性） |
| **子类/常量定义位置** |        允许分布在同一模块的不同文件（`Kotlin 1.5+`）         |                 必须在枚举类内部定义所有常量                 |
|     **适用场景**      |   **类型可扩展**且需要不同数据（如 `API` 响应、复杂状态）    |     **固定类型集合**且无需数据扩展（如方向、星期、颜色）     |
|     **模式匹配**      |          `when` 表达式支持穷尽性检查（无需 `else`）          |      `when` 表达式需处理所有枚举常量或添加 `else` 分支       |
|     **单例支持**      | 可通过 `object` 声明单例子类（如 `object Loading : Result()`） |                    每个枚举常量天然是单例                    |
|    **继承与实现**     |                  子类可继承其他类或实现接口                  |             枚举常量不能继承其他类，但可实现接口             |
|     **内存占用**      |                     子类实例独立分配内存                     |         所有枚举常量在类加载时初始化（占用固定内存）         |

**`sealed`密封类和枚举类在内存上的区别**:

|   **特性**   |             **枚举类（`Enum Class`）**              |       **密封类（`Sealed Class`）**        |
| :----------: | :-------------------------------------------------: | :---------------------------------------: |
| **加载时机** |      类加载时静态初始化，所有常量在方法区分配       |   按需懒加载，子类实例在堆内存动态分配    |
| **内存占用** |             固定（所有常量常驻方法区）              |     动态（实例按需创建，堆内存分配）      |
| **回收条件** | 枚举类的生命周期与 `JVM` 一致，**几乎不会被卸载**。 |    实例随 `GC` 回收，与普通对象无区别     |
|  **单例性**  |               每个枚举常量是全局单例                | 子类实例可自由创建（除非手动设计为单例）  |
| **适用场景** |         固定常量集合（如状态码、类型标记）          | 动态类型扩展（如 `API` 响应、状态机分支） |

**总结选择策略**：

1. **用密封类**：
   - 需要 **灵活的类型扩展**（如不同错误类型、`UI` 状态）。
   - 需要 **不同子类携带不同数据**（如 `API` 成功响应带数据，错误响应带错误码）。
2. **用枚举类**：
   - 处理 **固定且有限的常量集合**（如方向、星期）。
   - 需要 **单例模式** 或 **统一行为方法**（如 `enum.常量.方法()`）。

 

#### [] `by` 关键字和委托

##### 一、委托模式的核心思想

**委托（`Delegation`）** 是一种设计模式，允许对象将部分职责 **委派** 给另一个辅助对象，从而替代继承实现代码复用。`Kotlin` 通过 `by` 关键字原生支持委托模式。

##### 二、类委托（`Class Delegation`）

###### 1. **使用场景**

当一个类需要实现某个接口，但希望将接口方法的 **具体实现委托给另一个对象** 时，避免直接继承带来的耦合。

###### 2. **语法与示例**

```kotlin
// 定义接口
interface Printer {
    fun print()
}

// 被委托类
class LaserPrinter : Printer {
    override fun print() {
        println("Laser printing...")
    }
}

// 委托类：将 Printer 接口的实现委托给 laserPrinter
class OfficePrinter(private val laserPrinter: LaserPrinter) : Printer by laserPrinter {
    // 可选择性覆盖部分方法
    override fun print() {
        println("OfficePrinter start")
        laserPrinter.print()
        println("OfficePrinter end")
    }
}

fun main() {
    val officePrinter = OfficePrinter(LaserPrinter())
    officePrinter.print()
}
```

**输出**：

```
OfficePrinter start
Laser printing...
OfficePrinter end
```

###### 3. **底层原理**

- 编译后的 `OfficePrinter` 会 **自动实现 `Printer` 接口**。
- 所有未重写的方法默认调用被委托对象（`laserPrinter`）的对应方法。

##### 三、属性委托（`Property Delegation`）

###### 1. **核心概念**

将属性的 **读取（`get`）** 和 **写入（`set`）** 操作委托给另一个对象（`Delegate`），实现逻辑复用。(代理模式？)

###### 2. **标准库提供的委托**

a. `lazy`：惰性初始化

```kotlin
val heavyData: String by lazy {
    println("Computing heavy data")
    "Initialized Value"
}

fun main() {
    println(heavyData) // 首次访问时初始化
    println(heavyData) // 直接返回缓存值
}
```

**输出**：

```
Computing heavy data
Initialized Value
Initialized Value
```

b. `Observable`：属性变化监听

```kotlin
import kotlin.properties.Delegates

var name: String by Delegates.observable("Unknown") { prop, old, new ->
    println("${prop.name} changed: $old -> $new")
}

fun main() {
    name = "Alice" // 输出：name changed: Unknown -> Alice
    name = "Bob"   // 输出：name changed: Alice -> Bob
}
```

c. `vetoable`：条件拦截

```kotlin
var age: Int by Delegates.vetoable(0) { _, old, new ->
    new >= 0 // 仅当新值 >=0 时更新
}

fun main() {
    age = -5
    println(age) // 输出 0（赋值被拒绝）
}
```

###### 3. **自定义属性委托**

委托类需实现 `ReadWriteProperty` 或 `ReadOnlyProperty` 接口：

```kotlin
class RangeDelegate(
    private var value: Int,
    private val min: Int,
    private val max: Int
) : ReadWriteProperty<Any?, Int> {

    override fun getValue(thisRef: Any?, property: KProperty<*>): Int {
        return value
    }

    override fun setValue(thisRef: Any?, property: KProperty<*>, newValue: Int) {
        if (newValue in min..max) {
            value = newValue
        } else {
            throw IllegalArgumentException("Value out of range")
        }
    }
}

// 使用
var temperature: Int by RangeDelegate(25, 0, 100)

fun main() {
    temperature = 50 // 正常
    temperature = 150 // 抛出异常
}
```

##### 四、`by` 关键字的作用

1. **类委托**：自动生成接口方法的委托调用。
2. **属性委托**：将属性的访问器逻辑绑定到委托对象。

##### 五、委托的优势与适用场景

|      **优势**      |                **适用场景**                |
| :----------------: | :----------------------------------------: |
| 替代继承，降低耦合 |             组合优于继承的设计             |
|    复用现有逻辑    | 多个类需要共享相同属性行为（如验证、日志） |
|    动态控制行为    |      运行时切换委托对象（如策略模式）      |
|    简化代码结构    |  减少样板代码（如观察者模式、惰性初始化）  |



#### [] `Inline Classes` 内联类

以下是 `Kotlin` 中 **内联类（`Inline Classes`）** 的详细解析，结合其设计目的、语法规则、使用场景和底层原理进行说明：

##### 一、`Inline Classes` 内联类的核心概念

内联类（`Kotlin 1.3+`）是一种 **轻量级类型包装器**，用于在不增加运行时性能开销的情况下，为值类型提供 **类型安全** 和 **领域语义**。内联类具有单个属性，它们在编译时进行优化，并从运行时表示中消除包装值。**PS**：内联类，顾名思义也就是将包装类内联到运行时代码中，在编译时保证类型安全。
**主要用途**：

1. **保证类型安全**：替代类型别名（`Type Alias`），提供更强的类型约束，避免原始类型（如 `Int`、`String`）的误用（**如混淆不同含义的 `id`**）。
2. **减少内存开销**：减少包装类（如 `data class`）的内存开销。

##### 二、`Inline Classes` 内联类基本语法

###### 1. **定义内联类**

使用 `value class` 关键字（需 `Kotlin 1.5+`）或 `inline class`（旧版，已弃用）：

```kotlin
@JvmInline
value class UserId(val id: Int)

@JvmInline
value class Email(val value: String)
```

###### 2. **使用示例**

```kotlin
fun getUserById(userId: UserId) { ... }

fun main() {
    val id = UserId(100)
    getUserById(id)   // ✅ 正确类型
    getUserById(100)  // ❌ 编译错误：类型不匹配
}
```

##### 三、`Inline Classes` 内联类主要特性

1. ###### **编译时类型安全，运行时无开销**

- **编译后**：内联类会被 **替换为基础类型**（如 `UserId` 变为 `Int`）。
- **运行时**：不生成包装类对象，避免内存分配。

2. ###### **限制条件**

- **单一属性**：主构造函数必须有且仅有一个 `val` 属性。
- **禁止继承**：不能继承其他类，也不能被继承（默认 `final`）。
- **有限成员**：可定义方法和扩展函数，但不能有 `init` 块或幕后字段（backing field）。

##### 四、`Inline Classes` 内联类底层原理

###### 1. **字节码反编译**

```java
@JvmInline
value class UserId(val id: Int)

// 编译后的 Java 代码
public final class UserId {
    // 字段定义为 final 无法修改
    private final int id; 
    // 构造函数中进行传参
    private UserId(int id) { this.id = id; }

    public static int constructor_impl(int id) { return id; }
    // 只有 get 没有 set
    public static final int getId_impl(int arg0) { return arg0; }

    // 其他方法...
}
```

###### 2. **运行时行为**

- **自动拆箱**：内联类在运行时直接使用基础类型，仅在需要时装箱（如存入集合）。
- 没有装箱：别看了

##### 五、`Inline Classes` 内联类应用场景

###### 1. **领域模型中的类型安全**

```kotlin
@JvmInline
value class ProductId(val id: Int)

@JvmInline
value class OrderId(val id: Int)

fun processOrder(orderId: OrderId) { ... }

// 避免误传参数
val productId = ProductId(100)
processOrder(productId) // ❌ 编译错误
```

###### 2. **带单位的量值**

```kotlin
@JvmInline
value class Seconds(val value: Int)

@JvmInline
value class Meters(val value: Int)

fun calculateSpeed(distance: Meters, time: Seconds): Double {
    return distance.value.toDouble() / time.value
}
```

###### 3. **状态或模式封装**

```kotlin
@JvmInline
value class DarkMode(val isEnabled: Boolean)

fun setTheme(darkMode: DarkMode) {
    if (darkMode.isEnabled) applyDarkTheme()
}
```

##### 六、`Inline Classes` 内联类对比其他方案

|        **方案**         |              **优点**               |                 **缺点**                  |
| :---------------------: | :---------------------------------: | :---------------------------------------: |
|         内联类          | 类型安全 + （自动拆箱）零运行时开销 |          功能受限（如不能继承）           |
| 数据类（`data class`）  |    功能完整（支持解构、继承等）     |     不具备拆箱，每个实例占用额外内存      |
| 类型别名（`typealias`） |          无开销，语法简洁           | 无类型安全（如 `typealias UserId = Int`） |

##### 七、`Inline Classes` 内联类进阶用法

###### 1. **实现接口**

内联类可以实现接口，增强功能：

```kotlin
interface Identifiable {
    val id: Int
}

@JvmInline
value class UserId(override val id: Int) : Identifiable

fun printId(identifiable: Identifiable) {
    println(identifiable.id)
}

fun main() {
    val userId = UserId(100)
    printId(userId) // 输出 100
}
```

###### 2. **结合泛型**

```kotlin
@JvmInline
value class Box<T>(val value: T)

fun main() {
    val intBox = Box(42)
    val strBox = Box("Kotlin")
}
```

##### 八、`Inline Classes` 内联类注意事项

1. **反射限制**：无法通过反射获取内联类的类型信息（如 `UserId::class`）（因为被内联了，运行时为基本数据类型，而不是包装类）。

2. **Java 互操作** ：在 Java 中视为基础类型，需通过静态方法访问成员：

   ```java
   // Java 调用内联类
   int id = UserId.constructor_impl(100);
   int rawId = UserId.getId_impl(id);
   ```

3. **自动类型推导**：部分场景需显式指定类型（如函数返回泛型时）。

##### 九、`Inline Classes` 内联类总结

|          **场景**          | **推荐方案** |
| :------------------------: | :----------: |
| 简单值类型包装，需类型安全 |    内联类    |
| 复杂数据模型，需继承或扩展 |    数据类    |
|  仅需类型别名，无安全要求  |   类型别名   |

内联类是 `Kotlin` 在类型安全和性能之间找到的优雅平衡，尤其适合高频使用的轻量级类型封装。
