/*
 2017年4月26日 09:00:47
 byx
 进度的service层
 * */

var $util = require('../util/util');

var scheduleDao = require('../dao/scheduleDao');

module.exports = {
    getSchedule: function (req, res, next) {
        // 获取前台页面传过来的参数

        //定义返回的对象
        var resultObj = {
            schoolName: "",
            roleTag: "",
            userCount: "",
            subUserCount: "",
            schoolId: ""
        };

        //1.获取用户基本信息
        scheduleDao.getSchedule(function (result) {
            try {
                if (result.length <= 0) {

                    res.json($util.resJSON);
                    return;
                }
                var scheduleList = result;
                $util.resJSON.result = $util.resConfig.ok;
                $util.resJSON.resultdata = scheduleList;
                res.json($util.resJSON);

            }
            catch (error) {
                res.json(error.message);
            }
        });

    }

};
