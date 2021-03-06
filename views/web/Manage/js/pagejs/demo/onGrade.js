// ================================================================
//  author:wyx
//  createDate: 2017/5/2.
//  description: 清华评估-问卷
//  ===============================================================
define(function (require) {
    "use strict";
    var tpl = require('text!tpl/demo/onGrade.html'),
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

        }

    });
});

