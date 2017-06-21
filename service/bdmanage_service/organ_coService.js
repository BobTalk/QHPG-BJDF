/*
 2017年5月18日
 hyq
 用户同步模块的业务处理层
 * */
var $util = require('../../util/util');
var organ_coDao = require('../../dao/bdmanage_dao/organ_coDao');
module.exports = {
    //添加用户
    saveUserInfo: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            param.map(function (item) {
                typeof item.is_root == "number" ? item.is_root.toString() : item.is_root;
                typeof item.has_child == "number" ? item.has_child.toString() : item.has_child;
                if (item.organ_id == "undefined") {
                    $util.resJSONError(error, res);
                    return;
                }
            });
        } catch (e) {
            $util.resJSONError(error, res);
            return;
        }
        organ_coDao.saveInfo(param, function (err, result) {
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
        organ_coDao.removeInfo(param, function (err, result) {
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
            param.map(function (item) {
                typeof item.is_root == "number" ? item.is_root.toString() : item.is_root;
                typeof item.has_child == "number" ? item.has_child.toString() : item.has_child;
            })

        } catch (e) {
            $util.resJSONError(error, res);
            return;
        }
        organ_coDao.updataInfo(param, function (err, result) {
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
