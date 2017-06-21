/**
 * Created by sanghuina on 17/5/22.
 * 点击页面中的某个角色(校长,教师,学生,家长),进入到本角色的提交情况页面scheduleInfo
 */
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/schedule/scheduleSchoolInfo.html'),
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
            var obj={
                projectId:_jsonObject.projectId ,
                organId:_jsonObject.organId
            };
            if(PublicUTIL.UserObject.user_role=="超级管理员"||PublicUTIL.UserObject.user_role=="教育局人员"){
                var hrefurl="#scheduleBureauEdu/"+JSON.stringify(obj);
                $("#sch_bur").attr("href",hrefurl);
                $(".crumbs_jyj").show();
                var sch_listurl="#scheduleSchoolList/"+JSON.stringify(obj);
                $(".crumbs_list").show();
                $("#sch_sch_list").attr("href",sch_listurl);
            }else if(PublicUTIL.UserObject.user_role=="教官中心人员"){
                $(".crumbs_jyj").hide();
                var sch_listurl="#scheduleSchoolList/"+JSON.stringify(obj);
                $(".crumbs_list").show();
                $("#sch_sch_list").attr("href",sch_listurl);
            }else{
                $(".crumbs_jyj").hide();
                $(".crumbs_list").hide();
            }
            $("#schoolname").html(_jsonObject.schoolName);
        },
        events:{
            "click .checkScheduleInfo":"checkScheduleInfo"
        },
        checkScheduleInfo:function(_event){
            _event.stopPropagation();
            var _event = _event || event;
            var eventobj = _event.srcElement?_event.srcElement:_event.target;
            var $this=$(eventobj);
            var paprmjson={
                projectId:_jsonObject.projectId ,
                organId:_jsonObject.organId,
                schoolId:_jsonObject.schoolId,
                schoolName:_jsonObject.schoolName,
                role:$this.attr("role"),
                paperItem:JSON.parse($this.attr("paper_item"))
            };
            location.href="#scheduleInfo/"+JSON.stringify(paprmjson);
        },
        getSch_SchoolData:function(){
           /* 获取学校进度概况详情*/
            var paramjson={
                school_id:_jsonObject.schoolId,
                project_id:_jsonObject.projectId
            };
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.schoolListSchedule, JSON.stringify(paramjson), function (_d) {
                var jsondata=_d.resultdata;
                if(jsondata.length>0){
                    var schoolDatail_item=jsondata[0].schoolDatail_item;
                    for(var i=0;i<schoolDatail_item.length;i++){
                        var role=schoolDatail_item[i].in_role;
                        if(role=="教师"){
                            $("#teacher_num").html(schoolDatail_item[i].in_role_count+"<span>份</span>");
                            $("#teacher_paper").html("<span class=\"questionnaireNum\"></span>"+schoolDatail_item[i].task_questionnaire_item.length+"套调查问卷");
                            $("#teacher_subnum").html("<span class=\"submitIcom\"></span>已提交"+schoolDatail_item[i].submit+"份");
                            var percent=parseInt(parseInt(schoolDatail_item[i].submit)/parseInt(schoolDatail_item[i].in_role_count)*100);
                            $("#teacher_percent").html("<span class=\"completedIcon\"></span>"+percent+"%已完成");
                            var paper_item=schoolDatail_item[i].task_questionnaire_item;
                            $("#teacher_a").attr("paper_item",JSON.stringify(paper_item));

                        }else if(role=="学生"){
                            $("#student_num").html(schoolDatail_item[i].in_role_count+"<span>份</span>");
                            $("#student_paper").html("<span class=\"questionnaireNum\"></span>"+schoolDatail_item[i].task_questionnaire_item.length+"套调查问卷");
                            $("#student_subnum").html("<span class=\"submitIcom\"></span>已提交"+schoolDatail_item[i].submit+"份");
                            var percent=parseInt(parseInt(schoolDatail_item[i].submit)/parseInt(schoolDatail_item[i].in_role_count)*100);
                            $("#student_percent").html("<span class=\"completedIcon\"></span>"+percent+"%已完成");
                            var paper_item=schoolDatail_item[i].task_questionnaire_item;
                            $("#student_a").attr("paper_item",JSON.stringify(paper_item));
                        }else if(role=="家长"){
                            $("#parent_num").html(schoolDatail_item[i].in_role_count+"<span>份</span>");
                            $("#parent_paper").html("<span class=\"questionnaireNum\"></span>"+schoolDatail_item[i].task_questionnaire_item.length+"套调查问卷");
                            $("#parent_subnum").html("<span class=\"submitIcom\"></span>已提交"+schoolDatail_item[i].submit+"份");
                            var percent=parseInt(parseInt(schoolDatail_item[i].submit)/parseInt(schoolDatail_item[i].in_role_count)*100);
                            $("#parent_percent").html("<span class=\"completedIcon\"></span>"+percent+"%已完成");
                            var paper_item=schoolDatail_item[i].task_questionnaire_item;
                            $("#parent_a").attr("paper_item",JSON.stringify(paper_item));
                        }
                    }
                }
            });

        }
    });
});