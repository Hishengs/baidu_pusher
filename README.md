# baidu_pusher
nodejs sdk of baidu push service 百度消息推送Node.js SDK

#### 函数调用形式
example: queryTagDevicesNum(params,successCallback,errCallback)
params(可选参数): json对象 => {...,method:'post'}, 可指定method为GET或者POST请求, 百度消息推送API全部支持POST, 只有部分支持GET请求, 故建议使用POST请求(默认为POST,可忽略method参数), ...为其他参数, 和[百度REST API文档](http://push.baidu.com/doc/restapi/restapi)的参数一致
successCallback(必须参数): 请求成功的回调函数 => function(res){ // do something here }
successCallback(可选参数): 请求失败的回调函数 => function(err){ // do something here }

#### 测试
1. 编辑pushman.js, 将apiKey和secretKey替换成你的百度推送相应的值
2. 进入test目录, 命令行下直接执行 test 命令
3. 打开test/log.txt 查看执行结果