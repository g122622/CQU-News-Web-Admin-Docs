# 工具库

## 概述
`src/utils/index.ts`包含了一系列用于处理本地存储、数据类型判断、生成唯一UUID、处理时间、浏览器语言、菜单处理等功能的函数。以下是每个函数的详细说明。

## 函数列表

### localGet
- 描述：获取localStorage中存储的值
- 参数：key - Storage名称
- 返回值：存储的值（String）

### localSet
- 描述：存储值到localStorage
- 参数：key - Storage名称，value - Storage值
- 返回值：无

### localRemove
- 描述：清除localStorage中指定的值
- 参数：key - Storage名称
- 返回值：无

### localClear
- 描述：清除所有localStorage中的值
- 参数：无
- 返回值：无

### isType
- 描述：判断数据类型
- 参数：val - 需要判断类型的数据
- 返回值：数据类型（String）

### generateUUID
- 描述：生成唯一的UUID
- 返回值：唯一的UUID（String）

### isObjectValueEqual
- 描述：判断两个对象是否相同
- 参数：a - 对象一，b - 对象二
- 返回值：是否相同（Boolean）

### randomNum
- 描述：生成指定范围内的随机数
- 参数：min - 最小值，max - 最大值
- 返回值：随机数（Number）

### getTimeState
- 描述：根据当前时间获取对应的问候语
- 返回值：问候语（String）

### getBrowserLang
- 描述：获取浏览器默认语言
- 返回值：默认语言（String）

### getFlatMenuList
- 描述：递归扁平化菜单列表
- 参数：menuList - 菜单列表
- 返回值：扁平化后的菜单列表（Array）

### getShowMenuList

- **描述**：递归过滤出需要渲染在左侧菜单的列表，剔除 isHide == true 的菜单
- **参数**：menuList - 菜单列表
- **返回值**：经过过滤后的菜单列表

### getAllBreadcrumbList

- **描述**：递归找出所有面包屑存储到 pinia/vuex 中
- **参数**：menuList - 菜单列表，parent - 父级菜单，result - 处理后的结果
- **返回值**：存储面包屑的对象

### getMenuListPath

- **描述**：递归处理路由菜单 path，生成一维数组
- **参数**：menuList - 所有菜单列表，menuPathArr - 菜单地址的一维数组
- **返回值**：菜单地址的一维数组

### findMenuByPath

- **描述**：递归查询当前 path 所对应的菜单对象
- **参数**：menuList - 菜单列表，path - 当前访问地址
- **返回值**：对应的菜单对象或 null

### getKeepAliveRouterName

- **描述**：递归过滤需要缓存的菜单 name
- **参数**：menuList - 所有菜单列表，keepAliveNameArr - 缓存的菜单 name
- **返回值**：缓存的菜单 name 数组

### formatTableColumn

- **描述**：格式化表格单元格默认值 (el-table-column)
- **参数**：row - 行，col - 列，callValue - 当前单元格值
- **返回值**：格式化后的字符串

### formatValue

- **描述**：处理值无数据情况
- **参数**：callValue - 需要处理的值
- **返回值**：处理后的字符串

### handleRowAccordingToProp

- **描述**：处理 prop 为多级嵌套的情况，返回的数据
- **参数**：row - 当前行数据，prop - 当前 prop
- **返回值**：处理后的数据

### handleProp

- **描述**：处理 prop，当 prop 为多级嵌套时返回最后一级 prop
- **参数**：prop - 当前 prop
- **返回值**：最后一级 prop

### filterEnum

- **描述**：根据枚举列表查询当需要的数据
- **参数**：callValue - 当前单元格值，enumData - 字典列表，fieldNames - label、value、children 的 key 值，type - 过滤类型
- **返回值**：处理后的字符串

### findItemNested

- **描述**：递归查找 callValue 对应的 enum 值
- **参数**：enumData - 枚举数据，callValue - 当前值，value - 值的键名，children - 子节点键名
- **返回值**：对应的枚举值或 null