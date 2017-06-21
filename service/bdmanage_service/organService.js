/*
 2017年5月10日 09:00:33
 byx
 基础数据-机构模块的service层
 * */
var $util = require('../../util/util');

var organDao = require('../../dao/bdmanage_dao/organDao');

module.exports = {
    //获取机构列表
    getOrganList: function (req, res, next) {
        organDao.getOrganList(function (err, result) {
            try {
                if (err != null) {
                    $util.resJSONError(err, res);
                    return;
                }
                $util.resJSON.resultnum = $util.resConfig.ok;
                $util.resJSON.resultdata = result;
                res.json($util.resJSON);
            }
            catch (error) {
                $util.resJSONError(error, res);
            }
        });
    }

};
