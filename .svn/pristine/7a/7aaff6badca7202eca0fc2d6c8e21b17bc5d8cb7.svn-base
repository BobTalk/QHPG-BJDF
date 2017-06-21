// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var $conf = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');

// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

module.exports = {
    add: function (name, age, callback) {
        pool.getConnection(function (err, connection) {
            // 建立连接，向表中插入值
            // INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.insert, [name, age], function (err, result) {
                // 返回结果给service
                callback(result);
                // 释放连接
                connection.release();
            });
        });
    },
    delete: function (id, callback) {
        // delete by Id
        pool.getConnection(function (err, connection) {
            connection.query($sql.delete, id, function (err, result) {
                // 返回结果给service
                callback(result);
                // 释放连接
                connection.release();
            });
        });
    },
    update: function (id, age, name, callback) {
        // update by id
        // 为了简单，要求同时传name和age两个参数
        pool.getConnection(function (err, connection) {
            connection.query($sql.update, [name, age, id], function (err, result) {
                // 返回结果给service
                callback(result);
                // 释放连接
                connection.release();
            });
        });

    },
    queryById: function (id, callback) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryById, id, function (err, result) {
                // 返回结果给service
                callback(result);
                // 释放连接
                connection.release();
            });
        });
    },
    queryAll: function (callback) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.queryAll, function (err, result) {
                // 返回结果给service
                callback(result);
                // 释放连接
                connection.release();
            });
        });
    }

};
