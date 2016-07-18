/*
* 百度消息推送 Node SDK, by Hisheng, version 1.0.0
*/
var $http = require('./http.js'), querystring = require('querystring'), crypto = require('crypto')
module.exports = {
	apiKey: '',
	secretKey: '',
	//HTTP请求Header
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
		'User-Agent': 'BCCS_SDK/3.0 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.80 Safari/537.36 Core/1.47.516.400 QQBrowser/9.4.8188.400',
	},
	//请求的url前缀
	urlPrefix: "http://api.tuisong.baidu.com/rest/3.0/",
	//生成当前时间戳
	getCurrentTimestamp: function(){
		return parseInt(new Date().getTime().toString().substring(0,10))
		//return Math.round(new Date().getTime()/1000)
	},
	//获取默认的公共请求参数
	//apikey + timestamp + sign + expires(optional) + device_type(optional)
	//这里的timestamp要和createSingKey的timestamp保持一致
	getDefaultPublicParamsString: function(sign,timestamp){
		var options = arguments[0]?arguments[0]:{}
		var str = "apikey="+this.apiKey+"&timestamp="+timestamp+"&sign="+sign
		str = options.expires?str+"&expires="+options.expires:str
		str = options.device_type?str+"&device_type="+options.device_type:str
		return str
	},
	//添加额外参数到url
	appendExtraParamsToUrl: function(url,params){
		for(var key in params){
			url += "&"+key+"="+params[key]
		}
		return url
	},
	/**
	* 生成请求签名
	* 详见: http://push.baidu.com/doc/restapi/sdk_developer
	* @param {string} method, 请求方法类型
	* @param {string} baseUrl, 请求url, 不包括query_string部分
	* @param {string} secretKey 开发者中心的SK
	* @return {object} params 包括get和post的请求参数
	* @example params = {get:"key=value&key2=value2",post:{key1:value1,key2:value2}}
	*/
	createSignKey: function(method, baseUrl, timestamp, params){
		var signString = method.toUpperCase()+baseUrl
    var paramsGet = params.get?querystring.parse(params.get):{}
    var paramsPost = params.post?params.post:{}
    var params = {}
    params['apikey'] = this.apiKey
    params['timestamp'] = timestamp

    for(var key in paramsGet){
    	params[key] = paramsGet[key]
    }
    for(var key in paramsPost){
    	params[key] = paramsPost[key]
    }

    var keys = Object.keys(params).sort()
    keys.forEach(function (key) {
        signString += key+"="+params[key]
    })
    signString += this.secretKey
    /*console.log("参与签名的字符串 => \n")
    console.log(signString)*/
    var md5 = crypto.createHash('md5')
    signString = this.urlencode(signString)
    md5.update(signString)

    return md5.digest('hex')
	},
	//兼容php的urlencode
	urlencode: function (str) {
    var rv = encodeURIComponent(str).replace(/[!'()*~]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase()
    })
    return rv.replace(/\%20/g,'+')
	},
	//支持args,successCallback,errorCallback
	splitArgs: function(arguments){
		if(Object.prototype.toString.call(arguments[0]).slice(8,-1) == 'Object')
			return {args:arguments[0],sCallback:arguments[1],eCallback:arguments[2]}
		else return {args:{},sCallback:arguments[0],eCallback:arguments[1]}
	},
	//发送请求
	sendRequest: function(path,arguments){
		var splitArgs = this.splitArgs(arguments)
		var method = splitArgs.args.method?splitArgs.args.method.toLowerCase():'post' //默认POST请求方法
		delete splitArgs.args.method
		var timestamp = this.getCurrentTimestamp()
		//生成signKey
		var params = {post: splitArgs.args}
		var signKey = this.createSignKey(method, this.urlPrefix+path, timestamp, params)
		if(method == 'get'){
			var url = this.appendExtraParamsToUrl((this.urlPrefix+path+'?'+this.getDefaultPublicParamsString(signKey,timestamp)),splitArgs.args)//构造请求url
			$http.get(url,{headers:this.headers},splitArgs.sCallback)
			console.log('url => get,'+url)
		}else { //POST 请求
			splitArgs.args.apikey = this.apiKey,splitArgs.args.sign = signKey,splitArgs.args.timestamp = timestamp
			$http.post(this.urlPrefix+path,splitArgs.args,{headers:this.headers},splitArgs.sCallback)
			console.log('url => post,'+this.urlPrefix+path)
		}
	},
	//RESTFUL API, 统一格式: [GET|POST] http[s]://api.tuisong.baidu.com/rest/3.0/{class}/{method}?{query_string}
	/*
	* {query_string}由通用参数部分和具体API调用参数部分组成。
	* {query_string}中的key/value对都必须经过urlencode处理，且必须是UTF-8编码。
	* 对于GET请求，{query_string}必须放在QUERY参数中传递，即放在“?”后面。
	* 对于POST请求，{query_string}放在POST参数中传递。
	* 目前查询接口同时支持POST和GET方式，非查询接口仅支持POST方式。
	* 每次API请求都要附上自定义的头部 this.httpHeader
	*/
	//推送消息到单台设备
	toSigleDevice: function(){
		this.sendRequest("push/single_device",arguments)
	},
	//广播消息
	toAll: function(){
		this.sendRequest("push/all",arguments)
	},
	//推送消息给指定的标签
	toTag: function(){
		this.sendRequest("push/tags",arguments)
	},
	//推送消息到给定的一组设备(批量单播)
	toBatchDevice: function(){
		this.sendRequest("push/batch_device",arguments)
	},
	//查询消息的发送状态
	queryMsgStatus: function(){
		this.sendRequest("report/query_msg_status",arguments)
	},
	//查询定时消息的发送记录
	queryTimerRecords: function(){
		this.sendRequest("report/query_timer_records",arguments)
	},
	//查询指定分类主题的发送记录
	queryTopicRecords: function(topic_id){
		this.sendRequest("report/query_topic_records",arguments)
	},
	//查询标签组列表
	queryTags: function(){
		this.sendRequest("app/query_tags",arguments)
	},
	//创建标签
	createTag: function(){
		this.sendRequest("app/create_tag",arguments)
	},
	//删除标签
	delTag: function(){
		this.sendRequest("app/del_tag",arguments)
	},
	//添加设备到标签组
	addDevicesToTag: function(){
		this.sendRequest("tag/add_devices",arguments)
	},
	//将设备从标签组中移除
	delDevicesFromTag: function(){
		this.sendRequest("tag/del_devices",arguments)
	},
	//查询标签组设备数量
	queryTagDevicesNum: function(){
		this.sendRequest("report/device_num",arguments)
	},
	//查询定时任务列表
	queryTimerList: function(){
		this.sendRequest("timer/query_list",arguments)
	},
	//取消定时任务
	cancelTimer: function(){
		this.sendRequest("timer/cancel",arguments)
	},
	//查询分类主题列表
	queryTopicList: function(){
		this.sendRequest("topic/query_list",arguments)
	},
	//当前设备的统计信息
	deviceStatisticReport: function(){
		this.sendRequest("report/statistic_device",arguments)
	},
	//查询分类主题统计信息
	topicStatisticReport: function(){
		this.sendRequest("report/statistic_topic",arguments)
	}
}
