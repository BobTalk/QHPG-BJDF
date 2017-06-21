/*
 2017年4月15日 16:49:31
 byx
 基础数据的service层
 * */

var $util = require('../util/util');

var baseDataDao = require('../dao/pgmanage_dao/questionnaireDao');

module.exports = {
    UserLogin: function (req, res, next) {
        // 获取前台页面传过来的参数
        var param = req.query || req.params;
        var jsonparam = JSON.parse(param.JSONPARAM);
        var username = jsonparam.username;
        var userpwd = jsonparam.userpwd;

        //定义返回的对象
        var resultObj = {
            userId: "",
            userName: "",
            userRole: "",
            userSex: "",
            userGradeName: "",// 学生、家长独有
            userGradeId: "",// 学生、家长独有
            userClassName: "",// 学生、家长独有
            userClassId: "",// 学生、家长独有
            userTeachClassId: "",// 班主任独有
            userSchoolId: "",
            userSchoolName: "",
            userChildId: "",// 家长独有
            userChildName: ""// 家长独有
        };

        //1.获取用户基本信息
        questionnaireDao.userLogin(username, userpwd, function (result) {
            try {
                if (result.length <= 0) {
                    $util.resJSON.result = $util.resConfig.fail;
                    $util.resJSON.resultdata = {};
                    res.json($util.resJSON);
                    return;
                }
                var userinfo = result;
                resultObj.userId = userinfo[0].userId;
                resultObj.userName = userinfo[0].truename;
                resultObj.userRole = userinfo[0].roleTag;
                resultObj.userSex = userinfo[0].sex;
                resultObj.userSchoolId = userinfo[0].serverId;

                // 2.根据用户类型获取对应的其它信息
                var roleUserInfo = {};
                switch (resultObj.userRole) {
                    case "学生":
                        break;
                    case "家长":
                        break;
                    case "教师":
                    case "教育局人员":
                        break;
                    case "班主任":
                        break;
                    case "校长":
                        break;
                    case "专家":
                    case "普通管理员":
                    default:
                        break;
                }
            }
            catch (error) {
                res.json(error.message);
            }
        });

    }

};
