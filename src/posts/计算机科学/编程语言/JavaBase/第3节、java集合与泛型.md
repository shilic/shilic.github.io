# 第3节、java集合与泛型

### 3.0 总结

集合框架总结表

集合：**`ArrayList`**、**`LinkedList`**、**`HashSet`**、**`TreeSet`**、**`HashMap`**、**`TreeMap`**、**`LinkedHashMap`**、**`CopyOnWriteArrayList`**、**`ConcurrentHashMap `**、**`HashTable `**

特点：线程安全、有序、元素重复、可空、父类、扩容机制

总结：

`Tree`和`hash`：`Tree`开头的集合实现`comparable`接口，或自定义 `Comparator` 比较器保证有序和不重复；而`hash`开头的集合依赖 `equals()` 和 `hashCode()`保证不重复，都是无序的。

有序：`List`、以及`Tree`开头的和`Linked`开头的都是有序的,`List`基于数组实现有序，`Tree`基于`comparable`接口实现有序，`Linked`基于链表实现有序。

重复：基于`List`都可以重复，基于`Set`和`Map`都不重复。

可空：基于`List`都可空；基于`Set`和`Map`原则上也是不可空，特例是`hash`开头的允许一个 `null` 键，和多个 `null` 值；**`ConcurrentHashMap `**和**`HashTable `**都不可空；





|                            | 线程安全                                                | 有序吗                                                      | 元素重复吗                                        | 可空吗                                                       | 父类是？                                                | 扩容机制？                                                   |
| :------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ |
| **`ArrayList`**            | ❌不安全                                                 | ✅插入顺序                                                   | ✅可重复                                           | ✅任意数量的空值                                              | 继承 `AbstractList`，实现 `List`                        | 默认`10`，每次扩容原来的`1.5`倍                              |
| **`LinkedList`**           | ❌不安全                                                 | ✅插入顺序                                                   | ✅可重复                                           | ✅任意数量的空值                                              | 继承 `AbstractList`，实现 `List` 和 `Deque`             | ❌无需扩容，链表节点动态新增                                  |
| **`HashSet`**              | ❌不安全                                                 | ❌无序                                                       | ❌不重复，依赖 `equals()` 和 `hashCode()`          | ✅可存储一个 `null` 元素                                      | 基于 `HashMap`，继承 `AbstractSet`，实现 `Set`          | 默认初始容量 `16`，加载因子 `0.75`，扩容`2`倍                |
| **`TreeSet`**              | ❌不安全                                                 | ✅自然顺序（实现`comparable`接口）或自定义 `Comparator` 排序 | ❌元素实现`comparable`接口保证有序和不重复         | ❌自然排序（实现`comparable`接口）会抛异常；若自定义比较器`Comparator` ，则可空 | 基于 `TreeMap`，继承 `AbstractSet`，实现 `NavigableSet` | ❌基于红黑树动态调整，无固定扩容策略                          |
| **`HashMap`**              | ❌不安全                                                 | ❌无序                                                       | ❌不允许重复键,（依赖 `equals()` 和 `hashCode()`） | ✅允许一个 `null` 键，和多个 `null` 值                        | 继承 `AbstractMap`，实现 `Map`                          | 默认初始容量 `16`，加载因子 `0.75`，扩容`2`倍                |
| **`TreeMap`**              | ❌不安全                                                 | ✅自然顺序（实现`comparable`接口）或自定义 `Comparator` 排序 | ❌元素实现`comparable`接口保证有序和不重复         | ❌键不允许 `null`（自然排序会抛异常），值允许 `null`          | 继承 `AbstractMap`，实现 `NavigableMap`                 | ❌基于红黑树动态调整，无固定扩容策略                          |
| **`LinkedHashMap`**        | ❌不安全                                                 | ✅默认插入顺序，可配置为访问顺序（适合 `LRU` 缓存）          | ❌不重复                                           | ✅允许一个 `null` 键，和多个 `null` 值                        | 继承 `HashMap`，实现 `Map`                              | 同 `HashMap`，但额外维护双向链表记录顺序                     |
| **`CopyOnWriteArrayList`** | ✅（写操作时复制新数组，使用 `ReentrantLock` 同步）      | ✅插入顺序有序                                               | ✅允许重复                                         | ✅允许存储 `null`                                             | 直接实现 `List`                                         | 每次修改时创建新数组，旧数组引用替换为新数组                 |
| **`ConcurrentHashMap `**   | ✅是（分段锁/`CAS` + `synchronized`，Java 8+ 优化）      | ❌无序                                                       | ❌不重复                                           | ❌键和值均不允许 `null`（避免歧义）                           | 继承 `AbstractMap`，实现 `ConcurrentMap`                | 分段扩容（多线程协作），加载因子 `0.75`，容量翻倍            |
| **`HashTable `**           | ✅是（全表锁，`synchronized` 修饰方法，性能差）          | ❌无序                                                       | ❌不重复                                           | ❌键和值均不允许 `null`（会抛 `NullPointerException`）        | 继承 `Dictionary`（已过时）                             | 初始容量 `11`，加载因子 `0.75`，扩容为 `2n + 1`              |
| **`Vector`**               | ✅是（所有方法用 `synchronized` 修饰，全表锁，性能较低） | ✅插入顺序有序（基于动态数组）                               | ✅允许重复                                         | ✅允许存储 `null`                                             | 继承 `AbstractList`，实现 `List`                        | 初始容量默认 `10`，容量不足时默认按 **`2` 倍**扩容（可通过构造函数指定扩容增量） |
| **`Stack`**                | ✅是（继承自 `Vector`，方法用 `synchronized` 修饰）      | ✅先进后出（`LIFO`，栈结构）                                 | ✅允许重复                                         | ✅允许存储 `null`                                             | 继承 `Vector`                                           | 同 `Vector`（默认 `2` 倍扩容）                               |



### 3.1  概念

##### （） 请聊一下`java`的集合类,以及在实际项目中你是如何用的  `TODO`

> [!CAUTION]
>
> 具体到项目，别空谈，集合类说说就行了，重点是项目。例如`glide`使用了 `WeakHashMap `来做图片缓存，`retrofit`使用了`concurrentHashMap`存反射的解析结果。



谈集合体系，各自的接口、实现类，比较常用的类。

谈高并发集合类

谈集合的并发流

##### 集合类是怎么解决高并发中的问题? `TODO`

思路 先说一下那些是非安全，普通的安全的集合类；`JUC`中高并发的集合类

> [!NOTE]
>
> 线程非安全的集合类 ：

- `ArrayList` 、`LinkedList` 、`HashSet` 、`TreeSet`、 `HashMap` 、`TreeMap` 实际开发中我们自己用这样的集合最多,因为一般我们自己写的业务代码中,不太涉及到多线程共享同一个集合的问题线程安全的集合类 
- `Vector`、 `HashTable` 虽然效率没有`JUC`中的高性能集合高,但是也能够适应大部分环境

> [!NOTE]
>
> 高性能线程安全的集合类：`TODO`

- 1.`ConcurrentHashMap` 
- 2.`ConcurrentHashMap` 和 `HashTable` 的区别
- 3.`ConcurrentHashMap`线程安全的具体实现方式/底层具体实现
- 4.说说 `CopyOnWriteArrayList`

##### （）数组与集合区别，用过哪些？

数组和集合的区别：

- 数组是固定长度的数据结构，一旦创建长度就无法改变，而集合是动态长度的数据结构，可以根据需要动态增加或减少元素。
- 数组可以包含基本数据类型和对象，而集合只能包含对象。
- 数组可以直接访问元素，而集合需要通过迭代器或其他方法访问元素。

例如，我用过的一些 Java 集合类：

1. **`ArrayList：`** 动态数组，实现了`List`接口，支持动态增长。
2. **`LinkedList`：** 双向链表，也实现了`List`接口，支持快速的插入和删除操作。
3. **`HashMap：`** 基于哈希表的Map实现，存储键值对，通过键快速查找值。
4. **`HashSet：`** 基于`HashMap`实现的`Set`集合，用于存储唯一元素。
5. **`TreeMap`：** 基于红黑树实现的有序Map集合，可以按照键的顺序进行排序。
6. **`LinkedHashMap`：** 基于哈希表和双向链表实现的Map集合，保持插入顺序或访问顺序。
7. **`PriorityQueue：`** 优先队列，可以按照比较器或元素的自然顺序进行排序。

##### （）[#](https://xiaolincoding.com/interview/collections.html#说说java中的集合)说说Java中的集合？

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1717481094793-b8ffe6ae-2ee6-4de5-b61b-8468e32bf269.webp)

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/2243690-9cd9c896e0d512ed.gif)



1. `List`是有序的`Collection`，使用此接口能够精确的控制每个元素的插入位置，用户能根据索引访问`List`中元素。常用的实现`List`的类有`LinkedList`，`ArrayList`，`Vector`，`Stack`。

- `ArrayList`是容量可变的非线程安全列表，其底层使用数组实现。当几何扩容时，会创建更大的数组，并把原数组复制到新数组。`ArrayList`支持对元素的快速随机访问，但插入与删除速度很慢。
- `LinkedList`本质是一个双向链表，与`ArrayList`相比，，其插入和删除速度更快，但随机访问速度更慢。

2. `Set`不允许存在重复的元素，与List不同，set中的元素是无序的。常用的实现有`HashSet`，`LinkedHashSet`和`TreeSet`。

- `HashSet`通过`HashMap`实现，`HashMap`的Key即`HashSet`存储的元素，所有Key都是用相同的Value，一个名为PRESENT的Object类型常量。使用Key保证元素唯一性，但不保证有序性。由于`HashSet`是`HashMap`实现的，因此线程不安全。
- `LinkedHashSet`继承自`HashSet`，通过`LinkedHashMap`实现，使用双向链表维护元素插入顺序。
- `TreeSet`通过`TreeMap`实现的，添加元素到集合时按照比较规则将其插入合适的位置，保证插入后的集合仍然有序。

3. `Map` 是一个键值对集合，存储键、值和之间的映射。`Key` 无序，唯一；`value` 不要求有序，允许重复。`Map `没有继承于 `Collection` 接口，从 `Map `集合中检索元素时，只要给出键对象，就会返回对应的值对象。主要实现有`TreeMap`、`HashMap`、`HashTable`、`LinkedHashMap`、`ConcurrentHashMap`

- `HashMap`：JDK1.8 之前 `HashMap` 由数组+链表组成的，数组是` HashMap` 的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突），JDK1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）时，将链表转化为红黑树，以减少搜索时间
- `LinkedHashMap`：`LinkedHashMap` 继承自` HashMap`，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，`LinkedHashMap` 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。
- `HashTable`：数组+链表组成的，数组是 `HashTable` 的主体，链表则是主要为了解决哈希冲突而存在的
- `TreeMap`：红黑树（自平衡的排序二叉树）
- `ConcurrentHashMap`：`Node`数组+链表+红黑树实现，线程安全的（jdk1.8以前`Segment`锁，1.8以后`volatile` + CAS 或者 `synchronized`）

##### [#](https://xiaolincoding.com/interview/collections.html#java中的线程安全的集合是什么)Java中的线程安全的集合是什么？

在 `java.util `包中的线程安全的类主要 2 个，其他都是非线程安全的。

- **`Vector`**：线程安全的动态数组，其内部方法基本都经过`synchronized`修饰，如果不需要线程安全，并不建议选择，毕竟同步是有额外开销的。`Vector `内部是使用对象数组来保存数据，可以根据需要自动的增加容量，当数组已满时，会创建新的数组，并拷贝原有数组数据。
- **`Hashtable`**：线程安全的哈希表，`HashTable` 的加锁方法是给每个方法加上 `synchronized` 关键字，这样锁住的是整个 `Table` 对象，不支持 `null `键和值，由于同步导致的性能开销，所以已经很少被推荐使用，如果要保证线程安全的哈希表，可以用`ConcurrentHashMap`。

`java.util.concurrent `包提供的都是线程安全的集合：

并发Map：

- **`ConcurrentHashMap`**：它与 `HashTable` 的主要区别是二者加锁粒度的不同，在**JDK1.7**，`ConcurrentHashMap`加的是分段锁，也就是`Segment`锁，每个`Segment` 含有整个 `table` 的一部分，每一部分相当于一个小的`hashMap`表，这样不同分段之间的并发操作就互不影响。在**JDK 1.8** ，它取消了`Segment`字段，直接在table元素上加锁，实现对每一行进行加锁，进一步减小了并发冲突的概率。对于put操作，如果Key对应的数组元素为null，则通过CAS操作（Compare and Swap）将其设置为当前值。如果Key对应的数组元素（也即链表表头或者树的根元素）不为null，则对该元素使用 synchronized 关键字申请锁，然后进行操作。如果该 put 操作使得当前链表长度超过一定阈值，则将该链表转换为红黑树，从而提高寻址效率。
- **`ConcurrentSkipListMap`**：实现了一个基于`SkipList`（跳表）算法的可排序的并发集合，`SkipList`是一种可以在对数预期时间内 完成搜索、插入、删除等操作的数据结构，通过维护多个指向其他元素的“跳跃”链接来实现高效查找。

