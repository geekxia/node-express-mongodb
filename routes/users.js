var express = require('express');
var router = express.Router();
var model = require('../model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 注册接口
router.post('/regist', function(req, res, next) {
  var data = {
    username: req.body.username,
    password: req.body.password,
    password2: req.body.password2
  }
  // 执行用户注册信息的存储
  model.connect(function(db) {
    db.collection('users').insertOne(data)
    res.redirect('/login')
  })
})

// 登录接口
router.post('/login', function(req, res, next) {
  var data = {
    username: req.body.username,
    password: req.body.password
  }
  // res.send(data)
  model.connect(function(db) {
    db.collection('users').find(data).toArray(function(err, docs) {
      console.log('查询结果', docs)
      if (docs.length > 0) {
        // session写入
        req.session.username = data.username
        // 登录成功，跳转至首页
        res.redirect('/')
      } else {
        res.redirect('/login')
      }
    })
  })
})

module.exports = router;
