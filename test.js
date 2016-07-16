//-------- test create sign key --------------
/*var pushman = require('./pushman.js')
var baseUrl = 'http://api.tuisong.baidu.com/rest/3.0/test/echo'
var secretKey = 'bEBAoxcjE1GAsM1fDDRxrtyq'
var method = 'post'
var params = {
	post:{
		secret_key: '87772555E1C16715EBA5C85341684C58',
		apikey:'Ljc710pzAa99GULCo8y48NvB',
		expires:'1313293565',
		timestamp:'1427180905'
	}
}

console.log('The created sign key is : \n')
console.log(pushman.createSign(method,baseUrl,secretKey,params))*/

//-------- test http request --------------
/*var $http = require('./http.js')
var url = 'http://api.tuisong.baidu.com/rest/3.0/test/echo'
$http.get(url,{},function(res){
	console.log('STATUS: ' + res.statusCode)
	console.log('HEADERS: ' + JSON.stringify(res.headers))
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		body += chunk
	})
	console.log(body)
},function(err){})*/


var pushman = require('./pushman.js')
pushman.queryTags({tag:'xxx',method:'post'})