var page = require('webpage').create();

var pageHeight = 1024;
var pageWidth = 768;

/* Set size of browser window */
page.viewportSize = { width: pageWidth, height: pageHeight };
page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };

/* Open page and render content */
page.open('http://eu-b.demo.qlik.com/QvAJAXZfc/opendoc.htm?document=qvdocs%2FItalian%20Schools%20Navigator.qvw&host=demo11&anonymous=true', function() {
	window.setTimeout(function () {
		page.render('screenshot.png');
        phantom.exit();
	}, 40000);
});