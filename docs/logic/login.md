# 登录逻辑

## 登录涉及的源码文件

1. 视图层：登录表单组件 `src/views/login/components`
2. 接口层：api登录组件 `src/api/modules/login.ts`



## 登录逻辑

1. 用户输入账号和密码，并确认
2. 触发登录表单组件内绑定的login方法
3. 检查输入是否合规、有效
4. 为了密码传输过程中的安全性，前端将用户密码做MD5处理，得到密码哈希值
5. 调用登录接口`loginApi`，获取用户数据
6. 添加动态路由
7. 清空所有标签页、`keepAlive` 数据
8. 跳转到首页
9. 显示欢迎登录的提示消息
10. 结束loading转圈



:::warning 注意

1. 在这里无需处理请求失败的情况。失败的请求会被api目录下二次封装的axios所拦截，并自动向用户显示错误消息。[详见这里→](https://charwind.top/docs/CQU/guide/request.html)

2. 为了密码传输过程中的安全性，前端将用户密码做MD5处理，得到密码哈希值，再通过`loginApi`传给后端。

:::



## 相关代码

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

