# 第9节、java多线程和并发



### 9.1  线程基础

##### （）`java`里面的线程和操作系统的线程一样吗？

`Java` 底层会调用 `pthread_create` 来创建线程，所以本质上 `java` 程序创建的线程，就是和操作系统线程是一样的，是 1 对 1 的线程模型。

![image-20240725230425385](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20240725230425385.png)

##### [#](https://xiaolincoding.com/interview/juc.html#使用多线程要注意哪些问题)使用多线程要注意哪些问题？（线程安全三要素）

要保证多线程的允许是安全，不要出现数据竞争造成的数据混乱的问题。

Java的线程安全在三个方面体现：

- **原子性**：提供互斥访问，同一时刻只能有一个线程对数据进行操作，在`Java`中使用了`atomic`包（这个包提供了一些支持原子操作的类，这些类可以在多线程环境下保证操作的原子性）和`synchronized`关键字来确保原子性；要么全部执行，要么全部不执行。`CAS`操作也可以保证原子性
- **可见性**：一个线程对主内存的修改可以及时地被其他线程看到，在`Java`中使用了`synchronized`和`volatile`这两个关键字确保可见性；
- **有序性**：一个线程观察其他线程中的指令执行顺序，由于指令重排序，该观察结果一般杂乱无序，在`Java`中使用了`happens-before`原则来确保有序性。

##### [#](https://xiaolincoding.com/interview/juc.html#保证数据的一致性有哪些方案呢)保证数据的一致性有哪些方案呢？

- **事务管理**：使用数据库事务来确保一组数据库操作要么全部成功提交，要么全部失败回滚。通过ACID（原子性、一致性、隔离性、持久性）属性，数据库事务可以保证数据的一致性。
- **锁机制**：使用锁来实现对共享资源的互斥访问。在 `Java` 中，可以使用 `synchronized` 关键字、`ReentrantLock `或其他锁机制来控制并发访问，从而避免并发操作导致数据不一致。
- **版本控制**：通过乐观锁的方式，在更新数据时记录数据的版本信息，从而避免同时对同一数据进行修改，进而保证数据的一致性。

##### [#](https://xiaolincoding.com/interview/juc.html#线程的创建方式有哪些)线程的创建方式有哪些?

###### 0. Java线程启动方式对比表

|       **启动方式**        |                         **实现步骤**                         | **返回值** |                         **异常处理**                         | **线程复用** | **资源消耗** |          **适用场景**          |
| :-----------------------: | :----------------------------------------------------------: | :--------: | :----------------------------------------------------------: | :----------: | :----------: | :----------------------------: |
|    **继承`Thread`类**     |   1. 继承`Thread`，重写`run()` 2. 创建实例并调用`start()`    |     无     | `run()`不能抛出受检异常，需内部处理或通过`UncaughtExceptionHandler`捕获。 |      否      |      高      |     简单任务，但**不推荐**     |
|  **实现`Runnable`接口**   | 1. 实现`Runnable`，定义`run()` 2. 实例传给`Thread`并调用`start()` |     无     |                             同上                             |      否      |      高      |    解耦任务与线程，**推荐**    |
| **`Callable+FutureTask`** | 1. 实现`Callable`，定义`call()` 2. 用`FutureTask`包装，传给`Thread`并启动 |     有     | `call()`可抛出受检异常，通过`FutureTask.get()`捕获`ExecutionException`。 |      否      |      高      |      需要返回值或异常处理      |
|    **线程池提交任务**     | 1. 创建线程池（如`ExecutorService`） 2. 提交`Runnable`/`Callable`任务 |    支持    | 异常封装在`Future`中，通过`Future.get()`捕获`ExecutionException`。 |      是      |      低      | 高并发、资源复用，**强烈推荐** |

###### 1. 继承`Thread`类

这是最直接的一种方式，用户自定义类继承`java.lang.Thread`类，重写其`run()`方法，`run()`方法中定义了线程执行的具体任务。创建该类的实例后，通过调用`start()`方法启动线程。

```java
class MyThread extends Thread {
    @Override
    public void run() {
        // 线程执行的代码
    }
}

public static void main(String[] args) {
    MyThread t = new MyThread();
    t.start();
}
```

采用继承`Thread`类方式

- 优点: 编写简单，如果需要访问当前线程，无需使用`Thread.currentThread ()`方法，直接使用`this`，即可获得当前线程
- 缺点:因为线程类已经继承了`Thread`类，所以不能再继承其他的父类

###### 2. 实现`Runnable`接口

如果一个类已经继承了其他类，就不能再继承`Thread`类，此时可以实现`java.lang.Runnable`接口。实现`Runnable`接口需要重写`run()`方法，然后将此`Runnable`对象作为参数传递给`Thread`类的构造器，创建`Thread`对象后调用其`start()`方法启动线程。

```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        // 线程执行的代码
    }
}

public static void main(String[] args) {
    Thread t = new Thread(new MyRunnable());
    t.start();
}
```

采用实现`Runnable`接口方式：

- 优点：线程类只是实现了`Runable`接口，还可以继承其他的类。在这种方式下，可以多个线程共享同一个目标对象，所以非常适合多个相同线程来处理同一份资源的情况，从而可以将CPU代码和数据分开，形成清晰的模型，较好地体现了面向对象的思想。
- 缺点：编程稍微复杂，如果需要访问当前线程，必须使用`Thread.currentThread()`方法。

###### 3. 实现`Callable`接口与`FutureTask`

`java.util.concurrent.Callable`接口类似于`Runnable`，但`Callable`的`call()`方法可以有返回值并且可以抛出异常。要执行`Callable`任务，需将它包装进一个`FutureTask`，因为`Thread`类的构造器只接受`Runnable`参数，而`FutureTask`实现了`Runnable`接口。

```java
class MyCallable implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        // 线程执行的代码，这里返回一个整型结果
        return 1;
    }
}

public static void main(String[] args) {
    MyCallable task = new MyCallable();
    FutureTask<Integer> futureTask = new FutureTask<>(task);
    Thread t = new Thread(futureTask);
    t.start();

    try {
        Integer result = futureTask.get();  // 获取线程执行结果
        System.out.println("Result: " + result);
    } catch (InterruptedException | ExecutionException e) {
        e.printStackTrace();
    }
}
```

采用实现`Callable`接口方式：

- 缺点：编程稍微复杂，如果需要访问当前线程，必须调用Thread.currentThread()方法。
- 优点：线程只是实现Runnable或实现Callable接口，还可以继承其他类。这种方式下，多个线程可以共享一个target对象，非常适合多线程处理同一份资源的情形。

###### 4. 使用线程池（`Executor`框架）

从`Java 5`开始引入的`java.util.concurrent.ExecutorService`和相关类提供了线程池的支持，这是一种更高效的线程管理方式，避免了频繁创建和销毁线程的开销。可以通过`Executors`类的静态方法创建不同类型的线程池。

```java
class Task implements Runnable {
    @Override
    public void run() {
        // 线程执行的代码
    }
}

public static void main(String[] args) {
    ExecutorService executor = Executors.newFixedThreadPool(10);  // 创建固定大小的线程池
    for (int i = 0; i < 100; i++) {
        executor.submit(new Task());  // 提交任务到线程池执行
    }
    executor.shutdown();  // 关闭线程池
}
```

采用线程池方式：

- 缺点：线程池增加了程序的复杂度，特别是当涉及线程池参数调整和故障排查时。错误的配置可能导致死锁、资源耗尽等问题，这些问题的诊断和修复可能较为复杂。
- 优点：线程池可以重用预先创建的线程，避免了线程创建和销毁的开销，显著提高了程序的性能。对于需要快速响应的并发请求，线程池可以迅速提供线程来处理任务，减少等待时间。并且，线程池能够有效控制运行的线程数量，防止因创建过多线程导致的系统资源耗尽（如内存溢出）。通过合理配置线程池大小，可以最大化CPU利用率和系统吞吐量。

##### [#](https://xiaolincoding.com/interview/juc.html#怎么启动线程)怎么启动线程 ？

启动线程的通过Thread类的**start()**。

```java
//创建两个线程，用start启动线程
MyThread myThread1 = new MyThread();  
MyThread myThread2 = new MyThread();  
myThread1.start();  
myThread2.start();  
```

##### [#](https://xiaolincoding.com/interview/juc.html#如何停止一个线程的运行)如何停止一个线程的运行?

方法对比表

|       **方法**       |         **适用场景**          | 代码                                                         | **可中断阻塞操作** | **资源安全** | **推荐指数** |
| :------------------: | :---------------------------: | ------------------------------------------------------------ | :----------------: | :----------: | :----------: |
| **`volatile`标志位** |  简单循环任务，无需处理阻塞   | `private volatile boolean isStopped = false;`                |         ❌          |      ✅       |      ⭐⭐      |
|  **`interrupt()`**   | 需中断阻塞操作（如I/O、睡眠） | `while (!Thread.currentThread().isInterrupted())`            |         ✅          |      ✅       |     ⭐⭐⭐⭐     |
|    **线程池关闭**    | 生产环境，统一管理多线程任务  | `executor.shutdownNow();     executor.awaitTermination(2, TimeUnit.SECONDS);` |         ✅          |      ✅       |    ⭐⭐⭐⭐⭐     |

------

关键注意事项

1. **不要使用废弃方法**：
   - 避免使用`Thread.stop()`、`suspend()`、`resume()`，它们会导致资源未释放或数据不一致。
2. **正确处理中断**：
   - 在捕获`InterruptedException`后，通常需调用`Thread.currentThread().interrupt()`重新设置中断状态。
3. **线程池的优雅关闭**：
   - `shutdown()`：等待已提交任务完成，不再接受新任务。
   - `shutdownNow()`：尝试中断所有运行中的线程，但需任务配合响应中断。

主要有这些方法：

- **异常法停止**：线程调用interrupt()方法后，在线程的run方法中判断当前对象的interrupted()状态，如果是中断状态则抛出异常，达到中断线程的效果。
- **在沉睡中停止**：先将线程sleep，然后调用interrupt标记中断状态，interrupt会将阻塞状态的线程中断。会抛出中断异常，达到停止线程的效果
- **stop()暴力停止**：线程调用stop()方法会被暴力停止，方法已弃用，该方法会有不好的后果：强制让线程停止有可能使一些请理性的工作得不到完成。
- **使用return停止线程**：调用interrupt标记为中断状态后，在run方法中判断当前线程状态，如果为中断状态则return，能达到停止线程的效果。

##### [#](https://xiaolincoding.com/interview/juc.html#调用-interrupt-是如何让线程抛出异常的)调用 interrupt 是如何让线程抛出异常的?

每个线程都一个与之关联的布尔属性来表示其中断状态，中断状态的初始值为false，当一个线程被其它线程调用`Thread.interrupt()`方法中断时，会根据实际情况做出响应。

- 如果该线程正在执行低级别的可中断方法（如`Thread.sleep()`、`Thread.join()`或`Object.wait()`），则会解除阻塞并**抛出`InterruptedException`异常**。
- 否则`Thread.interrupt()`仅设置线程的中断状态，在该被中断的线程中稍后可通过轮询中断状态来决定是否要停止当前正在执行的任务。

##### [#](https://xiaolincoding.com/interview/juc.html#java线程的状态有哪些)Java线程的状态有哪些？

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1712648206670-824228d1-be28-449d-8509-fd4df4ff63d3.webp)



源自《Java并发编程艺术》 `java.lang.Thread.State`枚举类中定义了六种线程的状态，可以调用线程`Thread`中的`getState()`方法**获取当前线程的状态**。

| 线程状态        | 解释                                                         |
| --------------- | ------------------------------------------------------------ |
| `NEW`           | 尚未启动的线程状态，即线程创建，**还未调用start方法**        |
| `RUNNABLE`      | **就绪状态**（调用start，等待调度）+**正在运行**             |
| `BLOCKED`       | **等待监视器锁**时，陷入阻塞状态                             |
| `WAITING`       | 等待状态的线程正在**等待**另一线程执行特定的操作（如notify）,`BLOCKED`的一种 |
| `TIMED_WAITING` | 具有**指定等待时间**的等待状态                               |
| `TERMINATED`    | 线程完成执行，**终止状态**                                   |

##### [#](https://xiaolincoding.com/interview/juc.html#blocked和waiting有啥区别)`blocked`和`waiting`有啥区别

- **触发条件**:线程进入`BLOCKED`状态通常是因为试图获取一个对象的锁（`monitor lock`），但该锁已经被另一个线程持有。这通常发生在尝试进入`synchronized`块或方法时，如果锁已被占用，则线程将被阻塞直到锁可用。线程进入`WAITING`状态是因为它正在等待另一个线程执行某些操作，例如调用`Object.wait()`方法、`Thread.join()`方法或`LockSupport.park()`方法。在这种状态下，线程将不会消耗`CPU`资源，并且不会参与锁的竞争。
- **唤醒机制**:当一个线程被阻塞等待锁时，一旦锁被释放，线程将有机会重新尝试获取锁。如果锁此时未被其他线程获取，那么线程可以从`BLOCKED`状态变为`RUNNABLE`状态。线程在`WAITING`状态中需要被显式唤醒。例如，如果线程调用了`Object.wait()`，那么它必须等待另一个线程调用同一对象上的`Object.notify()`或`Object.notifyAll()`方法才能被唤醒。

##### [#](https://xiaolincoding.com/interview/juc.html#wait-状态下的线程如何进行恢复到-running-状态)`wait` 状态下的线程如何进行恢复到 `running` 状态?

