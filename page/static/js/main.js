// 数据存取、更新
var dataObj = {
	data:null,
	case:null,
	list:null,
	getData:function () {
		return this.data.case[this.case][this.list];
	},
	setData:function (d) {
		this.data.case[this.case][this.list] = d;
	}
}
// ele 获取页面标签
var listData = {};
var _eleTitle = $(".title"),
_eleTime =$(".time"),
_eleIntro = $(".intro"),
_eleImg_url = $(".img_url"),
_eleWtext = $(".w-e-text");
var timer = new Date();


// 将最新的数据，渲染html上
function renderHtml() {
	clearHtml();
	listData = dataObj.getData();

	_eleTitle.val(listData.title);
	_eleTime.val(listData.date);
	_eleIntro.val(listData.intro);
	_eleImg_url.val(listData.img_url);
	_eleWtext.append(listData.text);
}


// 获取数据、加载入页面
window.onload =function () {
    function changeData() {
        $("#sel_02").text('');
        for(var i=0;i<dataObj.data['case'][dataObj.case].length;i++){
            $("#sel_02").append('<option value='+i+'>'+dataObj.data['case'][dataObj.case][i].title+'</option>')
        }
        renderHtml();
    }
    $.get("data.json", function(d){
        dataObj.data = d;
        // $(".data").text(JSON.stringify(data));
        for(var key in d['case']){
            $("#sel_01").append('<option value="">'+key+'</option>')
            if($("#sel_02 option").length == 0){
                dataObj.case = key;
                dataObj.list = 0;
                changeData(key);
            }
        }
    });
    $("#sel_01").change(function (e,n) {
        dataObj.case = $("#sel_01 option:selected").text();
        changeData();
        dataObj.list = 0;
        renderHtml();
    });
    $("#sel_02").change(function (e,n) {
    	dataObj.list = $("#sel_02 option:selected").val();
        renderHtml();
    });

    // 获取图片
    $.get("imgUrl", function(data){
        for(var key in data){
            $("#sel_03").append('<option value="">'+data[key]+'</option>')
        }
    });
    $("#sel_03").change(function (e,n) {
    	$(".previewImg").attr('src','/static/img/' + $("#sel_03 option:selected").text())
    	$(".imgUrlText").text('../static/images/' + $("#sel_03 option:selected").text());
    });
}


// 清除html页面数据
function clearHtml() {
	_eleTitle.val('');
	_eleTime.val('');
	_eleIntro.val('');
	_eleImg_url.val('');
	_eleWtext.html('');
}
// 获取html页面上的数据
function getTextInHtml() {
	var obj = {};
	obj.case= dataObj.case;
	obj.list= dataObj.list;
	obj.title = _eleTitle.val();
	obj.date = _eleTime.val();
	obj.intro = _eleIntro.val();
	obj.img_url = _eleImg_url.val();
	obj.timer = timer.getTime();
	obj.text = _eleWtext.html();
	return obj;
}
function btnfeda(num) {
	if(num){
		$(".revampBtn,.newBtn,.delBtn").fadeOut();
		$("#sel_01,#sel_02").attr("disabled","disabled" );
		$(".save").fadeIn();
	}
}

$(function () {
	// 新增
	$(".newBtn").click(function () {
		btnfeda(1);
		dataObj.case = $("#sel_01 option:selected").text();
		dataObj.list = $("#sel_02 option").length;
		console.log(dataObj.list)
		clearHtml();
	})
})

$(function () {
	// 修改
	$(".revampBtn").click(function () {
		btnfeda(1);
		dataObj.case = $("#sel_01 option:selected").text();
		dataObj.list = $("#sel_02 option:selected").val();
	})
})



function ajaxPost(data) {
	$.ajax({
	  type: 'POST',
	  url: '/form',
	  contentType:'application/x-www-form-urlencoded; charset=UTF-8',
	  data:data ,
	  dataType: 'json',
	  success: function(d){
	  	if(d.state == 1){
		  	alert('恭喜你，数据保存成功！')
	  		window.location.reload();
	  	}else if(d.state == 2){
	  		alert('恭喜你，数据删除成功！')
	  		window.location.reload();
	  	}else{
		  	alert('真倒霉，数据保存失败！')
	  	}
	  	// debugger
	  }
	});
}


$(function () {
	// 删除
	$(".delBtn").click(function () {
		dataObj.case = $("#sel_01 option:selected").text();
		dataObj.list = $("#sel_02 option:selected").val();
		ajaxPost({case:$("#sel_01 option:selected").text(),list:$("#sel_02 option:selected").val(),type:'del'});
	})
})


$(function () {
	// 保存
	$(".save").click(function () {
		// console.log(getTextInHtml())
		// console.log(JSON.stringify(getTextInHtml()))
		// listData = getTextInHtml();
		dataObj.setData(getTextInHtml());
		// console.log(JSON.stringify(dataObj.data));
		var _str = getTextInHtml();
		console.log(_str);
		ajaxPost(_str);
		// $.post("/form",JSON.stringify(dataObj.data),function(result){});
	})
})
// dataType: 'json',
// success: function(result) {
// $loginBox.find('.colWarning').html(result.message);
// if (!result.code) {
// window.location.reload();
// }
// }
// });
 
// 提交后刷新----window.location.reload();
// }
// 提交后跳转页面 --window.location.href（url）;
// }

