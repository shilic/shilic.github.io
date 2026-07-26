# 第2节、java面向对象

### 2.1  面向对象

##### （）重载与重写的区别

重写（也称覆写）：重写父类，方法名、参数列表、返回值均相同。

> [!CAUTION]
>
> 重写的访问权限不可以低于父类（如父类一个方法是 protect ，则子类必须是public或者protect）（破坏了封装性）
>
> 返回值必须可以向上转型为父类方法的返回值。
>
> 参数范围必须大于父类的参数范围，因为父类代码已经在其他地方使用了，如果小于，那么子类方法将无法处理这些数据。
>
> **总结就是：父类的参数，子类必须可以用。子类的返回值，必须包含在父类的返回值中。**
>
> 异常同样需要可以向上转型。
>
> **必须加@Override ，否则在不同包中可能因为包可见性的问题无法识别为覆写。**

> [!NOTE]
>
> 静态方法不存在覆写，因为是类名调用。

重载：同一个类中，相同方法名，不同参数列表（顺序不同也可以）（强制）。返回值没有要求（不强制），但不能通过方法返回值来确定重载。





##### [#](https://xiaolincoding.com/interview/java.html#怎么理解面向对象-简单说说封装继承多态)怎么理解面向对象？简单说说封装继承多态

面向对象是一种编程范式，它**将现实世界中的事物抽象为对象**，对象具有属性（称为字段或属性）和行为（称为方法）。面向对象编程的设计思想是以对象为中心，通过对象之间的交互来完成程序的功能，具有灵活性和可扩展性，通过封装和继承可以更好地应对需求变化。

Java面向对象的三大特性包括：**封装、继承、多态**：

- **封装**：封装是指将对象的属性（数据）和行为（方法）结合在一起，对外隐藏对象的内部细节，仅通过对象提供的接口与外界交互。封装的目的是增强安全性和简化编程，使得对象更加独立。
- **继承**：继承是一种可以使得子类自动共享父类数据结构和方法的机制。它是代码复用的重要手段，通过继承可以建立类与类之间的层次关系，使得结构更加清晰。**例如继承View类，实现自定义视图。**
- **多态**：多态是指允许不同类的对象对同一消息作出响应。即同一个接口，使用不同的实例而执行不同操作。多态性可以分为编译时多态（重载）和运行时多态（重写）。它使得程序具有良好的灵活性和扩展性。**例如实现了 OnclickEvent接口，面对同一个接口，就可以在点击时实现不同的操作，也就是多态。**

> [!TIP]
>
> 建议按自己的理解来。另外：kotlin参数的多态



##### [#](https://xiaolincoding.com/interview/java.html#多态体现在哪几个方面)多态体现在哪几个方面？

多态在面向对象编程中可以体现在以下几个方面：

- 方法重载：
  - 方法重载是指同一类中可以有多个同名方法，它们具有不同的参数列表（参数类型、数量或顺序不同）。虽然方法名相同，但根据传入的参数不同，编译器会在编译时确定调用哪个方法。
  - 示例：对于一个 `add` 方法，可以定义为 `add(int a, int b)` 和 `add(double a, double b)`。
- 方法重写：
  - 方法重写是指子类能够提供对父类中同名方法的具体实现。在运行时，JVM会根据对象的实际类型确定调用哪个版本的方法。这是实现多态的主要方式。
  - 示例：在一个动物类中，定义一个 `sound` 方法，子类 `Dog` 可以重写该方法以实现 `bark`，而 `Cat` 可以实现 `meow`。
  - **或者谈自定义view**
- 接口与实现：
  - 多态也体现在接口的使用上，多个类可以实现同一个接口，并且用接口类型的引用来调用这些类的方法。这使得程序在面对不同具体实现时保持一贯的调用方式。
  - 例如 **onClickListener()** 接口，例如序列化接口，在传入安卓的 Bundle 时，对象需要序列化 ，同样是序列化，不同的对象反序列化结果不一样。
  - 示例：多个类（如 `Dog`, `Cat`）都实现了一个 `Animal` 接口，当用 `Animal` 类型的引用来调用 `makeSound` 方法时，会触发对应的实现。
- 向上转型和向下转型：
  - 在Java中，可以使用父类类型的引用指向子类对象，这是向上转型。通过这种方式，可以在运行时期采用不同的子类实现。
  - 向下转型是将父类引用转回其子类类型，但在执行前需要确认引用实际指向的对象类型以避免 `ClassCastException`。

