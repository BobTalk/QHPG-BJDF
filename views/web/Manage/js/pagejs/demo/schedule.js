// ================================================================
//  author:wyx  ==》  wenxia
//  createDate: 2017/5/3.
//  description: 清华评估-新建项目
//  ===============================================================
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/demo/schedule.html'),
        template = _.template(tpl), _this;
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
            var me=this;
            var form=PublicUTIL.layForm;
            PublicUTIL.layElement.init();
            form.render();

            //可使用的projectId：  474abaa9-98ea-b104-874a-35a98fcac2b4
            me.projectId="474abaa9-98ea-b104-874a-35a98fcac2b4";

            me.initEvent();
            //初始化页面弹层及事件
            me.initModal();

            //查询问卷\量表\附件 列表,渲染taskTemplate中的问卷\量表\附件 列表
            me.changeQuesList("taskEditTemplate");
            me.getscaleList("taskEditTemplate");
            me.getAttachmentList("taskEditTemplate");

            //查询教管中心列表
            me.getOrganList();
        },
        events: {
            "click #projectSave":"projectSave",/* 保存项目 */
            "click #projectUpdate":"changeEdit",/* 显示项目的编辑页面 */
            "click #addSchool":"addSchool", /*添加学校*/
            "click #addTask":"addTask"//,/*添加任务*/  "previewQue"//
//            "click #getSchool":"getSchoolList"//获取学校列表，测试用
        },
        initEvent:function(){
            var me=this;

            var form = PublicUTIL.layForm;//layui.form();
            form.render();

            //时间控件初始化
            layui.use(['laydate'], function(){
                //时间控件
                var laydate = layui.laydate;
                var start = {
                    min: laydate.now()
                    , max: '2099-06-16 23:59:59'
                    , istoday: false
                    , choose: function (datas) {
                        end.min = datas; //开始日选好后，重置结束日的最小日期
                        end.start = datas //将结束日的初始值设定为开始日
                    }
                };

                var end = {
                    min: laydate.now()
                    , max: '2099-06-16 23:59:59'
                    , istoday: false
                    , choose: function (datas) {
                        start.max = datas; //结束日选好后，重置开始日的最大日期
                    }
                };
                document.getElementById('starttime').onclick = function () {
                    start.elem = this;
                    laydate(start);
                };
                document.getElementById('endtime').onclick = function () {
                    end.elem = this;
                    laydate(end);
                };
                //    时间控件结束
            });

            //适用学段的全选事件初始化,学段影响年级显示
            PublicUTIL.initLayuiCheckAll('gradeCheckAll','quesGrade',null,function($this,data){
                //学段勾选项的change
                me.gradeChange($this,data);
            },function($this,data){
                //全选勾选项的change:取消年级的勾选，修改年级各项的disabled
                var checkedAll=$this.parents('.layui-form').find('input[lay-filter="yearCheckAll"]');
                var checkedItem=$this.parents('.layui-form').find('input[lay-filter="quesYear"]');
                //1. 取消勾选
                checkedAll.prop('checked',false);
                checkedItem.prop('checked',false);
                //2. 修改disabled状态
                if(data.elem.checked){
                    checkedAll.prop('disabled',false);
                    checkedItem.prop('disabled',false);
                }else{
                    checkedAll.prop('disabled',true);
                    checkedItem.prop('disabled',true);
                }
                form.render();
            });

            //适用年级的全选事件初始化
            PublicUTIL.initLayuiCheckAll('yearCheckAll','quesYear');

            //问卷列表的全选事件初始化
            PublicUTIL.initLayuiCheckAll('questionnaireCheckAll','quesQuestionnaire','.layui-table');
            //量表列表全选事件初始化
            PublicUTIL.initLayuiCheckAll('scaleCheckAll','scale','.layui-table');
            //附件列表的全选事件初始化
            PublicUTIL.initLayuiCheckAll('attachmentCheckAll','attachment','.layui-table');

            //适用对象change时更新问卷列表、量表列表、附件列表的显示
            form.on('select(quesTarget)', function(data){
                var taskDomId=$(this).parents('.task').attr("id");
                me.changeQuesList(taskDomId);
                me.getscaleList(taskDomId);
                me.getAttachmentList(taskDomId);

                //修改任务名
                $("#"+taskDomId+" .taskName").html(data.value+"任务");
            });

            //监听项目表单提交
            form.on('submit(projectSave)', function(data){
                me.projectSave();
                return false;
            });

            //各个任务块上的“保存”按钮点击事件：保存任务
//            form.on('submit(taskSave)', function(data){
//                var taskDomId=$(data.elem).parents(".task").attr("id");
//                me.taskSave(taskDomId);
//                return false;
//            });
            $("#taskLists").delegate('.taskSave',"click",function(){
                var taskDomId=$(event.target).parents(".task").attr("id");
                me.taskSave(taskDomId);
            });

            //编辑面板的删除任务
            $("#taskLists").delegate(".clearTask","click",function(){
                //数据删除===========================================================================================================
                var taskId= $(this).parents('.task').attr("data-taskid");
                if(taskId){
                    var JSONPARAM={
                        "project_id": me.projectId,
                        "task_id": taskId
                    };
                    //测试，打印
                    console.log(JSON.stringify(JSONPARAM));
                    PublicAjax.ajaxGet(PublicAjax.ajaxUrl.deleteTaskInfo,JSON.stringify(JSONPARAM),function(data){
                        debugger;
                        //页面dom删除
                        $(this).parents('.task').remove();
                    });
                }
                else{
                    //页面dom删除
                    $(this).parents('.task').remove();
                }
            });

        },

        initModal:function(){
            var me=this;
            //将弹层节点移动到body节点下；
            var modal=$('#addSchoolModal');
            $('#addSchoolModal').remove();
            $(document.body).append(modal);

            //教管中心的全选事件初始化
            PublicUTIL.initLayuiCheckAll('organCheckAll','organ','.layui-table',me.getSchoolList,me.getSchoolList);
            //学校的全选事件初始化
            PublicUTIL.initLayuiCheckAll('schoolCheckAll','school','.layui-table');
        },

        //保存项目
        projectSave:function(){
            var projectId=$("#projectEdit").attr("data-projectId")||"";
            var projectName=$("#projectName").val();
            var descript=$("#projectRemark").val();
            var startTime=$("#starttime").val();
            var endTime=$("#endtime").val();
            var createUserId="userid00001";

            var JSONPARAM={
                "project_id": projectId,
                "project_name": projectName,
                "descript": descript,
                "start_time": startTime,
                "end_time": endTime,
                "create_user_id": createUserId
            };
            //测试，打印
            console.log(JSON.stringify(JSONPARAM));
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.saveProjectInfo,JSON.stringify(JSONPARAM),function(data){
                //获取project_id，更新到projectEdit上，更新project信息时也会返回，所以不用做判断
                var projectIdAdd=data.resultdata.project_id;//"";
                $("#projectEdit").attr("data-projectId",projectIdAdd).hide();

                //保存成功之后显示项目信息显示面板
                $("#projectNameDis").html(projectName);
                $("#projectTimeDis").html(startTime+"——"+endTime);
                $("#projectRemarkDis").html(descript);
                $("#projectDisplay").show();

                //显示添加任务按钮，理论上只有添加了任务之后才需要执行；这里先不做判断
                $("#addTask").show();
            });

