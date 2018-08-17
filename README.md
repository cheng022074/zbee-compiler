# 欢迎使用ZBEE
**ZBEE** 是一款基于控制台作业的工作程化代码设计工具，通过精心的设计与技术实现，可支持所有基于 ** Javascript ** 的项目代码管理工作 ， 让 ** Javascript ** 代码也能够象 Java、C# 一样通过命名空间方式来管理

## 安装
> 只能以局部安装方式进行安装
```
> cnpm i --save-dev zbee
```

## 文件名称
> **格式** : [目录名称]::[命名空间名称]
> 目录名称包括源、调试、测试、配置、

## 命令

### version

> 查看编译器的版本号
 
```
> npx zb version
0.0.56
```

### compile

> 可编译函数、类、测试用例、模板、配置五类文件

> 编译文件时，会将其依赖的文件一同编译

```
> npx zb compile is.string
已生成 src::is.string
已生成 src::is.type
```



