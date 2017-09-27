var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');
var getUrls = require('get-urls')
var sanitize_url = require("sanitize-filename");
var crypto = require("crypto");
var svgCaptcha = require('svg-captcha');
var config = require('../config.json');
var request = require('request');
var session = require('express-session')
//TODO: remove before making public

request(
	{uri: 'http://169.254.169.254/latest/meta-data/public-hostname',
	 timeout: 1000}, function (error, response, body) {
	if(!error){
		config.domain = body
	}else{
		console.log("set to default domain")
	}
});



/* GET contact page. */
router.get('/', function(req, res, next) {
  var captcha = svgCaptcha.create();
  req.session.captcha = captcha.text;
  res.header('X-XSS-Protection' , 0 );	
  res.render('contact', { 
  	title: 'Contact Us', 
  	description: 'Let us know if you need help!', 
  	modal: false,
  	form: true,
  	flag: config.flags.contact.flag,
    captcha: captcha.data});
});

router.post('/', function(req, res, next) {
	var captcha = svgCaptcha.create();
	console.log(req.body.captcha);
	console.log(req.session.captcha);
	res.header('X-XSS-Protection' , 0 );

	if (req.body.captcha == req.session.captcha){
		urls = getUrls(req.body.url);
		console.log(urls.size)

		if (urls.size > 0){
			var link = req.body.url
			console.log(config.domain);
	  		var current_date = (new Date()).valueOf().toString();
			var random = Math.random().toString();
			filename = crypto.createHash('sha1').update(current_date + random).digest('hex');
			filename = "screenshots/" + filename + ".png";
			console.log("Filename for screenshot is:" + filename);

			(async () => {
			  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--disable-xss-auditor']});
			  const page = await browser.newPage();
			  await page.setCookie({name: config.flags.xss.name, value: config.flags.xss.flag, domain: config.domain, httpOnly: false, secure: false});
			  await page.setViewport({width: 1024, height: 768});
			  await page.goto(link);
			  await page.screenshot({path: filename});

			  browser.close();
			})();
		}
		res.render('contact', { 
			title: 'Contact Us', 
			description: 'Let us know if you need help!', 
			modal: true,
			modal_title: 'Thank you!',
			modal_body: 'We will get back to you as soon as possible',
			form: false,
			flag: config.flags.contact.flag});
	}else{
		res.render('contact', { 
			title: 'Contact Us', 
			description: 'Let us know if you need help!', 
			modal: true,
			modal_title: 'ERROR',
			modal_body: 'Please complete the Captcha!',
			form: true,
			flag: config.flags.contact.flag,
			captcha: captcha.data});
	}

});

module.exports = router;
