var http = require('http')

module.exports = {
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
	},
	splitUrl: function(url){
		var pattern = /^(?:(\w+):\/\/)?(?:(\w+):?(\w+)?@)?([^:\/\?#]+)(?::(\d+))?(\/[^\?#]+)?(?:\?([^#]+))?(?:#(\w+))?/
		var res = pattern.exec(url)
		return {
			originUrl: res[0],
			protocol: res[1] || 'http',
			user: res[2],
			password: res[3],
			host: res[4],
			port: res[5] || 80,
			path: res[6],
			query: res[7],
			anchor: res[8],
			baseUrl: (res[1]?res[1]:'') + "://" + (res[4]?res[4]:'') + (res[5]?res[5]:'') + (res[6]?res[6]:'')
		}
	},
	//(url,[{optionsObj},]callbkSucc,[callbkErr])
	get: function(url){
		var params = {}
		if(typeof arguments[1] == 'object'){
			var params = arguments[1]
			callback = arguments[2]
			var lastIndex = 3
		}else {callback = arguments[1];var lastIndex = 2;}
		//解析url,分离出host,path,port,query
		var urlArr = this.splitUrl(url)
		var options = {
		  hostname: urlArr.host,
		  port: urlArr.port?urlArr.port:80,
		  path: urlArr.path+"?"+urlArr.query,
		  method: 'GET',
		  headers: params.headers?params.headers:this.headers,
		  protocol: urlArr.protocol?urlArr.protocol+':':'http:'
		}
		/*console.log("request.get headers => \n")
		console.log(JSON.stringify(options.headers))*/
		var req = http.request(options,callback)
		if(arguments[lastIndex]){req.on('error',arguments[lastIndex]);}//如果传入error callback
		else req.on('error',this.errorCallback)
		req.end()
	},
	post: function(url,postData){
		var querystring = require('querystring')
		postData = querystring.stringify(postData)
		var params = {}
		if(typeof arguments[2] == 'object'){//传入可选参数
			var params = arguments[2]
			success_callback = arguments[3]
			var lastIndex = 4
		}else {success_callback = arguments[2];var lastIndex = 3;}
		var urlArr = this.splitUrl(url)
		var options = {
		  hostname: urlArr.host,
		  port: urlArr.port?urlArr.port:80,
		  path: urlArr.path,
		  method: 'POST',
		  headers: params.headers?params.headers:this.headers,
		  protocol: urlArr.protocol?urlArr.protocol+':':'http:'
		}
		options.headers['Content-Length'] = postData.length
		/*console.log("options.headers => ")
		console.log(options.headers)*/
		var req = http.request(options,success_callback)
		if(arguments[lastIndex]){req.on('error',arguments[lastIndex]);}//如果传入error callback
		else req.on('error',this.errorCallback)
		req.write(postData)
		/*console.log("postData =>")
		console.log(postData)*/
		req.end()
	},
	errorCallback: function(err){
		console.log('http request err => \n')
		console.log(err)
	}
}