并发Set：

- **`ConcurrentSkipListSet`**：是线程安全的有序的集合。底层是使用`ConcurrentSkipListMap`实现。
- **`CopyOnWriteArraySet`**：是线程安全的Set实现，它是线程安全的无序的集合，可以将它理解成线程安全的`HashSet`。有意思的是，`CopyOnWriteArraySet`和`HashSet`虽然都继承于共同的父类`AbstractSet`；但是，`HashSet`是通过“散列表”实现的，而`CopyOnWriteArraySet`则是通过“动态数组(`CopyOnWriteArrayList`)”实现的，并不是散列表。

并发List：

- **`CopyOnWriteArrayList`**：它是 `ArrayList` 的线程安全的变体，其中所有写操作（`add`，`set`等）都通过对底层数组进行全新复制来实现，允许存储 null 元素。即当对象进行写操作时，使用了`Lock`锁做同步处理，内部拷贝了原数组，并在新数组上进行添加操作，最后将新数组替换掉旧数组；若进行的读操作，则直接返回结果，操作过程中不需要进行同步。

并发 `Queue`：

- **`ConcurrentLinkedQueue`**：是一个适用于高并发场景下的队列，它通过无锁的方式(`CAS`)，实现了高并发状态下的高性能。通常，`ConcurrentLinkedQueue` 的性能要好于 `BlockingQueue` 。
- **`BlockingQueue`**：与 `ConcurrentLinkedQueue` 的使用场景不同，`BlockingQueue` 的主要功能并不是在于提升高并发时的队列性能，而在于简化多线程间的数据共享。`BlockingQueue` 提供一种读写阻塞等待的机制，即如果消费者速度较快，则 `BlockingQueue` 则可能被清空，此时消费线程再试图从 `BlockingQueue` 读取数据时就会被阻塞。反之，如果生产线程较快，则 `BlockingQueue` 可能会被装满，此时，生产线程再试图向 `BlockingQueue` 队列装入数据时，便会被阻塞等待。

并发 `Deque`：（`Java`双端队列`Deque` ，`double ended queue`（双端队列））

- **`LinkedBlockingDeque`**：是一个线程安全的双端队列实现。它的内部使用链表结构，每一个节点都维护了一个前驱节点和一个后驱节点。`LinkedBlockingDeque` 没有进行读写锁的分离，因此同一时间只能有一个线程对其进行操作
- **`ConcurrentLinkedDeque`**：`ConcurrentLinkedDeque`是一种基于链接节点的无限并发链表。可以安全地并发执行插入、删除和访问操作。当许多线程同时访问一个公共集合时，`ConcurrentLinkedDeque`是一个合适的选择。

##### [#](https://xiaolincoding.com/interview/collections.html#collections和collection的区别)`Collections`和`Collection`的区别

- `Collection`是`Java`集合框架中的一个接口，它是所有集合类的基础接口。它定义了一组通用的操作和方法，如添加、删除、遍历等，用于操作和管理一组对象。`Collection`接口有许多实现类，如`List`、`Set`和`Queue`等。
- `Collections`（注意有一个s）是`Java`提供的一个工具类，位于`java.util`包中。它提供了一系列静态方法，用于对集合进行操作和算法。`Collections`类中的方法包括排序、查找、替换、反转、随机化等等。这些方法可以对实现了`Collection`接口的集合进行操作，如`List`和`Set`。

##### [#](https://xiaolincoding.com/interview/collections.html#集合遍历的方法有哪些)集合遍历的方法有哪些？

在`Java`中，集合的遍历方法主要有以下几种：

- **普通 `for` 循环：** 可以使用带有索引的普通 `for` 循环来遍历 `List`。

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

for (int i = 0; i < list.size(); i++) {
    String element = list.get(i);
    System.out.println(element);
}
```

- **增强 `for` 循环（`for-each`循环）：** 用于循环访问数组或集合中的元素。

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

for (String element : list) {
    System.out.println(element);
}
```

- **`Iterator` 迭代器：** 可以使用迭代器来遍历集合，特别适用于需要删除元素的情况。

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

Iterator<String> iterator = list.iterator();
while(iterator.hasNext()) {
    String element = iterator.next();
    System.out.println(element);
}
```

- **`ListIterator` 列表迭代器：** `ListIterator`是迭代器的子类，可以双向访问列表并在迭代过程中修改元素。

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

ListIterator<String> listIterator= list.listIterator();
while(listIterator.hasNext()) {
    String element = listIterator.next();
    System.out.println(element);
}
```

- **使用 `forEach` 方法：** `Java` 8引入了 `forEach` 方法，可以对集合进行快速遍历。

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

list.forEach(element -> System.out.println(element));
```

- **`Stream API`：** `Java 8`的`Stream API`提供了丰富的功能，可以对集合进行函数式操作，如过滤、映射等。

```java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

list.stream().forEach(element -> System.out.println(element));
```

这些是常用的集合遍历方法，根据情况选择合适的方法来遍历和操作集合。

##### **（）快速失败机制（Fail-Fast）**

- **Iterator** 的快速失败机制通过检查集合的 `modCount`（修改计数器）实现。若遍历过程中集合被外部修改（如直接调用 `add()` 或 `remove()`），`modCount` 会变化，`Iterator` 会立即抛出异常。
- **Enumeration** 无此机制，遍历时不检测修改，可能导致数据不一致。





### 3.2  集合：`List`

##### （）集合容器

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1737438845596-760eb59b-c34c-441c-bea7-5b4eb1da4db4.png)

常见的List集合（非线程安全）：

- `ArrayList`基于动态数组实现，它允许快速的随机访问，即通过索引访问元素的时间复杂度为 O (1)。在添加和删除元素时，如果操作位置不是列表末尾，可能需要移动大量元素，性能相对较低。适用于需要频繁随机访问元素，而对插入和删除操作性能要求不高的场景，如数据的查询和展示等。
- `LinkedList`基于双向链表实现，在插入和删除元素时，只需修改链表的指针，不需要移动大量元素，时间复杂度为 O (1)。但随机访问元素时，需要从链表头或链表尾开始遍历，时间复杂度为 O (n)。适用于需要频繁进行插入和删除操作的场景，如队列、栈等数据结构的实现，以及需要在列表中间频繁插入和删除元素的情况。

常见的List集合（线程安全）：

- `Vector`和`ArrayList`类似，也是基于数组实现。`Vector`中的方法大多是同步的，这使得它在多线程环境下可以保证数据的一致性，但在单线程环境下，由于同步带来的开销，性能会略低于`ArrayList`。
- `CopyOnWriteArrayList`在对列表进行修改（如添加、删除元素）时，会创建一个新的底层数组，将修改操作应用到新数组上，而读操作仍然在原数组上进行，这样可以保证读操作不会被写操作阻塞，实现了读写分离，提高了并发性能。适用于读操作远远多于写操作的并发场景，如事件监听列表等，在这种场景下可以避免大量的锁竞争，提高系统的性能和响应速度。

##### [#](https://xiaolincoding.com/interview/collections.html#讲一下java里面list的几种实现-几种实现有什么不同)讲一下java里面list的几种实现，几种实现有什么不同？

在Java中，`List`接口是最常用的集合类型之一，用于存储元素的有序集合。以下是Java中常见的`List`实现及其特点：

![image.png](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1721807143695-c1058186-be42-4746-a273-6302a128e328.png)

- `Vector` 是 `Java` 早期提供的线程安全的动态数组，如果不需要线程安全，并不建议选择，毕竟同步是有额外开销的。`Vector` 内部是使用对象数组来保存数据，可以根据需要自动的增加容量，当数组已满时，会创建新的数组，并拷贝原有数组数据。
- `ArrayList` 是应用更加广泛的动态数组实现，它本身不是线程安全的，所以性能要好很多。与 `Vector` 近似，`ArrayList` 也是可以根据需要调整容量，不过两者的调整逻辑有所区别，`Vector` 在扩容时会提高 `1 倍`，而 `ArrayList` 则是增加 `50%`。
- `LinkedList` 顾名思义是 `Java` 提供的双向链表，所以它不需要像上面两种那样调整容量，它也不是线程安全的。

> 这几种实现具体在什么场景下应该用哪种？

- `Vector` 和 `ArrayList` 作为动态数组，其内部元素以数组形式顺序存储的，所以非常适合随机访问的场合。除了尾部插入和删除元素，往往性能会相对较差，比如我们在中间位置插入一个元素，需要移动后续所有元素。
- 而 `LinkedList` 进行节点插入、删除却要高效得多，但是随机访问性能则要比动态数组慢。

##### [#](https://xiaolincoding.com/interview/collections.html#list可以一边遍历一边修改元素吗)`list`可以一边遍历一边修改元素吗？

在 `Java` 中，`List` 在遍历过程中是否可以修改元素取决于遍历方式和具体的`List`实现类。增加和减少元素，原则上是会抛出异常的，触发`fail-fast`（快速失败）机制。以下是几种常见情况：

- 使用普通`for`循环遍历：可以在遍历过程中修改元素，只要修改的索引不超出`List`的范围即可。

```java
import java.util.ArrayList;
import java.util.List;

public class ListTraversalAndModification {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);

        // 使用普通for循环遍历并修改元素
        for (int i = 0; i < list.size(); i++) {
            // 集合元素数量不超出原有范围，不触发扩容，可以修改
            list.set(i, list.get(i) * 2);
        }

        System.out.println(list);
    }
}
```

- 使用foreach循环遍历：一般不建议在`foreach`循环中直接修改正在遍历的`List`元素，因为这可能会导致意外的结果或`ConcurrentModificationException`异常。在`foreach`循环中修改元素可能会破坏迭代器的内部状态，因为`foreach`循环底层是基于迭代器实现的，在遍历过程中修改集合结构，会导致迭代器的预期结构和实际结构不一致。

```java
import java.util.ArrayList;
import java.util.List;

public class ListTraversalAndModification {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);

        // 使用foreach循环遍历并尝试修改元素，会抛出ConcurrentModificationException异常
        for (Integer num : list) {
            // 同样是修改了元素值，没修改元素个数。却因为破坏了迭代器，导致抛出异常。
            list.set(list.indexOf(num), num * 2);
        }

        System.out.println(list);
    }
}
```

- 使用迭代器遍历：可以使用迭代器的`remove`方法来删除元素，但如果要修改元素的值，需要通过迭代器的`set`方法来进行，而不是直接通过`List`的`set`方法，否则也可能会抛出`ConcurrentModificationException`异常。

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ListTraversalAndModification {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);

        // 使用迭代器遍历并修改元素
        Iterator<Integer> iterator = list.iterator();
        while (iterator.hasNext()) {
            Integer num = iterator.next();
            if (num == 2) {
                // 使用迭代器的set方法修改元素
                iterator.set(4);
            }
        }

        System.out.println(list);
    }
}
```

对于线程安全的`List`，如`CopyOnWriteArrayList`，由于其采用了写时复制的机制，在遍历的同时可以进行修改操作，不会抛出`ConcurrentModificationException`异常，但可能会读取到旧的数据，因为修改操作是在新的副本上进行的。

##### [#](https://xiaolincoding.com/interview/collections.html#list如何快速删除某个指定下标的元素)list如何快速删除某个指定下标的元素？

`ArrayList`提供了`remove(int index)`方法来删除指定下标的元素，该方法在删除元素后，会将后续元素向前移动，以填补被删除元素的位置。如果删除的是列表末尾的元素，时间复杂度为 O (1)；如果删除的是列表中间的元素，时间复杂度为 O (n)，n 为列表中元素的个数，因为需要移动后续的元素。示例代码如下：

```java
import java.util.ArrayList;
import java.util.List;

public class ArrayListRemoveExample {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);

        // 删除下标为1的元素
        list.remove(1);

        System.out.println(list);
    }
}
```

`LinkedList`的`remove(int index)`方法也可以用来删除指定下标的元素。它需要先遍历到指定下标位置，然后修改链表的指针来删除元素。时间复杂度为 O (n)，n 为要删除元素的下标。不过，如果已知要删除的元素是链表的头节点或尾节点，可以直接通过修改头指针或尾指针来实现删除，时间复杂度为 O (1)。示例代码如下：