- 等待的线程**被其他线程对象唤醒**，`notify()`和`notifyAll()`。
- 如果线程没有获取到锁则会直接进入 `Waiting` 状态，其实这种本质上它就是执行了 `LockSupport.park()` 方法进入了`Waiting` 状态，那么解锁的时候会执行`LockSupport.unpark(Thread)`，与上面`park`方法对应，给出许可证，**解除等待状态**。

##### [#](https://xiaolincoding.com/interview/juc.html#notify-和-notifyall-的区别)`notify` 和 `notifyAll` 的区别?

同样是唤醒等待的线程，同样最多只有一个线程能获得锁，同样不能控制哪个线程获得锁。

区别在于：

- notify：唤醒一个线程，其他线程依然处于wait的等待唤醒状态，如果被唤醒的线程结束时没调用notify，其他线程就永远没人去唤醒，只能等待超时，或者被中断
- notifyAll：所有线程退出wait的状态，开始竞争锁，但只有一个线程能抢到，这个线程执行完后，其他线程又会有一个幸运儿脱颖而出得到锁

##### [#](https://xiaolincoding.com/interview/juc.html#notify-选择哪个线程)`notify` 选择哪个线程?

`notify`在源码的注释中说到`notify`选择唤醒的线程是任意的，但是依赖于具体实现的`jvm`。

![image-20240725230457096](https://raw.githubusercontent.com/shilic/MarkDownImageRepository/main/img/image-20240725230457096.png)

`JVM`有很多实现，比较流行的就是`hotspot`，`hotspot`对`notofy()`的实现并不是我们以为的随机唤醒,而是“先进先出”的顺序唤醒。





### 9.2  并发安全

##### （）`Condition` 类和 `Object` 类锁方法相同点

1.`Condition` 类的 `awiat`方法和` Object`类的 `wait`方法等效

2.`Condition` 类的 `signal` 方法和 `Object`类的 `notify` 方法等效

3.`Condition` 类的 `signalAll` 方法和 `Object` 类的 `notifyAll`方法等效
4.`ReentrantLock`类可以唤醒指定条件的线程，而`object`的唤醒是随机的

###### **`Condition` 类与 `Object` 锁方法的区别**表格

|    **特性**    | **`Object` 锁方法（`wait`/`notify`）** |                  **`Condition` 类**                   |
| :------------: | :------------------------------------: | :---------------------------------------------------: |
| **底层锁类型** |   基于 `synchronized` 关键字的内置锁   |           基于显式锁（如 `ReentrantLock`）            |
| **多条件支持** |      ❌ 只能绑定到单个隐式条件队列      | ✅ 可创建多个条件队列（如 `condition1`, `condition2`） |
|  **方法名称**  |  `wait()`, `notify()`, `notifyAll()`   |         `await()`, `signal()`, `signalAll()`          |
|  **可中断性**  |    不可中断的等待（需手动处理中断）    |     ✅ 支持可中断的等待（`awaitInterruptibly()`）      |
|  **超时控制**  |       ❌ `wait()` 仅支持简单超时        |     ✅ 支持超时（`awaitNanos()`, `awaitUntil()`）      |
| **公平性支持** |             ❌ 无公平性控制             |              ✅ 可通过锁的公平性策略控制               |
|   **灵活性**   |   低（需在 `synchronized` 块内使用）   |            高（可与任意 `Lock` 实现配合）             |
|  **适用场景**  |     简单线程协作（如单一条件等待）     |      复杂线程协作（如多条件、可中断、超时控制）       |

##### #`juc`包下你常用的类？

线程池相关：

- `ThreadPoolExecutor`：最核心的线程池类，用于创建和管理线程池。通过它可以灵活地配置线程池的参数，如核心线程数、最大线程数、任务队列等，以满足不同的并发处理需求。
- `Executors`：线程池工厂类，提供了一系列静态方法来创建不同类型的线程池，如`newFixedThreadPool`（创建固定线程数的线程池）、`newCachedThreadPool`（创建可缓存线程池）、`newSingleThreadExecutor`（创建单线程线程池）等，方便开发者快速创建线程池。

并发集合类：

- `ConcurrentHashMap`：线程安全的哈希映射表，用于在多线程环境下高效地存储和访问键值对。它采用了分段锁等技术，允许多个线程同时访问不同的段，提高了并发性能，在高并发场景下比传统的`Hashtable`性能更好。
- `CopyOnWriteArrayList`：线程安全的列表，在对列表进行修改操作时，会创建一个新的底层数组，将修改操作应用到新数组上，而读操作仍然可以在旧数组上进行，从而实现了读写分离，提高了并发读的性能，适用于读多写少的场景。

同步工具类：

- `CountDownLatch`：允许一个或多个线程等待其他一组线程完成操作后再继续执行。它通过一个计数器来实现，计数器初始化为线程的数量，每个线程完成任务后调用`countDown`方法将计数器减一，当计数器为零时，等待的线程可以继续执行。常用于多个线程完成各自任务后，再进行汇总或下一步操作的场景。
- `CyclicBarrier`：让一组线程互相等待，直到所有线程都到达某个屏障点后，再一起继续执行。与`CountDownLatch`不同的是，`CyclicBarrier`可以重复使用，当所有线程都通过屏障后，计数器会重置，可以再次用于下一轮的等待。适用于多个线程需要协同工作，在某个阶段完成后再一起进入下一个阶段的场景。
- `Semaphore`：信号量，用于控制同时访问某个资源的线程数量。它维护了一个许可计数器，线程在访问资源前需要获取许可，如果有可用许可，则获取成功并将许可计数器减一，否则线程需要等待，直到有其他线程释放许可。常用于控制对有限资源的访问，如数据库连接池、线程池中的线程数量等。

原子类：

- `AtomicInteger`：原子整数类，提供了对整数类型的原子操作，如自增、自减、比较并交换等。通过硬件级别的原子指令来保证操作的原子性和线程安全性，避免了使用锁带来的性能开销，在多线程环境下对整数进行计数、状态标记等操作非常方便。
- `AtomicReference`：原子引用类，用于对对象引用进行原子操作。可以保证在多线程环境下，对对象的更新操作是原子性的，即要么全部成功，要么全部失败，不会出现数据不一致的情况。常用于实现无锁数据结构或需要对对象进行原子更新的场景。

##### [#](https://xiaolincoding.com/interview/juc.html#怎么保证多线程安全)怎么保证多线程安全？

- **`synchronized`关键字**:可以使用`synchronized`关键字来同步代码块或方法，确保同一时刻只有一个线程可以访问这些代码。对象锁是通过`synchronized`关键字锁定对象的监视器（`monitor`）来实现的。

```java
public synchronized void someMethod() { /* ... */ }

public void anotherMethod() {
    synchronized (someObject) {
        /* ... */
    }
}
```

- **`volatile`关键字**:`volatile`关键字用于变量，确保所有线程看到的是该变量的最新值，而不是可能存储在本地寄存器中的副本。

```java
public volatile int sharedVariable;
```

- **`Lock`接口和`ReentrantLock`类**:`java.util.concurrent.locks.Lock`接口提供了比`synchronized`更强大的锁定机制，`ReentrantLock`是一个实现该接口的例子，提供了更灵活的锁管理和更高的性能。

```java
private final ReentrantLock lock = new ReentrantLock();

public void someMethod() {
    lock.lock();
    try {
        /* ... */
    } finally {
        lock.unlock();
    }
}
```

- **原子类**：`Java`并发库（`java.util.concurrent.atomic`）提供了原子类，如`AtomicInteger`、`AtomicLong`等，这些类提供了原子操作，可以用于更新基本类型的变量而无需额外的同步。

示例：

```java
AtomicInteger counter = new AtomicInteger(0);

int newValue = counter.incrementAndGet();
```

- **线程局部变量**:`ThreadLocal`类可以为每个线程提供独立的变量副本，这样每个线程都拥有自己的变量，消除了竞争条件。

```java
ThreadLocal<Integer> threadLocalVar = new ThreadLocal<>();

threadLocalVar.set(10);
int value = threadLocalVar.get();
```

- **并发集合**:使用`java.util.concurrent`包中的线程安全集合，如`ConcurrentHashMap`、`ConcurrentLinkedQueue`等，这些集合内部已经实现了线程安全的逻辑。
- **`JUC`工具类**: 使用`java.util.concurrent`包中的一些工具类可以用于控制线程间的同步和协作。例如：`Semaphore`和`CyclicBarrier`等。

##### [#](https://xiaolincoding.com/interview/juc.html#java中有哪些常用的锁-在什么场景下使用)`Java`中有哪些常用的锁，在什么场景下使用？

`Java`中的锁是用于管理多线程并发访问共享资源的关键机制。锁可以确保在任意给定时间内只有一个线程可以访问特定的资源，从而避免数据竞争和不一致性。Java提供了多种锁机制，可以分为以下几类：

- **内置锁（`synchronized`）**：`Java`中的`synchronized`关键字是内置锁机制的基础，可以用于方法或代码块。当一个线程进入`synchronized`代码块或方法时，它会获取关联对象的锁；当线程离开该代码块或方法时，锁会被释放。如果其他线程尝试获取同一个对象的锁，它们将被阻塞，直到锁被释放。其中，`syncronized`加锁时有无锁、偏向锁、轻量级锁和重量级锁几个级别。偏向锁用于当一个线程进入同步块时，如果没有任何其他线程竞争，就会使用偏向锁，以减少锁的开销。轻量级锁使用线程栈上的数据结构，避免了操作系统级别的锁。重量级锁则涉及操作系统级的互斥锁。
- **`ReentrantLock`**：`java.util.concurrent.locks.ReentrantLock`是一个显式的锁类，提供了比`synchronized`更高级的功能，如可**中断的锁等待、定时锁等待、公平锁选项**等。`ReentrantLock`使用`lock()`和`unlock()`方法来获取和释放锁。其中，公平锁按照线程请求锁的顺序来分配锁，保证了锁分配的公平性，但可能增加锁的等待时间。非公平锁不保证锁分配的顺序，可以减少锁的竞争，提高性能，但可能造成某些线程的饥饿。
- **读写锁（`ReadWriteLock`）**：`java.util.concurrent.locks.ReadWriteLock`接口定义了一种锁，允许多个读取者同时访问共享资源，但只允许一个写入者。读写锁通常用于读取远多于写入的情况，以提高并发性。
- **乐观锁和悲观锁**：悲观锁（`Pessimistic Locking`）通常指在访问数据前就锁定资源，假设最坏的情况，即数据很可能被其他线程修改。`synchronized`和`ReentrantLock`都是悲观锁的例子。乐观锁（`Optimistic Locking`）通常不锁定资源，而是在更新数据时检查数据是否已被其他线程修改。乐观锁常使用版本号或时间戳来实现。
- **自旋锁**：自旋锁是一种锁机制，线程在等待锁时会持续循环检查锁是否可用，而不是放弃CPU并阻塞。通常可以使用`CAS`来实现。这在锁等待时间很短的情况下可以提高性能，但过度自旋会浪费`CPU`资源。

##### （）偏向锁、轻量级锁和重量级锁的区别

在 Java 中，`synchronized` 关键字通过 **锁升级机制** 优化多线程竞争下的性能。锁的状态分为 **偏向锁**、**轻量级锁** 和 **重量级锁**，它们在不同场景下逐步升级，以平衡性能与线程安全。以下是它们的核心区别和原理：

|        **锁状态**         | **性能开销** | 目的                                                 |                         **实现原理**                         | **特点**                                                     |
| :-----------------------: | :----------: | ---------------------------------------------------- | :----------------------------------------------------------: | ------------------------------------------------------------ |
|    偏向锁（`Biased`）     |     极低     | 消除无竞争场景下的同步开销（如单线程反复加锁）       | 1.对象头中存储 **偏向线程ID** 和 **偏向时间戳**。 2.线程首次获取锁时，通过 `CAS` 将对象头标记为偏向自己。3. 后续加锁时，直接检查线程ID是否一致，无需同步。 | **升级**：其他线程尝试获取锁时，偏向锁被撤销，升级为轻量级锁 |
| 轻量级锁（`Lightweight`） |      低      | 在低并发场景下，避免线程阻塞（如线程交替执行同步块） | 1.线程在栈帧中创建 **锁记录（`Lock Record`）**，存储对象头的 `Mark Word`。 2.通过 `CAS` 将对象头的 `Mark Word` 替换为指向锁记录的指针。3. 若 `CAS` 成功，线程获得锁；若失败，说明存在竞争，**升级**为重量级锁。 | 特点：自旋尝试获取锁（避免立即阻塞）。 适用于 **锁占用时间短** 的场景。 |
| 重量级锁（`Heavyweight`） |      高      | 处理高并发场景下的线程竞争                           | **1.依赖操作系统提供的 互斥量（`Mutex`） 实现阻塞。 2.未获得锁的线程会被放入等待队列，由操作系统调度唤醒。** | 缺点：线程阻塞和唤醒涉及用户态与内核态切换，**性能开销大**。 适用于 **锁占用时间长** 或 **竞争激烈** 的场景。 |

##### [#](https://xiaolincoding.com/interview/juc.html#怎么在实践中用锁的)怎么在实践中用锁的？

Java提供了多种锁的实现，包括`synchronized`关键字、`java.util.concurrent.locks`包下的`Lock`接口及其具体实现如`ReentrantLock`、`ReadWriteLock`等。下面我们来看看这些锁的使用方式。

> 1. `synchronized`

`synchronized`关键字可以用于方法或代码块，它是Java中最早的锁实现，使用起来非常简单。

**示例：`synchronized`方法**

```java
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```

**示例：`synchronized`代码块**

```java
public class Counter {
    private Object lock = new Object();
    private int count = 0;

    public void increment() {
        synchronized (lock) {
            count++;
        }
    }
}
```

> 1. 使用`Lock`接口

`Lock`接口提供了比`synchronized`更灵活的锁操作，包括尝试锁、可中断锁、定时锁等。`ReentrantLock`是`Lock`接口的一个实现。

**示例：使用`ReentrantLock`**

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Counter {
    private Lock lock = new ReentrantLock();
    private int count = 0;

    public void increment() {
        lock.lock();
        try {
            count++;
        } finally {
            lock.unlock();
        }
    }
}
```

> 1. 使用`ReadWriteLock`

`ReadWriteLock`接口提供了一种读写锁的实现，允许多个读操作同时进行，但写操作是独占的。

**示例：使用`ReadWriteLock`**

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class Cache {
    private ReadWriteLock lock = new ReentrantReadWriteLock();
    private Lock readLock = lock.readLock();
    private Lock writeLock = lock.writeLock();
    private Object data;

    public Object readData() {
        readLock.lock();
        try {
            return data;
        } finally {
            readLock.unlock();
        }
    }

    public void writeData(Object newData) {
        writeLock.lock();
        try {
            data = newData;
        } finally {
            writeLock.unlock();
        }
    }
}
```

##### [#](https://xiaolincoding.com/interview/juc.html#java-并发工具你知道哪些)`Java` 并发工具你知道哪些？

`Java` 中一些常用的并发工具，它们位于 `java.util.concurrent` 包中，常见的有：

- **`CountDownLatch`**：`CountDownLatch` 是一个同步辅助类，它允许一个或多个线程等待其他线程完成操作。它使用一个计数器进行初始化，调用 `countDown()` 方法会使计数器减一，当计数器的值减为 0 时，等待的线程会被唤醒。可以把它想象成一个倒计时器，当倒计时结束（计数器为 0）时，等待的事件就会发生。示例代码：

```java
import java.util.concurrent.CountDownLatch;

public class CountDownLatchExample {
    public static void main(String[] args) throws InterruptedException {
        int numberOfThreads = 3;
        CountDownLatch latch = new CountDownLatch(numberOfThreads);

        // 创建并启动三个工作线程
        for (int i = 0; i < numberOfThreads; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + " 正在工作");
                try {
                    Thread.sleep(1000);  // 模拟工作时间
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                latch.countDown();  // 完成工作，计数器减一
                System.out.println(Thread.currentThread().getName() + " 完成工作");
            }).start();
        }

        System.out.println("主线程等待工作线程完成");
        latch.await();  // 主线程等待，直到计数器为 0
        System.out.println("所有工作线程已完成，主线程继续执行");
    }
}
```

- **`CyclicBarrier`**：`CyclicBarrier` 允许一组线程互相等待，直到到达一个公共的屏障点。当所有线程都到达这个屏障点后，它们可以继续执行后续操作，并且这个屏障可以被重置循环使用。与 `CountDownLatch` 不同，`CyclicBarrier` 侧重于线程间的相互等待，而不是等待某些操作完成。示例代码：

```java
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierExample {
    public static void main(String[] args) {
        int numberOfThreads = 3;
        CyclicBarrier barrier = new CyclicBarrier(numberOfThreads, () -> {
            System.out.println("所有线程都到达了屏障，继续执行后续操作");
        });

        for (int i = 0; i < numberOfThreads; i++) {
            new Thread(() -> {
                try {
                    System.out.println(Thread.currentThread().getName() + " 正在运行");
                    Thread.sleep(1000);  // 模拟运行时间
                    barrier.await();  // 等待其他线程
                    System.out.println(Thread.currentThread().getName() + " 已经通过屏障");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

- **Semaphore**：Semaphore 是一个计数信号量，用于控制同时访问某个共享资源的线程数量。通过 `acquire()` 方法获取许可，使用 `release()` 方法释放许可。如果没有许可可用，线程将被阻塞，直到有许可被释放。可以用来限制对某些资源（如数据库连接池、文件操作等）的并发访问量。代码如下：

```java
import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(2);  // 允许 2 个线程同时访问

        for (int i = 0; i < 5; i++) {
            new Thread(() -> {
                try {
                    semaphore.acquire();  // 获取许可
                    System.out.println(Thread.currentThread().getName() + " 获得了许可");
                    Thread.sleep(2000);  // 模拟资源使用
                    System.out.println(Thread.currentThread().getName() + " 释放了许可");
                    semaphore.release();  // 释放许可
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }).start();
        }
    }
}
```

- **Future 和 Callable**：Callable 是一个类似于 `Runnable` 的接口，但它可以返回结果，并且可以抛出异常。Future 用于表示一个异步计算的结果，可以通过它来获取 `Callable` 任务的执行结果或取消任务。代码如下：

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class FutureCallableExample {
    public static void main(String[] args) throws Exception {
        ExecutorService executorService = Executors.newSingleThreadExecutor();

        Callable<Integer> callable = () -> {
            System.out.println(Thread.currentThread().getName() + " 开始执行 Callable 任务");
            Thread.sleep(2000);  // 模拟耗时操作
            return 42;  // 返回结果
        };

        Future<Integer> future = executorService.submit(callable);
        System.out.println("主线程继续执行其他任务");

        try {
            Integer result = future.get();  // 等待 Callable 任务完成并获取结果
            System.out.println("Callable 任务的结果: " + result);
        } catch (Exception e) {
            e.printStackTrace();
        }

        executorService.shutdown();
    }
}
```

