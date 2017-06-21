/*
 2017年4月15日 16:49:31
 byx
 基础数据的dao层
 * */

var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./scheduleSqlMapping');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

module.exports = {
    getSchedule: function (callback) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.getSchedule, function (err, result) {
                // 返回结果给service
                callback(result);
                // 释放连接
                connection.release();
            });
        });
    }
};