```java
import java.util.LinkedList;
import java.util.List;

public class LinkedListRemoveExample {
    public static void main(String[] args) {
        List<Integer> list = new LinkedList<>();
        list.add(1);
        list.add(2);
        list.add(3);

        // 删除下标为1的元素
        list.remove(1);

        System.out.println(list);
    }
}
```

`opyOnWriteArrayList`的`remove`方法同样可以删除指定下标的元素。由于`CopyOnWriteArrayList`在写操作时会创建一个新的数组，所以删除操作的时间复杂度取决于数组的复制速度，通常为 O (n)，n 为数组的长度。但在并发环境下，它的删除操作不会影响读操作，具有较好的并发性能。示例代码如下：

```java
import java.util.concurrent.CopyOnWriteArrayList;

public class CopyOnWriteArrayListRemoveExample {
    public static void main(String[] args) {
        CopyOnWriteArrayList<Integer> list = new CopyOnWriteArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);

        // 删除下标为1的元素
        list.remove(1);

        System.out.println(list);
    }
}
```

##### [#](https://xiaolincoding.com/interview/collections.html#arraylist和linkedlist的区别-哪个集合是线程安全的)`Arraylist`和`LinkedList`的区别，哪个集合是线程安全的？

`ArrayList`和`LinkedList`都是`Java`中常见的集合类，它们都实现了List接口。

- **底层数据结构不同**：`ArrayList`使用数组实现，通过索引进行快速访问元素。`LinkedList`使用链表实现，通过节点之间的指针进行元素的访问和操作。
- **插入和删除操作的效率不同**：`ArrayList`在尾部的插入和删除操作效率较高，但在中间或开头的插入和删除操作效率较低，需要移动元素。`LinkedList`在任意位置的插入和删除操作效率都比较高，因为只需要调整节点之间的指针，但是`LinkedList`是不支持随机访问的，所以除了头结点外插入和删除的时间复杂度都是`O(n)`，效率也不是很高所以`LinkedList`基本没人用。
- **随机访问的效率不同**：`ArrayList`支持通过索引进行快速随机访问，时间复杂度为`O(1)`。`LinkedList`需要从头或尾开始遍历链表，时间复杂度为`O(n)`。
- **空间占用**：`ArrayList`在创建时需要分配一段连续的内存空间，因此会占用较大的空间。`LinkedList`每个节点只需要存储元素和指针，因此相对较小。
- **使用场景**：`ArrayList`适用于频繁随机访问和尾部的插入删除操作，而`LinkedList`适用于频繁的中间插入删除操作和不需要随机访问的场景。
- **线程安全**：这两个集合都不是线程安全的，`Vector`是线程安全的

##### [#](https://xiaolincoding.com/interview/collections.html#arraylist线程安全吗-把arraylist变成线程安全有哪些方法)`ArrayList`线程安全吗？把`ArrayList`变成线程安全有哪些方法？

不是线程安全的，`ArrayList`变成线程安全的方式有：

- 使用`Collections`类的`synchronizedList`方法将`ArrayList`包装成线程安全的List：

```java
List<String> synchronizedList = Collections.synchronizedList(arrayList);
```

- 使用`CopyOnWriteArrayList`类代替`ArrayList`，它是一个线程安全的List实现：

```java
CopyOnWriteArrayList<String> copyOnWriteArrayList = new CopyOnWriteArrayList<>(arrayList);
```

- 使用Vector类代替`ArrayList`，`Vector`是线程安全的List实现：

```java
Vector<String> vector = new Vector<>(arrayList);
```

##### [#](https://xiaolincoding.com/interview/collections.html#为什么arraylist不是线程安全的-具体来说是哪里不安全)为什么`ArrayList`不是线程安全的，具体来说是哪里不安全？

在高并发添加数据下，`ArrayList`会暴露三个问题;

- 部分值为null（我们并没有add null进去）
- 索引越界异常
- size与我们add的数量不符

为了知道这三种情况是怎么发生的，`ArrayList`，add 增加元素的代码如下：

```java
public boolean add(E e) {
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        elementData[size++] = e;
        return true;
    }
```

`ensureCapacityInternal()`这个方法的详细代码我们可以暂时不看，它的作用就是判断如果将当前的新元素加到列表后面，列表的`elementData`数组的大小是否满足，如果size + 1的这个需求长度大于了`elementData`这个数组的长度，那么就要对这个数组进行扩容。

PS：`elementData`就相当于初始化或者刚扩容时的大小，存在未使用的空间。而size就是有元素的空间。`elementData`大小减去size就会得到未使用的那一部分大小。

大体可以分为三步：

- 判断数组需不需要扩容，如果需要的话，调用grow方法进行扩容；
- 将数组的size位置设置值（因为数组的下标是从0开始的）；
- 将当前集合的大小加1

下面我们来分析三种情况都是如何产生的：

- 部分值为null：当线程1走到了扩容那里发现当前size是9，而数组容量是10，所以不用扩容，这时候`cpu`让出执行权，线程2也进来了，发现size是9，而数组容量是10，所以不用扩容，这时候线程1继续执行，将数组下标索引为9（索引为9，第10个元素）的位置set值了，**还没有来得及执行size++**，这时候线程2也来执行了，又把数组下标索引为9（索引为9，第10个元素）的位置set了一遍，这时候两个先后进行size++，导致下标索引10（第11个元素）的地方就为null了。
- 索引越界异常：线程1走到扩容那里发现当前size是9，数组容量是10不用扩容，cpu让出执行权，线程2也发现不用扩容，这时候数组的容量就是10，而线程1 set完之后size++，这时候线程2再进来size就是10，数组的大小只有10，而你要设置下标索引为10的就会越界（数组的下标索引从0开始）；
- size与我们add的数量不符：这个基本上每次都会发生，这个理解起来也很简单，因为size++本身就不是原子操作，可以分为三步：获取size的值，将size的值加1，将新的size值覆盖掉原来的，线程1和线程2拿到一样的size值加完了同时覆盖，就会导致一次没有加上，所以肯定不会与我们add的数量保持一致的；

##### [#](https://xiaolincoding.com/interview/collections.html#arraylist-和-linkedlist-的应用场景)`ArrayList `和 `LinkedList `的应用场景？

- `ArrayList`适用于需要频繁访问集合元素的场景。它基于数组实现，可以通过索引快速访问元素，因此在按索引查找、遍历和随机访问元素的操作上具有较高的性能。当需要频繁访问和遍历集合元素，并且集合大小不经常改变时，推荐使用`ArrayList`
- `LinkedList`适用于频繁进行插入和删除操作的场景。它基于链表实现，插入和删除元素的操作只需要调整节点的指针，因此在插入和删除操作上具有较高的性能。当需要频繁进行插入和删除操作，或者集合大小经常改变时，可以考虑使用`LinkedList`。

##### [#](https://xiaolincoding.com/interview/collections.html#arraylist的扩容机制说一下)`ArrayList`的扩容机制说一下

`ArrayList`在添加元素时，如果当前元素个数已经达到了内部数组的容量上限，就会触发扩容操作。`ArrayList`的扩容操作主要包括以下几个步骤：

- 计算新的容量：一般情况下，新的容量会扩大为原容量的`1.5倍`（在`JDK 10`之后，扩容策略做了调整），然后检查是否超过了最大容量限制。
- 创建新的数组：根据计算得到的新容量，创建一个新的更大的数组。
- 将元素复制：将原来数组中的元素逐个复制到新数组中。
- 更新引用：将`ArrayList`内部指向原数组的引用指向新数组。
- 完成扩容：扩容完成后，可以继续添加新元素。

`ArrayList`的扩容操作涉及到数组的复制和内存的重新分配，所以在频繁添加大量元素时，扩容操作可能会影响性能。为了减少扩容带来的性能损耗，可以在初始化`ArrayList`时预分配足够大的容量，避免频繁触发扩容操作。

之所以扩容是 `1.5 倍`，是因为 `1.5 `可以充分利用移位操作，减少浮点数或者运算时间和运算次数。

```java
// 新容量计算。加上原来的一半大小，故是1.5倍
int newCapacity = oldCapacity + (oldCapacity >> 1);
```

##### [#](https://xiaolincoding.com/interview/collections.html#线程安全的-list-copyonwritearraylist是如何实现线程安全的)线程安全的 List，` CopyonWriteArraylist`是如何实现线程安全的

`CopyOnWriteArrayList`底层也是通过一个数组保存数据，使用`volatile`关键字修饰数组，保证当前线程对数组对象重新赋值后，其他线程可以及时感知到。

```java
private transient volatile Object[] array;
```

在写入操作时，加了一把互斥锁`ReentrantLock`以保证线程安全。

```java
public boolean add(E e) {
    //获取锁
    final ReentrantLock lock = this.lock;
    //加锁
    lock.lock();
    try {
        //获取到当前List集合保存数据的数组
        Object[] elements = getArray();
        //获取该数组的长度（这是一个伏笔，同时len也是新数组的最后一个元素的索引值）
        int len = elements.length;
        //将当前数组拷贝一份的同时，让其长度加1
        Object[] newElements = Arrays.copyOf(elements, len + 1);
        //将加入的元素放在新数组最后一位，len不是旧数组长度吗，为什么现在用它当成新数组的最后一个元素的下标？建议自行画图推演，就很容易理解。
        // 最后一个元素的下标是 len-1 ，上边扩容1，之后，最后一个元素刚好是 len
        newElements[len] = e;
        //替换引用，将数组的引用指向给新数组的地址
        setArray(newElements);
        return true;
    } finally {
        //释放锁
        lock.unlock();
    }
}
```

看到源码可以知道写入新元素时，首先会先将原来的数组拷贝一份并且让原来数组的长度+1后就得到了一个新数组，新数组里的元素和旧数组的元素一样并且长度比旧数组多一个长度，然后将新加入的元素放置都在新数组最后一个位置后，用新数组的地址替换掉老数组的地址就能得到最新的数据了。

在我们执行替换地址操作之前，读取的是老数组的数据，数据是有效数据；执行替换地址操作之后，读取的是新数组的数据，同样也是有效数据，而且使用该方式能比读写都加锁要更加的效率。

现在我们来看读操作，读是没有加锁的，所以读是一直都能读

```java
public E get(int index) {
    return get(getArray(), index);
}
```





### 3.3  集合：`Set`

##### （）set 基础知识

Set全部都基于Map，相当于是只取了Map中的键，而值则是所有值共享了一个静态的Object对象。源码如下

```java
private static final Object PRESENT = new Object();
public boolean add(E e){
    return treeMap.put(e,PRESENT) == null ;
}
```



##### （）Set集合有什么特点？如何实现key无重复的？

- **set集合特点**：Set集合中的元素是唯一的，不会出现重复的元素。
- **set实现原理**：Set集合通过内部的数据结构（如哈希表、红黑树等）来实现key的无重复。当向`HashSet`集合中插入元素时，会先根据元素的`hashCode`值来确定元素的存储位置，然后再通过`equals`方法来判断是否已经存在相同的元素，如果存在则不会再次插入，保证了元素的唯一性。而`TreeSet`则通过比较器保证不重复。

##### [#](https://xiaolincoding.com/interview/collections.html#有序的set是什么-记录插入顺序的集合是什么)有序的Set是什么？记录插入顺序的集合是什么？

- **有序的 Set 是`TreeSet`和`LinkedHashSet`**。`TreeSet`是基于红黑树实现，保证元素的自然顺序。`LinkedHashSet`是基于双重链表和哈希表的结合来实现元素的有序存储，保证元素添加的自然顺序
- **记录插入顺序的集合通常指的是`LinkedHashSet`**，它不仅保证元素的唯一性，还可以保持元素的插入顺序。当需要在Set集合中记录元素的插入顺序时，可以选择使用`LinkedHashSet`来实现。





### 3.4 集合： `Map`

#### **3.4.1  `Hashmap`**

##### （重点）为什么`HashMap`要用红黑树而不是平衡二叉树？

在`jdk1.8`版本后，`java`对`HashMap`做了改进，在链表长度大于8的时候, 将后面的数据存在红黑树中以加快检索速度
红黑树虽然本质上是一棵二叉查找树,但它在二又查找树的基础上增加了着色和相关的性质使得红黑树相对平衡，从而保证了红黑树的査找、插入、删除的时间复杂度最坏为`O(logn)`。加快检索速率。

