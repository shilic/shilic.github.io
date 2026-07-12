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

DBC的文件格式参考了vector官方的 《[DBC_File_Format_Documentation.pdf](https://github.com/shilic/smart-dbc/blob/master/docs/DBC_File_Format_Documentation.pdf)》 文件， 里边非常清晰的讲解了每一个字段应该如何填写。

文件链接：[https://github.com/shilic/smart-dbc/blob/master/docs/DBC_File_Format_Documentation.pdf](https://github.com/shilic/smart-dbc/blob/master/docs/DBC_File_Format_Documentation.pdf) 点击即可下载查看

### DBC文件示例

<details open >
  <summary >点击查看DBC文件示例</summary>
<pre style="background:#282c34;color:#abb2bf;padding:1.2em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">VERSION</span> <span style="color:#98c379">"1.0.1"</span><br><br><span style="color:#c678dd">NS_</span> :<br>&#9;NS_DESC_<br>&#9;CM_<br>&#9;BA_DEF_<br>&#9;BA_<br>&#9;VAL_<br>&#9;CAT_DEF_<br>&#9;CAT_<br>&#9;FILTER<br>&#9;BA_DEF_DEF_<br>&#9;EV_DATA_<br>&#9;ENVVAR_DATA_<br>&#9;SGTYPE_<br>&#9;SGTYPE_VAL_<br>&#9;BA_DEF_SGTYPE_<br>&#9;BA_SGTYPE_<br>&#9;SIG_TYPE_REF_<br>&#9;VAL_TABLE_<br>&#9;SIG_GROUP_<br>&#9;SIG_VALTYPE_<br>&#9;SIGTYPE_VALTYPE_<br>&#9;BO_TX_BU_<br>&#9;BA_DEF_REL_<br>&#9;BA_REL_<br>&#9;BA_DEF_DEF_REL_<br>&#9;BU_SG_REL_<br>&#9;BU_EV_REL_<br>&#9;BU_BO_REL_<br>&#9;SG_MUL_VAL_<br><br><span style="color:#c678dd">BS_</span>: <span style="color:#d19a66">500000</span> : <span style="color:#d19a66">100</span> , <span style="color:#d19a66">200</span><br><br><span style="color:#c678dd">BU_</span>: CCS AC<br><br><span style="color:#c678dd">BO_</span> <span style="color:#d19a66">3221225472</span> VECTOR__INDEPENDENT_SIG_MSG: <span style="color:#d19a66">0</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> New_Signal_110 : <span style="color:#d19a66">0</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>- (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">0</span>] <span style="color:#98c379">""</span> Vector__XXX<br><br><span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2434937668</span> New_Group_Message_12: <span style="color:#d19a66">8</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg2_sig3 <span style="color:#e5c07b">m2</span> : <span style="color:#d19a66">16</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg2_sig2 <span style="color:#e5c07b">m2</span> : <span style="color:#d19a66">8</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg1_sig3 <span style="color:#e5c07b">m1</span> : <span style="color:#d19a66">16</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg1_sig2 <span style="color:#e5c07b">m1</span> : <span style="color:#d19a66">8</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg1_sig1 <span style="color:#e5c07b">M</span> : <span style="color:#d19a66">0</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br><br><span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1: <span style="color:#d19a66">8</span> CCS<br> <span style="color:#56b6c2">SG_</span> CCSToAC1_FactoryID : <span style="color:#d19a66">0</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> CCSToAC1_AirSw : <span style="color:#d19a66">8</span>|<span style="color:#d19a66">2</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">3</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> CCSToCabin1_ColdGearReq : <span style="color:#d19a66">10</span>|<span style="color:#d19a66">4</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">15</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> CCSToAC1_FanGearReq : <span style="color:#d19a66">14</span>|<span style="color:#d19a66">4</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">15</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> heart : <span style="color:#d19a66">56</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span>  AC<br><br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">BU_</span> CCS <span style="color:#98c379">"大屏"</span>;<br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">BU_</span> AC <span style="color:#98c379">"空调"</span>;<br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">3221225472</span> <span style="color:#98c379">"This is a message for not used signals, created by Vector CANdb++ DBC OLE DB Provider."</span>;<br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_AirSw <span style="color:#98c379">"空调开关。可以在这里填写信号的备注。"</span>;<br><br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">SG_</span>  <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">INT</span> <span style="color:#d19a66">0</span> <span style="color:#d19a66">65535</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">SG_</span>  <span style="color:#98c379">"GenSigSendType"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"Cyclic"</span>,<span style="color:#98c379">"OnWrite"</span>,<span style="color:#98c379">"OnWriteWithRepetition"</span>,<span style="color:#98c379">"OnChange"</span>,<span style="color:#98c379">"OnChangeWithRepetition"</span>,<span style="color:#98c379">"IfActive"</span>,<span style="color:#98c379">"IfActiveWithRepetition"</span>,<span style="color:#98c379">"NoSigSendType"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">SG_</span>  <span style="color:#98c379">"GenSigInactiveValue"</span> <span style="color:#c678dd">INT</span> <span style="color:#d19a66">-5</span> <span style="color:#d19a66">65535</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"GenMsgCycleTime"</span> <span style="color:#c678dd">INT</span> <span style="color:#d19a66">0</span> <span style="color:#d19a66">65535</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"GenMsgSendType"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"Cyclic"</span>,<span style="color:#98c379">"Event"</span>,<span style="color:#98c379">"IfActive"</span>,<span style="color:#98c379">"CE"</span>,<span style="color:#98c379">"CA"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"GwUsedMsg"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"No"</span>,<span style="color:#98c379">"Yes"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"DiagState"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"No"</span>,<span style="color:#98c379">"Yes"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"NmMessage"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"No"</span>,<span style="color:#98c379">"Yes"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BU_</span>  <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#c678dd">HEX</span> <span style="color:#d19a66">0</span> <span style="color:#d19a66">255</span>;<br><span style="color:#c678dd">BA_DEF_</span>  <span style="color:#98c379">"DBName"</span> <span style="color:#c678dd">STRING</span> ;<br><span style="color:#c678dd">BA_DEF_</span>  <span style="color:#98c379">"BusType"</span> <span style="color:#c678dd">STRING</span> ;<br><br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenSigSendType"</span> <span style="color:#98c379">"Cyclic"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenSigInactiveValue"</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenMsgCycleTime"</span> <span style="color:#d19a66">200</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenMsgSendType"</span> <span style="color:#98c379">"Cyclic"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GwUsedMsg"</span> <span style="color:#98c379">"No"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"DiagState"</span> <span style="color:#98c379">"No"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"NmMessage"</span> <span style="color:#98c379">"No"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"DBName"</span> <span style="color:#98c379">"诚"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"BusType"</span> <span style="color:#98c379">"CAN"</span>;<br><br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"DBName"</span> <span style="color:#98c379">"Example"</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#c678dd">BU_</span> CCS <span style="color:#d19a66">10</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#c678dd">BU_</span> AC <span style="color:#d19a66">11</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"NmMessage"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"DiagState"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GwUsedMsg"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenMsgCycleTime"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">500</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenMsgSendType"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">1</span>;<br><br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_AirSw <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> CCSToCabin1_ColdGearReq <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_FanGearReq <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> heart <span style="color:#d19a66">0</span>;<br><br><span style="color:#c678dd">VAL_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_AirSw <span style="color:#d19a66">0</span> <span style="color:#98c379">"预留"</span> <span style="color:#d19a66">1</span> <span style="color:#98c379">"关闭"</span> <span style="color:#d19a66">2</span> <span style="color:#98c379">"开启"</span> <span style="color:#d19a66">3</span> <span style="color:#98c379">"无效值未使用"</span> ;<br><span style="color:#c678dd">VAL_</span> <span style="color:#d19a66">2560107544</span> CCSToCabin1_ColdGearReq <span style="color:#d19a66">0</span> <span style="color:#98c379">"等级零"</span> <span style="color:#d19a66">1</span> <span style="color:#98c379">"等级一"</span> <span style="color:#d19a66">2</span> <span style="color:#98c379">"等级二"</span> <span style="color:#d19a66">3</span> <span style="color:#98c379">"等级三"</span> <span style="color:#d19a66">4</span> <span style="color:#98c379">"等级四"</span> ;<br><span style="color:#c678dd">VAL_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_FanGearReq <span style="color:#d19a66">0</span> <span style="color:#98c379">"等级零"</span> <span style="color:#d19a66">1</span> <span style="color:#98c379">"等级一"</span> <span style="color:#d19a66">2</span> <span style="color:#98c379">"等级二"</span> <span style="color:#d19a66">3</span> <span style="color:#98c379">"等级三"</span> <span style="color:#d19a66">4</span> <span style="color:#98c379">"等级四"</span> ;<br><br></pre>




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

DBC 文件的第一行，格式固定：

```
VERSION "version_string"
```

版本号是一个字符串，内容可以为空（`""`），也可以由用户自定义。多数情况下，这个字段不被严格校验，工具链不会因为版本号不同而拒绝解析。

在我们的示例 DBC 中：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">VERSION</span> <span style="color:#98c379">"1.0.1"</span></pre>

### new_symbols : 新符号

紧跟在 `VERSION` 之后，格式如下：

```
NS_ : 
	NS_DESC_
	CM_
	BA_DEF_
	...
```

`NS_` 全称 `New Symbols`，用于声明本 DBC 文件中会使用哪些扩展关键字。创建 `DBC` 文件时由工具自动生成，**一般保持默认即可**，不需要手动增删。它的作用是告诉解析器"以下这些标签是合法的，如果遇到了不要报错"——类比编程中的 `import` 声明，保障了不同版本 `DBC` 之间的兼容性。

示例中节选：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">NS_</span> :<br>&#9;NS_DESC_<br>&#9;CM_<br>&#9;BA_DEF_<br>&#9;BA_<br>&#9;VAL_<br>&#9;BA_DEF_DEF_<br>&#9;VAL_TABLE_<br>&#9;SIG_GROUP_<br>&#9;BO_TX_BU_<br>&#9;SG_MUL_VAL_</pre>

> **Tip**：`NS_` 列表末尾不要加分号，每个条目占一行，以 Tab 缩进。分号是 DBC 中其他语句的终止符，但 `NS_` 块不在此列。

### bit_timing: 波特率

格式：

```
BS_: [baudrate:BTR1,BTR2]
```

`BS_` 用于定义 CAN 网络的波特率。方括号内的部分是**可选**的，不写也可以。但这个关键字**本身必须存在**——`BS_:` 不能删，Vector 规范明确要求保留。

波特率字段已经**过时（obsolete）**——现代 CAN 控制器的波特率通常在硬件配置或代码中设置，不依赖 DBC 文件。所以实际项目中你通常会看到它空在那里，你也可以按照下边的格式填写：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">BS_</span>: <span style="color:#d19a66">500000</span> : <span style="color:#d19a66">100</span> , <span style="color:#d19a66">200</span></pre>

多数文件直接写 `BS_:` 后不跟任何值。

### nodes: 网络节点

格式：

```
BU_: node_name_1 node_name_2 node_name_3 ...
```

`BU_` 关键字列出 CAN 网络上所有参与通信的节点。节点名由用户自定义，以空格分隔，默认不限制顺序，但**必须保证唯一性**——两个节点不能叫同一个名字。

示例 DBC 中有两个节点：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">BU_</span>: CCS AC</pre>

`CCS` 是中控大屏，`AC` 是空调控制器。后续定义报文和信号时，发送者和接收者都只能从这两个名字中选——`BU_` 是节点名称的"注册表"。

> **命名规范**：节点名必须以字母或下划线开头，可包含字母、数字、下划线，长度上限 128 字符（兼容旧工具建议 32 字符内）。

### messages: 报文及信号

这是 DBC 文件里最核心的部分，每一帧报文（`BO_`）后面紧跟着它包含的信号（`SG_`）。两者放在一起讲，因为它们在文件中就是绑在一起的。

#### 报文帧定义：`BO_`

格式：

```
BO_ message_id message_name: message_size transmitter
```

逐字段解释：

| 字段 | 说明 |
|---|---|
| `BO_` | 关键字，声明一条报文 |
| `message_id` | 报文 ID，**十进制**表示。标准帧范围 0–`0x7FF`，扩展帧为 `0x80000000 + 十六进制CAN_ID` 的十进制值。同时，DBC通过该值来判断是扩展帧还是标准帧，大于`0x80000000`的ID就视为扩展帧。 |
| `message_name` | 报文名称，遵循 C 语言变量命名规则，在同一 DBC 中必须唯一 |
| `message_size` | 数据域长度（DLC），以字节为单位。CAN 2.0 最大 8 字节，CAN FD 最大 64 字节 |
| `transmitter` | 发送节点名。如果报文没有指定发送者，必须填 `Vector__XXX` |

示例：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1: <span style="color:#d19a66">8</span> CCS</pre>

> 这条报文 ID 为 `2560107544`（十进制）= `0x98989898`（十六进制），大于`0x80000000`所以是扩展帧，真实ID是`0x18989898`；名为 `CCSToAC1`，8 字节长度，由 `CCS`（中控屏）发出。

#### 信号定义：`SG_`

格式：

```
SG_ signal_name multiplexer : start_bit|signal_size@byte_order value_type (factor,offset) [min|max] "unit" receiver
```

这是 DBC 里最复杂的一行，逐个拆解：

| 字段 | 说明 |
|---|---|
| `SG_` | 关键字，声明一个信号 |
| `signal_name` | 信号名称，在同一报文内必须唯一；遵循 C 语言变量命名规则 |
| `multiplexer` | 复用标志。**空格** = 普通信号；**`M`** = 多路选择器信号（一个报文最多一个）；**`mN`** = 被选择的信号（N 为选择值） |
| `start_bit` | 信号起始位。Intel 格式下是 LSB 的位置，Motorola 格式下是 MSB 的位置。特别注意：如果是 Motorola 格式，在DCBC文件中保存的是 MSB 的位置，但是在 `CANdb++`中，保存的则是 LSB 的位置。 |
| `signal_size` | 信号长度，单位 bit |
| `@byte_order` | 字节序。**`0`** = Motorola（大端），**`1`** = Intel（小端） |
| `value_type` | 符号类型。**`+`** = 无符号数，**`-`** = 有符号数 |
| `(factor,offset)` | 线性转换参数。**物理值 = 原始值 × factor + offset** |
| `[min|max]` | 物理值范围，double 类型 |
| `"unit"` | 物理单位字符串，无单位填 `""` |
| `receiver` | 接收节点名。多个接收者以逗号分隔。无指定接收者填 `Vector__XXX` |

##### 示例——三个典型信号：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1: <span style="color:#d19a66">8</span> CCS<br> <span style="color:#56b6c2">SG_</span> CCSToAC1_AirSw : <span style="color:#d19a66">8</span>|<span style="color:#d19a66">2</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">3</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> CCSToCabin1_ColdGearReq : <span style="color:#d19a66">10</span>|<span style="color:#d19a66">4</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">15</span>] <span style="color:#98c379">""</span>  AC<br> <span style="color:#56b6c2">SG_</span> heart : <span style="color:#d19a66">56</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span>  AC</pre>

逐行解读：

- **`CCSToAC1_AirSw`**：空调开关信号。起始位 8，长度 2 bit，Intel 格式，无符号，factor=1 offset=0，范围 [0,3]，无物理单位，接收方为 `AC`
- **`CCSToCabin1_ColdGearReq`**：制冷等级请求。起始位 10，长度 4 bit，范围 [0,15]
- **`heart`**：心跳信号。起始位 56，长度 8 bit（占满最后一个字节）

##### 关于字节序：Motorola 与 Intel

DBC 里的 `@0`（Motorola / 大端）和 `@1`（Intel / 小端）决定了一个跨字节信号在 CAN 报文数据域中的字节排列方式：

- **Motorola（大端）**：高字节存低位地址，符合人类书写习惯。例如 `0x1234` 在内存中为  `{ 0x34, 0x12 }`。汽车行业中更为常见（网络协议传统）。
- **Intel（小端）**：低字节存低位地址。例如 `0x1234` 在内存中为 `{ 0x12, 0x34 }`。多数现代 PC 架构（x86）采用此格式。

> 关键记忆点：`start_bit` 的含义在两种格式下不同——Intel 格式下是信号 LSB 的位置，Motorola 格式下是信号 MSB 的位置。同一个信号用不同格式，`start_bit` 的值可能完全不同。

##### 多路复用信号（Multiplexor）

当一条报文在不同工况下承载不同的信号布局时，使用多路复用机制。一个报文最多有一个**多路选择器信号**（标记 `M`），其余信号通过 `mN` 标记来声明"当多路选择器的值 == N 时，我启用"。

示例：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2434937668</span> New_Group_Message_12: <span style="color:#d19a66">8</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg2_sig3 <span style="color:#e5c07b">m2</span> : <span style="color:#d19a66">16</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg1_sig1 <span style="color:#e5c07b">M</span> : <span style="color:#d19a66">0</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX<br> <span style="color:#56b6c2">SG_</span> msg1_sig2 <span style="color:#e5c07b">m1</span> : <span style="color:#d19a66">8</span>|<span style="color:#d19a66">8</span>@<span style="color:#d19a66">1</span>+ (<span style="color:#d19a66">1</span>,<span style="color:#d19a66">0</span>) [<span style="color:#d19a66">0</span>|<span style="color:#d19a66">255</span>] <span style="color:#98c379">""</span> Vector__XXX</pre>

这里 `msg1_sig1`（`M`）是多路选择器。当 `msg1_sig1 == 1` 时，`msg1_sig2`（`m1`）所在的数据位置才生效；当 `msg1_sig1 == 2` 时，`msg2_sig3`（`m2`）生效。

### message_transmitters: 报文传输节点

格式：

```
BO_TX_BU_ message_id : transmitter1 transmitter2 ... ;
```

这个标签用于指定一条报文可以由哪些节点发送。当一条报文有多个可能的发送者（例如不同配置的同一车型）时，用 `BO_TX_BU_` 列出所有候选。**实际项目中不常用**——大多数 DBC 直接在 `BO_` 行尾部指定发送者就够了。

如果 `NS_` 列表中声明了 `BO_TX_BU_` 但文件里没有用到，不会报错。

### comments: 注释

格式：

```
CM_ object_type object_id "comment_text" ;
```

`CM_` 可以为节点（`BU_`）、报文（`BO_`）、信号（`SG_`）附加文本注释。注释内容以英文双引号包围，内部不允许再出现双引号。

示例：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">BU_</span> CCS <span style="color:#98c379">"大屏"</span>;<br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">BU_</span> AC <span style="color:#98c379">"空调"</span>;<br><span style="color:#c678dd">CM_</span> <span style="color:#c678dd">SG_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_AirSw <span style="color:#98c379">"空调开关。可以在这里填写信号的备注。"</span>;</pre>

> 注释以分号结尾。对信号的注释需要同时指定报文 ID 和信号名——因为不同报文里可能存在同名信号，单靠信号名无法定位。

### attribute_definitions: 自定义属性的定义

DBC 有一套内置字段（ID、DLC、起始位……），但现实中的项目往往需要额外的元数据——比如"这个报文是周期性还是事件型？""这个信号的初始值是多少？"这些通过**自定义属性**来实现。

自定义属性分三部分协同工作：**定义类型（`BA_DEF_`）→ 设默认值（`BA_DEF_DEF_`）→ 设具体值（`BA_`）**。先看类型定义。

格式：

```
BA_DEF_ object_type "attribute_name" value_type [min max] ;
```

| 参数 | 说明 |
|---|---|
| `object_type` | 属性作用于：`BU_`（节点）、`BO_`（报文）、`SG_`（信号）或空格（全局/项目级） |
| `"attribute_name"` | 属性名称，C 语言变量格式 |
| `value_type` | 值类型。`INT`、`HEX`、`FLOAT`、`STRING`、`ENUM` 五选一 |
| `min max` | 对 INT/HEX/FLOAT 是范围；对 ENUM 是枚举值列表（双引号+逗号分隔）；对 STRING 为空 |

示例：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">SG_</span>  <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#c678dd">INT</span> <span style="color:#d19a66">0</span> <span style="color:#d19a66">65535</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BO_</span>  <span style="color:#98c379">"GenMsgSendType"</span> <span style="color:#c678dd">ENUM</span>  <span style="color:#98c379">"Cyclic"</span>,<span style="color:#98c379">"Event"</span>,<span style="color:#98c379">"IfActive"</span>,<span style="color:#98c379">"CE"</span>,<span style="color:#98c379">"CA"</span>;<br><span style="color:#c678dd">BA_DEF_</span> <span style="color:#c678dd">BU_</span>  <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#c678dd">HEX</span> <span style="color:#d19a66">0</span> <span style="color:#d19a66">255</span>;<br><span style="color:#c678dd">BA_DEF_</span>  <span style="color:#98c379">"BusType"</span> <span style="color:#c678dd">STRING</span> ;</pre>

解读：

- 第 1 行：定义了作用于信号的属性 `GenSigStartValue`，整型，范围 0–65535
- 第 2 行：定义了作用于报文的属性 `GenMsgSendType`，枚举型，可选值为 Cyclic/Event/IfActive/CE/CA
- 第 3 行：定义了作用于节点的属性 `NmStationAddress`，十六进制，范围 0–255
- 第 4 行：定义了全局属性 `BusType`，字符串类型（`object_type` 为空格）

### attribute_defaults: 自定义属性的默认值

格式：

```
BA_DEF_DEF_ "attribute_name" default_value ;
```

为 `BA_DEF_` 定义的每个属性设定一个默认值。当某个对象没有通过 `BA_` 显式设置值时，就使用这里的默认值。

示例：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenSigStartValue"</span> <span style="color:#d19a66">0</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenMsgSendType"</span> <span style="color:#98c379">"Cyclic"</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"GenMsgCycleTime"</span> <span style="color:#d19a66">200</span>;<br><span style="color:#c678dd">BA_DEF_DEF_</span>  <span style="color:#98c379">"BusType"</span> <span style="color:#98c379">"CAN"</span>;</pre>

> `BA_DEF_DEF_` 不指定对象类型——同一个属性名在整个 DBC 文件中只有一个默认值，所有类型的对象共享。

### attribute_values: 自定义属性的值

格式：

```
BA_ "attribute_name" object_type object_id attribute_value ;
```

针对某个具体对象（节点 / 报文 / 信号）设置属性值。`object_id` 根据对象类型不同——报文和信号用十进制报文 ID 定位，节点用节点名定位。

示例：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenMsgCycleTime"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">500</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"GenMsgSendType"</span> <span style="color:#c678dd">BO_</span> <span style="color:#d19a66">2560107544</span> <span style="color:#d19a66">1</span>;<br><span style="color:#c678dd">BA_</span> <span style="color:#98c379">"NmStationAddress"</span> <span style="color:#c678dd">BU_</span> CCS <span style="color:#d19a66">10</span>;</pre>

解读：

- 第 1 行：报文 `2560107544` 的 `GenMsgCycleTime` 设为 500（ms），覆盖了默认值 200
- 第 2 行：同一个报文的 `GenMsgSendType` 设为 1（对应枚举中的第二个值，一般工具中 "0=Cyclic, 1=Event"）
- 第 3 行：节点 `CCS` 的 `NmStationAddress` 设为 0x0A

> 三层递进关系总结：`BA_DEF_` 说"有这样一种属性，它长什么样"；`BA_DEF_DEF_` 说"如果没人特别说明，它的默认值是这个"；`BA_` 说"对于这个具体对象，它的值是这个"。

### value_descriptions: 值描述（数值表）

格式：

```
VAL_ message_id signal_name value1 "description1" value2 "description2" ... ;
```

信号的物理值除了用 factor+offset 公式换算，还可以用数值表做**枚举映射**：将原始值直接对应到有意义的文本描述。这对状态量（开关、模式、故障码等）尤其有用——读到一个 `2`，你直接知道是"开启"，而不是去回忆"1 是啥来着？"

> 只有无符号整型信号才能使用数值表。

示例：

<pre style="background:#282c34;color:#abb2bf;padding:1em 1.5em;border-radius:6px;overflow-x:auto;font-size:0.9em;line-height:1.7;font-family:'JetBrains Mono','Fira Code','Cascadia Code',Consolas,monospace;"><span style="color:#c678dd">VAL_</span> <span style="color:#d19a66">2560107544</span> CCSToAC1_AirSw <span style="color:#d19a66">0</span> <span style="color:#98c379">"预留"</span> <span style="color:#d19a66">1</span> <span style="color:#98c379">"关闭"</span> <span style="color:#d19a66">2</span> <span style="color:#98c379">"开启"</span> <span style="color:#d19a66">3</span> <span style="color:#98c379">"无效值未使用"</span> ;<br><span style="color:#c678dd">VAL_</span> <span style="color:#d19a66">2560107544</span> CCSToCabin1_ColdGearReq <span style="color:#d19a66">0</span> <span style="color:#98c379">"等级零"</span> <span style="color:#d19a66">1</span> <span style="color:#98c379">"等级一"</span> <span style="color:#d19a66">2</span> <span style="color:#98c379">"等级二"</span> <span style="color:#d19a66">3</span> <span style="color:#98c379">"等级三"</span> <span style="color:#d19a66">4</span> <span style="color:#98c379">"等级四"</span> ;</pre>

- 第 1 行：空调开关 `CCSToAC1_AirSw`，0=预留，1=关闭，2=开启，3=无效
- 第 2 行：制冷等级 `CCSToCabin1_ColdGearReq`，0 到 4 对应五个制冷档位

`VAL_` 需要指定报文 ID 和信号名——和注释一样，不同报文里可能存在同名信号，必须靠报文 ID 来区分。