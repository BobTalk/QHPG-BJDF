// ================================================================
//  author:文霞
//  createDate: 2017/05/16
//  description: 问卷列表的业务js
//  ===============================================================
/*window.onload=function(){
    //获取用户信息
    var userId=getUrlPara("uid");
    var serverId=getUrlPara("action");
    var userRole=getUrlPara("action");
    var gradeId=getUrlPara("action");
    var classId=getUrlPara("action");

    getQueList();
};*/
/*$(window).on("load",function(){
    pagePlugin.init($(".datelist_page"),5,function(pageIndex){
        getDataFromDatabase(pageIndex);
    });
    pagePlugin.renderPaging(21,5);
});
var getDataFromDatabase=function(pageIndex){
    //do something
    pagePlugin.renderPaging(21,5);//rows,dataCount;
};*/

$(window).on("load",function(){
    getQueList();
});
var getQueList=function(){
    var ajaxobj = {
        itype: "get",
        iname: "client/questionnaireController/getQuestionnaireList"
    };
    var actobj = {//url:    uid=user1&serid=sch_1&role=学生&grade_id=1&grade_name=一年级       { "user_id":"user1","server_id":"sch_1","user_role":"学生","grade_name":"一年级","grade_id":"1"}
        "user_id": _UserObject.user_id,
        "server_id": _UserObject.server_id,
        "user_role": _UserObject.user_role,
        "grade_id": _UserObject.grade_id,
        "grade_name":_UserObject.grade_name,
        "page_size": 10000,
        "page_num": 1
    };
    parent.window.alertpop('LoadToast');

    getdata(ajaxobj, actobj, function (data) {
        parent.window.alertclose();
        if (data.resultnum != "0000") {
            return;
        }
        var jsondata = data.resultdata;
        var queListDiv=$('<div>');
        for(var i=0;i<jsondata.length;i++){
            var quesClone=$("#quesTpl").clone();
            quesClone.removeAttr("id").css('display','block');
            quesClone.find(".questionnaireTitle").html(jsondata[i].questionnaire_name);
            //时间转换
            var endTime = new Date(jsondata[i].end_time);
            quesClone.find(".questionnaireEndTime").html("截止时间："+endTime.getFullYear()+"年"+(endTime.getMonth() + 1)+"月"+endTime.getDate()+"日");
            var stateText="",stateClass="",authority;
            if(jsondata[i].user_role==_UserObject.user_role){//说明当前用户有填写权限
                //显示：未填写、未提交、已提交   //问卷状态：0=未填报；1=填报中；2=已填报；
                switch(jsondata[i].submit){
                    case 0:
                        if(jsondata[i].save==0){
                            stateText="未填写";
                            stateClass="unfilledTxt";
                            authority=0;
                            break;
                        }else{//save=1
                            stateText="未提交";
                            stateClass="uncommittedTxt";
                            authority=1;
                            break;
                        }
                    case 1:
                        stateText="已提交";
                        stateClass="submittedTxt";
                        authority=2;
                        break;
                }
            }else{
                stateText="可查看";
                stateClass="submittedTxt";
                authority=3;
            }
            quesClone.attr("data-authority",authority);
            quesClone.attr("data-projectid",jsondata[i].project_id);
            quesClone.attr("data-taskid",jsondata[i].task_id);
            quesClone.attr("data-quesid",jsondata[i].questionnaire_id);

            quesClone.find(".fillState").html(stateText).addClass(stateClass);
            queListDiv.append(quesClone);
        }
        $("#quesListWrapper").html(queListDiv.html());

        //定义问卷元素的点击事件
        $(".questionnaireListBox").on("click",function(){
            var displayHeight=$(window).height()-50;
            //将authority权限写入url:0未填写\1未提交\2已提交\3可查看
            //url中需要的key ：authority,project_id，task_id，questionnaire_id,uid,serid,role
//        $("#questionhtml").css('display','block').attr("src","http://112.126.91.234:8080/QHPG/web/Client/questionhtml/4205767110f64b8082b3fc5e02154f80.html?proid=48388c9b7970466aafe274f776fa5142&taskid=8362839858f647878f5276a3e902025a&wjid=4205767110f64b8082b3fc5e02154f80&qustate=0&state=0&uid=a6cc4a6a747d438d817f5472ee3d39f5&serid=227b2b0b4932411a99130383710c2cad&role=%E5%AD%A6%E7%94%9F&classn=3%E7%8F%AD&graden=%E5%9B%9B%E5%B9%B4%E7%BA%A7&xxmc=%E8%B5%B5%E5%85%A8%E8%90%A5%E4%B8%AD%E5%B0%8F&uname=%E5%88%98%E5%85%B4&sex=0&bjid=ca4d4144039c408ab0777872df24b659&njid=%E5%9B%9B%E5%B9%B4%E7%BA%A7").css("display","block");
            var currentQues=$(event.target);
            currentQues=currentQues.hasClass("questionnaireList")?currentQues: currentQues.parents('.questionnaireList');
            var authority=currentQues.attr("data-authority");
            var projectId=currentQues.attr("data-projectid");
            var taskId=currentQues.attr("data-taskid");
            var quesId=currentQues.attr("data-quesid");
            debugger;

            $("#questionhtml").css('display','block');
//            $("#questionhtml").attr("src","../questionhtml/answerList20170517.html?authority=0&project_id=43b71915-7e43-bec5-d928-d82da9a3809b&task_id=739149fd-f1ef-eeb9-a06e-8c170f406ea2&questionnaire_id=1&uid=user1&serid=sch_1&role=学生");

            $("#questionhtml").attr("src","../questionhtml/answerList20170517.html?authority="+authority+"&project_id="+projectId+"&task_id="+taskId+"&questionnaire_id="+quesId
                +"&uid="+_UserObject.user_id+"&serid="+_UserObject.server_id+"&role="+_UserObject.user_role);
            $("#questionhtml").css('height',displayHeight);
            $("#quesListWrapper").hide();
        });
    });
};