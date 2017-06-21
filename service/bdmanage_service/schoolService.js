/*
 2017年5月4日 16:35:56
 byx
 基础数据-学校模块的service层
 * */
var $util = require('../../util/util');

var schoolDao = require('../../dao/bdmanage_dao/schoolDao');

module.exports = {
    //获取学校列表
    getSchoolList: function (req, res, next) {
        try {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            param = JSON.parse(param.JSONPARAM);
            var school_types = param.school_types;//使用学校类型集合
            school_types = school_types.length == 0 ? "-1" : $util.strArrayToString(school_types);
            var organ_ids = param.organ_ids;//所属教管中心集合
            organ_ids = organ_ids.length == 0 ? "-1" : $util.strArrayToString(organ_ids);

        }
        catch (error) {
            $util.resJSONError(error, res);
            return;
        }
        schoolDao.getSchoolList(school_types, organ_ids, function (err, result) {
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
