# 第4节、java反射

##### （）说一下反射，反射会影响性能吗?

JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法;对于任意一个对象，都能够调用它的任意一个方法和属性;这种动态获取的信息以及动态调用对象的方法的功能称为 java语言的反射机制。反射这种运行时动态的功能可以说是非常重要的,可以说无反射不框架!!!,反射方式实例化对象和,属性赋值和调用方法肯定比直接的慢,但是程序运行的快慢原因有很多,不能主要归于反射，如果你只是偶尔调用一下反射，反射的影响可以忽略不计,如果你需要大量调用反射,会产生一些影响,适当考虑减少使用或者使用缓存,你的编程的思想才是限制你程序性能的最主要的因素。

**扩展：很多框架，例如 retrofit 和 Room 也都使用了反射，反射是一些框架的主要技术，没有反射将无法实现这些框架。反射通常和注解一起使用，注解标注数据，再用反射获取。这些框架都极大的降低了模块间的耦合度，提高了编程的效率，从某种程度上说，是用一部分性能换取了编写效率。**

##### 什么是反射？

Java 反射机制是在运行状态中，对于任意一个类，都能够知道这个类中的所有属性和方法，对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的方法的功能称为 Java 语言的反射机制。

反射具有以下特性：

1. **运行时类信息访问**：反射机制允许程序在运行时获取类的完整结构信息，包括类名、包名、父类、实现的接口、构造函数、方法和字段等。
2. **动态对象创建**：可以使用反射API动态地创建对象实例，即使在编译时不知道具体的类名。这是通过Class类的newInstance()方法或Constructor对象的newInstance()方法实现的。
3. **动态方法调用**：可以在运行时动态地调用对象的方法，包括私有方法。这通过Method类的invoke()方法实现，允许你传入对象实例和参数值来执行方法。
4. **访问和修改字段值**：反射还允许程序在运行时访问和修改对象的字段值，即使是私有的。这是通过Field类的get()和set()方法完成的。

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1718957173277-863d2ec6-a754-423b-9066-9f28610d1a31.png)

> [!IMPORTANT]
>
> 在类加载的时候，类加载器将类的元信息加载到方法区中，比如变量名和注解等信息。而对象的数据则存在堆里边。
>
> 通常，程序编译完，我们是看不到变量名的，他们在内存中只是一个个地址。而反射则可以获取这些信息，包括变量名，以及方法名称。

> [!NOTE]
>
> 再扩展：通过反射可以获取变量名，故String设计成了final类，一旦赋值将不可二次更改。
>
> 

##### [#](https://xiaolincoding.com/interview/java.html#反射在你平时写代码或者框架中的应用场景有哪些)反射在你平时写代码或者框架中的应用场景有哪些?

###### 1. 加载数据库驱动  JDBC 

我们的项目底层数据库有时是用mysql，有时用oracle，需要动态地根据实际情况加载驱动类，这个时候反射就有用了，假设 com.mikechen.java.myqlConnection，com.mikechen.java.oracleConnection这两个类我们要用。

这时候我们在使用 JDBC 连接数据库时使用 Class.forName()通过反射加载数据库的驱动程序，如果是mysql则传入mysql的驱动类，而如果是oracle则传入的参数就变成另一个了。

```java
//  DriverManager.registerDriver(new com.mysql.cj.jdbc.Driver());
Class.forName("com.mysql.cj.jdbc.Driver");
```

> 

###### 2.配置文件加载 （Spring 框架）

Spring 框架的 IOC（动态加载管理 Bean），Spring通过配置文件配置各种各样的bean，你需要用到哪些bean就配哪些，spring容器就会根据你的需求去动态加载，你的程序就能健壮地运行。

Spring通过XML配置模式装载Bean的过程：

- 将程序中所有XML或properties配置文件加载入内存
- Java类里面解析xml或者properties里面的内容，得到对应实体类的字节码字符串以及相关的属性信息
- 使用反射机制，根据这个字符串获得某个类的Class实例
- 动态配置实例的属性

配置文件

```java
className=com.example.reflectdemo.TestInvoke
methodName=printlnState
```

实体类

```java
public class TestInvoke {
    private void printlnState(){
        System.out.println("I am fine");
    }
}
```

解析配置文件内容

