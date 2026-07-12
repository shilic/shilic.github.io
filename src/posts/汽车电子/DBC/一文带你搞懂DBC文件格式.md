# 一文带你搞懂DBC文件格式

## DBC是什么？

一辆现代汽车上有几十个 ECU（电子控制单元）——发动机控制器、变速箱控制器、车身稳定系统、空调面板、车门模块……它们在一条 CAN 总线上以每秒几百上千帧的速度互相通信。但 CAN 总线只负责传输原始数据：一帧数据就是一个 ID 加 8 个字节的 payload。如果没有说明书，你看到的永远是"ID 0x123 发了 `00 1A FF 03 00 00 00 00`"——这八个十六进制数到底代表什么？车速？发动机转速？还是某个开关的状态？

DBC（Database CAN）文件就是这个说明书。它用一套标准化的文本格式，把 CAN 总线上每一帧报文的每一个信号都描述得清清楚楚：这是什么物理量、占哪几个 bit、怎么换算成工程值、单位是什么、发给谁看。有了 DBC 文件，任何工具和开发者都能用同一套规则去解读 CAN 总线上的数据，不再需要人对人传话、文档对文档吵架。

一个 DBC 文件里主要定义了三层东西：

| 层级 | 对应概念 | 说明 |
|---|---|---|
| **报文（Message）** | 一帧 CAN 数据 | 定义报文 ID、名称、长度（DLC）、发送节点、周期 |
| **信号（Signal）** | 报文里的一个数据字段 | 定义起始位、长度、字节序、缩放系数、偏移量、单位、值域 |
| **节点（Node）** | 总线上的一个 ECU | 定义哪些节点发送哪些报文、接收哪些报文 |

这三层关系是嵌套的：一个节点收发多条报文，一条报文包含多个信号，每个信号对应一个物理量。DBC 文件本质上是这个三层结构的**唯一事实来源（Single Source of Truth）**——软件工程师根据它写通信代码，测试工程师根据它搭建仿真环境，诊断工具根据它解析车辆故障。整个 CAN 网络的协同开发，都建立在 DBC 文件之上。

## DBC应用场景

`DBC` 文件不是写完就放一边的文档——它是能被工具直接消费的**机器可读的通信协议**。这就意味着它可以嵌入到开发和测试的自动化链路里。三个最核心的应用场景：

**自动代码生成**

手写 `CAN` 通信代码有两个问题：一是报文多了容易出错（几百个信号，哪个在哪个报文里、从第几位开始、`Motorola` 还是 `Intel` 格式，纯人脑记不住），二是协议一旦更新，代码和 `DBC` 不一致就是 `bug`。成熟的工具链（如 `Vector` 的 `GENy`、`ETAS` 的 `RTA` 系列）可以直接读取 `DBC` 文件，自动生成 `ECU` 的通信栈代码——发送报文的打包函数、接收报文的解包函数、信号的缩放换算逻辑——全部由工具保证和 DBC 一致。

**系统测试与仿真**

测试 CAN 通信能不能脱离真实硬件？不仅要能，而且是常态。`HIL`（硬件在环）测试平台和 `CANoe`、`CANalyzer` 这类工具直接加载 `DBC` 文件，就能把二进制报文解析成有意义的信号名和工程值。更关键的是**剩余总线仿真**——你要单独测一个 `ECU`，但总线上其他节点不存在。工具根据 `DBC` 文件来模拟那些"假"节点按协议发报文，你的被测 `ECU` 完全不知道自己在跟仿真器聊天。

**车辆诊断**

诊断仪插上 `OBD` 口，怎么知道读回来的故障码代表什么？怎么知道 0x180 报文第 3 字节是冷却液温度还是机油压力？诊断工具加载 DBC 后，无需人工查表即可直接将原始 hex 映射为诊断参数名称和物理值。

> DBC 文件的价值不在文件本身——在于它让**一整车的人用同一套语言说话**。整车厂、Tier 1 供应商、测试团队、诊断团队，所有人读的是同一份 DBC。协议改了一个信号的 scaling factor？更新 DBC，所有环节同步生效。

## DBC文件格式详解

