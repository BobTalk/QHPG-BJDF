/**
 * Created by sanghuina on 17/5/22.
 * 教育局人员进入教育局列表(最小教育局--教官中心列表)
 * 点击进入是进入到某个教官中心下的学校列表页面scheduleSchoolList
 */
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/schedule/scheduleBureauEdu.html'),
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
            /*_this.getscheduleBurData();*/
        },
        events:{
            "click .Getinto":"GetintoFun"
        },
        GetintoFun:function(_event){
            /*教官中心(教育局)列表中的进入详情按钮事件,进入学校列表页面*/
            _event.stopPropagation();
            var _event = _event || event;
            var eventobj = _event.srcElement?_event.srcElement:_event.target;
            var $this=$(eventobj);
                //教育局下的教官中心人员
            var obj={
                 projectId:_jsonObject.projectId,
                 organId:$this.attr("organ_id")
           };
           location.href="#scheduleSchoolList/"+JSON.stringify(obj);

        },
        getscheduleBurData:function(){
            var paramjson={project_id:_jsonObject.projectId};
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.organSchedule, JSON.stringify(paramjson), function (_d) {
                var jsondata = _d.resultdata;
                if(jsondata.length>0){
                    for(var i=0;i<jsondata.length;i++){
                        var organ_id=jsondata[i].organ_id;
                        var organ_name=jsondata[i].organ_name;
                        var questionnaire_items=jsondata[i].questionnair_items;
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
                                "<td colspan=\"2\">填写对象：<span class=\"w60 tal\">"+questionnaire_items[j].is_role+"</span></td>"+
                                "<td>下发人数：<span class=\"w60 tal\"><span class=\"typeface2\">"+user_count+"</span>人</span></td>"+
                                "<td>提交人数：<span class=\"w60 tal\"><span class=\"typefaceRed\">"+subuser_count+"</span>人 </span></td></tr>";
                        }
                        theadStr="<thead style=\"\"><tr><th>"+organ_name+"</th>"+
                            "<th>"+questionnaire_items.length+"套</th><th class=\"typeface\">"+pro_user_count+"</th>"+
                            "<th class=\"typeface\">"+pro_subuser_count+"</th>"+
                            "<th> <span class=\"yellowBtn mr20  closeUp\">展开</span> <span class=\"redBtn mr20 Getinto\" organ_id='"+organ_id+"'>进入</span>"+
                            "</th></tr></thead>";

                        $("#scheduleBureauEdu").append(theadStr);
                        $("#scheduleBureauEdu").append("<tbody style=\"display: none\">"+tbodyStr+" </tbody>");
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
        }
    });
});