- **ConcurrentHashMap**：ConcurrentHashMap 是一个线程安全的哈希表，它允许多个线程同时进行读操作，在一定程度上支持并发的修改操作，避免了 `HashMap` 在多线程环境下需要使用 `synchronized` 或 `Collections.synchronizedMap()` 进行同步的性能问题。代码如下：

```java
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentHashMapExample {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
        map.put("key1", 1);
        map.put("key2", 2);

        // 并发读操作
        map.forEach((key, value) -> System.out.println(key + ": " + value));

        // 并发写操作
        map.computeIfAbsent("key3", k -> 3);
    }
}
```

##### [#](https://xiaolincoding.com/interview/juc.html#synchronized和reentrantlock及其应用场景)`synchronized`和`reentrantlock`及其应用场景？

###### 1 . `synchronized` 工作原理

从监视器、字节码、内存和源码层面来讲。

**监视器：**`synchronized`是`Java`提供的原子性内置锁，这种内置的并且使用者看不到的锁也被称为**监视器锁**,基于`monitor`（监视器）实现，

**字节码：**使用`synchronized`之后，会在编译之后在同步的代码块前后加上`monitorenter`和`monitorexit`字节码指令，他依赖操作系统底层互斥锁实现。他的作用主要就是实现原子性操作和解决共享变量的内存可见性问题。

执行`monitorenter`指令时会尝试获取对象锁，如果对象没有被锁定或者已经获得了锁，锁的计数器+1。**此时其他竞争锁的线程则会进入等待队列中**。执行`monitorexit`指令时则会把计数器-1，当计数器值为0时，则锁释放，处于等待队列中的线程再继续竞争锁。

`synchronized`是排它锁，当一个线程获得锁之后，其他线程必须等待该线程释放锁后才能获得锁，而且由于`Java`中的线程和操作系统原生线程是一一对应的，线程被阻塞或者唤醒时时会从用户态切换到内核态，这种转换非常消耗性能。

**内存：**从内存语义来说，加锁的过程会清除工作内存（工作内存即每个线程的虚拟机栈中的内存）中的共享变量，再从主内存读取，而释放锁的过程则是将工作内存中的共享变量写回主内存。

实际上大部分时候我认为说到`monitorenter`就行了，但是为了更清楚的描述，还是再具体一点。

**源码：**如果再深入到源码来说，`synchronized`实际上有两个队列`waitSet`和`entryList`。

1. 当多个线程进入同步代码块时，首先进入`entryList`
2. 有一个线程获取到`monitor`锁后，就赋值给当前线程（当前线程是内存中专门用于存放运行线程的地方，是另外一个地方），并且计数器`+1`
3. 如果线程调用`wait`方法，将释放锁，当前线程置为`null`，计数器`-1`，同时进入`waitSet`等待被唤醒，调用`notify`或者`notifyAll`之后又会进入`entryList`竞争锁
4. 如果线程执行完毕，同样释放锁，计数器`-1`，当前线程置为`null`

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1719918642412-181e3769-49d8-4c78-8f33-a866367a4693.png)

###### 2 . `reentrantlock`工作原理

`ReentrantLock` 的底层实现主要依赖于 `AbstractQueuedSynchronizer`（`AQS`）（抽象队列同步）这个抽象类。`AQS` 是一个提供了基本同步机制的框架，其中包括了队列、状态值等。

`ReentrantLock` 在 `AQS` 的基础上通过内部类 `Sync` 来实现具体的锁操作。不同的 `Sync` 子类实现了公平锁和非公平锁的不同逻辑：

**特点：可中断、可超时、可公平锁，多条件变量，可重入。**

- **可中断性**： `ReentrantLock` 实现了可中断性，这意味着线程在等待锁的过程中，可以被其他线程中断而提前结束等待。在底层，`ReentrantLock` 使用了与 `LockSupport.park()` 和 `LockSupport.unpark()` 相关的机制来实现可中断性。

```java
//ReentrantLock 提供了两种与中断相关的方法：
lockInterruptibly() //1 ：获取锁时允许被中断。
tryLock(long timeout, TimeUnit unit) //2 ：在超时时间内尝试获取锁，期间可被中断。
//如果线程在等待锁的过程中被中断（调用 Thread.interrupt()），会抛出 InterruptedException，并清除中断状态
ReentrantLock lock = new ReentrantLock();
try {
    lock.lockInterruptibly(); // 可被中断的锁获取
    // 临界区代码
} catch (InterruptedException e) {
    // 处理中断逻辑
    Thread.currentThread().interrupt(); // 恢复中断状态（可选）
} finally {
    if (lock.isHeldByCurrentThread()) {
        lock.unlock();
    }
}
```

`	ReentrantLock` 的中断能力依赖于 `AQS` 的底层实现。以下是关键步骤：

​	当调用 `lockInterruptibly()` 时，会触发 `AQS` 的 `acquireInterruptibly` 方法：1. 检查当前线程是否已被中断，中断则抛出异常，没有则继续；2. 尝试非阻塞获取锁（由子类实现）；3. 若失败，进入可中断的等待流程。

​	**`doAcquireInterruptibly` 方法**，这是 `AQS` 处理可中断锁请求的核心逻辑：1.将当前线程加入等待队列;2.死循环获取锁，获取则返回；3.如果没有获取到锁，则阻塞检查中断，被中断时抛出异常，否则继续死循环。

​	**`parkAndCheckInterrupt` 方法**，通过 `LockSupport.park()` 阻塞线程，并在唤醒后检查中断状态。

简单来讲：每次尝试获取锁都会检查中断状态，有个等待队列，自旋获取锁，自旋过后也会检查中断。

- **设置超时时间**： `ReentrantLock` 支持在尝试获取锁时设置超时时间，即等待一定时间后如果还未获得锁，则放弃锁的获取。这是通过内部的 `tryAcquireNanos` 方法来实现的。使用代码：`tryLock(long timeout, TimeUnit unit) `
- **公平锁和非公平锁**： 在直接创建 `ReentrantLock` 对象时，默认情况下是非公平锁。公平锁是按照线程等待的顺序来获取锁，而非公平锁则允许多个线程在同一时刻竞争锁，不考虑它们申请锁的顺序。公平锁可以通过在创建 `ReentrantLock` 时传入 `true` 来设置，例如：

```java
ReentrantLock fairLock = new ReentrantLock(true);
```

- **多个条件变量（`Condition`）**： `ReentrantLock` 支持多个条件变量，每个条件变量可以与一个 `ReentrantLock` 关联。这使得线程可以更灵活地进行等待和唤醒操作，而不仅仅是基于对象监视器的 `wait()` 和 `notify()`。多个条件变量的实现依赖于 `Condition` 接口，例如：

```java
ReentrantLock lock = new ReentrantLock();
Condition condition = lock.newCondition();
// 使用下面方法进行等待和唤醒
condition.await();
condition.signal();
```

- **可重入性**： `ReentrantLock` 支持可重入性，即同一个线程可以多次获得同一把锁，而不会造成死锁。这是通过内部的 `holdCount` 计数来实现的。当一个线程多次获取锁时，`holdCount` 递增，释放锁时递减，只有当 `holdCount` 为零时，其他线程才有机会获取锁。

###### 3 . 应用场景的区别

**`synchronized`**：

- **简单同步需求**： 当你需要对代码块或方法进行简单的同步控制时，`synchronized`是一个很好的选择。它使用起来简单，不需要额外的资源管理，因为锁会在方法退出或代码块执行完毕后自动释放。如`DCL`双重检查锁定就是用了`synchronized`。
- **代码块同步**： 如果你想对特定代码段进行同步，而不是整个方法，可以使用`synchronized`代码块。这可以让你更精细地控制同步的范围，从而减少锁的持有时间，提高并发性能。
- **内置锁的使用（类、对象和方法加锁）**： `synchronized`关键字使用对象的内置锁（也称为监视器锁），这在需要使用对象作为锁对象的情况下很有用，尤其是在对象状态与锁保护的代码紧密相关时。

**`ReentrantLock：`**

