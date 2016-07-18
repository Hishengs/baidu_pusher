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

//-------- test pushman methods --------------
var pushman = require('../pushman.js')

if(pushman.apikey == '' || pushman.secretKey == ''){console.log("please check if your apikey and secretKey existed in pushman.js !");process.exit()}

var test_channel_id = '3536468281854857700'
pushman.toSigleDevice({msg:'a test msg from pushman',channel_id: test_channel_id},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.toSigleDevice result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.toSigleDevice failed ---------------\n')
})

pushman.toAll({msg:'a test msg from pushman'},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.toAll result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.toAll failed ---------------\n')
})

pushman.toTag({msg:'a test msg from pushman',type: 1, tag: 'xxx', method:'post'},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.toTag result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.toTag failed ---------------\n')
})

var test_channel_ids = '';
pushman.toBatchDevice({msg:'a test msg from pushman',channel_ids: test_channel_ids},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.toBatchDevice result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.toBatchDevice failed ---------------\n')
})

var msg_id = '2134821599873666515';
pushman.queryMsgStatus({msg_id:msg_id},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.queryMsgStatus result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.queryMsgStatus failed ---------------\n')
})

var timer_id = '123';
pushman.queryTimerRecords({timer_id:timer_id},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.queryTimerRecords result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.queryTimerRecords failed ---------------\n')
})

var topic_id = '123';
pushman.queryTopicRecords({topic_id:topic_id},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.queryTopicRecords result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.queryTopicRecords failed ---------------\n')
})

pushman.queryTags(function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.queryTags result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.queryTags failed ---------------\n')
})

var tag = 'pushman';
pushman.createTag({tag:tag},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.createTag result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.createTag failed ---------------\n')
})

var tag = 'pushman';
pushman.delTag({tag:tag},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.delTag result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.delTag failed ---------------\n')
})

var tag = 'pushman',channel_ids = '';
pushman.addDevicesToTag({tag:tag,channel_ids:channel_ids},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.addDevicesToTag result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.addDevicesToTag failed ---------------\n')
})

var tag = 'pushman',channel_ids = '';
pushman.delDevicesFromTag({tag:tag,channel_ids:channel_ids},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.delDevicesFromTag result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.delDevicesFromTag failed ---------------\n')
})

var tag = 'xxx'
pushman.queryTagDevicesNum({tag:tag},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.queryTagDevicesNum result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.queryTagDevicesNum failed ---------------\n')
})

pushman.queryTimerList(function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.queryTimerList result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.queryTimerList failed ---------------\n')
})

var timer_id = '123'
pushman.cancelTimer({timer_id:timer_id},function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.cancelTimer result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.cancelTimer failed ---------------\n')
})

pushman.queryTopicList(function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.queryTopicList result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.queryTopicList failed ---------------\n')
})

pushman.deviceStatisticReport(function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.deviceStatisticReport result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.deviceStatisticReport failed ---------------\n')
})

pushman.deviceStatisticReport(function(res){
	var body = ""
	res.setEncoding('utf8')
	res.on('data',function(chunk){
		console.log('\n--------------- pushman.deviceStatisticReport result ---------------')
		console.log(JSON.stringify(chunk))
		body += chunk
	})
},function(err){
	console.log('--------------- pushman.topicStatisticReport failed ---------------\n')
})