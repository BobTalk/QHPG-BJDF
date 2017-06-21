// dao/userService.js
// 实现业务处理，分离route和数据库
var $util = require('../util/util');

var userDao = require('../dao/userDao');

module.exports = {
    add: function (req, res, next) {
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        var parName = param.name;
        var parAge = param.age;

        //连接Dao层,操作数据库
        userDao.add(parName, parAge, function (result) {
            if (result.affectedRows > 0) {
                res.json({
                    code: $util.resConfig.ok,
                    msg: "增加用户成功",
                    data: {
                        //返回主键
                        pk: result.insertId
                    }
                });
            }
            else {
                res.json({
                    code: $util.resConfig.fail,
                    msg: "增加用户失败",
                    data: {}
                });
            }

        });

    },
    delete: function (req, res, next) {
        // delete by Id
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        var parId = param.id;

        //连接Dao层,操作数据库
        userDao.delete(parId, function (result) {
            if (result.affectedRows > 0) {
                res.json({
                    code: $util.resConfig.ok,
                    msg: "删除用户成功",
                    data: {}
                });
            }
            else {
                res.json({
                    code: $util.resConfig.fail,
                    msg: "删除用户失败",
                    data: {}
                });
            }

        });
    },
    update: function (req, res, next) {
        // update by id
        // 为了简单，要求同时传name和age两个参数
        var param = req.body;
        if (param.name == null || param.age == null || param.id == null) {
            res.json({
                code: $util.resConfig.fail,
                msg: "参数缺失",
                data: {}
            });
            return;
        }
        var parId = param.id;
        var parName = param.name;
        var parAge = param.age;

        //连接Dao层,操作数据库
        userDao.update(parId, parAge, parName, function (result) {
            if (result.affectedRows > 0) {
                res.json({
                    code: $util.resConfig.ok,
                    msg: "更新用户成功",
                    data: {}
                });
            }
            else {
                res.json({
                    code: $util.resConfig.fail,
                    msg: "更新用户失败",
                    data: {}
                });
            }

        });
    },
    queryById: function (req, res, next) {
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        var parId = param.id;
        //连接Dao层,操作数据库
        userDao.queryById(parId, function (result) {
            res.json({
                code: $util.resConfig.ok,
                msg: "获取用户成功",
                data: result
            });
        });
    },
    queryAll: function (req, res, next) {
        // 获取前台页面传过来的参数
        //连接Dao层,操作数据库
        userDao.queryAll(function (result) {
            res.json({
                code: $util.resConfig.ok,
                msg: "获取所有用户成功",
                data: result
            });
        });
    }

};