- **高级锁功能需求**： `ReentrantLock`提供了`synchronized`所不具备的高级功能，如**公平锁、响应中断、定时锁尝试、以及多个条件变量**。当你需要这些功能时，`ReentrantLock`是更好的选择。
- **性能优化**： 在高度竞争的环境中，`ReentrantLock`可以提供比`synchronized`更好的性能，因为它提供了更细粒度的控制，如尝试锁定（可中断）和定时锁定，可以减少线程阻塞的可能性。
- **复杂同步结构**： 当你需要更复杂的同步结构，如需要多个条件变量来协调线程之间的通信时，`ReentrantLock`及其配套的`Condition`对象可以提供更灵活的解决方案。

综上，`synchronized`适用于简单同步需求和不需要额外锁功能的场景，而`ReentrantLock`适用于需要更高级锁功能、性能优化或复杂同步逻辑的情况。选择哪种同步机制取决于具体的应用需求和性能考虑。

##### （重点）[#](https://xiaolincoding.com/interview/juc.html#synchronized和reentrantlock区别)`synchronized`和`reentrantlock`区别？

|        **对比项**         |                      **`synchronized`**                      |                     **`ReentrantLock`**                      |
| :-----------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|       **实现机制**        | `Java` 关键字，`JVM` 原生支持，隐式锁，通过监视器`monitor`实现的。 | `JDK` 提供的类（`java.util.concurrent.locks`），显式锁，基于 `AQS` 实现。 |
|    **锁的获取与释放**     |  自动获取和释放锁（进入同步代码块自动加锁，退出自动释放）。  | 需手动调用 `lock()` 加锁，`unlock()` 释放，通常在 `try-finally` 块中确保释放。 |
|       **可中断性**        |       ❌ **不支持**：等待锁时线程不可中断，会一直阻塞。       | ✅**支持**：通过 `lockInterruptibly()` 或 `tryLock(时间)` 实现可中断的锁获取。 |
|        **公平性**         | ❌ **非公平锁**：默认抢占机制，不保证等待时间最长的线程先获取锁。 | ✅**可选公平性**：构造函数可指定为公平锁（按等待顺序分配）或非公平锁。 |
| **条件变量（Condition）** | **单一等待队列**：通过 `wait()`/`notify()` 实现，只能有一个条件。 | ✅**多条件支持**：通过 `newCondition()` 创建多个条件，实现更细粒度的线程通信（如生产者-消费者模型）。 |
|       **超时机制**        |     ❌**不支持**：无法设置超时时间，只能阻塞等待或中断。      | ✅**支持**：通过 `tryLock(long timeout, TimeUnit unit)` 在指定时间内尝试获取锁。 |
|       **可重入性**        |            ✅**支持**：同一线程可重复获取同一锁。             | ✅**支持**：同一线程可重复获取同一锁，且可查询锁的持有次数（内部`getHoldCount()`计数来实现的）。 |
|         **性能**          | **优化后接近**：早期版本性能较差，`JDK 6` 后优化（偏向锁、轻量级锁等），性能与显式锁接近。 | **高竞争场景更优**：在极端高并发场景下，`ReentrantLock` 的吞吐量可能更高。 |
|        **灵活性**         |         **简单场景适用**：语法简洁，无需手动管理锁。         | **复杂控制场景适用**：支持中断、超时、公平性、多条件等高级功能。 |
|      **锁状态查询**       |        ❌**不支持**：无法查询锁是否被占用或持有次数。         | ✅**支持**：提供 `isLocked()`、`isHeldByCurrentThread()` 等方法。 |
|       **异常处理**        |    **自动释放锁**：同步块中抛出异常时，`JVM` 自动释放锁。    | **需手动释放**：必须在 `finally` 中调用 `unlock()`，否则可能导致死锁。 |
|       **适用场景**        |              简单同步需求（如单条件线程同步）。              |    复杂同步需求（如多条件、可中断、公平性、分布式锁等）。    |

- **用法不同**：`synchronized` 可用来修饰普通方法、静态方法和代码块，而 `ReentrantLock` 只能用在代码块上。

##### [#](https://xiaolincoding.com/interview/juc.html#怎么理解可重入锁)怎么理解`ReentrantLock`可重入锁？

可重入锁是指同一个线程在获取了锁之后，可以再次重复获取该锁而不会造成死锁或其他问题。当一个线程持有锁时，如果再次尝试获取该锁，就会成功获取而不会被阻塞。

`ReentrantLock`实现可重入锁的机制是基于线程持有锁的计数器 `holdCount` 。

- 当一个线程第一次获取锁时，计数器会加1，表示该线程持有了锁。在此之后，如果同一个线程再次获取锁，计数器会再次加1。每次线程成功获取锁时，都会将计数器加1。
- 当线程释放锁时，计数器会相应地减1。只有当计数器减到0时，锁才会完全释放，其他线程才有机会获取锁。

这种计数器的设计使得同一个线程可以多次获取同一个锁，而不会造成死锁或其他问题。每次获取锁时，计数器加1；每次释放锁时，计数器减1。只有当计数器减到0时，锁才会完全释放。

`ReentrantLock`通过这种计数器的方式，实现了可重入锁的机制。它允许同一个线程多次获取同一个锁，并且能够正确地处理锁的获取和释放，避免了死锁和其他并发问题。

##### [#](https://xiaolincoding.com/interview/juc.html#synchronized-支持重入吗-如何实现的)`synchronized` 支持重入吗？如何实现的?

`synchronized`是基于原子性的内部锁机制，是可重入的，因此在一个线程调用`synchronized`方法的同时在其方法体内部调用该对象另一个`synchronized`方法，也就是说一个线程得到一个对象锁后再次请求该对象锁，是允许的，这就是`synchronized`的可重入性。

`synchronized`底层是利用计算机系统`mutex Lock`（互斥锁）实现的。每一个可重入锁都会关联一个线程ID和一个锁状态`status`。

当一个线程请求方法时，会去检查锁状态。

1. 如果锁状态是0，代表该锁没有被占用，使用`CAS`操作获取锁，将线程ID替换成自己的线程ID。
2. 如果锁状态不是0，代表有线程在访问该方法。此时，如果线程ID是自己的线程ID，如果是可重入锁，会将status自增1，然后获取到该锁，进而执行相应的方法；如果是非重入锁，就会进入阻塞队列等待。

在释放锁时，

1. 如果是可重入锁的（不会直接释放锁），每一次退出方法，就会将status减1，直至status的值为0，最后释放该锁。（和`ReentrantLock`类似，内部持有了一个线程持有锁的计数器）
2. 如果非可重入锁的，线程退出方法，直接就会释放该锁。

##### [#](https://xiaolincoding.com/interview/juc.html#syncronized锁升级的过程讲一下)`syncronized`锁升级的过程讲一下

具体的锁升级的过程是：**无锁->偏向锁->轻量级锁->重量级锁**。

|        **锁状态**         |                         **触发条件**                         |                         **实现机制**                         |   **是否自旋**   | **性能开销** |          **适用场景**          |                           **备注**                           |
| :-----------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: | :--------------: | :----------: | :----------------------------: | :----------------------------------------------------------: |
|   **无锁;锁标志（01）**   |                对象初始化后未被任何线程锁定。                |        无特殊处理，对象头 `Mark Word` 存储默认信息。         |        否        |      无      |       无竞争的单线程操作       |                        锁升级的起点。                        |
|  **偏向锁;锁标志（01）**  | 首次被线程访问，且无竞争，通过 `CAS` 将对象头标记为偏向自己。（同一线程重复获取锁）。 | （如果还没有一个线程拿到这个锁的话，这个状态叫做匿名偏向。）`Mark Word` 记录偏向线程 ID（和时间戳），如果线程ID相同则直接获取锁（相当于锁偏向于这个线程）。 |        否        |     极低     | 单线程重复同步（如循环内加锁） | - JDK 6 默认启用，JDK 15 后默认禁用（`-XX:-UseBiasedLocking`）。 - 锁撤销需 STW 暂停线程。 |
| **轻量级锁;锁标志（00）** | - 偏向锁被撤销（其他线程竞争）。 - 或：禁用偏向锁时直接进入。 | 1.线程在虚拟机栈的栈帧中创建 **锁记录（`Lock Record`）**，存储对象头的 `Mark Word`。 2.**通过 `CAS` 将堆中对象头的 `Mark Word` 替换为指向锁记录的指针**。3. 自旋尝试获取锁（避免立即阻塞），若 `CAS` 成功，线程获得锁；若失败，说明存在竞争，**升级**为重量级锁。（4.在线程出临界区的时候（线程结束，将 `Mark Word`写回堆中），也需要使用`CAS`，如果使用`CAS`替换成功则同步成功，如果失败表示有其他线程在获取锁，那么就需要在释放锁之后将被挂起的线程唤醒。） | 是（自适应自旋） |      低      | 低竞争的多线程场景（短暂阻塞） | - 自旋失败（十次）后升级为重量级锁。 - 自旋次数由 JVM 动态调整。 |
| **重量级锁;锁标志（10）** |         - 轻量级锁自旋失败。 - 高竞争场景直接触发。          | 1.**`Mark Word` 指向操作系统管理的 `Monitor` 对象**（依赖操作系统提供的 互斥量（`Mutex`） 实现阻塞）。2. 未获取锁的线程进入阻塞队列，由操作系统调度唤醒。3.当有两个以上的线程获取锁的时候轻量级锁就会升级为重量级锁，因为CAS如果没有成功的话始终都在自旋，进行while循环操作，这是非常消耗CPU的，但是在升级为重量级锁之后，线程会被操作系统调度然后挂起，这可以节约CPU资源。 |        否        |      高      | 高竞争的多线程场景（长期阻塞） | - 依赖操作系统互斥量（Mutex），涉及用户态到内核态的切换。 - 锁释放后回到无锁状态。 |

了解完 4 种锁状态之后，我们就可以整体的来看一下锁升级的过程了。

```
初始状态（无锁）
   │
   ├── 无竞争 → 偏向锁（记录线程 ID）
   │       │
   │       └── 出现竞争 → 撤销偏向锁 → 轻量级锁（CAS 自旋）
   │                         │
   │                         └── 自旋失败 → 重量级锁（阻塞队列）
   │
   └── 禁用偏向锁/竞争直接发生 → 轻量级锁 → 自旋失败 → 重量级锁
```

 ![image.png](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1721808326210-cce43537-20e7-4b7d-bed3-737dc7904d9a.png) 

线程A进入 `synchronized` 开始抢锁，`JVM` 会判断当前是否是偏向锁的状态，如果是就会根据 `Mark Word` 中存储的线程 ID 来判断，当前线程A是否就是持有偏向锁的线程。如果是，则忽略 check，线程A直接执行临界区内的代码。

但如果 `Mark Word` 里的线程不是线程 A（不是偏向线程），就会通过自旋尝试获取锁，如果获取到了，就将 `Mark Word` 中的线程 ID 改为自己的; 如果竞争失败，就会立马撤销偏向锁，膨胀为轻量级锁。

后续的竞争线程都会通过自旋来尝试获取锁，如果自旋成功那么锁的状态仍然是轻量级锁。然而如果竞争失败，锁会膨胀为重量级锁，后续等待的竞争的线程都会被阻塞。

##### [#](https://xiaolincoding.com/interview/juc.html#jvm对synchornized的优化)`JVM`对`Synchornized`的优化？

`synchronized` 核心优化方案主要包含以下 4 个：

- **锁膨胀（锁的升级）**：`synchronized` 从无锁升级到偏向锁，再到轻量级锁，最后到重量级锁的过程，它叫做锁膨胀也叫做锁升级。`JDK 1.6` 之前，`synchronized` 是重量级锁，也就是说 `synchronized` 在释放和获取锁时都会从用户态转换成内核态，而转换的效率是比较低的。但有了锁膨胀机制（锁的升级）之后，`synchronized` 的状态就多了无锁、偏向锁以及轻量级锁了，这时候在进行并发操作时，大部分的场景都不需要用户态到内核态的转换了，这样就大幅的提升了 `synchronized` 的性能。
- **锁消除**：指的是在某些情况下，`JVM` 虚拟机如果检测不到某段代码被共享和竞争的可能性，就会将这段代码所属的同步锁消除掉，从而到底提高程序性能的目的。
- **锁粗化**：将多个连续的加锁、解锁操作连接在一起，扩展成一个范围更大的锁。
- **自适应自旋锁**：指通过自身循环，尝试获取锁的一种方式，优点在于它避免一些线程的挂起和恢复操作，因为挂起线程和恢复线程都需要从用户态转入内核态，这个过程是比较慢的，所以通过自旋的方式可以一定程度上避免线程挂起和恢复所造成的性能开销。

##### [#](https://xiaolincoding.com/interview/juc.html#介绍一下aqs)介绍一下`AQS`

`AQS`全称为`AbstractQueuedSynchronizer`，是Java中的一个抽象类。 `AQS`是一个用于构建锁、同步器、协作工具类的工具类（框架）。

`AQS`核心思想是，如果被请求的共享资源空闲，那么就将当前请求资源的线程设置为有效的工作线程，将共享资源设置为锁定状态；如果共享资源被占用，就需要一定的阻塞等待唤醒机制来保证锁分配。这个机制主要用的是`CLH`队列的变体实现的，将暂时获取不到锁的线程加入到队列中。（PS：怎么感觉和线程池类似啊？）

`CLH`：`Craig、Landin and Hagersten`队列，是单向链表，`AQS`中的队列是`CLH`变体的虚拟双向队列（`FIFO`），`AQS`是通过将每条请求共享资源的线程封装成一个节点来实现锁的分配。