- [ ] 在kotlin中，还多一个参数的多态，kotlin可以传入函数

##### [#](https://xiaolincoding.com/interview/java.html#多态解决了什么问题)多态解决了什么问题？

多态是指子类可以替换父类，在实际的代码运行过程中，调用子类的方法实现。多态这种特性也需要编程语言提供特殊的语法机制来实现，比如继承、接口类。

多态可以提高代码的扩展性和复用性，是很多设计模式、设计原则、编程技巧的代码实现基础。比如策略模式、基于接口而非实现编程、依赖倒置原则、里式替换原则、利用多态去掉冗长的 if-else 语句等等

##### [#](https://xiaolincoding.com/interview/java.html#面向对象的设计原则你知道有哪些吗)面向对象的设计原则你知道有哪些吗

面向对象编程中的六大原则：

- **单一职责原则（SRP）**：一个类应该只有一个引起它变化的原因，即一个类应该只负责一项职责。例子：考虑一个员工类，它应该只负责管理员工信息，而不应负责其他无关工作。**例如，用于接收`json`串数据的`javaBean`，就不应该做其他多余的操作，只保留基本的数据结构。以及`kotlin`中的数据类，也是一样的。**例如安卓的**`AsyhcTask`就不符合单一职责原则**，既绘制页面，又负责子线程的任务处理。**以前传统的MVC架构**，Activity就是那个C，也就是控制器，它会同时负责页面的布局绘制，也会负责数据的处理。耦合度很高，有了jetpack之后，Activity只负责页面，数据的处理交给ViewModel和LiveData来做。
- **开放封闭原则（OCP）**：软件实体应该对扩展开放，对修改封闭。例子：通过制定接口来实现这一原则，比如定义一个图形类，然后让不同类型的图形继承这个类，而不需要修改图形类本身。 **例如，你要自定义一个组件的时候，需要继承View或者ViewGroup实现扩展，而不是直接修改他们的代码。**对修改是封闭的。同样的，**在`kotlin`中**，默认所有类都是final（与之对应的是open），即不可被继承，如果需要扩展则使用kotlin中的扩展函数。
- **里氏替换原则（LSP）**：子类对象应该能够替换掉所有父类对象。例子：一个正方形是一个矩形，但如果修改一个矩形的高度和宽度时，正方形的行为应该如何改变就是一个违反里氏替换原则的例子。**例如，**子类继承了一个抽象类，抽象方法允许子类覆写，而覆写非抽象方法则需要小心，具体为参数和返回值的规定。例如，父类方法的参数范围为0到60，而子类方法覆写后的参数范围为10到25，那么其他地方在调用这个方法的时候，会向下找到子类的实现，那么参数就会出现异常，例如传入0，而子类则出错。**父类的参数，子类必须可以用。子类的返回值，必须包含在父类的返回值中。****故kotlin中**，默认类都是不可继承的，方法也默认不可重写。**Fragment 模板方法模式**，父类抽象一个方法给子类使用，不抽象的方法不允许覆写。
- **接口隔离原则（ISP）**：客户端不应该依赖那些它不需要的接口，即接口应该小而专。例子：通过接口抽象层来实现底层和高层模块之间的解耦，比如使用依赖注入。**例如比如View.OnClickListener只包含一个onClickEvent() 方法，runnable只有一个run方法。**例如克隆接口也只有一个克隆方法（虽然不太准确）。
- **依赖倒置原则（DIP）**：高层模块不应该依赖低层模块，二者都应该依赖于抽象；**抽象不应该依赖于细节，细节应该依赖于抽象**。例如，高层模块的业务逻辑直接使用SQLiteOpenHelper 则不符合，因为高层依赖具体实现。而Room框架通过DAO接口解耦数据库操作，符合依赖倒置，高层和低层都依赖于抽象。

用人话来讲，就是将业务逻辑中最关键的变化点抽象出来，然后聚集在一起，形成一个统一的接口，例如Room，把数据访问全部放到Dao里，高层使用接口，而低层实现接口。

- **最少知识原则 (Law of Demete**r)**迪米特法则**：一个对象应当对其他对象有最少的了解，只与其直接的朋友交互。例如从工厂模式到策略模式，就是将工厂生产出来的产品又进行了一步封装，使用模块只需要和工厂或者策略管理器进行关联，减少了关联。
- **合成复用原则（CRP）**：优先使用组合（Composition），而非继承（Inheritance）。



