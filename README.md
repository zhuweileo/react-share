# 前言

前一段时间利用空闲时间学习了一下**vue组件的封装**，也在工作中进行了实践，将公司常用的一个api抽象成了vue组件，并发布在npm上。之前觉得组件的封装是一件很困难的事情，通过亲身体验之后，发现确实有很多需要注意的地方，但是当自己真正走完了这个过程之后，回头看的时候，其实也不过如此。真正困难的其实不是组件封装的**流程与步骤**，而是组件的实现思想。但是，对于没有进行过组件封装的同学来说，流程和步骤确实也存在着许多坑，但是一旦你趟过去之后，就会非常轻松。

我的学习渠道主要来源于两个地方，一个是vue官方文档cookbook中一篇介绍[组件封装的文章](https://vuejs.org/v2/cookbook/packaging-sfc-for-npm.html)，另一个是饥人谷的一门课程。

我将通过一系列文章去讲一下整个组件封装的过程中我是如何做的，文章会围绕一个简易组件的封装过程去写，这个组件并不具有实际用处，只是一个demo。希望通过几篇文章，给那些想自己封装组件的同学做一个参考。

## demo地址

https://github.com/zhuweileo/vue-component-demo

## 需求分析

我们的需求如下：

- 写一个button.vue组件

  ps：由于是为了学习封装步骤，所以这里button组件的功能十分简单。

- 将组件发布至npm

  按说单元测试应该在发布之前进行，但是单元测试比较复杂，为了快点得到成就感，所以先走简单的流程。

- 对组件进行单元测试

## 步骤

[1.使用webpack打包组件](#1.使用webpack打包组件)

[2.发布到npm](#2.发布到npm)

[3.单元测试](#3.单元测试)

---

# 1.使用webpack打包组件

## 为什么要打包

可能你会问为什么要对.vue文件进行打包，直接引用.vue文件不可以么？当然可以，但是前提是用户有自己的打包工具可以处理.vue文件，如果用户没有打包工具，你的组件是不是就不能用了呢！

不打包，你只能这么用

```js
import MyComponent from 'my-component';

export default {
  components: {
    MyComponent,
  },
  // rest of the component
}
```

打包后，你还可以这么用

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
<div id="app">
  {{text}}
  <m-button>nio</m-button>
</div>

<script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script>
<script src="../dist/index.js"></script>
<script>
  console.log(MyComponent);
  const {MButton} = MyComponent;
  const app = new Vue({
    el:'#app',
    data:{
      text: 'hello vue!',
    },
    components:{
      'm-button':MButton,
    }
  })
</script>
</body>
</html>
```



组件的封装肯定离不开打包工具，打包工具大家最熟悉的一定非webpack莫属了。其实，在vue官方文档中的cookbook中，文章的作者推荐使用的 打包工具是[Rollup](https://rollupjs.org/guide/en)，并附有详细的配置文件，但是我之前对Rollup不熟悉，就没有用，有兴趣的同学可以自己尝试。

## webpack版本及文件具体内容

webpack版本：4.17.1 （比较新的版本）

webpack.config.js

```js
var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
var webpack = require('webpack')

module.exports = {
    entry: {
        'index': './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        library: 'MyComponent',
        libraryTarget: 'umd'
    },
    devtool: '#eval-source-map',
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.vue']
    },
    mode: 'production',
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        "env": {
                            "test": {
                                "plugins": ["istanbul"]
                            }
                        }
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

```

## webpack配置文件详解

### 入口文件

```
    entry: {
        'index': './src/index.js'
    },
```

入口文件配置比较简单，关键在于入口文件的内容。



index.js

```js
export {default as MButton}  from './MButton.vue'
```

入口文件的意思就是将`MButton.vue`文件中的默认导出值，重命名为MButton然后再导出。

（对于export语法不理解的同学，推荐查看[阮一峰的es6相关教程](http://es6.ruanyifeng.com/#docs/module#export-%E5%91%BD%E4%BB%A4)）

### 输出配置

```
    output: {
        path: path.resolve(__dirname, './dist'), //输出目录
        filename: '[name].js', //输出文件名
        library: 'MyComponent', //输出的全局变量名称
        libraryTarget: 'umd'，//输出规范为umd
    },
```

前两行配置不解释，解释下后两行

- `library: 'MyComponent'`

  `MyCompoent`是一个全局变量名称（你自定义），当用户直接通过script标签引用你的组件的时候，这个将作为你的组件的命名空间，你的组件的内容会挂载到该全局变量上面，作为它的一个属性,类似于你使用jquery的时候，会有一个全局的`$`或`jquery`供你引用。

- `libraryTarget: 'umd'，`

  使用**umd**（通用模块规范）打包你的模块。umd兼容amd以及cmd模式，并且会导出一个全局变量。这样使打包后的模块可以使用各种规范引用，增强模块的通用性。

  引用webpack官网的解释：

  > `libraryTarget: 'umd'` - This exposes your library under all the module definitions, allowing it to work with CommonJS, AMD and as global variable. Take a look at the [UMD Repository](https://github.com/umdjs/umd) to learn more.
  >
  > 这么设置可以让你的库适应所有的模块标准，允许别人通过CommonJS、AMD和全局变量的形式去使用它。

  具体什么是umd、amd、cmd大家自行百度吧。

### 模式

```js
mode: 'production'
```

webpack4 新增的配置参数，意为webpack将认为该打包是为了生产环境，会将一些默认配置设置为生产环境所需要的，例如默认进行代码压缩。

### rules

这里是重点，有三个规则

1. 使用babel处理js，这样你就可以在vue单文件组件中的`script`标签内放心使用es6语法

   ```
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use:{
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                "env": {
                    "test": {
                        "plugins": ["istanbul"]
                    }
                }
            }
        }
    },
   ```

2. 使用vue-loader处理.vue文件。在webpack中每一种文件的处理都需要对应的loader，就像css需要css-loader，js文件需要babel-loader，vue文件也不例外。其实vue-loader就是将你写的单文件组件内的三个标签，转化为原生的js，具体原理查看[官方文档](https://vue-loader.vuejs.org/)。

   ```
    {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/
    },
   ```

3. 使用css-loader处理和vue-style-loader处理单文件组件内`style`便签内的css样式

   ```
    {
        test: /\.css$/,
        use: [
            'vue-style-loader',
            'css-loader'
        ]
    }
   ```

### 使用vue-loader插件

官方说必须使用VueLoaderPlugin配合vue-loader使用，具体为什么我也不清楚。

```
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin()
  ]
```



这就是所有的webpack配置，其实还是挺简单的。

---

# 2. 发布到npm上

## 修改你的`package.json`文件

```json
   {
   	  ...
   	  
         "name": "vue-component-demo",//你的组件的名字
         "version": "0.0.1",//当前版本号
         "description": "vue component demo",//描述
         "main": "dist/index.js",//入口文件
         
         ...
   }
```

- 入口参数`"main": "dist/index.js"`，指向的就是我们之前打包好的文件。

  这样当用户向下面这样引入你的组件的时候，打包工具就会直接去`"main": "dist/index.js"`找文件。

  ```js
  import {button} from 'vue-component-demo'
  ```

- `name`参数不能和npm上已有的组件名相同，否则发布的时候会报错，如果不幸有人用了这个组件名，你就需要修改一下，再重复这个流程重新发布就好了。



## 登录npm（需要提前注册一个npm账号）

```shell
   /vue-component-demo (master)
   $ npm adduser
   Username: 
   Password:
   Email: (this IS public) 
```

## 发布组件

```
   /vue-component-demo (master)
   $ npm publish
```

   至此，你的组件就已经发布到npm上了，别人就可以通过npm 安装你的组件，然后使用。

```
   npm install vue-component-demo
```

## 更新组件

   以上是我们发布的第一个版本，如果之后你有修复组件中的bug，或者增强了组件的功能，你就要更新组件，更新组件也很简单。

- 更新package.json中的` version`参数，不能和之前的版本号重复，否则发布不成功。
- 再执行一次`npm publish`

---

# 3.单元测试

## 为什么单元测试

单元测试的目的是为了保证组件的的**质量**（可靠性），毕竟写组件是为了让更多的人使用，发布完之后出现一堆bug总是不好的。单元测试，可以让你每次你修改组件之后，及时发现是否存在bug，保证每次发布的代码存在较少的bug。

## 单元测试工具

- karma：启动测试流程

  官网：http://karma-runner.github.io/latest/index.html

- mocha：划分测试模块

  官网：https://mochajs.org/

- chai：测试断言库

  官网：https://www.chaijs.com/

- vue-test-utils：辅助测试vue组件

  官网：https://vue-test-utils.vuejs.org/zh/guides/

## 安装工具

安装主要的工具

```
npm install karma mocha chai @vue/test-utils 
```

karma 配合chai,mocha等工具时，需要安装对应的一系列**插件**，插件比较多没有都写出来，具体参考[package.json](https://github.com/zhuweileo/vue-component-demo/blob/master/package.json)

```
npm install karma-chai karma-mocha karma-webpack karma-sourcemap-loader...
```

## karma配置

```js
//引入打包用的webpack配置
var webpackConfig = require('./webpack.config.js')

module.exports = function (config) {
    config.set({
        //引入需要使用的工具
        frameworks: ['mocha','sinon-chai','chai-dom','chai',],
        /*
         这个参数决定哪些文件会被放入测试页面，哪些文件的变动会被karma监听，以及以服务的形
         式供给
         */
        files: [
            'test/**/*.spec.js'
        ],
		//测试文件会使用webpack进行预处理
        preprocessors: {
            '**/*.spec.js': ['webpack', 'sourcemap']
        },
		//预处理时webpack的配置
        webpack: webpackConfig,
        //使用哪些工具进行测试报告
        reporters: ['spec','coverage'],
		//通过哪些浏览器进行测试
        browsers: ['Chrome']
    })
}
```

## 写测试用例

[/test/button.spec.js](https://github.com/zhuweileo/vue-component-demo/blob/master/test/button.spec.js)

```js
import MButton from '../src/MButton'
import {mount} from "@vue/test-utils";
import Syn from 'syn'

describe('MButton.vue',function () {

  it('can set type prop',function () {
    const wrapper = mount(MButton,{
      propsData:{
        type: 'warn',
      }
    });
    const vm = wrapper.vm;
    expect(vm.$el.classList.contains('warn')).to.be.true
  })

  it('can click',function (done) {
    const click = sinon.spy();
    const haha = sinon.spy();
    const wrapper = mount(MButton,{
      propsData:{
        type: 'warn',
      },
      listeners:{
        click,
      }
    });

    Syn.click(wrapper.vm.$el,function () {
      sinon.assert.calledWith(click);
      done();
    });
  })

});
```

### describe,it函数

测试用例中的这两个函数是 mocha 库中提供的

- 为什么没有import，就可以直接使用？
  还记得karma配置文件中的`frameworks: ['mocha','sinon-chai','chai-dom','chai',]`吗？
- 这两个函数有什么用？
  为你的测试用例划分区块，一个`describe`是一个大区块，一个`it`是一个小区块，两个函数的第一个参数是对于区块的描述，第二个参数是一个回调函数，指定区块的具体测试内容。

### mount函数

mount函数是`@vue/test-utils`库中的函数

- 有什么用？

  mount的作用是装载（运行）你的vue组件，相当于如下代码。

  ```js
  const constructor =  Vue.extend(MButton)
  new constructor().$mount()
  ```

  只有将你的组件运行起来，才可以测试其功能是否正确。

- @vue/test-utils是什么？

  是vue组件测试辅助库，使用细节查看[@vue/test-utils](https://vue-test-utils.vuejs.org/zh/guides/)

### expect函数

expect函数来源于chai

- 有什么用？

  expect期待一个结果 。

  ```js
  //期待button组件的 dom元素的classList中包含warn是真的
  expect(vm.$el.classList.contains('warn')).to.be.true  
  ```

- to,be有什么用？

  没有任何实质性意义，是为了让代码看起来更像一个句子，增强可读性

### sinon

- 有什么用

  可以用来测试事件是否被触发

  ```js
  //声明一个间谍函数
  const click = sinon.spy();
  
  const wrapper = mount(MButton,{
    propsData:{
      type: 'warn',
    },
    //这里参看  mount 函数的介绍
    listeners:{
      click, //把间谍函数作为click事件的回调函数
    }
  });
  ```

### syn

- 用什么用

  模拟用户的交互动作（点击、拖拽等）

  ```js
  //模拟click事件，然后期待sinon生成的click函数被调用
  Syn.click(wrapper.vm.$el,function () {
     sinon.assert.calledWith(click);
     done();
  });
  
  
  ```

  

## 运行测试用例

在package.json中加入如下代码
[package.json](https://github.com/zhuweileo/vue-component-demo/blob/master/package.json)

```json
 "scripts": {
    "test": "cross-env BABEL_ENV=test karma start --single-run=false", 
    ...
  },
```

当执行以上脚本之后，karma会自动打开一个浏览器窗口，将测试用例都执行一遍，并告诉你哪个测试通过了，哪个没有通过。如果有测试用例没通过，你就应该检查是你的代码有问题，还是测试用例编写的不正确，并修复问题，直到所有测试用例都通过，之后你就可以发布你的代码了。

