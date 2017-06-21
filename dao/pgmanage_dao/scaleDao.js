/*
 2017年5月10日 09:35:23
 byx
 评估管理-量表模块的dao层
 * */

var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $writelog = require('../../libs/logHelper');
var $sql = require('./scaleSqlMapping');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

module.exports = {
    //获取量表列表
    getScaleList: function (callback) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.getScaleList, function (err, result) {
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