主要原理图如下：

 <img src="https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1721809581196-7c09ce04-1429-4810-ade4-bb3098a9303d.png" alt="image.png" style="zoom:150%;" />

`AQS`使用一个`Volatile`的`int`类型的成员变量来表示同步状态，通过内置的`FIFO`队列来完成资源获取的排队工作，通过`CAS`完成对`State`值的修改。

AQS广泛用于控制并发流程的类，如下图：

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1720958362111-45aa351b-c338-4eb8-8dad-da5e6f95a3c3.png)

其中`Sync`是这些类中都有的内部类，其结构如下：

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1720958362187-35b5e5ef-04e0-44a6-b5f8-205f43df8847.png)

可以看到：`Sync`是`AQS`的实现。 `AQS`主要完成的任务：

- 同步状态（比如说计数器）的原子性管理；
- 线程的阻塞和解除阻塞；
- 队列的管理。

> `AQS`原理

`AQS`最核心的就是三大部分：

- 状态：`state`；
- `FIFO`队列：控制线程抢锁和配合的`FIFO`队列（双向链表）；
- 期望协作工具类去实现的  获取/释放  等重要方法（重写）。

**状态state**

- 这里`state`的具体含义，会根据具体实现类的不同而不同：比如在`Semapore`里，他表示剩余许可证的数量；在`CountDownLatch`里，它表示还需要倒数的数量；在`ReentrantLock`中，`state`用来表示“锁”的占有情况，包括可重入计数，当`state`的值为0的时候，标识该Lock不被任何线程所占有。
- `state`是`volatile`修饰的，并被并发修改，所以修改`state`的方法都需要保证线程安全，比如`getState`、`setState`以及`compareAndSetState`操作来读取和更新这个状态。这些方法都依赖于`unsafe`类。

**FIFO队列**

- 这个队列用来存放“等待的线程，`AQS`就是“排队管理器”，当多个线程争用同一把锁时，必须有排队机制将那些没能拿到锁的线程串在一起。当锁释放时，锁管理器就会挑选一个合适的线程来占有这个刚刚释放的锁。
- `AQS`会维护一个等待的线程队列，把线程都放到这个队列里，这个队列是双向链表形式。

**实现获取/释放等方法**

- 这里的获取和释放方法，是利用`AQS`的协作工具类里最重要的方法，是由协作类自己去实现的，并且含义各不相同；
- 获取方法：获取操作会以来`state`变量，经常会阻塞（比如获取不到锁的时候）。在`Semaphore`中，获取就是`acquire`方法，作用是获取一个许可证； 而在`CountDownLatch`里面，获取就是`await`方法，作用是等待，直到倒数结束；
- 释放方法：在`Semaphore`中，释放就是`release`方法，作用是释放一个许可证； 在`CountDownLatch`里面，获取就是`countDown`方法，作用是将倒数的数减一；
- 需要每个实现类重写`tryAcquire`和`tryRelease`等方法。

##### [#](https://xiaolincoding.com/interview/juc.html#threadlocal作用-原理-具体里面存的key-value是啥-会有什么问题-如何解决)`Threadlocal`作用，原理，具体里面存的`key valu`e是啥，会有什么问题，如何解决?

###### 1.`ThreadLocal`是什么

`ThreadLocal`是`Java`中用于解决线程安全问题的一种机制，它允许创建线程局部变量，即每个线程都有自己独立的变量副本，**从而避免了线程间的资源共享和同步问题。**

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1719982991053-c983c4b8-7c5f-4e2d-a90d-5b42ebd533d5.png)

从内存结构图，我们可以看到：

- `Thread`类中，有个`ThreadLocal.ThreadLocalMap` 的成员变量。
- `ThreadLocalMap`内部维护了`Entry`数组，每个`Entry`代表一个完整的对象，`key`**是**`ThreadLocal`**本身**，`value`是`ThreadLocal`的**泛型对象值**。

###### 2.`ThreadLocal`的作用

- **线程隔离**：`ThreadLocal`为每个线程提供了独立的变量副本，**这意味着线程之间不会相互影响**，**可以安全地在多线程环境中使用这些变量而不必担心数据竞争或同步问题。**
- **降低耦合度**：在同一个线程内的多个函数或组件之间，使用`ThreadLocal`可以减少参数的传递，降低代码之间的耦合度，使代码更加清晰和模块化。
- **性能优势**：由于`ThreadLocal`避免了线程间的同步开销，所以在大量线程并发执行时，相比传统的锁机制，它可以提供更好的性能。

###### 3.`ThreadLocal`的原理

`ThreadLocal`的实现依赖于`Thread`类中的一个`ThreadLocalMap`字段，这是一个存储`ThreadLocal`变量本身和对应值的映射。每个线程都有自己的`ThreadLocalMap`实例，用于存储该线程所持有的所有`ThreadLocal`变量的值。

当你创建一个`ThreadLocal`变量时，它实际上就是一个`ThreadLocal`对象的实例。每个`ThreadLocal`对象都可以存储任意类型的值，这个值对每个线程来说是独立的。

- 当调用`ThreadLocal`的`get()`方法时，`ThreadLocal`会检查当前线程的`ThreadLocalMap`中是否有与之关联的值。
- 如果有，返回该值；
- 如果没有，会调用`initialValue()`方法（如果重写了的话）来初始化该值，然后将其放入`ThreadLocalMap`中并返回。
- 当调用`set()`方法时，`ThreadLocal`会将给定的值与当前线程关联起来，即在当前线程的`ThreadLocalMap`中存储一个键值对，键是`ThreadLocal`对象自身，值是传入的值。
- 当调用`remove()`方法时，会从当前线程的`ThreadLocalMap`中移除与该`ThreadLocal`对象关联的条目。

###### 4.`ThreadLocal`可能存在的问题（内存泄露）

当一个线程结束时，其`ThreadLocalMap`也会随之销毁，但是`ThreadLocal`对象本身不会立即被垃圾回收，直到没有其他引用指向它为止。

因此，在使用`ThreadLocal`时需要注意，**如果不显式调用**`remove()`**方法，或者线程结束时未正确清理**`ThreadLocal`**变量，可能会导致内存泄漏，因为**`ThreadLocalMap`**会持续持有**`ThreadLocal`**变量的引用，即使这些变量不再被其他地方引用。**

因此，实际应用中需要在使用完`ThreadLocal`变量后调用`remove()`方法释放资源。

##### [#](https://xiaolincoding.com/interview/juc.html#悲观锁和乐观锁的区别)悲观锁和乐观锁的区别？

- 乐观锁： 就像它的名字一样，对于并发间操作产生的线程安全问题持乐观状态，乐观锁认为竞争不总 是会发生，因此它不需要持有锁，将 **比较-替换** 这两个动作作为一个原子操作尝试去修改内存中的变量，如果失败则表示发生冲突，那么就应该有相应的重试逻辑。如`CAS`操作
- 悲观锁： 还是像它的名字一样，对于并发间操作产生的线程安全问题持悲观状态，悲观锁认为竞争总 是会发生，因此每次对某资源进行操作时，都会持有一个独占的锁，就像 `synchronized`，不管三七二十一，直接上了锁就操作资源了。

##### [#](https://xiaolincoding.com/interview/juc.html#java中想实现一个乐观锁-都有哪些方式)`Java`中想实现一个乐观锁，都有哪些方式？

1. `CAS（Compare and Swap）`操作： `CAS` 是乐观锁的基础。`Java` 提供了 `java.util.concurrent.atomic` 包，包含各种原子变量类（如 `AtomicInteger、AtomicLong`），这些类使用 `CAS` 操作实现了线程安全的原子操作，可以用来实现乐观锁。
2. **版本号控制**：增加一个版本号字段记录数据更新时候的版本，每次更新时递增版本号。在更新数据时，同时比较版本号，若当前版本号和更新前获取的版本号一致，则更新成功，否则失败。（如集合中的快速失败机制，就是记录了 `modCount` ）
3. **时间戳**：使用时间戳记录数据的更新时间，在更新数据时，在比较时间戳。如果当前时间戳大于数据的时间戳，则说明数据已经被其他线程更新，更新失败。**（如偏向锁，记录了线程ID和时间戳，在释放资源时，如果时间戳对不上，那么就表示被并发修改了）**

##### [#](https://xiaolincoding.com/interview/juc.html#cas-有什么缺点)`CAS` 有什么缺点？

`CAS`的缺点主要有3点：

- **`ABA`问题**：`ABA`的问题指的是在`CAS`更新的过程中，当读取到的值是A，然后准备赋值的时候仍然是A，但是实际上有可能A的值被改成了B，然后又被改回了A，这个CAS更新的漏洞就叫做`ABA`。只是`ABA`的问题大部分场景下都不影响并发的最终效果。`Java`中有`AtomicStampedReference`来解决这个问题，他加入了预期标志和更新后标志两个字段，更新时不光检查值，还要检查当前的标志是否等于预期标志，全部相等的话才会更新。
- **循环时间长开销大**（自旋开销）：自旋`CAS`的方式如果长时间不成功，会给`CPU`带来很大的开销。
- **只能保证一个共享变量的原子操作**：只对一个共享变量操作可以保证原子性，但是多个则不行，多个可以通过`AtomicReference`来处理或者使用锁`synchronized`实现。

##### [#](https://xiaolincoding.com/interview/juc.html#为什么不能所有的锁都用cas)为什么不能所有的锁都用`CAS`？

`CAS`操作是基于循环重试的机制，如果`CAS`操作一直未能成功，线程会一直自旋重试，占用`CPU`资源。在高并发情况下，大量线程自旋会导致`CPU`资源浪费。高并发环境下使用重量级锁更合适。

##### [#](https://xiaolincoding.com/interview/juc.html#voliatle关键字有什么作用)`voliatle`关键字有什么作用？

`volatite`作用有 2 个：

- **保证变量对所有线程的可见性**。当一个变量被声明为`volatile`时，它会保证对这个变量的写操作会立即（从工作内存）刷新到主存中，而对这个变量的读操作会直接从主存中读取，从而确保了多线程环境下对该变量访问的可见性。这意味着一个线程修改了`volatile`变量的值，其他线程能够立刻看到这个修改，不会受到各自线程**工作内存**的影响。

- **禁止指令重排序优化**。`volatile`关键字在`Java`中主要通过内存屏障来禁止特定类型的指令重排序。

  一句话：写操作前，都操作后。保证在最新的记录上修改（类似git？）；保证读到最新的数据。

  - 1）**写-写（`Write-Write`）屏障**：在对`volatile`变量执行写操作之前，会插入一个**写屏障**。**这确保了在该变量写操作之前的所有普通写操作都已完成**，防止了这些写操作被移到`volatile`写操作之后。
  - 2）**读-写（`Read-Write`）屏障**：在对`volatile`变量执行读操作之后，会插入一个**读屏障**。它确保了对`volatile`变量的读操作之后的所有普通读操作都不会被提前到`volatile`读之前执行，**保证了读取到的数据是最新的。**
  - 3）**写-读（`Write-Read`）屏障**：这是最重要的一个屏障，它发生在`volatile`写之后和`volatile`读之前。这个屏障确保了`volatile`写操作之前的所有内存操作（包括写操作）都不会被重排序到`volatile`读之后，同时也确保了`volatile`读操作之后的所有内存操作（包括读操作）都不会被重排序到`volatile`写之前。

##### [#](https://xiaolincoding.com/interview/juc.html#指令重排序的原理是什么)指令重排序的原理是什么？

在执行程序时，为了提高性能，处理器和编译器常常会对指令进行重排序，但是重排序要满足下面 2 个条件才能进行：

- 在单线程环境下不能改变程序运行的结果
- 存在数据依赖关系的不允许重排序。

所以重排序不会对单线程有影响，只会破坏多线程的执行语义。

我们看这个例子，A和C之间存在数据依赖关系，同时B和C之间也存在数据依赖关系。因此在最终执行的指令序列中，C不能被重排序到A和B的前面，如果C排到A和B的前面，那么程序的结果将会被改变。但A和B之间没有数据依赖关系，编译器和处理器可以重排序A和B之间的执行顺序。

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1713773281425-83a5fe56-d964-4be5-8e55-9d81efee9285.png)

##### [#](https://xiaolincoding.com/interview/juc.html#volatile可以保证线程安全吗)`volatile`可以保证线程安全吗？

`volatile`关键字可以保证可见性，但不能保证原子性，因此不能完全保证线程安全。`volatile`关键字用于修饰变量，当一个线程修改了`volatile`修饰的变量的值，其他线程能够立即看到最新的值，从而避免了线程之间的数据不一致。

但是，`volatile`并不能解决多线程并发下的复合操作问题，比如`i++`这种操作不是原子操作，如果多个线程同时对`i`进行自增操作，`volatile`不能保证线程安全。对于复合操作，需要使用`synchronized`关键字或者`Lock`来保证原子性和线程安全。

##### [#](https://xiaolincoding.com/interview/juc.html#volatile和sychronized比较)`volatile`和`sychronized`比较？

`Synchronized`解决了多线程访问共享资源时可能出现的竞态条件和数据不一致的问题，保证了线程安全性（原子性）。`Volatile`解决了变量在多线程环境下的可见性和有序性问题，确保了变量的修改对其他线程是可见的。

- `Synchronized`: `Synchronized`是一种排他性的同步机制，保证了多个线程访问共享资源时的互斥性，即同一时刻只允许一个线程访问共享资源。通过对代码块或方法添加`Synchronized`关键字来实现同步。
- `Volatile`: `Volatil`e是一种轻量级的同步机制，用来保证变量的可见性和禁止指令重排序。当一个变量被声明为`Volatile`时，线程在读取该变量时会直接从内存中读取，而不会使用缓存，同时对该变量的写操作会立即刷回主内存，而不是缓存在本地内存中。

