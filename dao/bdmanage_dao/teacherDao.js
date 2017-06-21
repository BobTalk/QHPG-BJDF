/*
 2017年5月17日
 hyq
 用户管理模块
 * */

var $sql = require('./teacherSqlMapping');
var $mysqlUtil = require('../../util/mysqlUtil');

module.exports = {
    /* 保存用户信息
     * hyq 2017年5月17日
     * params
     * @user_id
     * @user_name
     * @password
     * @true_name
     * @role_name
     * @server_id
     * @role_id
     * @sex
     *
     * return ;
     * */
    saveInfo: function (saveInfo, callback) {
        //saveInfo 是sqlMapping模块
        var sql = $sql.saveInfo(saveInfo);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    /* 删除信息
     * hyq 2017年5月17日
     * params
     * @user_id
     *
     * return ;
     * */
    removeInfo: function (removeId, callback) {
        var sql = $sql.removeInfo(removeId);
        $mysqlUtil.queryStrSql(sql, callback);
    },
    /* 修改
     * hyq 2017年5月17日
     * params
     * @user_id
     * @user_name
     * @password
     * @true_name
     * @role_name
     * @server_id
     * @role_id
     * @sex
     *
     * return ;
     * */
    updataInfo: function (updataInfo, callback) {
        var sql = $sql.updataInfo(updataInfo);
        $mysqlUtil.queryArrSql(sql, callback);
    }
};