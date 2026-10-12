# 末日纵深 · Doomsday Depths

《末日纵深》是一款地下避难所经营游戏，致敬儿时的《末日经营者》。向深处扩建，安置居民，调配资源，在末日之下建立你的生存基地。

Doomsday Depths is an underground shelter management game—a tribute to the childhood favorite, Doomsday Preppers. Expand deeper, recruit residents, and manage resources to build your survival base beneath a world in collapse.

## 下载 APK 与 EXE

仓库每次推送到 `main` 会自动构建。在 [Actions](https://github.com/Xiaoxiaoxiaoxiao123/Doomsday-Depths/actions) 打开最新成功运行，在页面底部 Artifacts 下载：

- `Doomsday-Depths-Android`：解压得到 APK，Android 6.0 及以上可安装。当前为开发测试 APK，未做商店发行签名。后续调试构建的签名可能不同，更新前请导出存档。
- `Doomsday-Depths-Windows`：解压得到安装版（nsis）与免安装版（portable）EXE，Windows x64。当前无商业代码签名。
- `web-game`：完整单文件网页，直接打开 `index.html` 即可离线游玩。

Artifacts 保留 30 天；在 Actions 中选择工作流并点击 Run workflow 可重新构建。下载 Actions 产物通常需要登录 GitHub。

## 玩法

- 玩家：金币数，起始 1000，最低 0。
- 居民：名字、年龄、特长；自由分配楼层，随机或手动组合头部、上身、下身。
- 12 类房间、5 类楼层：生活、种植、储备、文化、休闲。
- 楼层属性：名称、层数、每分钟基础产出与维护消耗、容量 2–5 人、建造金币、建造时间 0–5 分钟。
- 每人贡献满员基础产出的 `1 / 容量`，特长匹配类别时个人收入增加 25%。
- 运行楼层有维护费，空房间也扣费；暂停后停止收益与消耗。宿舍提供社区床位。
- 电梯正确接送奖励 25 金币。有床位和目标层空位时，新居民直接留在该层。临时访客停留 60 秒，满员时在入口候场。
- 离线净收支最多结算 8 小时，建造倒计时持续推进。

## 存档

自动存档保存在各设备自己的浏览器 / 应用数据中。网页、APK 与 EXE 不自动同步。使用设置中的 JSON 导出 / 导入可以迁移。

为了保留旧版进度，内部存档键仍为 `last-light-v2`，名称改变不会重置存档。安卓版通过系统文件选择器导入，并通过系统保存窗口导出。

## 本地开发

需要 Node.js 22、Python 3.12 与 Pillow：

```sh
python -m pip install Pillow
python scripts/pack-images.py
node scripts/build.mjs
npm test
```

打包后的网页为 `dist/index.html`，包含全部 60 张图片，无需单独请求美术资源。编辑页面结构请修改 `src/index.html`；修改逻辑请编辑 `dist/*.js`；样式在 `dist/style.css`。`dist/index.html` 与 `src/image-pack.json` 是生成文件。

Windows 桌面开发 / 打包：

```sh
npm install
npm start
npm run build:windows
```

Android：用 Android Studio 打开 `android/`，或配置 JDK 17、Gradle 8.9、Android SDK 35 后运行：

```sh
node scripts/prepare-android.mjs
gradle -p android assembleDebug
```

## 增加房间和图片

在 `dist/catalog.js` 的 `ROOMS` 中新增配置，并放入 `dist/assets/rooms/<类型>.webp`。类别与特长在 `CATEGORIES` 和 `SPECIALTIES` 中定义。执行图片打包与网页构建即可。存档中的既有楼层属性保存快照，新增配置不会自动改写旧楼层。

人物部件共 16 个头部、16 件上身、16 套下身，4096 种组合。`dist/anchors.js` 为真实脖子连接锚点；更换部件后需重新测量锚点。

## 验证与当前边界

`npm test` 覆盖收支、特长、容量、建造、暂停、电梯、床位、离线、存档迁移、图片内嵌及失败重试。

APK / EXE 必须以 Actions 实际构建结果为准。当前尚未进行真实手机与 Windows 安装试玩。未来照片生成自定义人物尚未实现。

## 项目定位

本项目使用原创生成美术资源与自行实现的代码，不包含《末日经营者》的原版代码或美术素材。本仓库暂未指定开放源码许可证；公开可查看不等于授予任意商业使用许可。