##### [#](https://xiaolincoding.com/interview/juc.html#什么是公平锁和非公平锁)什么是公平锁和非公平锁？

- **公平锁：** 指多个线程按照申请锁的顺序来获取锁，线程直接进入队列中排队，队列中的第一个线程才能获得锁。公平锁的优点在于各个线程公平平等，每个线程等待一段时间后，都有执行的机会，而它的缺点就在于整体执行速度更慢，吞吐量更小。如`ReentrantLock`。
- **非公平锁：** 多个线程加锁时直接尝试获取锁，能抢到锁到直接占有锁，抢不到才会到等待队列的队尾等待。非公平锁的优势就在于整体执行速度更快，吞吐量更大，但同时也可能产生线程饥饿问题，也就是说如果一直有线程插队，那么在等待队列中的线程可能长时间得不到运行（有一个线程完全得不到执行）。如`synchronized。`

##### [#](https://xiaolincoding.com/interview/juc.html#非公平锁吞吐量为什么比公平锁大)非公平锁吞吐量为什么比公平锁大？

- **公平锁执行流程**：获取锁时，先将线程自己添加到等待队列的队尾并休眠，当某线程用完锁之后，会去唤醒等待队列中队首的线程尝试去获取锁，锁的使用顺序也就是队列中的先后顺序，在整个过程中，线程会从运行状态切换到休眠状态，再从休眠状态恢复成运行状态，但线程每次休眠和恢复都需要从用户态转换成内核态，而这个状态的转换是比较慢的，所以公平锁的执行速度会比较慢。
- **非公平锁执行流程**：当线程获取锁时，会先通过 `CAS` 尝试获取锁，如果获取成功就直接拥有锁，如果获取锁失败才会进入等待队列，等待下次尝试获取锁。这样做的好处是，获取锁不用遵循先到先得的规则，从而避免了线程休眠和恢复的操作，这样就加速了程序的执行效率。

##### [#](https://xiaolincoding.com/interview/juc.html#synchronized是公平锁吗)`Synchronized`是公平锁吗？

`Synchronized`不属于公平锁，`ReentrantLock`是公平锁。

##### [#](https://xiaolincoding.com/interview/juc.html#reentrantlock是怎么实现公平锁的)`ReentrantLock`是怎么实现公平锁的？

一句话：公平锁无论如何都会到队列中排队（除非队列空），非公平锁会插队。

我们来看一下公平锁与非公平锁的加锁方法的源码。公平锁的锁获取源码如下：

```java
protected final boolean tryAcquire(int acquires) {

    final Thread current = Thread.currentThread();
    int c = getState();

    if (c == 0) {

        if (!hasQueuedPredecessors() && //这里判断了 hasQueuedPredecessors()
                compareAndSetState(0, acquires)) {
            
            setExclusiveOwnerThread(current);
            
            return true;
        }

    } else if (current == getExclusiveOwnerThread()) {

        int nextc = c + acquires;

        if (nextc < 0) {
            throw new Error("Maximum lock count exceeded");
        }
        setState(nextc);
        return true;

    }
    return false;
}
```

非公平锁的锁获取源码如下：

```java
final boolean nonfairTryAcquire(int acquires) {

    final Thread current = Thread.currentThread();
    int c = getState();

    if (c == 0) {

        if (compareAndSetState(0, acquires)) { //这里没有判断      hasQueuedPredecessors()

            setExclusiveOwnerThread(current);

            return true;

        }

    }

    else if (current == getExclusiveOwnerThread()) {

        int nextc = c + acquires;

        if (nextc < 0) // overflow

        throw new Error("Maximum lock count exceeded");

        setState(nextc);

        return true;

    }

    return false;

}
```

通过对比，我们可以明显的看出公平锁与非公平锁的 `lock()` 方法唯一的区别就在于公平锁在获取锁时多了一个限制条件：`hasQueuedPredecessors()` 为` false`，这个方法就是判断在等待队列中是否已经有线程在排队了。

这也就是公平锁和非公平锁的核心区别，**如果是公平锁，那么一旦已经有线程在排队了，当前线程就不再尝试获取锁**；对于非公平锁而言，无论是否已经有线程在排队，都会尝试获取一下锁，获取不到的话，再去排队。这里有一个特例需要我们注意，针对 `tryLock()` 方法，它不遵守设定的公平原则。

例如，当有线程执行 `tryLock()` 方法的时候，一旦有线程释放了锁，那么这个正在 `tryLock` 的线程就能获取到锁，即使设置的是公平锁模式，即使在它之前已经有其他正在等待队列中等待的线程，简单地说就是 `tryLock` 可以插队。

看它的源码就会发现：

```java
public boolean tryLock() {

    return sync.nonfairTryAcquire(1);

}
```

这里调用的就是 `nonfairTryAcquire()`，表明了是不公平的，和锁本身是否是公平锁无关。综上所述，公平锁就是会按照多个线程申请锁的顺序来获取锁，从而实现公平的特性。

非公平锁加锁时不考虑排队等待情况，直接尝试获取锁，所以存在后申请却先获得锁的情况，但由此也提高了整体的效率。

##### [#](https://xiaolincoding.com/interview/juc.html#什么情况会产生死锁问题-如何解决)什么情况会产生死锁问题？如何解决？

死锁只有**同时满足**以下四个条件才会发生：

- 互斥条件（一对一）：互斥条件是指**多个线程不能同时使用同一个资源**。
- 持有并等待条件（霸道，强势）：持有并等待条件是指，当线程 A 已经持有了资源 1，又想申请资源 2，而资源 2 已经被线程 C 持有了，所以线程 A 就会处于等待状态，但是**线程 A 在等待资源 2 的同时并不会释放自己已经持有的资源 1**。
- 不可剥夺条件：不可剥夺条件是指，当线程已经持有了资源 ，**在自己使用完之前不能被其他线程获取**，线程 B 如果也想使用此资源，则只能在线程 A 使用完并释放后才能获取。
- 环路等待条件（环路）：环路等待条件指的是，在死锁发生的时候，**两个线程获取资源的顺序构成了环形链**。

举一个不太恰当的例子：蓝牙耳机。

- （条件一：互斥）：一个耳机只可以连一个手机，多个手机不共享。
- （条件二：持有并等待，我称之为霸道）：现在我要连你的耳机，你要连我的耳机，并且谁都不愿意让步。
- （条件三：不可剥夺）：耳机有两个，无法分开用，必须一起用，在自己使用完之前不能被其他线程获取。
- （条件四：环路）：现在我要连你的耳机，你要连我的耳机。

例如，线程 A 持有资源 R1 并试图获取资源 R2，而线程 B 持有资源 R2 并试图获取资源 R1，此时两个线程相互等待对方释放资源，从而导致死锁。

```java
public class DeadlockExample {
    private static final Object resource1 = new Object();
    private static final Object resource2 = new Object();

    public static void main(String[] args) {
        Thread threadA = new Thread(() -> {
            synchronized (resource1) {
                System.out.println("Thread A acquired resource1");
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (resource2) {
                    System.out.println("Thread A acquired resource2");
                }
            }
        });

        Thread threadB = new Thread(() -> {
            synchronized (resource2) {
                System.out.println("Thread B acquired resource2");
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (resource1) {
                    System.out.println("Thread B acquired resource1");
                }
            }
        });

        threadA.start();
        threadB.start();
    }
}
```

避免死锁问题就只需要破环其中一个条件就可以，最常见的并且可行的就是**使用资源有序分配法，来破环环路等待条件**。

那什么是资源有序分配法呢？线程 A 和 线程 B 获取资源的顺序要一样，当线程 A 是先尝试获取资源 A，然后尝试获取资源 B 的时候，线程 B 同样也是先尝试获取资源 A，然后尝试获取资源 B。也就是说，线程 A 和 线程 B 总是以相同的顺序申请自己想要的资源。

![null](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1737006711792-cd31cdf7-f5e3-4091-8fb7-bde2d5f117bc.webp)





### 9.3  线程池

##### 介绍一下线程池的工作原理

线程池是为了减少频繁的创建线程和销毁线程带来的性能损耗，线程池的工作原理如下图：

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1719389039034-0de42388-4ec6-44a6-9583-5d018e5cb4f3.png)

线程池分为核心线程池，线程池的最大容量，还有等待任务的队列，提交一个任务，如果核心线程没有满，就创建一个线程，如果满了，就是会加入等待队列，如果等待队列满了，就会增加线程，如果达到最大线程数量，如果都达到最大线程数量，就会按照一些丢弃的策略进行处理。

任务执行流程如下：

```text
提交任务 → 核心线程是否已满？
  ├─ 未满 → 创建核心线程执行
  └─ 已满 → 任务入队
       ├─ 队列未满 → 等待执行
       └─ 队列已满 → 创建非核心线程
           ├─ 未达最大线程数 → 执行任务
           └─ 已达最大线程数 → 执行拒绝策略
```

##### [#](https://xiaolincoding.com/interview/juc.html#线程池的参数有哪些)线程池的参数有哪些？

线程池的构造函数有7个参数：

```java
public ThreadPoolExcutor(int corePoolSize, // 可以等于0
                         int maximumPoolSize, // maximumPoolSize 要大于等于1，同时也要大于或等于 corePoolSize
                         long keepAliveTime,
                         TimeUnit unit,
                         BlockingQueue<Runnable> workQueue,
                         ThreadFactory threadFactory,
                         RejectedExecutionHandler handler
                        ){}
```

- **`corePoolSize`**：线程池核心线程数量。默认情况下，线程池中线程的数量如果 <= `corePoolSize`，那么即使这些线程处于空闲状态，那也不会被销毁。
- **`maximumPoolSize`**：线程池中最多可容纳的线程数量。当一个新任务交给线程池，如果此时线程池中有空闲的线程，就会直接执行，如果没有空闲的线程且当前线程池的线程数量小于`corePoolSize`，就会创建新的线程来执行任务，否则就会将该任务加入到阻塞队列中，如果阻塞队列满了，就会创建一个新线程，从阻塞队列头部取出一个任务来执行，并将新任务加入到阻塞队列末尾。如果当前线程池中线程的数量等于`maximumPoolSize`，就不会创建新线程，就会去执行拒绝策略。
- **`keepAliveTime`**：当线程池中线程的数量大于`corePoolSize`，并且某个线程的空闲时间超过了`keepAliveTime`，那么这个线程就会被销毁。
- **`unit`**：就是`keepAliveTime`时间的单位。
- **`workQueue`**：工作队列。当没有空闲的线程执行新任务时，该任务就会被放入工作队列中，等待执行。
- **`threadFactory`**：线程工厂。可以用来给线程取名字等等。
- **`handler`**：拒绝策略。当一个新任务交给线程池，如果此时线程池中有空闲的线程，就会直接执行，如果没有空闲的线程，就会将该任务加入到阻塞队列中。如果阻塞队列满了，就会创建一个新线程（不大于最大线程），从阻塞队列头部取出一个任务来执行，并将新任务加入到阻塞队列末尾。如果当前线程池中线程的数量等于`maximumPoolSize`，就不会创建新线程，就会去执行拒绝策略。

##### [#](https://xiaolincoding.com/interview/juc.html#线程池工作队列满了有哪些拒接策略)线程池工作队列满了有哪些拒接策略？

当线程池的任务队列满了之后（同时线程数大于最大线程数），线程池会执行指定的拒绝策略来应对，常用的四种拒绝策略包括：`CallerRunsPolicy、AbortPolicy、DiscardPolicy、DiscardOldestPolicy`，此外，还可以通过实现`RejectedExecutionHandler`接口来自定义拒绝策略。

四种预置的拒绝策略：

- `AbortPolicy`（默认）：丢弃，直接抛出一个任务被线程池拒绝的异常`RejectedExcutionExcetion`。
- `DiscardPolicy`：丢弃，不抛异常，不推荐这种做法。
- `DiscardOldestPolicy`：丢弃最老的任务（队列最前方），然后执行该任务（将该任务加入到队列中）。
- `CallerRunsPolicy`：使用线程池的调用者所在的线程去执行被拒绝的任务（**调用任务的`run()`方法直接运行，绕过线程池直接运行**），除非线程池被停止或者线程池的任务队列已有空缺。
- 自定义拒绝策略，通过实现接口可以自定义任务拒绝策略。

单词：`Abort`：夭折、流产；`Discard`：丢弃；

##### [#](https://xiaolincoding.com/interview/juc.html#有线程池参数设置的经验吗)有线程池参数设置的经验吗？

核心线程数（`corePoolSize`）设置的经验：

- CPU密集型：`corePoolSize` = CPU核数 + 1（避免过多线程竞争CPU）；复杂计算，如`AES-256`、`MD5`的计算，各种加密解析计算。
- IO密集型：`corePoolSize` = CPU核数 x 2（或更高，具体看IO等待时间）；如文件读取、网络IO等。

场景一：电商场景（网络IO），特点瞬时高并发、任务处理时间短，线程池的配置可设置如下：

```java
new ThreadPoolExecutor(
    16,                     // corePoolSize = 16（假设8核CPU × 2）
    32,                     // maximumPoolSize = 32（突发流量扩容）
    10, TimeUnit.SECONDS,   // 非核心线程空闲10秒回收
    new SynchronousQueue<>(), // 不缓存任务，直接扩容线程
    new AbortPolicy()       // 直接拒绝，避免系统过载
);
```

说明：

