var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var serveStatic = require("serve-static");
var http = require("http"),
 url = require("url"),
 superagent = require("superagent"), //类似浏览器模拟器模块
 cheerio = require("cheerio"), //抓取模块
 async = require("async"), //异步处理
fs = require('fs'), //文件
 eventproxy = require('eventproxy');//控制并发模块
var ep = new eventproxy();
var server2 = new http.Server();

var path = require("path");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(serveStatic(__dirname+'/jquery.js'));
app.use('/static',express.static(path.join(__dirname, '/page/static')));

// #region创建当天的文件夹
var jsonFile = './json',
startDate = new Date();
if (!fs.existsSync(jsonFile))
{
    fs.mkdirSync(jsonFile, 0777); //创建json文件夹
    console.log(jsonFile + '文件夹已成功创建！');
}

var date_file = jsonFile + '/' + startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+ startDate.getDate();//添加当天的文件夹
var jsonFileName = '';
function jsonFileNameFun() {
  return '/detials-'+startDate.getHours()+'.json';
}

if (!fs.existsSync(date_file))
{
    fs.mkdirSync(date_file, 0777); //创建当前日期文件夹
    console.log(date_file + '文件夹已成功创建！');
}
if (!fs.existsSync(jsonFileNameFun()))
{ 
    jsonFileName = date_file + jsonFileNameFun();
    fs.writeFileSync(jsonFileName,JSON.stringify({}));
    console.log(date_file + 'json文件已成功创建！');
}


var detailData = {};
fs.readFile(__dirname+"/detail.json",'utf8',function (err, data) {
        if(err) console.log(err);
        detailData=JSON.parse(data);
});

app.get('/',function (req, res) {
	 res.sendfile(__dirname+'/page/index.html'); 
})


app.get('/data.json',function (req, res) {
	 res.send(detailData); 
})
app.get('/imgUrl',function (req, res) {
   res.send(getFiles.getImageFiles(__dirname+"/page/static/img/")); 
})
// var sdadaa =JSON.stringify({"a":"ssdsd"});


function getNewData() {
  fs.readFile(jsonFileName,'utf8',function (err, data) {
          if(err) console.log(err);
          detailData=JSON.parse(data);
  });
}
// fs.writeFileSync(__dirname + '/detail.json', sdadaa);

// console.log(__dirname + '/detail.json'+'数据写入成功' );
function arrDel(arr,index) {
  var newArr=[];
  for(var i=0;i<arr.length; i++){
    if( i!= index){
       console.log(i!= index)
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
var obj = {};
app.post('/form', function (req, res) {
  // console.log( req.body);
  // var _str = JSON.stringify(req.body);
  if( req.body.type == 'del'){
     console.log("shanchu")
    detailData.case[req.body.case] = arrDel(detailData.case[req.body.case] ,req.body.list);
    fs.writeFileSync(jsonFileName, JSON.stringify(detailData));
    fs.writeFileSync(__dirname+"/detail.json", JSON.stringify(detailData));
    getNewData();
    res.status(200).send({state:2}).end();
  }else{
    obj.title = req.body.title;
    obj.date = req.body.date;
    obj.intro = req.body.intro;
    obj.img_url = req.body.img_url;
    obj.timer = req.body.timer;
    obj.text = req.body.text;

    console.log(req.body);

    detailData.case[req.body.case][req.body.list]=obj;

    fs.writeFileSync(jsonFileName, JSON.stringify(detailData));
  	fs.writeFileSync(__dirname+"/detail.json", JSON.stringify(detailData));
    getNewData();
    res.status(200).send({state:1}).end();
  }
})


// var login = function(req, res) {  
//     var info ='';  
//     console.log(3333)
//     req.addListener('data', function(chunk){  
//         info += chunk;  
//      })  
//     .addListener('end', function(){  
//         info = querystring.parse(info);  
//         if(info.name == 'a' && info.pwd =='1'){  
//             res.end('login success ' + info.name);  
//         }else{  
//             res.end('login failed ' + info.name);  
//         }  
//      })  
// }  
// var requestFunction = function (req, res){  
//     console.log(000) 
//     if(req.url == '/form'){ 
//     console.log(1111) 
//         if (req.method != 'POST'){  
//     console.log(222) 
//             return;  
//         }  
//         return login(req, res)
//     }   
// }  

// server2.on('request',requestFunction);  
// http.createServer(function(req,res){
//     console.log("0000") 
// 	if(req.url == '/form'){ 
// 	    console.log(1111) 
//         if (req.method != 'POST'){  
// 		    console.log(2222) 
//             return;  
//         }  
//         return login(req, res)
//     }   
//     // res.writeHead(404,{'Content-Type':'text/plain'})
//     // res.write("we are is content");
//     // res.end("fdsa");

// }).listen(3000);

// 监听端口
var server = app.listen(3000, function (req, res) {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);

});


//引用文件系统模块
//引用imageinfo模块
var image = require("imageinfo");

function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
        //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {

            var obj = {};//定义一个对象存放文件的路径和名字
            obj.path = path;//路径
            obj.filename = itm//名字
            filesList.push(obj);
        }

    })

}
var getFiles = {
//获取文件夹下的所有文件
    getFileList: function (path) {
        var filesList = [];
        readFileList(path, filesList);
        return filesList;
    },
    //获取文件夹下的所有图片
    getImageFiles: function (path) {
        var imageList = [];

        this.getFileList(path).forEach((item) => {
            var ms = image(fs.readFileSync(item.path + item.filename));

            ms.mimeType && (imageList.push(item.filename))
        });
        return imageList;

    }
};

//获取文件夹下的所有图片
console.log();
//获取文件夹下的所有文件
// getFiles.getFileList("./public/");