// ================================================================
//  author:wenxia
//  createDate: 2017/5/15.
//  description: 清华评估-项目列表
//  ===============================================================
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/project/projectList.html'),
        template = _.template(tpl), _this;
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
//            var form=PublicUTIL.layForm;
//            form.render();
            //加载datatable中数据
            this.initDataTableData();
        },
        events: {
            "click #selectProject":"selectProject",
            "click #addProject":"addProject"
        },
        selectProject:function(){
            this.dataTable.render();
        },
        addProject:function(){
            location.href="#projectDetail/1/0";
        },
        initDataTableData:function(){
            var me=this;
            var options = {
                // 数据来源方法
                data : {
                    // 异步数据源
                    sync : function(syncOptions, callback) {
                        //下面注释的是获取异步数据方法
                        var projectName=me.$("#projectName").val();
//                        var JSONPARAM={project_name:projectName,page_num: JSON.stringify(syncOptions.data.page), page_size: JSON.stringify(syncOptions.data.rows)};
                        var JSONPARAM={project_name:projectName,page_num: syncOptions.data.page, page_size: syncOptions.data.rows};

                        PublicAjax.ajaxGet(PublicAjax.ajaxUrl.getProjectList,JSON.stringify(JSONPARAM),function(data){
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
                        text : "项目名称",
                        dataIndex : "project_name"
                    },
                    {
                        text : "学校",
                        dataIndex : "school_num",
                        render:function(value, row){
                            return value+"所";
                        }
                    },
                    {
                        text : "问卷",
                        dataIndex : "questionnaire_num",
                        render:function(value, row){
                            return value+"套";
                        }
                    },
                    {
                        text : "任务",
                        dataIndex : "task_num",
                        render:function(value, row){
                            return value+"个";
                        }
                    },
                    {
                        text : "项目期限",
//                        dataIndex : "ZW",
                        render:function(value, row){//将类型转为文字
                            var startTime=row["start_time"];
                            var endTime=row["end_time"];
                            return startTime.substring(0,10)+"至"+endTime.substring(0,10);
                        }
                    },
                    {
                        text : "项目状态",//项目状态 - 0：保存;1：发布;2：已删除;
                        dataIndex : "state",
                        render:function(value, row){//将类型转为文字
                            return value==0?"未发布":"已发布";
                        }
                    },
                    {
                        text : "操作",//已发布：取消发布，查看；已发布：编辑，删除
                        dataIndex : "state",
                        render:function(value, row){
                            return value==0?'<a class="greenBtnTxt editData" style="margin-right: 10px;" data-id="'+row["project_id"]+'">[编辑]</a><a class="redBtnTxt deleteData" data-id="'+row["project_id"]+'">[删除]</a>':'<a class="redBtnTxt cancelPublic" style="margin-right: 10px;" data-id="'+row["project_id"]+'">[取消发布]</a><a class="greenBtnTxt checkProject" data-id="'+row["project_id"]+'">[查看]</a>'
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
                        var needDelId=$(event.target).attr("data-id");

                        PublicUTIL.message("confirm","确认删除该项目？",function(){
                            //项目状态 - 0：保存;1：发布;2：已删除;
                            var JSONPARAM={project_id:needDelId,state:2 };

                            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.setProjectState,JSON.stringify(JSONPARAM),function(data){
                                PublicUTIL.message("success","项目数据删除成功");
                                me.dataTable.render();
                            });
                        });
                    });
                    //为table中的编辑按钮添加事件：
                    me.$(".editData").click(function(_event){
                        _event.stopPropagation();
                        var needEditId=$(event.target).attr("data-id");

                        location.href="#projectDetail/2/"+ needEditId;
                    });
                    //为table中的取消发布按钮添加事件：
                    me.$(".cancelPublic").click(function(_event){
                        _event.stopPropagation();
                        var needEditId=$(event.target).attr("data-id");
                        PublicUTIL.message("confirm","确认取消发布该项目？",function(){
                            //项目状态 - 0：保存;1：发布;2：已删除;
                            var JSONPARAM={project_id:needEditId,state:0 };

                            PublicAjax.ajaxGet(PublicAjax.ajaxUrl.setProjectState,JSON.stringify(JSONPARAM),function(data){
                                PublicUTIL.message("success","项目取消发布成功");
                                me.dataTable.render();
                            });
                        });
                    });
                    //为table中的查看按钮添加事件：
                    me.$(".checkProject").click(function(_event){
                        _event.stopPropagation();
                        var needEditId=$(event.target).attr("data-id");

                        location.href="#projectDetail/3/"+ needEditId;
                    });
                }
            };
            this.dataTable = new DataTable(options);
            // 渲染至页面
            this.$("#dataTableWrapper").html(this.dataTable.$el);
        }
    });
});

