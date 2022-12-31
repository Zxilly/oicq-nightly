# oicq-nightly
编译 [oicq](https://github.com/takayama-lily/oicq) 每夜构建并发布到 [GitHub Packages](https://github.com/Zxilly/oicq-nightly/pkgs/npm/oicq) 和 `publish-x` 分支。

## 使用方法


### Github Packages

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

## 说明
