// ================================================================
//  author:文霞
//  createDate: 2017/05/17
//  description: 问卷填报的业务js
//  ===============================================================

var answerItems=[];//提交问卷时候使用“answer_items”:[{“stand_id”:”9843”,”score”:5}]
$(window).on("load",function(){
    //提莫属性tmtype：   single = "单选题", mutil = "多选题"(calcType=1,选择一个就给分；calcType=2，选择的答案大于一个时才给分),right_wrong = "是非题", blank = "填空题"（valType=1整数,2小数保留一位,3小数保留两位,4日期）
    //authority权限写入url:0未填写，显示问卷；\1未提交，显示问卷，显示答案；\2已提交，显示问卷，显示答案，保存、提交按钮不显示；\3可查看，只显示问卷就好，保存、提交按钮不显示；
    var authority=getUrlPara("authority");
    var answerId="";
    //不能答题：按钮不显示
    if(authority==2||authority==3){
        $(".btnBox").remove();
    }//可以答题：初始化按钮点击事件，答题事件
    if(authority==0||authority==1){
        /*加载遮罩层事件*/
        if($( parent.document.body).find("#LoadToast").length==0){
            parent.window.initPopuDiv();
        }
        initControlEvent();
    }
    //判断是否回显答案
    if(authority==1||authority==2){
        //请求答案数据，并显示
        answerId = answersRender();
        /*if(authority==2){
            $(".progressBar .thisNum").html($(".progressBar .sumNum").html());
            $(".progressBar .reticule").css("height","100%");
        }else if(authority==1){
            changeProgressBar();
        }*/
    }

    $("#saveAnswer").on("click",function(){
        saveAnswer();
    });
    $("#submitQuestionnaire").on("click",function(){
        //判断是否有未填写的题目：
        var quesTotal=$(".problem:visible").length;
        var hasAnswer=$(".problem:visible").find(".problemBor").length;
        if(hasAnswer<quesTotal){
            parent.window.alertpop("MsgToast","请将全部问题填写完毕之后再提交");
            return;
        }
        //保存答案
        saveAnswer(function(){
            //成功之后，提交问卷
            var ajaxobj = {
                itype: "get",
                iname: "client/questionnaireController/submitQuestionnaire"//"client/questionnaireController/getQuestionnaireList"
            };
            var actobj = {
                "user_id": _UserObject.user_id,
                "server_id": _UserObject.server_id,
                "project_id": getUrlPara("project_id"),
                "task_id": getUrlPara("task_id"),
                "questionnaire_id": getUrlPara("questionnaire_id"),
                "answer_items":answerItems
            };
            getdata(ajaxobj, actobj, function (data) {
                parent.window.alertclose();
                if (data.resultnum != "0000") {
                    parent.window.alertpop("MsgToast","数据保存失败");
                    return;
                }else{
                    var subId=data.resultdata.sub_id;//{sub_id: 12}
                }
            });
        });
    });
});
//页面控件相关事件
var initControlEvent=function(){
    //单选、多选按钮的点击事件
    //复选框事件
    $("body").delegate(".mutilstli", "click", function (_event) {
        _event.stopPropagation();
        var _event = _event || event;
        var row = _event.srcElement?_event.srcElement:_event.target;
        var $event=$(row);
        if(!$event.hasClass("mutilstli")){
            $event=$event.parents("li");
        }
        if($event.hasClass("checkbox-pitch")){
            $event.removeClass("checkbox-pitch");

        }else{
            $event.addClass("checkbox-pitch");
        }

        //修改题目的已做状态
        var checkedList=$event.parent().children(".checkbox-pitch");
        if(checkedList.length>0){
            if($event.parents(".problem").find(".problemBorNOt")){
                $event.parents(".problem").find(".problemBorNOt").removeClass("problemBorNOt").addClass("problemBor");
                changeProgressBar();
            }
        }else{
            if($event.parents(".problem").find(".problemBor")){
                $event.parents(".problem").find(".problemBor").removeClass("problemBor").addClass("problemBorNOt");
                changeProgressBar();
            }
        }

    });
    // 单选框事件
    $("body").delegate(".singlestli", "click", function (_event) {
        _event.stopPropagation();
        var _event = _event || event;
        var row = _event.srcElement?_event.srcElement:_event.target;
        var $event=$(row);
        if(!$event.hasClass("singlestli")){
            $event=$event.parents("li");//触发事件的有可能是li里的span
        }
        $event.addClass("radio-pitch").siblings().removeClass("radio-pitch");
        var gjszcontentv=$event.parent().attr("gjszcontent");
        if(gjszcontentv!="undefined"&&gjszcontentv!=""){
            gjszcontentv=eval(gjszcontentv);
            gaojishezhi($event.find("input").val(),gjszcontentv);
        }

        //修改题目的已做状态
        if($event.parents(".problem").find(".problemBorNOt")){
            $event.parents(".problem").find(".problemBorNOt").removeClass("problemBorNOt").addClass("problemBor");
            changeProgressBar();
        }
    });
    //input的失去焦点事件
    $("body").delegate('input[type="text"]', "blur", function () {
        event.stopPropagation();
        //验证值是否有效
        var $event=$(event.target);
        var qValue;
        if($event.val()){
            if(isNaN($event.val())){
                parent.window.alertpop("MsgToast","请输入正确的数据类型");
                $(event.target).val("");
                $(event.target).focus();
                return;
            }
            qValue=Number($event.val());
        }else{
            if($event.parents(".problem").find(".problemBor")){
                $event.parents(".problem").find(".problemBor").removeClass("problemBor").addClass("problemBorNOt");
                changeProgressBar();
            }
            return;
        }

        var valueType=$event.parents(".problem").attr("valType");
        switch(valueType){//valType=1整数,2小数保留一位,3小数保留两位,4日期
            case "1":
                if(qValue%1 != 0){
                    $event.val(qValue.toFixed(0));
                    parent.window.alertpop("MsgToast","整数有效");
                }
                break;
            case "2":
                if((qValue*10)%1 != 0){
                    $event.val(qValue.toFixed(1));
                    parent.window.alertpop("MsgToast","一位小数有效");
                }
                break;
            case "3":
                if((qValue*100)%1 != 0){
                    $event.val(qValue.toFixed(2));
                    parent.window.alertpop("MsgToast","两位小数有效");
                }
                break;
        }
        //修改题目的已做状态
        if($event.parents(".problem").find(".problemBorNOt")){
            $event.parents(".problem").find(".problemBorNOt").removeClass("problemBorNOt").addClass("problemBor");
            changeProgressBar();
        }
    });
};
//修改进度条的显示
var changeProgressBar=function(){
    var quesTotal=$(".problem:visible").length;
    var hasAnswer=$(".problem:visible").find(".problemBor").length;
    $(".progressBar .sumNum").html(quesTotal);
    $(".progressBar .thisNum").html(hasAnswer);
    var progress=hasAnswer/quesTotal*100;
    $(".progressBar .reticule").css("height",progress+"%");
};
//从数据库获取并渲染答案
var answersRender=function(){
    var ajaxobj = {
        itype: "get",
        iname: "client/questionnaireController/getQuestionnaireAnswer"
    };
    var actobj = {
        "project_id": getUrlPara("project_id"),
        "task_id": getUrlPara("task_id"),
        "questionnaire_id": getUrlPara("questionnaire_id"),
        "page_num": 1,
        "user_id": _UserObject.user_id,
        "server_id":  _UserObject.server_id
    };
    parent.window.alertpop('LoadToast');
    getdata(ajaxobj, actobj, function (data) {
        parent.window.alertclose();
        if (data.resultnum != "0000") {
            parent.window.alertpop("MsgToast","数据获取失败");
            return;
        }else{
            //正常情况下应该获取一条数据，但是返回的是一个list，所以就取第一条解析吧
            answerId=data.resultdata[0].answer_id;//"5eea0d12-220d-03b3-8a3b-70a15c3794f6"
            var answerContent=JSON.parse(data.resultdata[0].content);
            //渲染答案
            for(var i=0;i<answerContent.length;i++){
                var tmid=answerContent[i].tmid;
                var standid=answerContent[i].standid;
                var optionids=answerContent[i].optionids;
                var score=answerContent[i].score;
                var currentQues = $('.problem[tmid="'+tmid+'"]');
                var tmtype=currentQues.attr("tmtype");
                //修改题目的已填状态样式
                if(currentQues.find(".problemBorNOt")){
                    currentQues.find(".problemBorNOt").removeClass("problemBorNOt").addClass("problemBor");
                }
                switch(tmtype){
                    case 'single'://单选
                        currentQues.find('input[optionid="'+optionids[0]+'"]').parent().addClass("radio-pitch");
                        break;
                    case 'mutil'://多选
                        for(var j=0;j<optionids.length;j++){
                            currentQues.find('input[optionid="'+optionids[j]+'"]').parent().addClass("checkbox-pitch");
                        }
                        break;
                    //其他题型未处理
                    //right_wrong = "是非题", blank = "填空题",question_answer = "问答题",range = "区间题",blank_date = "0_0_199"; //日期类型填空题
                }
            }

            changeProgressBar();
        }
    });
};
//获取页面中的答案
var getAnswer=function(){
    var answerList=[];
    var proList=$(".problem:visible");
    for(var i=0;i<proList.length;i++){
        //{tmid,optionids,standid,score}
        var currentQues = $(proList[i]);
        var tmid=currentQues.attr("tmid");
        var standid=currentQues.attr("standid");
        var optionids=[],score=0;
        //获取选中项
        var tmtype=currentQues.attr("tmtype");
        switch(tmtype){
            case 'single'://单选
                optionids.push(currentQues.find(".radio-pitch input").attr("optionid"));
                score=currentQues.find(".radio-pitch input").attr("score");
                break;
            case 'mutil'://多选
                var checkList=currentQues.find(".checkbox-pitch input");
                //根据计算方式的不同，计算分数结果：calcType=2时，只选择一个答案不给分
                var calcType=currentQues.attr("calcType");
                if(calcType=="2"||checkList.length==1){
                    for(var j=0;j<checkList.length;j++){
                        optionids.push($(checkList[j]).attr("optionid"));
                    }
                }else{
                    for(var j=0;j<checkList.length;j++){
                        optionids.push($(checkList[j]).attr("optionid"));
                        score+=$(checkList[j]).attr("score");
                    }
                }
                break;
            //其他题型未处理
            //right_wrong = "是非题", blank = "填空题",question_answer = "问答题",range = "区间题",blank_date = "0_0_199"; //日期类型填空题
        }
        var item={
            tmid:tmid,
            standid:standid,
            optionids:optionids,
            score:score
        };
        answerList.push(item);
        //将数据添加到answerItems中
        var existStand=false;
        for(var j=0;j<answerItems.length;j++){
            if(answerItems[j].stand_id==standid){
                answerItems[j].score+=score;
                existStand=true;
                break;
            }
        }
        if(!false){
            answerItems.push({stand_id:standid,score:score});
        }
    }
    return answerList;
};
//保存答案
var saveAnswer=function(callback){
    var content=getAnswer();//[];//每个item包含的key:{tmid,optionids,standid,score}
    var ajaxobj = {
        itype: "get",
        iname: "client/questionnaireController/saveAnswer"//"client/questionnaireController/getQuestionnaireList"
    };
    var actobj = {//url中需要的key ：authority,project_id，task_id，questionnaire_id,uid,serid,role
        "answer_id": answerId,
        "user_id": _UserObject.user_id,
        "server_id": _UserObject.server_id,
        "user_role": _UserObject.user_role,//_UserObject.user_role,
        "project_id": getUrlPara("project_id"),
        "task_id": getUrlPara("task_id"),
        "questionnaire_id": getUrlPara("questionnaire_id"),
        "content": JSON.stringify(content),//"",//问卷答案
        "page_num": 1
    };
    parent.window.alertpop('LoadToast',"数据保存中......");
    getdata(ajaxobj, actobj, function (data) {
        parent.window.alertclose();
        if (data.resultnum != "0000") {
            parent.window.alertpop("MsgToast","数据保存失败");
            return;
        }else{
            answerId=data.resultdata.answer_id;//"5eea0d12-220d-03b3-8a3b-70a15c3794f6"
            parent.window.alertpop("MsgToast","数据保存成功");
        }
        if(callback){
            callback();
        }
    });
};