- 平衡二叉树追求的是一种 **“完全平衡”** 状态：任何结点的左右子树的高度差不会超过 1，优势是树的结点是很平均分配的。这个要求实在是太严了，导致每次进行插入/删除节点的时候，几乎都会破坏平衡树的第二个规则，进而我们都需要通过**左旋**和**右旋**来进行调整，使之再次成为一颗符合要求的平衡树。
- 红黑树不追求这种完全平衡状态，而是追求一种 **“弱平衡”** 状态：整个树最长路径不会超过最短路径的 2 倍。优势是虽然牺牲了一部分查找的性能效率，但是能够换取一部分维持树平衡状态的成本。与平衡树不同的是，红黑树在插入、删除等操作，**不会像平衡树那样，频繁着破坏红黑树的规则，所以不需要频繁着调整**，这也是我们为什么大多数情况下使用红黑树的原因。

红黑树和`AVL树`相比：当插入一个结点都引起了树的不平衡，`AVL`和`RBT`都最多需要2次旋转操作。但删除一个结点引起不平衡后，`AVL`最多需要`log(N)` 次旋转操作，而`RBT`最多只需要3次。因此两者插入一个结点的代价差不多，但删除一个结点的代价`RBT`要低一些。

结构对比：` AVL`的结构高度平衡，`RBT`的结构基本平衡。平衡度`AVL > RBT`.

查找对比： `AVL` 查找时间复杂度最好，最坏情况都是`O(logN)`。`RBT` 查找时间复杂度最好为`O(logN)`，最坏情况下比`AVL`略差。

##### （） [`HashMap`中的`Key`和`Value`是否可以为`Null`](https://blog.csdn.net/weixin_44823875/article/details/132533420)

在`Java`中，`HashMap`是一个非常灵活的数据结构，它允许`key`和`value`为`null`。这意味着你可以将`null`作为一个键值对的键（`key`）或值（`value`）存储在`HashMap`中。当你尝试将`null`作为键插入时，它会被存储在`HashMap`的第一个位置，也就是桶数组的第一个位置。而将`null`作为值插入时，它可以存储在`HashMap`中的任何位置。

关于`HashMap`的`Key`和`Value`

- **`HashMap`的`Key`和`Value`可以为`Null`**：`HashMap`允许`null`作为键和值。这是因为`HashMap`在计算哈希值时会特别处理`null`，将其哈希值设为0。因此，如果`HashMap`中已经存在一个键为`null`的项，再次尝试插入键为`null`的项时，新的值会覆盖旧的值。
- **Key的唯一性**：`HashMap`中的键必须是唯一的。如果尝试插入具有相同键的新项，则新的值将覆盖旧的值，但不会引发错误。
- **线程安全问题**：需要注意的是，`HashMap`是线程不安全的。在多线程环境下，如果一个线程在使用*`containsKey()`*方法检查键是否存在，而另一个线程同时删除了该键，那么可能会出现线程安全问题。因此，在多线程环境中，通常使用`ConcurrentHashMap`来存储数据，而`ConcurrentHashMap`不允许键和值为`null`。

`HashMap`的源码如下：

```java
public V put (K key,V value ){
    return putVal(hash(key), key, value, false, true );
}
static final int hash(Object key){
    int h;
    // 如果传入 null 值，返回的hash值是 0 
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```



##### （）`HashMap`实现原理介绍一下？

在` JDK 1.7` 版本之前，` HashMap` 数据结构是数组和链表，`HashMap`通过哈希算法将元素的键（`Key`）映射到数组中的槽位（`Bucket`）。如果多个键映射到同一个槽位，它们会以链表的形式存储在同一个槽位上，因为链表的查询时间是`O(n)`，所以冲突很严重，一个索引上的链表非常长，效率就很低了。

 ![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1719565480532-57a14329-c36b-4514-8e7d-2f2f1df88a82.webp) 

所以在 **`JDK 1.8`** 版本的时候做了优化，当一个链表的长度超过8的时候就转换数据结构，不再使用链表存储，而是使用**红黑树**，查找时使用红黑树，时间复杂度`O（log n)`，可以提高查询性能，但是在数量较少时，即数量小于6时，会将红黑树转换回链表。

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1719565481289-0c2164f4-f755-46e3-bb39-b5f28621bb6b.webp)

##### [#](https://xiaolincoding.com/interview/collections.html#了解的哈希冲突解决方法有哪些)了解的哈希冲突解决方法有哪些？

- 链接法：使用链表或其他数据结构来存储冲突的键值对，将它们链接在同一个哈希桶中。**`java`默认采用了链地址法（也就是链接法）来构建`hashmap`的数据结构**
- 开放寻址法：在哈希表中找到另一个可用的位置来存储冲突的键值对，而不是存储在链表中。常见的开放寻址方法包括线性探测、二次探测和双重散列。
- 再哈希法（Rehashing）：当发生冲突时，使用另一个哈希函数再次计算键的哈希值，直到找到一个空槽来存储键值对。
- 哈希桶扩容：当哈希冲突过多时，可以动态地扩大哈希桶的数量，重新分配键值对，以减少冲突的概率。

###### 一、了解[哈希表](https://so.csdn.net/so/search?q=哈希表&spm=1001.2101.3001.7020)及哈希冲突（[原地址](https://blog.csdn.net/qq_48241564/article/details/118613312)）

> 哈希表：是一种实现关联数组抽象数据类型的数据结构，这种结构可以将关键码映射到给定值。简单来说哈希表（key-value）之间存在一个映射关系，是键值对的关系，一个键对应一个值。
>
> 哈希冲突：当两个不同的数经过哈希函数计算后得到了同一个结果，即他们会被映射到哈希表的同一个位置时，即称为发生了哈希冲突。简单来说就是哈希函数算出来的地址被别的元素占用了。

------

######  二、解决哈希冲突办法 

1、开放定址法：我们在遇到哈希冲突时，去寻找一个新的空闲的哈希地址。

举例：就是当我们去教室上课，发现该位置已经存在人了，所以我们应该寻找新的位子坐下，这就是开放定址法的思路。如何寻找新的位置就通过以下几种方法实现。