##### [#](https://xiaolincoding.com/interview/java.html#重载与重写有什么区别)重载与重写有什么区别？

- 重载（Overloading）指的是在同一个类中，可以有多个同名方法，它们具有不同的参数列表（参数类型、参数个数或参数顺序不同），编译器根据调用时的参数类型来决定调用哪个方法。
- 重写（Overriding）指的是子类可以重新定义父类中的方法，方法名、参数列表和返回类型必须与父类中的方法一致，通过@override注解来明确表示这是对父类方法的重写。

重载是指在同一个类中定义多个同名方法，而重写是指子类重新定义父类中的方法。

##### [#](https://xiaolincoding.com/interview/java.html#抽象类和普通类区别)抽象类和普通类区别？

- 实例化：普通类可以直接实例化对象，而抽象类不能被实例化，只能被继承。
- 方法实现：普通类中的方法可以有具体的实现，而抽象类中的方法可以有实现也可以没有实现。
- 继承：一个类可以继承一个普通类，而且可以继承多个接口；**而一个抽象类只能继承一个类**（），但可以同时实现多个接口。
- 实现限制：普通类可以被其他类继承和使用，而抽象类一般用于作为基类，被其他类继承和扩展使用。

例如 `AbstractList<E> `

##### [#](https://xiaolincoding.com/interview/java.html#抽象类能加final修饰吗)抽象类能加final修饰吗？

**不能**，Java中的抽象类是用来被继承的，而final修饰符用于禁止类被继承或方法被重写，因此，抽象类和final修饰符是互斥的，不能同时使用。

##### [#](https://xiaolincoding.com/interview/java.html#抽象类可以被实例化吗)抽象类可以被实例化吗？

在Java中，抽象类本身不能被实例化。

这意味着不能使用`new`关键字直接创建一个抽象类的对象。抽象类的存在主要是为了被继承，它通常包含一个或多个抽象方法（由`abstract`关键字修饰且无方法体的方法），这些方法需要在子类中被实现。

抽象类可以有构造器，这些构造器在子类实例化时会被调用，以便进行必要的初始化工作。然而，这个过程并不是直接实例化抽象类，而是创建了子类的实例，间接地使用了抽象类的构造器。

例如：

```java
public abstract class AbstractClass {
    public AbstractClass() {
        // 构造器代码
    }
    
    public abstract void abstractMethod();
}

public class ConcreteClass extends AbstractClass {
    public ConcreteClass() {
        super(); // 调用抽象类的构造器
    }
    
    @Override
    public void abstractMethod() {
        // 实现抽象方法
    }
}

// 下面的代码可以运行
ConcreteClass obj = new ConcreteClass();
```

在这个例子中，`ConcreteClass`继承了`AbstractClass`并实现了抽象方法`abstractMethod()`。当我们创建`ConcreteClass`的实例时，`AbstractClass`的构造器被调用，但这并不意味着`AbstractClass`被实例化；实际上，我们创建的是`ConcreteClass`的一个对象。

简而言之，抽象类不能直接实例化，但通过继承抽象类并实现所有抽象方法的子类是可以被实例化的。



##### [#](https://xiaolincoding.com/interview/java.html#解释java中的静态变量和静态方法)解释Java中的静态变量和静态方法

在Java中，静态变量和静态方法是与类本身关联的，而不是与类的实例（对象）关联。它们在内存中只存在一份，可以被类的所有实例共享。

> 静态变量

静态变量（也称为类变量）是在类中使用`static`关键字声明的变量。它们属于类而不是任何具体的对象。主要的特点：

- **共享性**：所有该类的实例共享同一个静态变量。如果一个实例修改了静态变量的值，其他实例也会看到这个更改。
- **初始化**：静态变量在类被加载时初始化，只会对其进行一次分配内存。
- **访问方式**：静态变量可以直接通过类名访问，也可以通过实例访问，但推荐使用类名。

示例：

```java
public class MyClass {
    static int staticVar = 0; // 静态变量

    public MyClass() {
        staticVar++; // 每创建一个对象，静态变量自增
    }
    
    public static void printStaticVar() {
        System.out.println("Static Var: " + staticVar);
    }
}

// 使用示例
MyClass obj1 = new MyClass();
MyClass obj2 = new MyClass();
MyClass.printStaticVar(); // 输出 Static Var: 2
```

> 静态方法

