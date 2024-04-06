# 登录与身份验证逻辑

## 第一部分：登录相关

### 登录涉及的源码文件

1. 视图层：登录表单组件 `src/views/login/components/LoginForm.vue`
2. 接口层：api登录组件 `src/api/modules/login.ts`



### 登录涉及的后端接口

- 路径 `index/login`

- 方法 `post`
- 参数 

```typescript
{
sid: string,
password: string
}
```

- 返回值

```typescript
{
"code": int,
"state": boolean,
"message": string,
"data": {
    "token": xxx
  }
}
```



### 登录逻辑

1. 用户输入账号和密码，并确认
2. 触发登录表单组件内绑定的login方法
3. 检查输入是否合规、有效
4. 为了密码传输过程中的安全性，前端将用户密码做MD5处理，得到密码哈希值
5. 调用登录接口`loginApi`，获取用户数据（主要是用户的token。诸如用户名之类的在登录完成之后再通过token获取。）
6. 添加动态路由
7. 清空所有标签页、`keepAlive` 数据
8. 跳转到首页
9. 显示欢迎登录的提示消息
10. 结束loading转圈



:::warning 注意

1. 在这里无需处理请求失败的情况。失败的请求会被api目录下二次封装的axios所拦截，并自动向用户显示错误消息。[详见这里→](https://charwind.top/docs/CQU/guide/request.html)

2. 为了密码传输过程中的安全性，前端将用户密码做MD5处理，得到密码哈希值，再通过`loginApi`传给后端。

3. 调用登录接口`loginApi`的主要目的是获取用户的token，并不会获取用户名、头像之类的额外信息。这些额外的信息，在登录完成之后再通过token获取，并通过`userStore.setUserInfo()`应用到全局。

:::



### 登录表单相关代码

```typescript
// 登录表单组件 src/views/login/components

const login = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate(async valid => {
        if (!valid) return;
        loading.value = true;
        try {
            // 1.执行登录接口
            const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) });
            userStore.setUserInfo(data);
            userStore.setToken(data.sid);

            // 2.添加动态路由
            await initDynamicRouter();

            // 3.清空 tabs、keepAlive 数据
            tabsStore.closeMultipleTab();
            keepAliveStore.setKeepAliveName();

            // 4.跳转到首页
            router.push(HOME_URL);
            ElNotification({
                title: getTimeState(),
                message: "欢迎登录" + data.username,
                type: "success",
                duration: 3000
            });
        } finally {
            loading.value = false;
        }
    });
};
```



## 第二部分：token相关

### token综述

token的获取、存放、管理、携带等流程，在本项目中已经实现全自动管理。在请求api的时候，不用再考虑token问题。

### token的使用

项目在对axios进行二次封装时，注册了`interceptors`（拦截器），拦截了客户端发给服务端的所有请求，在发起请求前自动在请求头加入`x-access-token`信息，将本地token传给服务器做鉴权：

```typescript
/**
 * @description 请求拦截器
 * 客户端发送请求 -> [请求拦截器] -> 服务器
 * token校验(JWT) : 接受服务器返回的 token,存储到 vuex/pinia/本地储存当中
 */
this.service.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
        const userStore = useUserStore();
        // 当前请求不需要显示 loading，在 api 服务中通过指定的第三个参数: { noLoading: true } 来控制
        config.noLoading || showFullScreenLoading();
        if (config.headers && typeof config.headers.set === "function") {
            config.headers.set("x-access-token", userStore.token);
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);
```

同样，服务端如果出现401响应（`ResultEnum.OVERDUE`），前端则会清空token，并且返回到登录界面：

```typescript
// 登陆失效
if (data.code == ResultEnum.OVERDUE) {
    userStore.setToken("");
    router.replace(LOGIN_URL);
    ElMessage.error(data.msg);
    return Promise.reject(data);
}
```

:::tip 以下场景也会清空token

1. 用户退出登录
2. 用户修改密码

:::

### token的存储

token存放在pinia store中（`src/stores/modules/user.ts`）。

由于本项目使用`pinia-plugin-persistedstate`进行store的持久化存储，全过程都是自动进行的，无需手动干预，所以token的持久化存储也是自发完成的。

![](https://img2.imgtp.com/2024/04/06/C6ZZ3XFu.png)

如果需要手动操作`localStorage`，项目内置的工具库`src\utils\index.ts`已经对`localStorage`操作进行了封装。
