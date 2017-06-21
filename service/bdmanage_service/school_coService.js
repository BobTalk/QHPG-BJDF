/*
 2017年5月17日
 hyq
 用户同步模块的业务处理层
 * */
var $util = require('../../util/util');
var school_coDao = require('../../dao/bdmanage_dao/school_coDao');
module.exports = {
    //添加用户
    saveUserInfo: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            param.map(function (item) {
                if (item.school_id == "undefined") {
                    $util.resJSONError(error, res);
                    return;
                }
            });
        } catch (e) {
            $util.resJSONError(error, res);
            return;
        }
        school_coDao.saveInfo(param, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            $util.resJSON.resultnum = $util.resConfig.ok;
            $util.resJSON.resultdata = {affectedRows: result.affectedRows};
            res.json($util.resJSON);
        });
    },
    //删除用户
    removeUserInfo: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
        } catch (e) {
            $util.resJSONError(error, res);
            return;
        }
        school_coDao.removeInfo(param, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            $util.resJSON.resultnum = $util.resConfig.ok;
            $util.resJSON.resultdata = {affectedRows: result.affectedRows};
            res.json($util.resJSON);
        });
    },
    //修改用户
    updataUserInfo: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
        } catch (e) {
            $util.resJSONError(error, res);
            return;
        }
        school_coDao.updataInfo(param, function (err, result) {
            if (err != null) {
                $util.resJSONError(err, res);
                return;
            }
            $util.resJSON.resultnum = $util.resConfig.ok;
            $util.resJSON.resultdata = {affectedRows: result.length};
            res.json($util.resJSON);
        });
    }
};
