/**
 * Created by sanghuina on 17/5/22.
 * 教师,校长,年级进度页面,
 * 教师,校长在本页面可以查看未提交人员详情,可以按照问卷搜索
 * 年级进度可以点击进入到进度详情scheduleDetails
 */
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/schedule/scheduleInfo.html'),
        template = _.template(tpl), _this,_form,_jsonObject,_GradeObj=[];
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
                schoolId:_jsonObject.schoolId,
                schoolName:_jsonObject.schoolName
            };
            $("#sch_sch").attr("href","#scheduleSchoolInfo/"+JSON.stringify(paprmjson));
            _this.getPaperList();
            if(_jsonObject.role=="学生"||_jsonObject.role=="家长"){
                _this.getGradeSchedule(_jsonObject.paperItem[0].questionnaire_id);
            }else{
                _this.getTeacherSchedule(_jsonObject.paperItem[0].questionnaire_id);
            }
            $("#schoolname").html(_jsonObject.schoolName);
            $("#papername").html(_jsonObject.paperItem[0].questionnaire_name);
        },
        events:{
            "click .checkScheduleDetails":"checkScheduleDetailsFun",
            "click #searchBtn":"searchBtnFun",
            "click .uncommittedBtn":"uncommittedBtnFun",
            "click .viewDetailsBtn":"viewDetailsBtnFun"
        },
        checkScheduleDetailsFun:function(_event){
            _event.stopPropagation();
            var _event = _event || event;
            var eventobj = _event.srcElement?_event.srcElement:_event.target;
            var $this=$(eventobj);
            var paprmjson={
                projectId: _jsonObject.projectId,
                organId: _jsonObject.organId,
                schoolId:_jsonObject.schoolId,
                schoolName:_jsonObject.schoolName,
                paperItem:_jsonObject.paperItem,
                gradeItem:_GradeObj
            };
            location.href="#scheduleDetails/"+JSON.stringify(paprmjson);
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
        getGradeSchedule:function(paperid){
            _GradeObj=[];
            var paramjson={
                school_id:_jsonObject.schoolId,
                project_id:_jsonObject.projectId,
                questionnaire_id:paperid
            };
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.gradeSchedule, JSON.stringify(paramjson), function (_d) {
                var jsondata = _d.resultdata;
                if (jsondata.length > 0) {
                    var divstr="";
                    var gradeItems=jsondata[0].grade_items;
                    for(var i=0;i<gradeItems.length;i++){
                        var subNum=parseInt(gradeItems[i].sub_user_count);
                        var UserNum=parseInt(gradeItems[i].in_role_count);
                        var percent=parseInt(subNum/UserNum*100);
                        divstr+=" <li><span>"+gradeItems[i].grade_name+"</span><div class=\"progressBarWhite\"><div class=\"progressBarOne\"><div class=\"percentage\" style='width: "+percent+"%'></div>" +
                        "</div></div>"+percent+"% <span class=\"w70\">"+subNum+"/"+UserNum+"人</span>" +
                        " <a class=\"viewDetailsBtn checkScheduleDetails\" gradeid='"+gradeItems[i].grade_id+"' gradename='"+gradeItems[i].grade_name+"'>查看详情</a></li>";
                        var gradeobj={
                            grade_id:gradeItems[i].grade_id,
                            grade_name:gradeItems[i].grade_name
                        };
                        _GradeObj.push(gradeobj);
                    }
                }
            });

        },
        getTeacherSchedule:function(paperid){
            var paramjson={
                school_id:_jsonObject.schoolId,
                project_id:_jsonObject.projectId,
                questionnaire_id:paperid
            };
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.teacherSchedule, JSON.stringify(paramjson), function (_d) {
                var jsondata = _d.resultdata;
                if (jsondata.length > 0) {
                    var subNum=parseInt(jsondata.sub_user_count);
                    var UserNum=parseInt(jsondata.user_count);
                    var percent=parseInt(subNum/UserNum*100);
                    var divstr="<li><div class=\"gradeProgress\">"+
                        "<span class=\"fw400\">教师</span><div class=\"progressBarWhite\"><div class=\"progressBarOne\"><div class=\"percentage\" style='width: "+percent+"%'></div></div></div>"+percent+"&nbsp;% "+
                        "<span class=\"w70\">"+subNum+"/"+UserNum+"人</span> <span class=\"uncommittedBtn\">未提交名单</span></div>"+
                        "<div class=\"uncommittedDetails\" style=\"display: none;\">"+
                        "<div class=\"gradeProgress\">"+
                        "<span class=\"fw400\">教师</span><div class=\"progressBarWhite\"><div class=\"progressBarOne\"><div class=\"percentage\" style='width: "+percent+"%'></div></div></div>" +
                        "<span class=\"percentageTxt\">"+percent+"&nbsp;% </span><span class=\"w70\">"+subNum+"/"+UserNum+"人</span> "+
                        "<span class=\"viewDetailsBtn\">未提交名单</span></div><div class=\"rosterName\">"+
                        "<p>"+jsondata.no_sub[0].user_names+"</p> </div></div></li>";
                }
            });
        },
        searchBtnFun:function(){
            var paperid=$("#paper").val();
            $("#papername").html($("#paper").find("option:selected").text());
            if(_jsonObject.role=="学生"||_jsonObject.role=="家长"){
                _this.getGradeSchedule(paperid);
            }else{
                _this.getTeacherSchedule(paperid);
            }
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
        }
    });
});