> #### （1）线性探测法
>
> ​    当我们的所需要存放值的位置被占了，我们就往后面一直加1并对m取模直到存在一个空余的地址供我们存放值，取模是为了保证找到的位置在0~（m-1）的有效空间之中。
>
> 公式：`h(x)=(Hash(x)+i)mod (Hashtable.length)`;（i会逐渐递增加1）
>
> 举例：
>
> ![image](https://github.com/shilic/picx-images-hosting/raw/master/image/image.9dd3uf3bpa.webp)
>
>  存在问题：出现非同义词冲突（两个不想同的哈希值，抢占同一个后续的哈希地址）被称为堆积或聚集现象。

> ​    （2）平方探测法（二次探测）
>
> ​         当我们的所需要存放值的位置被占了，会前后寻找而不是单独方向的寻找。
>
> ​    公式：`h(x)=(Hash(x) +i)mod (Hashtable.length)`;（i依次为+(i^2)和-(i^2)）
>
> ​    举例：
>
> ![image](https://github.com/shilic/picx-images-hosting/raw/master/image/image.6m41mck3px.webp)

------

######  2、再哈希法：同时构造多个不同的哈希函数，等发生哈希冲突时就使用第二个、第三个……等其他的哈希函数计算地址，直到不发生冲突为止。虽然不易发生聚集，但是增加了计算时间。

------

###### 3、链地址法：将所有哈希地址相同的记录都链接在同一链表中。

公式：`h(x)=xmod(Hashtable.length)`;

![image](https://shilic.github.io/picx-images-hosting/image/image.1ap51mynf9.webp)

 

------

###### 4、建立公共溢出区：将哈希表分为基本表和溢出表，将发生冲突的都存放在溢出表中。

##### [#](https://xiaolincoding.com/interview/collections.html#hashmap是线程安全的吗)`HashMap`是线程安全的吗？

`hashmap`不是线程安全的，`hashmap`在多线程会存在下面的问题：

- `JDK 1.7 HashMap` 采用数组 + 链表的数据结构，多线程背景下，在数组扩容的时候，存在 Entry 链死循环和数据丢失问题。
- `JDK 1.8 HashMap `采用数组 + 链表 + 红黑二叉树的数据结构，优化了 1.7 中数组扩容的方案，解决了 Entry 链死循环和数据丢失问题。但是多线程背景下，put 方法存在数据覆盖的问题。

如果要保证线程安全，可以通过这些方法来保证：

- 多线程环境可以使用`Collections.synchronizedMap`同步加锁的方式，还可以使用`HashTable`，但是同步的方式显然性能不达标，而`ConurrentHashMap`更适合高并发场景使用。
- `ConcurrentHashmap`在`JDK1.7`和`1.8`的版本改动比较大，1.7使用`Segment+HashEntry`分段锁的方式实现，`1.8`则抛弃了`Segment`，改为使用`CAS+synchronized+Node`实现，同样也加入了红黑树，避免链表过长导致性能的问题。

##### [#](https://xiaolincoding.com/interview/collections.html#hashmap的put过程介绍一下)`hashmap`的`put`过程介绍一下

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1720684054342-1e3cb2a9-532e-40b8-b5cf-0043811391dc.png)





`HashMap HashMap`的`put()`方法用于向`HashMap`中添加键值对，当调用`HashMap`的`put()`方法时，会按照以下详细流程执行（`JDK8 1.8`版本）：

> 第一步：根据要添加的键的哈希码计算在数组中的位置（索引）。

> 第二步：检查该位置是否为空（即没有键值对存在）

- 如果为空，则直接在该位置创建一个新的Entry对象来存储键值对。将要添加的键值对作为该Entry的键和值，并保存在数组的对应位置。将HashMap的修改次数（modCount）加1，以便在进行迭代时发现并发修改。

> 第三步：如果该位置已经存在其他键值对，检查该位置的第一个键值对的哈希码和键是否与要添加的键值对相同？

- 如果相同，则表示找到了相同的键，直接将新的值替换旧的值，完成更新操作。

> 第四步：如果第一个键值对的哈希码和键不相同，则需要遍历链表或红黑树来查找是否有相同的键：

如果键值对集合是链表结构，从链表的头部开始逐个比较键的**哈希码和equals()**方法，直到找到相同的键或达到链表末尾。

- 如果找到了相同的键，则使用新的值取代旧的值，即更新键对应的值。
- 如果没有找到相同的键，则将新的键值对添加到链表的头部。

如果键值对集合是红黑树结构，在红黑树中使用**哈希码和`equals()`**方法进行查找。根据键的哈希码，定位到红黑树中的某个节点，然后逐个比较键，直到找到相同的键或达到红黑树末尾。

- 如果找到了相同的键，则使用新的值取代旧的值，即更新键对应的值。
- 如果没有找到相同的键，则将新的键值对添加到红黑树中。

> 第五步：检查链表长度是否达到阈值（默认为8）：

- 如果链表长度超过阈值，且`HashMap`的数组长度大于等于64，则会将链表转换为红黑树，以提高查询效率。

> 第六步：检查负载因子是否超过阈值（默认为0.75）：

- 如果键值对的数量（size）与数组的长度的比值大于阈值，则需要进行扩容操作。

> 第七步：扩容操作：

- 创建一个新的两倍大小的数组。
- 将旧数组中的键值对重新计算哈希码并分配到新数组中的位置。
- 更新`HashMap`的数组引用和阈值参数。

> 第八步：完成添加操作。

此外，`HashMap`是非线程安全的，如果在多线程环境下使用，需要采取额外的同步措施或使用线程安全的`ConcurrentHashMap`。

##### [#](https://xiaolincoding.com/interview/collections.html#hashmap的put-key-val-和get-key-过程)`HashMap`的`put(key,val)`和`get(key)`过程

- 存储对象时，我们将`K/V`传给`put`方法时，它调用`hashCode`计算`hash`从而得到`bucket`位置，进一步存储，`HashMap`会根据当前`bucket`的占用情况自动调整容量(超过`Load Facotr`则`resize`为原来的2倍)。

在Java的HashMap中，当调用`put`方法插入键值对时，如果新键的哈希码与已有元素的哈希码冲突，处理方式如下：

###### 1. **哈希码定位桶位置**

- 首先，计算键的哈希码，并通过扰动函数（Java 8中的`(h = key.hashCode()) ^ (h >>> 16)`）减少碰撞概率。
- 使用`(n - 1) & hash`确定键所在的桶（数组索引），其中`n`是当前数组长度。

###### 2. **处理桶中的节点**

- **情况一：桶为空**
  直接在该位置创建新节点并存储键值对。
- **情况二：桶非空**
  遍历桶中的节点（可能是链表或红黑树），比较键的哈希码和实际值：
  - **键已存在（通过`equals`判断）**
    更新对应的值，返回旧值。
  - **键不存在**
    将新节点添加到链表或树中。

###### 3. **解决冲突的数据结构**

- **链表处理（默认）**
  新节点插入链表末尾（Java 8前是头插，Java 8改为尾插以避免死循环）。
- **树化处理（Java 8+）**
  当链表长度超过阈值（默认8）且数组长度≥64时，链表转换为红黑树。若树节点数减少到6以下，树退化为链表。

###### 4. **扩容机制**

- 插入后若总节点数超过阈值（容量×负载因子，默认0.75），数组扩容为原来的2倍，并重新散列节点到新桶中。

###### 总结

哈希冲突通过**链地址法**处理：

- **哈希码相同但键不同**：节点以链表或红黑树形式存储在同一桶中。
- **哈希码相同且键相同**：更新对应的值。

这种设计在哈希碰撞频繁时，通过红黑树将操作时间复杂度从链表的O(n)优化为O(log n)，确保了高效的增删查改操作。

- 获取对象时，我们将K传给`get`，它调用`hashCode`计算`hash`从而得到`bucket`位置，并进一步调用`equals()`方法确定键值对。如果发生碰撞的时候，`Hashmap`通过链表将产生碰撞冲突的元素组织起来，在`Java 8`中，如果一个`bucket`中碰撞冲突的元素超过某个限制(默认是8)，则使用红黑树来替换链表，从而提高速度。

##### [#](https://xiaolincoding.com/interview/collections.html#hashmap-调用get方法一定安全吗)`hashmap `调用`get`方法一定安全吗？

不是，调用 `get `方法有几点需要注意的地方：

- **空指针异常（NullPointerException）**：如果你尝试用 `null` 作为键调用 `get` 方法，而 `HashMap` 没有被初始化（即为 `null`），那么会抛出空指针异常。不过，如果 `HashMap` 已经初始化，使用 `null` 作为键是允许的，因为 `HashMap` 支持 `null` 键。
- **线程安全**：`HashMap` 本身不是线程安全的。如果在多线程环境中，没有适当的同步措施，同时对 `HashMap` 进行读写操作可能会导致不可预测的行为。例如，在一个线程中调用 `get` 方法读取数据，而另一个线程同时修改了结构（如增加或删除元素），可能会导致读取操作得到错误的结果或抛出 `ConcurrentModificationException`。如果需要在多线程环境中使用类似 `HashMap` 的数据结构，可以考虑使用 `ConcurrentHashMap`。

##### [#](https://xiaolincoding.com/interview/collections.html#hashmap一般用什么做key-为啥string适合做key呢)`HashMap`一般用什么做`Key`？为啥`String`适合做Key呢？

用` string `做 `key`，因为` String`对象是不可变的，一旦创建就不能被修改，这确保了`Key`的稳定性。如果Key是可变的，可能会导致`hashCode`和`equals`方法的不一致，进而影响`HashMap`的正确性。

##### [#](https://xiaolincoding.com/interview/collections.html#为什么hashmap要用红黑树而不是平衡二叉树)为什么`HashMap`要用红黑树而不是平衡二叉树？

- 平衡二叉树追求的是一种 **“完全平衡”** 状态：任何结点的左右子树的高度差不会超过 1，优势是树的结点是很平均分配的。这个要求实在是太严了，导致每次进行插入/删除节点的时候，几乎都会破坏平衡树的第二个规则，进而我们都需要通过**左旋**和**右旋**来进行调整，使之再次成为一颗符合要求的平衡树。
- 红黑树不追求这种完全平衡状态，而是追求一种 **“弱平衡”** 状态：整个树最长路径不会超过最短路径的 2 倍。优势是虽然牺牲了一部分查找的性能效率，但是能够换取一部分维持树平衡状态的成本。与平衡树不同的是，红黑树在插入、删除等操作，**不会像平衡树那样，频繁着破坏红黑树的规则，所以不需要频繁着调整**，这也是我们为什么大多数情况下使用红黑树的原因。

##### [#](https://xiaolincoding.com/interview/collections.html#hashmap-key可以为null吗)`hashmap key`可以为null吗？

可以为 null。

- `hashMap`中使用`hash()`方法来计算key的哈希值，当key为空时，直接另key的哈希值为0，不走`key.hashCode()`方法；

`HashMap`的源码如下：

```java
public V put (K key,V value ){
    return putVal(hash(key), key, value, false, true );
}
static final int hash(Object key){
    int h;
    // 如果传入 null 值，返回的hash值是 0 
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```



- `hashMap`虽然支持key和value为null，但是null作为key只能有一个，null作为value可以有多个；
- 因为`hashMap`中，如果key值一样，那么会覆盖相同key值的value为最新，所以key为null只能有一个。

##### [#](https://xiaolincoding.com/interview/collections.html#重写hashmap的equal和hashcode方法需要注意什么)重写`HashMap`的`equal`和`hashcode`方法需要注意什么？

`HashMap`使用`Key`对象的`hashCode()`和`equals`方法去决定`key-value`对的索引。当我们试着从`HashMap`中获取值的时候，这些方法也会被用到。如果这些方法没有被正确地实现，在这种情况下，两个不同`Key`也许会产生相同的`hashCode()`和`equals()`输出，`HashMap`将会认为它们是相同的，然后覆盖它们，而非把它们存储到不同的地方。

同样的，所有不允许存储重复数据的集合类都使用`hashCode()`和`equals()`去查找重复，所以正确实现它们非常重要。`equals()`和`hashCode()`的实现应该遵循以下规则：

- 如果`o1.equals(o2)`，那么`o1.hashCode() == o2.hashCode()`总是为true的。
- 如果`o1.hashCode() == o2.hashCode()`，并不意味着`o1.equals(o2)`会为true。

##### （重点）[#](https://xiaolincoding.com/interview/collections.html#重写hashmap的equal方法不当会出现什么问题)重写`HashMap`的`equal`方法不当会出现什么问题？

***`HashMap`在比较元素时，会先通过`hashCode`进行比较，相同的情况下再通过`equals`进行比较。***

所以` equals`相等的两个对象，`hashCode`一定相等。`hashCode`相等的两个对象，`equals`不一定相等（比如散列冲突的情况）

重写了`equals`方法，不重写`hashCode`方法时，可能会出现`equals`方法返回为true，而`hashCode`方法却返回false，这样的一个后果会导致在`hashmap`等类中存储多个一模一样的对象，导致出现覆盖存储的数据的问题，这与`hashmap`只能有唯一的key的规范不符合。



##### （重点）扩展，`hashCode`和`equal`（[原文地址](https://blog.csdn.net/bachbrahms/article/details/106983428)）

> [!NOTE]
>
> ***`HashMap`在比较元素时，会先通过`hashCode`进行比较，相同的情况下再通过`equals`进行比较。***
>
> 确定两件事：1. 未重写`hashCode`时，会调用`Object`类的`hashCode`方法，具体根据`JVM`实现有关，根据对象头和内存地址计算。2. 未重写`equals`时，会调用`Object`类的`equals`方法。**比较两个对象的引用是否指向同一块内存地址（即是否是同一个对象）**。这等同于使用 `==` 操作符进行比较。

###### 1. 不同对象的`hashCode`何时会相等？

**1）重写`hashCode`方法时**

重写，但是重写规则不正确：众所周知，一个类，如果你用某个属性（一个类有多个属性）去重写了`hashCode`方法，那么当不同对象的该属性相等时，它们的`hashCode`也一样。

**2）未重写`hashCode`方法时**

这才是本文的重点——**当没有重写`hashCode`方法时，不同对象的`hashCode`值到底可不可能一样**？

首先，**`hashCode`方法返回的并不是对象在`jvm`上的内存地址值本身，而是通过一定算法，转化而来的一个int值。**（**而因为`hashCode`方法是一个`native`方法**，我们并不能直接看到源码！）不同的`JVM`对`hashCode`的具体实现是不同的。

这里就存在一个问题，内存上可能的地址值有多少个？经询问高手，得到的答案是，**以64位系统为例，就是2的64次方个，而int的最大值是2的32次方**，因此，理论上，int值不够分配给所有地址值，这就决定了会出现不同对象`hashCode`相等的情况。经过测试，所以结论就是：**即便不重写`hashCode`方法，不同对象的`hashCode`也可能相同！！**

###### 2.  关于`hashCode`方法与`equals`方法重写问题

上面反复提到了重写`hashCode`方法问题，而一般提到这个，也必然会提到`equals`方法。这是`java`里面老生常谈的话题：为什么要同时重写这两个方法？什么时候要重写？不重写会怎么样？......关于这些，网上帖子也是大把抓，本文不再详述。这里重申一下几个结论：

- 若两个对象`hashCode`相等，则`equals()`不一定为true;
- 若两个对象`hashCode`不相等，则`equals()`一定为false;
- 若两个对象`equals()`为true，则`hashCode`一定相等；
- 若两个对象`equals()`为false，则`hashCode`不一定不相等；

如何理解：因为是先比较`hashCode`，再比较`equals()`，存在这样一个先后顺序。

可以把`hashCode`理解为房间号，而`equals`理解为身份证号，住在同一个房间，不一定是同一个人，不住在同一个房间，必然不是同一个人。

这里要补充的一个问题就是：若重写其中一个方法，而不重写另一个，会怎样？

###### 3. 若重写其中一个方法，而不重写另一个，会怎样？

**1）只重写`hashCode`方法，不重写`equals`方法**

设想一下，一个`Student`类，只重写了`hashCode`方法（用`name`属性），现在有两个名为“张三”（同一个人）的`student`想往`HashMap`里放，因为它们的`hashCode`相等，在数组中的位置一样，`HashMap`会继续去调用`equals`方法比较两个对象是否相等，会调用`Object`类的`equals`方法。显然，两个对象的内存地址不同，`equals`结果为`false`，结果两个对象都被put进了map，这是不合理的。**即使两个对象的属性值完全相同，只要它们是不同的实例，默认的 `equals()` 会返回 `false`**。故有可能完全相同的两个对象会被放到一个map里。

**2）只重写`equals`方法，不重写`hashCode`方法**

再设想一下，如果`String`类只重写了`equals()`方法，用字符串内容作为判断对象相等的依据，而未重写`hashCode`方法，此时，两个内容都为`"abc"`的`String`对象，往`hashMap`里`put`的时候，第一步判断`hashCode`不同（大概率），**则根本不会调用`equals`方法判断**，直接就放了进去，`map`里就会有两个`"abc"`，这也是不合理的。和前边一样，也会有两个完全一样的对象被放到map里，只不过`equals`从未被调用。

显然，为了满足上述四个约束，就一定要同时重写这两个方法。

##### [#](https://xiaolincoding.com/interview/collections.html#列举hashmap在多线程下可能会出现的问题)列举`HashMap`在多线程下可能会出现的问题？

- `JDK1.7`中的 `HashMap` 使用头插法插入元素，在多线程的环境下，扩容的时候有可能导致环形链表的出现，形成死循环。因此，`JDK1.8`使用尾插法插入元素，在扩容时会保持链表元素原本的顺序，不会出现环形链表的问题。
- 多线程同时执行 put 操作，如果计算出来的索引位置是相同的，那会造成前一个 key 被后一个 key 覆盖，从而导致元素的丢失。此问题在JDK 1.7和 JDK 1.8 中都存在。

##### [#](https://xiaolincoding.com/interview/collections.html#hashmap的扩容机制介绍一下)`HashMap`的扩容机制介绍一下

> [!NOTE]
>
> 三个数字：0.75、16、2

`hashMap`默认的负载因子是`0.75`，即如果`hashmap`中的元素个数超过了总容量75%，则会触发扩容，扩容分为两个步骤：

- **第1步**是对哈希表长度的扩展（2倍）
- **第2步**是将旧哈希表中的数据放到新的哈希表中。

因为我们使用的是2次幂的扩展(指长度扩为原来2倍)，所以，元素的位置要么是在原位置，要么是在原位置再移动2次幂的位置。

如我们从16扩展为32时，具体的变化如下所示：

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1713514753772-9467a399-6b18-4a47-89d4-957adcc53cc0.webp)

因此元素在重新计算hash之后，因为n变为2倍，那么n-1的mask范围在高位多1bit(红色)，因此新的index就会发生这样的变化：

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1713514753786-cdca10bf-6eda-47f9-9bbe-0cc3beb67d76.webp)

因此，我们在扩充`HashMap`的时候，不需要重新计算`hash`，只需要看看原来的hash值新增的那个bit是1还是0就好了，是0的话索引没变，是1的话索引变成“原索引+oldCap”。可以看看下图为16扩充为32的resize示意图：

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1713514753885-d1529537-322c-49b1-beec-5d9953da5150.webp)



这个设计确实非常的巧妙，既省去了重新计算`hash`值的时间，而且同时，由于新增的`1bit`是`0`还是`1`可以认为是随机的，因此`resize`的过程，均匀的把之前的冲突的节点分散到新的`bucket`了。

