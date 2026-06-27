# 第5节、java注解

##### （）能讲一讲Java注解的原理吗？

注解本质是一个继承了Annotation的特殊接口，其具体实现类是Java运行时生成的动态代理类。

我们通过反射获取注解时，返回的是Java运行时生成的动态代理对象。通过代理对象调用自定义注解的方法，会最终调用AnnotationInvocationHandler的invoke方法。该方法会从memberValues这个Map中索引出对应的值。而memberValues的来源是Java常量池。

##### （）注解的保留策略

@ Retention用来定义该注解在哪一个级别可用，在源代码中(SOURCE)、类文件中(CLASS)或者运行时(RUNTIME)。

###### @Retention 源码：

```java
@Documented@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Retention {
  RetentionPolicy value();
}
// RetentionPolicy 是一个枚举类型，它定义了被 @Retention 修饰的注解所支持的保留级别
public enum RetentionPolicy {
  // 此注解类型的信息只会记录在源文件中，编译时将被编译器丢弃，也就是说不会保存在编译好的类信息中
  // 一般是 '编译器' 来解析相关注解
  SOURCE,
  //编译器将注解记录在类文件中，在类的加载阶段会被丢弃，但不会加载到JVM中。如果一个注解声明没指定范围，则系统默认值就是Class
  //反射无法调用，如 Butterknife 就是采用了该策略，并使用编译期代码生成。
  CLASS,
  //注解信息会保留在源文件、类文件中，在执行的时也加载到Java的JVM中，因此可以反射性的读取。
  RUNTIME
}
```

- 源码时注解(SOURCE)：仅保留在源码阶段，在编译期就会被丢弃，一般是编译器来解析相关注解。
- 编译器注解(CLASS)：保留在编译阶段，在类的加载阶段会被丢弃，一般使用**APT**技术来解析。反射无法调用，如 Butterknife 就是采用了该策略，并使用编译期代码生成。
- 运行时注解(RUNTIME)：全程保留，从源码到App运行过程中，一般使用**反射**来解析。例如retrofit 。

复习一下，JVM的内存结构

![image-20240725230247664](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20240725230247664.png)

###### Retrofit  示例：

Retrofit 是一个用于 Android 和 Java 的类型安全的 HTTP 客户端库，它通过注解来定义 HTTP 请求的细节。以下是一些常用的 Retrofit 注解及其源码的简要说明：

1. **@GET**: 用于定义一个 GET 请求。

   java

   复制

   ```java
   @Documented
   @Target(METHOD)
   @Retention(RUNTIME)
   public @interface GET {
       String value() default "";
   }
   ```

2. **@POST**: 用于定义一个 POST 请求。

   java

   复制

   ```java
   @Documented
   @Target(METHOD)
   @Retention(RUNTIME)
   public @interface POST {
       String value() default "";
   }
   ```

Retrofit 的注解是运行时注解，故源码采用反射获取接口方法。

###### ButterKnife示例

**ButterKnife使用的是编译时注解**



```java
// ButterKnife 源码	
@Rentention(RetentionPolicy.CLASS)
	@Target(FIELD)
	public @interface BindView{
		@IdRes int value() ;
	}
```



##### （）注解的作用域

```java
@Target：指定被修饰的Annotation可以放置的位置(被修饰的目标)
@Target(ElementType.TYPE)                      //接口、类
@Target(ElementType.FIELD)                     //属性
@Target(ElementType.METHOD)                    //方法
@Target(ElementType.PARAMETER)                 //方法参数
@Target(ElementType.CONSTRUCTOR)               //构造函数
@Target(ElementType.LOCAL_VARIABLE)            //局部变量
@Target(ElementType.ANNOTATION_TYPE)           //注解
@Target(ElementType.PACKAGE)                   //包
注：可以指定多个位置，例如：
@Target({ElementType.METHOD, ElementType.TYPE})，也就是此注解可以在方法和类上面使用
    
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface Target {
    ElementType[] value();
}
```

ElementType 是一个枚举类型，它定义了被 @Target 修饰的注解可以应用的范围

##### （）注解为什么设计成使用编译时常量？

注解的设计考量

1. **编译时处理需求**
   注解的解析通常由编译器或编译时工具（如APT、注解处理器）完成。例如，`@Override`在编译时检查方法重写，`@Deprecated`生成警告。若允许运行时常量，编译器无法在编译阶段确定注解参数的值，导致元数据不完整或处理失败。
2. **元数据的稳定性**
   注解常用于生成代码、配置框架或传递静态信息（如`@RequestMapping("/path")`）。这些信息需要在编译后持久化到字节码中，供运行时反射或其他工具使用。编译时常量确保元数据在类加载时已确定，避免运行时计算的不可预测性。
3. **简化设计**
   若允许运行时常量，注解需支持动态表达式求值，这会增加编译器复杂性，且与注解作为静态元数据的初衷相悖。



##### （）编译时注解源码分析

3.1.定义编译时注解

###### **1.注解**

```java
	@Rentention(RetentionPolicy.CLASS)
	public @interface Man {
		String name() default "霍华德";
		int age() default 23;
	}
12345
```

###### **2.编译时注解处理器**

```java
public class ClaaProcessor extends AbstractProcessor{
	@override
	public synchronized void init(ProcessingEnvironment var1) {
        //注解工具初始化，ProcessingEnvironment提供很多工具类，如
        //Elements、Types、Filer、Messager、SourceVersion
    }
    @override
    public boolean process(Set<? extends TypeElement> var1, RoundEnvironment var2){
    	//每个处理器的主函数，编写扫描处理注解的代码，以及生成Java文件。入参RoundEnviroument，可查询包含指定注解的被注解元素。
		...
		return true;
	}
	
	@override
	public SourceVersion getSupportedSourceVersion() {
	//指定使用的Java版本
		return SourceVersion.latestSupported();
	}

	@override
	public Set<String> getSupportedAnnotationTypes() {
	//指定该注解处理器是注册给哪个注解的，返回值是字符串集合，包含注解类型的全称。
		Set<String> annotations = new LinkedHashSet<String>();
		annotations.add(BindView.class.getCannonicalName());
		return annotations;
	}
}
123456789101112131415161718192021222324252627
```

###### **3.注册注解处理器**

可以使用Google开源的AutoService进行注册，依赖中导入

```java
	dependencies {
		implementation 'com.google.auto.service:auto-service:1.0-rc2'
	}
123
```

使用：

```java
@AutoService(Processor.class)
public class ClaaProcessor extends AbstractProcessor{
	...
} 
```