静态方法是在类中使用`static`关键字声明的方法。类似于静态变量，静态方法也属于类，而不是任何具体的对象。主要的特点：

- **无实例依赖**：静态方法可以在没有创建类实例的情况下调用。对于静态方法来说，不能直接访问非静态的成员变量或方法，因为静态方法没有上下文的实例。
- **访问静态成员**：静态方法可以直接调用其他静态变量和静态方法，但不能直接访问非静态成员。
- **多态性**：静态方法不支持重写（Override），但可以被隐藏（Hide）。

```text
public class MyClass {
    static int count = 0;

    // 静态方法
    public static void incrementCount() {
        count++;
    }

    public static void displayCount() {
        System.out.println("Count: " + count);
    }
}

// 使用示例
MyClass.incrementCount(); // 调用静态方法
MyClass.displayCount();   // 输出 Count: 1
```

> 使用场景

- **静态变量**：常用于需要在所有对象间共享的数据，如计数器、常量等。
- **静态方法**：常用于助手方法（utility methods）、获取类级别的信息或者是没有依赖于实例的数据处理。

- [ ] 

##### [#](https://xiaolincoding.com/interview/java.html#有一个父类和子类-都有静态的成员变量、静态构造方法和静态方法-在我new一个子类对象的时候-加载顺序是怎么样的)有一个父类和子类，都有静态的成员变量、静态构造方法和静态方法，在我new一个子类对象的时候，加载顺序是怎么样的？

当你实例化一个子类对象时，静态成员变量、静态构造方法和静态方法的加载顺序遵循以下步骤：

- 在创建子类对象之前，首先会加载父类的静态成员变量和静态代码块（构造方法无法被 `static` 修饰，因此这里是静态代码块）。这个加载是在类首次被加载时进行的，且只会发生一次。
- 接下来，加载子类的静态成员变量和静态代码块。这一过程也只发生一次，即当首次使用子类的相关代码时。
- 之后，执行实例化子类对象的过程。这时会呼叫父类构造方法，然后是子类的构造方法。

具体加载顺序可以简要总结为：

- **父类静态成员变量、静态代码块**（如果有）
- **子类静态成员变量、静态代码块**（如果有）
- **父类构造方法**（实例化对象时）
- **子类构造方法**（实例化对象时）

示例代码

```java
class Parent {
    static {
        System.out.println("Parent static block");
    }
    static int parentStaticVar = 10;

    Parent() {
        System.out.println("Parent constructor");
    }
}

class Child extends Parent {
    static {
        System.out.println("Child static block");
    }
    static int childStaticVar = 20;

    Child() {
        System.out.println("Child constructor");
    }
}

public class Main {
    public static void main(String[] args) {
        Child c = new Child();
    }
}
```

输出结果

```java
Parent static block
Child static block
Parent constructor
Child constructor
```

从输出可以看出，在创建 `Child` 类型对象时，首先执行父类的静态块，然后是子类的静态块，最后才是父类和子类的构造函数。这清晰地展示了加载的顺序。





### 2.2   接口

##### [#](https://xiaolincoding.com/interview/java.html#接口可以包含构造函数吗)接口可以包含构造函数吗？

在接口中，不可以有构造方法,在接口里写入构造方法时，编译器提示：Interfaces cannot have constructors，因为接口不会有自己的实例的，所以不需要有构造函数。

为什么呢？构造函数就是初始化class的属性或者方法，在new的一瞬间自动调用，那么问题来了Java的接口，都不能new 那么要构造函数干嘛呢？根本就没法调用。

##### （）[#](https://xiaolincoding.com/interview/java.html#java抽象类和接口的区别是什么)Java抽象类和接口的区别是什么？

**两者的特点：**一句话：**抽象类抽象共同特征和行为，接口只抽象行为。**

- 抽象类用于描述类的共同特性和行为，可以有成员变量、构造方法和具体方法。适用于有明显继承关系的场景。
- 接口用于定义行为规范，可以多实现，只能有常量和抽象方法（Java 8 以后可以有默认方法和静态方法）。适用于定义类的能力或功能。

**两者的区别：**

