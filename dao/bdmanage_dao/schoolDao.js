/*
 2017年5月4日 16:40:50
 byx
 基础数据-学校模块的dao层
 * */

var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $writelog = require('../../libs/logHelper');
var $sql = require('./schoolSqlMapping');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

module.exports = {
    //获取学校列表
    getSchoolList: function (school_types, organ_ids, callback) {
        pool.getConnection(function (err, connection) {
            var sql = $sql.getSchoolList(school_types, organ_ids);
            connection.query(sql, function (err, result) {
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
