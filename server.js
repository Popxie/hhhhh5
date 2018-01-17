/**
 * created by xiehuaqiang
 */
const express = require("express");
const app = express();
app.use("/dist", express.static(__dirname + "/src"));
let port = 3001;
app.listen(port);
console.log('port = ' + port);
console.log('http://192.168.1.16:3001/dist/views/Station/stationsList.html');
console.log('http://localhost:3001/dist/views/Station/stationsList.html');



// app.use("/dist", express.static(__dirname + "/views"));
// 1、"/dist": 将localhost:3001后加上 /dist
// 2、__dirname + "/views": 要想访问哪个页面就需要从 /views文件（不包含views）开始往下写 （views文件下有个xxx.html）
// 3、将1，2 综合起来就是：服务搭建以后要想通过本服务访问页面效果格式如下：http://localhost:3002/dist/xxx.html
//     如果不设置"/dist"的话 就可以直接这样写了 http://localhost:3001/dist/views/xxxx/yy/zzz.html


// 可以参考下：http://www.cnblogs.com/A-dam/p/5053299.html
