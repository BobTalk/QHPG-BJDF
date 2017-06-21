/**
 * Created by sanghuina on 17/5/9.
 * 举报模块
 */
var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $writelog = require('../../libs/logHelper');
var $sql = require('./tipoffSqlMapping');
var $mysqlUtil = require('../../util/mysqlUtil');
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, $conf.mysql));

module.exports = {
    //获取问卷列表
    getTipoffList: function (use_role, user_id,service_id,state,type, pagesize, pagenum, callback) {
        pool.getConnection(function (err, connection) {
            var sql = $sql.getTipoffList(use_role, user_id,service_id,state,type, pagesize, pagenum);
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
    },
    //获取问卷列表
    getTipoffListRows: function (use_role, user_id,service_id,state,type,callback) {
        pool.getConnection(function (err, connection) {
            var sql = $sql.getTipoffListRows(use_role, user_id,service_id,state,type);
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
    },
    addTipoff:function(tipoff_type,stand_id,iphone,tip_school_name,tip_time,user_id,user_name,school_id,school_name,tip_content,state,score,tipoff_type_name,callback){
        pool.getConnection(function (err, connection) {
            // 建立连接，向表中插入值
            // INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.addTipoff, [tipoff_type,stand_id,iphone,tip_school_name,tip_time,user_id,user_name,school_id,school_name,tip_content,state,score,tipoff_type_name], function (err, result) {
                // 返回结果给service
                callback(result);
                // 释放连接
                connection.release();
            });
        });
    },
    updateTipoff:function(tipoff_type,stand_id,iphone,tip_school_name,tip_time,user_id,user_name,school_id,school_name,tip_content,state,score,tipoff_type_name,tipoff_id,callback){
        pool.getConnection(function (err, connection) {
            // 建立连接，向表中插入值
            // INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.updateTipoff, [tipoff_type,stand_id,iphone,tip_school_name,tip_time,user_id,user_name,school_id,school_name,tip_content,state,score,tipoff_type_name,tipoff_id], function (err, result) {
                // 返回结果给service
                callback(result);
                // 释放连接
                connection.release();
            });
        });
    },
    deleteTipoff: function (id, callback) {
        // delete by Id
        pool.getConnection(function (err, connection) {
            connection.query($sql.deleteTipoff, id, function (err, result) {
                // 返回结果给service
                callback(result);
                // 释放连接
                connection.release();
            });
        });
    },
    getTipoffInfo: function (id, callback) {
        pool.getConnection(function (err, connection) {
            connection.query($sql.getTipoffInfo, id, function (err, result) {
                // 返回结果给service
                callback(err,result);
                // 释放连接
                connection.release();
            });
        });
    },
    /*修改举报数据的状态*/
    updatetipState:function(state,id, callback){
        $mysqlUtil.queryStrSql($sql.updatetipState,[state,id], callback);
    },
    /*举报数据审批通过*/
    examinetipoff:function(state,id,stand_id,school_id,school_name,score,score_source,callback){
        var sqls = [];
        sqls.push($sql.updatetipState);
        sqls.push($sql.insertScoreResult);
        $mysqlUtil.queryArrSql(sqls,[[state,id],[stand_id,school_id,school_name,score,score_source]],callback);
    }
};
