/**
 * Created by sanghuina on 17/5/17.
 *举报审批列表
 */
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/tipoff/tipoffExamineList.html'),
        template = _.template(tpl), _this,_form,_listType;
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
            /*1公示信息,2为教育局的审批列表,3是个人举报列表*/
            _listType=_this.model._opType;
            /*举报列表,搜索条件有学校*/
            if(_listType=="3"){
                $("#schoolsearch").hide();
                $("#addtipoff").show();
            }else{
                $("#schoolsearch").show();
                $("#addtipoff").hide();
                _this.getSchoolList();
            }
            /* 加载举报列表数据*/
            _this.initDataTableData();
            /*加载datatable中数据*/
            _form=PublicUTIL.layForm;
            _form.render();
        },
        events: {
            "click #select":"selectFun",
            "click #addtipoff":"addtipoffFun"
        },
        initDataTableData:function(){
            var me=this;
            var options = {
                // 数据来源方法
                data : {
                    // 异步数据源
                    sync : function(syncOptions, callback) {
                        //下面注释的是获取异步数据方法
                        var state="";
                        var userid="";
                        var use_role="";
                        if(_listType=="1"){
                            /*公示列表信息.取状态值为1的数据*/
                            state=1;
                            use_role="教育局人员";
                        }else if(_listType=="2"){
                            /*2为教育局的审批列表*/
                            use_role="教育局人员";
                        }else{
                            /*3是个人举报列表*/
                            userid=PublicUTIL.UserObject.user_id;
                            use_role="";
                        }
                        var  school=$("#school").val();
                        var JSONPARAM={tip_state:state,use_role:use_role,service_id:school,user_id:userid,tip_type:$("#tipoff_type").val(),page_num: syncOptions.data.page, page_size: syncOptions.data.rows};
                        PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getTipoffList,JSON.stringify(JSONPARAM),function(data){
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
                        text : "举报分类",
                        dataIndex : "tipoff_type_name"
                    },
                    {
                        text : "举报学校",
                        dataIndex:"school_name"
                    },
                    {
                        text : "举报时间",
                        render:function(value, row){//将类型转为文字
                            return row["create_time"].substring(0,10);
                        }
                    },
                    {
                        text : "举报描述",
                        dataIndex:"tip_content"
                    },
                    {
                     text : "状态",
                     dataIndex : "state",
                     render:function(value, row){//将类型转为文字
                         /*0保存；1 提交，2是审批通过，3为驳回*/
                         var state=row["state"];
                             var text="未审批";
                             if(state==0){
                                text="未审批";
                             }else if(state==1){
                                text="审批通过";
                             }else if(state==2){
                                text="驳回";
                             }
                             return text;
                         }
                     },
                    {
                        text : "操作",
                        render:function(value, row){
                            /*0保存(审批,查看)；1 审批已通过(查看)，2为驳回(修改,删除,查看)*/
                            var state=row["state"];
                            if(state==0||state==2){
                                if(_listType=="3"){
                                    return "<a class='editData greenBtnTxt' data-id='"+row["tipoff_id"]+"'>修改</a><a class='checkData greenBtnTxt' data-id='"+row["tipoff_id"]+"'>查看</a><a class='deleteData redBtnTxt' data-id='"+row["tipoff_id"]+"'>删除</a>";
                                }else{
                                    if(state==2){
                                        return "<a class='checkData greenBtnTxt' data-id='"+row["tipoff_id"]+"'>查看</a>";
                                    }else{
                                        return "<a class='examineData greenBtnTxt' data-id='"+row["tipoff_id"]+"'>审批</a><a class='checkData greenBtnTxt' data-id='"+row["tipoff_id"]+"'>查看</a>";
                                    }
                                  }
                            }else{
                                return "<a class='checkData greenBtnTxt' data-id='"+row["tipoff_id"]+"'>查看</a>";
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
                        PublicUTIL.message("confirm","确认删除该条数据？",function(){
                            var JSONPARAM={tipoff_id:needDelId};
                            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.deleteTipoff,JSON.stringify(JSONPARAM),function(data){
                                PublicUTIL.message("success","数据删除成功");
                                $obj.parents("tr").remove();
                            });
                        });
                    });
                    //为table中的修改按钮添加事件：
                    me.$(".editData").click(function(_event){
                        _event.stopPropagation();
                        var needEditId=$(event.target).attr("data-id");
                        location.href="#tipoffInfo/2/"+needEditId+"/"+_this.model._opType;
                    });
                    //为table中的查看按钮添加事件：
                    me.$(".checkData").click(function(_event){
                        _event.stopPropagation();
                        var needEditId=$(event.target).attr("data-id");
                        location.href="#tipoffInfo/3/"+needEditId+"/"+_this.model._opType;
                    });
                    //为table中的审批按钮添加事件：
                    me.$(".examineData").click(function(_event){
                        _event.stopPropagation();
                        var needEditId=$(event.target).attr("data-id");
                        location.href="#tipoffInfo/4/"+needEditId+"/"+_this.model._opType;
                    });
                }
            };
            this.dataTable = new DataTable(options);
            // 渲染至页面
            this.$("#dataTableWrapper").html(this.dataTable.$el);
        },
        selectFun:function(){
            this.dataTable.render();
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
        },
        addtipoffFun:function(){
            location.href="#tipoffInfo/1/-1/"+_this.model._opType;
        }
    });
});