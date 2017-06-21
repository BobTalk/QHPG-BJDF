// ================================================================
//  author:wyx
//  createDate: 2017/5/2.
//  description: 清华评估-项目问卷列表demo
//  ===============================================================
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/demo/bulletedList.html'),
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
            var form = PublicUTIL.layForm;
            form.render();


            //显示与关闭为提交花名册
            $(".closeUp").toggle(
                function () {
                    $(this).parent().parent().parent().next("tbody").fadeIn(500);
                    $(this).html("收起");
                },
                function () {

                    $(this).parent().parent().parent().next("tbody").css("display", "none");
                    $(this).html("展开");
                });


        }

    });
});