##### [#](https://xiaolincoding.com/interview/collections.html#hashmap的大小为什么是2的n次方大小呢) `HashMap` 的大小为什么是2的n次方大小呢？

在 `JDK1.7` 中，`HashMap` 整个扩容过程就是分别取出数组元素，一般该元素是最后一个放入链表中的元素，然后遍历以该元素为头的单向链表元素，依据每个被遍历元素的 `hash `值计算其在新数组中的下标，然后进行交换。这样的扩容方式会将原来哈希冲突的单向链表尾部变成扩容后单向链表的头部。

而在 `JDK 1.8` 中，`HashMap` 对扩容操作做了优化。由于扩容数组的长度是 2 倍关系，所以对于假设初始 `tableSize = 4 `要扩容到 8 来说就是 0100 到 1000 的变化（左移一位就是 2 倍），在扩容中只用判断原来的 hash 值和左移动的一位（newtable 的值）按位与操作是 0 或 1 就行，0 的话索引不变，1 的话索引变成原索引加上扩容前数组。

之所以能通过这种“与运算“来重新分配索引，是因为 hash 值本来就是随机的，而 hash 按位与上 `newTable` 得到的 0（扩容前的索引位置）和 1（扩容前索引位置加上扩容前数组长度的数值索引处）就是随机的，所以扩容的过程就能把之前哈希冲突的元素再随机分布到不同的索引中去。

1. **高效的索引计算**（位运算替代取模）

- **位运算替代取模**：
  `HashMap` 通过 `key.hashCode()` 计算哈希值后，需要将哈希值映射到数组的索引位置。当数组长度为 `2^n` 时，可以通过 ​**位运算**​ `(length - 1) & hash` 代替取模运算 `hash % length`。
  - **优势**：位运算的效率远高于取模运算（尤其在频繁操作时），因为计算机底层可以直接通过二进制操作完成。
- **为什么必须长度是2的n次方？**
  当 `length = 2^n` 时，`length - 1` 的二进制形式是连续的 `1`（例如 `16 → 15 → 1111`）。此时，`hash & (length - 1)` 的结果相当于取哈希值的低 `n` 位，且分布均匀。若长度不是2的幂次方，`length - 1` 的二进制中会存在 `0` 位，导致某些索引位置永远无法被映射（例如长度为10时，部分索引永远无法被访问）。

------

2. **减少哈希冲突**（扰动）

- **均匀分布**：
  当长度为2的n次方时，哈希值的低位直接决定索引位置。如果哈希函数的高位变化频繁但低位固定，可能导致冲突。为此，`HashMap` 在计算哈希值时，会通过 ​**扰动函数**​ 将高16位与低16位异或（`key.hashCode() ^ (key.hashCode() >>> 16)`），使高位也参与索引计算，从而减少冲突。
- **非2的幂次方的弊端**：
  如果长度不是2的幂次方，即使扰动哈希值，也无法保证索引分布的均匀性。例如，长度为15时，`length - 1 = 14 (1110)`，二进制中存在 `0` 位，导致哈希值的某些位永远无法影响索引结果。

------

3. **扩容优化**

- **扩容时的重新散列**：
  `HashMap` 扩容时，新容量是原容量的2倍（保持2的n次方）。此时，元素的新索引要么等于原索引，要么等于原索引加上旧容量（`newIndex = oldIndex + oldCapacity`）。这是因为扩容后，哈希值与新长度 `(length - 1)` 的位运算结果只会多出一个高位的 `1`，无需重新计算所有哈希值，极大提升了扩容效率。
- **示例**：
  旧容量为 `16 (10000)`，扩容后为 `32 (100000)`。若某元素的哈希值为 `10101`，则旧索引为 `5 (0101)`，新索引为 `21 (10101)`，即原索引 `5 + 16 = 21`

`HashMap` 本身是树的结构，而树的话2的次方更容易查找，也就是更平衡，更趋向于平衡二叉树。



##### [#](https://xiaolincoding.com/interview/collections.html#往hashmap存20个元素-会扩容几次)往hashmap存20个元素，会扩容几次？

当插入 20 个元素时，`HashMap` 的扩容过程如下：

**初始容量**：16

- 插入第 1 到第 12 个元素时，不需要扩容。
- 插入第 13 个元素时，达到负载因子限制，需要扩容。此时，HashMap 的容量从 16 扩容到 32。

**扩容后的容量**：32

- 插入第 14 到第 24 个元素时，不需要扩容。

因此，总共会进行一次扩容。

##### [#](https://xiaolincoding.com/interview/collections.html#说说hashmap的负载因子)说说hashmap的负载因子

HashMap 负载因子 loadFactor 的默认值是 0.75，当 HashMap 中的元素个数超过了容量的 75% 时，就会进行扩容。

默认负载因子为 0.75，是因为它提供了空间和时间复杂度之间的良好平衡。

负载因子太低会导致大量的空桶浪费空间，负载因子太高会导致大量的碰撞（添加元素时，hash冲突概率变高），降低性能。0.75 的负载因子在这两个因素之间取得了良好的平衡。

例如，手机充电的时候，马斯克形容的就是，电子在电池中寻找自己的位置，所以在低电量的时候，充电速度会很快，在高电量的时候，速度很慢，类似于hashmap给键值对寻找地址。然后手机电池的一个阀值就是80%，大于这个值，通常厂家都会做限流保护，降低充电电流。或者干脆80%就不让充电了。



#### **3.4.2 `ConcurrentHashmap`** 

##### （）`ConcurrentHashMap` 基础知识 

`ConcurrentHashMap` 。`Java5`时 ，在`JUC（java.util.concurrent）`包中提供了大量支持并发的容器类。

##### （）为什么`ConcurrentHashMap`和`HashTable`的Key和Value不能为Null

- **`ConcurrentHashMap`和`HashTable`**：这些数据结构是线程安全的，它们不允许键和值为null。这是为了避免在多线程环境中出现的二义性问题。例如，如果*`ConcurrentHashMap.get(key)`*返回null，这个null可能意味着键从未在映射中出现过，或者键的值就是null。如果允许值为null，那么在多线程环境下，就无法准确判断返回的null是哪种情况。
- **避免异常**：在多线程环境中，可能存在并发修改的情况。如果在调用*`containsKey(key)`*方法后，另一个线程删除了该键，那么*get(key)*方法返回的null将代表没有这个键，而调用线程可能会误以为是值为空，从而引发矛盾和异常。

示例代码

```java
import java.util.HashMap;
import java.util.Hashtable;
public class TestMap {
public static void main(String[] args){
    HashMap<Integer,Integer> map = new HashMap<>();
	System.out.println(map.containsKey(null)); // false
	System.out.println(map.get(null)); // null
	// 验证HashMap的key和value都可以为null
	map.put(null,null);
	System.out.println(map.containsKey(null)); // true
	System.out.println(map.get(null)); // null
	// 当key为空时，key的hash值为0，所以如果再设置一个值会对原有value进行覆盖
	map.put(null,123);
	System.out.println(map.containsKey(null)); // true
	System.out.println(map.get(null)); // 123
	// 验证Hashtable
	Hashtable<Integer,Integer> hashtable = new Hashtable<>();
	try {
		hashtable.put(null,null);
	} catch (NullPointerException e) {
		System.out.println("Hashtable的key和value不能为null");
	}
	}
}
```

在上述代码中，我们可以看到`HashMap`允许键和值为null，而`Hashtable`则不允许。这反映了在不同场景下对数据结构的不同要求。在单线程环境下，`HashMap`的灵活性为开发者提供了便利。然而，在多线程环境下，为了保证数据的一致性和线程安全，`ConcurrentHashMap`和`Hashtable`等数据结构就不允许键和值为null。



##### （重点）`ConcurrentHashMap`怎么实现的？

###### `JDK 1.7 ConcurrentHashMap`

> `JDK 1.7 ConcurrentHashMap`

在 `JDK 1.7` 中它使用的是数组加链表的形式实现的，而数组又分为：大数组 `Segment` 和小数组 `HashEntry`。 `Segment `是一种可重入锁（`ReentrantLock`），在 `ConcurrentHashMap` 里扮演锁的角色；`HashEntry` 则用于存储键值对数据。一个 `ConcurrentHashMap` 里包含一个 `Segment` 数组，一个 `Segment `里包含一个 `HashEntry `数组，每个 `HashEntry` 是一个链表结构的元素。

PS：你就把`Segment `当成`hashmap`中的`hash`槽就可以了。每一个`Segment `就相当于一个小的`hash`表

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1721807523151-41ad316a-6264-48e8-9704-5b362bc0083c.webp)

`JDK 1.7 ConcurrentHashMap` 分段锁技术将数据分成一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据的时候，其他段的数据也能被其他线程访问，能够实现真正的并发访问。

###### `JDK 1.8 ConcurrentHashMap`（别看）

> `JDK 1.8 ConcurrentHashMap`

在` JDK 1.7` 中，`ConcurrentHashMap` 虽然是线程安全的，但因为它的底层实现是数组 + 链表的形式，所以在数据比较多的情况下访问是很慢的，因为要遍历整个链表，而 `JDK 1.8` 则使用了数组 + 链表/红黑树的方式优化了 `ConcurrentHashMap `的实现，具体实现结构如下：

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1721807523128-7b1419e7-e6ba-47e6-aba0-8b29423a8ce7.webp)

`JDK 1.8 ConcurrentHashMap ` 主要通过 `volatile + CAS` 或者 `synchronized `来实现的线程安全的。添加元素时首先会判断容器*（单个哈希槽）*是否为空：

- 如果为空则使用` volatile` 加 `CAS `来初始化
- 如果容器*（单个哈希槽）*不为空，则根据存储的元素计算该位置是否为空。
  - 如果根据存储的元素计算结果为空，则利用 `CAS `设置该节点；
  - 如果根据存储的元素计算结果不为空，则使用 synchronized ，然后，遍历桶中的数据，并替换或新增节点到桶中，最后再判断是否需要转为红黑树，这样就能保证并发访问时的线程安全了。

如果把上面的执行用一句话归纳的话，就相当于是`ConcurrentHashMap`通过对头结点加锁来保证线程安全的，锁的粒度相比 Segment 来说更小了，发生冲突和加锁的频率降低了，并发操作的性能就提高了。

而且 JDK 1.8 使用的是红黑树优化了之前的固定链表，那么当数据量比较大的时候，查询性能也得到了很大的提升，从之前的 O(n) 优化到了 O(logn) 的时间复杂度。

（上边写得真烂，别看）

ConcurrentHashMap 在 Java 8 中的实现结合了 CAS 操作、细粒度锁和红黑树优化，以实现高效的线程安全。以下是其核心实现机制：

###### 1. **数据结构** （和hashmap一样）

- **Node 数组**：哈希表的基础结构，每个桶（Bucket）是一个链表或红黑树。
- **链表与红黑树转换**：当链表长度超过 8 时，转换为红黑树（时间复杂度 O(log n)）；当节点数减少到 6 时，转换回链表，以平衡性能与空间。

###### 2. **线程安全机制**（重点讲）

- **`CAS 操作`**：插入空桶时，直接通过 `CAS` 写入头节点，无需加锁。
- **synchronized 锁**：对非空桶的头节点加锁，确保同一时刻只有一个线程修改链表或树结构，锁粒度细化到单个桶。

###### 3. **并发扩容**

- **多线程协作扩容**：当需要扩容时，线程在操作时协助迁移数据。通过 `ForwardingNode` 标记已迁移的桶，其他线程访问时会参与迁移。
- **逐步迁移**：将旧表分成多个区块，每个线程负责迁移特定区块，避免全局阻塞。

###### 4. **计数与可见性**

- **volatile 变量**：Node 的 `val` 和 `next` 字段用 `volatile` 修饰，保证可见性。
- **计数优化**：采用类似 `LongAdder` 的分段计数（`baseCount` + `CounterCell` 数组），减少竞争，提高并发更新的效率。

###### 5. **弱一致性迭代器**  （无锁遍历）

- **无锁遍历**：迭代器创建时基于当前数据快照，允许后续修改，不会抛出 `ConcurrentModificationException`，但可能不反映最新状态。

###### 6. **哈希与索引计算** （忽略）

- **哈希算法优化**：通过 `spread` 方法（`(h ^ (h >>> 16)) & HASH_BITS`）分散哈希值，减少冲突。
- **动态扩容**：容量为 2 的幂次方，通过高位掩码定位索引，扩容时翻倍。

###### 7. **初始化与延迟加载** （忽略）

- **`CAS 初始化`**：首次插入时通过 `CAS` 竞争初始化哈希表，避免重复创建。

###### 8. **高效读操作** （无锁读）