DBC的文件格式参考了vector官方的 《[DBC_File_Format_Documentation.pdf](https://github.com/shilic/shilic.github.io/blob/main/src/posts/%E6%B1%BD%E8%BD%A6%E7%94%B5%E5%AD%90/DBC/assets/DBC_File_Format_Documentation.pdf)》 文件， 里边非常清晰的讲解了每一个字段应该如何填写。

文件链接：[https://github.com/shilic/shilic.github.io/blob/main/src/posts/汽车电子/DBC/assets/DBC_File_Format_Documentation.pdf](https://github.com/shilic/shilic.github.io/blob/main/src/posts/汽车电子/DBC/assets/DBC_File_Format_Documentation.pdf) 点击即可下载查看

### DBC文件示例

<details open >
  <summary >点击查看DBC文件示例</summary>
<pre style="background:#282c34;color:#abb2bf;padding:1.2em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">VERSION</span> <span style="color:#98c379">"1.0.1"</span><br><br><span style="color:#c678dd">NS_</span> :<br>&#9;NS_DESC_<br>&#9;CM_<br>&#9;BA_DEF_<br>&#9;BA_<br>&#9;VAL_<br>&#9;CAT_DEF_<br>&#9;CAT_<br>&#9;FILTER<br>&#9;BA_DEF_DEF_<br>&#9;EV_DATA_<br>&#9;ENVVAR_DATA_<br>&#9;SGTYPE_<br>&#9;SGTYPE_VAL_<br>&#9;BA_DEF_SGTYPE_<br>&#9;BA_SGTYPE_<br>&#9;SIG_TYPE_REF_<br>&#9;VAL_TABLE_<br>&#9;SIG_GROUP_<br>&#9;SIG_VALTYPE_<br>&#9;SIGTYPE_VALTYPE_<br>&#9;BO_TX_BU_<br>&#9;BA_DEF_REL_<br>&#9;BA_REL_<br>&#9;BA_DEF_DEF_REL_<br>&#9;BU_SG_REL_<br>&#9;BU_EV_REL_<br>&#9;BU_BO_REL_<br>&#9;SG_MUL_VAL_<br><br><span style="color:#c678dd">BS_</span>: <span style="color:#d19a66">500000</span> : <span style="color:#d19a66">0</span> , <span style="color:#d19a66">0</span><br><br><span style="color:#c678dd">BU_</span>: CCS AC<br><br><span style="color:#c678dd">BO_</span> <span style="color:#d19a66">3221225472</span> VECTOR__INDEPENDENT_SIG_MSG: <span style="color:#d19a66">0</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> New_Signal_110 : <span style="color:#d19a66">0</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>- (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">0</span>] <span style="color:#98c379">""</span> Vector__XXX<br><br><span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2434937668</span> New_Group_Message_12: <span style="color:#d19a66">8</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg2_sig3 <span style="color:#e5c07b">m2</span> : <span style="color:#d19a66">16</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg2_sig2 <span style="color:#e5c07b">m2</span> : <span style="color:#d19a66">8</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg1_sig3 <span style="color:#e5c07b">m1</span> : <span style="color:#d19a66">16</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg1_sig2 <span style="color:#e5c07b">m1</span> : <span style="color:#d19a66">8</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg1_sig1 <span style="color:#e5c07b">M</span> : <span style="color:#d19a66">0</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br><br><span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1: <span style="color:#d19a66">8</span> CCS<br> <span style="color:#56b6c2">SG_</span> CCSToAC1_FactoryID : <span style="color:#d19a66">0</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> CCSToAC1_AirSw : <span style="color:#d19a66">8</span>|<span style="color:#d19a66">2</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">3</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> CCSToCabin1_ColdGearReq : <span style="color:#d19a66">10</span>|<span style="color:#d19a66">4</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">15</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> CCSToAC1_FanGearReq : <span style="color:#d19a66">14</span>|<span style="color:#d19a66">4</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">15</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> heart : <span style="color:#d19a66">56</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span>  AC<br><br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">BU_</span> CCS <span style="color:#98c379">"大屏"</span>;<br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">BU_</span> AC <span style="color:#98c379">"空调"</span>;<br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">3221225472</span> <span style="color:#98c379">"This is a message for not used signals, created by Vector CANdb++ DBC OLE DB Provider."</span>;<br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_AirSw <span style="color:#98c379">"空调开关。可以在这里填写信号的备注。"</span>;<br><br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">SG_</span>  <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">INT</span> <span style="color:#d19a66">0</span> <span style="color:#d19a66">65535</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">SG_</span>  <span style="color:#98c379">"GenSigSendType"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"Cyclic"</span>,<span style="color:#98c379">"OnWrite"</span>,<span style="color:#98c379">"OnWriteWithRepetition"</span>,<span style="color:#98c379">"OnChange"</span>,<span style="color:#98c379">"OnChangeWithRepetition"</span>,<span style="color:#98c379">"IfActive"</span>,<span style="color:#98c379">"IfActiveWithRepetition"</span>,<span style="color:#98c379">"NoSigSendType"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">SG_</span>  <span style="color:#98c379">"GenSigInactiveValue"</span> <span style="color:#c678dd">INT</span> <span style="color:#d19a66">-5</span> <span style="color:#d19a66">65535</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"GenMsgCycleTime"</span> <span style="color:#c678dd">INT</span> <span style="color:#d19a66">0</span> <span style="color:#d19a66">65535</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"GenMsgSendType"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"Cyclic"</span>,<span style="color:#98c379">"Event"</span>,<span style="color:#98c379">"IfActive"</span>,<span style="color:#98c379">"CE"</span>,<span style="color:#98c379">"CA"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"GwUsedMsg"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"No"</span>,<span style="color:#98c379">"Yes"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"DiagState"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"No"</span>,<span style="color:#98c379">"Yes"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"NmMessage"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"No"</span>,<span style="color:#98c379">"Yes"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BU_</span>  <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#c678dd">HEX</span> <span style="color:#d19a66">0</span> <span style="color:#d19a66">255</span>;<br><span style="color:#c678dd">BA_DEF_</span>  <span style="color:#98c379">"DBName"</span> <span style="color:#c678dd">STRING</span> ;<br><span style="color:#c678dd">BA_DEF_</span>  <span style="color:#98c379">"BusType"</span> <span style="color:#c678dd">STRING</span> ;<br><br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenSigSendType"</span> <span style="color:#98c379">"Cyclic"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenSigInactiveValue"</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenMsgCycleTime"</span> <span style="color:#d19a66">200</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenMsgSendType"</span> <span style="color:#98c379">"Cyclic"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GwUsedMsg"</span> <span style="color:#98c379">"No"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"DiagState"</span> <span style="color:#98c379">"No"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"NmMessage"</span> <span style="color:#98c379">"No"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"DBName"</span> <span style="color:#98c379">"诚"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"BusType"</span> <span style="color:#98c379">"CAN"</span>;<br><br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"DBName"</span> <span style="color:#98c379">"Example"</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#c678dd">BU_</span> CCS <span style="color:#d19a66">10</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#c678dd">BU_</span> AC <span style="color:#d19a66">11</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"NmMessage"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"DiagState"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GwUsedMsg"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenMsgCycleTime"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">500</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenMsgSendType"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">1</span>;<br><br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_AirSw <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> CCSToCabin1_ColdGearReq <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_FanGearReq <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> heart <span style="color:#d19a66">0</span>;<br><br><span style="color:#c678dd">VAL_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_AirSw <span style="color:#d19a66">0</span> <span style="color:#98c379">"预留"</span> <span style="color:#d19a66">1</span> <span style="color:#98c379">"关闭"</span> <span style="color:#d19a66">2</span> <span style="color:#98c379">"开启"</span> <span style="color:#d19a66">3</span> <span style="color:#98c379">"无效值未使用"</span> ;<br><span style="color:#c678dd">VAL_</span> <span style="color:#d19a66">2560107544</span> CCSToCabin1_ColdGearReq <span style="color:#d19a66">0</span> <span style="color:#98c379">"等级零"</span> <span style="color:#d19a66">1</span> <span style="color:#98c379">"等级一"</span> <span style="color:#d19a66">2</span> <span style="color:#98c379">"等级二"</span> <span style="color:#d19a66">3</span> <span style="color:#98c379">"等级三"</span> <span style="color:#d19a66">4</span> <span style="color:#98c379">"等级四"</span> ;<br><span style="color:#c678dd">VAL_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_FanGearReq <span style="color:#d19a66">0</span> <span style="color:#98c379">"等级零"</span> <span style="color:#d19a66">1</span> <span style="color:#98c379">"等级一"</span> <span style="color:#d19a66">2</span> <span style="color:#98c379">"等级二"</span> <span style="color:#d19a66">3</span> <span style="color:#98c379">"等级三"</span> <span style="color:#d19a66">4</span> <span style="color:#98c379">"等级四"</span> ;<br><br></pre>



</details>

### `VSCode`插件

安装`VSCode`，并安装`DBC Language Syntax`插件，即可在`VSCode`中语法高亮的显示DBC中的信号。并且还自带语法纠错功能，如果DBC语法出错了之后，还会以红色波浪线显示该错误。建议相关的技术人员都去安装该插件。

![image-20260712210325360](./assets/image-20260712210325360.png)

### DBC文件结构

按照vector官方的 《[DBC_File_Format_Documentation.pdf](https://github.com/shilic/shilic.github.io/blob/main/src/posts/%E6%B1%BD%E8%BD%A6%E7%94%B5%E5%AD%90/DBC/assets/DBC_File_Format_Documentation.pdf)》 文件所说，DBC文件的结构必须按照固定的顺序排列，我这里挑了一些重点进行介绍，如下所示，感兴趣的可以自己下载原文进行查看：

- version : 版本
- new_symbols : 新符号
- bit_timing (*obsolete but required*): 波特率(必须有，但可以不填)
- nodes: 所有节点
- messages: 报文及信号
- message_transmitters: 报文传输节点
- comments: 注释
- attribute_definitions: 自定义属性的定义
- attribute_defaults: 自定义属性的默认值
- attribute_values: 自定义属性的值
- value_descriptions: 值描述

下边我将依次讲解这些部分

### version : 版本



### new_symbols : 新符号



### bit_timing: 波特率



### nodes: 所有节点



### messages: 报文及信号



### message_transmitters: 报文传输节点



### comments: 注释



### attribute_definitions: 自定义属性的定义



### attribute_defaults: 自定义属性的默认值



### attribute_values: 自定义属性的值



### value_descriptions: 值描述