//            PublicAjax.ajaxPost(PublicAjax.ajaxUrl.saveProjectInfo,JSONPARAM,function(data){
//                debugger;
//                var projectIdAdd=data.resultdata.project_id;//"";
//
//            });
        },
        //编辑项目按钮的点击事件：显示项目的编辑页面
        changeEdit:function(){
            $("#projectDisplay").hide();
            $("#projectEdit").show();
        },
        //“添加任务”按钮的 点击事件：添加一个任务块
        addTask:function(){
            var taskClone=$('#taskEditTemplate').clone();
            taskClone.removeAttr("id");
            taskClone.css('display','block');
            //生成taskDomid，只用于前端代码处理，与业务无关，不是任务id
            var taskDomId="task"+Math.floor(Math.random()*1000000);
            taskClone.attr("id",taskDomId);
            $("#taskLists").append(taskClone);
            PublicUTIL.layElement.init();
            PublicUTIL.layForm.render();
        },
        //更改学段勾选，
        gradeChange:function($this,data){
            var me=this;
            var form = PublicUTIL.layForm;
            //1.影响年级，影响disabled状态，========================
            var targetVal=data.value;
            switch(targetVal){
                case '小学':
                    if(data.elem.checked){
                        $this.parents('.layui-form').find('input[data-belong="小学"]').prop('disabled',false);
                    }else{
                        $this.parents('.layui-form').find('input[data-belong="小学"]').prop('disabled',true);
                    }
                    break;
                case '初中':
                    if(data.elem.checked){
                        $this.parents('.layui-form').find('input[data-belong="初中"]').prop('disabled',false);
                    }else{
                        $this.parents('.layui-form').find('input[data-belong="初中"]').prop('disabled',true);
                    }
                    break;
                case '高中':
                    if(data.elem.checked){
                        $this.parents('.layui-form').find('input[data-belong="高中"]').prop('disabled',false);
                    }else{
                        if(!$this.parents('.layui-input-block').find('input[value="职高"]').prop('checked')){
                            $this.parents('.layui-form').find('input[data-belong="高中"]').prop('disabled',true);
                        }
                    }
                    break;
                case '职高':
                    if(data.elem.checked){
                        $this.parents('.layui-form').find('input[data-belong="高中"]').prop('disabled',false);
                    }else{
                        if(!$this.parents('.layui-input-block').find('input[value="高中"]').prop('checked')){
                            $this.parents('.layui-form').find('input[data-belong="高中"]').prop('disabled',true);
                        }
                    }
                    break;
            }
            //全部年级项取消勾选
            $this.parents('.layui-form').find('input[lay-filter="yearCheckAll"]').prop('checked',false);
            $this.parents('.layui-form').find('input[lay-filter="quesYear"]').prop('checked',false);
            form.render('checkbox');
            //2.更新问卷列表========================

            //获取taskDomId
            var taskDomId=$this.parents('.task').attr("id");
            me.changeQuesList(taskDomId);
        },
        //获取问卷信息列表
        changeQuesList:function(taskDomId){
            //获取适用对象内容
            var useRole=$("#"+taskDomId).find('[lay-filter="quesTarget"]').val();
            //获取适用学段数组
            var quesGradeList=$("#"+taskDomId).find('input[lay-filter="quesGrade"]');
            var useXueduan=[];
            for(var i=0;i<quesGradeList.length;i++){
                if(quesGradeList[i].checked){
                    useXueduan.push(quesGradeList[i].value);
                }
            }
            var JSONPARAM={
                use_role:useRole,
                use_xueduan_items:useXueduan,
                page_size:'10000',
                page_num:'1'
            };
            //测试，打印
            //console.log(JSON.stringify(JSONPARAM));
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getQuestionnaireList,JSON.stringify(JSONPARAM),function(data){
                //问卷列表渲染
                var quesList=data.resultdata;
                var dataWrapper=$("<table>");
                for(var i=0;i<quesList.length;i++){
                    var quesTr=$('<tr>');
                    var quesTd1=$('<td>');
                    quesTd1.html('<input name="quesQuestionnaire" lay-skin="primary" type="checkbox" lay-filter="quesQuestionnaire" data-quesid="'+quesList[i].questionnaire_id+'" data-quesname="'+quesList[i].questionnaire_name +'">');
                    var quesTd2=$('<td>');
                    quesTd2.html(quesList[i].questionnaire_name);
                    var quesTd3=$('<td>');
                    quesTd3.html('<a class="layui-btn layui-btn-normal layui-btn-radius" >预览</a>');
                    quesTr.append(quesTd1);
                    quesTr.append(quesTd2);
                    quesTr.append(quesTd3);

                    dataWrapper.append(quesTr);
                }
                $("#"+taskDomId+" .quesTbody").html(dataWrapper.find("tbody").html());

                //layui的checkbox渲染
                var form = PublicUTIL.layForm;//layui.form();
                form.render();
            });
        },
        //获取量表信息列表
        getscaleList:function(taskDomId){
            //获取适用对象内容
            var useRole=$("#"+taskDomId).find('[lay-filter="quesTarget"]').val();
            var JSONPARAM={
                use_role:useRole/*,
                page_size:'10000',
                page_num:'1'*/
            };
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getscaleList,JSON.stringify(JSONPARAM),function(data){
                //量表列表渲染
                var scaleList=data.resultdata;
                var dataWrapper=$("<table>");
                for(var i=0;i<scaleList.length;i++){
                    var currTr=$('<tr>');
                    var currTd1=$('<td>');
                    currTd1.html('<input name="scale" lay-skin="primary" type="checkbox" lay-filter="scale" data-scaleid="'+scaleList[i].scale_id +'" data-scalename="'+ scaleList[i].scale_name +'">');
                    var currTd2=$('<td>');
                    currTd2.html(scaleList[i].scale_name);
                    var currTd3=$('<td>');
                    currTd3.html('<a class="layui-btn layui-btn-normal layui-btn-radius" >预览</a>');

                    currTr.append(currTd1);
                    currTr.append(currTd2);
                    currTr.append(currTd3);

                    dataWrapper.append(currTr);
                }
                $("#"+taskDomId+" .scaleTbody").html(dataWrapper.find("tbody").html());

                //layui的checkbox渲染
                var form = PublicUTIL.layForm;//layui.form();
                form.render();
            });
        },
        //获取资料（附件）信息列表
        getAttachmentList:function(taskDomId){
            //获取适用对象内容
            var useRole=$("#"+taskDomId).find('[lay-filter="quesTarget"]').val();
            var JSONPARAM={
                use_role:useRole
            };
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getAttachmentList,JSON.stringify(JSONPARAM),function(data){
                //附件列表渲染
                var attachmentList=data.resultdata;
                var dataWrapper=$("<table>");
                for(var i=0;i<attachmentList.length;i++){
                    var currTr=$('<tr>');
                    var currTd1=$('<td>');
                    currTd1.html('<input name="attachment" lay-skin="primary" type="checkbox" lay-filter="attachment" data-attaid="'+attachmentList[i].attachment_id +'" data-attaname="'+attachmentList[i].attachment_name +'" data-standtype="'+attachmentList[i].stand_type_name +'">');
                    var currTd2=$('<td>');
                    currTd2.html(attachmentList[i].attachment_name);
                    var currTd3=$('<td>');
                    currTd3.html(attachmentList[i].stand_type_name);
                    var currTd4=$('<td>');
                    currTd4.html('<a class="layui-btn layui-btn-normal layui-btn-radius" >预览</a>');

                    currTr.append(currTd1).append(currTd2).append(currTd3).append(currTd4);

                    dataWrapper.append(currTr);
                }
                $("#"+taskDomId+" .attachmentTbody").html(dataWrapper.find("tbody").html());

                //layui的checkbox渲染
                var form = PublicUTIL.layForm;//layui.form();
                form.render();
            });
        },

        //保存任务
        taskSave:function(taskDomId){
            var me=this;
            var taskId=$("#"+taskDomId).attr("data-taskid")||"";
            var taskName=$("#"+taskDomId+" .taskName").html();
            var inRole=$("#"+taskDomId+' select[lay-filter="quesTarget"]').val();
            //验证是否勾选了年级
            var gradeChecked=$("#"+taskDomId).find('input[lay-filter="quesYear"]:checked');
            if(gradeChecked.length==0){
                layer.msg("请勾选年级！");
                return;
            }
            //验证是否勾选了问卷、量表或附件
            var queChecked=$("#"+taskDomId+" .quesTbody").find('input[lay-filter="quesQuestionnaire"]:checked');
            var attaChecked=$("#"+taskDomId+" .attachmentTbody").find('input[lay-filter="attachment"]:checked');
            var scaleChecked=$("#"+taskDomId+" .scaleTbody").find('input[lay-filter="scale"]:checked');
            if(queChecked.length==0&&attaChecked.length==0&&scaleChecked.length==0){
                layer.msg("请勾选调研方式！");
                return;
            }
            //验证是否选择了学校
            var schoolChecked=$("#"+taskDomId+" .schoolCheckedTbody tr");
            if(schoolChecked.length==0){
                layer.msg("请添加学校！");
                return;
            }


            var taskGradeItems=[];
            var taskGradeStr="";
            for(var i=0;i<gradeChecked.length;i++){
                taskGradeItems.push(
                    {
                        grade_id:gradeChecked[i].value,
                        grade_name:gradeChecked[i].title
                    }
                );

                if(taskGradeStr){
                    taskGradeStr+=",";
                }
                taskGradeStr+=gradeChecked[i].title;
            }
            var taskQuestionnaireItems=[],taskAttachmentItems=[],taskScaleItems=[];
            for(var i=0;i<queChecked.length;i++){
                taskQuestionnaireItems.push(
                    {
                        questionnaire_id:$(queChecked[i]).attr("data-quesid"),
                        questionnaire_name:$(queChecked[i]).attr("data-quesname")
                    }
                );
            }
            for(var i=0;i<scaleChecked.length;i++){
                taskScaleItems.push(
                    {
                        scale_id:$(scaleChecked[i]).attr("data-scaleid"),
                        scale_name:$(scaleChecked[i]).attr("data-scalename")
                    }
                );
            }
            for(var i=0;i<attaChecked.length;i++){
                taskAttachmentItems.push(
                    {
                        attachment_id:$(attaChecked[i]).attr("data-attaid"),
                        attachment_name:$(attaChecked[i]).attr("data-attaname"),
                        stand_type_name:$(attaChecked[i]).attr("data-standtype")
                    }
                );
            }

            //获取适用学段数组
            var quesGradeChecked=$("#"+taskDomId).find('input[lay-filter="quesGrade"]:checked');
            var useXueduan="";
            for(var i=0;i<quesGradeChecked.length;i++){
                if(useXueduan){
                    useXueduan+=",";
                }
                useXueduan+=quesGradeChecked[i].value;
            }

            var taskSchoolItems=[];
            for(var i=0;i<schoolChecked.length;i++){//遍历教管中心表，每行有多条学校数据
                var schoolTr=JSON.parse($(schoolChecked[i]).attr("data-schoollist"));
                taskSchoolItems=taskSchoolItems.concat(schoolTr);
            }

            var JSONPARAM={
                "project_id": me.projectId,
                "task_item": {
                    "task_id": taskId,
                    "task_name": taskName,
                    "description": "",
                    "in_role": inRole,
                    "task_xueduans": useXueduan,
                    "task_grade_items": taskGradeItems,
                    "task_questionnaire_items": taskQuestionnaireItems,
                    "task_school_items": taskSchoolItems,
                    "task_attachment_items": taskAttachmentItems,
                    "task_scale_items": taskScaleItems
                }
            };
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.saveProjectTaskInfo,JSON.stringify(JSONPARAM),function(data){
                /*project_id : "474abaa9-98ea-b104-874a-35a98fcac2b4"
                 task_id  :  "ef3adb49-20f2-ba6d-5840-e2e4ba32d14d"*/
                //原编辑div删除，添加新的task显示div
                var taskDisClone=$("#taskDisplayTemplate").clone();
                taskDisClone.removeAttr("id");
                taskDisClone.css('display','block');
                //生成taskDomid，只用于前端代码处理，与业务无关，不是任务id
                var taskDisDomId="taskDis"+Math.floor(Math.random()*1000000);
                taskDisClone.attr("id",taskDisDomId);

                //任务名称
                taskDisClone.find(".taskName").html($("#"+taskDomId+" .taskName").html());
                //任务id
                taskDisClone.attr("data-taskid",data.resultdata.task_id);


                //数据渲染--适用对象
                taskDisClone.find(".quesTargetDis").html(inRole);
                //数据渲染--适用学段
                taskDisClone.find(".quesGradeDis").html(useXueduan);
                //数据渲染--适用年级
                taskDisClone.find(".quesYearDis").html(taskGradeStr);
                taskDisClone.find(".quesYearDis").attr("data-quesyear",JSON.stringify(taskGradeItems));
                //数据渲染--问卷、量表、附件
                var quesDisStr="",scaleDisStr="",attaDisStr="";
                for(var i=0;i<taskQuestionnaireItems.length;i++){
                    quesDisStr+='<tr><td>'+taskQuestionnaireItems[i].questionnaire_name+'</td><td><a class="layui-btn layui-btn-normal layui-btn-radius" >预览</a></td></tr>';
                }
                taskDisClone.find(".quesTbody").html(quesDisStr);
                taskDisClone.find(".quesTbody").attr("data-ques",JSON.stringify(taskQuestionnaireItems));

                for(var i=0;i<taskScaleItems.length;i++){
                    scaleDisStr+='<tr><td>'+taskScaleItems[i].scale_name+'</td><td><a class="layui-btn layui-btn-normal layui-btn-radius" >预览</a></td></tr>';
                }
                taskDisClone.find(".scaleTbody").html(scaleDisStr);
                taskDisClone.find(".scaleTbody").attr("data-ques",JSON.stringify(taskScaleItems));

                for(var i=0;i<taskAttachmentItems.length;i++){
                    attaDisStr+='<tr><td>'+taskAttachmentItems[i].attachment_name+'</td><td>'+taskAttachmentItems[i].stand_type_name+'</td><td><a class="layui-btn layui-btn-normal layui-btn-radius" >预览</a></td></tr>';
                }
                taskDisClone.find(".attachmentTbody").html(attaDisStr);
                taskDisClone.find(".attachmentTbody").attr("data-ques",JSON.stringify(taskAttachmentItems));

                //数据渲染--学校
                taskDisClone.find(".schoolCheckedTbody").html($("#"+taskDomId).find(".schoolCheckedTbody").html());
                taskDisClone.find(".schoolCheckedTbody .deleteOrgan").remove();//移除删除按钮

                //将div添加到dom中
                $("#"+taskDomId).after(taskDisClone);
                $("#"+taskDomId).remove();

                //注册学校列表行的查看事件
                me.showSchoolDetail(taskDisDomId);
            });
        },

        //问卷预览
        previewQue:function(){
            //弹层设置问卷
            layer.open({
                type:1,
                title:'问卷预览'
                ,content: '<iframe id="paperiframe" name="paperiframe" style="height: 590px;;width: 100%;border: 0;" src="tpl/demo/dataTable.html"></iframe>',// $('#modal').html(),//tplArr.join(""),//$('#modal'),////'页面内容字符串',
                skin:'layui-layer-molv',//layui-layer-lan layui-layer-molv
                area: ['600px', '500px'],
                offset:'100px'//['100px','50px'],//位置偏移量坐标
                ,btn: ['返回']//['按钮一', '按钮二', '按钮三']
                ,yes: function(index, layero){//确定按钮回调方法，默认不关闭？！
                    layer.close(index);
                }
                ,btnAlign: 'c'
                ,closeBtn:2//关闭按钮的风格
                ,shade: [0.8, '#393D49']//0
                ,shadeClose:true//是否点击遮罩关闭
                ,maxmin:true
                ,resize:false
                ,scrollbar:false//屏蔽浏览器滚动条
                ,move: false
                ,success: function(layero, index){
                }
                ,end:function(){
                    //层销毁之后触发的回调，确定或者关闭都会执行
                }
            });
        },

        //获取教管中心信息列表
        getOrganList:function(){
            var me=this;
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getOrganList,"",function(data){
                //教管中心列表渲染
                var organList=data.resultdata;
                var dataWrapper=$("<table>");
                for(var i=0;i<organList.length;i++){
                    var currTr=$('<tr>');
                    var currTd1=$('<td>');
                    currTd1.html('<input name="quesEdu" lay-skin="primary" type="checkbox" lay-filter="organ" data-organid="'+organList[i].organ_id +'" data-organname="'+organList[i].organ_name +'">');
                    var currTd2=$('<td>');
                    currTd2.html(organList[i].organ_name);
                    currTr.append(currTd1);
                    currTr.append(currTd2);

                    dataWrapper.append(currTr);
                }
                $("#organTbody").html(dataWrapper.find("tbody").html());

                //layui的checkbox渲染
                var form = PublicUTIL.layForm;//layui.form();
                form.render();

                /*//教管中心checkbox的勾选事件
                form.on('checkbox(organ)', function(data){
                    me.getSchoolList();
                });
                //教管中心全选的勾选事件
                $('input[lay-filter="organCheckAll"]').on("click",function(){
                    console.log("触发了点击事件");
                    me.getSchoolList();
                });*/

            });
        },
        //获取学校信息列表
        getSchoolList:function(){
            //修改学校信息部分的显示
            $("#schoolTableWrapper").show();
            $("#schoolTableWrapper").prev().hide();
            //取消学校信息列表的全选
            $('input[lay-filter="schoolCheckAll"]').prop("checked",false);
            //layui的checkbox渲染
            var form = PublicUTIL.layForm;//layui.form();
            form.render();

            //获取勾选的教管中心列表
            var organChecked=$("#organTbody").find('input[lay-filter="organ"]:checked');
            if(organChecked.length==0){
                $("#schoolTableWrapper").hide();
                $("#schoolTableWrapper").prev().show();
                $("#schoolTbody").html();
                return;
            }
            var organItems=[];
            for(var i=0;i<organChecked.length;i++){
                organItems.push($(organChecked[i]).attr("data-organid"));
            }
            var schoolType=$("#schoolModalGrade").html().split(',');
            var JSONPARAM={
                school_types:schoolType,
                organ_ids:organItems
            };
            //测试，打印
//            console.log("getSchoolList——"+JSON.stringify(JSONPARAM));
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getSchoolList,JSON.stringify(JSONPARAM),function(data){
                //渲染学校列表
                var schoolList=data.resultdata;
                var dataWrapper=$("<table>");
                for(var i=0;i<schoolList.length;i++){//p_serverId, p_serverName
                    var currTr=$('<tr>');
                    var currTd1=$('<td>');
                    currTd1.html('<input name="school" lay-skin="primary" type="checkbox" lay-filter="school" data-schoolid="'+schoolList[i].school_id +'" data-schoolname="'+schoolList[i].school_name +'" data-serverId="'+schoolList[i].p_organ_id +'">');
                    var currTd2=$('<td>');
                    currTd2.html(schoolList[i].school_name);
                    currTr.append(currTd1);
                    currTr.append(currTd2);

                    dataWrapper.append(currTr);
                }
                $("#schoolTbody").html(dataWrapper.find("tbody").html());

                //layui的checkbox渲染
//                var form = PublicUTIL.layForm;//layui.form();
                form.render();
            });

        },
        //各个任务中“添加学校”按钮点击事件
        addSchool:function(){
            var me=this;
            //根据当前选择的学段，显示学校列表
            var quesGradeStr='';
            var quesGradeChecked=$(event.target).parents('.layui-form').find('input[lay-filter="quesGrade"]:checked');
            if(quesGradeChecked.length==0){
                PublicUTIL.layLayer.msg('请先选择学段！', {
                    icon: 0,
                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                });
                return;
            }
            for(var i=0;i<quesGradeChecked.length;i++){
                if(quesGradeStr){
                    quesGradeStr+=',';
                }
                quesGradeStr+=quesGradeChecked[i].value;
            }

            $("#schoolModalGrade").html(quesGradeStr);

            var taskDomId=$(event.target).parents('.task').attr("id");

            //弹层设置问卷
            layer.open({
                type:1,
                title:'添加学校'
                ,content: $('#addSchoolModal'),// $('#modal').html(),//tplArr.join(""),//$('#modal'),////'页面内容字符串',
                skin:'layui-layer-molv',
                area: ['600px', '500px'],
                offset:'100px'
                ,btn: ['保存','返回']//['按钮一', '按钮二', '按钮三']
                ,yes: function(index, layero){//确定按钮回调方法，默认不关闭？！
                    //获取弹层中表单数据
                    //获取适用对象
                    /*var quesTargetList = $("#addSchoolModal").find('input[name="quesTarget"]:checked');
                    var quesTargetStr="";
                    for(var i=0;i<quesTargetList.length;i++){
                        if(quesTargetStr){
                            quesTargetStr+=",";
                        }
                        quesTargetStr += $(quesTargetList[i]).val();
                    }
                    var quesGradeList = $("#addSchoolModal").find('input[name="quesGrade"]:checked');
                    var quesGradeStr="";
                    for(var i=0;i<quesGradeList.length;i++){
                        if(quesGradeStr){
                            quesGradeStr+=",";
                        }
                        quesGradeStr += $(quesGradeList[i]).val();
                    }
//                    debugger;
                    console.log(quesTargetStr+"   "+quesGradeStr);*/

                    var resultList=[];
                    //获取勾选的教管中心
                    var organChecked=$("#addSchoolModal").find('input[lay-filter="organ"]:checked');
                    //获取勾选的学校id，并添加到相应的教管中心中
                    var schoolChecked=$("#addSchoolModal").find('input[lay-filter="school"]:checked');
                    var schoolCheckCount=schoolChecked.length;

                    for(var i=0;i<organChecked.length;i++){
                        var resultItem={
                            organId:"",
                            organName:"",
                            schoolList:[]
                        };
                        var organId=$(organChecked[i]).attr("data-organid");
                        var organName=$(organChecked[i]).attr("data-organname");
                        resultItem.organId=organId;
                        resultItem.organName=organName;

                        resultList.push(resultItem);
                    }

                    for(var i= 0;i<schoolChecked.length;i++){
                        var schoolId=$(schoolChecked[i]).attr("data-schoolid");
                        var schoolName=$(schoolChecked[i]).attr("data-schoolname");
                        var organId=$(schoolChecked[i]).attr("data-serverId");
                        var schoolItem={
                            school_id:schoolId,
                            school_name:schoolName
                        };
                        for(var j= 0;j<resultList.length;j++){
                            if(resultList[j].organId==organId){
                                resultList[j].schoolList.push(schoolItem);
                                break;
                            }
                        }
                    }
                    me.showSchoolChecked(taskDomId,resultList,schoolCheckCount);
                    layer.close(index);
                }
                ,btnAlign: 'c'
                ,closeBtn:2//关闭按钮的风格
                ,shade: [0.8, '#393D49']//0
                ,shadeClose:true//是否点击遮罩关闭
                ,maxmin:true
                ,resize:false
                ,scrollbar:false//屏蔽浏览器滚动条
                ,move: false
                ,success: function(layero, index){
                }
                ,end:function(){
                    //层销毁之后触发的回调，确定或者关闭都会执行
                }
            });
        },
        //根据参数显示选择的学校信息
        showSchoolChecked:function(taskDomId,resultList,schoolCheckCount){
            var me=this;
            //将resultList中数据渲染到taskDomId上的学校列表中
            if(schoolCheckCount==0){
                $("#"+taskDomId+" .schoolCheckedTbody").html("");
                $("#"+taskDomId+" .schoolCheckedTbody").parent().hide();
                return;
            }else{
                $("#"+taskDomId+" .schoolCheckedTbody").parent().show();
            }

            var schoolCheckedTable=$("<table>");
            for(var i=0;i<resultList.length;i++){
                if(resultList[i].schoolList.length==0){
                    continue;
                }
                var currTr=$("<tr>");
                currTr.append('<td>'+resultList[i].organName+'</td>');
                var schoolTdStr="1."+resultList[i].schoolList[0].school_name;//+"..."+"共"+resultList[i].schoolList.length+"所学校  ";
                if(resultList[i].schoolList[1]){
                    schoolTdStr+=" 2."+resultList[i].schoolList[1].school_name;
                }
                schoolTdStr+="...共"+resultList[i].schoolList.length+"所学校  ";
                currTr.append('<td>'+schoolTdStr+'</td>');
                currTr.append('<td><div class="layui-btn-group"> <a class="layui-btn checkSchoolList" data-organid="'+resultList[i].organId+'">查看</a><a class="layui-btn deleteOrgan">删除</a></div></td>');

                //把数据写到tr上
                currTr.attr("data-schoollist",JSON.stringify(resultList[i].schoolList));
                schoolCheckedTable.append(currTr);
            }
            $("#"+taskDomId+" .schoolCheckedTbody").html(schoolCheckedTable.find("tbody").html());

            //注册删除事件
            $("#"+taskDomId+" .deleteOrgan").on("click",function(){
                $(event.target).parents("tr").remove();

                if(!$("#"+taskDomId+" .schoolCheckedTbody").html()){
                    $("#"+taskDomId+" .schoolCheckedTbody").parent().hide();
                }
            });

            //注册查看事件
            me.showSchoolDetail(taskDomId);
        },
        //查看选择学校列表中，每行的学校详情（一个教管中心包含的学校详情）
        showSchoolDetail:function(taskDomId){
            //注册查看事件
            $("#"+taskDomId+" .checkSchoolList").on("click",function(){
                var schoolStr=$(event.target).parents("tr").attr("data-schoollist");
                var schoolList=JSON.parse(schoolStr);
                var schoolUl=$('<ul>');
                for(var i=0;i<schoolList.length;i++){
                    schoolUl.append('<li>'+(i+1)+'.'+schoolList[i].school_name+'</li>');
                }
                var schoolUlStr='<div class="check-school-show"><ul>'+schoolUl.html()+'</ul></div>';
                layer.open({
                    type:1,
                    title:'学校列表'
                    ,content: schoolUlStr,//'页面内容字符串',
                    skin:'layui-layer-molv',//layui-layer-lan layui-layer-molv
                    area: ['600px', '500px'],
                    offset:'100px'//['100px','50px'],//位置偏移量坐标
                    ,btn: []//['按钮一', '按钮二', '按钮三']
                    ,yes: function(index, layero){//确定按钮回调方法，默认不关闭？！
                        layer.close(index);
                    }
                    ,btnAlign: 'c'
                    ,closeBtn:2//关闭按钮的风格
                    ,shade: [0.8, '#393D49']//0
                    ,shadeClose:true//是否点击遮罩关闭
                    ,maxmin:true
                    ,resize:false
                    ,scrollbar:false//屏蔽浏览器滚动条
                    ,move: false
                    ,success: function(layero, index){
                    }
                    ,end:function(){
                        //层销毁之后触发的回调，确定或者关闭都会执行
                    }
                });

            })
        }
    });
});

