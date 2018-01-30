# mgo-H5 项目汇合

## 说明：

> 因为H5页面比较多，所以每写一个就的创建一个项目比较麻烦，所以集中放到这个项目里面。但是得注意 开发不同模块的h5时，要用对应的gulpfile.js。（目前只有三个模块，Activity,Station,Protal，响应的gulpfile.js文件都放到了A_xxx文件里）


``` bash
如何让项目跑起来？

1. 首先开启本地服务
    npm start

2. 如果想用less预编译来写样式，那么就需要开起 less监听（开起以后，less文件一旦有变化就会生成对应的css文件，html文件只需要引用对应的css文件即可，因为监听输出的路径是已经设置好了的，所以不能随便找个地方写less，）
    gulp less

3. 如果想用用手机查看效果，那么就需要手机和电脑都处于同一网络环境，并且将localhost 换成你对应的 ip地址即可

4. 服务跑起来以后如何查看对应的页面效果？
    eg: 查看Station模块的效果=> http://localhost:3001/src/views/Station/xxx.html
        手机也想查看的话 => 将localhost换成电脑和手机同处一个网络下的ip地址即可

```

``` bash
// command + shift + v （markdown预览模式）
