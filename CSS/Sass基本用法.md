# Sass基本用法

## 1. 变量

使用`$`符号定义，可以存储颜色、数值、字符串等。

```scss
$primary-color: #3498db;

.header {
  background-color: $primary-color;
}
```



## 2. 嵌套规则

```scss
.container {
  width: 100%;
  
  .box {
    padding: 10px;
  }
  &:after {
    content: ""
  }
  // 嵌套属性
  border: 1px solid #aaa {
    	left: 0;
    	right: 0;
    }
}
```



## 3. 混合

`@mixin`、`@include`

```scss
@mixin border-radius($radius) {
  border-radius: $radius;
}
.button {
  @include border-radius(5px);
}
```



## 4. 继承

`@extend`

```scss
.error {
  border: 1px solid #ff0000;
  color: #ff0000;
}

.fatal-error {
  @extend .error;
  font-weight: bold;
}
```



## 5. 运算

Sass支持数学运算，可以在样式表中进行计算。

```scss
.container {
  width: 100% / 3;
}
```



## 6. 导入

使用 `@import` 关键字可以将多个Sass文件组合在一起。

```scss
@import "reset";
@import "base";
```



## 7. 条件语句

```scss
$theme: dark;

.button {
  @if $theme == dark {
    background-color: #333;
    color: #fff;
  } @else {
    background-color: #fff;
    color: #333;
  }
}
```

