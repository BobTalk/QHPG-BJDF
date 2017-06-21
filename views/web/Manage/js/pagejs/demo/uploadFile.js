// ================================================================
//  author:wyx
//  createDate: 2017/5/2.
//  description: 清华评估-文件上传
//  ===============================================================
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/demo/uploadFile.html'),
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
            var form=PublicUTIL.layForm;
            form.render();
            var element=PublicUTIL.layElement;
            element.init();

            layui.use(['form'], function(){
            });
            //初始化页面弹层及事件
            this.initModal();
        },
        events: {
            "click #uploadFile":"uploadFile"
            ,"click #previewDownloadBtn":"previewDownloadView"
        },
        initModal:function(){
            //将弹层节点移动到body节点下；
            var modal=$('#modal');
            $('#modal').remove();
            $(document.body).append(modal);

            //将弹层节点移动到body节点下；
            var previewDownload=$('#previewDownload');
            $('#previewDownload').remove();
            $(document.body).append(previewDownload);

            //引入弹层需要的layui模块
            layui.use(['form','upload' ], function(){
                layui.upload({
                    url: '' ,//上传接口
                    success: function(res){
                        //上传成功后的回调
                        console.log(res)
                    }
                });
            });
            //弹层上的事件
        },
        test:function(){
            console.log("llalls");
        },
        uploadFile:function(){
            //弹层设置问卷
            layer.open({
                type:1,
                title:'教育方针文化社团'
//                content:$("#modal")//,//使用页面元素作为内容时，弹层无法关闭
                ,content: $('#modal'),// $('#modal').html(),//tplArr.join(""),//$('#modal'),////'页面内容字符串',
                zIndex:19891018,
                //自定义弹出层样式及按钮
                skin:'data-titleFile',//'layui-layer-molv',//layui-layer-lan layui-layer-molv
                area: ['800px', '500px'],
                offset:'100px'//['100px','50px'],//位置偏移量坐标
                ,btn: ['保存','提交','返回']//['按钮一', '按钮二', '按钮三']
                ,yes: function(index, layero){//确定按钮回调方法，默认不关闭？！
                    //获取弹层中表单数据

                }
                ,btnAlign: 'c'
                ,closeBtn:2//关闭按钮的风格
                ,shade: [0.8, '#393D49']//0
                ,shadeClose:true//是否点击遮罩关闭
                ,maxmin:false
                ,resize:false
                ,scrollbar:false//屏蔽浏览器滚动条
                ,move: false
                ,success: function(layero, index){
//                    var form = layui.form();
//                    form.render(); //更新全部
//                    console.log(layero, index);
                }
                ,end:function(){
                    //层销毁之后触发的回调，确定或者关闭都会执行
                }
            });
        },
        previewDownloadView:function(){
            //弹层设置问卷
            layer.open({
                type:1,
                title:'教育方针文化社团'
//                content:$("#modal")//,//使用页面元素作为内容时，弹层无法关闭
                ,content: $('#previewDownload'),// $('#modal').html(),//tplArr.join(""),//$('#modal'),////'页面内容字符串',
                zIndex:19891018,
                //自定义弹出层样式及按钮
                skin:'data-titleFile',//'layui-layer-molv',//layui-layer-lan layui-layer-molv
                area: ['800px', '500px'],
                offset:'100px'//['100px','50px'],//位置偏移量坐标
                ,btn: ['保存','提交','返回']//['按钮一', '按钮二', '按钮三']
                ,yes: function(index, layero){//确定按钮回调方法，默认不关闭？！
                    //获取弹层中表单数据

                }
                ,btnAlign: 'c'
                ,closeBtn:2//关闭按钮的风格
                ,shade: [0.8, '#393D49']//0
                ,shadeClose:true//是否点击遮罩关闭
                ,maxmin:false
                ,resize:false
                ,scrollbar:false//屏蔽浏览器滚动条
                ,move: false
                ,success: function(layero, index){
//                    var form = layui.form();
//                    form.render(); //更新全部
//                    console.log(layero, index);
                }
                ,end:function(){
                    //层销毁之后触发的回调，确定或者关闭都会执行
                }
            });
        }
    });
});

