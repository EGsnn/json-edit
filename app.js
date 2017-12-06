var coors = {};
    coors.left_top = {};
    coors.right_top = {};
    coors.left_bottom = {};
    coors.right_bottom = {};
//填充coors中内容
var filename = __dirname+"adb.json";
 fs.writeFileSync(filename, JSON.stringify(coors));
 //对象嵌套
 var fs = require('fs');
var fileDirectory = "D:\\column";
var newfileDirectory = "d:\\new";
if (fs.existsSync(fileDirectory)) {
    var files = fs.readdirSync(fileDirectory);

    for (var i = 0; i < files.length; i++) {

        var filePath = fileDirectory + "/" + files[i];
        var newfilepath = newfileDirectory + "/" + files[i]
        var filestr = JSON.parse(fs.readFileSync(filePath));
        for (var item in filestr) {
            var  inter=filestr[item];
             for(var m in inter)
             {
                inter[m]=parseFloat(inter[m]);

             }
            fs.writeFileSync(newfilepath, JSON.stringify(filestr));
        }

    }
} else {
    console.log(fileDirectory + "  Not Found!");
}