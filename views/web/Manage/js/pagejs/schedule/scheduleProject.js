/**
 * Created by sanghuina on 17/5/22.
 * 项目进度列表,以项目为主,根据不同角色进入看到的下发总人数和提交总人数不同
 * 角色不同进入的页面也不同
 * 后台管理员/教育局人员进入教育局列表(最小教育局--教官中心列表)scheduleBureauEdu
 * 教研中心人员进入学校进度列表页面scheduleSchoolList
 * 校长进入项目的学校概括页面scheduleSchoolInfo
 */
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/schedule/scheduleProject.html'),
        template = _.template(tpl), _this,_form;
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
            /*测试阶段,正式使用时可以删除给展开收起按钮添加事件*/
            /*_this.getScheduleProjectData();*/
            $(".closeUp").toggle(
                function () {
                    $(this).parent().parent().parent().next("tbody").fadeIn(500);
                    $(this).html("收起");
                },
                function () {
                    $(this).parent().parent().parent().next("tbody").css("display", "none");
                    $(this).html("展开");
                });

        },
        events:{
            "click .Getinto":"GetintoFun"
        },
        getScheduleProjectData:function(){
            /*暂时不考虑分页,每年的项目没有几条数据*/
            var paramjson={project_name:$("#search_proname").val(),"use_role":PublicUTIL.UserObject.user_role,service_id:PublicUTIL.UserObject.server_id,page_size:100,page_num:1};
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.projectSchedule, JSON.stringify(paramjson), function (_d) {
                var jsondata = _d.resultdata;
                if(jsondata.length>0){
                    for(var i=0;i<jsondata.length;i++){
                        var project_id=jsondata[i].project_id;
                        var project_name=jsondata[i].project_name;
                        var questionnaire_items=jsondata[i].questionnaire_items;
                        var theadStr="";
                        var tbodyStr="";
                        var pro_user_count=0;
                        var pro_subuser_count=0;
                        for(var j=0;j<questionnaire_items.length;j++){
                            var user_count=0;
                            if(questionnaire_items[j].user_count!=undefined&&questionnaire_items[j].user_count!=null&&questionnaire_items[j].user_count!=""){
                                user_count=parseInt(questionnaire_items[j].user_count);
                                pro_user_count=pro_user_count+user_count;
                            }
                            var subuser_count=0;
                            if(questionnaire_items[j].sub_user_count!=undefined&&questionnaire_items[j].sub_user_count!=null&&questionnaire_items[j].sub_user_count!=""){
                                subuser_count=parseInt(questionnaire_items[j].sub_user_count);
                                pro_subuser_count=pro_subuser_count+subuser_count;
                            }
                            tbodyStr+="<tr><td>"+questionnaire_name+"</td>"+
                                "<td colspan=\"2\">填写对象：<span class=\"w60 tal\">"+questionnaire_items[j].in_role+"</span></td>"+
                                "<td>下发人数：<span class=\"w60 tal\"><span class=\"typeface2\">"+user_count+"</span>人</span></td>"+
                                "<td>提交人数：<span class=\"w60 tal\"><span class=\"typefaceRed\">"+subuser_count+"</span>人 </span></td></tr>";
                        }
                        theadStr="<thead style=\"\"><tr><th>"+project_name+"</th>"+
                            "<th>"+questionnaire_items.length+"套</th><th class=\"typeface\">"+pro_user_count+"</th>"+
                            "<th class=\"typeface\">"+pro_subuser_count+"</th>"+
                            "<th> <span class=\"yellowBtn mr20  closeUp\">展开</span> <span class=\"redBtn mr20 Getinto\" projectid='"+project_id+"'>进入</span>"+
                            "</th></tr></thead>";

                        $("#scheduleProject").append(theadStr);
                        $("#scheduleProject").append("<tbody style=\"display: none\">"+tbodyStr+" </tbody>");
                    }
                    /*给展开收起按钮添加事件*/
                    $(".closeUp").toggle(
                        function () {
                            $(this).parent().parent().parent().next("tbody").fadeIn(500);
                            $(this).html("收起");
                        },
                        function () {

                            $(this).parent().parent().parent().next("tbody").css("display", "none");
                            $(this).html("展开");
                        });

                }else{
                    /*暂无数据处理*/
                }

            });
        },
        GetintoFun:function(_event){
            /*项目列表中的进入详情按钮事件,根据角色不同进入不同级别的页面*/
            _event.stopPropagation();
            var _event = _event || event;
            var eventobj = _event.srcElement?_event.srcElement:_event.target;
            var $this=$(eventobj);
            //根据角色不同进入不同的页面 角色有 清华评估管理员,教育局,学校
            if(PublicUTIL.UserObject.user_role=="超级管理员"){
                //评估管理员
                var obj={
                    projectId:$this.attr("projectid"),
                    organId:""
                };
                location.href="#scheduleBureauEdu/"+JSON.stringify(obj);
            }else if(PublicUTIL.UserObject.user_role=="教育局人员"){
                //教育局人员
                var obj={
                    projectId:$this.attr("projectid"),
                    organId:PublicUTIL.UserObject.server_id
                };
                location.href="#scheduleBureauEdu/"+JSON.stringify(obj);
            }else if(PublicUTIL.UserObject.user_role=="教官中心人员"){
                //教育局下的教官中心人员
                var obj={
                    projectId:$this.attr("projectid"),
                    organId:PublicUTIL.UserObject.server_id
                };
                location.href="#scheduleSchoolList/"+JSON.stringify(obj);
            }
            else if(PublicUTIL.UserObject.user_role=="校长"){
                //校长
                var paprmjson={
                    projectId:$this.attr("projectid"),
                    organId:"",
                    schoolId:PublicUTIL.UserObject.school_id,
                    schoolName:PublicUTIL.UserObject.school_name,
                    tjNum:"",
                    ResultData:""
                };
                location.href="#scheduleSchoolInfo/"+JSON.stringify(paprmjson);
            }

        }

    });
});