- **无锁读**：`get()` 操作直接访问 `volatile` 字段，无需加锁，依赖内存可见性保证数据一致性。

###### 示例流程（PUT 操作）：

1. **计算哈希**：对键哈希进行优化处理。

2. 

   插入节点

   ：

   - 若桶为空，CAS 插入新节点。
   - 若桶非空，对头节点加 `synchronized` 锁，处理链表或树插入。

3. **触发扩容**：插入后检查是否需要扩容，若需要则协助迁移数据。

###### 总结

ConcurrentHashMap 通过细粒度锁（桶级别）、CAS、多线程协作扩容和数据结构优化，在保证线程安全的同时，大幅降低了锁竞争，适用于高并发场景。相较于 Java 7 的分段锁设计，Java 8 的实现显著提升了并发性能与扩展性。

源代码如下：

```java
public class ConcurrentHashMap {
    // 使用 volatile 关键字来保存table数组
    transient volatile Node<K,V>[] table;//默认没初始化的数组，用来保存元素
	private transient volatile Node<K,V>[] nextTable;//转移的时候用的数组
    // 同样使用 volatile 来修饰元素总数。
    private transient volatile  long baseCount ;
    
    // 其他方法...
    
    static class Node<K,V> implements Map.Entry<K,V> {
    	final int hash;    // 哈希值（final 不可变）
    	final K key;       // 键（final 不可变）
    	volatile V val;    // 值（volatile 修饰）
    	volatile Node<K,V> next;  // 下一个节点（volatile 修饰）

    	Node(int hash, K key, V val, Node<K,V> next) {
        	this.hash = hash;
        	this.key = key;
        	this.val = val;
        	this.next = next;
    	} // 构造函数
    } // Node
    // 红黑树节点
    static final class TreeNode<K,V> extends Node<K,V> {
        TreeNode<K,V> parent;  // red-black tree links
        TreeNode<K,V> left;
        TreeNode<K,V> right;
        TreeNode<K,V> prev;    // needed to unlink next upon deletion
        boolean red;

        TreeNode(int hash, K key, V val, Node<K,V> next,
                 TreeNode<K,V> parent) {
            super(hash, key, val, next);
            this.parent = parent;
        }
	} // TreeNode
    // 其他方法...
} // ConcurrentHashMap
    

```



##### （）用`baseCount` + `CounterCell`来统计元素总数的原理

在 `ConcurrentHashMap` 中，元素总数的统计是一个高频且高并发的操作。如果直接使用单一的 `volatile` 变量（如 `size`）来记录总数，所有线程的更新操作会集中在同一个变量上，导致严重的**缓存行竞争**（False Sharing）和 **CAS 失败重试**，从而降低性能。因此，Java 8 借鉴了 `LongAdder` 的设计思想，采用 **分片计数** 策略，即通过 `baseCount` + `CounterCell[]` 的组合来实现高效的无锁计数。

------

###### **1. 核心设计思想**

- **分散竞争**：将全局计数拆分为一个基础值（`baseCount`）和多个分片计数器（`CounterCell`），不同线程优先更新不同的分片，减少冲突。
- **最终一致性**：总数是 `baseCount` 与所有 `CounterCell` 分片值的总和，允许短暂的不一致，但保证最终正确。

------

###### **2. 源码结构与关键字段**

**(1) 基础计数器 `baseCount`**

```java
// 基础计数值，通过 CAS 更新
private transient volatile long baseCount;
```

- **直接更新**：当无竞争时，线程直接通过 CAS 修改 `baseCount`。
- **竞争回退**：若 CAS 失败（其他线程在更新），则转而使用 `CounterCell` 分片。

**(2) 分片计数器数组 `CounterCell[]`**

```java
// 分片计数数组，懒初始化，长度总是 2 的幂
private transient volatile CounterCell[] counterCells;

// 分片计数单元（静态内部类）
@sun.misc.Contended  // 防止缓存行伪共享
static final class CounterCell {
    volatile long value;  // 分片计数值
    CounterCell(long x) { value = x; }
}
```

- **分片存储**：每个 `CounterCell` 是一个独立的分片，线程通过哈希选择自己的分片。
- **避免伪共享**：`@Contended` 注解填充缓存行，确保每个 `CounterCell` 独占一个缓存行（64 字节）。
- **懒初始化**：默认不创建数组，仅在发生竞争时初始化。

######  **总结**

- **设计目标**：通过分片计数减少竞争，提升高并发下的计数性能。

  实现核心

  - `baseCount` 作为基础计数器，无竞争时直接更新。
  - `CounterCell[]` 作为分片数组，竞争时分散更新。
  - 探针哈希和动态扩容确保分片分配的均衡性。

- **适用场景**：适用于 `size()`、`mappingCount()` 等高并发计数需求，但结果弱一致。

##### [#](https://xiaolincoding.com/interview/collections.html#分段锁怎么加锁的)`JDK1.7`分段锁怎么加锁的？

在 `ConcurrentHashMap` 中，将整个数据结构分为多个 `Segment`，每个 `Segment` 都类似于一个小的 `HashMap`，每个 `Segment `都有自己的锁，不同` Segment `之间的操作互不影响，从而提高并发性能。

在 `ConcurrentHashMap` 中，对于插入、更新、删除等操作，需要先定位到具体的 `Segment`，然后再在该 `Segment `上加锁，而不是像传统的 `HashMap` 一样对整个数据结构加锁。这样可以使得不同 `Segment `之间的操作并行进行，提高了并发性能。

##### [#](https://xiaolincoding.com/interview/collections.html#分段锁是可重入的吗)分段锁是可重入的吗？

`JDK 1.7 ConcurrentHashMap`中的分段锁是用了 `ReentrantLock`，是一个可重入的锁。

##### [#](https://xiaolincoding.com/interview/collections.html#已经用了synchronized-为什么还要用cas呢)`JDK1.8`已经用了`synchronized`，为什么还要用`CAS`呢？

`ConcurrentHashMap`使用这两种手段来保证线程安全主要是一种权衡的考虑，在某些操作中使用`synchronized`，还是使用`CAS`，主要是根据锁竞争程度来判断的。

比如：在`putVal`中，如果计算出来的`hash`槽没有存放元素，那么就可以直接使用`CAS`来进行设置值，这是因为在设置元素的时候，因为hash值经过了各种扰动后，造成hash碰撞的几率较低，那么我们可以预测使用较少的自旋来完成具体的hash落槽操作。

**当发生了hash碰撞的时候说明容量不够用了或者已经有大量线程访问了**，因此这时候使用`synchronized`来处理`hash`碰撞比`CAS`效率要高，因为发生了`hash`碰撞大概率来说是线程竞争比较强烈。

##### [#](https://xiaolincoding.com/interview/collections.html#concurrenthashmap用了悲观锁还是乐观锁)`ConcurrentHashMap`用了悲观锁还是乐观锁?

悲观锁和乐观锁都有用到。

添加元素时首先会判断容器是否为空：

- 如果为空则使用 `volatile` 加 **`CAS `（乐观锁）** 来初始化。
- 如果容器不为空，则根据存储的元素计算该位置是否为空。
- 如果根据存储的元素计算结果为空，则利用 **`CAS`（乐观锁）** 设置该节点；
- 如果根据存储的元素计算结果不为空，则使用 **`synchronized`（悲观锁）** ，然后，遍历桶中的数据，并替换或新增节点到桶中，最后再判断是否需要转为红黑树，这样就能保证并发访问时的线程安全了







#### **3.4.3 `HashTable`** 

##### （）以下是 **`HashMap`** 和 **`Hashtable`** 的核心区别总结表：

|     **对比维度**     |         **`HashMap`**          |             **`Hashtable`**              |
| :------------------: | :----------------------------: | :--------------------------------------: |
|    **线程安全性**    |           非线程安全           |  线程安全（方法用 `synchronized` 修饰）  |
| **`Null` 键/值支持** |     ✅ 允许键和值为 `null`      |         ❌ 键和值均不可为 `null`          |
|       **性能**       |   高（无锁，红黑树优化冲突）   |      低（同步锁开销，链表处理冲突）      |
|   **默认初始容量**   |               16               |                    11                    |
|     **扩容机制**     | 翻倍（`newCap = oldCap << 1`） | 翻倍 +1（`newCap = (oldCap << 1) + 1`）  |
|      **迭代器**      |  快速失败（`Iterator`迭代器）  |    非快速失败（`Enumeration`枚举器）     |
|      **继承类**      |         `AbstractMap`          |   `Dictionary`（遗留类，已不推荐使用）   |
|     **推荐场景**     |       单线程、高性能场景       | ❌ 已过时，多线程改用 `ConcurrentHashMap` |

##### （）以下是 **`Iterator`** 和 **`Enumeration`** 的核心对比总结，以及它们在 Java 中的应用场景：

|   **对比维度**   |                  **`Iterator`迭代器**                  |       **`Enumeration`枚举器**        |
| :--------------: | :----------------------------------------------------: | :----------------------------------: |
|   **出现版本**   |             Java 1.2（集合框架更新后引入）             |       Java 1.0（早期遗留接口）       |
|    **所属包**    |                      `java.util`                       |             `java.util`              |
|   **核心方法**   |           `hasNext()`, `next()`, `remove()`            | `hasMoreElements()`, `nextElement()` |
| **支持删除元素** |                 ✅ 提供 `remove()` 方法                 |           ❌ 无删除操作能力           |
| **快速失败机制** | ✅ 检测并发修改并抛出 `ConcurrentModificationException` |     ❌ 无此机制，遍历时不检测修改     |
|   **适用场景**   |       现代集合（如 `List`, `Set`, `Map` 的视图）       | 遗留集合（如 `Vector`, `Hashtable`） |
|  **推荐使用性**  |                ✅ 优先使用（功能更强大）                |     ❌ 已过时（仅用于兼容旧代码）     |

**快速失败机制（Fail-Fast）**

- **Iterator** 的快速失败机制通过检查集合的 `modCount`（修改计数器）实现。若遍历过程中集合被外部修改（如直接调用 `add()` 或 `remove()`），`modCount` 会变化，`Iterator` 会立即抛出异常。
- **Enumeration** 无此机制，遍历时不检测修改，可能导致数据不一致。







##### （）`Hashmap`和`Hashtable`有什么不一样的？`Hashmap`一般怎么用？

- **`HashMap`线程不安全**，效率高一点，可以存储null的key和value，null的key只能有一个，null的value可以有多个。默认初始容量为16，每次扩充变为原来2倍。创建时如果给定了初始容量，则扩充为2的幂次方大小。底层数据结构为数组+链表，插入元素后如果链表长度大于阈值（默认为8），先判断数组长度是否小于64，如果小于，则扩充数组，反之将链表转化为红黑树，以减少搜索时间。
- **`HashTable`线程安全**，效率低一点，其内部方法基本都经过`synchronized`修饰，不可以有null的key和value。默认初始容量为`11`，每次扩容变为原来的`2n+1`。创建时给定了初始容量，会直接用给定的大小。底层数据结构为数组+链表。它基本被淘汰了，要保证线程安全可以用`ConcurrentHashMap`。
- **怎么用**：`HashMap`主要用来存储键值对，可以调用put方法向其中加入元素，调用get方法获取某个键对应的值，也可以通过`containsKey`方法查看某个键是否存在等

##### `HashTable` 底层实现原理是什么？

