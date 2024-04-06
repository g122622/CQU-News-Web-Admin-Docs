## ProTable

:::tip 文档链接 📚
https://juejin.cn/post/7166068828202336263#heading-14
:::



## 前言 📖

> ProTable 组件目前已是 `2.0版本`🌈，在 [1.0版本](https://juejin.cn/post/7094890833064755208) 中大家提出的问题与功能优化，目前已经得到优化和解决。

> 😀 欢迎大家在使用过程中发现任何问题或更好的想法，都可以在下方评论区留言，或者我的开源项目 issues 中提出。如果你觉得还不错，请帮我点个小小的 **Star** 🧡

## 一、在线预览 👀

### Link：[admin.spicyboy.cn](https://link.juejin.cn?target=https%3A%2F%2Fadmin.spicyboy.cn)

## 二、Git 仓库地址 (欢迎 Star⭐⭐⭐)

### Gitee：[gitee.com/HalseySpicy…](https://link.juejin.cn?target=https%3A%2F%2Fgitee.com%2FHalseySpicy%2FGeeker-Admin)

### GitHub：[github.com/HalseySpicy…](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FHalseySpicy%2FGeeker-Admin)

## 三、ProTable 功能 🚀🚀🚀

> **ProTable** 组件目前使用属性透传进行重构，支持 **el-table && el-table-column** 所有属性、事件、方法的调用，不会有任何心智负担。

- 表格内容自适应屏幕宽高，溢出内容表格内部滚动（flex 布局）
- 表格搜索、重置、分页查询 Hooks 封装 （页面使用不会存在任何搜索、重置、分页查询逻辑）
- 表格数据操作 Hooks 封装 （单条数据删除、批量删除、重置密码、状态切换等操作）
- 表格数据多选 Hooks 封装 （支持现跨页勾选数据）
- 表格数据导入组件、导出 Hooks 封装
- 表格搜索区域使用 Grid 布局重构，支持自定义响应式配置
- 表格分页组件封装（Pagination）支持静态数据分页
- 表格数据刷新、列显隐、搜索区域显隐设置
- 表格配置 columns 支持动态更新（1.2.0 版本可用）
- 表格支持行拖拽排序、单选框设置（1.2.0 版本可用）
- 表格配置支持多级 prop（示例 ==> prop: user.detail.name）
- 单元格内容格式化、tag 标签显示（有字典 enum 会根据字典 enum 自动格式化）
- 支持多级表头、表头内容自定义渲染（支持作用域插槽、tsx 语法、h 函数）
- 支持单元格内容自定义渲染（支持作用域插槽、tsx 语法、h 函数）
- 配合 TreeFilter、SelectFilter 组件使用更佳（项目中有使用示例）

## 四、ProTable 功能需求分析 📑

### 首先我们来看效果图（总共可以分为五个模块）：

![image.png](https://img2.imgtp.com/2024/04/06/AZrmWwQG.webp)

- 1、表格搜索区域
- 2、表格数据操作按钮区域
- 3、表格功能按钮区域
- 4、表格主体内容展示区域
- 5、表格分页区域

### 1、表格搜索区域需求分析：

> 可以看到搜索区域的字段都是存在于表格当中的，并且每个页面的搜索、重置方法都是一样的逻辑，只是不同的查询参数而已。我们完全可以在传表格配置项 **columns** 时，直接指定某个 **column** 的 **search** 配置，就能把该项变为搜索项，然后使用 **el** 字段可以指定搜索框的类型，最后把表格的搜索方法都封装成 **Hooks** 钩子函数。页面上完全就不会存在任何搜索、重置逻辑了。

> 在 **1.0** 版本中使用 **v-if** 判断太麻烦，为了更方便用户传递参数，搜索组件在 **2.0** 版本中通过 **component :is** 动态组件 && **v-bind** 属性透传实现，将用户传递的参数全部透传到组件上，所以大家可以直接根据 **element** 官方文档在 **props** 中传递参数了。以下代码还结合了自己逻辑上的一些处理：

```html
<template>
  <component
    :is="column.search?.render ?? `el-${column.search?.el}`"
    v-bind="{ ...handleSearchProps, ...placeholder, searchParam: _searchParam, clearable }"
    v-model.trim="_searchParam[column.search?.key ?? handleProp(column.prop!)]"
    :data="column.search?.el === 'tree-select' ? columnEnum : []"
    :options="['cascader', 'select-v2'].includes(column.search?.el!) ? columnEnum : []"
  >
    <template v-if="column.search?.el === 'cascader'" #default="{ data }">
      <span>{{ data[fieldNames.label] }}</span>
    </template>
    <template v-if="column.search?.el === 'select'">
      <component
        :is="`el-option`"
        v-for="(col, index) in columnEnum"
        :key="index"
        :label="col[fieldNames.label]"
        :value="col[fieldNames.value]"
      ></component>
    </template>
    <slot v-else></slot>
  </component>
</template>

<script setup lang="ts" name="SearchFormItem">
import { computed, inject, ref } from "vue";
import { handleProp } from "@/utils";
import { ColumnProps } from "@/components/ProTable/interface";

interface SearchFormItem {
  column: ColumnProps;
  searchParam: { [key: string]: any };
}
const props = defineProps<SearchFormItem>();

// Re receive SearchParam
const _searchParam = computed(() => props.searchParam);

// 判断 fieldNames 设置 label && value && children 的 key 值
const fieldNames = computed(() => {
  return {
    label: props.column.fieldNames?.label ?? "label",
    value: props.column.fieldNames?.value ?? "value",
    children: props.column.fieldNames?.children ?? "children"
  };
});

// 接收 enumMap (el 为 select-v2 需单独处理 enumData)
const enumMap = inject("enumMap", ref(new Map()));
const columnEnum = computed(() => {
  let enumData = enumMap.value.get(props.column.prop);
  if (!enumData) return [];
  if (props.column.search?.el === "select-v2" && props.column.fieldNames) {
    enumData = enumData.map((item: { [key: string]: any }) => {
      return { ...item, label: item[fieldNames.value.label], value: item[fieldNames.value.value] };
    });
  }
  return enumData;
});

// 处理透传的 searchProps (el 为 tree-select、cascader 的时候需要给下默认 label && value && children)
const handleSearchProps = computed(() => {
  const label = fieldNames.value.label;
  const value = fieldNames.value.value;
  const children = fieldNames.value.children;
  const searchEl = props.column.search?.el;
  let searchProps = props.column.search?.props ?? {};
  if (searchEl === "tree-select") {
    searchProps = { ...searchProps, props: { ...searchProps.props, label, children }, nodeKey: value };
  }
  if (searchEl === "cascader") {
    searchProps = { ...searchProps, props: { ...searchProps.props, label, value, children } };
  }
  return searchProps;
});

// 处理默认 placeholder
const placeholder = computed(() => {
  const search = props.column.search;
  if (["datetimerange", "daterange", "monthrange"].includes(search?.props?.type) || search?.props?.isRange) {
    return {
      rangeSeparator: search?.props?.rangeSeparator ?? "至",
      startPlaceholder: search?.props?.startPlaceholder ?? "开始时间",
      endPlaceholder: search?.props?.endPlaceholder ?? "结束时间"
    };
  }
  const placeholder = search?.props?.placeholder ?? (search?.el?.includes("input") ? "请输入" : "请选择");
  return { placeholder };
});

// 是否有清除按钮 (当搜索项有默认值时，清除按钮不显示)
const clearable = computed(() => {
  const search = props.column.search;
  return search?.props?.clearable ?? (search?.defaultValue == null || search?.defaultValue == undefined);
});
</script>
```

> **表格搜索项可使用 tsx 组件自定义渲染**

```html
<script setup lang="tsx">
const columns = reactive<ColumnProps<User.ResUserList>[]>([
   {
    prop: "user.detail.age",
    label: "年龄",
    search: {
      // 自定义 search 组件
      render: ({ searchParam }) => {
        return (
          <div class="flx-center">
            <el-input vModel_trim={searchParam.minAge} placeholder="最小年龄" style={{ width: "50%" }} />
            <span class="mr10 ml10">-</span>
            <el-input vModel_trim={searchParam.maxAge} placeholder="最大年龄" style={{ width: "50%" }} />
          </div>
        );
      }
    }
  },
];
</script>
```

> 表格搜索组件在 **2.0** 版本中还支持了响应式配置，使用 **Grid** 方法进行整体重构 😋。

![动画.gif](E:\暂存\新建文件夹 (56)\c415a959108e4af3be10d90a5b85b92ctplv-k3u1fbpfcp-jj-mark3024000q75.webp)

### 2、表格数据操作按钮区域需求分析：

> 表格数据操作按钮基本上每个页面都会不一样，所以我们直接使用 **作用域插槽** 来完成每个页面的数据操作按钮区域，**作用域插槽** 可以将表格多选数据信息从 **ProTable** 的 **Hooks** 多选钩子函数中传到页面上使用。

> **scope** 数据中包含：**selectedList（当前选择的数据）、selectedListIds（当前选择的数据id）、isSelected（当前是否选中的数据）**

```html
<!-- ProTable 中 tableHeader 插槽 -->
<slot name="tableHeader" :selected-list="selectedList" :selected-list-ids="selectedListIds" :is-selected="isSelected" />

<!-- 页面使用 -->
<template #tableHeader="scope">
    <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
    <el-button type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
    <el-button type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
    <el-button type="danger" :icon="Delete" plain @click="batchDelete(scope.selectedListIds)" :disabled="!scope.isSelected">批量删除用户</el-button>
</template>
```

### 3、表格功能按钮区域分析：

> 这块区域没什么特殊功能，只有四个按钮，其功能分别为：**表格数据刷新（一直会携带当前查询和分页条件）、表格列设置（列显隐、列排序）、表格搜索区域显隐（方便展示更多的数据信息）**。 可通过 **toolButton** 属性控制这块区域的显隐。

### 4、表格主体内容展示区域分析：

> 🍉 该区域是最重要的数据展示区域，对于使用最多的功能就是表头和单元格内容可以自定义渲染，在第 **1.0** 版本中，自定义表头只支持传入`renderHeader`方法，自定义单元格内容只支持`slot`插槽。

> 💥 目前 **2.0** 版本中，表头支持`headerRender`方法（避免与 **el-table-column** 上的属性重名导致报错）、作用域插槽（`column.prop + 'Header'`）两种方式自定义，单元格内容支持`render`方法和作用域插槽（`column 上的 prop 属性`）两种方式自定义。

- 使用作用域插槽：

```html
<!-- 使用作用域插槽自定义单元格内容 username -->
<template #username="scope">
    {{ scope.row.username }}
</template>

<!-- 使用作用域插槽自定义表头内容 username -->
<template #usernameHeader="scope">
    <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
        {{ scope.column.label }}
    </el-button>
</template>
```

- 使用 tsx 语法：

```html
<script setup lang="tsx">
const columns = reactive<ColumnProps<User.ResUserList>[]>([
 {
    prop: "username",
    label: "用户姓名",
    // 使用 headerRender 自定义表头
    headerRender: scope => {
      return (
        <el-button
          type="primary"
          onClick={() => {
            ElMessage.success("我是通过 tsx 语法渲染的表头");
          }}
        >
          {scope.column.label}
        </el-button>
      );
    }
  },
  {
    prop: "status",
    label: "用户状态",
    // 使用 render 自定义表格内容
    render: scope => {
      return (
          <el-switch
            model-value={scope.row.status}
            active-text={scope.row.status ? "启用" : "禁用"}
            active-value={1}
            inactive-value={0}
            onClick={() => changeStatus(scope.row)}
          />
        ) 
      );
    }
  },
];
</script>
```

> 💢💢💢 **最强大的功能：如果你想使用 `el-table` 的任何属性、事件，目前通过属性透传都能支持。**
>
> **如果你还不了解属性透传，请阅读 vue 官方文档：[cn.vuejs.org/guide/compo…](https://link.juejin.cn?target=https%3A%2F%2Fcn.vuejs.org%2Fguide%2Fcomponents%2Fattrs.html)**

- **ProTable 组件上的绑定的所有属性和事件都会通过 `v-bind="$attrs"` 透传到 el-table 上。**
- **ProTable 组件内部暴露了 el-table DOM，可通过 `proTable.value.element.方法名` 调用其方法。**

```html
<template>
    <el-table
      ref="tableRef"
      v-bind="$attrs" 
    >
    </el-table>
</template>

<script setup lang="ts" name="ProTable">
import { ref } from "vue";
import { ElTable } from "element-plus";

const tableRef = ref<InstanceType<typeof ElTable>>();

defineExpose({ element: tableRef });
</script>
```

### 5、表格分页区域分析：

> 分页区域也没有什么特殊的功能，该支持的都支持了🤣（页面上使用 ProTable 组件完全不存在分页逻辑）

```html
<template>
  <!-- 分页组件 -->
  <el-pagination
    :background="true"
    :current-page="pageable.pageNum"
    :page-size="pageable.pageSize"
    :page-sizes="[10, 25, 50, 100]"
    :total="pageable.total"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>

<script setup lang="ts" name="Pagination">
interface Pageable {
  pageNum: number;
  pageSize: number;
  total: number;
}

interface PaginationProps {
  pageable: Pageable;
  handleSizeChange: (size: number) => void;
  handleCurrentChange: (currentPage: number) => void;
}

defineProps<PaginationProps>();
</script>
```

## 五、ProTable 文档 📚

### 1、ProTable 属性（ProTableProps）：

> 使用 `v-bind="$attrs"` 通过属性透传将 **ProTable** 组件属性全部透传到 **el-table** 上，所以我们支持 **el-table** 的所有 **Props** 属性。在此基础上，还扩展了以下 **Props：**
>
> [el-table 属性文档链接](https://link.juejin.cn?target=https%3A%2F%2Felement-plus.org%2Fzh-CN%2Fcomponent%2Ftable.html%23table-%E5%B1%9E%E6%80%A7)

| 属性名       | 类型             | 是否必传 | 默认值                                | 属性描述                                                     |
| ------------ | ---------------- | -------- | ------------------------------------- | ------------------------------------------------------------ |
| columns      | ColumnProps      | ✅        | []                                    | ProTable 组件会根据此字段渲染搜索表单与表格列（支持动态更新），详情见 ColumnProps |
| data         | Array            | ❌        | —                                     | 静态 tableData 数据（支持分页），若存在则不会使用 requestApi 返回的 data |
| requestApi   | Function         | ❌        | —                                     | 获取表格数据的请求 API                                       |
| requestAuto  | Boolean          | ❌        | true                                  | 表格初始化时是否自动执行请求 API                             |
| requestError | Function         | ❌        | —                                     | 表格 API 请求错误监听                                        |
| dataCallback | Function         | ❌        | —                                     | 后台返回数据的回调函数，可对后台返回数据进行处理             |
| title        | String           | ❌        | —                                     | 表格标题，目前没有用到                                       |
| pagination   | Boolean          | ❌        | true                                  | 是否显示分页组件：pagination 为 false 后台返回数据应该没有分页信息 和 list 字段，data 就是 list 数据 |
| initParam    | Object           | ❌        | {}                                    | 表格请求的初始化参数，该值变化会重新请求表格数据             |
| toolButton   | Boolean \| Array | ❌        | true                                  | 是否显示表格功能按钮，支持（["refresh" \| "setting" \| "search"]） |
| rowKey       | String           | ❌        | 'id'                                  | 当表格数据多选时，所指定的 id                                |
| searchCol    | Number \| Object | ❌        | \{ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 \} | 表格搜索项每列占比配置                                       |

### 2、Column 配置（ColumnProps）：

> 使用 `v-bind="column"` 通过属性透传将每一项 **column** 属性全部透传到 **el-table-column** 上，所以我们支持 **el-table-column** 的所有 **Props** 属性。在此基础上，还扩展了以下 **Props：**

| 属性名       | 类型              | 是否必传 | 默认值 | 属性描述                                                     |
| ------------ | ----------------- | -------- | ------ | ------------------------------------------------------------ |
| type         | String            | ❌        | —      | 对应列的类型（"index" \| "selection" \| "radio" \| "expand" \| "sort"） |
| tag          | Boolean           | ❌        | false  | 当前单元格值是否为标签展示，可通过 enum 数据中 tagType 字段指定 tag 类型 |
| isShow       | Boolean           | ❌        | true   | 当前列是否显示在表格内（只对 prop 列生效）                   |
| search       | SearchProps       | ❌        | —      | 搜索项配置，详情见 SearchProps                               |
| enum         | Array \| Function | ❌        | —      | 字典，可格式化单元格内容，还可以作为搜索框的下拉选项（字典可以为 API 请求函数，内部会自动执行） |
| isFilterEnum | Boolean           | ❌        | true   | 当前单元格值是否根据 enum 格式化（例如 enum 只作为搜索项数据，不参与内容格式化） |
| fieldNames   | Object            | ❌        | —      | 指定 label && value && children 的 key 值                    |
| headerRender | Function          | ❌        | —      | 自定义表头内容渲染（tsx 语法、h 语法）                       |
| render       | Function          | ❌        | —      | 自定义单元格内容渲染（tsx 语法、h 语法）                     |
| _children    | ColumnProps       | ❌        | —      | 多级表头                                                     |

### 3、搜索项 配置（SearchProps）：

> 使用 `v-bind="column.search.props“` 通过属性透传将 **search.props** 属性全部透传到每一项搜索组件上，所以我们支持 **input、select、tree-select、date-packer、time-picker、time-select、switch** 大部分属性，并在其基础上还扩展了以下 **Props：**

| 属性名       | 类型     | 是否必传 | 默认值 | 属性描述                                                     |
| ------------ | -------- | -------- | ------ | ------------------------------------------------------------ |
| el           | String   | ❌        | —      | 当前项搜索框的类型，支持：input、input-number、select、select-v2、tree-select、cascader、date-picker、time-picker、time-select、switch、slider |
| label        | String   | ❌        | —      | 当搜索项 label，如果不指定默认取 column 的 label             |
| props        | Object   | ❌        | —      | 根据 element plus 官方文档来传递，该属性所有值会透传到组件   |
| key          | String   | ❌        | —      | 当搜索项 key 不为 prop 属性时，可通过 key 指定               |
| tooltip      | String   | ❌        | —      | 搜索提示                                                     |
| order        | Number   | ❌        | —      | 搜索项排序（从小到大）                                       |
| span         | Number   | ❌        | 1      | 搜索项所占用的列数，默认为 1 列                              |
| offset       | Number   | ❌        | —      | 搜索字段左侧偏移列数                                         |
| defaultValue | Any      | ❌        | —      | 搜索项默认值（该值重置时会重置回初始值）                     |
| render       | Function | ❌        |        | 自定义搜索内容渲染（tsx 语法、h 语法）                       |

### 4、ProTable 事件：

> 根据 **ElementPlus Table** 文档在 **ProTable** 组件上绑定事件即可，组件会通过 **$attrs** 透传给 **el-table**。
>
> [el-table 事件文档链接](https://link.juejin.cn?target=https%3A%2F%2Felement-plus.org%2Fzh-CN%2Fcomponent%2Ftable.html%23table-%E4%BA%8B%E4%BB%B6)

| 事件名   | 描述                     | 回调参数               |
| -------- | ------------------------ | ---------------------- |
| dargSort | 表格拖拽排序成功后触发， | \{ newIndex, oldIndex \} |
| search   | 点击表格搜索按钮时会触发 | —                      |
| reset    | 点击表格重置按钮时会触发 | —                      |

### 5、ProTable 方法：

> **ProTable** 组件暴露了 **el-table** 实例和一些组件内部的参数和方法：
>
> [el-table 方法文档链接](https://link.juejin.cn?target=https%3A%2F%2Felement-plus.org%2Fzh-CN%2Fcomponent%2Ftable.html%23table-%E6%96%B9%E6%B3%95)

| 方法名              | 描述                                                         |
| ------------------- | ------------------------------------------------------------ |
| element             | `el-table` 实例，可以通过`proTable.value.element.xxx()`来调用 `el-table` 的所有方法 |
| tableData           | 当前页面所展示的数据                                         |
| radio               | 当前表格单选值（指定 type 为 "radio" 时可取到）              |
| pageable            | 当前表格的分页数据                                           |
| searchParam         | 所有的搜索参数，不包含分页                                   |
| searchInitParam     | 所有的搜索初始化默认的参数                                   |
| getTableList        | 获取、刷新表格数据的方法（携带所有参数）                     |
| search              | 表格查询方法，相当于点击搜索按钮                             |
| reset               | 重置表格查询参数，相当于点击重置按钮                         |
| handleSizeChange    | 表格每页条数改变触发的事件                                   |
| handleCurrentChange | 表格当前页改变触发的事件                                     |
| clearSelection      | 清空表格所选择的数据，除此方法之外还可使用 `proTable.value.element.clearSelection()` |
| enumMap             | 当前表格使用的所有字典数据（Map 数据结构）                   |
| isSelected          | 表格是否选中数据                                             |
| selectedList        | 表格选中的数据列表                                           |
| selectedListIds     | 表格选中的数据列表的 id                                      |

### 6、ProTable 插槽：

| 插槽名                   | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| —                        | 默认插槽，支持直接在 ProTable 中写 el-table-column 标签      |
| tableHeader              | 自定义表格头部左侧区域的插槽，一般情况该区域放操作按钮       |
| toolButton               | 自定义表格头部左右侧侧功能区域的插槽                         |
| append                   | 插入至表格最后一行之后的内容， 如果需要对表格的内容进行无限滚动操作，可能需要用到这个 slot。 若表格有合计行，该 slot 会位于合计行之上。 |
| empty                    | 当表格数据为空时自定义的内容                                 |
| pagination               | 分页组件插槽                                                 |
| `column.prop`            | 单元格的作用域插槽                                           |
| `column.prop` + "Header" | 表头的作用域插槽                                             |

## 六、代码实现 & 基础使用 💪（代码较多，详情请去项目里查看）

### 使用一段话总结下我的想法：📚📚

> 🤔 **前提：首先我们在封装 ProTable 组件的时候，在不影响 el-table 原有的属性、事件、方法的前提下，然后在其基础上做二次封装，否则做得再好，也不太完美。**

> 🧐 **思路：把一个表格页面所有重复的功能 （表格多选、查询、重置、刷新、分页、数据操作二次确认、文件下载、文件上传） 都封装成 Hooks 函数钩子或组件，然后在 ProTable 组件中使用这些函数钩子或组件。在页面中使用的时，只需传给 ProTable 当前表格数据的请求 API、表格配置项 columns 就行了，数据传输都使用 作用域插槽 或 tsx 语法从 ProTable 传递给父组件就能在页面上获取到了。**

### 1、常用 Hooks 函数

- **useTable：**

```ts
import { Table } from "./interface";
import { reactive, computed, toRefs } from "vue";

/**
 * @description table 页面操作方法封装
 * @param {Function} api 获取表格数据 api 方法 (必传)
 * @param {Object} initParam 获取数据初始化参数 (非必传，默认为{})
 * @param {Boolean} isPageable 是否有分页 (非必传，默认为true)
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法 (非必传)
 * */
export const useTable = (
  api?: (params: any) => Promise<any>,
  initParam: object = {},
  isPageable: boolean = true,
  dataCallBack?: (data: any) => any,
  requestError?: (error: any) => void
) => {
  const state = reactive<Table.StateProps>({
    // 表格数据
    tableData: [],
    // 分页数据
    pageable: {
      // 当前页数
      pageNum: 1,
      // 每页显示条数
      pageSize: 10,
      // 总条数
      total: 0
    },
    // 查询参数(只包括查询)
    searchParam: {},
    // 初始化默认的查询参数
    searchInitParam: {},
    // 总参数(包含分页和查询参数)
    totalParam: {}
  });

  /**
   * @description 分页查询参数(只包括分页和表格字段排序,其他排序方式可自行配置)
   * */
  const pageParam = computed({
    get: () => {
      return {
        pageNum: state.pageable.pageNum,
        pageSize: state.pageable.pageSize
      };
    },
    set: (newVal: any) => {
      console.log("我是分页更新之后的值", newVal);
    }
  });

  /**
   * @description 获取表格数据
   * @return void
   * */
  const getTableList = async () => {
    if (!api) return;
    try {
      // 先把初始化参数和分页参数放到总参数里面
      Object.assign(state.totalParam, initParam, isPageable ? pageParam.value : {});
      let { data } = await api({ ...state.searchInitParam, ...state.totalParam });
      dataCallBack && (data = dataCallBack(data));
      state.tableData = isPageable ? data.list : data;
      // 解构后台返回的分页数据 (如果有分页更新分页信息)
      if (isPageable) {
        const { pageNum, pageSize, total } = data;
        updatePageable({ pageNum, pageSize, total });
      }
    } catch (error) {
      requestError && requestError(error);
    }
  };

  /**
   * @description 更新查询参数
   * @return void
   * */
  const updatedTotalParam = () => {
    state.totalParam = {};
    // 处理查询参数，可以给查询参数加自定义前缀操作
    let nowSearchParam: Table.StateProps["searchParam"] = {};
    // 防止手动清空输入框携带参数（这里可以自定义查询参数前缀）
    for (let key in state.searchParam) {
      // 某些情况下参数为 false/0 也应该携带参数
      if (state.searchParam[key] || state.searchParam[key] === false || state.searchParam[key] === 0) {
        nowSearchParam[key] = state.searchParam[key];
      }
    }
    Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParam.value : {});
  };

  /**
   * @description 更新分页信息
   * @param {Object} pageable 后台返回的分页数据
   * @return void
   * */
  const updatePageable = (pageable: Table.Pageable) => {
    Object.assign(state.pageable, pageable);
  };

  /**
   * @description 表格数据查询
   * @return void
   * */
  const search = () => {
    state.pageable.pageNum = 1;
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 表格数据重置
   * @return void
   * */
  const reset = () => {
    state.pageable.pageNum = 1;
    // 重置搜索表单的时，如果有默认搜索参数，则重置默认的搜索参数
    state.searchParam = { ...state.searchInitParam };
    updatedTotalParam();
    getTableList();
  };

  /**
   * @description 每页条数改变
   * @param {Number} val 当前条数
   * @return void
   * */
  const handleSizeChange = (val: number) => {
    state.pageable.pageNum = 1;
    state.pageable.pageSize = val;
    getTableList();
  };

  /**
   * @description 当前页改变
   * @param {Number} val 当前页
   * @return void
   * */
  const handleCurrentChange = (val: number) => {
    state.pageable.pageNum = val;
    getTableList();
  };

  return {
    ...toRefs(state),
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
    updatedTotalParam
  };
};
```

- **useSelection：**

```ts
import { ref, computed } from "vue";

/**
 * @description 表格多选数据操作
 * @param {String} rowKey 当表格可以多选时，所指定的 id
 * */
export const useSelection = (rowKey: string = "id") => {
  const isSelected = ref<boolean>(false);
  const selectedList = ref<{ [key: string]: any }[]>([]);

  // 当前选中的所有 ids 数组
  const selectedListIds = computed((): string[] => {
    let ids: string[] = [];
    selectedList.value.forEach(item => ids.push(item[rowKey]));
    return ids;
  });

  /**
   * @description 多选操作
   * @param {Array} rowArr 当前选择的所有数据
   * @return void
   */
  const selectionChange = (rowArr: { [key: string]: any }[]) => {
    rowArr.length ? (isSelected.value = true) : (isSelected.value = false);
    selectedList.value = rowArr;
  };

  return {
    isSelected,
    selectedList,
    selectedListIds,
    selectionChange
  };
};
```

- **useDownload：**

```ts
import { ElNotification } from "element-plus";

/**
 * @description 接收数据流生成 blob，创建链接，下载文件
 * @param {Function} api 导出表格的api方法 (必传)
 * @param {String} tempName 导出的文件名 (必传)
 * @param {Object} params 导出的参数 (默认{})
 * @param {Boolean} isNotify 是否有导出消息提示 (默认为 true)
 * @param {String} fileType 导出的文件格式 (默认为.xlsx)
 * */
export const useDownload = async (
  api: (param: any) => Promise<any>,
  tempName: string,
  params: any = {},
  isNotify: boolean = true,
  fileType: string = ".xlsx"
) => {
  if (isNotify) {
    ElNotification({
      title: "温馨提示",
      message: "如果数据庞大会导致下载缓慢哦，请您耐心等待！",
      type: "info",
      duration: 3000
    });
  }
  try {
    const res = await api(params);
    const blob = new Blob([res]);
    // 兼容 edge 不支持 createObjectURL 方法
    if ("msSaveOrOpenBlob" in navigator) return window.navigator.msSaveOrOpenBlob(blob, tempName + fileType);
    const blobUrl = window.URL.createObjectURL(blob);
    const exportFile = document.createElement("a");
    exportFile.style.display = "none";
    exportFile.download = `${tempName}${fileType}`;
    exportFile.href = blobUrl;
    document.body.appendChild(exportFile);
    exportFile.click();
    // 去除下载对 url 的影响
    document.body.removeChild(exportFile);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.log(error);
  }
};
```

- **useHandleData：**

```ts
import { ElMessageBox, ElMessage } from "element-plus";
import { HandleData } from "./interface";

/**
 * @description 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法 (必传)
 * @param {Object} params 携带的操作数据参数 {id,params} (必传)
 * @param {String} message 提示信息 (必传)
 * @param {String} confirmType icon类型 (不必传,默认为 warning)
 * @returns {Promise}
 */
export const useHandleData = (
  api: (params: any) => Promise<any>,
  params: any = {},
  message: string,
  confirmType: HandleData.MessageType = "warning"
) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`是否${message}?`, "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: confirmType,
      draggable: true
    }).then(async () => {
      const res = await api(params);
      if (!res) return reject(false);
      ElMessage({
        type: "success",
        message: `${message}成功!`
      });
      resolve(true);
    });
  });
};
```

### 2、Protable 组件：

- **ProTable：**

```html
<template>
  <!-- 查询表单 -->
  <SearchForm
    v-show="isShowSearch"
    :search="_search"
    :reset="_reset"
    :columns="searchColumns"
    :search-param="searchParam"
    :search-col="searchCol"
  />

  <!-- 表格主体 -->
  <div class="card table-main">
    <!-- 表格头部 操作按钮 -->
    <div class="table-header">
      <div class="header-button-lf">
        <slot name="tableHeader" :selected-list="selectedList" :selected-list-ids="selectedListIds" :is-selected="isSelected" />
      </div>
      <div v-if="toolButton" class="header-button-ri">
        <slot name="toolButton">
          <el-button v-if="showToolButton('refresh')" :icon="Refresh" circle @click="getTableList" />
          <el-button v-if="showToolButton('setting') && columns.length" :icon="Operation" circle @click="openColSetting" />
          <el-button
            v-if="showToolButton('search') && searchColumns?.length"
            :icon="Search"
            circle
            @click="isShowSearch = !isShowSearch"
          />
        </slot>
      </div>
    </div>
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="processTableData"
      :border="border"
      :row-key="rowKey"
      @selection-change="selectionChange"
    >
      <!-- 默认插槽 -->
      <slot />
      <template v-for="item in tableColumns" :key="item">
        <!-- selection || radio || index || expand || sort -->
        <el-table-column
          v-if="item.type && columnTypes.includes(item.type)"
          v-bind="item"
          :align="item.align ?? 'center'"
          :reserve-selection="item.type == 'selection'"
        >
          <template #default="scope">
            <!-- expand -->
            <template v-if="item.type == 'expand'">
              <component :is="item.render" v-bind="scope" v-if="item.render" />
              <slot v-else :name="item.type" v-bind="scope" />
            </template>
            <!-- radio -->
            <el-radio v-if="item.type == 'radio'" v-model="radio" :label="scope.row[rowKey]">
              <i></i>
            </el-radio>
            <!-- sort -->
            <el-tag v-if="item.type == 'sort'" class="move">
              <el-icon> <DCaret /></el-icon>
            </el-tag>
          </template>
        </el-table-column>
        <!-- other -->
        <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TableColumn>
      </template>
      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append" />
      </template>
      <!-- 无数据 -->
      <template #empty>
        <div class="table-empty">
          <slot name="empty">
            <img src="@/assets/images/notData.png" alt="notData" />
            <div>暂无数据</div>
          </slot>
        </div>
      </template>
    </el-table>
    <!-- 分页组件 -->
    <slot name="pagination">
      <Pagination
        v-if="pagination"
        :pageable="pageable"
        :handle-size-change="handleSizeChange"
        :handle-current-change="handleCurrentChange"
      />
    </slot>
  </div>
  <!-- 列设置 -->
  <ColSetting v-if="toolButton" ref="colRef" v-model:col-setting="colSetting" />
</template>

<script setup lang="ts" name="ProTable">
import { ref, watch, provide, onMounted, unref, computed, reactive } from "vue";
import { ElTable } from "element-plus";
import { useTable } from "@/hooks/useTable";
import { useSelection } from "@/hooks/useSelection";
import { BreakPoint } from "@/components/Grid/interface";
import { ColumnProps, TypeProps } from "@/components/ProTable/interface";
import { Refresh, Operation, Search } from "@element-plus/icons-vue";
import { handleProp } from "@/utils";
import SearchForm from "@/components/SearchForm/index.vue";
import Pagination from "./components/Pagination.vue";
import ColSetting from "./components/ColSetting.vue";
import TableColumn from "./components/TableColumn.vue";
import Sortable from "sortablejs";

export interface ProTableProps {
  columns: ColumnProps[]; // 列配置项  ==> 必传
  data?: any[]; // 静态 table data 数据，若存在则不会使用 requestApi 返回的 data ==> 非必传
  requestApi?: (params: any) => Promise<any>; // 请求表格数据的 api ==> 非必传
  requestAuto?: boolean; // 是否自动执行请求 api ==> 非必传（默认为true）
  requestError?: (params: any) => void; // 表格 api 请求错误监听 ==> 非必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  title?: string; // 表格标题 ==> 非必传
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true）
  initParam?: any; // 初始化请求参数 ==> 非必传（默认为{}）
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
  toolButton?: ("refresh" | "setting" | "search")[] | boolean; // 是否显示表格功能按钮 ==> 非必传（默认为true）
  rowKey?: string; // 行数据的 Key，用来优化 Table 的渲染，当表格数据多选时，所指定的 id ==> 非必传（默认为 id）
  searchCol?: number | Record<BreakPoint, number>; // 表格搜索项 每列占比配置 ==> 非必传 { xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }
}

// 接受父组件参数，配置默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  requestAuto: true,
  pagination: true,
  initParam: {},
  border: true,
  toolButton: true,
  rowKey: "id",
  searchCol: () => ({ xs: 1, sm: 2, md: 2, lg: 3, xl: 4 })
});

// table 实例
const tableRef = ref<InstanceType<typeof ElTable>>();

// column 列类型
const columnTypes: TypeProps[] = ["selection", "radio", "index", "expand", "sort"];

// 是否显示搜索模块
const isShowSearch = ref(true);

// 控制 ToolButton 显示
const showToolButton = (key: "refresh" | "setting" | "search") => {
  return Array.isArray(props.toolButton) ? props.toolButton.includes(key) : props.toolButton;
};

// 单选值
const radio = ref("");

// 表格多选 Hooks
const { selectionChange, selectedList, selectedListIds, isSelected } = useSelection(props.rowKey);

// 表格操作 Hooks
const { tableData, pageable, searchParam, searchInitParam, getTableList, search, reset, handleSizeChange, handleCurrentChange } =
  useTable(props.requestApi, props.initParam, props.pagination, props.dataCallback, props.requestError);

// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 初始化表格数据 && 拖拽排序
onMounted(() => {
  dragSort();
  props.requestAuto && getTableList();
  props.data && (pageable.value.total = props.data.length);
});

// 处理表格数据
const processTableData = computed(() => {
  if (!props.data) return tableData.value;
  return props.data.slice(
    (pageable.value.pageNum - 1) * pageable.value.pageSize,
    pageable.value.pageSize * pageable.value.pageNum
  );
});

// 监听页面 initParam 改化，重新获取表格数据
watch(() => props.initParam, getTableList, { deep: true });

// 接收 columns 并设置为响应式
const tableColumns = reactive<ColumnProps[]>(props.columns);

// 扁平化 columns
const flatColumns = computed(() => flatColumnsFunc(tableColumns));

// 定义 enumMap 存储 enum 值（避免异步请求无法格式化单元格内容 || 无法填充搜索下拉选择）
const enumMap = ref(new Map<string, { [key: string]: any }[]>());
const setEnumMap = async ({ prop, enum: enumValue }: ColumnProps) => {
  if (!enumValue) return;

  // 如果当前 enumMap 存在相同的值 return
  if (enumMap.value.has(prop!) && (typeof enumValue === "function" || enumMap.value.get(prop!) === enumValue)) return;

  // 当前 enum 为静态数据，则直接存储到 enumMap
  if (typeof enumValue !== "function") return enumMap.value.set(prop!, unref(enumValue!));
  
   // 为了防止接口执行慢，而存储慢，导致重复请求，所以预先存储为[]，接口返回后再二次存储
  enumMap.value.set(prop!, []);

  // 当前 enum 为后台数据需要请求数据，则调用该请求接口，并存储到 enumMap
  const { data } = await enumValue();
  enumMap.value.set(prop!, data);
};

// 注入 enumMap
provide("enumMap", enumMap);

// 扁平化 columns 的方法
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
  columns.forEach(async col => {
    if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
    flatArr.push(col);

    // column 添加默认 isShow && isFilterEnum 属性值
    col.isShow = col.isShow ?? true;
    col.isFilterEnum = col.isFilterEnum ?? true;

    // 设置 enumMap
    await setEnumMap(col);
  });
  return flatArr.filter(item => !item._children?.length);
};

// 过滤需要搜索的配置项 && 排序
const searchColumns = computed(() => {
  return flatColumns.value
    ?.filter(item => item.search?.el || item.search?.render)
    .sort((a, b) => a.search!.order! - b.search!.order!);
});

// 设置 搜索表单默认排序 && 搜索表单项的默认值
searchColumns.value?.forEach((column, index) => {
  column.search!.order = column.search?.order ?? index + 2;
  const key = column.search?.key ?? handleProp(column.prop!);
  const defaultValue = column.search?.defaultValue;
  if (defaultValue !== undefined && defaultValue !== null) {
    searchInitParam.value[key] = defaultValue;
    searchParam.value[key] = defaultValue;
  }
});

// 列设置 ==> 需要过滤掉不需要设置的列
const colRef = ref();
const colSetting = tableColumns!.filter(item => {
  const { type, prop, isShow } = item;
  return !columnTypes.includes(type!) && prop !== "operation" && isShow;
});
const openColSetting = () => colRef.value.openColSetting();

// 定义 emit 事件
const emit = defineEmits<{
  search: [];
  reset: [];
  dargSort: [{ newIndex?: number; oldIndex?: number }];
}>();

const _search = () => {
  search();
  emit("search");
};

const _reset = () => {
  reset();
  emit("reset");
};

// 拖拽排序
const dragSort = () => {
  const tbody = document.querySelector(".el-table__body-wrapper tbody") as HTMLElement;
  Sortable.create(tbody, {
    handle: ".move",
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      const [removedItem] = processTableData.value.splice(oldIndex!, 1);
      processTableData.value.splice(newIndex!, 0, removedItem);
      emit("dargSort", { newIndex, oldIndex });
    }
  });
};

// 暴露给父组件的参数和方法 (外部需要什么，都可以从这里暴露出去)
defineExpose({
  element: tableRef,
  tableData: processTableData,
  radio,
  pageable,
  searchParam,
  searchInitParam,
  getTableList,
  search,
  reset,
  handleSizeChange,
  handleCurrentChange,
  clearSelection,
  enumMap,
  isSelected,
  selectedList,
  selectedListIds
});
</script>
```

- **TableColumn：**

```html
<template>
  <RenderTableColumn v-bind="column" />
</template>

<script setup lang="tsx" name="TableColumn">
import { inject, ref, useSlots } from "vue";
import { ColumnProps, RenderScope, HeaderRenderScope } from "@/components/ProTable/interface";
import { filterEnum, formatValue, handleProp, handleRowAccordingToProp } from "@/utils";

defineProps<{ column: ColumnProps }>();

const slots = useSlots();

const enumMap = inject("enumMap", ref(new Map()));

// 渲染表格数据
const renderCellData = (item: ColumnProps, scope: RenderScope<any>) => {
  return enumMap.value.get(item.prop) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop)!, item.fieldNames)
    : formatValue(handleRowAccordingToProp(scope.row, item.prop!));
};

// 获取 tag 类型
const getTagType = (item: ColumnProps, scope: RenderScope<any>) => {
  return filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop), item.fieldNames, "tag");
};

const RenderTableColumn = (item: ColumnProps) => {
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          align={item.align ?? "center"}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
          {{
            default: (scope: RenderScope<any>) => {
              if (item._children) return item._children.map(child => RenderTableColumn(child));
              if (item.render) return item.render(scope);
              if (slots[handleProp(item.prop!)]) return slots[handleProp(item.prop!)]!(scope);
              if (item.tag) return <el-tag type={getTagType(item, scope)}>{renderCellData(item, scope)}</el-tag>;
              return renderCellData(item, scope);
            },
            header: (scope: HeaderRenderScope<any>) => {
              if (item.headerRender) return item.headerRender(scope);
              if (slots[`${handleProp(item.prop!)}Header`]) return slots[`${handleProp(item.prop!)}Header`]!(scope);
              return item.label;
            }
          }}
        </el-table-column>
      )}
    </>
  );
};
</script>
```

### 3、页面使用 ProTable 组件：

```html
<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @darg-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
        <el-button v-auth="'batchAdd'" type="primary" :icon="Upload" plain @click="batchAdd">批量添加用户</el-button>
        <el-button v-auth="'export'" type="primary" :icon="Download" plain @click="downloadFile">导出用户数据</el-button>
        <el-button type="primary" plain @click="toDetail">To 子集详情页面</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除用户
        </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template>
      <!-- createTime -->
      <template #createTime="scope">
        <el-button type="primary" link @click="ElMessage.success('我是通过作用域插槽渲染的内容')">
          {{ scope.row.createTime }}
        </el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button>
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import { ElMessage, ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance, ColumnProps, HeaderRenderScope } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen, Download, Upload, View, Refresh } from "@element-plus/icons-vue";
import {
  getUserList,
  deleteUser,
  editUser,
  addUser,
  changeUserStatus,
  resetUserPassWord,
  exportUserInfo,
  BatchAddUser,
  getUserStatus,
  getUserGender
} from "@/api/modules/user";

const router = useRouter();

// 跳转详情页
const toDetail = () => {
  router.push(`/proTable/useProTable/detail/${Math.random().toFixed(3)}?params=detail-page`);
};

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserList(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 自定义渲染表头（使用tsx语法）
const headerRender = (scope: HeaderRenderScope<User.ResUserList>) => {
  return (
    <el-button type="primary" onClick={() => ElMessage.success("我是通过 tsx 语法渲染的表头")}>
      {scope.column.label}
    </el-button>
  );
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  { type: "sort", label: "Sort", width: 80 },
  { type: "expand", label: "Expand", width: 85 },
  {
    prop: "username",
    label: "用户姓名",
    search: { el: "input", tooltip: "我是搜索提示" },
    render: scope => {
      return (
        <el-button type="primary" link onClick={() => ElMessage.success("我是通过 tsx 语法渲染的内容")}>
          {scope.row.username}
        </el-button>
      );
    }
  },
  {
    prop: "gender",
    label: "性别",
    // 字典数据（本地数据）
    // enum: genderType,
    // 字典请求不带参数
    enum: getUserGender,
    // 字典请求携带参数
    // enum: () => getUserGender({ id: 1 }),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "genderLabel", value: "genderValue" }
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
    search: {
      // 自定义 search 显示内容
      render: ({ searchParam }) => {
        return (
          <div class="flx-center">
            <el-input vModel_trim={searchParam.minAge} placeholder="最小年龄" />
            <span class="mr10 ml10">-</span>
            <el-input vModel_trim={searchParam.maxAge} placeholder="最大年龄" />
          </div>
        );
      }
    }
  },
  { prop: "idCard", label: "身份证号", search: { el: "input" } },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },
  {
    prop: "status",
    label: "用户状态",
    enum: getUserStatus,
    search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  {
    prop: "createTime",
    label: "创建时间",
    headerRender,
    width: 180,
    search: {
      el: "date-picker",
      span: 2,
      props: { type: "datetimerange", valueFormat: "YYYY-MM-DD HH:mm:ss" },
      defaultValue: ["2022-11-12 11:35:00", "2022-12-12 11:35:00"]
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 重置用户密码
const resetPass = async (params: User.ResUserList) => {
  await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
  proTable.value?.getTableList();
};

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
  await useHandleData(changeUserStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.username}】用户状态`);
  proTable.value?.getTableList();
};

// 导出用户列表
const downloadFile = async () => {
  ElMessageBox.confirm("确认导出用户数据?", "温馨提示", { type: "warning" }).then(() =>
    useDownload(exportUserInfo, "用户列表", proTable.value?.searchParam)
  );
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);
const batchAdd = () => {
  const params = {
    title: "用户",
    tempApi: exportUserInfo,
    importApi: BatchAddUser,
    getTableList: proTable.value?.getTableList
  };
  dialogRef.value?.acceptParams(params);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
```

## 七、贡献者 👨‍👦‍👦

- [HalseySpicy](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FHalseySpicy)
- [denganjia](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fdenganjia)

