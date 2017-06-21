/*
 2017年5月10日 09:34:03
 byx
 评估管理-量表模块的service层
 * */
var $util = require('../../util/util');

var scaleDao = require('../../dao/pgmanage_dao/scaleDao');

module.exports = {
    //获取问卷列表
    getScaleList: function (req, res, next) {
        scaleDao.getScaleList(function (err, result) {
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
