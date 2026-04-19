# 第8节、java异常与日志

##### 介绍一下Java异常

Java异常类层次结构图：

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1720683900898-1d0ce69d-4b5d-41a6-a5df-022e42f8f4c5.webp)



Java的异常体系主要基于两大类：Throwable类及其子类。Throwable有两个重要的子类：Error和Exception，它们分别代表了不同类型的异常情况。

1. **Error（错误）**：表示运行时环境的错误。错误是程序无法处理的严重问题，如系统崩溃、虚拟机错误、动态链接失败等。通常，程序不应该尝试捕获这类错误。例如，OutOfMemoryError、StackOverflowError等。
2. **Exception（异常）**：表示程序本身可以处理的异常条件。异常分为两大类：
   - **非运行时异常**（必须检查）：这类异常在编译时期就必须被捕获或者声明抛出。它们通常是外部错误，如文件不存在（FileNotFoundException）、类未找到（ClassNotFoundException）等。非运行时异常强制程序员处理这些可能出现的问题，增强了程序的健壮性。
   - **运行时异常**（不必检查）：这类异常包括运行时异常（RuntimeException）和错误（Error）。运行时异常由程序错误导致，如空指针访问（NullPointerException）、数组越界（ArrayIndexOutOfBoundsException）等。运行时异常是不需要在编译时强制捕获或声明的。

##### [#](https://xiaolincoding.com/interview/java.html#java异常处理有哪些)Java异常处理有哪些？

异常处理是通过使用try-catch语句块来捕获和处理异常。以下是Java中常用的异常处理方式：

- try-catch语句块：用于捕获并处理可能抛出的异常。try块中包含可能抛出异常的代码，catch块用于捕获并处理特定类型的异常。可以有多个catch块来处理不同类型的异常。

```java
try {
    // 可能抛出异常的代码
} catch (ExceptionType1 e1) {
    // 处理异常类型1的逻辑
} catch (ExceptionType2 e2) {
    // 处理异常类型2的逻辑
} catch (ExceptionType3 e3) {
    // 处理异常类型3的逻辑
} finally {
    // 可选的finally块，用于定义无论是否发生异常都会执行的代码
}
```

- throw语句：用于手动抛出异常。可以根据需要在代码中使用throw语句主动抛出特定类型的异常。

```text
throw new ExceptionType("Exception message");
```

- throws关键字：用于在方法声明中声明可能抛出的异常类型。如果一个方法可能抛出异常，但不想在方法内部进行处理，可以使用throws关键字将异常传递给调用者来处理。

```java
public void methodName() throws ExceptionType {
    // 方法体
}
```

- finally块：用于定义无论是否发生异常都会执行的代码块。通常用于释放资源，确保资源的正确关闭。

```java
try {
    // 可能抛出异常的代码
} catch (ExceptionType e) {
    // 处理异常的逻辑
} finally {
    // 无论是否发生异常，都会执行的代码
}
```

##### [#](https://xiaolincoding.com/interview/java.html#抛出异常为什么不用throws)抛出异常为什么不用throws？

如果异常是未检查异常或者在方法内部被捕获和处理了，那么就不需要使用throws。

- **Unchecked Exceptions**：未检查异常（unchecked exceptions）是继承自RuntimeException类或Error类的异常，编译器不强制要求进行异常处理。因此，对于这些异常，不需要在方法签名中使用throws来声明。示例包括NullPointerException、ArrayIndexOutOfBoundsException等。
- **捕获和处理异常**：另一种常见情况是，在方法内部捕获了可能抛出的异常，并在方法内部处理它们，而不是通过throws子句将它们传递到调用者。这种情况下，方法可以处理异常而无需在方法签名中使用throws。

##### [#](https://xiaolincoding.com/interview/java.html#try-catch中的语句运行情况)try catch中的语句运行情况

try块中的代码将按顺序执行，如果抛出异常，将在catch块中进行匹配和处理，然后程序将继续执行catch块之后的代码。如果没有匹配的catch块，异常将被传递给上一层调用的方法。

##### [#](https://xiaolincoding.com/interview/java.html#try-return-a-fianlly-return-b-这条语句返回啥)try{return “a”} fianlly{return “b”}这条语句返回啥

```java
try{
    return “a”
} 
fianlly{
    return “b”
}
```



finally块中的return语句会覆盖try块中的return返回，因此，该语句将返回"b"。

> [!WARNING]
>
> 不要在 finally 语句中返回。finally 在return表达式之后运行，程序将返回值暂存了起来。待 finally  语句结束后返回。故不要在 finally  中使用return语句。

扩展：

##### 

```java
public void func(){
    int temp = 1000;
	try{
        temp = temp + 1 ;
    	return temp ;
	} 
	fianlly{
        temp = temp - 1 ;
	}
}

```

以上这段代码，实际上返回 1001 ,而不是 999 ；因为在try语句中，已经将返回值暂存了。

