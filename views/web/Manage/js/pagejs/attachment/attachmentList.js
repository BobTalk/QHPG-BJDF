/**
 * Created by sanghuina on 17/5/12.
 *  附件列表页面
 */
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/attachment/attachmentList.html'),
        template = _.template(tpl), _this,_form;
    var DataTable = require('dataTable1');
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
            if(_this.model._opType=="1"){
                /*1为资源管理员上传,2校长,3公示列表*/
                $("#import").show();
                $("#schoolsearch").hide();
            }else{
                $("#import").hide();
                if(_this.model._opType=="3"){
                    /*公示列表,大家都可以查看,搜索条件有学校*/
                    $("#schoolsearch").show();
                    _this.getSchoolList();
                }else{
                    $("#schoolsearch").hide();
                }
            }
            /* 加载附件列表数据*/
            _this.initDataTableData();
            /*加载所有附件表结构名称*/
            _this.getAttachment();
            /*加载datatable中数据*/
            _form=PublicUTIL.layForm;

        },
        events: {
            "click #import":"importFun",
            "click #select":"selectFun"
        },
        initDataTableData:function(){
            var me=this;
            var options = {
                // 数据来源方法
                data : {
                    // 异步数据源
                    sync : function(syncOptions, callback) {
                        //下面注释的是获取异步数据方法
                        var school="";
                        /*校长和资料管理员只看到自己学校的数据*/
                        if(_this.model._opType!="3"){
                            school=PublicUTIL.UserObject.server_id;
                        }else{
                            school=$("#school").val();
                        }
                        var JSONPARAM={type:_this.model._opType,stand_id:$("#fenlei").find("option:selected").attr("stand_id"),school_id:school,page_num: syncOptions.data.page, page_size: syncOptions.data.rows};
                        PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getAttachmentResultList,JSON.stringify(JSONPARAM),function(data){
                            callback && callback({rows:data.resultdata,total:data.rows});
                        });
                    },
                    // 数据列表的索引
                    dataArrayIndex : 'rows',
                    // 分页参数
                    paging : {
                        enable : true,
                        // 每页数据条数
                        pageSize : 5
                    },
                    collection : Backbone.Collection//DataSourceCollection
                },
                //显示序号列
                displayIndex:true,
                //列显示：项目名称、学校数量、问卷数量、任务数量、项目期限、项目状态、操作
                columns : [
                    {
                        text : "资料名称",
                        dataIndex : "attachment_name"
                    },
                    {
                        text : "上传项数",
                        render:function(value, row){//将类型转为文字
                            var json=JSON.parse(row["attachment_term_resultjson"]);
                            return json.length;
                        }
                    },
                    {
                        text : "上传时间",
                        render:function(value, row){//将类型转为文字
                            return row["create_time"].substring(0,10);
                        }
                    },
                    {
                        text : "操作",
                        render:function(value, row){
                            /*0保存(修改,删除,提交)；1 提交(查看,申请修改)，2是审批通过(查看)，3为驳回*/
                            var state=row["state"];
                            if(state==0||state==3){
                                return "<a class='editData greenBtnTxt' data-id='"+row["id"]+"' attachment_id='"+row["attachment_id"]+"'>修改</a><a class='submitData greenBtnTxt' data-id='"+row["id"]+"' attachment_id='"+row["attachment_id"]+"'>提交</a><a class='deleteData redBtnTxt' data-id='"+row["id"]+"' attachment_id='"+row["attachment_id"]+"'>删除</a>";
                            }else if(state==1){
                                if(_this.model._opType=="1"){
                                    /*资料管理员看到此状态数据*/
                                    return "<a class='checkData greenBtnTxt' data-id='"+row["id"]+"' attachment_id='"+row["attachment_id"]+"'>查看</a>";
                                }else{
                                    /*校长看到此状态数据*/
                                    return "<a class='examineData greenBtnTxt' data-id='"+row["id"]+"' attachment_id='"+row["attachment_id"]+"' scoreall='"+row["score"]+"'>审批</a><a class='checkData greenBtnTxt' data-id='"+row["id"]+"' attachment_id='"+row["attachment_id"]+"'>查看</a>";
                                }
                             }else if(state==2){
                                return "<a class='checkData greenBtnTxt' data-id='"+row["id"]+"' attachment_id='"+row["attachment_id"]+"'>查看</a>";
                            }else{
                                return "<a class='checkData greenBtnTxt' data-id='"+row["id"]+"' attachment_id='"+row["attachment_id"]+"'>查看</a>";
                            }
                        }
                    }],
                // 默认多选模式
                "selModel" : {
                    // single/multi,为空则不显示
                    mode :  "",
                    // 是否显示行的checkbox
                    checkbox : false,
                    //定义选中的数据列表
                    selectData:{
                        keyword:"XM",
                        selectDataValue:["张月月","白宇熙"]//["1","232423","232424","232432","232435"]
                    },
                    keepCheckState:{//保持勾选状态才能获取全部的勾选数据
                        keepCheck:true,
                        keepStateKeyword:"XM"
                    }
                },
                //表头、表数据初始化完成后调用
                initTableEventsCall : function(){
                    //为table中的删除按钮添加事件：
                    me.$(".deleteData").click(function(_event){
                        _event.stopPropagation();
                        var $obj=$(event.target);
                        var needDelId=$obj.attr("data-id");
                        var attachment_id=$obj.attr("attachment_id");
                        PublicUTIL.message("confirm","确认删除该资料？",function(){
                            //项目状态 - 0：保存;1：发布;2：已删除;
                            var JSONPARAM={id:needDelId,state:-1 };
                            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.updateAttachmentState,JSON.stringify(JSONPARAM),function(data){
                                PublicUTIL.message("success","资料删除成功");
                                $obj.parents("tr").remove();
                            });
                        });
                    });
                    //为table中的编辑按钮添加事件：
                    me.$(".editData").click(function(_event){
                        _event.stopPropagation();
                        var needEditId=$(event.target).attr("data-id");
                        var attachment_id=$(event.target).attr("attachment_id");
                        var obj={
                            "type":_this.model._opType,
                            "spk":needEditId
                        };
                        location.href="#attachment/2/"+attachment_id+"/"+JSON.stringify(obj);
                    });
                    //为table中的申请修改按钮添加事件：
                    me.$(".editSubmit").click(function(_event){
                        _event.stopPropagation();
                        var $obj=$(event.target);
                        var needEditId=$obj.attr("data-id");
                        var attachment_id=$obj.attr("attachment_id");
                        $obj.parent().html("<a class='editData greenBtnTxt' data-id='"+needEditId+"' attachment_id='"+attachment_id+"'>修改</a><a class='submitData greenBtnTxt' data-id='"+needEditId+"' attachment_id='"+attachment_id+"'>提交</a><a class='deleteData redBtnTxt' data-id='"+needEditId+"' attachment_id='"+attachment_id+"'>删除</a>");
                    });
                    //为table中的查看按钮添加事件：
                    me.$(".checkData").click(function(_event){
                        _event.stopPropagation();
                        var needEditId=$(event.target).attr("data-id");
                        var attachment_id=$(event.target).attr("attachment_id");
                        var obj={
                            "type":_this.model._opType,
                            "spk":needEditId
                        };
                        location.href="#attachment/3/"+attachment_id+"/"+JSON.stringify(obj);
                    });
                    //为table中的审批按钮添加事件：
                    me.$(".examineData").click(function(_event){
                        _event.stopPropagation();
                        var needEditId=$(event.target).attr("data-id");
                        var attachment_id=$(event.target).attr("attachment_id");
                        var obj={
                            "type":_this.model._opType,
                            "spk":needEditId,
                            "scoreall":$(event.target).attr("scoreall")
                        };
                        location.href="#attachment/4/"+attachment_id+"/"+JSON.stringify(obj);
                    });
                    me.$(".submitData").click(function(_event){
                        _event.stopPropagation();
                        var $obj=$(event.target);
                        var needDelId=$obj.attr("data-id");
                        var attachment_id=$obj.attr("attachment_id");
                        PublicUTIL.message("confirm","提交资料后不能修改,可以点击修改按钮进入详情页提交,是否直接提交？",function(){
                            var JSONPARAM={id:needDelId,state:1 };
                            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.updateAttachmentState,JSON.stringify(JSONPARAM),function(data){
                                PublicUTIL.message("success","资料提交成功");
                               /* <a class='editSubmit greenBtnTxt' data-id='"+needDelId+"' attachment_id='"+attachment_id+"'>申请修改</a>*/
                                $obj.parent().html("<a class='checkData greenBtnTxt' data-id='"+needDelId+"' attachment_id='"+attachment_id+"'>查看</a>");
                            });
                        });
                    });
                }
            };
            var column;
            if(_this.model._opType=="3"){
                column={
                    text : "学校",
                    dataIndex : "school_name",
                };
            }else{
                column={
                    text : "状态",
                    render:function(value, row){//将类型转为文字
                        /*0保存；1 提交，2是审批通过，3为驳回*/
                        var state=row["state"]
                        var text="未提交";
                        if(state==-1){
                            text="已删除";
                        } else if(state==0){
                            text="未提交";
                        }else if(state==1){
                            text="审批中";
                        }else if(state==2){
                            text="审批通过";
                        }else{
                            text="审批未通过";
                        }
                        return text;
                    }
                };
            }
            options.columns.splice(3,0,column);
            this.dataTable = new DataTable(options);
            // 渲染至页面
            this.$("#dataTableWrapper").html(this.dataTable.$el);
        },
        selectFun:function(){
            this.dataTable.render();
        },
        getAttachment:function(){
            var paramjson={"use_role":"资料管理员"};
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getAttachmentJG, JSON.stringify(paramjson), function (_d) {
                        var jsondata = _d.resultdata;
                        //附件分组
                        var attachtypeadd=[];
                        //每个分组中的option串
                        var attachOptionS=[];
                        var optionStr="";
                        if (jsondata.length > 0) {
                            for(var i=0;i<jsondata.length;i++){
                                if($.inArray(jsondata[i].stand_type_name, attachtypeadd)<0){
                                    //分类不存在则加组,并加入数组中
                                    attachtypeadd.push(jsondata[i].stand_type_name);
                                    attachOptionS.push([]);
                                }
                                var index=$.inArray(jsondata[i].stand_type_name, attachtypeadd);
                                attachOptionS[index]=attachOptionS[index]+"<option value=\""+jsondata[i].attachment_id+"\" stand_id=\""+jsondata[i].stand_id+"\" score_type=\""+jsondata[i].score_type+"\" submit_num=\""+jsondata[i].submit_num+"\">"+jsondata[i].attachment_name+"</option>";
                            }
                            for(var j=0;j<attachtypeadd.length;j++){
                                optionStr+="<optgroup label=\""+attachtypeadd[j]+"\">"+attachOptionS[j]+"</optgroup>";
                            }
                            $("#fenlei").append("<option value=\"\">请选择资料分类</option>"+optionStr);
                            _form.render('select');
                        }
                });
        },
        importFun:function(){
            /*上传资料按钮事件,先判断是否选择了分类,然后判断此类别是否还有上传权限*/
            if($("#fenlei").val()==""){
                PublicUTIL.message('alert','请先选择资料分类!');
                return;
            }
            var obj={
                "type":_this.model._opType,
                "spk":""
            };
            /*判断是否还需要上传,有每年只能上传一次的*/
            var submit_num=$("#fenlei").find("option:selected").attr("submit_num");
            var attachmentid=$("#fenlei").val();
            /*目前是验证一次的,后期可以多少次都走验证,验证方法已写好*/
            if(submit_num=="1"){
               /*走验证,验证成功后跳转到文件上传页面*/
                var paramjson={"attachment_id":attachmentid,"school_id":PublicUTIL.UserObject.server_id};
                PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getAttachResultNums, JSON.stringify(paramjson), function (_d) {
                    var jsondata = _d.resultdata;
                    submit_num=parseInt(submit_num);
                    if(jsondata.length>0){
                        if(jsondata[0].num<submit_num){
                            location.href="#attachment/1/"+attachmentid+"/"+JSON.stringify(obj);
                        }else {
                            PublicUTIL.message('alert','此类资料每年只需要上传'+submit_num+'次,本年度已上传完毕,请进行修改或者上传其他类别资料!');
                            return;
                        }
                    }else{
                        location.href="#attachment/1/"+attachmentid+"/"+JSON.stringify(obj);
                    }

                });
            }else{
                /*直接走上传页面*/
               location.href="#attachment/1/"+attachmentid+"/"+JSON.stringify(obj);
            }

        },
        getSchoolList:function(){
            var JSONPARAM={
                school_types:"",
                organ_ids:""
            };
            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getSchoolList,JSON.stringify(JSONPARAM),function(data) {
                //渲染学校列表
                var schoolList = data.resultdata;
                var optionstr="";
                for (var i = 0; i < schoolList.length; i++) {
                    optionstr+="<option value=\""+schoolList[i].school_id+"\">"+schoolList[i].school_name+"</option>";
                }
                $("#school").html("<option value=\"\">请选择学校</option>"+optionstr);
                _form.render("select");
            });
        }
    });
});