![img](https://raw.githubusercontent.com/shilic/picx-images-hosting/master/img/1719982934770-8587cb0a-6e1d-4007-9a22-bc1e41276491.png)



- `Hashtable`的底层数据结构主要是**数组加上链表**，数组是主体，链表是解决hash冲突存在的（链接法，将哈希冲突的值连接到一个链表上，再用equal()确保唯一）。
- `HashTable`是线程安全的，实现方式是**`Hashtable`的所有公共方法均采用`synchronized`关键字**，当一个线程访问同步方法，另一个线程也访问的时候，就会陷入阻塞或者轮询的状态。

##### [#](https://xiaolincoding.com/interview/collections.html#hashtable线程安全是怎么实现的)`HashTable`线程安全是怎么实现的？

因为它的put，get做成了同步方法，保证了`Hashtable`的线程安全性，每个操作数据的方法都进行同步控制之后，由此带来的问题任何一个时刻**只能有一个线程可以操纵`Hashtable`，所以其效率比较低**。

`Hashtable` 的 `put(K key, V value)` 和 `get(Object key)` 方法的源码：

```java
public synchronized V put(K key, V value) {
// Make sure the value is not null
if (value == null) {
    throw new NullPointerException();
}
 // Makes sure the key is not already in the hashtable.
Entry<?,?> tab[] = table;
int hash = key.hashCode();
int index = (hash & 0x7FFFFFFF) % tab.length;
@SuppressWarnings("unchecked")
Entry<K,V> entry = (Entry<K,V>)tab[index];
for(; entry != null ; entry = entry.next) {
    if ((entry.hash == hash) && entry.key.equals(key)) {
        V old = entry.value;
        entry.value = value;
        return old;
    }
}
 addEntry(hash, key, value, index);
return null;
}

public synchronized V get(Object key) {
Entry<?,?> tab[] = table;
int hash = key.hashCode();
int index = (hash & 0x7FFFFFFF) % tab.length;
for (Entry<?,?> e = tab[index] ; e != null ; e = e.next) {
    if ((e.hash == hash) && e.key.equals(key)) {
        return (V)e.value;
    }
}
return null;
}
```

可以看到，**`Hashtable`是通过使用了 `synchronized` 关键字来保证其线程安全**。

在Java中，可以使用`synchronized`关键字来标记一个方法或者代码块，当某个线程调用该对象的`synchronized`方法或者访问`synchronized`代码块时，这个线程便获得了该对象的锁，其他线程暂时无法访问这个方法，只有等待这个方法执行完毕或者代码块执行完毕，这个线程才会释放该对象的锁，其他线程才能执行这个方法或者代码块。

##### [#](https://xiaolincoding.com/interview/collections.html#hashtable-和concurrenthashmap有什么区别)`hashtable` 和`concurrentHashMap`有什么区别

**底层数据结构：**

- `jdk7`之前的`ConcurrentHashMap`底层采用的是**分段的数组+链表**实现，`jdk8`之后采用的是**数组+链表/红黑树；**
- `HashTable`采用的是**数组+链表**，数组是主体，链表是解决hash冲突存在的。

**实现线程安全的方式：**

- `jdk8`以前，`ConcurrentHashMap`采用分段锁，对整个数组进行了分段分割，每一把锁只锁容器里的一部分数据，多线程访问不同数据段里的数据，就不会存在锁竞争，提高了并发访问；`jdk8`以后，直接采用数组+链表/红黑树，并发控制使用`CAS`和`synchronized`操作，更加提高了速度。
- `HashTable`：所有的方法都加了锁来保证线程安全，但是效率非常的低下，当一个线程访问同步方法，另一个线程也访问的时候，就会陷入阻塞或者轮询的状态。

##### [#](https://xiaolincoding.com/interview/collections.html#说一下hashmap和hashtable、concurrentmap的区别)说一下`HashMap`和`Hashtable`、`ConcurrentMap`的区别

- `HashMap`线程不安全，效率高一点，可以存储null的key和value，null的key只能有一个，null的value可以有多个。默认初始容量为16，每次扩充变为原来2倍。创建时如果给定了初始容量，则扩充为2的幂次方大小。底层数据结构为数组+链表，插入元素后如果链表长度大于阈值（默认为8），先判断数组长度是否小于64，如果小于，则扩充数组，反之将链表转化为红黑树，以减少搜索时间。
- `HashTable`线程安全，效率低一点，其内部方法基本都经过`synchronized`修饰，不可以有null的key和value。默认初始容量为`11`，每次扩容变为原来的`2n+1`。创建时给定了初始容量，会直接用给定的大小。底层数据结构为数组+链表。它基本被淘汰了，要保证线程安全可以用`ConcurrentHashMap`。
- `ConcurrentHashMap`是Java中的一个线程安全的哈希表实现，它可以在多线程环境下并发地进行读写操作，而不需要像传统的HashTable那样在读写时加锁。`ConcurrentHashMap`的实现原理主要基于分段锁和`CAS`操作。它将整个哈希表分成了多`Segment`（段），每个`Segment`都类似于一个小的`HashMap`，它拥有自己的数组和一个独立的锁。在`ConcurrentHashMap`中，读操作不需要锁，可以直接对`Segment`进行读取，而写操作则只需要锁定对应的`Segment`，而不是整个哈希表，这样可以大大提高并发性能。

#### 3.4.4  概念

##### 如何对map进行快速遍历？

- 使用for-each循环和entrySet()方法：这是一种较为常见和简洁的遍历方式，它可以同时获取`Map`中的键和值

```java
import java.util.HashMap;
import java.util.Map;

public class MapTraversalExample {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("key1", 1);
        map.put("key2", 2);
        map.put("key3", 3);

        // 使用for-each循环和entrySet()遍历Map
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
        }
    }
}
```

- 使用for-each循环和keySet()方法：如果只需要遍历`Map`中的键，可以使用`keySet()`方法，这种方式相对简单，性能也较好。

```java
import java.util.HashMap;
import java.util.Map;

public class MapTraversalExample {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("key1", 1);
        map.put("key2", 2);
        map.put("key3", 3);

        // 使用for-each循环和keySet()遍历Map的键
        for (String key : map.keySet()) {
            System.out.println("Key: " + key + ", Value: " + map.get(key));
        }
    }
}
```

- 使用迭代器：通过获取Map的entrySet()或keySet()的迭代器，也可以实现对Map的遍历，这种方式在需要删除元素等操作时比较有用。

```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

public class MapTraversalExample {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("key1", 1);
        map.put("key2", 2);
        map.put("key3", 3);

        // 使用迭代器遍历Map
        Iterator<Entry<String, Integer>> iterator = map.entrySet().iterator();
        while (iterator.hasNext()) {
            Entry<String, Integer> entry = iterator.next();
            System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
        }
    }
}
```

- 使用 Lambda 表达式和forEach()方法：在 Java 8 及以上版本中，可以使用 Lambda 表达式和`forEach()`方法来遍历`Map`，这种方式更加简洁和函数式。

```java
import java.util.HashMap;
import java.util.Map;

public class MapTraversalExample {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("key1", 1);
        map.put("key2", 2);
        map.put("key3", 3);

        // 使用Lambda表达式和forEach()方法遍历Map
        map.forEach((key, value) -> System.out.println("Key: " + key + ", Value: " + value));
    }
}
```

- 使用Stream API：Java 8 引入的`Stream API`也可以用于遍历`Map`，可以将`Map`转换为流，然后进行各种操作。

```java
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class MapTraversalExample {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("key1", 1);
        map.put("key2", 2);
        map.put("key3", 3);

        // 使用Stream API遍历Map
        map.entrySet().stream()
          .forEach(entry -> System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue()));

        // 还可以进行其他操作，如过滤、映射等
        Map<String, Integer> filteredMap = map.entrySet().stream()
                                            .filter(entry -> entry.getValue() > 1)
                                            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        System.out.println(filteredMap);
    }
}
```







### 3.5  泛型

##### #什么是泛型？

泛型是 Java 编程语言中的一个重要特性，它允许类、接口和方法在定义时使用一个或多个类型参数，这些类型参数在使用时可以被指定为具体的类型。

泛型的主要目的是在编译时提供更强的类型检查，并且在编译后能够保留类型信息，避免了在运行时出现类型转换异常。

> 为什么需要泛型？

- **适用于多种数据类型执行相同的代码**

```java
private static int add(int a, int b) {
    System.out.println(a + "+" + b + "=" + (a + b));
    return a + b;
}

private static float add(float a, float b) {
    System.out.println(a + "+" + b + "=" + (a + b));
    return a + b;
}

private static double add(double a, double b) {
    System.out.println(a + "+" + b + "=" + (a + b));
    return a + b;
}
```

如果没有泛型，要实现不同类型的加法，每种类型都需要重载一个add方法；通过泛型，我们可以复用为一个方法：

```java
private static <T extends Number> double add(T a, T b) {
    System.out.println(a + "+" + b + "=" + (a.doubleValue() + b.doubleValue()));
    return a.doubleValue() + b.doubleValue();
}
```

- **泛型中的类型在使用时指定，不需要强制类型转换**（**类型安全**，编译器会**检查类型**）

看下这个例子：

```java
List list = new ArrayList();
list.add("xxString");
list.add(100d);
list.add(new Person());
```

我们在使用上述list中，list中的元素都是Object类型（无法约束其中的类型），所以在取出集合元素时需要人为的强制类型转化到具体的目标类型，且很容易出现java.lang.ClassCastException异常。

引入泛型，它将提供类型的约束，提供编译前的检查：

```java
List<String> list = new ArrayList<String>();

// list中只能放String, 不能放其它类型的元素
```

##### （）泛型实现的原理？

**类型擦除、编译期类型检查、强制类型转换。**

JDK1.5之前都是采用的无泛型结构的集合。故为了兼容以前的代码，采用了这样的方式。

编译过后无法保留泛型的信息，

如何保证类型安全？而泛型的信息，只在编译时进行检查，从而保证类型安全。

然后在泛型内部，通过Object储存，最后get()取值的时候，再强制转换为具体类型，实际上也是使用了强制类型转换。

##### （）泛型的协变和逆变

List<?>可以表示任何类型的泛型，但是在赋值之后，就无法改变自身的值

如下

```java
List a1 = new ArrayList();
List<?> a4 = a1;
```

什么是协变？

```java
Object[] array1;
String[] array2 = new String[5];
array1 = array2; // 这里就是数组的协变

List<Integer> intList = new ArrayList<Integer>(3);
intList.add(111);
List<Object> obList = intList ;// 这里是集合的协变，然而这里会报错，因为java的集合不支持协变。
```

好，现在来说明一下两者。协变必须保证类型安全。

因为数组的类型是确定的，不是泛型，也没有类型擦除，故类型是安全的。可以进行协变

而集合采用了泛型，在协变的时候，类型是不安全的，故不可以协变。

> 所以java采用了其他方式保证协变时的类型安全。如< ? extend T>

###### **协变 （`Covariance`）`<? extends Animal>`**

协变指的是如果类型 `Dog` 是类型 `Animal` 的子类型，那么 `Generic<Dog>` 也是 `Generic<Animal>` 的子类型。换句话说，协变允许泛型类型参数沿着继承关系向上转型。**也就是读取优先**，在`kotlin`中采用 out 关键字，因为是读取，所以适用于消费元素为主的场景。

```java
class Animal {}
class Dog extends Animal {}

List<Dog> dogs = new ArrayList<>();
List<? extends Animal> animals = dogs; // 协变，但是只读。
```

协变 <? extends Animal> 用于消费元素，在 kotlin 的 List 源码中，用于返回值，不可以用于参数，也就是只读。

在这个例子中，`Dog` 是 `Animal` 的子类型，因此 `List<Dog>` 可以被赋值给 `List<? extends Animal>`。这里 `? extends Animal` 表示一个未知的类型，但它必须是 `Animal` 或其子类型。

**限制：**

你不能向 `List<? extends Animal>` 中添加任何元素（除了 `null`），因为编译器无法确定具体的类型。

```java
animals.add(new Dog()); // 编译错误。协变的代价是不可以添加元素。
animals.add(null); // 允许
```



###### **逆变 （`Contravariance`）`<? super Dog>`**

逆变指的是如果类型 `Dog` 是类型 `Animal` 的子类型，那么 `Generic<Animal>` 是 `Generic<Dog>` 的子类型。换句话说，逆变允许泛型类型参数沿着继承关系向下转型。将集合中的元素从父类 Animal 转换为 Dog ，也就是向下转型。**也就是写入优先**，在`kotlin`中采用in 关键字。有点类似于投票的操作，任何人都可以往里投票，但是不知道是谁投的，**相当于泛型的丢失**。在代码中就相当于是，`Animal`被向下转型变成了`Dog`，父类的信息就丢失了；在读取的时候，一律当成了`Object`对象。

```java
class Animal {}
class Dog extends Animal {}
class JinMao extends Dogs {}

List<Animal> animals = new ArrayList<>();
List<? super Dog> dogs = animals; // 逆变
dogs.add(new JinMao()); // 逆变的集合可以添加元素，添加自身和子类
Gogs dog = (Dogs) dogs.get(0); // 逆变的集合取出的只能是 Object
```

在这个例子中，`Dog` 是 `Animal` 的子类型，因此 `List<Animal>` 可以被赋值给 `List<? super Dog>`。这里 `? super Dog` 表示一个未知的类型，但它必须是 `Dog` 或其父类型。

限制：

你可以向 `List<? super Dog>` 中添加 `Dog` 或其子类型的元素，但不能添加 `Animal` 类型的元素。

```java
dogs.add(new Dog()); // 允许
dogs.add(new Animal()); // 编译错误
```

###### 总结

- **协变（`Covariance`）**: 使用 `? extends Animal`，允许读取元素，但不能写入（除了 `null`）。
- **逆变（`Contravariance`）**: 使用 `? super Dog`，允许写入元素，但读取时只能得到 `Object` 类型。



### 3.6 元素的比较





