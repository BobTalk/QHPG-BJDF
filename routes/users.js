var express = require('express');
var router = express.Router();

var userService = require('../service/userService');

/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.send('respond with a resource');
    res.render('updateUser');
});


// 增加用户
//TODO 同时支持get,post
router.get('/addUser', function (req, res, next) {
    userService.add(req, res, next);
});


router.get('/queryAll', function (req, res, next) {
    console.log('查询所有user');
    userService.queryAll(req, res, next);
});

router.get('/queryById', function (req, res, next) {
    userService.queryById(req, res, next);
});

router.get('/deleteUser', function (req, res, next) {
    userService.delete(req, res, next);
});

router.post('/updateUser', function (req, res, next) {
    userService.update(req, res, next);
});

module.exports = router;

