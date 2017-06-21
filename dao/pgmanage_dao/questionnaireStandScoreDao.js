/*
 2017年5月23日 16:40:50
 byx
 评估管理-问卷指标分数模块的dao层
 * */

var $mysqlUtil = require('../../util/mysqlUtil');
var $sql = require('./questionnaireStandScoreSqlMapping');


module.exports = {
    //获取所有学校所有指标的问卷答题平均分
    getQuestionnaireStandAvgScore: function (callback) {
        var sql = $sql.getQuestionnaireStandAvgScore;
        $mysqlUtil.queryStrSql(sql, callback);
    }
};
