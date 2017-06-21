/**
 * Created by sanghuina on 17/5/22.
 * 进度详情,班级进度,可以查看未提交人员名单,可以用年级和问卷作为搜索条件
 */
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/schedule/scheduleDetails.html'),
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
            var paprmjson = {
                projectId: _jsonObject.projectId,
                organId: _jsonObject.organId,
                schoolId:_jsonObject.schoolId
            };
            $("#sch_sch").attr("href","#scheduleSchoolInfo/"+JSON.stringify(paprmjson));
            var paprmtwojson={
                projectId:_jsonObject.projectId ,
                organId:_jsonObject.organId,
                schoolId:_jsonObject.schoolId,
                schoolName:_jsonObject.schoolName,
                role:_jsonObject.role,
                paperItem:_jsonObject.paperItem
            };
            $("#sch_info").attr("href","#scheduleInfo/"+JSON.stringify(paprmtwojson));
            /*年级进度href赋值*/
            //显示与关闭为提交花名册, 写在数据渲染之后
            _this.getPaperList();
            _this.getGradeList();
            _this.getSchDetailData(_jsonObject.paperItem[0].questionnaire_id,_jsonObject.gradeItem[0].grade_id,_jsonObject.gradeItem[0].grade_name);
        },
        events:{
            "click .uncommittedBtn":"uncommittedBtnFun",
            "click .viewDetailsBtn":"viewDetailsBtnFun"
        },
        uncommittedBtnFun:function(_event){
            _event.stopPropagation();
            var _event = _event || event;
            var eventobj = _event.srcElement?_event.srcElement:_event.target;
            var $this=$(eventobj);
            $this.parent().css("display","none");
            $this.parent().next(".uncommittedDetails").fadeIn(1000);
        },
        viewDetailsBtnFun:function(_event){
            _event.stopPropagation();
            var _event = _event || event;
            var eventobj = _event.srcElement?_event.srcElement:_event.target;
            var $this=$(eventobj);
            $this.parent().parent().prev().fadeIn(500);
            $this.parent().parent().css("display","none");
        },
        getPaperList:function(){
            var paperItem=_jsonObject.paperItem;
            var optionstr="";
            for(var i=0;i<paperItem.length;i++){
                if(i==0){
                    optionstr+="<option value=\""+paperItem[i].questionnaire_id+"\" selected='selected'>"+paperItem[i].questionnaire_name+"</option>" ;
                }else{
                    optionstr+="<option value=\""+paperItem[i].questionnaire_id+"\">"+paperItem[i].questionnaire_name+"</option>" ;
                }
            }
            $("#paper").html(optionstr);
        },
        getGradeList:function(){
            var gradeItem=_jsonObject.gradeItem;
            var optionstr="";
            for(var i=0;i<gradeItem.length;i++){
                if(i==0){
                    optionstr+="<option value=\""+gradeItem[i].grade_id+"\" selected='selected'>"+gradeItem[i].grade_name+"</option>" ;
                }else{
                    optionstr+="<option value=\""+gradeItem[i].grade_id+"\">"+gradeItem[i].grade_name+"</option>" ;
                }
            }
            $("#grade").html(optionstr);
        },
        getSchDetailData:function(paperid,gradeid,gradename){
            var paramjson={
                grade_id:gradeid,
                questionnaire_id:paperid,
                grade_name:gradename,
                project_id:_jsonObject.projectId
            };
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.teacherSchedule, JSON.stringify(paramjson), function (_d) {
                var jsondata = _d.resultdata;
                if (jsondata.length > 0) {
                    var classItems=jsondata[0].class_items;
                    var divstr="";
                    for(var i=0;i<classItems.length;i++){
                        var subNum=parseInt(classItems[i].sub_user_count);
                        var UserNum=parseInt(classItems[i].user_count);
                        var percent=parseInt(subNum/UserNum*100);
                        divstr+="<li><div class=\"gradeProgress\">"+
                            "<span class=\"fw400\">"+classItems[i].class_name+"</span><div class=\"progressBarWhite\"><div class=\"progressBarOne\"><div class=\"percentage\" style='width: "+percent+"%'></div></div></div>"+percent+"&nbsp;% "+
                            "<span class=\"w70\">"+subNum+"/"+UserNum+"人</span> <span class=\"uncommittedBtn\">未提交名单</span></div>"+
                            "<div class=\"uncommittedDetails\" style=\"display: none;\">"+
                            "<div class=\"gradeProgress\">"+
                            "<span class=\"fw400\">"+classItems[i].class_name+"</span><div class=\"progressBarWhite\"><div class=\"progressBarOne\"><div class=\"percentage\" style='width: "+percent+"%'></div></div></div>" +
                            "<span class=\"percentageTxt\">"+percent+"&nbsp;% </span><span class=\"w70\">"+subNum+"/"+UserNum+"人</span> "+
                            "<span class=\"viewDetailsBtn\">未提交名单</span></div><div class=\"rosterName\">"+
                            "<p>"+classItems[i].no_sub[0].user_names+"</p> </div></div></li>";
                    }
                    $("#schDetailUL").html(divstr);
                }
            });
        }
    });
});