- 使用`SynchronousQueue`确保任务直达线程，避免队列延迟。
- 拒绝策略快速失败，前端返回“活动火爆”提示，结合降级策略（如缓存预热）。

场景二：后台数据处理服务，特点稳定流量、任务处理时间长（秒级）、允许一定延迟，线程池的配置可设置如下：

```java
new ThreadPoolExecutor(
    8,                      // corePoolSize = 8（8核CPU）
    8,                      // maximumPoolSize = 8（禁止扩容，避免资源耗尽）
    0, TimeUnit.SECONDS,    // 不回收线程
    new ArrayBlockingQueue<>(1000), // 有界队列，容量1000
    new CallerRunsPolicy()  // 队列满后由调用线程执行
);
```

说明：

- 固定线程数避免资源波动，队列缓冲任务，拒绝策略兜底。
- 配合监控告警（如队列使用率>80%触发扩容）。

场景三：微服务`HTTP`请求处理，特点`IO`密集型、依赖下游服务响应时间，线程池的配置可设置如下：

```java
new ThreadPoolExecutor(
    16,                     // corePoolSize = 16（8核 × 2）
    64,                     // maximumPoolSize = 64（应对慢下游）
    60, TimeUnit.SECONDS,   // 非核心线程空闲60秒回收
    new LinkedBlockingQueue<>(200), // 有界队列容量200
    new CustomRetryPolicy() // 自定义拒绝策略（重试或降级）
);
```

说明：

- 根据下游RT（响应时间）调整线程数，队列防止瞬时峰值。
- 自定义拒绝策略将任务暂存`Redis`，异步重试。

##### [#](https://xiaolincoding.com/interview/juc.html#核心线程数设置为0可不可以)**核心线程数设置为0可不可以？**

可以，当核心线程数为0的时候，会创建一个非核心线程进行执行（要求最大线程数大于等于1）。

从下面的源码也可以看到，当核心线程数为 0 时，来了一个任务之后，会先将任务添加到任务队列，同时也会判断当前工作的线程数是否为 0，如果为 0，则会创建线程来执行线程池的任务。

![image-20240820113849549](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/image-20240820113849549.png)

##### [#](https://xiaolincoding.com/interview/juc.html#线程池种类有哪些)线程池种类有哪些？

- `newWorkStealingPool` 是 Java 8 引入的一种特殊线程池，它基于 **工作窃取算法（Work-Stealing Algorithm）** 实现，底层使用 `ForkJoinPool`（而不是传统的 `ThreadPoolExecutor`）。
- `FixedThreadPool`（固定）：它的核心线程数和最大线程数是一样的，所以可以把它看作是固定线程数的线程池，它的特点是线程池中的线程数除了初始阶段需要从 0 开始增加外，之后的线程数量就是固定的，就算任务数超过线程数，线程池也不会再创建更多的线程来处理任务，而是会把超出线程处理能力的任务放到任务队列中进行等待。（而且就算任务队列满了，到了本该继续增加线程数的时候，由于它的最大线程数和核心线程数是一样的，所以也无法再增加新的线程了。）`keepAliveTime = 0`，无空闲回收。
- `CachedThreadPool`（无限大）：可以称作可缓存线程池，它的特点在于线程数是几乎可以无限增加的（实际最大可以达到 `Integer.MAX_VALUE`，为 `2^31-1`，这个数非常大，所以基本不可能达到，**有可能会导致`OOM`**），而当线程闲置时还可以对线程进行回收。也就是说该线程池的线程数量不是固定不变的，当然它也有一个用于存储提交任务的队列，但这个队列是 `SynchronousQueue`，队列的容量为0，实际不存储任何任务，它只负责对任务进行中转和传递，所以效率比较高。
- `SingleThreadExecutor`（单线程）：它会使用唯一的线程去执行任务，原理和 `FixedThreadPool` 是一样的，只不过这里线程只有一个，如果线程在执行任务的过程中发生异常，线程池也会重新创建一个线程来执行后续的任务。这种线程池由于只有一个线程，所以非常适合用于所有任务都需要按被提交的顺序依次执行的场景，而前几种线程池不一定能够保障任务的执行顺序等于被提交的顺序，因为它们是多线程并行执行的。
- `ScheduledThreadPool`（周期任务）：可以设置定期的执行任务，它支持定时或周期性执行任务，比如每隔 10 秒钟执行一次任务，我通过这个实现类设置定期执行任务的策略。`keepAliveTime = 0`（不回收核心线程）
- `SingleThreadScheduledExecutor`（单线程+周期执行）：它实际和 `ScheduledThreadPool` 线程池非常相似，它只是 `ScheduledThreadPool` 的一个特例，内部只有一个线程。

##### （）源代码层面解释线程池。

以下是 `Executors` 类提供的 5 种线程池的源码实现及其关键参数分析，基于 `ThreadPoolExecutor` 或 `ScheduledThreadPoolExecutor` 的构造逻辑：

###### 1. **`newFixedThreadPool`**（固定）

```java
// 适用场景：任务量可控且需要严格限制线程数的场景（如服务器端请求处理）。
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(
        nThreads,                      // corePoolSize = 传入的线程数
        nThreads,                      // maximumPoolSize = 同corePoolSize（固定大小）
        0L,                            // keepAliveTime = 0（无空闲回收）
        TimeUnit.MILLISECONDS,
        new LinkedBlockingQueue<Runnable>()  // 无界队列，任务无限堆积（可能导致`OOM`内存溢出）。
    );
}
```

###### 2. **`newCachedThreadPool`**（无限大）

```java
// 适用场景：大量短生命周期任务（如HTTP请求）。
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(
        0,                             // corePoolSize = 0（核心线程可回收）
        Integer.MAX_VALUE,             // maximumPoolSize ≈ 无限制 ；线程数无上限：最大为 `Integer.MAX_VALUE`;
        // 问题：线程数可能暴涨，导致资源耗尽（可能导致`OOM`内存溢出）。
        60L,                           // keepAliveTime = 60秒（空闲线程回收）
        TimeUnit.SECONDS,
        new SynchronousQueue<Runnable>()  // 无缓冲队列（同步队列），任务直接传递给线程，无缓存。
    );
}
```

###### 3. **`newSingleThreadExecutor`**（单线程）

```java
// 适用场景：需保证任务顺序执行（如日志写入）。
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService(
        new ThreadPoolExecutor(
            1,                         // corePoolSize = 1（单线程）
            1,                         // maximumPoolSize = 1
            0L,                        // keepAliveTime = 0
            TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<Runnable>()  // 无界队列; 无界队列风险同 `newFixedThreadPool`,任务无限堆积。
        )
    );
}
```

###### 4. **`newScheduledThreadPool`**（周期任务）

```java
// 适用场景：定时任务（如 `scheduleAtFixedRate` 或 `scheduleWithFixedDelay`）。
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
}
// ScheduledThreadPoolExecutor 构造函数
public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(
        corePoolSize,                  // corePoolSize = 传入的线程数
        Integer.MAX_VALUE,             // maximumPoolSize ≈ 无限制。但核心线程数固定，非核心线程不会创建（因任务为延迟任务）。
        0,                             // keepAliveTime = 0（不回收核心线程）
        NANOSECONDS,
        new DelayedWorkQueue()         // 内部延迟队列，按延迟时间或周期排序。
    );
}
```

###### 5. **`newSingleThreadScheduledExecutor`**（单线程+周期执行）

```java
public static ScheduledExecutorService newSingleThreadScheduledExecutor() {
    return new DelegatedScheduledExecutorService(
        new ScheduledThreadPoolExecutor(1)  // 核心线程数 = 1
    );
}
```

- **单线程调度**：核心线程数为 1，其他逻辑同 `newScheduledThreadPool`。
- **适用场景**：单线程的定时或周期性任务。

6.`newWorkStealingPool`（**工作窃取算法**）

###### 源码设计总结表格

|                      线程池类型                       |     核心线程数      |     最大线程数      |       队列类型        |    适用场景     |
| :---------------------------------------------------: | :-----------------: | :-----------------: | :-------------------: | :-------------: |
|             `newFixedThreadPool`（固定）              | 固定（`nThreads`）  | 固定（`nThreads`）  | `LinkedBlockingQueue` |  固定并发控制   |
|            `newCachedThreadPool`（无限大）            |          0          | `Integer.MAX_VALUE` |  `SynchronousQueue`   |  短任务高吞吐   |
|          `newSingleThreadExecutor`（单线程）          |          1          |          1          | `LinkedBlockingQueue` | 单任务顺序执行  |
|         `newScheduledThreadPool`（周期任务）          |       自定义        | `Integer.MAX_VALUE` |  `DelayedWorkQueue`   | 定时/周期性任务 |
| `newSingleThreadScheduledExecutor`（单线程+周期执行） |          1          |          1          |  `DelayedWorkQueue`   | 单线程定时任务  |
|                 `newWorkStealingPool`                 | 自动（根据CPU数量） |                     |                       |                 |

###### **关键设计思想**

1. **线程复用**：通过 `corePoolSize` 和 `keepAliveTime` 控制线程生命周期。
2. **任务排队策略**：队列类型决定任务调度逻辑（如无界队列 vs 直接传递）。
3. **资源控制**：最大线程数防止资源耗尽（但 `newCachedThreadPool` 的 `Integer.MAX_VALUE` 需谨慎使用）。
4. **拒绝策略**：默认使用 `AbortPolicy`（抛异常），但可通过自定义 `RejectedExecutionHandler` 修改。

###### **使用建议**

- **避免无界队列**：优先使用有界队列（如 `ArrayBlockingQueue`）并设置合理的拒绝策略。
- **慎用 `newCachedThreadPool`**：仅在高并发短任务场景下使用。
- **定时任务**：直接使用 `ScheduledThreadPoolExecutor` 而非 `Timer`。

##### （）`newWorkStealingPool`（**工作窃取算法**）

###### `newWorkStealingPool`源码

```java
// 适用场景：适合处理 并行任务（尤其是分治任务或递归任务），在多核CPU环境下性能更优。
public static ExecutorService newWorkStealingPool() {
    // 默认并行度为CPU核心数
    return new ForkJoinPool(
        Runtime.getRuntime().availableProcessors(), // `parallelism` ：并行度（默认CPU核心数）
        ForkJoinPool.defaultForkJoinWorkerThreadFactory,// `factory` : 线程工厂（默认使用`ForkJoinPool`的内部工厂）
        null, // `handler` :  拒绝策略（默认为`null`，但`ForkJoinPool`有内置处理逻辑）
        true // `asyncMode` : 是否启用异步模式（`true`表示启用工作窃取）
    );
}
```

###### **工作窃取算法原理（重点）**

- 每个线程维护一个双端队列（`Deque`）
  - 线程从队列**头部**获取自己的任务。
  - 空闲线程从其他线程的队列**尾部**“**窃取**”任务（减少竞争）。（这是窃取算法的重点）
- 优势
  - **负载均衡**：避免某些线程空闲而其他线程过载。
  - **减少竞争**：任务窃取发生在队列尾部，与任务执行方向相反，减少锁冲突。

###### **适用场景**

- **分治任务（Fork-Join）**：递归拆解任务（如快速排序、归并排序）。
- **并行流（Parallel Stream）**：Java 8 Stream 的并行操作底层依赖`ForkJoinPool`。
- **CPU密集型任务**：需要充分利用多核CPU资源的场景。

###### **代码示例**

```java
ExecutorService executor = Executors.newWorkStealingPool();

// 提交并行任务
executor.submit(() -> {
    // 分治逻辑（如ForkJoinTask）
});

executor.shutdown();
```

###### **对比传统线程池**

|       特性       |    `newWorkStealingPool`（`ForkJoinPool`）     |  传统线程池（`ThreadPoolExecutor`）  |
| :--------------: | :--------------------------------------------: | :----------------------------------: |
|   **任务调度**   |     工作窃取算法（从其他线程队列尾部窃取）     |    固定队列（如FIFO或优先级队列）    |
|   **线程管理**   | 自动负载均衡（避免某些线程空闲而其他线程过载） |    需手动配置核心线程数和队列容量    |
| **适用任务类型** |               并行任务、递归任务               |          独立任务、顺序任务          |
|  **默认并行度**  |                 等于CPU核心数                  | 需手动配置（如`newFixedThreadPool`） |
|   **资源占用**   |               更高效利用多核CPU                |      可能因队列阻塞导致资源浪费      |

###### **注意事项**

- **任务划分**：需要合理拆解任务（如使用`RecursiveTask`或`RecursiveAction`），否则无法发挥优势。
- **IO密集型任务**：工作窃取算法对CPU密集型任务更有效，IO阻塞场景可能不如其他线程池。
- **调试复杂性**：由于任务动态调度，线程堆栈信息可能更难追踪。
- **全局共享**：`ForkJoinPool` 是全局共享的（通过 `commonPool()`），需注意任务间的资源竞争。

###### **为什么选择 `ForkJoinPool`？**

Java标准库中的 `ForkJoinPool` 专门为分治任务优化，解决了传统线程池在并行任务中的以下问题：

1. **任务拆分与合并**：支持自动递归拆分任务（`fork()`）和结果合并（`join()`）。
2. **高效调度**：工作窃取算法减少线程空闲时间。
3. **避免饥饿**：**窃取机制确保所有线程尽可能处于工作状态。**

###### **总结`newWorkStealingPool`**

- **使用场景**：优先用于高度并行的计算密集型任务（如递归、分治、并行流）。
- **避坑指南**：避免在IO阻塞或任务粒度不均的场景中使用。
- **性能优势**：在多核CPU环境下，性能显著优于传统线程池。

