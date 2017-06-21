/**
 * Created by sanghuina on 17/5/10.
 * 举报功能开发
 */
var roleValue = "学生", UserID = "1001", UserName = "学生", ServiceID = "axyr1001", ServiceName = "大方一小", tip_state = "",action="1";
window.onload = function () {
    //参数先写固定的
    /*roleValue=decodeURIComponent(getUrlPara("role"));
     UserID=getUrlPara("uid");
     UserName=decodeURIComponent(getUrlPara("uname"));
     ServiceID=getUrlPara("serid");
     ServiceName=decodeURIComponent(getUrlPara("xxmc"));*/
    /*action=1是公示列表,3是个人举报列表*/
    action=getUrlPara("action");
    pagePlugin.init($(".datelist_page"),5,function(pageIndex){
        getDataFromDatabase(pageIndex);
    });
    getDataFromDatabase(1);
    if(action=="1"){
        /*公示列表*/
        $("#schooldiv").show();
        $("#report").hide();
        getSchoolList();
    }else{
        /*个人举报列表*/
        $("#schooldiv").hide();
    }
    /*加载遮罩层事件*/
    if($( parent.document.body).find("#LoadToast").length==0){
        parent.window.initPopuDiv();
    }
};
var getDataFromDatabase = function (pageIndex) {
    var ajaxobj = {
        itype: "get",
        iname: "client/tipoffController/getTipoffList"
    };
    var actobj={};
    if(action=="1"){
        actobj = {
            "tip_state": 1,
            "use_role": "教育局人员",
            "user_id": "",
            "service_id": $("#school").val(),
            "tip_type": $("#tipoff_type").val(),
            "page_size": 5,
            "page_num": pageIndex
        }
    }else{
        actobj = {
            "tip_state": tip_state,
            "use_role": roleValue,
            "user_id": UserID,
            "service_id": ServiceID,
            "tip_type": $("#tipoff_type").val(),
            "page_size": 5,
            "page_num": pageIndex
        }
    }

    parent.window.alertpop('LoadToast');
    getdata(ajaxobj, actobj, function (data) {
        if (data.resultnum == "0000") {
            var jsondata = data.resultdata;
            if (jsondata.length > 0) {
                var tsStr="";
                for (var i = 0; i < jsondata.length; i++) {
                    var tip_time="";
                    if(jsondata[i].tip_time!=undefined&&jsondata[i].tip_time!=null&&jsondata[i].tip_time!=""){
                        tip_time=jsondata[i].tip_time.substr(0,10);
                    }
                    tsStr+="<tr><td>"+jsondata[i].tipoff_type_name+"</td><td>"+jsondata[i].tip_school_name+"</td><td>"+tip_time+"</td><td>"+jsondata[i].tip_content+"</td>" ;
                    if(jsondata[i].state==0||jsondata[i].state==2){
                        /*0是保存状态,2是驳回状态*/
                        tsStr+="<td tipoff_id='"+jsondata[i].tipoff_id+"'><a class=\"editData green\">编辑</a><a class=\"deleteData green maginleft10\">删除</a><a class=\"checkData green maginleft10\">查看</a></td></tr>";
                    }else{
                        tsStr+="<td tipoff_id='"+jsondata[i].tipoff_id+"'><a class=\"checkData green maginleft10\">查看</a></td></tr>";
                    }
                }
                $("#tipoffbody").html(tsStr);
            }else{
                $("#tipoffbody").html("");
            }
            pagePlugin.renderPaging(data.rows,jsondata.length);
        }else{
            $("#tipoffbody").html("");
        }
        parent.window.alertclose();
    });
},
getUrlPara= function(m){
    var sValue = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
    return sValue ? sValue[1] : sValue;
},
getSchoolList=function(){
    var JSONPARAM={
        school_types:"",
        organ_ids:""
    };
    var ajaxobj = {
        itype: "get",
        iname: "bdmanage/baseDataController/getSchoolList"
    };
    getdata(ajaxobj, JSONPARAM, function (data) {
        //渲染学校列表
        var schoolList = data.resultdata;
        var optionstr="";
        for (var i = 0; i < schoolList.length; i++) {
            optionstr+="<option value=\""+schoolList[i].school_id+"\">"+schoolList[i].school_name+"</option>";
        }
        $("#school").html("<option value=\"\">请选择学校</option>"+optionstr);
    });
};
/*点击我要举报弹出举报层*/
function showOverlay() {
    /*action 0查看,1添加,2修改*/
    var url="tipoff/tipoffInfo.html?action=1&uid="+UserID+"&serid="+ServiceID+"&role="+encodeURIComponent(roleValue)+"&xxmc="+encodeURIComponent(ServiceName)+"&uname="+encodeURIComponent(UserName);
    $( parent.document.body).find("#mainiframe").attr("src",url);
}
/*查询事件*/
$("#select").click(function(){
    getDataFromDatabase(1);
});
/*列表中编辑事件*/
$("#tipoffbody").delegate(".editData","click",function(_event){
    _event.stopPropagation();
    var _event = _event || event;
    var eventobj = _event.srcElement?_event.srcElement:_event.target;
    var $this=$(eventobj);
    var tipoff_id=$this.parent().attr("tipoff_id");
    var url="tipoff/tipoffInfo.html?action=2&pk="+tipoff_id+"&uid="+UserID+"&serid="+ServiceID+"&role="+encodeURIComponent(roleValue)+"&xxmc="+encodeURIComponent(ServiceName)+"&uname="+encodeURIComponent(UserName);
    $( parent.document.body).find("#mainiframe").attr("src",url);
});
/*列表中删除事件*/
$("#tipoffbody").delegate(".deleteData","click",function(_event){
    _event.stopPropagation();
    var _event = _event || event;
    var eventobj = _event.srcElement?_event.srcElement:_event.target;
    var $this=$(eventobj);
    var tipoff_id=$this.parent().attr("tipoff_id");
    var ajaxobj = {
        itype: "get",
        iname: "client/tipoffController/deleteTipoff"
    };
    var actobj = {
        "tipoff_id": tipoff_id
    }
    parent.window.alertpop('LoadToast');
    getdata(ajaxobj, actobj, function (data) {
        parent.window.alertclose();
        if (data.resultnum == "0000") {
            $this.parents("tr").remove();
        }
    });
});
/*列表中查看事件*/
$("#tipoffbody").delegate(".checkData","click",function(_event){
    _event.stopPropagation();
    var _event = _event || event;
    var eventobj = _event.srcElement?_event.srcElement:_event.target;
    var $this=$(eventobj);
    var tipoff_id=$this.parent().attr("tipoff_id");
    var url="tipoff/tipoffInfo.html?action=0&pk="+tipoff_id+"&uid="+UserID+"&serid="+ServiceID+"&role="+encodeURIComponent(roleValue)+"&xxmc="+encodeURIComponent(ServiceName)+"&uname="+encodeURIComponent(UserName);
    $( parent.document.body).find("#mainiframe").attr("src",url);
});
