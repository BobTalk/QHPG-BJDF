var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

//声明页面路由
var routes = require('./routes/index');
//声明接口路由
var questionnaireRoute = require('./routes/pgmanage_route/questionnaireRoute');//评估管理-问卷模块路由
var scheduleRoute = require('./routes/pgmanage_route/scheduleRoute');//项目进度路由
var tipoffRoute=require('./routes/client_route/tipoffRoute');//客户端-举报模块路由 by shn
var schoolRoute=require('./routes/bdmanage_route/schoolRoute');//基础数据-学校模块路由 by byx
var organRoute=require('./routes/bdmanage_route/organRoute');//基础数据-学校模块路由 by byx
var scaleRoute = require('./routes/pgmanage_route/scaleRoute');//评估管理-量表模块路由 by byx
var attachmentRoute = require('./routes/pgmanage_route/attachmentRoute');//评估管理-附件模块路由 by byx
var projectRoute = require('./routes/pgmanage_route/projectRoute');//评估管理-项目管理模块路由 by byx
var questionnaireRoute_Clint=require('./routes/client_route/questionnaireRoute');//客户端-问卷填报报模块路由 by shn
var userRoute=require('./routes/bdmanage_route/userRoute');//客户端-用户模块路由 by hyq
var teacherRoute=require('./routes/bdmanage_route/teacherRoute');//客户端-教师模块路由 by hyq
var studentRoute=require('./routes/bdmanage_route/studentRoute');//客户端-学生模块路由 by hyq
var studentClassRoute=require('./routes/bdmanage_route/studentClassRoute');//客户端-学生班级模块路由 by hyq
var school_coRoute=require('./routes/bdmanage_route/school_coRoute');//客户端-学校模块路由 by hyq
var parentRoute=require('./routes/bdmanage_route/parentRoute');//客户端-家长模块路由 by hyq
var organ_coRoute=require('./routes/bdmanage_route/organ_coRoute');//客户端-机构模块路由 by hyq
var gradeRoute=require('./routes/bdmanage_route/gradeRoute');//客户端-机构模块路由 by hyq
var classRoute=require('./routes/bdmanage_route/classRoute');//客户端-班级模块路由 by hyq
var app = express();

// 关于首页的设置
app.use(express.static(path.join(__dirname, 'views')));

//定义页面路由访问名称
app.use('/', routes);

//设置跨域访问接口，放到页面声明之后
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
//定义接口路由访问名称
app.use('/QHPG-BJDF1/pgmanage/questionnaireController', questionnaireRoute); // 问卷列表自定义cgi路径
app.use('/QHPG-BJDF1/pgmanage/scheduleController', scheduleRoute); // 问卷列表自定义cgi路径 by hyq
app.use('/QHPG-BJDF1/client/tipoffController', tipoffRoute); // 举报模块自定义cgi路径 by shn
app.use('/QHPG-BJDF1/bdmanage/baseDataController', schoolRoute); // 基础数据-学校模块自定义cgi路径 by byx
app.use('/QHPG-BJDF1/bdmanage/baseDataController', organRoute); // 基础数据-学校模块自定义cgi路径 by byx
app.use('/QHPG-BJDF1/pgmanage/scaleController', scaleRoute); // 评估管理-量表模块自定义cgi路径 by byx
app.use('/QHPG-BJDF1/pgmanage/attachmentController', attachmentRoute); // 评估管理-附件模块自定义cgi路径 by byx
app.use('/QHPG-BJDF1/pgmanage/projectController', projectRoute); // 评估管理-项目管理模块自定义cgi路径 by byx
app.use('/QHPG-BJDF1/client/questionnaireController', questionnaireRoute_Clint); // 评估管理-项目管理模块自定义cgi路径 by byx
app.use('/QHPG-BJDF1/bdmanage/bdUserController', userRoute); // 客户端-用户模块自定义路径 by hyq
app.use('/QHPG-BJDF1/bdmanage/bdTeacherController', teacherRoute); // 客户端-教师模块自定义路径 by hyq
app.use('/QHPG-BJDF1/bdmanage/bdStudentController', studentRoute); // 客户端-学生模块自定义路径 by hyq
app.use('/QHPG-BJDF1/bdmanage/bdStudentClassController', studentClassRoute); // 客户端-学生班级模块自定义路径 by hyq
app.use('/QHPG-BJDF1/bdmanage/bdSchoolController', school_coRoute); // 客户端-学校模块自定义路径 by hyq
app.use('/QHPG-BJDF1/bdmanage/bdParentController', parentRoute); // 客户端-家长模块自定义路径 by hyq
app.use('/QHPG-BJDF1/bdmanage/bdOrganController', organ_coRoute); // 客户端-机构模块自定义路径 by hyq
app.use('/QHPG-BJDF1/bdmanage/bdGradeController', gradeRoute); // 客户端-年级模块自定义路径 by hyq
app.use('/QHPG-BJDF1/bdmanage/bdClassController', classRoute); // 客户端-年级模块自定义路径 by hyq

module.exports = app;