##### （）线程池阻塞队列有哪些类型？

|          **类型**           | **线程池示例**                                               |                           **特点**                           |     **规则**     |                         **适用场景**                         |                         **注意事项**                         |
| :-------------------------: | ------------------------------------------------------------ | :----------------------------------------------------------: | :--------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|  **`ArrayBlockingQueue`**   | `newFixedThreadPool`（固定）（需指定容量）                   |              基于数组的**有界队列**，容量固定。              | FIFO（先进先出） | 需控制任务数量，避免内存溢出。和`LinkedBlockingQueue`的区别是不会导致内存溢出。 |                    队列满时触发拒绝策略。                    |
|  **`LinkedBlockingQueue`**  | `newFixedThreadPool`（固定）、`newSingleThreadExecutor`（单线程） |           基于链表的**可选有界队列**（默认无界）。           | FIFO（先进先出） | 默认用于`newFixedThreadPool`和`newSingleThreadExecutor`，任务处理速度快时适用。 |  默认无界可能导致内存耗尽；有界时类似`ArrayBlockingQueue`。  |
|   **`SynchronousQueue`**    | `newCachedThreadPool`（无限大）                              |             **不存储元素**，直接传递任务给线程。             |      无缓存      |       高吞吐、短任务场景（如`newCachedThreadPool`）。        | 线程数不足时立即创建新线程；无空闲线程且线程数达上限时拒绝任务。可能导致`OOM`。 |
| **`PriorityBlockingQueue`** | 自定义线程池（如果需要优先级）                               | **无界队列**，支持任务优先级（自然排序或自定义`Comparator`）。 |   按优先级排序   |          需优先处理高优先级任务（如VIP用户请求）。           |          任务需实现`Comparable`或提供`Comparator`。          |
|   **`DelayedWorkQueue`**    | `newScheduledThreadPool`（周期任务）                         |      **内部实现**，专用于定时任务（延迟或周期性任务）。      |  按延迟时间排序  |          定时任务调度（如`scheduleAtFixedRate`）。           |          任务需实现`RunnableScheduledFuture`接口。           |



##### [#](https://xiaolincoding.com/interview/juc.html#线程池一般是怎么用的)线程池一般是怎么用的？

`Java` 中的 `Executors` 类定义了一些快捷的工具方法，来帮助我们快速创建线程池。《阿里巴巴 Java 开发手册》中提到，禁止使用这些方法来创建线程池，而应该手动` new ThreadPoolExecutor `来创建线程池。这一条规则的背后，是大量血淋淋的生产事故，最典型的就是 `newFixedThreadPool`（固定） 和 `newCachedThreadPool`（无限大），可能因为资源耗尽导致 `OOM` 问题。

所以，不建议使用 `Executors` 提供的两种快捷的线程池，原因如下：

- **参数可控：**我们需要根据自己的场景、并发情况来评估线程池的几个核心参数，包括核心线程数、最大线程数、线程回收策略、工作队列的类型，以及拒绝策略，确保线程池的工作行为符合需求，一般都需要设置有界的工作队列和可控的线程数。
- **线程池名称：**任何时候，都应该为自定义线程池指定有意义的名称，以方便排查问题。当出现线程数量暴增、线程死锁、线程占用大量 CPU、线程执行出现异常等问题时，我们往往会抓取线程栈。此时，有意义的线程名称，就可以方便我们定位问题。

除了建议手动声明线程池以外，我还建议用一些监控手段来观察线程池的状态。线程池这个组件往往会表现得任劳任怨、默默无闻，除非是出现了拒绝策略，否则压力再大都不会抛出一个异常。如果我们能提前观察到线程池队列的积压，或者线程数量的快速膨胀，往往可以提早发现并解决问题。

##### [#](https://xiaolincoding.com/interview/juc.html#线程池中shutdown-shutdownnow-这两个方法有什么作用)线程池中`shutdown ()`，`shutdownNow()`这两个方法有什么作用？

从下面的源码【高亮】注释可以很清晰的看出两者的区别：

- `shutdown`使用了以后会置状态为`SHUTDOWN`，正在执行的任务会继续执行下去，没有被执行的则中断。此时，则不能再往线程池中添加任何任务，否则将会抛出 `RejectedExecutionException` 异常
- 而 `shutdownNow` 为`STOP`，并试图停止所有正在执行的线程，不再处理还在池队列中等待的任务，当然，它会返回那些未执行的任务。 它试图终止线程的方法是通过调用 `Thread.interrupt()` 方法来实现的，但是这种方法的作用有限，如果线程中没有`sleep` 、`wait`、`Condition`、定时锁等应用, `interrupt()`方法是无法中断当前的线程的。所以，`ShutdownNow()`并不代表线程池就一定立即就能退出，它可能必须要等待所有正在执行的任务都执行完成了才能退出。

**`shutdown` 源码：**

```java
public void shutdown() {
	final ReentrantLock mainLock = this.mainLock;
	mainLock.lock();
	try {
		checkShutdownAccess();
		// 高亮
		advanceRunState(SHUTDOWN);
		interruptIdleWorkers();
		onShutdown();
	} finally {
		mainLock.unlock();
	}
	tryTerminate();
}
```

**`shutdownNow` 源码：**

```java
public List<Runnable> shutdownNow() {
	List<Runnable> tasks;
	final ReentrantLock mainLock = this.mainLock;
	mainLock.lock();
	try {
		checkShutdownAccess();
		// 高亮
		advanceRunState(STOP);
		interruptWorkers();
		// 高亮
		tasks = drainQueue();
	} finally {
		mainLock.unlock();
	}
	tryTerminate();
	// 高亮
	return tasks;
}
```

##### [#](https://xiaolincoding.com/interview/juc.html#提交给线程池中的任务可以被撤回吗)提交给线程池中的任务可以被撤回吗？

可以，当向线程池提交任务时，会得到一个`Future`对象。这个`Future`对象提供了几种方法来管理任务的执行，包括取消任务。

取消任务的主要方法是`Future`接口中的`cancel(boolean mayInterruptIfRunning)`方法。这个方法尝试取消执行的任务。参数`mayInterruptIfRunning`指示是否允许中断正在执行的任务。如果设置为`true`，则表示如果任务已经开始执行，那么允许中断任务；如果设置为`false`，任务已经开始执行则不会被中断。

```java
public interface Future<V> {
    // 是否取消线程的执行
    boolean cancel(boolean mayInterruptIfRunning);
    // 线程是否被取消
    boolean isCancelled();
    //线程是否执行完毕
    boolean isDone();
      // 立即获得线程返回的结果
    V get() throws InterruptedException, ExecutionException;
      // 延时时间后再获得线程返回的结果
    V get(long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException;
}
```

取消线程池中任务的方式，代码如下，通过 `future` 对象的 `cancel(boolean)` 函数来定向取消特定的任务。

```java
public static void main(String[] args) {
        ExecutorService service = Executors.newSingleThreadExecutor();
        Future future = service.submit(new TheradDemo()); // 当向线程池提交任务时，会得到一个`Future`对象

        try {
            // 可能抛出异常
            future.get(); // 阻塞式获取返回结果
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }finally {
            //终止任务的执行
            future.cancel(true);
        }
 }
```



### 9.4  异步编程  `Future` & `CompletableFuture`

Future



### 9.6  场景

##### [#](https://xiaolincoding.com/interview/juc.html#多线程打印奇偶数-怎么控制打印的顺序)多线程打印奇偶数，怎么控制打印的顺序

可以利用wait()和notify()来控制线程的执行顺序。

以下是一个基于这种方法的简单示例：

```java
public class PrintOddEven {
    private static final Object lock = new Object();
    private static int count = 1;
    private static final int MAX_COUNT = 10;

    public static void main(String[] args) {
        Runnable printOdd = () -> {
            synchronized (lock) {
                while (count <= MAX_COUNT) {
                    if (count % 2 != 0) {
                        System.out.println(Thread.currentThread().getName() + ": " + count++);
                        lock.notify();
                    } else {
                        try {
                            lock.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        };

        Runnable printEven = () -> {
            synchronized (lock) {
                while (count <= MAX_COUNT) {
                    if (count % 2 == 0) {
                        System.out.println(Thread.currentThread().getName() + ": " + count++);
                        lock.notify();
                    } else {
                        try {
                            lock.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        };

        Thread oddThread = new Thread(printOdd, "OddThread");
        Thread evenThread = new Thread(printEven, "EvenThread");

        oddThread.start();
        evenThread.start();
    }
}
```

在上面的示例中，通过一个共享的锁对象lock来控制两个线程的交替执行。一个线程负责打印奇数，另一个线程负责打印偶数，通过wait()和notify()方法来在两个线程之间实现顺序控制。当当前应该打印奇数时，偶数线程会进入等待状态，反之亦然。

- 创建 3 个并发执行的线程，在每个线程的任务结束时调用 `countDown` 方法将计数器减 1。
- 创建第 4 个线程，使用 `await` 方法等待计数器为 0，即等待其他 3 个线程完成任务。

```java
import java.util.concurrent.CountDownLatch;

public class CountDownLatchExample {
    public static void main(String[] args) {
        // 创建一个 CountDownLatch，初始计数为 3
        CountDownLatch latch = new CountDownLatch(3);

        // 创建并启动 3 个并发线程
        for (int i = 0; i < 3; i++) {
            final int threadNumber = i + 1;
            new Thread(() -> {
                try {
                    System.out.println("Thread " + threadNumber + " is working.");
                    // 模拟线程执行任务
                    Thread.sleep((long) (Math.random() * 1000));
                    System.out.println("Thread " + threadNumber + " has finished.");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    // 任务完成后，计数器减 1
                    latch.countDown();
                }
            }).start();
        }

        // 创建并启动第 4 个线程，等待其他 3 个线程完成
        new Thread(() -> {
            try {
                System.out.println("Waiting for other threads to finish.");
                // 等待计数器为 0
                latch.await();
                System.out.println("All threads have finished, this thread starts to work.");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
```

**代码解释**：

- 首先，创建了一个 `CountDownLatch` 对象 `latch`，并将其初始计数设置为 3。
- 然后，使用 `for` 循环创建并启动 3 个线程。每个线程会执行一些工作（这里使用 `Thread.sleep` 模拟），在工作完成后，会调用 `latch.countDown()` 方法，将 `latch` 的计数减 1。
- 最后，创建第 4 个线程。这个线程在开始时调用 `latch.await()` 方法，它会阻塞，直到 `latch` 的计数为 0，即前面 3 个线程都调用了 `countDown()` 方法。一旦计数为 0，该线程将继续执行后续任务。

##### [#](https://xiaolincoding.com/interview/juc.html#单例模型既然已经用了synchronized-为什么还要在加volatile)单例模型既然已经用了synchronized，为什么还要在加volatile？

使用 `synchronized` 和 `volatile` 一起，可以创建一个既线程安全又能正确初始化的单例模式，避免了多线程环境下的各种潜在问题。这是一种比较完善的线程安全的单例模式实现方式，尤其适用于高并发环境。

```java
public class Singleton {
    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

`synchronized` 关键字的作用用于确保在多线程环境下，只有一个线程能够进入同步块（这里是 `synchronized (Singleton.class)`）。在创建单例对象时，通过 `synchronized` 保证了创建过程的线程安全性，避免多个线程同时创建多个单例对象。

`volatile` 确保了对象引用的可见性和创建过程的有序性，避免了由于指令重排序而导致的错误。

`instance = new Singleton();` 这行代码并不是一个原子操作，它实际上可以分解为以下几个步骤：

- 分配内存空间。
- 实例化对象。
- 将对象引用赋值给 `instance`。

由于 Java 内存模型允许编译器和处理器对指令进行重排序，在没有 `volatile` 的情况下，可能会出现重排序，例如先将对象引用赋值给 `instance`，但对象的实例化操作尚未完成。

这样，其他线程在检查 `instance == null` 时，会认为单例已经创建，从而得到一个未完全初始化的对象，导致错误。

`volatile` 可以保证变量的可见性和禁止指令重排序。它确保对 `instance` 的修改对所有线程都是可见的，并且保证了上述三个步骤按顺序执行，避免了在单例创建过程中因指令重排序而导致的问题。

##### （）volatile和sychronized如何实现单例模式

```java
public class SingleTon {

    // volatile 关键字修饰变量 防止指令重排序
    private static volatile SingleTon instance = null;
    private SingleTon(){}
     //双重检查锁定（Double-Checked Locking）
    public static  SingleTon getInstance(){
        if(instance == null){
            //同步代码块 只有在第一次获取对象的时候会执行到 ，第二次及以后访问时 instance变量均非null故不会往下执行了 直接返回啦
//具体来说，双重检查锁定中的第二次检查是为了防止多个线程在第一次检查时都发现 instance 为 null，从而进入同步代码块，导致多次创建实例。
//两个线程都进入了这里，但只有一个线程会进入下边进行实例化操作。然后第二个线程依旧会进入下边的同步代码块，但是这个时候以及实例化了，故第二个线程就会退出，保证了线程安全。
            synchronized(SingleTon.class){
                // 为什么执行第二次检查
                if(instance == null){
                    instance = new SingleTon();
                }
            }
        }
        return instance;
    }
}
```

正确的双重检查锁定模式需要需要使用 volatile。volatile主要包含两个功能。

- 保证可见性。使用 volatile 定义的变量，将会保证对所有线程的可见性。
- 禁止指令重排序优化。

由于 volatile 禁止对象创建时指令之间重排序，所以其他线程不会访问到一个未初始化的对象，从而保证安全性。

