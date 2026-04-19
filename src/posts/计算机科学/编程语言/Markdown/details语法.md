# details语法

在 Markdown 中实现点击隐藏和显示的效果，通常需要借助 HTML 的 `<details>` 和 `<summary>` 标签，因为原生 Markdown 并不支持这种交互功能。以下是具体实现方式：

<details open >
  <summary >点击查看答案</summary>
这里是隐藏的内容  
  **支持 Markdown 语法** 
  `也可以嵌入代码`

```java
class Data{
    
}

```

## 标题一



## 标题二





## 标题三



**外层内容**  

<details>
  <summary>🔽 第二层（嵌套）</summary>
第二层内容


* 内层内容  
* 支持任意 Markdown 元素

```java
class Data{
    
}
```



<details >
  <summary>Level 3</summary>
🎯 最深层内容
第三层嵌套内容
</details>
</details>
</details>

<span style="color: black; background: black; transition: 0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='black'">
  悬停显示这段文字
</span>