- 实现方式：实现接口的关键字为implements，继承抽象类的关键字为extends。一个类可以实现多个接口，但一个类只能继承一个抽象类。所以，使用接口可以间接地实现多重继承。
- 方法方式：接口只有定义，不能有方法的实现，java 1.8中可以定义default方法体，而抽象类可以有定义与实现，方法可在抽象类中实现。
- 访问修饰符：接口成员变量默认为public static final，必须赋初值，不能被修改；其所有的成员方法都是public、abstract的。抽象类中成员变量默认default，可在子类中被重新定义，也可被重新赋值；抽象方法被abstract修饰，不能被private、static、synchronized和native等修饰，必须以分号结尾，不带花括号。
- 变量：抽象类可以包含实例变量和静态变量，而接口只能包含常量（即静态常量）。

##### [#](https://xiaolincoding.com/interview/java.html#接口里面可以定义哪些方法)接口里面可以定义哪些方法？

- **抽象方法**

抽象方法是接口的核心部分，所有实现接口的类都必须实现这些方法。抽象方法默认是 public 和 abstract，这些修饰符可以省略。

```java
public interface Animal {
    void makeSound();
}
```

- **默认方法**

默认方法是在 Java 8 中引入的，允许接口提供具体实现。实现类可以选择重写默认方法。

```java
public interface Animal {
    void makeSound();
    
    default void sleep() {
        System.out.println("Sleeping...");
    }
}
```

- **静态方法**

静态方法也是在 Java 8 中引入的，它们属于接口本身，可以通过接口名直接调用，而不需要实现类的对象。

```java
public interface Animal {
    void makeSound();
    
    static void staticMethod() {
        System.out.println("Static method in interface");
    }
}
```

- **私有方法**

私有方法是在 Java 9 中引入的，用于在接口中为默认方法或其他私有方法提供辅助功能。这些方法不能被实现类访问，只能在接口内部使用。

```java
public interface Animal {
    void makeSound();
    
    default void sleep() {
        System.out.println("Sleeping...");
        logSleep();
    }
    
    private void logSleep() {
        System.out.println("Logging sleep");
    }
}
public interface Animal {
    void makeSound();
}
```

### 2.3   Object

##### （）== 与 equals 有什么区别？

对于字符串变量来说，使用"=="和"equals"比较字符串时，其比较方法不同。"=="比较两个变量本身的值，即两个对象在内存中的首地址，"equals"比较字符串包含内容是否相同。

对于非字符串变量来说，如果没有对equals()进行重写的话，"==" 和 "equals"方法的作用是相同的，都是用来比较对象在堆内存中的首地址，即用来比较两个引用变量是否指向同一个对象。

- ==：比较的是两个字符串内存地址（堆内存）的数值是否相等，属于数值比较；
- equals()：比较的是两个字符串的内容，属于内容比较。

###### 1. `==` 操作符

- **作用**: 用于比较两个变量的值。
- **基本类型**: 比较的是变量的实际值。
- **引用类型**: 比较的是对象的内存地址（即是否指向同一个对象）。

```java
int a = 5;
int b = 5;
System.out.println(a == b); // true，比较的是值

String str1 = new String("hello");
String str2 = new String("hello");
System.out.println(str1 == str2); // false，比较的是内存地址
```

###### 2. `equals()` 方法

- **作用**: 用于比较两个对象的内容是否相等。
- **默认行为**: 在 `Object` 类中，`equals()` 默认与 `==` 相同，比较的是内存地址。
- **重写**: 通常需要在自定义类中重写 `equals()` 方法，以实现内容比较。

##### [#](https://xiaolincoding.com/interview/java.html#stringbuffer和stringbuild区别是什么)StringBuffer和StringBuild区别是什么？

区别：

- String 是 Java 中基础且重要的类，被声明为 final class，是不可变字符串。因为它的不可变性，所以拼接字符串时候会产生很多无用的中间对象，如果频繁的进行这样的操作对性能有所影响。
- StringBuffer 就是为了解决大量拼接字符串时产生很多中间对象问题而提供的一个类。它提供了 append 和 add 方法，可以将字符串添加到已有序列的末尾或指定位置，它的本质是一个线程安全的可修改的字符序列。在很多情况下我们的字符串拼接操作不需要线程安全，所以 StringBuilder 登场了。
- StringBuilder 是 JDK1.5 发布的，它和 StringBuffer 本质上没什么区别，就是去掉了保证线程安全的那部分，减少了开销。

线程安全：

- StringBuffer：线程安全
- StringBuilder：线程不安全

速度：

- 一般情况下，速度从快到慢为 StringBuilder > StringBuffer > String，当然这是相对的，不是绝对的。

使用场景：

- 操作少量的数据使用 String。

- 单线程操作大量数据使用 StringBuilder。

