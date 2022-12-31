# oicq-nightly

[![Compile and Publish](https://github.com/Zxilly/oicq-nightly/actions/workflows/build.yml/badge.svg)](https://github.com/Zxilly/oicq-nightly/actions/workflows/build.yml)

编译 [oicq](https://github.com/takayama-lily/oicq) 每夜构建并发布到 [GitHub Packages](https://github.com/Zxilly/oicq-nightly/pkgs/npm/oicq)，Github Release 和 `publish-x` 分支。

## 使用方法

### publish-x 分支

`publish` 分支是每夜构建的最新版本

```bash
npm install github:Zxilly/oicq-nightly#publish
```

如果你想使用特定的构建版本，可以使用 `publish-x.x.x-<hash>` 分支，其中 `x.x.x` 为构建版本号，`<hash>` 为 oicq 构建的 commit hash。

```bash
npm install github:Zxilly/oicq-nightly#publish-2.3.1-30f2c56
```

### Github Release

Github Release 也包含了每夜构建的最新版本

```bash
npm install https://github.com/Zxilly/oicq-nightly/releases/download/latest/oicq.tgz
```

同样的，如果你想使用特定的构建版本，可以使用 `oicq-x.x.x-<hash>.tgz`，其中 `x.x.x` 为构建版本号，`<hash>` 为 oicq 构建的 commit hash。

```bash
npm install https://github.com/Zxilly/oicq-nightly/releases/download/2.3.1-30f2c56/oicq-2.3.1-30f2c56.tgz
```

查看 [Release](https://github.com/Zxilly/oicq-nightly/releases) 来获得可用的选项。

### Github Packages

> 由于 GitHub Packages 的限制，你现在应该从 `@zxilly/oicq` 导入，而不是 `oicq`。
由于此限制，Github Packages 渠道不被推荐。

项目根目录创建文件 `.npmrc`，内容如下：

```npmrc
@zxilly:registry=https://npm.pkg.github.com
```

随后执行以下命令：

```bash
npm login --registry=https://npm.pkg.github.com
```

现在你可以使用以下命令安装 oicq：

```bash
npm install @zxilly/oicq
```

## 关于

### 为什么要编译 oicq？

oicq 的每夜构建版本包含了最新的功能和修复，但是并没有发布到 npm，所以我编译了每夜构建版本并发布。

### 构建频率

每天 0 点 43 分开始构建，构建完成后会发布，如果构建失败则不会发布。

## License

[Mozilla Public License Version 2.0](https://github.com/Zxilly/oicq-nightly/blob/master/LICENSE)