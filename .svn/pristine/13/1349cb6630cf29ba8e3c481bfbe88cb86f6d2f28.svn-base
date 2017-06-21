// ================================================================
//  author:wenxia
//  createDate: 2017/5/4.
//  description: 清华评估-附件上传
//  ===============================================================
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/demo/fileUpload.html'),
        template = _.template(tpl), _this;
    var myossupload = require('myossupload');
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
            PublicUTIL.layElement.init();
            PublicUTIL.layForm.render();

            //文件上传需要的对象--多个对象
            var uploadoption2={
                "choosebtn":"selectfiles2",// 选择文件按钮id
                "uploadbtn":"postfiles2",//确定上传按钮id
                "container":"container12",//选择和确实上传按钮的父节点id
                "ossfile":"ossfile2",//图片存放位置区域id
                "g_dirname":"ceshi/",//如果不填，默认是上传到根目录, 注意目录要带/结尾
                "g_object_name_type":"local_name",//local_name:上传文件名字保持本地文件名字,random_name:上传文件名字是随机文件名
                "type":"file",//head头像模式显示为头像,img图片格式可以是多个图片是个图片列表,file文件格式一个个文件列表带进度条显示
                "multiple":true//是否多个文件上传
            };
            var uploader2=myossupload.createUploader(uploadoption2);
            uploader2.init();

            //单个对象
            var uploadoptionS={
                "choosebtn":"selectfilesS",// 选择文件按钮id
//                "uploadbtn":"",//确定上传按钮id
                "container":"containerS",//选择和确实上传按钮的父节点id
                "ossfile":"ossfileS",//图片存放位置区域id
                "g_dirname":"ceshi/",//如果不填，默认是上传到根目录, 注意目录要带/结尾
                "g_object_name_type":"local_name",//local_name:上传文件名字保持本地文件名字,random_name:上传文件名字是随机文件名
                "type":"file",//head头像模式显示为头像,img图片格式可以是多个图片是个图片列表,file文件格式一个个文件列表带进度条显示
                "multiple":false//是否多个文件上传
            };
            var uploaderS=myossupload.createUploader(uploadoptionS);
            uploaderS.init();

        },
        events: {

        }
    });
});