- 多线程操作大量数据使用 StringBuffer。

  ![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1716098439957-a080de5a-d69e-4c6e-a5e8-111f976f9b5b.webp)





### 2.4 访问修饰符

##### （）访问修饰符

| 修饰符      | 当前类 | 同包类 | 不同包子类 | 其他包类 |
| :---------- | :----- | :----- | :--------- | :------- |
| `public`    | ✔️      | ✔️      | ✔️          | ✔️        |
| `protected` | ✔️      | ✔️      | ✔️          | ❌        |
| 默认（无）  | ✔️      | ✔️      | ❌          | ❌        |
| `private`   | ✔️      | ❌      | ❌          | ❌        |

常见问题

- **Q**：不同包的子类如何访问父类的 `protected` 成员？
  **A**：必须通过继承关系（如子类自身的方法或通过子类实例），不能通过父类实例直接访问。
- **Q**：能否在类外部访问 `private` 构造器？
  **A**：不能。常用于单例模式，通过静态工厂方法返回实例。



### 2.5  内部类

##### （）[#](https://xiaolincoding.com/interview/java.html#非静态内部类和静态内部类的区别)非静态内部类和静态内部类的区别？

区别包括：

- 非静态内部类依赖于外部类的实例，而静态内部类不依赖于外部类的实例。
- 非静态内部类可以访问外部类的实例变量和方法，而静态内部类只能访问外部类的静态成员。
- 非静态内部类不能定义静态成员，而静态内部类可以定义静态成员。
- 非静态内部类在外部类实例化后才能实例化，而静态内部类可以独立实例化。
- 非静态内部类可以访问外部类的私有成员，而静态内部类不能直接访问外部类的私有成员，需要通过实例化外部类来访问。

> [!IMPORTANT]
>
> 1. 静态内部类不会持有外部内的引用。
>
>    不会导致内存泄漏，多数内存泄漏都是因为内部类持有外部内导致的内存泄漏。例如，使用匿名内部类开启线程，并定时刷新UI。这时切换页面，却因为线程持有外部内的引用，导致无法回收本应该被切换掉的页面。可以配合弱引用来实现。
>
> 2. 直接使用“外部内.静态内部类”来访问。
>
> 3. 作用域不会扩散到包外。例如ConcurrentHsahMap的源码就采用了静态内部类来定义Node。以及View.ClickEvent点击事件。例如Map.Entry<>。就是一个静态内部类。
>

##### （）[#](https://xiaolincoding.com/interview/java.html#非静态内部类可以直接访问外部方法-编译器是怎么做到的)非静态内部类可以直接访问外部方法，编译器是怎么做到的？

> [!NOTE]
>
> 非静态内部类可以直接访问外部方法是因为 ***编译器在生成字节码时会为非静态内部类维护一个指向外部类实例的引用。***
>
> 这个引用使得非静态内部类能够访问外部类的实例变量和方法。编译器会在生成非静态内部类的构造方法时，将外部类实例作为参数传入，并在内部类的实例化过程中建立外部类实例与内部类实例之间的联系，从而实现直接访问外部方法的功能。

- [ ] kotlin中默认内部类的写法是静态的，因为可能导致**内存泄漏**。如果你想写一个非静态的内部类，需要手动加关键字inner

### 2.6 深拷贝和浅拷贝

##### [#](https://xiaolincoding.com/interview/java.html#深拷贝和浅拷贝的区别)深拷贝和浅拷贝的区别？

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1720683675376-c5af6668-4538-479f-84e8-42d4143ab101.webp)

- 浅拷贝是指只复制对象本身和其内部的值类型字段，但不会复制对象内部的引用类型字段。换句话说，浅拷贝只是创建一个新的对象，然后将原对象的字段值复制到新对象中，但如果原对象内部有引用类型的字段，只是将引用复制到新对象中，两个对象指向的是同一个引用对象。
- 深拷贝是指在复制对象的同时，将对象内部的所有引用类型字段的内容也复制一份，而不是共享引用。换句话说，深拷贝会递归复制对象内部所有引用类型的字段，生成一个全新的对象以及其内部的所有对象。

##### [#](https://xiaolincoding.com/interview/java.html#实现深拷贝的三种方法是什么)实现深拷贝的三种方法是什么？

在 Java 中，实现对象深拷贝的方法有以下几种主要方式：

1. 实现 Cloneable 2.序列化和反序列化 3. 手动递归复制

