/**
 * Created by sanghuina on 17/5/18.
 */
window.onload = function () {
    pagePlugin.init($(".datelist_page"),5,function(pageIndex){
        getDataFromDatabase(pageIndex);
    });
    /*获取资料公示列表信息*/
    getDataFromDatabase(1);
    /*加载学校信息*/
    getSchoolList();
    /*加载资料类别信息*/
    getResourceType();
}
/*查询事件*/
$("#select").click(function(){
    getDataFromDatabase(1);
});
$("#resourcebody").delegate(".checkData","click",function(_event){
    _event.stopPropagation();
    var $obj=$(event.target);
    var dataId=$obj.attr("data-id");
    var attachment_id=$obj.attr("attachment_id");
    var attachtypename=$obj.attr("attachment_name");
    getAttachData(dataId,attachment_id,attachtypename);
});
var getDataFromDatabase = function (pageIndex) {
    var ajaxobj = {
        itype: "get",
        iname: "pgmanage/attachmentController/getAttachmentResultList"
    };
    var actobj={
        type:3,
        stand_id:$("#fenlei").find("option:selected").attr("stand_id"),
        school_id:$("#school").val(),
        page_num: pageIndex,
        page_size: 5
    };
    parent.window.alertpop('LoadToast');
    getdata(ajaxobj, actobj, function (data) {
        if (data.resultnum == "0000") {
            var jsondata = data.resultdata;
            if (jsondata.length > 0) {
                var tsStr="";
                for (var i = 0; i < jsondata.length; i++) {
                    var create_time="";
                    if(jsondata[i].create_time!=undefined&&jsondata[i].create_time!=null&&jsondata[i].create_time!=""){
                        create_time=jsondata[i].create_time.substr(0,10);
                    }
                    var json=JSON.parse(jsondata[i].attachment_term_resultjson);
                    var nums=json.length;
                    tsStr+="<tr><td>"+jsondata[i].attachment_name+"</td><td>"+nums+"</td><td>"+jsondata[i].school_name+"</td><td>"+create_time+"</td>" ;
                    tsStr+="<td><a class=\"checkData green\" data-id='"+jsondata[i].id+"' attachment_id='"+jsondata[i].attachment_id+"' attachment_name='"+jsondata[i].attachment_name+"'>查看</a></td></tr>";
                }
                $("#resourcebody").html(tsStr);
            }else{
                $("#resourcebody").html("");
            }
            pagePlugin.renderPaging(data.rows,jsondata.length);
        }else{
            $("#resourcebody").html("");
        }
        parent.window.alertclose();
    });
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
    },
    getResourceType=function(){
         var paramjson={"use_role":"资料管理员"};
        var ajaxobj = {
            itype: "get",
            iname: "pgmanage/attachmentController/getAttachmentList"
        };
        getdata(ajaxobj, paramjson, function (data) {
                var jsondata = data.resultdata;
                //附件分组
                var attachtypeadd=[];
                //每个分组中的option串
                var attachOptionS=[];
                var optionStr="";
                if (jsondata.length > 0) {
                    for(var i=0;i<jsondata.length;i++){
                        if($.inArray(jsondata[i].stand_type_name, attachtypeadd)<0){
                            //分类不存在则加组,并加入数组中
                            attachtypeadd.push(jsondata[i].stand_type_name);
                            attachOptionS.push([]);
                        }
                        var index=$.inArray(jsondata[i].stand_type_name, attachtypeadd);
                        attachOptionS[index]=attachOptionS[index]+"<option value=\""+jsondata[i].attachment_id+"\" stand_id=\""+jsondata[i].stand_id+"\" score_type=\""+jsondata[i].score_type+"\" submit_num=\""+jsondata[i].submit_num+"\">"+jsondata[i].attachment_name+"</option>";
                    }
                    for(var j=0;j<attachtypeadd.length;j++){
                        optionStr+="<optgroup label=\""+attachtypeadd[j]+"\">"+attachOptionS[j]+"</optgroup>";
                    }
                    $("#fenlei").append("<option value=\"\">请选择资料分类</option>"+optionStr);
                }
            });
    },
    getAttachData=function(dataId,attachment_id,attachtypename){
        $("#attachtypename").html(attachtypename);
        $("#attachform").html("");
        var actobj={"attachment_id":attachment_id};
        var ajaxobj = {
            itype: "get",
            iname: "pgmanage/attachmentController/getAttachmentByID"
        };
        getdata(ajaxobj, actobj, function (data) {
            if (data.resultnum == "0000") {
                var jsondata = data.resultdata;
                if(jsondata.length>0){
                    var attachmentterm=JSON.parse(jsondata[0].term);
                    $("#attachname").html(jsondata[0].attachment_name);
                    var formStr="";
                    for(var i=0;i<attachmentterm.length;i++){
                        /*根据附件项加载附件表单*/
                        if(attachmentterm[i].type=="text"){
                            /*文本类型*/
                            formStr="<div class=\"layui-form-item\">"+
                                "<div class=\"data-input-block\">"+
                                "<div class=\"twoTitle\">"+"<i></i>"+attachmentterm[i].name+":</div>"+
                                "<div class=\"data-upload-box\">"+
                                "<input type=\"text\"  placeholder=\"请输入"+attachmentterm[i].name+"\" autocomplete=\"off\" class=\"datavalue layui-input dataInput\" datavalue='"+attachmentterm[i].id+"' score='"+attachmentterm[i].score+"' itemtype='text'>"+
                                "</div>"+
                                "</div>"+
                                "</div>";
                            $("#attachform").append(formStr);

                        }else if(attachmentterm[i].type=="select"){
                            /*下拉框选择*/
                            var optionstr="<option value=''>请选择</option>";
                            for(var j=0;j<attachmentterm[i].items.length;j++){
                                optionstr+="<option value=\""+attachmentterm[i].items[j].value+"\" score='"+attachmentterm[i].items[j].score+"'>"+attachmentterm[i].items[j].text+"</option>";
                            }
                            formStr="<div class=\"layui-form-item\">"+
                                "<div class=\"data-input-block\">"+
                                "<div class=\"twoTitle\">"+"<i></i>"+attachmentterm[i].name+":</div>"+
                                "<div class=\"data-upload-box\">"+
                                "<select class='datavalue layui-select' datavalue='"+attachmentterm[i].id+"' itemtype='select'>"+optionstr+"</select>"+
                                "</div>"+
                                "</div>"+
                                "</div>";
                            $("#attachform").append(formStr);
                        }
                        else if(attachmentterm[i].type=="date"){
                            /*日期类型*/
                            formStr="<div class=\"layui-form-item\">"+
                                "<div class=\"data-input-block\">"+
                                "<div class=\"twoTitle\">"+"<i></i>"+attachmentterm[i].name+":</div>"+
                                "<div class=\"data-upload-box\">"+
                                "<input type=\"text\" placeholder=\"请输入"+attachmentterm[i].name+"\" autocomplete=\"off\" lay-verify=\"date\" autocomplete=\"off\" class=\"datavalue layui-input\" onclick=\"layui.laydate({elem: this})\" datavalue='"+attachmentterm[i].id+"' score='"+attachmentterm[i].score+"' itemtype='date'>"+
                                "</div>"+
                                "</div>"+
                                "</div>";
                            $("#attachform").append(formStr);
                        }
                        else{
                            /*附件类型*/
                            var fileinput="<input type=\"file\" lay-ext=\""+attachmentterm[i].items[0].filetype+"\" class=\"datavalue data-upload-file\" id='"+attachmentterm[i].id+"file'>";
                            if(attachmentterm[i].items.length>1){
                                fileinput+="<input type=\"file\" lay-ext=\""+attachmentterm[i].items[0].filetype+"\" class=\"datavalue data-upload-file\" id='"+attachmentterm[i].id+"upload'>";
                            }
                            formStr="<div class=\"layui-form-item\">"+
                                "<div class=\"data-input-block\">"+
                                "<div class=\"twoTitle\">"+"<i></i>"+attachmentterm[i].name+":</div>"+
                                "<div class=\"data-upload-box\" id='"+attachmentterm[i].id+"div'>"+ fileinput+
                                "<span class=\"data-upload-icon\"></span>"+
                                "</div>"+
                                "</div>"+
                                "<div class=\"datavalue dataDocBox\" id='"+attachmentterm[i].id+"' name='"+attachmentterm[i].id+"' datavalue='"+attachmentterm[i].id+"' score='"+attachmentterm[i].score+"' itemtype='file'>"+
                                "</div>"+
                                "</div>";
                            $("#attachform").append(formStr);
                        }
                    }
                    $("#attachform").find(".data-upload-icon").parent().hide();
                    $("#attachform").find("input").attr("disabled","disabled");
                    $("#attachform").find("select").attr("disabled","disabled");
                    $("#previewDownload").show();
                    getAttachResultData(dataId);
                }
            }
        });
    },
    getAttachResultData=function(dataId){
        var actobj={"id":dataId};
        var ajaxobj = {
            itype: "get",
            iname: "pgmanage/attachmentController/getAttachmentResultByID"
        };
        getdata(ajaxobj, actobj, function (data) {
            if (data.resultnum == "0000") {
                var jsondata=data.resultdata;
                if(jsondata.length>0){
                    var termjson=JSON.parse(jsondata[0].attachment_term_resultjson);
                    for(var j=0;j<termjson.length;j++){
                        var $obj=$("#attachform").find(".datavalue[datavalue='"+termjson[j].termid+"']");
                        if($obj.attr("itemtype")=="file"){
                            var filejson=termjson[j].value;
                            var filedivStr="";
                            for(var m=0;m<filejson.length;m++){
                                filedivStr+="<div class=\"dataDocTitle\" filename='"+filejson[m].name+"' fileurl='"+filejson[m].value+"' filesize='"+filejson[m].size+"'><i></i>"+
                                    "<span class=\"lookfile data-downloadDoc-icon\"></span>"+
                                    "<a href='"+filejson[m].value+"' class=\"data-preview-icon\"></a>"+filejson[m].name+"</div>";
                            }
                            $obj.html(filedivStr);
                        }else{
                            $obj.val(termjson[j].value);
                        }
                    }
                }
            }
        });
    };
