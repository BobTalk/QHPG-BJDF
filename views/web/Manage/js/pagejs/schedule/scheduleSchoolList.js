/**
 * Created by sanghuina on 17/5/22.
 * 点击某个学校进入到学校概括页面scheduleSchoolInfo
 */
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/schedule/scheduleSchoolList.html'),
        template = _.template(tpl), _this,_form,_jsonObject;
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
            _form = PublicUTIL.layForm;
            _form.render();
            /*页面路由参数*/
            _jsonObject=JSON.parse(_this.model._jsonObject);
            /*获取学校进度列表*/
            /*_this.getsch_ListData();*/
            if(PublicUTIL.UserObject.user_role=="超级管理员"||PublicUTIL.UserObject.user_role=="教育局人员"){
                var obj={
                    projectId:_jsonObject.projectId ,
                    organId:_jsonObject.organId
                };
                var hrefurl="#scheduleBureauEdu/"+JSON.stringify(obj);
               $("#sch_bur").attr("href",hrefurl);
                $(".crumbs_jyj").show();
                $("#jiaoguandiv").show();
                /*获取教官中心数据*/
                _this.getOrganData();
            }else{
                $(".crumbs_jyj").hide();
                $("#jiaoguandiv").hide();
            }

        },
        events:{
            "click .checkSchoolInfo":"checkSchoolInfoFun",
            "click #searchBtn":"getsch_ListData"
        },
        checkSchoolInfoFun:function(_event){
            _event.stopPropagation();
            var _event = _event || event;
            var eventobj = _event.srcElement?_event.srcElement:_event.target;
            var $this=$(eventobj);
            var paprmjson = {
                projectId: _jsonObject.projectId,
                organId: _jsonObject.organId,
                schoolId:$this.attr("school_id"),
                schoolName:$this.attr("school_name")
            };
            location.href="#scheduleSchoolInfo/"+JSON.stringify(paprmjson);
        },
        getsch_ListData:function(){
            var paramjson={};
            if(PublicUTIL.UserObject.user_role=="超级管理员"||PublicUTIL.UserObject.user_role=="教育局人员"){
                paramjson={
                    xueduans:$("#xueduan").val(),
                    organ_id:$("#jiaoguan").val(),
                    project_id:_jsonObject.projectId
                };
            }else{
                paramjson={
                    xueduans:$("#xueduan").val(),
                    organ_id:_jsonObject.organId,
                    project_id:_jsonObject.projectId
                };
            }
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.schoolListSchedule, JSON.stringify(paramjson), function (_d) {
                var jsondata=_d.resultdata;
                if(jsondata.length>0){
                    var school_items=jsondata[0].school_items;
                    var divstr="";
                    for(var i=0;i<school_items.length;i++){
                        divstr+="<div class=\"eachSchoolBox\"><div class=\"schoolName\"><span>"+school_items[i].school_name+"</span></div>"+
                        "<div class=\"eachSchoolMain\"><div class=\"shouldNum\">应提交 <p>"+school_items[i].questionnaire_totle+"<span>份</span></p></div>"+
                        "<div class=\"actualNum\">实际提交<p>"+school_items[i].submit_totle+"<span>份</span></p></div></div>"+
                        "<div class=\"eachSchoolBottom checkSchoolInfo\" school_id='"+school_items[i].school_id+"' school_name='"+school_items[i].school_name+"'>查看详情<i></i></div></div>";
                    }
                }
            });
        },
        getOrganData:function(){
            var paramjson={};
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getOrganList, JSON.stringify(paramjson), function (_d) {
                var jsondata=_d.resultdata;
                var optionstr="";
                for(var i=0;i<jsondata.length;i++){
                    optionstr+="<option value=\""+jsondata[i].organ_id+"\">"+jsondata[i].organ_name+"</option>";
                }
                $("#jiaoguan").append(optionstr);
            });
        }
    });
});