var express = require('express');
var router = express.Router();
const puppeteer = require('puppeteer');

/* GET contact page. */
router.get('/', function(req, res, next) {

  res.render('contact', { title: 'Contact Us', description: 'Let us know if you need help!'});
});

router.post('/', function(req, res, next) {

	res.render('contact', { title: 'Contact Us', description: 'Thank you for your submission!'});
  
	(async () => {
	  const browser = await puppeteer.launch();
	  const page = await browser.newPage();
	  await page.goto('https://example.com');
	  await page.screenshot({path: 'example.png'});

	  browser.close();
	})();

});

module.exports = router;
