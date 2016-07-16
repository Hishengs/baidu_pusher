/*
* 百度消息推送 Node SDK, by Hisheng, version 1.0.0
*/
var $http = require('./http.js'), querystring = require('querystring'), crypto = require('crypto')
module.exports = {
	apiKey: 'xxx',
	secretKey: 'xxx',
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
    console.log("参与签名的字符串 => \n")
    console.log(signString)
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
	splitArgs: function(arguments){
		//支持args,successCallback,errorCallback
		if(Object.prototype.toString.call(arguments[0]).slice(8,-1) == 'Object')
			return {args:arguments[0],sCallback:arguments[1],eCallback:arguments[2]}
		else return {args:{},sCallback:arguments[0],eCallback:arguments[1]}
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
	toSigleDevice: function(channel_id,msg){
		var options = arguments[0]?arguments[0]:{}
		var url = this.urlPrefix+"push/single_device?channel_id="+channel_id+"&msg="+msg
		url = this.appendExtraParamsToUrl(url,options)
		//发起请求
	},
	//广播消息
	toAll: function(msg){
		var options = arguments[0]?arguments[0]:{}
		var url = this.urlPrefix+"push/all?msg="+msg
		url = this.appendExtraParamsToUrl(url,options)
	},
	//推送消息给指定的标签
	toTag: function(type,tag,msg){
		var options = arguments[0]?arguments[0]:{}
		var url = this.urlPrefix+"push/tags?type="+type+"&tag="+tag+"&msg="+msg
		url = this.appendExtraParamsToUrl(url,options)
	},
	//推送消息到给定的一组设备(批量单播)
	toBatchDevice: function(channel_ids,msg){
		var options = arguments[0]?arguments[0]:{}
		var url = this.urlPrefix+"push/batch_device?channel_ids="+channel_ids+"&msg="+msg
		url = this.appendExtraParamsToUrl(url,options)
	},
	//查询消息的发送状态
	queryMsgStatus: function(msg_id){
		var url = this.urlPrefix+"report/query_msg_status?msg_id="+msg_id
	},
	//查询定时消息的发送记录
	queryTimerRecords: function(timer_id){
		var options = arguments[0]?arguments[0]:{}
		var url = this.urlPrefix+"report/query_timer_records?timer_id="+timer_id
		url = this.appendExtraParamsToUrl(url,options)
	},
	//查询指定分类主题的发送记录
	queryTopicRecords: function(topic_id){
		var options = arguments[0]?arguments[0]:{}
		var url = this.urlPrefix+"report/query_topic_records?topic_id="+topic_id
		url = this.appendExtraParamsToUrl(url,options)
	},
	//查询标签组列表
	queryTags: function(){
		//支持args,successCallback,errorCallback
		/*if(Object.prototype.toString.call(arguments[0]).slice(8,-1) == 'Object'){
			var args = arguments[0]
			var sCallback = arguments[1]
			var eCallback = arguments[2]
		}else {
			var args = {}
			var sCallback = arguments[0]
			var eCallback = arguments[1]
		}*/
		var splitArgs = this.splitArgs(arguments)
		
		var timestamp = this.getCurrentTimestamp(),method = splitArgs.args.method?splitArgs.args.method.toLowerCase():'get';
		delete splitArgs.args.method
		//生成signKey
		var params = (method == 'post')?{post: splitArgs.args}:{get: querystring.stringify(splitArgs.args)}
		var signKey = this.createSignKey(method, this.urlPrefix+"app/query_tags", timestamp, params)
		//发送请求
		if(method == 'get'){
			var url = this.appendExtraParamsToUrl((this.urlPrefix+"app/query_tags?" + this.getDefaultPublicParamsString(signKey,timestamp)),splitArgs.args)//构造请求url
			$http.get(url,{headers:this.headers},splitArgs.sCallback)
		}else { //POST 请求
			splitArgs.args.apikey = this.apiKey,splitArgs.args.sign = signKey,splitArgs.args.timestamp = timestamp
			$http.post(this.urlPrefix+"app/query_tags",splitArgs.args,{headers:this.headers},splitArgs.sCallback)
		}
	},
	//创建标签
	createTag: function(){
		var splitArgs = this.splitArgs(arguments)
		
		var timestamp = this.getCurrentTimestamp()
		//生成signKey
		var params = {post: splitArgs.args}
		var signKey = this.createSignKey('post', this.urlPrefix+"app/create_tag", timestamp, params)
		//发送请求
		splitArgs.args.apikey = this.apiKey,splitArgs.args.sign = signKey,splitArgs.args.timestamp = timestamp
		$http.post(this.urlPrefix+"app/create_tag",splitArgs.args,{headers:this.headers},splitArgs.sCallback)
	},
	//删除标签
	delTag: function(){
		var splitArgs = this.splitArgs(arguments)
		
		var timestamp = this.getCurrentTimestamp()
		//生成signKey
		var params = {post: splitArgs.args}
		var signKey = this.createSignKey('post', this.urlPrefix+"app/del_tag", timestamp, params)
		//发送请求
		splitArgs.args.apikey = this.apiKey,splitArgs.args.sign = signKey,splitArgs.args.timestamp = timestamp
		$http.post(this.urlPrefix+"app/del_tag",splitArgs.args,{headers:this.headers},splitArgs.sCallback)
	},
	//添加设备到标签组
	addDevicesToTag: function(){
		var url = this.urlPrefix+"tag/add_devices?tag="+tag+"&channel_ids="+channel_ids
	},
	//将设备从标签组中移除
	delDevicesFromTag: function(tag,channel_ids){
		var url = this.urlPrefix+"tag/del_devices?tag="+tag+"&channel_ids="+channel_ids
	},
	//查询标签组设备数量
	queryTagDevicesNum: function(tag){
		var url = this.urlPrefix+"tag/device_num?tag="+tag
	},
	//查询定时任务列表
	queryTimerList: function(){
		var options = arguments[0]?arguments[0]:{}
		var url = this.urlPrefix+"timer/query_list?"
		url = this.appendExtraParamsToUrl(url,options)
	},
	//取消定时任务
	cancelTimer: function(timer_id){
		var url = this.urlPrefix+"timer/cancel?timer_id="+timer_id
	},
	//查询分类主题列表
	queryTopicList: function(){
		var options = arguments[0]?arguments[0]:{}
		var url = this.urlPrefix+"topic/query_list?"
		url = this.appendExtraParamsToUrl(url,options)
	},
	//当前设备的统计信息
	deviceStatisticReport: function(){
		var url = this.urlPrefix+"report/statistic_device"
	},
	//查询分类主题统计信息
	topicStatisticReport: function(topic_id){
		var url = this.urlPrefix+"report/statistic_topic?topic_id="+topic_id
	},
}