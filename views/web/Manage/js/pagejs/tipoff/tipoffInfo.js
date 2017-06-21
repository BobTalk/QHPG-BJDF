/**
 * Created by sanghuina on 17/5/17.
 * 后台端我的举报列表
 */
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/tipoff/tipoffInfo.html'),
        template = _.template(tpl), _this,_form,_spk="",_action,_tipOffJson={};
    var myossupload = require('myossupload');
    return Backbone.View.extend({
        className: "layui-main",
        initialize: function () {
            _this = this;
            this.render();
        },
        render: function () {
            this.$el.html(template(this.model));
            return this;
        },
        afterRender: function () {
            _form=PublicUTIL.layForm;
            layui.use(['laydate'], function(){
                //时间控件
                var laydate = layui.laydate;
            });
            _form.render();
            /*1添加,2修改,3查看,4审批*/
            _action=_this.model._opType;
            _spk=_this.model._currentId;
            if(_spk=="-1"){
                _spk="";
            }
            _tipOffJson={
                "state":1,
                "tipoff_id":_spk,
                "stand_id":"",
                "school_id":"",
                "school_name":"",
                "score":"",
                "score_source":"举报"
            };
            if(_action=="1"){
            }else if(_action=="2"){
                _this.gettipoffInfo();
            }else if(_action=="3"){
                _this.gettipoffInfo();
                $("#save").hide();
                $("#tipoffform").find("textarea").attr("disabled","disabled");
                $("#tipoffform").find("input").attr("disabled","disabled");
                $("#tipoffform").find("select").attr("disabled","disabled");
            }else{
                _this.gettipoffInfo();
                $("#save").hide();
                $("#pass").show();
                $("#reject").show();
                $("#tipoffform").find("textarea").attr("disabled","disabled");
                $("#tipoffform").find("input").attr("disabled","disabled");
                $("#tipoffform").find("select").attr("disabled","disabled");
            }
        },
        events: {
            "click #back":"backFun",
            "click #save":"saveFun",
            "click #pass":"passFun",
            "click #reject":"rejectFun"
        },
        backFun:function(){
            location.href="#tipoffExamineList/"+_this.model._jsonObject;
        },
        gettipoffInfo:function(){
            var actobj = {
                "tipoff_id": _spk
            }
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getTipoffInfo, JSON.stringify(actobj), function (_d) {
                var jsondata = _d.resultdata;
                if (jsondata.length > 0) {
                    _tipOffJson.school_id=jsondata[0].school_id;
                    _tipOffJson.school_name=jsondata[0].school_name;
                    _tipOffJson.stand_id=jsondata[0].stand_id;
                    _tipOffJson.score=-jsondata[0].score;
                    $("#tipoff_type").val(jsondata[0].tipoff_type);
                    $("#iphone").val(jsondata[0].iphone);
                    $("#tip_school_name").val(jsondata[0].tip_school_name);
                    var tip_time="";
                    if(jsondata[0].tip_time!=undefined&&jsondata[0].tip_time!=null&&jsondata[0].tip_time!=""){
                        tip_time=jsondata[0].tip_time.substr(0,10);
                    }
                    $("#tip_time").val(tip_time);
                    $("#tip_content").val(jsondata[0].tip_content);
                    _form.render("select");
                }
            });
        },
        saveFun:function(){
            //表单验证,验证通过之后走保存
            var phone = document.getElementById('iphone').value;
            if(phone==""){
                PublicUTIL.message("alert","请输入联系方式");
                return false;
            }else {
                if((/^1(3|4|5|7|8)\d{9}$/.test(phone))||/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(phone)){

                }else{
                    PublicUTIL.message("alert","联系方式请输入正确的手机号或者固定电话");
                    return false;
                }
            }
            var tip_school_name = document.getElementById('tip_school_name').value;
            if(tip_school_name==""){
                PublicUTIL.message("alert","请输入事件发生学校");
                return false;
            }
            var tip_time = document.getElementById('tip_time').value;
            if(tip_time==""){
                PublicUTIL.message("alert","请输入事件发生时间");
                return false;
            }
            var score=$("#tipoff_type").find("option:selected").attr("score");
            var actobj = {
                "tipoff_id":_spk,
                "state": 0,
                "use_role":PublicUTIL.UserObject.user_role,
                "tipoff_type":$("#tipoff_type").val(),
                "stand_id":$("#tipoff_type").val(),//目前类别的value用的是指标id
                "iphone":$("#iphone").val(),
                "tip_school_name":$("#tip_school_name").val(),
                "tip_time":$("#tip_time").val(),
                "user_name":PublicUTIL.UserObject.user_name,
                "user_id": PublicUTIL.UserObject.user_id,
                "school_id": PublicUTIL.UserObject.server_id,
                "school_name":PublicUTIL.UserObject.server_name,
                "tip_content":$("#tip_content").val(),
                "score":score,
                "tipoff_type_name":$("#tipoff_type").find("option:selected").text()
            }
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.saveTipoff, JSON.stringify(actobj), function (_d) {
                if (_d.resultnum == "0000") {
                    PublicUTIL.message('success','数据保存成功');
                    location.href="#tipoffExamineList/"+_this.model._jsonObject;
                }
            });
        },
        passFun:function(){
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.examineTipoff, JSON.stringify(_tipOffJson), function (_d) {
                if (_d.resultnum == "0000") {
                    PublicUTIL.message('success','举报数据审批成功');
                    location.href="#tipoffExamineList/"+_this.model._jsonObject;
                }
            });
        },
        rejectFun:function(){
            var actobj={
                "state":2,
                "tipoff_id":_spk
            };
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.updatetipState, JSON.stringify(actobj), function (_d) {
                if (_d.resultnum == "0000") {
                    PublicUTIL.message('success','举报数据驳回成功');
                    location.href="#tipoffExamineList/"+_this.model._jsonObject;
                }
            });
        }
    });
});