```java
// 解析xml或properties里面的内容，得到对应实体类的字节码字符串以及属性信息
public static String getName(String key) throws IOException {
    Properties properties = new Properties();
    FileInputStream in = new FileInputStream("D:\IdeaProjects\AllDemos\language-specification\src\main\resources\application.properties");
    properties.load(in);
    in.close();
    return properties.getProperty(key);
}
```

利用反射获取实体类的Class实例，创建实体类的实例对象，调用方法

```java
public static void main(String[] args) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException, IOException, ClassNotFoundException, InstantiationException {
    // 使用反射机制，根据这个字符串获得Class对象
    Class<?> c = Class.forName(getName("className"));
    System.out.println(c.getSimpleName());
    // 获取方法
    Method method = c.getDeclaredMethod(getName("methodName"));
    // 绕过安全检查
    method.setAccessible(true);
    // 创建实例对象
    TestInvoke testInvoke = (TestInvoke)c.newInstance();
    // 调用方法
    method.invoke(testInvoke);

}
```

运行结果：

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1718786675327-3a60bcc7-2f70-4096-998e-d6e94f5df6a4.png)

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1718786675327-3a60bcc7-2f70-4096-998e-d6e94f5df6a4.png)



###### 3. （某些json串的解析框架）

- **用途**：Gson 是一个用于 JSON 序列化和反序列化的库。

- **反射的使用**：

  - Gson 使用反射来读取对象的字段并将其转换为 JSON 字符串。
  - 在反序列化时，Gson 通过反射将 JSON 数据映射到 Java 对象的字段。

- **示例**：

  ```java
  public class User {
      private String name;
      private int age;
      // Getters and setters
  }
  
  ObjectMapper mapper = new ObjectMapper();
  String json = mapper.writeValueAsString(new User("John", 25)); // 序列化
  User user = mapper.readValue(json, User.class); // 反序列化
  ```

> [!NOTE]
>
> 某些json串的解析框架使用了反射来解析json串。简单来说，json串中的属性和值，对应javaBean中的属性和值，但是字段名称不确定，值也不确定，只有通过反射的方式获取到字段的名称，然后再进行赋值。

###### **4. JUnit**

- **用途**：JUnit 是一个单元测试框架。

- **反射的使用**：

  - JUnit 使用反射来动态发现和运行测试方法。
  - 例如，JUnit 通过反射调用带有 `@Test` 注解的方法。

- **示例**：

  ```java
  public class MyTest {
      @Test
      public void testMethod() {
          Assert.assertEquals(1, 1);
      }
  }
  ```



###### **5. Retrofit**  TODO  划重点，这一部分一定要熟悉源码，讲清除

- **用途**：Retrofit 是一个用于网络请求的库。

- **反射的使用**：

  - Retrofit 使用反射来解析接口方法上的注解（如 `@GET`、`@POST`），并动态生成网络请求的实现。

- **示例**：

  ```java
  public interface ApiService {
      @GET("users/{id}")
      Call<User> getUser(@Path("id") int id);
  }
  
  Retrofit retrofit = new Retrofit.Builder()
      .baseUrl("https://api.example.com/")
      .build();
  ApiService service = retrofit.create(ApiService.class); // 反射生成实现
  ```

> [!CAUTION]
>
> 后续在安卓篇对 Retrofit  进行深入探讨

###### 6. Butterknife

**Butterknife 为什么没有性能问题**

源码开始解析之前，我们先来了解一下Butterknife的核心原理。在[夯实基础：Java的注解](https://www.jianshu.com/p/039f4329bb35)中我们提到过注解的保留期。

- 源码时注解(SOURCE)：仅保留在源码阶段，在编译期就会被丢弃，一般是编译器来解析相关注解
- 编译器注解(CLASS)：保留在编译阶段，在类的加载阶段会被丢弃，一般使用**APT**技术来解析
- 运行时注解(RUNTIME)：全程保留，从源码到App运行过程中，一般使用**反射**来解析

了解了前面的知识，我们就可以知道Butterknife肯定不是用反射来解析注解的，因为反射的效率比较低，也不是通过编译器来解析的，如果是这样的话，压根也就没有了Butterknife这个库了。Butterknife是用APT技术来解析注解的，APT的全称是Android Annotation Processor Tool，Android注解解析工具。它是在**编译期阶段**来解析注解并生成对应的代码，然后在使用的时候再去调生成的代码，这样就跟我们自己写好的代码自己调用一下，不会产生任何性能问题，并且会减少大量的模板类代码。（关注APT技术的详解我会在下一篇手撸Butterknife给大家详细介绍）