> 1.实现 Cloneable 接口并重写 clone() 方法

这种方法要求对象及其所有引用类型字段都实现 Cloneable 接口，并且重写 clone() 方法。在 clone() 方法中，通过递归克隆引用类型字段来实现深拷贝。

```java
class MyClass implements Cloneable {
    private String field1;
    private NestedClass nestedObject; // 浅拷贝不会复制这个对象，所以也需要实现Cloneable

    @Override
    protected MyClass clone() throws CloneNotSupportedException {
        MyClass cloned = (MyClass) super.clone();
        // 下边的代码手动克隆引用类型的字段，如果有多个，也需要逐次手动克隆。
        cloned.nestedObject = (NestedClass) nestedObject.clone(); // 深拷贝内部的引用对象
        return cloned;
    }
}

class NestedClass implements Cloneable {
    private int nestedField;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone(); // 因为没有引用类型的字段，故直接返回 super.clone()
    }
}
```

> 2. 使用序列化和反序列化

通过将对象序列化为字节流，再从字节流反序列化为对象来实现深拷贝。要求对象及其所有引用类型字段都实现 Serializable 接口。

```java
import java.io.*;

class MyClass implements Serializable {
    private String field1;
    private NestedClass nestedObject; // 浅拷贝不会复制这个对象

    public MyClass deepCopy() {
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            ObjectOutputStream oos = new ObjectOutputStream(bos);
            oos.writeObject(this);
            oos.flush();
            oos.close();

            ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
            ObjectInputStream ois = new ObjectInputStream(bis);
            return (MyClass) ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
            return null;
        }
    }
}

class NestedClass implements Serializable {
    private int nestedField;
}
```

> 3.手动递归复制

针对特定对象结构，手动递归复制对象及其引用类型字段。适用于对象结构复杂度不高的情况。

```java
class MyClass {
    private String field1;
    private NestedClass nestedObject;

    public MyClass deepCopy() {
        MyClass copy = new MyClass();
        copy.setField1(this.field1);
        copy.setNestedObject(this.nestedObject.deepCopy());
        return copy;
    }
}

class NestedClass {
    private int nestedField;

    public NestedClass deepCopy() {
        NestedClass copy = new NestedClass();
        copy.setNestedField(this.nestedField);
        return copy;
    }
}
```

##### （）拷贝的场景和用途？

- **应用场景**：在需要修改对象副本而不影响原对象时使用，如缓存、备份等。

- ### **数据传输**：如通过网络传输对象时，对象会被序列化为字节流，接收方再反序列化为对象。

- **数据备份**：在需要备份数据时，通常会复制数据。



### 2.7 创建对象

###### #java创建对象有哪些方式？

在Java中，创建对象的方式有多种，常见的包括：

**使用new关键字**：通过new关键字直接调用类的构造方法来创建对象。

```java
MyClass obj = new MyClass();
```

**反射。使用Class类的newInstance()方法**：通过反射机制，可以使用Class类的newInstance()方法创建对象。（这种方式貌似被弃用了）

```java
MyClass obj = (MyClass) Class.forName("com.example.MyClass").newInstance();
```

**使用Constructor类的newInstance()方法**：同样是通过反射机制，可以使用Constructor类的newInstance()方法创建对象。

```java
Constructor<MyClass> constructor = MyClass.class.getConstructor();
MyClass obj = constructor.newInstance();
```

**使用clone()方法**：如果类实现了Cloneable接口，可以使用clone()方法复制对象。

```java
MyClass obj1 = new MyClass();
MyClass obj2 = (MyClass) obj1.clone();
```

**使用反序列化**：通过将对象序列化到文件或流中，然后再进行反序列化来创建对象。

```java
// SerializedObject.java
ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("object.ser"));
out.writeObject(obj);
out.close();

// DeserializedObject.java
ObjectInputStream in = new ObjectInputStream(new FileInputStream("object.ser"));
MyClass obj = (MyClass) in.readObject();
in.close();
```

###### [#](https://xiaolincoding.com/interview/java.html#java创建对象除了new还有别的什么方式)Java创建对象除了new还有别的什么方式?

- **通过反射创建对象**：通过 Java 的反射机制可以在运行时动态地创建对象。可以使用 Class 类的 newInstance() 方法或者通过 Constructor 类来创建对象。

```java
public class MyClass {
    public MyClass() {
        // Constructor
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = MyClass.class;
        MyClass obj = (MyClass) clazz.newInstance();
    }
}
```

