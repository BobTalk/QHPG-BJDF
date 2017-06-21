/*
 2017年5月10日 09:02:08
 byx
 基础数据-机构的dao层
 * */

var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $writelog = require('../../libs/logHelper');
var $sql = require('./organSqlMapping');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

module.exports = {
    //获取机构列表
    getOrganList: function (callback) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.getOrganList, function (err, result) {
                if (err != null) {
                    $writelog.helper.writeErr("执行sql发生错误：" + sql + "/n 错误信息：" + err.stack);
                    callback(err, result);
                    return;
                }
                // 返回结果给service
                callback(err, result);
                // 释放连接
                connection.release();
            });
        });
    }
};
