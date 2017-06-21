/**
 * Created by sanghuina on 17/5/11.
 */
var roleValue = "学生", UserID = "1001", UserName = "学生", ServiceID = "axyr1001", ServiceName = "大方一小", tip_state = "",action="",pk="";
window.onload = function () {
    //参数先写固定的
    //action 0查看,1添加,2修改
     action=getUrlPara("action");
     roleValue=decodeURIComponent(getUrlPara("role"));
     UserID=getUrlPara("uid");
     UserName=decodeURIComponent(getUrlPara("uname"));
     ServiceID=getUrlPara("serid");
     ServiceName=decodeURIComponent(getUrlPara("xxmc"));
    if(action=="0"||action=="2"){
        pk=getUrlPara("pk");
        getTipoffInfo();
        if(action=="0"){
            //查看状态
            $("#save").hide();
            $("#tipoff_type").attr("disabled","disabled");
            $("#iphone").attr("disabled","disabled");
            $("#tip_school_name").attr("disabled","disabled");
            $("#tip_time").attr("disabled","disabled");
            $("#tip_content").attr("disabled","disabled");
        }
    }
    /*加载遮罩层事件*/
    if($(parent.document.body).find("#LoadToast").length==0){
        parent.window.initPopuDiv();
    }
};
var SaveTipoffInfo=function(){
    var score=$("#tipoff_type").find("option:selected").attr("score");
    var ajaxobj = {
        itype: "get",
        iname: "client/tipoffController/saveTipoff"
    };
    var actobj = {
        "tipoff_id":pk,
        "state": 0,
        "use_role": roleValue,
        "tipoff_type":$("#tipoff_type").val(),
        "stand_id":$("#tipoff_type").val(),//目前类别的value用的是指标id
        "iphone":$("#iphone").val(),
        "tip_school_name":$("#tip_school_name").val(),
        "tip_time":$("#tip_time").val(),
        "user_name":UserName,
        "user_id": UserID,
        "school_id": ServiceID,
        "school_name":ServiceName,
        "tip_content":$("#tip_content").val(),
        "score":score,
        "tipoff_type_name":$("#tipoff_type").find("option:selected").text()
    }
    parent.window.alertpop('LoadToast');
    getdata(ajaxobj, actobj, function (data) {
        if (data.resultnum == "0000") {
            var url="tipoff/tipoff.html?tip_state=''&uid="+UserID+"&serid="+ServiceID+"&role="+encodeURIComponent(roleValue)+"&xxmc="+encodeURIComponent(ServiceName)+"&uname="+encodeURIComponent(UserName);
            $( parent.document.body).find("#mainiframe").attr("src",url);
        }
        parent.window.alertclose();
    });
},
    getUrlPara= function(m){
    var sValue = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
    return sValue ? sValue[1] : sValue;
    },
    getTipoffInfo=function(){
        var ajaxobj = {
            itype: "get",
            iname: "client/tipoffController/getTipoffInfo"
        };
        var actobj = {
            "tipoff_id": pk
        }
        parent.window.alertpop('LoadToast');
        getdata(ajaxobj, actobj, function (data) {
            parent.window.alertclose();
            if (data.resultnum == "0000") {
                var jsondata = data.resultdata;
                if (jsondata.length > 0) {
                    $("#tipoff_type").val(jsondata[0].tipoff_type);
                    $("#iphone").val(jsondata[0].iphone);
                    $("#tip_school_name").val(jsondata[0].tip_school_name);
                    var tip_time="";
                    if(jsondata[0].tip_time!=undefined&&jsondata[0].tip_time!=null&&jsondata[0].tip_time!=""){
                        tip_time=jsondata[0].tip_time.substr(0,10);
                    }
                    $("#tip_time").val(tip_time);
                    $("#tip_content").val(jsondata[0].tip_content);
                }
            }
        });
    };
$("#save").click(function(){
    //表单验证,验证通过之后走保存
    var phone = document.getElementById('iphone').value;
    if(phone==""){
        parent.window.alertpop("AlertToast","请输入联系方式","error");
        return false;
    }else {
        if((/^1(3|4|5|7|8)\d{9}$/.test(phone))||/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(phone)){

        }else{
            parent.window.alertpop("AlertToast","联系方式请输入正确的手机号或者固定电话","error");
            return false;
        }
    }
    var tip_school_name = document.getElementById('tip_school_name').value;
    if(tip_school_name==""){
        parent.window.alertpop("AlertToast","请输入事件发生学校","error");
        return false;
    }
    var tip_time = document.getElementById('tip_time').value;
    if(tip_time==""){
        parent.window.alertpop("AlertToast","请输入事件发生时间","error");
        return false;
    }
    SaveTipoffInfo();
});
$("#back").click(function(){
    var url="tipoff/tipoff.html?tip_state=''&uid="+UserID+"&serid="+ServiceID+"&role="+encodeURIComponent(roleValue)+"&xxmc="+encodeURIComponent(ServiceName)+"&uname="+encodeURIComponent(UserName);
    $( parent.document.body).find("#mainiframe").attr("src",url);
});