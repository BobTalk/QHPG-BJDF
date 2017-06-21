/*
 2017年5月17日
 hyq
 用户管理模块
 * */

var $sql = require('./studentSqlMapping');
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
    /* 删除用户信息
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
    /* 修改用户信息
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
    updataInfo: function (userInfo, callback) {
        var sql = $sql.updataInfo(userInfo);
        $mysqlUtil.queryArrSql(sql, callback);
    }
};