- **通过反序列化创建对象**：通过将对象序列化（保存到文件或网络传输）然后再反序列化（从文件或网络传输中读取对象）的方式来创建对象，对象能被序列化和反序列化的前提是类实现Serializable接口。

```java
import java.io.*;

public class MyClass implements Serializable {
    // Class definition
}

public class Main {
    public static void main(String[] args) throws Exception {
        // Serialize object
        MyClass obj = new MyClass();
        ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("object.ser"));
        out.writeObject(obj);
        out.close();
        
        // Deserialize object
        ObjectInputStream in = new ObjectInputStream(new FileInputStream("object.ser"));
        MyClass newObj = (MyClass) in.readObject();
        in.close();
    }
}
```

- **通过clone创建对象**：所有 Java 对象都继承自 Object 类，Object 类中有一个 clone() 方法，可以用来创建对象的副本，要使用 clone 方法，我们必须先实现 Cloneable 接口并实现其定义的 clone 方法。

```java
public class MyClass implements Cloneable {
    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}

public class Main {
    public static void main(String[] args) throws CloneNotSupportedException {
        MyClass obj1 = new MyClass();
        MyClass obj2 = (MyClass) obj1.clone();
    }
}
```

###### [#](https://xiaolincoding.com/interview/java.html#new出的对象什么时候回收)New出的对象什么时候回收？

通过过关键字`new`创建的对象，由Java的垃圾回收器（Garbage Collector）负责回收。垃圾回收器的工作是在程序运行过程中自动进行的，它会周期性地检测不再被引用的对象，并将其回收释放内存。

具体来说，Java对象的回收时机是由垃圾回收器根据一些算法来决定的，主要有以下几种情况：

1. 引用计数法：某个对象的引用计数为0时，表示该对象不再被引用，可以被回收。
2. 可达性分析算法：从根对象（如方法区中的类静态属性、方法中的局部变量等）出发，通过对象之间的引用链进行遍历，如果存在一条引用链到达某个对象，则说明该对象是可达的，反之不可达，不可达的对象将被回收。

3. 终结器（Finalizer）：如果对象重写了`finalize()`方法，垃圾回收器会在回收该对象之前调用`finalize()`方法，对象可以在`finalize()`方法中进行一些清理操作。然而，终结器机制的使用不被推荐，因为它的执行时间是不确定的，可能会导致不可预测的性能问题。

#####  （）垃圾回收根节点有哪些？

Java垃圾回收的根节点（GC Roots）是对象可达性分析的起点，所有从根节点出发能被访问到的对象都被视为存活对象，不会被回收。以下是主要的GC Roots类型：

------

1. **虚拟机栈中的局部变量（活动栈帧中的引用）**

- **当前执行方法中的局部变量**：线程的栈帧中引用的对象（包括方法的参数和局部变量）。
- **活动线程的栈帧**：所有正在运行的线程的调用栈中的对象引用。

------

2. **方法区中的静态变量（类静态属性）**

- **类的静态字段**：静态变量属于类本身，生命周期与类相同，除非类被卸载，否则其引用的对象始终存活。

------

3. **方法区中的常量引用**

- **字符串常量池**：例如通过字面量（如`String s = "abc"`）定义的字符串对象。
- **其他常量**：`final static`修饰的常量引用的对象。

------

4. **本地方法栈中的JNI引用**

- **Native方法中的对象**：通过Java Native Interface（JNI）调用的本地代码（如C/C++）创建或引用的对象。

------

5. **被同步锁（Synchronization Lock）持有的对象**

- **锁对象**：例如通过`synchronized(obj)`锁定的对象，在同步块执行期间不会被回收。

------

6. **Java虚拟机内部引用**

- **系统类加载器加载的类**：例如`Object.class`等核心类。
- **Class对象**：类的元数据（如`Class<?>`对象）。
- **异常对象**：如`OutOfMemoryError`等常驻异常对象。
- **JMXBean等内部对象**：用于监控和管理的JVM内部对象。

------

7. **其他临时性根节点**

- **临时对象**：某些情况下，JVM可能临时将对象标记为根（如分代垃圾回收中的跨代引用）。

------

### 总结

GC Roots的多样性确保了JVM能够准确追踪存活对象。理解这些根节点有助于优化内存使用和避免内存泄漏（如静态集合类持有无用对象）。不同的垃圾回收器可能对根节点的处理略有差异，但核心逻辑一致。

