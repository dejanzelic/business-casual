var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('flag', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', { httpOnly: false, secure: false });
  res.send('done');

});

module.exports = router;
